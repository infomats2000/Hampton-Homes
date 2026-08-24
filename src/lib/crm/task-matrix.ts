/**
 * Agent Daily Action Plan & Task Matrix Engine
 * Auto-generates an agent's daily task list across 4 key workflow categories:
 * 1. Hot Lead Follow-ups
 * 2. Post-Inspection Call List
 * 3. Appraisal Follow-ups
 * 4. Property Settlement Anniversaries
 */

export type TaskCategory =
  | "HOT_LEAD_FOLLOWUP"
  | "POST_INSPECTION_CALL"
  | "APPRAISAL_FOLLOWUP"
  | "SETTLEMENT_ANNIVERSARY";

export type TaskPriority = "URGENT" | "HIGH" | "MEDIUM" | "ROUTINE";

export interface AgentTaskItem {
  id: string;
  category: TaskCategory;
  priority: TaskPriority;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  propertyAddress: string;
  taskTitle: string;
  dueDateDescription: string; // e.g. "Today 10:00 AM" or "Overdue by 1 day"
  isCompleted: boolean;
  notes?: string;
}

export const MOCK_AGENT_TASKS: AgentTaskItem[] = [
  {
    id: "task-1001",
    category: "HOT_LEAD_FOLLOWUP",
    priority: "URGENT",
    contactName: "David Miller",
    contactPhone: "0411 222 333",
    contactEmail: "david.miller@example.com.au",
    propertyAddress: "142 Church Street, Parramatta NSW",
    taskTitle: "Follow up enquiry on Parramatta residence",
    dueDateDescription: "Today 9:30 AM",
    isCompleted: false,
    notes: "Lead requested contract of sale and pest report.",
  },
  {
    id: "task-1002",
    category: "POST_INSPECTION_CALL",
    priority: "HIGH",
    contactName: "Sophie Zhang",
    contactPhone: "0422 333 444",
    contactEmail: "sophie.zhang@example.com.au",
    propertyAddress: "88 Ocean Drive, Bondi Beach NSW",
    taskTitle: "Post-Open Home Feedback Call",
    dueDateDescription: "Today 11:00 AM",
    isCompleted: false,
    notes: "Attended Saturday inspection. Gauge intent to submit formal offer.",
  },
  {
    id: "task-1003",
    category: "APPRAISAL_FOLLOWUP",
    priority: "HIGH",
    contactName: "Robert Taylor",
    contactPhone: "0433 444 555",
    contactEmail: "robert.t@example.com.au",
    propertyAddress: "27 Raglan Street, Manly NSW",
    taskTitle: "7-Day Sales Appraisal Follow-up",
    dueDateDescription: "Today 2:00 PM",
    isCompleted: false,
    notes: "Delivered CMA appraisal report last week. Follow up agency agreement signing.",
  },
  {
    id: "task-1004",
    category: "SETTLEMENT_ANNIVERSARY",
    priority: "MEDIUM",
    contactName: "Harrison Vance",
    contactPhone: "0499 888 777",
    contactEmail: "harrison.vance@example.com.au",
    propertyAddress: "12/45 Spit Road, Mosman NSW",
    taskTitle: "1-Year Settlement Anniversary Check-in",
    dueDateDescription: "Today 4:00 PM",
    isCompleted: true,
    notes: "Bought Mosman home 1 year ago today. Call to touch base & offer updated valuation.",
  },
];

/**
 * Returns summary stats for the agent's daily task matrix.
 */
export function getTaskMatrixSummary(tasks: AgentTaskItem[] = MOCK_AGENT_TASKS) {
  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const urgentCount = pendingTasks.filter((t) => t.priority === "URGENT" || t.priority === "HIGH").length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return {
    totalTasksCount: tasks.length,
    pendingTasksCount: pendingTasks.length,
    urgentCount,
    completedCount,
    completionPercentage: Math.round((completedCount / tasks.length) * 100) || 0,
  };
}
