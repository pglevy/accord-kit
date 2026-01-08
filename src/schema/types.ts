// Generic entity type - customize for your domain
export interface Entity {
  id: number;
  created_at: string;
  skill_data: Record<string, any>;
}

// Example: Uncomment and modify for your domain
// export interface Ticket extends Entity {
//   title?: string;
//   status?: string;
//   priority?: string;
// }
