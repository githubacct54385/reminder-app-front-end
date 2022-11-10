import ReminderServerModel from "@/models/ReminderServerModel";
import ResponseModel from "@/models/ResponseModel";

export type DueDateOption = "none" | "5m" | "10m" | "15m" | "30m" | "1h" | "2h" | "1d" | "2d" | "1w";

const CREATE_REMINDER_ENDPOINT = "http://localhost:3000/reminders/create";

export const CreateReminder = async (
  token: string,
  content: string,
  email: string,
  dueDate: Date,
  dueDateAlert: DueDateOption
): Promise<ResponseModel<ReminderServerModel>> => {
  const reminder = await fetch(CREATE_REMINDER_ENDPOINT, {
    method: "POST",
    headers: PostHeaders(token),
    body: JSON.stringify({
      content,
      email,
      dueDateUtc: dueDate,
      dueDateAlert,
    }),
  });
  return reminder.json();
};

const PostHeaders = (token: string): HeadersInit => {
  return {
    "Content-type": "application/json; charset=utf-8",
    Authorization: "Bearer " + token,
  };
};
