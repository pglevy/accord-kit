# Progressive Formalization Guide

## The Skills-First Philosophy

Start flexible, harden progressively, only where needed.

## The Three Phases

### Phase 1: Discovery (Weeks 1-3)

**Goal:** Learn what the system should do through usage

**Approach:**
- Write skills as conversational markdown
- Store all outputs in `skill_data` JSON
- Change skills freely based on feedback
- No schema constraints

**Example:**
```markdown
# Order Processing Skill

Look at this order and figure out:
- Is it urgent?
- Who should handle it?
- Any special requirements?

Return whatever seems relevant as JSON.
```

**Database:**
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  skill_data TEXT  -- Everything goes here
);
```

### Phase 2: Stabilization (Week 4+)

**Goal:** Identify patterns that work consistently

**Approach:**
- Notice which fields are always present
- Notice which fields are queried/filtered
- Promote stable fields to columns
- Keep experimental fields in JSON

**Example:**
```bash
# These fields are stable and queried
npm run migrate:promote status
npm run migrate:promote priority
npm run migrate:promote assigned_to
```

**Database:**
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  status TEXT,           -- Promoted
  priority TEXT,         -- Promoted
  assigned_to TEXT,      -- Promoted
  skill_data TEXT        -- Still flexible
);
```

### Phase 3: Hardening (As Needed)

**Goal:** Add constraints only where business requires them

**Approach:**
- Add validation for critical fields
- Create indexes for performance
- Define API contracts
- Keep non-critical fields flexible

**Example:**
```sql
ALTER TABLE orders ADD CONSTRAINT check_status 
  CHECK (status IN ('pending', 'processing', 'complete'));

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_priority ON orders(priority);
```

## Decision Framework

### When to Promote a Field

Promote when:
- ✅ Field appears in 90%+ of records
- ✅ UI needs to filter/sort by it
- ✅ Multiple features depend on it
- ✅ Structure hasn't changed in 2+ weeks

Keep in JSON when:
- ❌ Still experimenting with structure
- ❌ Only displayed, never queried
- ❌ Varies significantly between records
- ❌ Changes frequently

### When to Add Constraints

Add constraints when:
- ✅ Invalid data causes system failures
- ✅ Business rules are well-defined
- ✅ Field is critical for compliance/security

Keep flexible when:
- ❌ Requirements are still evolving
- ❌ Edge cases are common
- ❌ Validation is better handled in skills

## Real-World Example

### Week 1: Pure Discovery
```markdown
# Support Ticket Intake

Extract whatever seems important from this customer message.
```

Output varies wildly:
```json
{"issue": "can't login"}
{"problem": "password reset", "urgent": true}
{"customer_complaint": "site is slow", "browser": "chrome"}
```

### Week 3: Patterns Emerge
```markdown
# Support Ticket Intake

Extract:
- title: brief summary
- description: full details
- category: technical/billing/general
- priority: low/medium/high
```

Output is consistent:
```json
{
  "title": "Login issue",
  "description": "Can't access account",
  "category": "technical",
  "priority": "high"
}
```

### Week 5: Promote Stable Fields
```bash
npm run migrate:promote title
npm run migrate:promote category
npm run migrate:promote priority
```

Now:
- Can query: "Show all high priority technical tickets"
- Can sort: "Order by priority"
- Can index: Fast lookups
- Still flexible: New fields can be added to skill_data

### Week 8: Add Constraints
```sql
ALTER TABLE tickets ADD CONSTRAINT check_priority
  CHECK (priority IN ('low', 'medium', 'high'));
```

Only after we're certain these are the only valid values.

## Anti-Patterns

### ❌ Premature Hardening
```sql
-- Week 1: DON'T DO THIS
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('technical', 'billing')),
  priority INTEGER CHECK (priority BETWEEN 1 AND 5),
  ...
);
```

Problem: Requirements will change, schema migrations are painful.

### ❌ Eternal Flexibility
```sql
-- Week 20: DON'T DO THIS
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY,
  skill_data TEXT  -- Everything still in JSON
);
```

Problem: Can't query efficiently, no data integrity, unclear contracts.

### ✅ Progressive Formalization
```sql
-- Week 1
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY,
  skill_data TEXT
);

-- Week 5
ALTER TABLE tickets ADD COLUMN priority TEXT;
ALTER TABLE tickets ADD COLUMN category TEXT;

-- Week 8
CREATE INDEX idx_tickets_priority ON tickets(priority);
ALTER TABLE tickets ADD CONSTRAINT check_priority 
  CHECK (priority IN ('low', 'medium', 'high'));
```

Problem: Balanced - flexible where needed, structured where valuable.

## Key Principles

1. **Start with JSON** - Cheapest to change
2. **Promote when stable** - Move to columns for queries
3. **Constrain when critical** - Add validation only when necessary
4. **Keep escape hatches** - Always have skill_data for new fields
5. **Let usage guide structure** - Don't predict, observe

## Measuring Success

You're doing it right when:
- New features can be tested in hours, not days
- Schema changes are rare and deliberate
- Most fields are promoted within 2-4 weeks
- skill_data is 10-30% of total data
- Team spends more time on features than migrations
