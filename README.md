🏢 Portal do Síndico Profissional
Sistema web completo para gestão de condomínios, desenvolvido em HTML puro com React e integração com Supabase.

🚀 Tecnologias Utilizadas
TecnologiaVersãoFunçãoReact18.2.0Interface do usuárioSupabasev2Banco de dados e autenticaçãoRecharts2.1.12Gráficos e visualizaçõesTailwind CSSCDNEstilizaçãoD3.jsv7Dependência do Recharts

📋 Módulos do Sistema
🏠 Dashboard
Visão geral de todos os condomínios com:

Cards de resumo: Receitas, Despesas, Saldo, Inadimplentes, Ocorrências e Manutenções
Gráfico de Receitas × Despesas por mês
Gráfico de Despesas por categoria
Resumo individual por condomínio

🏢 Condomínios
Cadastro e gestão de condomínios com:

Nome, sigla, endereço, CNPJ
Número de unidades
Administradora e contato
Cor de identificação visual

💰 Financeiro
Controle de lançamentos financeiros:

Receitas e despesas por condomínio
Filtros por mês e tipo
Categorias, forma de pagamento e status
Resumo de saldo em tempo real

⚠️ Inadimplência
Controle de unidades inadimplentes:

Registro por unidade e morador
Valor em aberto e dias de atraso
Controle de notificações enviadas
Status de acompanhamento

📩 Ocorrências
Registro e acompanhamento de ocorrências:

Tipos: Reclamação, Sugestão, Manutenção, Segurança, etc.
Prioridade: Alta, Média, Baixa
Status: Aberta, Em andamento, Resolvida
Numeração automática por data

🔧 Manutenções
Gestão de manutenções preventivas e corretivas:

Área/sistema, fornecedor e OS/contrato
Valor e status de execução
Histórico por condomínio

💼 Orçamento
Planejamento orçamentário anual:

Receitas: Taxa condominial, fundo de reserva, multas, etc.
Despesas fixas: Salários, administradora, seguro, etc.
Despesas variáveis: Água, energia, manutenção, etc.
Comparativo Previsto × Realizado


⚙️ Configuração
1. Credenciais do Supabase
No arquivo index.html, localize e preencha:
javascriptconst SUPA_URL = "https://SEU_PROJETO.supabase.co";
const SUPA_KEY = "SUA_ANON_KEY";
As chaves estão disponíveis em:
Supabase → Project Settings → API Keys → Legacy anon, service_role API keys

⚠️ Use sempre a chave anon public. Nunca exponha a service_role.

2. Autenticação
O sistema usa autenticação por email e senha via Supabase Auth.

Novos usuários precisam confirmar o email antes de fazer login
Para desativar a confirmação: Authentication → Providers → Email → desativar "Confirm email"

3. Banco de Dados
As tabelas necessárias no Supabase são:
TabelaDescriçãocondominiosCadastro de condomíniosfinanceiroLançamentos financeirosinadimplenciaRegistros de inadimplênciaocorrenciasOcorrências e reclamaçõesmanutencoesManutenções realizadas/pendentesorcamentoOrçamento anual por categoria

Ative o Row Level Security (RLS) em todas as tabelas para garantir que cada usuário acesse apenas seus próprios dados.


🌐 Deploy
O sistema está publicado via Netlify com deploy automático pelo GitHub.

URL: https://ubiquitous-bienenstitch-134d83.netlify.app
Toda atualização feita no GitHub é publicada automaticamente em 1-2 minutos.

Como atualizar:

Edite o index.html no repositório GitHub
Faça o commit
Aguarde o Netlify atualizar automaticamente ✅


🔐 Segurança

Credenciais do Supabase ficam expostas no frontend — isso é aceitável desde que:

Seja usada apenas a anon key
O RLS esteja ativado em todas as tabelas


Nunca commite a service_role key no repositório


📱 Compatibilidade

✅ Desktop (Chrome, Edge, Firefox)
✅ Mobile (Chrome para Android/iOS)
⚡ Melhor desempenho no Chrome
