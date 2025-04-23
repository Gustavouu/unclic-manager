export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agendamentos: {
        Row: {
          atualizado_em: string | null
          avaliacao: number | null
          comentario_avaliacao: string | null
          criado_em: string | null
          data: string
          duracao: number
          forma_pagamento: string | null
          hora_fim: string
          hora_inicio: string
          id: string
          id_cliente: string
          id_funcionario: string
          id_negocio: string
          id_servico: string
          lembrete_enviado: boolean | null
          observacoes: string | null
          status: string | null
          valor: number
        }
        Insert: {
          atualizado_em?: string | null
          avaliacao?: number | null
          comentario_avaliacao?: string | null
          criado_em?: string | null
          data: string
          duracao: number
          forma_pagamento?: string | null
          hora_fim: string
          hora_inicio: string
          id?: string
          id_cliente: string
          id_funcionario: string
          id_negocio: string
          id_servico: string
          lembrete_enviado?: boolean | null
          observacoes?: string | null
          status?: string | null
          valor: number
        }
        Update: {
          atualizado_em?: string | null
          avaliacao?: number | null
          comentario_avaliacao?: string | null
          criado_em?: string | null
          data?: string
          duracao?: number
          forma_pagamento?: string | null
          hora_fim?: string
          hora_inicio?: string
          id?: string
          id_cliente?: string
          id_funcionario?: string
          id_negocio?: string
          id_servico?: string
          lembrete_enviado?: boolean | null
          observacoes?: string | null
          status?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_id_funcionario_fkey"
            columns: ["id_funcionario"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_id_servico_fkey"
            columns: ["id_servico"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      analises_negocio: {
        Row: {
          agendamentos_concluidos: number | null
          clientes_recorrentes: number | null
          criado_em: string | null
          data: string
          despesas_total: number | null
          funcionarios_destaque: Json | null
          id: string
          id_negocio: string
          lucro_liquido: number | null
          novos_clientes: number | null
          nps: number | null
          receita_total: number | null
          servicos_populares: Json | null
          taxa_cancelamento: number | null
          taxa_ocupacao: number | null
          tempo_medio_atendimento: number | null
          total_agendamentos: number | null
        }
        Insert: {
          agendamentos_concluidos?: number | null
          clientes_recorrentes?: number | null
          criado_em?: string | null
          data: string
          despesas_total?: number | null
          funcionarios_destaque?: Json | null
          id?: string
          id_negocio: string
          lucro_liquido?: number | null
          novos_clientes?: number | null
          nps?: number | null
          receita_total?: number | null
          servicos_populares?: Json | null
          taxa_cancelamento?: number | null
          taxa_ocupacao?: number | null
          tempo_medio_atendimento?: number | null
          total_agendamentos?: number | null
        }
        Update: {
          agendamentos_concluidos?: number | null
          clientes_recorrentes?: number | null
          criado_em?: string | null
          data?: string
          despesas_total?: number | null
          funcionarios_destaque?: Json | null
          id?: string
          id_negocio?: string
          lucro_liquido?: number | null
          novos_clientes?: number | null
          nps?: number | null
          receita_total?: number | null
          servicos_populares?: Json | null
          taxa_cancelamento?: number | null
          taxa_ocupacao?: number | null
          tempo_medio_atendimento?: number | null
          total_agendamentos?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analises_negocio_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      campanhas_marketing: {
        Row: {
          atualizado_em: string | null
          canais: string[] | null
          cliques: number | null
          conversoes: number | null
          criado_em: string | null
          criado_por: string | null
          data_fim: string
          data_inicio: string
          id: string
          id_negocio: string
          impressoes: number | null
          nome: string
          orcamento: number | null
          publico_alvo: string | null
          resultados: Json | null
          roi: number | null
          status: string | null
          tipo: string
          total_gasto: number | null
        }
        Insert: {
          atualizado_em?: string | null
          canais?: string[] | null
          cliques?: number | null
          conversoes?: number | null
          criado_em?: string | null
          criado_por?: string | null
          data_fim: string
          data_inicio: string
          id?: string
          id_negocio: string
          impressoes?: number | null
          nome: string
          orcamento?: number | null
          publico_alvo?: string | null
          resultados?: Json | null
          roi?: number | null
          status?: string | null
          tipo: string
          total_gasto?: number | null
        }
        Update: {
          atualizado_em?: string | null
          canais?: string[] | null
          cliques?: number | null
          conversoes?: number | null
          criado_em?: string | null
          criado_por?: string | null
          data_fim?: string
          data_inicio?: string
          id?: string
          id_negocio?: string
          impressoes?: number | null
          nome?: string
          orcamento?: number | null
          publico_alvo?: string | null
          resultados?: Json | null
          roi?: number | null
          status?: string | null
          tipo?: string
          total_gasto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campanhas_marketing_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campanhas_marketing_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          atualizado_em: string | null
          cor: string | null
          criado_em: string | null
          descricao: string | null
          icone: string | null
          id: string
          id_negocio: string
          nome: string
          tipo: string
        }
        Insert: {
          atualizado_em?: string | null
          cor?: string | null
          criado_em?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          id_negocio: string
          nome: string
          tipo: string
        }
        Update: {
          atualizado_em?: string | null
          cor?: string | null
          criado_em?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          id_negocio?: string
          nome?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          atualizado_em: string | null
          cep: string | null
          cidade: string | null
          criado_em: string | null
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          genero: string | null
          id: string
          id_negocio: string
          id_usuario: string | null
          nome: string
          notas: string | null
          preferencias: Json | null
          telefone: string | null
          ultima_visita: string | null
          valor_total_gasto: number | null
        }
        Insert: {
          atualizado_em?: string | null
          cep?: string | null
          cidade?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          genero?: string | null
          id?: string
          id_negocio: string
          id_usuario?: string | null
          nome: string
          notas?: string | null
          preferencias?: Json | null
          telefone?: string | null
          ultima_visita?: string | null
          valor_total_gasto?: number | null
        }
        Update: {
          atualizado_em?: string | null
          cep?: string | null
          cidade?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          genero?: string | null
          id?: string
          id_negocio?: string
          id_usuario?: string | null
          nome?: string
          notas?: string | null
          preferencias?: Json | null
          telefone?: string | null
          ultima_visita?: string | null
          valor_total_gasto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_negocio: {
        Row: {
          atualizado_em: string | null
          aviso_minimo_agendamento: number | null
          banner_url: string | null
          configuracoes_gateway_pagamento: Json | null
          cores_primarias: string | null
          cores_secundarias: string | null
          criado_em: string | null
          dias_maximos_antecedencia: number | null
          fallback_humano_habilitado: boolean | null
          ia_habilitada: boolean | null
          id: string
          id_negocio: string
          limite_fila_remota: number | null
          logo_url: string | null
          pagamento_antecipado_obrigatorio: boolean | null
          permite_fila_remota: boolean | null
          permite_gorjetas: boolean | null
          politica_cancelamento: string | null
        }
        Insert: {
          atualizado_em?: string | null
          aviso_minimo_agendamento?: number | null
          banner_url?: string | null
          configuracoes_gateway_pagamento?: Json | null
          cores_primarias?: string | null
          cores_secundarias?: string | null
          criado_em?: string | null
          dias_maximos_antecedencia?: number | null
          fallback_humano_habilitado?: boolean | null
          ia_habilitada?: boolean | null
          id?: string
          id_negocio: string
          limite_fila_remota?: number | null
          logo_url?: string | null
          pagamento_antecipado_obrigatorio?: boolean | null
          permite_fila_remota?: boolean | null
          permite_gorjetas?: boolean | null
          politica_cancelamento?: string | null
        }
        Update: {
          atualizado_em?: string | null
          aviso_minimo_agendamento?: number | null
          banner_url?: string | null
          configuracoes_gateway_pagamento?: Json | null
          cores_primarias?: string | null
          cores_secundarias?: string | null
          criado_em?: string | null
          dias_maximos_antecedencia?: number | null
          fallback_humano_habilitado?: boolean | null
          ia_habilitada?: boolean | null
          id?: string
          id_negocio?: string
          limite_fila_remota?: number | null
          logo_url?: string | null
          pagamento_antecipado_obrigatorio?: boolean | null
          permite_fila_remota?: boolean | null
          permite_gorjetas?: boolean | null
          politica_cancelamento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_negocio_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: true
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      estoque: {
        Row: {
          atualizado_em: string | null
          codigo_barras: string | null
          criado_em: string | null
          data_ultima_reposicao: string | null
          data_validade: string | null
          descricao: string | null
          e_equipamento: boolean | null
          id: string
          id_categoria: string | null
          id_fornecedor: string | null
          id_negocio: string
          imagem_url: string | null
          localizacao: string | null
          nome: string
          preco_custo: number | null
          preco_venda: number | null
          quantidade: number
          quantidade_minima: number | null
          sku: string | null
        }
        Insert: {
          atualizado_em?: string | null
          codigo_barras?: string | null
          criado_em?: string | null
          data_ultima_reposicao?: string | null
          data_validade?: string | null
          descricao?: string | null
          e_equipamento?: boolean | null
          id?: string
          id_categoria?: string | null
          id_fornecedor?: string | null
          id_negocio: string
          imagem_url?: string | null
          localizacao?: string | null
          nome: string
          preco_custo?: number | null
          preco_venda?: number | null
          quantidade?: number
          quantidade_minima?: number | null
          sku?: string | null
        }
        Update: {
          atualizado_em?: string | null
          codigo_barras?: string | null
          criado_em?: string | null
          data_ultima_reposicao?: string | null
          data_validade?: string | null
          descricao?: string | null
          e_equipamento?: boolean | null
          id?: string
          id_categoria?: string | null
          id_fornecedor?: string | null
          id_negocio?: string
          imagem_url?: string | null
          localizacao?: string | null
          nome?: string
          preco_custo?: number | null
          preco_venda?: number | null
          quantidade?: number
          quantidade_minima?: number | null
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_id_categoria_fkey"
            columns: ["id_categoria"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          atualizado_em: string | null
          bio: string | null
          cargo: string | null
          comissao_percentual: number | null
          criado_em: string | null
          data_contratacao: string | null
          email: string | null
          especializacoes: string[] | null
          foto_url: string | null
          id: string
          id_negocio: string
          id_usuario: string | null
          nome: string
          status: string | null
          telefone: string | null
        }
        Insert: {
          atualizado_em?: string | null
          bio?: string | null
          cargo?: string | null
          comissao_percentual?: number | null
          criado_em?: string | null
          data_contratacao?: string | null
          email?: string | null
          especializacoes?: string[] | null
          foto_url?: string | null
          id?: string
          id_negocio: string
          id_usuario?: string | null
          nome: string
          status?: string | null
          telefone?: string | null
        }
        Update: {
          atualizado_em?: string | null
          bio?: string | null
          cargo?: string | null
          comissao_percentual?: number | null
          criado_em?: string | null
          data_contratacao?: string | null
          email?: string | null
          especializacoes?: string[] | null
          foto_url?: string | null
          id?: string
          id_negocio?: string
          id_usuario?: string | null
          nome?: string
          status?: string | null
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionarios_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      horarios_disponibilidade: {
        Row: {
          atualizado_em: string | null
          capacidade_simultanea: number | null
          criado_em: string | null
          dia_folga: boolean | null
          dia_semana: number
          hora_fim: string
          hora_inicio: string
          id: string
          id_funcionario: string | null
          id_negocio: string
          id_servico: string | null
          intervalo_entre_agendamentos: number | null
        }
        Insert: {
          atualizado_em?: string | null
          capacidade_simultanea?: number | null
          criado_em?: string | null
          dia_folga?: boolean | null
          dia_semana: number
          hora_fim: string
          hora_inicio: string
          id?: string
          id_funcionario?: string | null
          id_negocio: string
          id_servico?: string | null
          intervalo_entre_agendamentos?: number | null
        }
        Update: {
          atualizado_em?: string | null
          capacidade_simultanea?: number | null
          criado_em?: string | null
          dia_folga?: boolean | null
          dia_semana?: number
          hora_fim?: string
          hora_inicio?: string
          id?: string
          id_funcionario?: string | null
          id_negocio?: string
          id_servico?: string | null
          intervalo_entre_agendamentos?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "horarios_disponibilidade_id_funcionario_fkey"
            columns: ["id_funcionario"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "horarios_disponibilidade_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "horarios_disponibilidade_id_servico_fkey"
            columns: ["id_servico"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      integracoes: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          configuracao: Json | null
          criado_em: string | null
          data_expiracao_token: string | null
          id: string
          id_negocio: string
          nome_provedor: string
          status_ultima_sincronizacao: string | null
          tipo: string
          token_acesso: string | null
          token_refresh: string | null
          ultima_sincronizacao: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          configuracao?: Json | null
          criado_em?: string | null
          data_expiracao_token?: string | null
          id?: string
          id_negocio: string
          nome_provedor: string
          status_ultima_sincronizacao?: string | null
          tipo: string
          token_acesso?: string | null
          token_refresh?: string | null
          ultima_sincronizacao?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          configuracao?: Json | null
          criado_em?: string | null
          data_expiracao_token?: string | null
          id?: string
          id_negocio?: string
          nome_provedor?: string
          status_ultima_sincronizacao?: string | null
          tipo?: string
          token_acesso?: string | null
          token_refresh?: string | null
          ultima_sincronizacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integracoes_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      negocios: {
        Row: {
          atualizado_em: string | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          cnpj: string | null
          complemento: string | null
          criado_em: string | null
          data_fim_assinatura: string | null
          data_fim_teste: string | null
          descricao: string | null
          email_admin: string
          endereco: string | null
          estado: string | null
          fuso_horario: string | null
          id: string
          idioma: string | null
          latitude: number | null
          longitude: number | null
          moeda: string | null
          nome: string
          nome_fantasia: string | null
          numero: string | null
          razao_social: string | null
          slug: string
          status: string | null
          status_assinatura: string | null
          telefone: string | null
          url_logo: string | null
        }
        Insert: {
          atualizado_em?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          criado_em?: string | null
          data_fim_assinatura?: string | null
          data_fim_teste?: string | null
          descricao?: string | null
          email_admin: string
          endereco?: string | null
          estado?: string | null
          fuso_horario?: string | null
          id?: string
          idioma?: string | null
          latitude?: number | null
          longitude?: number | null
          moeda?: string | null
          nome: string
          nome_fantasia?: string | null
          numero?: string | null
          razao_social?: string | null
          slug: string
          status?: string | null
          status_assinatura?: string | null
          telefone?: string | null
          url_logo?: string | null
        }
        Update: {
          atualizado_em?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          criado_em?: string | null
          data_fim_assinatura?: string | null
          data_fim_teste?: string | null
          descricao?: string | null
          email_admin?: string
          endereco?: string | null
          estado?: string | null
          fuso_horario?: string | null
          id?: string
          idioma?: string | null
          latitude?: number | null
          longitude?: number | null
          moeda?: string | null
          nome?: string
          nome_fantasia?: string | null
          numero?: string | null
          razao_social?: string | null
          slug?: string
          status?: string | null
          status_assinatura?: string | null
          telefone?: string | null
          url_logo?: string | null
        }
        Relationships: []
      }
      perfis_acesso: {
        Row: {
          acesso_agendamentos: boolean | null
          acesso_clientes: boolean | null
          acesso_configuracoes: boolean | null
          acesso_estoque: boolean | null
          acesso_financeiro: boolean | null
          acesso_marketing: boolean | null
          acesso_relatorios: boolean | null
          atualizado_em: string | null
          criado_em: string | null
          e_administrador: boolean | null
          id: string
          id_negocio: string
          id_usuario: string
        }
        Insert: {
          acesso_agendamentos?: boolean | null
          acesso_clientes?: boolean | null
          acesso_configuracoes?: boolean | null
          acesso_estoque?: boolean | null
          acesso_financeiro?: boolean | null
          acesso_marketing?: boolean | null
          acesso_relatorios?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          e_administrador?: boolean | null
          id?: string
          id_negocio: string
          id_usuario: string
        }
        Update: {
          acesso_agendamentos?: boolean | null
          acesso_clientes?: boolean | null
          acesso_configuracoes?: boolean | null
          acesso_estoque?: boolean | null
          acesso_financeiro?: boolean | null
          acesso_marketing?: boolean | null
          acesso_relatorios?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          e_administrador?: boolean | null
          id?: string
          id_negocio?: string
          id_usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfis_acesso_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfis_acesso_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          comissao_percentual: number | null
          criado_em: string | null
          descricao: string | null
          duracao: number
          id: string
          id_categoria: string | null
          id_negocio: string
          ids_equipamentos: string[] | null
          imagem_url: string | null
          nome: string
          preco: number
          requer_equipamento: boolean | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          comissao_percentual?: number | null
          criado_em?: string | null
          descricao?: string | null
          duracao: number
          id?: string
          id_categoria?: string | null
          id_negocio: string
          ids_equipamentos?: string[] | null
          imagem_url?: string | null
          nome: string
          preco: number
          requer_equipamento?: boolean | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          comissao_percentual?: number | null
          criado_em?: string | null
          descricao?: string | null
          duracao?: number
          id?: string
          id_categoria?: string | null
          id_negocio?: string
          ids_equipamentos?: string[] | null
          imagem_url?: string | null
          nome?: string
          preco?: number
          requer_equipamento?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "servicos_id_categoria_fkey"
            columns: ["id_categoria"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servicos_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      transacoes: {
        Row: {
          atualizado_em: string | null
          comprovante_url: string | null
          criado_em: string | null
          criado_por: string | null
          data_pagamento: string | null
          data_vencimento: string | null
          descricao: string | null
          id: string
          id_agendamento: string | null
          id_categoria: string | null
          id_cliente: string | null
          id_negocio: string
          metodo_pagamento: string | null
          notas: string | null
          status: string | null
          tipo: string
          valor: number
        }
        Insert: {
          atualizado_em?: string | null
          comprovante_url?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          id_agendamento?: string | null
          id_categoria?: string | null
          id_cliente?: string | null
          id_negocio: string
          metodo_pagamento?: string | null
          notas?: string | null
          status?: string | null
          tipo: string
          valor: number
        }
        Update: {
          atualizado_em?: string | null
          comprovante_url?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          id_agendamento?: string | null
          id_categoria?: string | null
          id_cliente?: string | null
          id_negocio?: string
          metodo_pagamento?: string | null
          notas?: string | null
          status?: string | null
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_id_agendamento_fkey"
            columns: ["id_agendamento"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_id_categoria_fkey"
            columns: ["id_categoria"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          atualizado_em: string | null
          cpf: string | null
          criado_em: string | null
          data_nascimento: string | null
          email: string
          funcao: string | null
          id: string
          id_negocio: string | null
          nome_completo: string
          senha_hash: string | null
          status: string | null
          telefone: string | null
          ultimo_acesso: string | null
          url_avatar: string | null
        }
        Insert: {
          atualizado_em?: string | null
          cpf?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          email: string
          funcao?: string | null
          id?: string
          id_negocio?: string | null
          nome_completo: string
          senha_hash?: string | null
          status?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          url_avatar?: string | null
        }
        Update: {
          atualizado_em?: string | null
          cpf?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          email?: string
          funcao?: string | null
          id?: string
          id_negocio?: string | null
          nome_completo?: string
          senha_hash?: string | null
          status?: string | null
          telefone?: string | null
          ultimo_acesso?: string | null
          url_avatar?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_id_negocio_fkey"
            columns: ["id_negocio"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
