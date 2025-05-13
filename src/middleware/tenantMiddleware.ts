
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { sanitizeInput } from '@/utils/sanitize';
import { createServerClient } from '@supabase/ssr';

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
 * Middleware de tenant para proteger rotas
 */
export async function tenantMiddleware(
  request: NextRequest
) {
  try {
    // Aplicar cabeçalhos de segurança
    const headers = new Headers(securityHeaders);
    
    // Criar cliente do Supabase para o servidor
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => request.cookies.get(name)?.value,
          set: (name: string, value: string, options: any) => {},
          remove: (name: string, options: any) => {},
        },
      }
    );
    
    // Verificar a sessão atual do usuário
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Se não houver sessão, redirecionar para a página de login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Obter o ID do tenant da URL (assumindo que está no formato /[tenantId]/...)
    const pathParts = request.nextUrl.pathname.split('/');
    let tenantId = pathParts[1];
    
    // Sanitizar o tenantId para prevenir injeção
    if (tenantId) {
      tenantId = sanitizeInput(tenantId);
    }
    
    // Se não houver tenant na URL, verificar se há um tenant salvo nos cookies
    if (!tenantId) {
      const savedTenantId = request.cookies.get('currentTenantId')?.value;
      
      if (!savedTenantId) {
        // Se não houver tenant salvo, redirecionar para a página de seleção de tenant
        return NextResponse.redirect(new URL('/select-tenant', request.url));
      }
      
      // Verificar se o usuário tem acesso ao tenant salvo
      const hasAccess = await hasAccessToTenant(session.user.id, savedTenantId);
      
      if (!hasAccess) {
        // Se não tiver acesso, redirecionar para a página de seleção de tenant
        return NextResponse.redirect(new URL('/select-tenant', request.url));
      }
      
      // Se tiver acesso, definir o tenant no contexto e continuar
      await supabase.rpc('set_tenant_context', { tenant_id: savedTenantId });
      
      // Continuar com os cabeçalhos de segurança aplicados
      const response = NextResponse.next();
      
      // Aplicar cabeçalhos de segurança
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    }
    
    // Verificar se o usuário tem acesso ao tenant da URL
    const hasAccess = await hasAccessToTenant(session.user.id, tenantId);
    
    if (!hasAccess) {
      // Se não tiver acesso, redirecionar para a página de acesso negado
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }
    
    // Se tiver acesso, definir o tenant no contexto e salvar nos cookies
    await supabase.rpc('set_tenant_context', { tenant_id: tenantId });
    
    // Criar resposta com cabeçalhos de segurança
    const response = NextResponse.next();
    
    // Aplicar cabeçalhos de segurança
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    // Definir política de cache para conteúdo dinâmico
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    
    // Salvar o tenant atual nos cookies
    response.cookies.set('currentTenantId', tenantId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    return response;
  } catch (error) {
    console.error('Erro no middleware de tenant:', error);
    
    // Redirecionar para página de erro em caso de falha
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
