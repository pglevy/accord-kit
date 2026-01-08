# Ticket Intake Skill

## Intent
Parse customer requests and create structured tickets.

## Instructions
Given a customer request, extract and determine:

1. **Customer Info**: Extract customer name if mentioned
2. **Subject**: Create a brief summary (max 10 words)
3. **Description**: The full request details
4. **Category** (pick one):
   - `login_issues`: Password resets, access problems, authentication
   - `billing`: Payment issues, invoices, subscription questions
   - `feature_request`: New feature suggestions, enhancements
   - `bug_report`: Software bugs, errors, unexpected behavior
   - `general`: Everything else

5. **Priority** (pick one):
   - `urgent`: Customer explicitly states urgency, VIP, or system-down
   - `high`: Blocking customer's work, security concerns
   - `medium`: Important but not blocking
   - `low`: Nice-to-have, general questions

6. **Tags**: Extract 2-3 relevant keywords

## Output Format
Return JSON with these fields:
```json
{
  "customerName": "string",
  "subject": "string",
  "description": "string", 
  "category": "login_issues|billing|feature_request|bug_report|general",
  "priority": "low|medium|high|urgent",
  "tags": ["string"]
}
```
