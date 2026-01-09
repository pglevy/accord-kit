#!/usr/bin/env node
import { existsSync, cpSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = resolve(__dirname, '../..');
const templateDir = resolve(projectRoot, 'templates/ui');
const targetDir = resolve(projectRoot, 'ui');

console.log('🚀 Initializing Skills-First UI...\n');

// Check if UI directory already exists
if (existsSync(targetDir)) {
  console.error('❌ Error: ui/ directory already exists.');
  console.error('   Remove it first if you want to reinitialize.');
  process.exit(1);
}

// Check if template exists
if (!existsSync(templateDir)) {
  console.error('❌ Error: UI template not found at templates/ui/');
  process.exit(1);
}

try {
  // Copy template to ui/
  console.log('📁 Copying UI template...');
  cpSync(templateDir, targetDir, { recursive: true });
  console.log('✅ Template copied to ui/\n');

  // Install dependencies
  console.log('📦 Installing dependencies...');
  console.log('   This may take a minute...\n');
  execSync('npm install', {
    cwd: targetDir,
    stdio: 'inherit'
  });
  console.log('\n✅ Dependencies installed\n');

  // Success message
  console.log('🎉 UI initialized successfully!\n');
  console.log('Next steps:');
  console.log('  1. cd ui');
  console.log('  2. npm run dev');
  console.log('\nThe UI will be available at http://localhost:5173');
  console.log('Make sure your backend is running on http://localhost:3000\n');
  console.log('See ui/README.md for more information.');

} catch (error) {
  console.error('\n❌ Error during initialization:', error);
  process.exit(1);
}
