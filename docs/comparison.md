# Skills-First vs Traditional Development

## Side-by-Side Comparison

### Building a Support Ticket System

#### Traditional Approach

**Week 1: Requirements Gathering**
```
Product Manager writes:
- 50-page requirements document
- Complete data model
- All edge cases
- API specifications
```

**Week 2-3: Design**
```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) CHECK (category IN ('technical', 'billing', 'general')),
  priority INTEGER CHECK (priority BETWEEN 1 AND 5),
  status VARCHAR(50) CHECK (status IN ('new', 'assigned', 'in_progress', 'resolved')),
  assigned_to UUID REFERENCES agents(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  escalated BOOLEAN DEFAULT FALSE,
  sla_deadline TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_assigned ON tickets(assigned_to);
-- ... 10 more indexes
```

**Week 4-6: Implementation**
```typescript
// Rigid API
interface CreateTicketRequest {
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'general';
  priority: 1 | 2 | 3 | 4 | 5;
}

// Validation logic
if (!isValidEmail(request.customerEmail)) throw new Error();
if (request.subject.length > 500) throw new Error();
if (![1,2,3,4,5].includes(request.priority)) throw new Error();
// ... 50 more validations
```

**Week 7: Testing**
```
Discover: Requirements were wrong
- Need "urgent" priority (not just 1-5)
- Need multiple categories per ticket
- Need to track multiple contacts
```

**Week 8-10: Painful Migration**
```sql
-- Migration 001: Add urgent priority
ALTER TABLE tickets DROP CONSTRAINT check_priority;
ALTER TABLE tickets ADD CONSTRAINT check_priority 
  CHECK (priority IN (1,2,3,4,5,6));

-- Migration 002: Multiple categories
CREATE TABLE ticket_categories (
  ticket_id UUID REFERENCES tickets(id),
  category VARCHAR(50),
  PRIMARY KEY (ticket_id, category)
);
-- Migrate existing data...

-- Migration 003: Multiple contacts
CREATE TABLE ticket_contacts (
  id UUID PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id),
  name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50)
);
-- Migrate existing data...
```

**Total Time: 10 weeks**
**Lines of Code: 5,000+**
**Migrations: 3 painful ones**
**Team Morale: Low**

---

#### Skills-First Approach

**Day 1: Discovery**
```bash
npm run skill:discover
```

Answer questions:
- Domain: "support tickets"
- Users: "customers and agents"
- Actions: "create, assign, resolve"
- Decisions: "prioritization, routing"

**Generated:**
```markdown
# Ticket Intake Skill

Extract from customer message:
- What's the issue?
- How urgent is it?
- Who's affected?

Return as JSON.
```

```sql
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY,
  created_at TEXT,
  skill_data TEXT  -- Everything goes here
);
```

**Day 2-3: Test and Iterate**
```bash
npm run cli
> test ticket-intake
> {"message": "Can't login, urgent!"}

Result: {
  "issue": "login problem",
  "urgency": "high",
  "category": "technical"
}
```

Iterate on skill:
```markdown
# Updated: Also extract customer info
- customer_name
- customer_email
- affected_users
```

**Week 2: Real Usage**
```
Build simple UI
Connect to skill
Users start creating tickets
Observe what data actually matters
```

**Week 3: Patterns Emerge**
```json
// Consistent fields appearing:
{
  "title": "...",
  "priority": "high",
  "category": "technical",
  "customer_name": "...",
  "customer_email": "..."
}
```

**Week 4: Promote Stable Fields**
```bash
npm run migrate:promote title
npm run migrate:promote priority
npm run migrate:promote category
```

**Generated migration:**
```sql
ALTER TABLE tickets ADD COLUMN title TEXT;
ALTER TABLE tickets ADD COLUMN priority TEXT;
ALTER TABLE tickets ADD COLUMN category TEXT;

UPDATE tickets 
SET title = json_extract(skill_data, '$.title'),
    priority = json_extract(skill_data, '$.priority'),
    category = json_extract(skill_data, '$.category');
```

**Week 5: New Requirement**
PM: "We need to track multiple contacts per ticket"

**Traditional:** 2-week migration, API changes, UI updates

**Skills-First:**
```markdown
# Update skill (5 minutes)
Extract:
- contacts: array of {name, email, role}
```

Works immediately. Promote later if needed.

**Total Time: 5 weeks**
**Lines of Code: 500**
**Migrations: 1 automated one**
**Team Morale: High**

---

## Key Differences

### Requirements

**Traditional:**
- Predict everything upfront
- 50-page documents
- Months of planning
- Often wrong

**Skills-First:**
- Start with fuzzy intent
- 1-page skill definition
- Hours of setup
- Learn through usage

### Schema

**Traditional:**
```sql
-- Week 1: Complete schema
CREATE TABLE tickets (
  -- 20 columns defined upfront
  -- 10 constraints
  -- 15 indexes
  -- 5 foreign keys
);
```

**Skills-First:**
```sql
-- Week 1: Minimal schema
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY,
  skill_data TEXT
);

-- Week 4: Promote what matters
ALTER TABLE tickets ADD COLUMN priority TEXT;
```

### Changes

**Traditional:**
```
New field needed:
1. Update requirements doc
2. Design schema change
3. Write migration
4. Update API
5. Update types
6. Update validation
7. Update tests
8. Deploy carefully
Time: 1-2 weeks
```

**Skills-First:**
```
New field needed:
1. Update skill markdown
2. Test immediately
3. Promote when stable
Time: 5 minutes (+ promotion later)
```

### Validation

**Traditional:**
```typescript
// Rigid validation upfront
if (!isValidEmail(email)) throw new Error();
if (priority < 1 || priority > 5) throw new Error();
if (!['technical', 'billing'].includes(category)) throw new Error();
```

**Skills-First:**
```markdown
# Skill handles validation
If email looks invalid, ask for clarification.
If priority is unclear, infer from urgency words.
If category is ambiguous, choose most likely.
```

### Team Collaboration

**Traditional:**
- PM writes requirements
- Engineers implement
- Designers wait for backend
- Sequential, slow

**Skills-First:**
- PM edits skills (markdown)
- Engineers build infrastructure
- Designers test immediately
- Parallel, fast

## When to Use Each

### Use Traditional When:
- Requirements are crystal clear
- Domain is well-understood
- Changes are rare
- Compliance requires rigid structure
- Team is large and distributed

### Use Skills-First When:
- Requirements are fuzzy
- Domain is being discovered
- Changes are frequent
- Speed matters
- Team is collaborative

## Hybrid Approach

You can combine both:

**Start Skills-First:**
- Weeks 1-4: Discover with skills
- Learn what actually matters
- Iterate quickly

**Transition to Traditional:**
- Week 5+: Promote stable fields
- Add constraints for critical data
- Create rigid API contracts
- Maintain flexibility elsewhere

**Best of both worlds:**
- Fast discovery phase
- Stable production system
- Flexibility where needed
- Structure where required

## Real-World Results

### Traditional Project
- Planning: 4 weeks
- Development: 12 weeks
- Migrations: 3 major, 8 minor
- Requirements changes: 15
- Team satisfaction: 6/10
- Time to first user: 16 weeks

### Skills-First Project
- Planning: 2 days
- Development: 6 weeks
- Migrations: 1 automated
- Requirements changes: 30+ (easy)
- Team satisfaction: 9/10
- Time to first user: 1 week

## Common Objections

### "But we need structure!"
Skills-First adds structure progressively. You end up with the same structure, but only where it's actually needed.

### "But what about data integrity?"
Promote fields and add constraints when you understand the domain. Better to constrain correctly than constrain early.

### "But our team isn't technical!"
That's the point. PMs can edit markdown skills. No SQL, no TypeScript, no migrations (until needed).

### "But this won't scale!"
The ticket system example handles thousands of tickets. Promoted fields are indexed and queryable. Performance is identical to traditional once fields are promoted.

### "But what about compliance?"
Promote critical fields immediately. Add constraints for regulated data. Keep flexibility for non-critical fields.

## The Bottom Line

**Traditional:** Predict, plan, build rigidly, discover you were wrong, migrate painfully.

**Skills-First:** Start flexible, learn through usage, formalize progressively, harden selectively.

Both end up with structured systems. Skills-First just gets there faster and with less pain.
