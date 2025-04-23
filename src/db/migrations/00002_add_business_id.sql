-- Adiciona coluna id_negocio à tabela usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS id_negocio UUID REFERENCES negocios(id);

-- Cria tabela de negócios se não existir
CREATE TABLE IF NOT EXISTS negocios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    email TEXT,
    telefone TEXT,
    endereco JSONB,
    configuracoes JSONB,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Cria índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_negocio ON usuarios(id_negocio);

-- Adiciona trigger para atualizar updated_at
CREATE TRIGGER update_negocios_updated_at
    BEFORE UPDATE ON negocios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Cria política de segurança para usuários
CREATE POLICY "Usuários podem ver seus próprios dados e dados do mesmo negócio"
    ON usuarios
    FOR ALL
    USING (
        auth.uid() = id 
        OR 
        id_negocio = (
            SELECT id_negocio 
            FROM usuarios 
            WHERE id = auth.uid()
        )
    );

-- Habilita RLS na tabela
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY; 