-- GOV-04: Migration 001 — Criação/estrutura base da tabela clientes
-- Referência histórica do schema inicial
-- Data: Fase inicial do projeto
CREATE TABLE IF NOT EXISTS public.clientes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id              UUID REFERENCES auth.users(id),
  email                 TEXT NOT NULL,
  nome                  TEXT,
  telefone              TEXT,
  plano                 TEXT DEFAULT 'profissional',
  condominios_extra     INTEGER DEFAULT 0,
  valor_mensalidade     NUMERIC(10,2),
  dia_vencimento        INTEGER,
  tipo_contrato         TEXT,
  data_inicio_contrato  DATE,
  data_fim_contrato     DATE,
  status                TEXT DEFAULT 'pendente',
  primeira_mensalidade_paga BOOLEAN DEFAULT FALSE,
  obs                   TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);
