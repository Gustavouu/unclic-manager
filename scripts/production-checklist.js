
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 Checklist de Produção - Sistema de Gestão');
console.log('=' .repeat(50));

const checks = [
  {
    name: 'Verificar variáveis de ambiente',
    check: () => {
      const requiredVars = [
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY'
      ];
      
      const missing = requiredVars.filter(varName => !process.env[varName]);
      
      if (missing.length > 0) {
        throw new Error(`Variáveis de ambiente faltando: ${missing.join(', ')}`);
      }
      
      return true;
    }
  },
  {
    name: 'Verificar arquivo .env',
    check: () => fs.existsSync('.env') || fs.existsSync('.env.local')
  },
  {
    name: 'Verificar build de produção',
    check: () => {
      try {
        console.log('   Executando build...');
        execSync('npm run build', { stdio: 'ignore' });
        return fs.existsSync('dist');
      } catch {
        return false;
      }
    }
  },
  {
    name: 'Verificar testes TypeScript',
    check: () => {
      try {
        console.log('   Verificando tipos...');
        execSync('npx tsc --noEmit', { stdio: 'ignore' });
        return true;
      } catch {
        return false;
      }
    }
  },
  {
    name: 'Verificar estrutura do projeto',
    check: () => {
      const requiredDirs = [
        'src/components',
        'src/pages',
        'src/hooks',
        'src/services',
        'src/utils'
      ];
      
      return requiredDirs.every(dir => fs.existsSync(dir));
    }
  },
  {
    name: 'Verificar configurações de produção',
    check: () => {
      const viteConfig = fs.existsSync('vite.config.ts');
      const packageJson = fs.existsSync('package.json');
      return viteConfig && packageJson;
    }
  },
  {
    name: 'Verificar dependências de segurança',
    check: () => {
      try {
        console.log('   Auditando dependências...');
        execSync('npm audit --audit-level moderate', { stdio: 'ignore' });
        return true;
      } catch {
        console.log('   ⚠️  Vulnerabilidades encontradas - verifique com npm audit');
        return false;
      }
    }
  },
  {
    name: 'Verificar tamanho do bundle',
    check: () => {
      if (!fs.existsSync('dist')) return false;
      
      const stats = execSync('du -sh dist', { encoding: 'utf-8' });
      const size = stats.split('\t')[0];
      console.log(`   Tamanho do bundle: ${size}`);
      
      // Considerar OK se for menor que 10MB
      const sizeInMB = parseFloat(size.replace(/[^0-9.]/g, ''));
      return sizeInMB < 10;
    }
  },
  {
    name: 'Verificar configurações de cache',
    check: () => {
      // Verifica se o serviço de cache está implementado
      return fs.existsSync('src/services/cache/CacheService.ts');
    }
  },
  {
    name: 'Verificar monitoramento de erros',
    check: () => {
      // Verifica se o serviço de erros está implementado
      return fs.existsSync('src/services/error/ErrorHandlingService.ts');
    }
  }
];

let passed = 0;
let failed = 0;

console.log('\nExecutando verificações...\n');

checks.forEach((check, index) => {
  process.stdout.write(`${index + 1}. ${check.name}... `);
  
  try {
    const result = check.check();
    if (result) {
      console.log('✅ PASSOU');
      passed++;
    } else {
      console.log('❌ FALHOU');
      failed++;
    }
  } catch (error) {
    console.log(`❌ FALHOU - ${error.message}`);
    failed++;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Resultado: ${passed} passou, ${failed} falhou`);

if (failed === 0) {
  console.log('🎉 Todos os checks passaram! Pronto para produção!');
  process.exit(0);
} else {
  console.log('⚠️  Alguns checks falharam. Corrija os problemas antes do deploy.');
  console.log('\nDicas para correção:');
  console.log('- Configure as variáveis de ambiente necessárias');
  console.log('- Execute npm install para instalar dependências');
  console.log('- Corrija erros de TypeScript se houver');
  console.log('- Otimize o bundle se estiver muito grande');
  process.exit(1);
}
