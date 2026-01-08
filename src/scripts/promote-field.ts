import { executeSkill } from '../skills/executor.js';
import fs from 'fs';
import Database from 'better-sqlite3';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  const fieldName = process.argv[2];
  const tableName = process.argv[3] || 'main_table';

  if (!fieldName) {
    console.error('Usage: npm run migrate:promote <field-name> [table-name]');
    process.exit(1);
  }

  console.log(`\n🔄 Promoting field "${fieldName}" from skill_data to column...\n`);

  // Get sample data from database
  const db = new Database('src/data/app.db');
  const samples = db.prepare(`SELECT * FROM ${tableName} LIMIT 5`).all();
  
  // Read current TypeScript interface
  const typesPath = 'src/schema/types.ts';
  const currentTypes = fs.existsSync(typesPath) 
    ? fs.readFileSync(typesPath, 'utf-8')
    : 'interface Entity { id: number; skill_data: Record<string, any>; }';

  // Execute schema evolution skill
  const result = await executeSkill('schema-evolution', {
    field: fieldName,
    table: tableName,
    samples,
    current_types: currentTypes
  });

  // Display preview
  console.log('\n📋 Migration Preview:\n');
  console.log(result.preview);
  console.log('\n📊 Metadata:');
  console.log(`  Records affected: ${result.metadata.records_affected}`);
  console.log(`  Estimated time: ${result.metadata.estimated_time_ms}ms`);
  
  if (result.metadata.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.metadata.warnings.forEach((w: string) => console.log(`  - ${w}`));
  }

  console.log('\n📝 SQL Migration:');
  console.log('─'.repeat(60));
  console.log(result.migration_file.content);
  console.log('─'.repeat(60));

  console.log('\n📝 TypeScript Changes:');
  console.log('─'.repeat(60));
  console.log('BEFORE:');
  console.log(result.type_updates.before);
  console.log('\nAFTER:');
  console.log(result.type_updates.after);
  console.log('─'.repeat(60));

  // Ask for confirmation
  const answer = await question('\n✅ Apply this migration? (y/n): ');
  
  if (answer.toLowerCase() !== 'y') {
    console.log('❌ Migration cancelled.');
    rl.close();
    db.close();
    return;
  }

  // Apply migration
  console.log('\n🚀 Applying migration...');
  
  // Save migration file
  const migrationDir = 'src/migrations';
  if (!fs.existsSync(migrationDir)) {
    fs.mkdirSync(migrationDir, { recursive: true });
  }
  
  const migrationPath = `${migrationDir}/${result.migration_file.filename.split('/').pop()}`;
  fs.writeFileSync(migrationPath, result.migration_file.content);
  console.log(`✓ Saved migration: ${migrationPath}`);

  // Execute SQL
  db.exec(result.migration_file.content);
  console.log('✓ Executed SQL migration');

  // Update TypeScript types
  fs.writeFileSync(typesPath, result.type_updates.after);
  console.log(`✓ Updated types: ${typesPath}`);

  console.log('\n✅ Migration complete!\n');

  rl.close();
  db.close();
}

main().catch(console.error);
