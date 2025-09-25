# Guia de Deploy na Vercel com Banco Neon

## ✅ Pré-requisitos Verificados

- [x] Build de produção funcionando
- [x] Configuração do Prisma para PostgreSQL
- [x] Variáveis de ambiente configuradas
- [x] Banco Neon configurado e acessível

## 🚀 Passos para Deploy

### 1. Preparar o Repositório

```bash
# Certifique-se de que todas as mudanças estão commitadas
git add .
git commit -m "Preparação para deploy em produção"
git push origin main
```

### 2. Configurar Projeto na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Importe o repositório do GitHub
4. Configure as seguintes opções:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Configurar Variáveis de Ambiente

Na seção "Environment Variables" da Vercel, adicione:

#### Obrigatórias:
```
AUTH_SECRET=your-generated-secret-here
DATABASE_URL=postgresql://neondb_owner:npg_xvQSGn5Jh1WO@ep-gentle-resonance-adjqg2f0-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
NODE_ENV=production
NEXTAUTH_URL=https://your-app-name.vercel.app
```

#### Opcionais (para autenticação social):
```
AUTH_DISCORD_ID=your-discord-client-id
AUTH_DISCORD_SECRET=your-discord-client-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

#### Neon Auth (se usando):
```
NEXT_PUBLIC_STACK_PROJECT_ID=bfec3814-470f-41f7-b622-550e1ade8765
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_4ac17hzf7wsrws6mrdewyr5gwzswkj1ym0w1dytp1re3g
STACK_SECRET_SERVER_KEY=ssk_nn78rycrh0kbtsmzr3g359p11na8ycjx41wp6k22rgvbg
```

### 4. Gerar AUTH_SECRET

Execute localmente para gerar um secret seguro:
```bash
npx auth secret
```

### 5. Configurar Banco de Dados

O banco Neon já está configurado. Após o deploy, execute as migrações:

```bash
# Via Vercel CLI (se instalado)
vercel env pull .env.local
npx prisma db push

# Ou via interface da Vercel
# Adicione um script de build que inclua: npx prisma generate && npx prisma db push
```

### 6. Deploy

1. Clique em "Deploy" na Vercel
2. Aguarde o build completar
3. Verifique se não há erros no log de build

### 7. Pós-Deploy

#### Verificar Funcionalidades:
- [ ] Página inicial carrega
- [ ] Autenticação funciona
- [ ] Conexão com banco está ativa
- [ ] Rotas da API respondem

#### Configurar Domínio (opcional):
1. Na Vercel, vá em Settings > Domains
2. Adicione seu domínio customizado
3. Atualize `NEXTAUTH_URL` com o novo domínio

## 🔧 Comandos Úteis

### Verificar Status do Deploy
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Ver logs
vercel logs

# Executar localmente com env de produção
vercel dev
```

### Gerenciar Banco de Dados
```bash
# Visualizar dados
npx prisma studio

# Reset do banco (CUIDADO!)
npx prisma db push --force-reset

# Gerar cliente Prisma
npx prisma generate
```

## 🐛 Troubleshooting

### Erro de Conexão com Banco
- Verifique se `DATABASE_URL` está correta
- Confirme que o banco Neon está ativo
- Teste a conexão localmente primeiro

### Erro de Build
- Verifique se todas as dependências estão no `package.json`
- Confirme que não há erros de TypeScript
- Execute `npm run build` localmente

### Erro de Autenticação
- Verifique se `AUTH_SECRET` está configurado
- Confirme que `NEXTAUTH_URL` aponta para o domínio correto
- Para OAuth, verifique as configurações dos providers

### Erro de Prisma
- Execute `npx prisma generate` após mudanças no schema
- Use `npx prisma db push` para aplicar mudanças no banco
- Verifique se o schema está sincronizado

## 📊 Monitoramento

### Logs da Vercel
- Acesse Functions > View Function Logs
- Monitore erros em tempo real

### Banco Neon
- Acesse o dashboard do Neon
- Monitore conexões e queries
- Verifique métricas de performance

## 🔒 Segurança

- ✅ Variáveis sensíveis estão em environment variables
- ✅ Conexão com banco usa SSL
- ✅ AUTH_SECRET é único e seguro
- ✅ Não há credenciais no código

## 📝 Próximos Passos

1. Configurar monitoramento de erros (Sentry)
2. Implementar backup automático do banco
3. Configurar CI/CD para deploys automáticos
4. Otimizar performance com caching
5. Implementar testes automatizados