const fs = require('fs');
const { execSync } = require('child_process');

const checklist = [
  { label: 'Arquivo .env presente', check: () => fs.existsSync('.env') },
  { label: 'Backup recente presente', check: () => fs.existsSync('backup.sql') },
  { label: 'Script de rollback presente', check: () => fs.existsSync('scripts/rollback.sql') },
  { label: 'Build de produção compila', check: () => {
      try { execSync('npm run build', { stdio: 'ignore' }); return true; } catch { return false; }
    }
  },
  { label: 'Testes unitários passam', check: () => {
      try { execSync('npm run test', { stdio: 'ignore' }); return true; } catch { return false; }
    }
  },
  { label: 'Lint sem erros', check: () => {
      try { execSync('npm run lint', { stdio: 'ignore' }); return true; } catch { return false; }
    }
  }
];

console.log('--- Checklist de Produção ---');
let allOk = true;
for (const item of checklist) {
  const ok = item.check();
  allOk = allOk && ok;
  console.log(`${ok ? '✔️' : '❌'} ${item.label}`);
}
if (allOk) {
  console.log('\nTudo pronto para produção!');
} else {
  console.log('\nPendências encontradas. Corrija antes de prosseguir com o deploy.');
} 