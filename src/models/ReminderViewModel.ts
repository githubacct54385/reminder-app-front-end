import { DueDateOption } from "@/Ajax/ReminderAjax";

export default interface ReminderViewModel {
  content: string;
  email: string;
  dueDateUtc: Date | string;
  dueDateAlert: DueDateOption;
  id: string;
  creatorEmail: string;
  isCompleted: boolean;
  isDeleted: boolean;
  incrementId: string;
}
