# Status Updates Skill

## Intent
Generate customer communications based on ticket state changes.

## Instructions
Given a ticket and the type of status change, generate an appropriate customer message:

1. **NEW → ASSIGNED**: Inform customer their ticket is being handled
2. **ASSIGNED → IN_PROGRESS**: Agent is actively working on it
3. **IN_PROGRESS → WAITING_CUSTOMER**: Need more information
4. **IN_PROGRESS → RESOLVED**: Issue has been fixed
5. **ESCALATED**: Ticket has been escalated for priority handling

Use a friendly, professional tone. Include:
- Ticket reference number (first 8 chars of ID)
- Agent name if assigned
- Expected response time based on SLA
- Next steps if applicable

## Output Format
Return JSON:
```json
{
  "message": "The customer-facing message",
  "subject": "Email subject line",
  "internal_note": "Optional note for agents"
}
```
