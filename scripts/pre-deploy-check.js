// Script de validação final antes do deploy
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const NEON_DATABASE_URL = 'postgresql://neondb_owner:npg_xvQSGn5Jh1WO@ep-gentle-resonance-adjqg2f0-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function runPreDeployChecks() {
  console.log('🚀 Executando verificações pré-deploy...\n');
  
  let allChecksPass = true;
  
  // 1. Verificar build de produção
  console.log('1️⃣ Verificando build de produção...');
  try {
    if (fs.existsSync('.next')) {
      console.log('   ✅ Build encontrado em .next/');
    } else {
      console.log('   ❌ Build não encontrado. Execute: npm run build');
      allChecksPass = false;
    }
  } catch (error) {
    console.log('   ❌ Erro ao verificar build:', error.message);
    allChecksPass = false;
  }
  
  // 2. Verificar conexão com banco Neon
  console.log('\n2️⃣ Verificando conexão com banco Neon...');
  const prisma = new PrismaClient({
    datasources: {
      db: { url: NEON_DATABASE_URL }
    }
  });
  
  try {
    await prisma.$connect();
    console.log('   ✅ Conexão com banco estabelecida');
    
    // Verificar tabelas essenciais
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('User', 'Account', 'Session', 'Cliente', 'Orcamento')
    `;
    
    const expectedTables = ['User', 'Account', 'Session', 'Cliente', 'Orcamento'];
    const foundTables = tables.map(t => t.table_name);
    
    for (const table of expectedTables) {
      if (foundTables.includes(table)) {
        console.log(`   ✅ Tabela ${table} encontrada`);
      } else {
        console.log(`   ❌ Tabela ${table} não encontrada`);
        allChecksPass = false;
      }
    }
    
  } catch (error) {
    console.log('   ❌ Erro na conexão com banco:', error.message);
    allChecksPass = false;
  } finally {
    await prisma.$disconnect();
  }
  
  // 3. Verificar arquivos essenciais
  console.log('\n3️⃣ Verificando arquivos essenciais...');
  const essentialFiles = [
    'package.json',
    'next.config.js',
    'prisma/schema.prisma',
    'src/env.js',
    'vercel.json',
    '.env.production.example'
  ];
  
  for (const file of essentialFiles) {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} não encontrado`);
      allChecksPass = false;
    }
  }
  
  // 4. Verificar configuração do Vercel
  console.log('\n4️⃣ Verificando configuração do Vercel...');
  try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    
    if (vercelConfig.version === 2) {
      console.log('   ✅ Versão do Vercel configurada');
    }
    
    if (vercelConfig.framework === 'nextjs') {
      console.log('   ✅ Framework Next.js configurado');
    }
    
    if (vercelConfig.functions && vercelConfig.functions['src/app/api/**/*.ts']) {
      console.log('   ✅ Configuração de funções API');
    }
    
  } catch (error) {
    console.log('   ❌ Erro ao ler vercel.json:', error.message);
    allChecksPass = false;
  }
  
  // 5. Verificar variáveis de ambiente de exemplo
  console.log('\n5️⃣ Verificando arquivo de exemplo de variáveis...');
  try {
    const envExample = fs.readFileSync('.env.production.example', 'utf8');
    
    const requiredVars = [
      'AUTH_SECRET',
      'DATABASE_URL',
      'NODE_ENV',
      'NEXTAUTH_URL'
    ];
    
    for (const varName of requiredVars) {
      if (envExample.includes(varName)) {
        console.log(`   ✅ ${varName} documentado`);
      } else {
        console.log(`   ❌ ${varName} não documentado`);
        allChecksPass = false;
      }
    }
    
  } catch (error) {
    console.log('   ❌ Erro ao ler .env.production.example:', error.message);
    allChecksPass = false;
  }
  
  // Resultado final
  console.log('\n' + '='.repeat(50));
  if (allChecksPass) {
    console.log('🎉 TODAS AS VERIFICAÇÕES PASSARAM!');
    console.log('✅ Projeto pronto para deploy na Vercel');
    console.log('\n📋 Próximos passos:');
    console.log('1. Commit e push das mudanças');
    console.log('2. Criar projeto na Vercel');
    console.log('3. Configurar variáveis de ambiente');
    console.log('4. Fazer deploy');
    console.log('\n📖 Consulte DEPLOY_VERCEL.md para instruções detalhadas');
  } else {
    console.log('❌ ALGUMAS VERIFICAÇÕES FALHARAM');
    console.log('🔧 Corrija os problemas acima antes do deploy');
  }
  console.log('='.repeat(50));
  
  return allChecksPass;
}

runPreDeployChecks()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Erro durante verificações:', error);
    process.exit(1);
  });