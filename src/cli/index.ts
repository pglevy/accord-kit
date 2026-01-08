import readline from 'readline';
import { executeSkill } from '../skills/executor.js';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🎯 Skills-First CLI\n');
console.log('Available commands:');
console.log('  list skills    - Show all available skills');
console.log('  test <skill>   - Test a skill with sample data');
console.log('  quit           - Exit\n');

function question(prompt: string): Promise<string> {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function listSkills() {
  const skillsDir = '.claude/skills';
  if (!fs.existsSync(skillsDir)) {
    console.log('No skills directory found. Run: npm run skill:discover');
    return;
  }
  
  const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'));
  console.log('\nAvailable skills:');
  files.forEach(f => console.log(`  - ${f.replace('.md', '')}`));
  console.log();
}

async function testSkill(skillName: string) {
  console.log(`\nTesting skill: ${skillName}`);
  console.log('Enter context as JSON (or press Enter for empty context):');
  
  const contextInput = await question('> ');
  const context = contextInput.trim() ? JSON.parse(contextInput) : {};
  
  try {
    const result = await executeSkill(skillName, context);
    console.log('\nResult:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error('Error:', error.message);
  }
  console.log();
}

async function main() {
  while (true) {
    const input = await question('> ');
    const [command, ...args] = input.trim().split(' ');
    
    if (command === 'quit' || command === 'exit') {
      console.log('Goodbye!');
      rl.close();
      break;
    }
    
    if (command === 'list' && args[0] === 'skills') {
      await listSkills();
      continue;
    }
    
    if (command === 'test' && args[0]) {
      await testSkill(args[0]);
      continue;
    }
    
    console.log('Unknown command. Try: list skills, test <skill>, or quit\n');
  }
}

main().catch(console.error);
