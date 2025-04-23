-- Primeiro, vamos verificar o tipo enum atual
DO $$ 
BEGIN 
    -- Verifica se o tipo já existe
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cargo_usuario') THEN
        -- Cria o tipo enum se não existir
        CREATE TYPE cargo_usuario AS ENUM ('admin', 'profissional', 'cliente', 'owner');
    ELSE
        -- Adiciona o novo valor ao enum existente
        ALTER TYPE cargo_usuario ADD VALUE IF NOT EXISTS 'owner';
    END IF;
END $$;

-- Atualiza a coluna cargo na tabela usuarios para usar o novo tipo
ALTER TABLE usuarios 
    ALTER COLUMN cargo TYPE cargo_usuario USING cargo::cargo_usuario;

-- Adiciona comentário explicativo
COMMENT ON COLUMN usuarios.cargo IS 'Cargo do usuário: admin (administrador), profissional (prestador de serviço), cliente (cliente normal), owner (proprietário com acesso total ao Supabase)';

-- Cria ou atualiza a política de segurança para o cargo owner
CREATE POLICY IF NOT EXISTS "Owners podem fazer tudo" ON usuarios
    FOR ALL
    TO authenticated
    USING (auth.uid() IN (SELECT id FROM usuarios WHERE cargo = 'owner'::cargo_usuario))
    WITH CHECK (auth.uid() IN (SELECT id FROM usuarios WHERE cargo = 'owner'::cargo_usuario));

-- Função auxiliar para verificar se um usuário é owner
CREATE OR REPLACE FUNCTION public.is_owner(user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM usuarios 
        WHERE id = user_id 
        AND cargo = 'owner'::cargo_usuario
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 