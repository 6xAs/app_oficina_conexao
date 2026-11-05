# App Oficina Conexão

Experimento em React 19 + TypeScript + Vite 8, com navegação mockada e um único campo de cadastro de **nome**.

## Executar

```bash
npm install
npm run dev
npm run build
```

Sem variáveis de ambiente, o cadastro funciona apenas na memória (modo demonstração). Para persistência no Supabase, copie `.env.example` para `.env` e configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` com valores públicos do **projeto de testes**. Nunca inclua chaves `service_role` ou `sb_secret_` no frontend.

## Banco

Execute a migração de `supabase/migrations/20261104000000_create_oficina_nomes.sql` em um projeto Supabase exclusivo para o experimento. Ela usa autenticação anônima de visitantes por meio de políticas de demonstração; não use essa configuração para dados pessoais reais em produção.

## Deploy

A Vercel deve detectar Vite, usar `npm run build` e servir `dist`. Configure as mesmas duas variáveis públicas no projeto Vercel antes de ativar a persistência.
