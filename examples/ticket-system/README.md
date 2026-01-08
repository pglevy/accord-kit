# Ticket System Example

This is a complete reference implementation of a support ticket management system built with Skills-First development.

## Structure

```
ticket-system/
├── .claude/skills/          # The 4 core skills
│   ├── ticket-intake.md
│   ├── assignment-routing.md
│   ├── status-updates.md
│   └── escalation-detection.md
├── schema/
│   └── types.ts            # TypeScript interfaces
└── README.md
```

## The Skills

### 1. Ticket Intake
Parses customer requests, categorizes issues, and determines priority.

**Input:** Raw customer message
**Output:** Structured ticket data

### 2. Assignment & Routing
Matches tickets to appropriate agents based on expertise and workload.

**Input:** Ticket + available agents
**Output:** Assignment recommendation

### 3. Status Updates
Generates customer-facing status updates and communications.

**Input:** Ticket + status change
**Output:** Customer message

### 4. Escalation Detection
Identifies tickets that need management attention.

**Input:** Ticket + history
**Output:** Escalation recommendation

## How It Evolved

### Week 1: Discovery
- Started with just ticket-intake skill
- Stored everything in JSON
- Learned what fields were actually needed

### Week 2: Expansion
- Added assignment-routing skill
- Realized we needed agent data
- Added status-updates for customer comms

### Week 3: Refinement
- Added escalation-detection
- Promoted key fields: status, priority, category
- Kept experimental fields in skill_data

### Week 4: Hardening
- Added indexes for common queries
- Created API contracts
- Maintained flexibility for new features

## Key Learnings

1. **Started with 1 skill, ended with 4** - Composition emerged naturally
2. **Schema evolved with usage** - Didn't predict all fields upfront
3. **Skills are interface-agnostic** - Same skills work in CLI and UI
4. **Progressive formalization worked** - Hardened only what needed it

## Adapting This Example

To adapt for your domain:

1. **Replace entities:** Tickets → Your domain entity
2. **Modify skills:** Change the business logic
3. **Update schema:** Adjust fields and types
4. **Keep the pattern:** Discovery → Stabilization → Hardening

## Running This Example

From the main project:
```bash
# Copy to your project
cp -r examples/ticket-system/.claude .
cp examples/ticket-system/schema/types.ts src/schema/

# Initialize database
npm run db:init

# Test skills
npm run cli
> test ticket-intake
```
