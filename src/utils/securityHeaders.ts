
/**
 * Utilitário para gerar cabeçalhos de segurança Content Security Policy (CSP)
 */

interface CSPOptions {
  nonce?: string;                  // Nonce para scripts
  strictDynamic?: boolean;         // Usar strict-dynamic para scripts
  reportOnly?: boolean;            // Usar report-only mode (não bloqueia, só reporta)
  reportUri?: string;              // URI para enviar relatórios de violações
}

/**
 * Gera um cabeçalho Content Security Policy (CSP) com base nas opções fornecidas
 */
export function generateCSP(options: CSPOptions = {}): string {
  const {
    nonce,
    strictDynamic = false,
    reportOnly = false,
    reportUri = '',
  } = options;

  // Definir sources para os diferentes tipos de conteúdo
  let defaultSrc = [`'self'`];
  let scriptSrc = [`'self'`];
  let styleSrc = [`'self'`, `'unsafe-inline'`]; // Permitir estilos inline para compatibilidade
  let imgSrc = [`'self'`, 'data:', 'https:'];
  let connectSrc = [`'self'`, 'https://*.supabase.co', 'wss://*.supabase.co'];
  let fontSrc = [`'self'`, 'data:', 'https://fonts.gstatic.com'];
  let objectSrc = [`'none'`];
  let mediaSrc = [`'self'`];
  let frameSrc = [`'none'`];

  // Adicionar nonce se fornecido
  if (nonce) {
    scriptSrc.push(`'nonce-${nonce}'`);
  }

  // Adicionar strict-dynamic se solicitado
  if (strictDynamic && nonce) {
    scriptSrc.push(`'strict-dynamic'`);
  }

  // Em ambiente de desenvolvimento, permitir scripts unsafe-inline e eval para hot reloading
  if (import.meta.env.DEV) {
    scriptSrc.push(`'unsafe-inline'`, `'unsafe-eval'`);
    // Permitir conexão com o servidor de desenvolvimento
    connectSrc.push('ws:', 'http://localhost:*');
  }

  // Construir a política CSP
  const policies = [
    `default-src ${defaultSrc.join(' ')}`,
    `script-src ${scriptSrc.join(' ')}`,
    `style-src ${styleSrc.join(' ')}`,
    `img-src ${imgSrc.join(' ')}`,
    `connect-src ${connectSrc.join(' ')}`,
    `font-src ${fontSrc.join(' ')}`,
    `object-src ${objectSrc.join(' ')}`,
    `media-src ${mediaSrc.join(' ')}`,
    `frame-src ${frameSrc.join(' ')}`,
    'base-uri \'self\'',
    'form-action \'self\'',
    'frame-ancestors \'none\'',
    'block-all-mixed-content',
    'upgrade-insecure-requests'
  ];

  // Adicionar report-uri se fornecido
  if (reportUri) {
    policies.push(`report-uri ${reportUri}`);
    policies.push(`report-to default`);
  }

  return policies.join('; ');
}

/**
 * Gera um objeto com todos os cabeçalhos de segurança recomendados
 */
export function getSecurityHeaders(nonce?: string): Record<string, string> {
  return {
    'Content-Security-Policy': generateCSP({ nonce }),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Referrer-Policy': 'same-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };
}

/**
 * Gera um nonce aleatório para uso no CSP
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
