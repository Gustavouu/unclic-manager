-- Criar tabela de configurações
CREATE TABLE IF NOT EXISTS configuracoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    horario_funcionamento JSONB DEFAULT '{"segunda": {"inicio": "09:00", "fim": "18:00"}, "terca": {"inicio": "09:00", "fim": "18:00"}, "quarta": {"inicio": "09:00", "fim": "18:00"}, "quinta": {"inicio": "09:00", "fim": "18:00"}, "sexta": {"inicio": "09:00", "fim": "18:00"}, "sabado": {"inicio": "09:00", "fim": "18:00"}, "domingo": {"inicio": null, "fim": null}}',
    intervalo_agendamentos INTEGER DEFAULT 15,
    antecedencia_minima INTEGER DEFAULT 30,
    dias_maximos_futuro INTEGER DEFAULT 30,
    requer_confirmacao BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    negocio_id UUID REFERENCES negocios(id) ON DELETE CASCADE,
    CONSTRAINT unique_negocio_config UNIQUE (negocio_id)
);

-- Criar trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_configuracoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_configuracoes_updated_at
    BEFORE UPDATE ON configuracoes
    FOR EACH ROW
    EXECUTE FUNCTION update_configuracoes_updated_at();

-- Habilitar RLS
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Permitir leitura para usuários autenticados"
    ON configuracoes FOR SELECT
    USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM negocios_usuarios nu 
            WHERE nu.negocio_id = configuracoes.negocio_id 
            AND nu.usuario_id = auth.uid()
        )
    );

CREATE POLICY "Permitir inserção para proprietários"
    ON configuracoes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM negocios_usuarios nu 
            WHERE nu.negocio_id = configuracoes.negocio_id 
            AND nu.usuario_id = auth.uid() 
            AND nu.role = 'owner'
        )
    );

CREATE POLICY "Permitir atualização para administradores e proprietários"
    ON configuracoes FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM negocios_usuarios nu 
            WHERE nu.negocio_id = configuracoes.negocio_id 
            AND nu.usuario_id = auth.uid() 
            AND nu.role IN ('admin', 'owner')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM negocios_usuarios nu 
            WHERE nu.negocio_id = configuracoes.negocio_id 
            AND nu.usuario_id = auth.uid() 
            AND nu.role IN ('admin', 'owner')
        )
    );

CREATE POLICY "Permitir exclusão para proprietários"
    ON configuracoes FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM negocios_usuarios nu 
            WHERE nu.negocio_id = configuracoes.negocio_id 
            AND nu.usuario_id = auth.uid() 
            AND nu.role = 'owner'
        )
    ); 