#!/usr/bin/env node

/**
 * Script de validação para produção
 * Verifica se todas as configurações necessárias estão presentes
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');

console.log('🔍 Validando configuração para produção...\n');

let hasErrors = false;

// Verificar arquivos essenciais
const essentialFiles = [
  'package.json',
  'prisma/schema.prisma',
  'src/env.js',
  'vercel.json',
  '.env.production.example'
];

console.log('📁 Verificando arquivos essenciais:');
essentialFiles.forEach(file => {
  const filePath = join(projectRoot, file);
  if (existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - ARQUIVO FALTANDO`);
    hasErrors = true;
  }
});

// Verificar package.json
console.log('\n📦 Verificando package.json:');
try {
  const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
  
  const requiredDeps = [
    '@prisma/client',
    'next-auth',
    '@auth/prisma-adapter',
    'bcryptjs'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - DEPENDÊNCIA FALTANDO`);
      hasErrors = true;
    }
  });
  
  // Verificar scripts
  const requiredScripts = ['build', 'start', 'db:migrate'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts[script]) {
      console.log(`✅ Script ${script}: ${packageJson.scripts[script]}`);
    } else {
      console.log(`❌ Script ${script} - SCRIPT FALTANDO`);
      hasErrors = true;
    }
  });
} catch (error) {
  console.log(`❌ Erro ao ler package.json: ${error instanceof Error ? error.message : String(error)}`);
  hasErrors = true;
}

// Verificar schema do Prisma
console.log('\n🗄️ Verificando schema do Prisma:');
try {
  const schema = readFileSync(join(projectRoot, 'prisma/schema.prisma'), 'utf8');
  
  if (schema.includes('provider = "postgresql"')) {
    console.log('✅ Provider PostgreSQL configurado');
  } else {
    console.log('❌ Provider PostgreSQL não encontrado');
    hasErrors = true;
  }
  
  if (schema.includes('url      = env("DATABASE_URL")') || schema.includes('url = env("DATABASE_URL")')) {
    console.log('✅ DATABASE_URL configurada');
  } else {
    console.log('❌ DATABASE_URL não configurada');
    hasErrors = true;
  }
  
  // Verificar modelos essenciais para NextAuth
  const requiredModels = ['User', 'Account', 'Session', 'VerificationToken'];
  requiredModels.forEach(model => {
    if (schema.includes(`model ${model}`)) {
      console.log(`✅ Modelo ${model} encontrado`);
    } else {
      console.log(`❌ Modelo ${model} não encontrado`);
      hasErrors = true;
    }
  });
} catch (error) {
  console.log(`❌ Erro ao ler schema.prisma: ${error instanceof Error ? error.message : String(error)}`);
  hasErrors = true;
}

// Verificar configuração do env.js
console.log('\n🔧 Verificando configuração de ambiente:');
try {
  const envConfig = readFileSync(join(projectRoot, 'src/env.js'), 'utf8');
  
  const requiredEnvVars = ['AUTH_SECRET', 'DATABASE_URL'];
  requiredEnvVars.forEach(envVar => {
    if (envConfig.includes(envVar)) {
      console.log(`✅ ${envVar} configurada`);
    } else {
      console.log(`❌ ${envVar} não configurada`);
      hasErrors = true;
    }
  });
} catch (error) {
  console.log(`❌ Erro ao ler env.js: ${error instanceof Error ? error.message : String(error)}`);
  hasErrors = true;
}

// Verificar vercel.json
console.log('\n🚀 Verificando configuração da Vercel:');
try {
  const vercelConfig = JSON.parse(readFileSync(join(projectRoot, 'vercel.json'), 'utf8'));
  
  if (vercelConfig.framework === 'nextjs') {
    console.log('✅ Framework NextJS configurado');
  } else {
    console.log('❌ Framework NextJS não configurado');
    hasErrors = true;
  }
  
  if (vercelConfig.functions && vercelConfig.functions['src/app/api/**/*.ts']) {
    console.log('✅ Configuração de funções API encontrada');
  } else {
    console.log('❌ Configuração de funções API não encontrada');
    hasErrors = true;
  }
} catch (error) {
  console.log(`❌ Erro ao ler vercel.json: ${error instanceof Error ? error.message : String(error)}`);
  hasErrors = true;
}

// Resultado final
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ VALIDAÇÃO FALHOU - Corrija os erros antes do deploy');
  process.exit(1);
} else {
  console.log('✅ VALIDAÇÃO PASSOU - Aplicação pronta para produção!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Configure as variáveis de ambiente na Vercel');
  console.log('2. Execute: npx prisma migrate deploy (no banco Neon)');
  console.log('3. Execute: vercel --prod');
}