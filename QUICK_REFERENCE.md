# Skills-First Quick Reference

## Setup (5 minutes)
```bash
npm install
cp .env.example .env
# Add ANTHROPIC_API_KEY to .env
npm run skill:discover
npm run db:init
```

## Commands
```bash
npm run skill:discover      # Generate project from domain
npm run db:init            # Initialize database
npm run cli                # Test skills interactively
npm run migrate:promote    # Promote field to column
npm run dev                # Start development
```

## The 3 Phases

### Phase 1: Discovery (Week 1-3)
- Write skills in markdown
- Store everything in `skill_data` JSON
- Change freely, iterate quickly
- No schema constraints

### Phase 2: Stabilization (Week 4+)
- Identify stable fields
- Promote to columns: `npm run migrate:promote <field>`
- Keep experimental fields in JSON
- Add indexes for queries

### Phase 3: Hardening (As Needed)
- Add constraints for critical fields
- Create API contracts
- Optimize performance
- Maintain flexibility elsewhere

## Skill Template
```markdown
# Skill Name

Brief description.

## Input Context
- field1: description
- field2: description

## Output Format
{
  "field1": "value",
  "field2": "value"
}

## Instructions
1. Step one
2. Step two
3. Return JSON

## Examples
[Show 2-3 examples]
```

## When to Promote a Field

✅ Promote when:
- Appears in 90%+ of records
- Need to query/filter/sort by it
- Structure stable for 2+ weeks
- Multiple features depend on it

❌ Keep in JSON when:
- Still experimenting
- Only displayed, not queried
- Varies between records
- Changes frequently

## Database Pattern
```sql
CREATE TABLE entities (
  id INTEGER PRIMARY KEY,
  created_at TEXT,
  
  -- Promoted fields (stable, queryable)
  status TEXT,
  priority TEXT,
  
  -- Everything else (flexible)
  skill_data TEXT
);
```

## File Structure
```
├── .claude/skills/          # Skill definitions
├── src/
│   ├── skills/executor.ts   # Skill engine (reusable)
│   ├── schema/types.ts      # TypeScript types
│   ├── data/init.ts         # Database setup
│   └── scripts/             # Automation
├── docs/                    # Guides
├── examples/                # Reference implementations
└── templates/               # Blank templates
```

## Testing Skills
```bash
# Via CLI
npm run cli
> test skill-name
> {"input": "data"}

# Via code
import { executeSkill } from './skills/executor';
const result = await executeSkill('skill-name', context);
```

## Common Patterns

### CRUD
- entity-creation.md
- entity-updates.md
- entity-queries.md
- entity-deletion.md

### Workflow
- workflow-initiation.md
- state-transitions.md
- assignment-routing.md
- notifications.md

### Content
- content-analysis.md
- content-classification.md
- content-moderation.md
- content-recommendations.md

## Troubleshooting

**"No such skill"**
- Check filename matches: `ticket-intake.md` → `test ticket-intake`

**"Invalid JSON"**
- Add to skill: "Return ONLY valid JSON, no markdown"

**"Field not found"**
- Still in JSON: `json_extract(skill_data, '$.field')`
- Or promote: `npm run migrate:promote field`

## Key Principles

1. **Start flexible** - JSON first
2. **Promote when stable** - Columns for queries
3. **Constrain when critical** - Validation last
4. **Keep escape hatches** - Always have skill_data
5. **Let usage guide structure** - Observe, don't predict

## Resources

- `docs/getting-started.md` - Full tutorial
- `docs/progressive-formalization.md` - The methodology
- `docs/writing-skills.md` - Skill authoring
- `docs/migrations.md` - Database evolution
- `examples/ticket-system/` - Working example

## Success Metrics

✅ Features tested in hours
✅ Skills change more than schema
✅ Non-engineers modify behavior
✅ Rare schema changes
✅ Fields promoted in 2-4 weeks
✅ skill_data is 10-30% of data

---

**Remember:** Discover through usage, formalize progressively, harden selectively.
