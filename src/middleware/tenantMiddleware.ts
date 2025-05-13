
import { createServerClient } from '@supabase/ssr';
import { sanitizeInput } from '@/utils/sanitize';
import { supabase } from '@/integrations/supabase/client';
import { generateCSP } from '@/utils/securityHeaders';
import { v4 as uuidv4 } from 'uuid';

/**
 * Define os cabeçalhos de segurança avançados
 */
function getSecurityHeaders(nonce?: string) {
  // Gerar CSP com nonce para scripts
  const cspHeader = generateCSP({
    nonce,
    strictDynamic: true,
    reportOnly: false,
    reportUri: '/api/csp-violations'
  });
  
  return {
    // Content-Security-Policy melhorada
    'Content-Security-Policy': cspHeader,
    
    // Cabeçalhos de segurança básicos
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Referrer-Policy': 'same-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
    
    // Proteção contra CSRF
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };
}

/**
 * Define os cabeçalhos de cache granular com base no tipo de rota
 */
function getCacheHeaders(routePath: string) {
  // URLs públicas que podem ser cacheadas por mais tempo (ex: recursos estáticos)
  const staticRoutes = ['/assets/', '/images/', '/fonts/', '/favicon'];
  
  // URLs que nunca devem ser cacheadas (ex: dados sensíveis)
  const noCacheRoutes = ['/api/', '/dashboard', '/admin', '/settings'];
  
  // Verificar se a rota corresponde a algum padrão estático
  if (staticRoutes.some(route => routePath.includes(route))) {
    return {
      'Cache-Control': 'public, max-age=31536000, immutable' // 1 ano
    };
  }
  
  // Verificar se a rota corresponde a algum padrão que não deve ser cacheado
  if (noCacheRoutes.some(route => routePath.includes(route))) {
    return {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
  }
  
  // Cabeçalho padrão para outras rotas
  return {
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' // 1 minuto, permitindo revalidação em segundo plano por 5 minutos
  };
}

/**
 * Função para verificar se o usuário tem acesso ao tenant
 * Usa SECURITY DEFINER para evitar problemas de recursão na política RLS
 */
async function hasAccessToTenant(userId: string, tenantId: string): Promise<boolean> {
  try {
    // Uso do RPC com função SECURITY DEFINER para evitar problemas de recursão RLS
    const { data, error } = await supabase.rpc('usuario_tem_acesso_ao_negocio', {
      id_negocio_verificar: tenantId
    });
    
    if (error || data === null) {
      console.error('Erro ao verificar acesso ao tenant:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Erro ao verificar acesso ao tenant:', error);
    return false;
  }
}

/**
 * Função para aplicar o middleware de tenant para proteção de rotas
 */
export async function tenantMiddleware(request: Request) {
  try {
    // Gerar nonce para uso no CSP
    const nonce = uuidv4();
    
    // Aplicar cabeçalhos de segurança com nonce
    const headers = new Headers();
    const securityHeaders = getSecurityHeaders(nonce);
    Object.entries(securityHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
    // Obter a URL atual
    const url = new URL(request.url);
    
    // Aplicar cabeçalhos de cache baseados na rota
    const cacheHeaders = getCacheHeaders(url.pathname);
    Object.entries(cacheHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
    // Criar cliente do Supabase para o servidor
    const cookies = parseCookies(request.headers.get('cookie') || '');
    
    // Verificar a sessão atual do usuário
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Se não houver sessão e a rota requer autenticação, redirecionar para a página de login
      if (!isPublicRoute(url.pathname)) {
        console.log('Usuário não autenticado, redirecionando para login');
        return new Response(null, {
          status: 302,
          headers: {
            ...Object.fromEntries(headers),
            Location: `/login?redirectTo=${encodeURIComponent(url.pathname)}`
          }
        });
      }
      
      // Para rotas públicas, continuar sem verificação de tenant
      return new Response(null, {
        status: 200,
        headers
      });
    }
    
    // Obter o ID do tenant da URL (assumindo que está no formato /[tenantId]/...)
    const pathParts = url.pathname.split('/');
    let tenantId = pathParts[1];
    
    // Sanitizar o tenantId para prevenir injeção
    if (tenantId) {
      tenantId = sanitizeInput(tenantId);
    }
    
    // Se não houver tenant na URL, verificar se há um tenant salvo nos cookies
    if (!tenantId) {
      const savedTenantId = cookies['currentTenantId'];
      
      if (!savedTenantId) {
        // Se não houver tenant salvo, redirecionar para a página de seleção de tenant
        return new Response(null, {
          status: 302,
          headers: {
            ...Object.fromEntries(headers),
            Location: '/select-tenant'
          }
        });
      }
      
      // Verificar se o usuário tem acesso ao tenant salvo
      const hasAccess = await hasAccessToTenant(session.user.id, savedTenantId);
      
      if (!hasAccess) {
        // Se não tiver acesso, redirecionar para a página de seleção de tenant
        return new Response(null, {
          status: 302,
          headers: {
            ...Object.fromEntries(headers),
            Location: '/select-tenant'
          }
        });
      }
      
      // Se tiver acesso, definir o tenant no contexto e continuar
      await supabase.rpc('set_tenant_context', { tenant_id: savedTenantId });
      
      // Continuar com os cabeçalhos de segurança aplicados
      return new Response(null, {
        status: 200,
        headers
      });
    }
    
    // Verificar se o usuário tem acesso ao tenant da URL
    const hasAccess = await hasAccessToTenant(session.user.id, tenantId);
    
    if (!hasAccess) {
      // Se não tiver acesso, redirecionar para a página de acesso negado
      return new Response(null, {
        status: 302,
        headers: {
          ...Object.fromEntries(headers),
          Location: '/access-denied'
        }
      });
    }
    
    // Se tiver acesso, definir o tenant no contexto e salvar nos cookies
    await supabase.rpc('set_tenant_context', { tenant_id: tenantId });
    
    // Aplicar cabeçalhos de segurança e definir cookie
    headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    headers.set('Set-Cookie', `currentTenantId=${tenantId}; Path=/; Max-Age=${60 * 60 * 24 * 30}; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=Lax`);
    
    // Definir o nonce no objeto de request para uso em aplicações SSR
    // @ts-ignore - adicionando propriedade personalizada
    request.cspNonce = nonce;
    
    return new Response(null, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Erro no middleware de tenant:', error);
    
    // Redirecionar para página de erro em caso de falha
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/error'
      }
    });
  }
}

/**
 * Helper function to parse cookies from a cookie header string
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
  }
  
  return cookies;
}

/**
 * Verifica se uma rota é pública (não requer autenticação)
 */
function isPublicRoute(path: string): boolean {
  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/api/public',
    '/auth/callback',
    '/privacy-policy',
    '/terms-of-service',
  ];
  
  // Verificar se a rota exata está na lista de rotas públicas
  if (publicRoutes.includes(path)) {
    return true;
  }
  
  // Verificar se a rota começa com algum prefixo público
  const publicPrefixes = [
    '/assets/',
    '/images/',
    '/fonts/',
    '/api/public/',
    '/auth/',
    '/reset-password/',
  ];
  
  return publicPrefixes.some(prefix => path.startsWith(prefix));
}
