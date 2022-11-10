import { DueDateOption } from "@/Ajax/ReminderAjax";

export default interface ReminderViewModel {
  content: string;
  email: string;
  dueDateUtc: Date;
  dueDateAlert: DueDateOption;
  isCompleted: boolean;
  id: string;
  creatorEmail: string;
}
