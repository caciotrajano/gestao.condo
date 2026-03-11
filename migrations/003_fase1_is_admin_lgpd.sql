-- GOV-04: Migration 003 — is_admin e colunas LGPD na tabela clientes
-- Data: Fase 1 de segurança e conformidade
ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS is_admin          BOOLEAN   NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS termos_aceitos    BOOLEAN   NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS termos_aceitos_em TIMESTAMPTZ;

COMMENT ON COLUMN public.clientes.is_admin          IS 'TRUE somente para admin. Controla acesso via RLS.';
COMMENT ON COLUMN public.clientes.termos_aceitos    IS 'LGPD Art. 7/8 — aceite dos Termos de Uso';
COMMENT ON COLUMN public.clientes.termos_aceitos_em IS 'LGPD — Timestamp do aceite. Evidência de consentimento.';

-- Marcar admin
UPDATE public.clientes SET is_admin = TRUE WHERE email = 'caciotrajano@hotmail.com';
