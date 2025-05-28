import { beforeAll, afterAll, afterEach } from 'vitest';
import { supabase } from '@/lib/supabase';

// Limpa o banco de dados antes de cada teste
beforeAll(async () => {
  // Aqui podemos adicionar configurações globais antes dos testes
  // Por exemplo, criar um usuário de teste, configurar variáveis de ambiente, etc.
});

// Limpa o banco de dados após cada teste
afterEach(async () => {
  // Limpa todas as tabelas relevantes
  const tables = [
    'appointments',
    'services',
    'service_categories',
    'professionals',
    'businesses',
    'users',
  ];

  for (const table of tables) {
    await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }
});

// Limpa o banco de dados após todos os testes
afterAll(async () => {
  // Aqui podemos adicionar limpezas finais
  // Por exemplo, remover usuários de teste, etc.
}); 