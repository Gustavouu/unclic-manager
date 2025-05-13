
import { createServerClient } from '@supabase/ssr';
import { sanitizeInput } from '@/utils/sanitize';
import { supabase } from '@/integrations/supabase/client';

/**
 * Define os cabeçalhos de segurança padrão
 */
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co;",
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Referrer-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
};

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
    // Aplicar cabeçalhos de segurança
    const headers = new Headers();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
    // Obter a URL atual
    const url = new URL(request.url);
    
    // Criar cliente do Supabase para o servidor
    const cookies = parseCookies(request.headers.get('cookie') || '');
    
    // Verificar a sessão atual do usuário
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Se não houver sessão, redirecionar para a página de login
      return new Response(null, {
        status: 302,
        headers: {
          ...headers,
          Location: '/login'
        }
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
            ...headers,
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
            ...headers,
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
          ...headers,
          Location: '/access-denied'
        }
      });
    }
    
    // Se tiver acesso, definir o tenant no contexto e salvar nos cookies
    await supabase.rpc('set_tenant_context', { tenant_id: tenantId });
    
    // Aplicar cabeçalhos de segurança e definir cookie
    headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    headers.set('Set-Cookie', `currentTenantId=${tenantId}; Path=/; Max-Age=${60 * 60 * 24 * 30}; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}SameSite=Lax`);
    
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
