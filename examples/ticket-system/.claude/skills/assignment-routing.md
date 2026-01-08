# Assignment & Routing Skill

## Intent
Match tickets to the most appropriate available agent.

## Instructions
Given a ticket and list of available agents, select the best agent:

1. **Expertise Match**: Prefer agents whose expertise includes the ticket category
2. **Availability**: Only consider agents with availability = "available"
3. **Workload**: Prefer agents with lower currentWorkload (relative to maxWorkload)
4. **Priority Override**: For URGENT tickets, prioritize expertise over workload

## Selection Logic
- If expertise match exists with low workload → select that agent
- If no expertise match → select agent with lowest workload
- If all agents at capacity → return null

## Output Format
Return JSON:
```json
{
  "agentId": "string or null",
  "agentName": "string or null",
  "reason": "Brief explanation of selection"
}
```
