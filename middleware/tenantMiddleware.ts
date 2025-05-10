import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

// Função para verificar se o usuário tem acesso ao tenant
async function hasAccessToTenant(userId: string, tenantId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('tenant_users')
      .select('*')
      .eq('user_id', userId)
      .eq('tenant_id', tenantId)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar acesso ao tenant:', error);
    return false;
  }
}

// Middleware de tenant para proteger rotas
export async function tenantMiddleware(
  request: NextRequest,
  response: NextResponse
) {
  try {
    // Verificar a sessão atual do usuário
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Se não houver sessão, redirecionar para a página de login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Obter o ID do tenant da URL (assumindo que está no formato /[tenantId]/...)
    const pathParts = request.nextUrl.pathname.split('/');
    const tenantId = pathParts[1];
    
    // Se não houver tenant na URL, verificar se há um tenant salvo no localStorage
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
      return NextResponse.next();
    }
    
    // Verificar se o usuário tem acesso ao tenant da URL
    const hasAccess = await hasAccessToTenant(session.user.id, tenantId);
    
    if (!hasAccess) {
      // Se não tiver acesso, redirecionar para a página de acesso negado
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }
    
    // Se tiver acesso, definir o tenant no contexto e salvar no localStorage
    await supabase.rpc('set_tenant_context', { tenant_id: tenantId });
    
    // Salvar o tenant atual nos cookies
    const response = NextResponse.next();
    response.cookies.set('currentTenantId', tenantId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    
    return response;
  } catch (error) {
    console.error('Erro no middleware de tenant:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
