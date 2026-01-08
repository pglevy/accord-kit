export enum TicketCategory {
  LOGIN_ISSUES = "login_issues",
  BILLING = "billing",
  FEATURE_REQUEST = "feature_request",
  BUG_REPORT = "bug_report",
  GENERAL = "general"
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent"
}

export enum TicketStatus {
  NEW = "new",
  ASSIGNED = "assigned",
  IN_PROGRESS = "in_progress",
  WAITING_CUSTOMER = "waiting_customer",
  RESOLVED = "resolved",
  CLOSED = "closed"
}

export enum AgentAvailability {
  AVAILABLE = "available",
  BUSY = "busy",
  AWAY = "away"
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: Priority;
  status: TicketStatus;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  escalated: boolean;
  tags: string[];
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  expertise: TicketCategory[];
  availability: AgentAvailability;
  currentWorkload: number;
  maxWorkload: number;
}

export interface Category {
  id: TicketCategory;
  name: string;
  slaHours: number;
  description: string;
}
