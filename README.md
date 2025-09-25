# Sistema de Gestão de Orçamentos

Sistema completo para gestão de orçamentos e obras desenvolvido com Next.js 15, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **NextAuth.js** - Autenticação
- **Prisma** - ORM para banco de dados
- **tRPC** - Type-safe APIs
- **PostgreSQL** - Banco de dados

## 📋 Funcionalidades

- ✅ **Dashboard** - Visão geral do sistema
- ✅ **Gestão de Orçamentos** - Criar, editar e gerenciar orçamentos
- ✅ **Gestão de Obras** - Acompanhar progresso das obras
- ✅ **Cadastros** - Clientes, fornecedores e prestadores
- ✅ **Relatórios** - Análises e exportações
- ✅ **Autenticação** - Login seguro
- ✅ **Design Responsivo** - Otimizado para desktop e mobile

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd web_orc
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Configure o banco de dados:
```bash
npx prisma generate
npx prisma db push
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🚀 Deploy na Vercel

O projeto está otimizado para deploy na Vercel:

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Configurações de Deploy

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## 📁 Estrutura do Projeto

```
├── src/
│   ├── app/                 # App Router (Next.js 15)
│   │   ├── auth/           # Páginas de autenticação
│   │   ├── orcamentos/     # Gestão de orçamentos
│   │   ├── obras/          # Gestão de obras
│   │   ├── cadastros/      # Cadastros gerais
│   │   └── relatorios/     # Relatórios e análises
│   ├── server/             # Configurações do servidor
│   ├── styles/             # Estilos globais
│   └── trpc/               # Configurações tRPC
├── prisma/                 # Schema do banco de dados
├── public/                 # Arquivos estáticos
└── vercel.json            # Configurações Vercel
```

## 🎨 Design System

O projeto utiliza um design system consistente baseado em:

- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Tipografia**: Hierarquia clara com `text-2xl` para títulos
- **Espaçamentos**: Sistema consistente de padding e margins
- **Cores**: Paleta baseada em azul (`blue-600`) e cinza
- **Responsividade**: Breakpoints `sm:`, `lg:`, `xl:`

## 📱 Responsividade

Todas as páginas são otimizadas para:

- **Desktop**: Layout expandido com melhor aproveitamento do espaço
- **Tablet**: Layout adaptativo com elementos reorganizados
- **Mobile**: Interface touch-friendly com navegação otimizada

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Verificação de código
npm run type-check   # Verificação de tipos
```

## 📄 Licença

Este projeto está sob a licença MIT.
