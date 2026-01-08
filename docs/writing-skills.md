# Writing Effective Skills

## What is a Skill?

A skill is a markdown file that instructs an LLM to perform a specific business function. Think of it as a "micro-spec" that's executable.

## Anatomy of a Good Skill

### 1. Clear Purpose
```markdown
# Customer Inquiry Routing

Route customer inquiries to the appropriate department based on content and urgency.
```

One sentence. One job.

### 2. Structured Input
```markdown
## Input Context

You will receive:
- inquiry_text: The customer's message
- customer_tier: "free", "pro", or "enterprise"
- previous_tickets: Array of past ticket summaries
```

Be explicit about what data is available.

### 3. Explicit Output Format
```markdown
## Output Format

Return JSON:
{
  "department": "sales" | "support" | "billing",
  "priority": "low" | "medium" | "high",
  "reasoning": "Brief explanation"
}
```

LLMs need structure. JSON is easiest to parse.

### 4. Decision Logic
```markdown
## Routing Rules

- Sales: Product questions, pricing, demos
- Support: Technical issues, bugs, how-to
- Billing: Payments, invoices, subscriptions

Priority:
- High: Enterprise customers, system down, payment issues
- Medium: Pro customers, feature requests
- Low: General questions, free tier
```

Make the logic explicit, even if it seems obvious.

### 5. Examples
```markdown
## Examples

### Example 1: Enterprise Technical Issue
Input:
{
  "inquiry_text": "Our API integration is returning 500 errors",
  "customer_tier": "enterprise"
}

Output:
{
  "department": "support",
  "priority": "high",
  "reasoning": "Technical issue affecting enterprise customer"
}
```

Examples teach the LLM your expectations.

## Common Patterns

### Pattern 1: Extraction
```markdown
# Data Extraction Skill

Extract structured data from unstructured text.

Given: Raw customer message
Return: {name, email, issue_type, description}
```

### Pattern 2: Classification
```markdown
# Content Classification Skill

Classify content into predefined categories.

Given: User-generated content
Return: {category, confidence, flags}
```

### Pattern 3: Generation
```markdown
# Response Generation Skill

Generate appropriate responses based on context.

Given: Customer inquiry + context
Return: {response_text, tone, suggested_actions}
```

### Pattern 4: Decision
```markdown
# Approval Decision Skill

Make approval decisions based on rules and context.

Given: Request details + policy rules
Return: {approved, reasoning, conditions}
```

## Dos and Don'ts

### ✅ Do

- **Be specific about output format** - "Return JSON with fields X, Y, Z"
- **Include edge cases** - "If information is missing, return null"
- **Provide examples** - Show 2-3 realistic scenarios
- **Use consistent terminology** - Pick terms and stick with them
- **Make it testable** - Clear inputs → predictable outputs

### ❌ Don't

- **Be vague** - "Figure out what to do with this"
- **Assume context** - "Handle this appropriately"
- **Over-constrain** - Don't add rules you haven't validated
- **Make it too complex** - One skill = one job
- **Forget error cases** - What if data is invalid?

## Evolution Example

### Version 1: Vague
```markdown
# Ticket Skill

Look at tickets and do something useful with them.
```

Problem: Too vague, unpredictable output.

### Version 2: Better
```markdown
# Ticket Prioritization Skill

Analyze support tickets and assign priority.

Input: ticket_text, customer_info
Output: {priority: "low" | "medium" | "high"}
```

Better: Clear purpose and structure.

### Version 3: Production-Ready
```markdown
# Ticket Prioritization Skill

Assign priority to support tickets based on urgency and customer tier.

## Input Context
- ticket_text: Customer's issue description
- customer_tier: "free" | "pro" | "enterprise"
- keywords: Array of extracted keywords

## Output Format
{
  "priority": "low" | "medium" | "high",
  "reasoning": "Brief explanation",
  "escalate": boolean
}

## Prioritization Rules

High Priority:
- Enterprise customers with technical issues
- Any customer with "down", "broken", "urgent" keywords
- Security or data loss concerns

Medium Priority:
- Pro customers with technical issues
- Feature requests from enterprise
- Billing issues

Low Priority:
- General questions
- Free tier requests
- Documentation clarifications

## Edge Cases
- If customer_tier is missing, assume "free"
- If ticket_text is empty, return priority: "low" with reasoning
- If multiple rules apply, choose highest priority

## Examples

[Include 3-4 realistic examples]
```

Production-ready: Comprehensive, testable, maintainable.

## Testing Your Skills

### Manual Testing
```bash
npm run cli
> test skill ticket-prioritization with {ticket_text: "site is down", customer_tier: "enterprise"}
```

### Automated Testing
```typescript
const result = await executeSkill('ticket-prioritization', {
  ticket_text: "How do I reset my password?",
  customer_tier: "free"
});

assert(result.priority === "low");
```

## Skill Composition

Skills can call other skills:

```markdown
# Order Processing Skill

1. Use "fraud-detection" skill to check order
2. If fraud_score < 0.3, use "payment-processing" skill
3. Use "inventory-check" skill to verify stock
4. Return combined result
```

Keep each skill focused, compose for complex workflows.

## When to Split a Skill

Split when:
- Skill has multiple distinct purposes
- Different parts change at different rates
- You want to reuse part of the logic
- Skill file is >200 lines

Example:
```
❌ ticket-management.md (does everything)

✅ ticket-intake.md (creates tickets)
✅ ticket-routing.md (assigns tickets)
✅ ticket-escalation.md (escalates tickets)
```

## Skill Versioning

As skills evolve, consider versioning:

```
.claude/skills/
  ticket-intake-v1.md
  ticket-intake-v2.md
  ticket-intake.md -> ticket-intake-v2.md
```

Allows A/B testing and safe rollbacks.

## Key Takeaways

1. **One skill, one job** - Keep it focused
2. **Structure is king** - Explicit inputs and outputs
3. **Examples teach** - Show don't just tell
4. **Iterate quickly** - Start simple, refine based on usage
5. **Test constantly** - Skills are code, treat them as such
