-- GOV-04: Migration 004 — RLS em todas as tabelas
-- Data: Fase 1 de segurança
-- (Ver conteúdo completo em fase1_002_rls_todas_tabelas.sql)

-- Função is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT is_admin FROM public.clientes WHERE owner_id = auth.uid() LIMIT 1), FALSE);
$$;

-- Habilitar RLS em todas as tabelas operacionais
ALTER TABLE public.clientes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condominios   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condominos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financeiro    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inadimplencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ocorrencias   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manutencoes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamento     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config_planos ENABLE ROW LEVEL SECURITY;
-- (policies completas: ver fase1_002_rls_todas_tabelas.sql)
