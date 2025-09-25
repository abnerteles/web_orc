# 🔧 Configuração de Variáveis de Ambiente na Vercel

## 📋 Variáveis OBRIGATÓRIAS para configurar na Vercel

### 1. AUTH_SECRET
```
AUTH_SECRET=NnaongWVGuQRaQcSlMUEXIVjiJO0CCKIKUY/PRMxL/A=
```
**Descrição**: Chave secreta para autenticação NextAuth.js

### 2. DATABASE_URL
```
DATABASE_URL=postgresql://neondb_owner:npg_xxxxxxxxx@ep-xxxxxxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```
**Descrição**: URL de conexão com o banco Neon PostgreSQL

### 3. NODE_ENV
```
NODE_ENV=production
```
**Descrição**: Ambiente de execução

### 4. NEXTAUTH_URL
```
NEXTAUTH_URL=https://seu-projeto.vercel.app
```
**Descrição**: URL base da aplicação (será definida após primeiro deploy)

## 🔧 Como configurar na Vercel

### Via Dashboard Web:
1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione cada variável acima
4. Selecione **Production**, **Preview** e **Development**
5. Clique em **Save**

### Via CLI (alternativa):
```bash
npx vercel env add AUTH_SECRET
npx vercel env add DATABASE_URL
npx vercel env add NODE_ENV
npx vercel env add NEXTAUTH_URL
```

## ⚠️ Importante

- **DATABASE_URL**: Use a URL exata do seu banco Neon
- **NEXTAUTH_URL**: Atualize após o primeiro deploy com a URL real
- **AUTH_SECRET**: Use exatamente o valor gerado acima
- **NODE_ENV**: Sempre "production" para deploy

## 🚀 Após configurar

1. Faça um novo deploy (push para main/master)
2. Verifique os logs de build
3. Teste a aplicação
4. Atualize NEXTAUTH_URL se necessário

## 🔍 Verificação

Para verificar se as variáveis estão configuradas:
```bash
npx vercel env ls
```