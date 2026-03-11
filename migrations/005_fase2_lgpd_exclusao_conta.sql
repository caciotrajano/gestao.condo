-- GOV-04: Migration 005 — Suporte à exclusão de conta (LGPD Art. 18)
-- Data: Fase 2 de conformidade LGPD
-- Não requer ALTER TABLE — a exclusão é feita via UPDATE (anonimização)
-- anonimização: nome='[conta excluída]', status='inativo', termos_aceitos=false

-- Política RLS para permitir que o usuário anonimize seus próprios dados ao excluir
-- (já coberta pela policy cliente_update_own da migration 004)

-- Índice para facilitar busca por owner_id em auditorias
CREATE INDEX IF NOT EXISTS idx_clientes_owner_id ON public.clientes(owner_id);
CREATE INDEX IF NOT EXISTS idx_clientes_email    ON public.clientes(email);
