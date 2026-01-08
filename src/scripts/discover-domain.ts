import { executeSkill } from '../skills/executor.js';
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  console.log('\n🎯 Domain Discovery\n');
  console.log('Let\'s define your domain and generate initial skills.\n');

  const domain = await question('What is your domain? (e.g., "support tickets", "e-commerce orders"): ');
  const users = await question('Who are the main users/actors?: ');
  const actions = await question('What are the key actions?: ');
  const decisions = await question('What decisions need to be made?: ');

  console.log('\n🤔 Generating skills...\n');

  const result = await executeSkill('domain-discovery', {
    domain,
    users,
    actions,
    decisions
  });

  console.log('\n📋 Domain Summary:\n');
  console.log(result.domain_summary);
  console.log('\nEntities:', result.entities.join(', '));

  console.log('\n📝 Generated Skills:\n');
  result.skills.forEach((skill: any, i: number) => {
    console.log(`${i + 1}. ${skill.name} - ${skill.description}`);
  });

  console.log('\n💾 Database Schema:\n');
  result.schema.tables.forEach((table: any) => {
    console.log(`Table: ${table.name}`);
    table.columns.forEach((col: string) => console.log(`  - ${col}`));
  });

  console.log('\n📘 TypeScript Interfaces:\n');
  console.log(result.schema.typescript);

  console.log('\n💡 Example Interactions:\n');
  result.examples.forEach((ex: string, i: number) => {
    console.log(`${i + 1}. ${ex}`);
  });

  console.log('\n❓ Next Questions to Explore:\n');
  result.next_questions.forEach((q: string, i: number) => {
    console.log(`${i + 1}. ${q}`);
  });

  const answer = await question('\n✅ Generate these files? (y/n): ');
  
  if (answer.toLowerCase() !== 'y') {
    console.log('❌ Cancelled.');
    rl.close();
    return;
  }

  // Create skill files
  const skillsDir = '.claude/skills';
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
  }

  result.skills.forEach((skill: any) => {
    const path = `${skillsDir}/${skill.filename}`;
    fs.writeFileSync(path, skill.content);
    console.log(`✓ Created ${path}`);
  });

  // Create schema file
  const schemaDir = 'src/schema';
  if (!fs.existsSync(schemaDir)) {
    fs.mkdirSync(schemaDir, { recursive: true });
  }
  fs.writeFileSync(`${schemaDir}/types.ts`, result.schema.typescript);
  console.log(`✓ Created ${schemaDir}/types.ts`);

  // Create database initialization
  const dbInit = `import Database from 'better-sqlite3';

const db = new Database('src/data/app.db');

${result.schema.tables.map((table: any) => 
  `db.exec(\`CREATE TABLE IF NOT EXISTS ${table.name} (
  ${table.columns.join(',\n  ')}
)\`);`
).join('\n\n')}

console.log('✓ Database initialized');
db.close();
`;

  const dataDir = 'src/data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(`${dataDir}/init.ts`, dbInit);
  console.log(`✓ Created ${dataDir}/init.ts`);

  console.log('\n✅ Setup complete!\n');
  console.log('Next steps:');
  console.log('  1. Run: npm run db:init');
  console.log('  2. Start testing your skills');
  console.log('  3. Iterate based on the refinement questions above\n');

  rl.close();
}

main().catch(console.error);
