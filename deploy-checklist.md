# Checklist de Deploy - Vercel + Neon

## 🔧 Pré-requisitos

### 1. Banco de dados Neon
- [ ] Conta criada no [Neon](https://neon.tech)
- [ ] Banco de dados criado
- [ ] String de conexão obtida (formato: `postgresql://username:password@hostname/database?sslmode=require`)

### 2. Variáveis de ambiente
- [ ] `AUTH_SECRET` - Gerado com `npx auth secret`
- [ ] `DATABASE_URL` - String de conexão do Neon
- [ ] `NEXTAUTH_URL` - URL da aplicação na Vercel
- [ ] `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET` (se usando Google Auth)
- [ ] `AUTH_DISCORD_ID` e `AUTH_DISCORD_SECRET` (se usando Discord Auth)

## 🚀 Passos de Deploy

### 1. Preparação local
```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Executar build local para testar
npm run build
```

### 2. Configuração do banco Neon
```bash
# Aplicar migrações no banco Neon
npx prisma migrate deploy

# Verificar conexão
npx prisma db pull
```

### 3. Deploy na Vercel
```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Login na Vercel
vercel login

# Deploy
vercel --prod
```

### 4. Configurar variáveis de ambiente na Vercel
1. Acesse o dashboard da Vercel
2. Vá em Settings > Environment Variables
3. Adicione todas as variáveis necessárias
4. Redeploy a aplicação

## ✅ Validações pós-deploy

### 1. Funcionalidades básicas
- [ ] Aplicação carrega sem erros
- [ ] Autenticação funciona (login/logout)
- [ ] Conexão com banco funciona
- [ ] CRUD básico funciona

### 2. Performance
- [ ] Tempo de carregamento < 3s
- [ ] Lighthouse Score > 90
- [ ] Sem erros no console

### 3. Segurança
- [ ] HTTPS habilitado
- [ ] Headers de segurança configurados
- [ ] Variáveis de ambiente não expostas

## 🔍 Troubleshooting

### Erro de conexão com banco
- Verificar se a string de conexão está correta
- Confirmar que o banco Neon está ativo
- Verificar se as migrações foram aplicadas

### Erro de autenticação
- Verificar se AUTH_SECRET está configurado
- Confirmar NEXTAUTH_URL está correto
- Verificar configuração dos providers OAuth

### Erro de build
- Verificar se todas as dependências estão instaladas
- Confirmar que não há erros de TypeScript
- Verificar se o Prisma client foi gerado