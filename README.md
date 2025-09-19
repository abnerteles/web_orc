# Sistema de Gestão de Orçamentos e Obras

Um sistema completo para gestão de orçamentos de obras e construção civil, desenvolvido como Progressive Web App (PWA).

## 🚀 Deploy na Vercel

### Pré-requisitos
- Conta na [Vercel](https://vercel.com)
- Git instalado
- Node.js (opcional, para desenvolvimento local)

### Passos para Deploy

1. **Preparar o repositório Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Conectar com GitHub/GitLab:**
   - Crie um repositório no GitHub
   - Faça push do código:
   ```bash
   git remote add origin https://github.com/seu-usuario/gestao-orcamentos.git
   git push -u origin main
   ```

3. **Deploy na Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório
   - A Vercel detectará automaticamente as configurações do `vercel.json`
   - Clique em "Deploy"

### Configurações Automáticas

O projeto já está configurado com:
- ✅ `vercel.json` - Configurações de build e rotas
- ✅ `package.json` - Metadados do projeto
- ✅ `index.html` - Ponto de entrada
- ✅ Service Worker otimizado
- ✅ Redirecionamentos para SPA
- ✅ Headers para PWA

### Funcionalidades

- 📊 Dashboard com estatísticas
- 📝 Gestão de orçamentos
- 🏗️ Controle de obras
- 📱 Progressive Web App
- 💾 Armazenamento local
- 📄 Exportação PDF/Excel
- 🔄 Backup/Restore
- 📊 Gráficos e relatórios

### Desenvolvimento Local

```bash
# Instalar dependências (opcional)
npm install

# Executar servidor local
npm run dev
# ou
python -m http.server 8080
```

### Estrutura do Projeto

```
├── Orçamento.html      # Aplicação principal
├── index.html          # Ponto de entrada
├── sw.js              # Service Worker
├── manifest.json      # Manifesto PWA
├── vercel.json        # Configurações Vercel
├── package.json       # Metadados do projeto
├── favicon.ico        # Ícone principal
├── favicon-16x16.png  # Ícone 16x16
├── favicon-32x32.png  # Ícone 32x32
└── README.md          # Este arquivo
```

### Suporte

Para dúvidas ou problemas, consulte a documentação da [Vercel](https://vercel.com/docs).