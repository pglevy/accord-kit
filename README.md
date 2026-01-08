# Skills-First Starter Template

A template for building applications using **Skills-First development** - where specifications emerge from usage rather than being defined upfront.

## What is Skills-First?

Traditional development:
```
Requirements → Detailed Spec → Implementation → Testing
    (rigid)   →    (rigid)    →    (rigid)     → (validate rigidity)
```

Skills-First development:
```
Intent → Skills (flexible) → Usage → Refinement → Hardening
(fuzzy) → (executable)     → (learning) → (progressive) → (selective rigidity)
```

**Key difference:** Behavior is discovered through interaction, not defined upfront.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Initialize your database
npm run db:init

# Start development
npm run dev
```

## 5-Minute Adaptation Guide

### 1. Define Your Domain (2 minutes)

Edit `.claude/skills/domain-discovery.md` and run:
```bash
npm run skill:discover
```

This will interview you about your domain and generate initial skills.

### 2. Update Schema Types (1 minute)

Edit `src/schema/types.ts` with your aspirational data model:
```typescript
interface YourEntity {
  id: number;
  // Fields you want eventually
  skill_data: Record<string, any>;  // Flexible overflow
}
```

### 3. Create Initial Database (1 minute)

```bash
npm run db:create-table YourEntity
```

### 4. Start Building (1 minute)

Modify skills in `.claude/skills/` and test immediately.

## Progressive Formalization

### Phase 1: Discovery (Weeks 1-3)
- Skills output to `skill_data` JSON
- Everything is flexible
- Rapid iteration

### Phase 2: Stabilization (Week 4+)
When a field is stable, promote it:
```bash
npm run migrate:promote <field-name>
```

This generates and optionally applies:
- SQL migration
- TypeScript type updates
- Backfill logic

### Phase 3: Hardening (As Needed)
- Promoted fields become API contracts
- Skills can still add new fields to `skill_data`
- Best of both worlds

## Project Structure

```
├── .claude/
│   └── skills/              # Skill definitions (markdown)
│       ├── domain-discovery.md
│       ├── schema-evolution.md
│       └── [your-skills].md
├── src/
│   ├── skills/              # Skill executor (reusable)
│   ├── schema/              # TypeScript types
│   ├── data/                # Database
│   └── migrations/          # Generated migrations
├── templates/               # Blank templates
└── examples/                # Reference implementation
```

## Core Concepts

### Skills Are Domain-Agnostic
The executor (`src/skills/`) works for any domain. Only the skill markdown files change.

### Types Guide Evolution
Your `schema/types.ts` defines the aspirational state. The database evolves toward it.

### Promote When Ready
Fields start in `skill_data` JSON. Promote to columns when you need to query/filter/sort.

## Example: Ticket System

See `examples/ticket-system/` for a complete reference implementation.

## Next Steps

1. Run `npm run skill:discover` to generate your first skills
2. Test them with `npm run cli` or build a UI
3. Iterate on skills until behavior feels right
4. Promote stable fields with `npm run migrate:promote`
5. Repeat

## Learn More

- [Progressive Formalization Guide](./docs/progressive-formalization.md)
- [Skill Writing Guide](./docs/writing-skills.md)
- [Migration Guide](./docs/migrations.md)
