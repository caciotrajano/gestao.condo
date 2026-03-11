-- GOV-04: Migration 002 — Colunas de prazo em manutenções
-- Data: Fase de evolução do módulo de manutenções
ALTER TABLE public.manutencoes
  ADD COLUMN IF NOT EXISTS data_conclusao DATE,
  ADD COLUMN IF NOT EXISTS data_realizada DATE;

COMMENT ON COLUMN public.manutencoes.data_conclusao IS 'Previsão de conclusão da manutenção';
COMMENT ON COLUMN public.manutencoes.data_realizada IS 'Data real de conclusão (preenchida ao concluir)';
