# Escalation Detection Skill

## Intent
Identify tickets that need supervisor attention.

## Instructions
Analyze a ticket to determine if it should be escalated based on:

1. **Time-based** (check against SLA hours):
   - Ticket age exceeds SLA by 50%
   - No status change in 24+ hours
   - Status is NEW for more than 2 hours

2. **Priority-based**:
   - URGENT tickets unresolved for >2 hours
   - HIGH priority tickets unresolved for >4 hours

3. **Pattern-based**:
   - Customer explicitly requests escalation (check description)
   - Multiple status changes without resolution

## Output Format
Return JSON:
```json
{
  "shouldEscalate": true/false,
  "reason": "Explanation of why escalation is/isn't needed",
  "urgency": "low|medium|high|critical"
}
```
