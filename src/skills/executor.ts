import fs from 'fs';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function executeSkill(skillName: string, context: Record<string, any>): Promise<any> {
  const skillPath = `.claude/skills/${skillName}.md`;
  const skillPrompt = fs.readFileSync(skillPath, 'utf-8');

  console.log(`[${skillName}] Executing skill...`);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `${skillPrompt}\n\n---\n\nContext:\n${JSON.stringify(context, null, 2)}\n\nRespond with ONLY valid JSON, no markdown or explanation.`
    }]
  });

  const textContent = response.content.find(c => c.type === 'text');
  if (!textContent || textContent.type !== 'text') throw new Error('No text response from skill');

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in response');

  const result = JSON.parse(jsonMatch[0]);
  console.log(`[${skillName}] Result:`, JSON.stringify(result, null, 2));
  return result;
}
