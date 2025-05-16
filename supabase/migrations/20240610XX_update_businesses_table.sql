-- Migration: Atualização da tabela businesses para novo modelo
-- Data: 2024-06-10

-- 1. Adicionar novos campos
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS admin_email TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS address_number TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS address_complement TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS neighborhood TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- 2. Tornar phone opcional (se necessário)
ALTER TABLE businesses ALTER COLUMN phone DROP NOT NULL;

-- 3. Adicionar índices
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON businesses(created_at);

-- 4. Atualizar RLS policies (exemplo, ajuste conforme necessário)
DROP POLICY IF EXISTS "Businesses are updatable by business owners" ON businesses;
CREATE POLICY "Businesses are updatable by business owners"
ON businesses FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT business_id 
    FROM business_users 
    WHERE user_id = auth.uid() 
    AND role = 'owner'
  )
);

DROP POLICY IF EXISTS "Businesses are deletable by business owners" ON businesses;
CREATE POLICY "Businesses are deletable by business owners"
ON businesses FOR DELETE
TO authenticated
USING (
  id IN (
    SELECT business_id 
    FROM business_users 
    WHERE user_id = auth.uid() 
    AND role = 'owner'
  )
);

-- 5. Atualizar documentação
-- Descreva as mudanças no README de migrações após aplicar este script. 