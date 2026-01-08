# Getting Started with Skills-First Development

## Installation

```bash
git clone <your-repo>
cd skills-first-starter
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

## Two Ways to Start

### Option 1: Guided Discovery (Recommended)

Let the domain discovery skill interview you and generate everything:

```bash
npm run skill:discover
```

This will:
1. Ask about your domain
2. Generate initial skills
3. Create database schema
4. Provide example interactions
5. Suggest next steps

### Option 2: Manual Setup

Start from scratch:

```bash
# 1. Initialize database
npm run db:init

# 2. Create your first skill
touch .claude/skills/my-first-skill.md

# 3. Edit the skill (see templates/skill-template.md)

# 4. Test it
npm run cli
> test my-first-skill
```

## Your First Skill

Create `.claude/skills/hello-world.md`:

```markdown
# Hello World Skill

A simple skill to get started.

## Input Context
- name: The user's name

## Output Format
Return JSON:
{
  "greeting": "A friendly greeting",
  "timestamp": "Current time"
}

## Instructions
Generate a friendly greeting for the user and include the current timestamp.

## Example
Input: {"name": "Alice"}
Output: {"greeting": "Hello Alice! Welcome to Skills-First development!", "timestamp": "2024-01-07T10:30:00Z"}
```

Test it:
```bash
npm run cli
> test hello-world
> {"name": "Alice"}
```

## Building a Real Application

### Step 1: Define Your Domain (Day 1)

Think about:
- What's the core entity? (e.g., tickets, orders, posts)
- What actions happen? (e.g., create, assign, update)
- What decisions are made? (e.g., prioritize, route, approve)

Run discovery:
```bash
npm run skill:discover
```

### Step 2: Create Initial Skills (Day 1-2)

Start with 2-3 core skills:
- One for intake/creation
- One for processing/routing
- One for updates/communication

Example for a task management system:
```
.claude/skills/
  task-intake.md       # Parse task descriptions
  task-assignment.md   # Assign to team members
  task-updates.md      # Generate status updates
```

### Step 3: Test and Iterate (Week 1-2)

```bash
# Test via CLI
npm run cli
> test task-intake
> {"description": "Fix the login bug ASAP"}

# Or build a simple UI/API
# Skills work the same regardless of interface
```

Iterate on skills based on results:
- Add more examples
- Refine output format
- Handle edge cases
- Adjust decision logic

### Step 4: Identify Stable Fields (Week 2-3)

Notice which fields:
- Appear in every output
- Haven't changed structure
- Need to be queried/filtered

Example:
```json
// Week 1: Everything varies
{"title": "Bug", "urgent": true}
{"task": "Feature", "priority": "high"}

// Week 3: Pattern emerges
{"title": "Bug", "priority": "high", "type": "bug"}
{"title": "Feature", "priority": "medium", "type": "feature"}
```

### Step 5: Promote Stable Fields (Week 3-4)

```bash
npm run migrate:promote title
npm run migrate:promote priority
npm run migrate:promote type
```

Now you can:
```sql
SELECT * FROM tasks WHERE priority = 'high' ORDER BY created_at;
```

### Step 6: Build Your Interface (Week 4+)

With stable fields promoted, build:
- REST API with clear contracts
- React/Vue UI
- Mobile app
- Whatever you need

The skills remain the same, just the interface changes.

## Common Patterns

### Pattern 1: CRUD Application

Skills needed:
1. Entity creation (intake)
2. Entity updates (modification)
3. Entity queries (search/filter)
4. Entity deletion (cleanup)

### Pattern 2: Workflow Application

Skills needed:
1. Workflow initiation
2. State transitions
3. Assignment/routing
4. Notifications/updates

### Pattern 3: Content Application

Skills needed:
1. Content analysis
2. Content classification
3. Content moderation
4. Content recommendations

## Tips for Success

### Start Small
- 1-2 skills initially
- 1 entity type
- Happy path only
- Iterate quickly

### Embrace Flexibility
- Don't predict all fields upfront
- Let skills output what makes sense
- Store in skill_data JSON initially
- Promote only when stable

### Test Constantly
```bash
# Quick tests via CLI
npm run cli

# Automated tests
npm test

# Real usage
Build a minimal UI/API
```

### Document Learnings
Keep notes on:
- What fields emerged
- What decisions were hard
- What edge cases appeared
- When you promoted fields

### Involve Stakeholders
- PMs can edit skill markdown
- Designers can see outputs immediately
- Engineers focus on infrastructure
- Everyone iterates together

## Troubleshooting

### "No such skill"
```bash
# Check skills directory
ls .claude/skills/

# Skill name should match filename without .md
# File: ticket-intake.md
# Use: test ticket-intake
```

### "Invalid JSON response"
The skill might be returning markdown. Update the skill to explicitly say:
```markdown
Return ONLY valid JSON, no markdown formatting or explanation.
```

### "Field not found in database"
Field is still in skill_data. Either:
1. Access via JSON: `json_extract(skill_data, '$.fieldname')`
2. Promote it: `npm run migrate:promote fieldname`

### "Skill is too slow"
- Use streaming for long responses
- Cache common queries
- Optimize skill prompts
- Consider skill composition

## Next Steps

1. Read [Progressive Formalization Guide](./progressive-formalization.md)
2. Study [Ticket System Example](../examples/ticket-system/)
3. Learn [Writing Effective Skills](./writing-skills.md)
4. Understand [Migrations](./migrations.md)

## Getting Help

- Check the examples directory
- Read the documentation
- Review the ticket system implementation
- Experiment and iterate

Remember: Skills-First is about discovery, not prediction. Start flexible, harden progressively, only where needed.
