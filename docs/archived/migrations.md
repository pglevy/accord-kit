# Migration Guide

## Understanding Migrations in Skills-First

Traditional migrations: Define schema upfront, migrate when it changes.

Skills-First migrations: Start with JSON, promote fields when they stabilize.

## The Promotion Workflow

### Step 1: Field Lives in skill_data

```typescript
// Database
{
  id: 1,
  skill_data: '{"priority": "high", "category": "billing"}'
}

// Skill outputs
{
  priority: "high",
  category: "billing"
}
```

**Characteristics:**
- ✅ Flexible - can change anytime
- ✅ Fast iteration
- ❌ Can't query efficiently
- ❌ No type safety

### Step 2: Promote to Column

```bash
npm run migrate:promote priority
```

**What happens:**
1. Schema evolution skill analyzes the field
2. Generates SQL migration
3. Shows preview
4. Asks for confirmation
5. Applies migration if approved

**Result:**
```typescript
// Database
{
  id: 1,
  priority: "high",  // Now a column
  skill_data: '{"category": "billing"}'  // Other fields remain
}
```

**Characteristics:**
- ✅ Can query: `WHERE priority = 'high'`
- ✅ Type safe in TypeScript
- ✅ Still flexible for other fields
- ⚠️ Requires migration for changes

### Step 3: Add Constraints (Optional)

```sql
ALTER TABLE tickets ADD CONSTRAINT check_priority
  CHECK (priority IN ('low', 'medium', 'high'));

CREATE INDEX idx_tickets_priority ON tickets(priority);
```

**Characteristics:**
- ✅ Data integrity
- ✅ Query performance
- ❌ Less flexible
- ❌ Requires careful planning

## Migration Commands

### Promote a Field
```bash
npm run migrate:promote <field-name> [table-name]

# Examples
npm run migrate:promote priority tickets
npm run migrate:promote status
```

### Manual Migration
```bash
# Create migration file
touch src/migrations/001_add_custom_field.sql

# Write SQL
echo "ALTER TABLE tickets ADD COLUMN custom_field TEXT;" > src/migrations/001_add_custom_field.sql

# Apply manually
sqlite3 src/data/app.db < src/migrations/001_add_custom_field.sql
```

## Common Scenarios

### Scenario 1: Simple Field Addition

**Before:**
```json
{
  "skill_data": {
    "title": "Bug report",
    "priority": "high"
  }
}
```

**Promote:**
```bash
npm run migrate:promote priority
```

**After:**
```typescript
{
  priority: "high",
  skill_data: {
    title: "Bug report"
  }
}
```

### Scenario 2: Nested Field

**Before:**
```json
{
  "skill_data": {
    "customer": {
      "name": "John",
      "email": "john@example.com"
    }
  }
}
```

**Promote:**
```bash
npm run migrate:promote customer_name
npm run migrate:promote customer_email
```

**Migration extracts:**
```sql
UPDATE tickets
SET customer_name = json_extract(skill_data, '$.customer.name'),
    customer_email = json_extract(skill_data, '$.customer.email');
```

### Scenario 3: Array Field

**Before:**
```json
{
  "skill_data": {
    "tags": ["urgent", "billing", "vip"]
  }
}
```

**Options:**
1. Store as JSON column: `tags TEXT` (stores JSON array)
2. Create junction table: `ticket_tags` (normalized)

**Promote:**
```bash
npm run migrate:promote tags
# Skill will suggest storing as JSON TEXT
```

### Scenario 4: Changing Field Type

**Week 1:** Priority is text
```json
{"priority": "high"}
```

**Week 3:** Priority becomes numeric
```json
{"priority": 3}
```

**Migration:**
```sql
-- Add new column
ALTER TABLE tickets ADD COLUMN priority_numeric INTEGER;

-- Backfill with conversion
UPDATE tickets
SET priority_numeric = CASE json_extract(skill_data, '$.priority')
  WHEN 'low' THEN 1
  WHEN 'medium' THEN 2
  WHEN 'high' THEN 3
  WHEN 'urgent' THEN 4
END;

-- Drop old column (optional)
-- ALTER TABLE tickets DROP COLUMN priority;
```

## Rollback Strategy

### Option 1: Keep Old Data
```sql
-- Don't delete from skill_data when promoting
UPDATE tickets
SET priority = json_extract(skill_data, '$.priority');
-- skill_data still has priority field

-- To rollback: just drop the column
ALTER TABLE tickets DROP COLUMN priority;
```

### Option 2: Migration History
```
src/migrations/
  001_add_priority.sql
  001_add_priority_rollback.sql
```

### Option 3: Database Backup
```bash
# Before migration
cp src/data/app.db src/data/app.db.backup

# After migration fails
mv src/data/app.db.backup src/data/app.db
```

## Best Practices

### ✅ Do

1. **Promote incrementally** - One field at a time
2. **Test on sample data** - Use a copy of production DB
3. **Keep backups** - Before any migration
4. **Document reasoning** - Why was this field promoted?
5. **Monitor usage** - Is the promoted field actually queried?

### ❌ Don't

1. **Promote too early** - Wait for stability (2+ weeks)
2. **Delete from skill_data** - Keep for rollback safety
3. **Add constraints immediately** - Promote first, constrain later
4. **Promote everything** - Only what needs querying
5. **Skip testing** - Always test migrations

## Troubleshooting

### Migration fails with "column already exists"
```bash
# Check current schema
sqlite3 src/data/app.db ".schema tickets"

# Drop column if needed
sqlite3 src/data/app.db "ALTER TABLE tickets DROP COLUMN priority;"
```

### Backfill returns NULL for all records
```bash
# Check JSON structure
sqlite3 src/data/app.db "SELECT skill_data FROM tickets LIMIT 1;"

# Verify json_extract path
sqlite3 src/data/app.db "SELECT json_extract(skill_data, '$.priority') FROM tickets LIMIT 5;"
```

### TypeScript types out of sync
```bash
# Regenerate types from database
npm run db:generate-types
```

## Performance Considerations

### When to Add Indexes

Add index if:
- Field is in WHERE clause frequently
- Field is used for sorting (ORDER BY)
- Field is used in JOINs

Don't add index if:
- Field is rarely queried
- Table is small (<1000 rows)
- Field has low cardinality (few unique values)

### Index Examples

```sql
-- Single column index
CREATE INDEX idx_tickets_priority ON tickets(priority);

-- Composite index
CREATE INDEX idx_tickets_status_priority ON tickets(status, priority);

-- Partial index
CREATE INDEX idx_tickets_open ON tickets(status) WHERE status != 'closed';
```

## Migration Checklist

Before promoting a field:

- [ ] Field appears in 90%+ of records
- [ ] Field structure hasn't changed in 2+ weeks
- [ ] Need to query/filter/sort by this field
- [ ] TypeScript interface includes this field
- [ ] Have database backup
- [ ] Tested on sample data
- [ ] Team reviewed the change

After promoting:

- [ ] Migration applied successfully
- [ ] Backfill completed
- [ ] TypeScript types updated
- [ ] Queries work as expected
- [ ] Performance is acceptable
- [ ] Documentation updated
