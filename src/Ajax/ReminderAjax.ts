import ReminderServerModel from "@/models/ReminderServerModel";
import ReminderViewModel from "@/models/ReminderViewModel";
import ResponseModel from "@/models/ResponseModel";

export type DueDateOption = "none" | "5m" | "10m" | "15m" | "30m" | "1h" | "2h" | "1d" | "2d" | "1w";

const CREATE_REMINDER_ENDPOINT = "http://localhost:3000/reminders/create";
const TOGGLE_REMINDER_ENDPOINT = "http://localhost:3000/reminders/toggleIsCompleted";
const DELETE_REMINDER_ENDPOINT = "http://localhost:3000/reminders/";

export const CreateReminder = async (
  token: string,
  content: string,
  email: string,
  dueDate: Date,
  dueDateAlert: DueDateOption
): Promise<ResponseModel<ReminderServerModel>> => {
  const reminder = await fetch(CREATE_REMINDER_ENDPOINT, {
    method: "POST",
    headers: PostPatchHeaders(token),
    body: JSON.stringify({
      content,
      email,
      dueDateUtc: dueDate,
      dueDateAlert,
    }),
  });
  return reminder.json();
};

export const ToggleIsCompleted = async (token: string, reminder: ReminderViewModel) => {
  const updatedReminderRes = await fetch(TOGGLE_REMINDER_ENDPOINT, {
    method: "PATCH",
    headers: PostPatchHeaders(token),
    body: JSON.stringify({
      id: reminder.id,
      isCompleted: reminder.isCompleted,
    }),
  });
  const toggledReminder = await updatedReminderRes.json();
  return toggledReminder;
};

export const DeleteReminder = async (token: string, reminder: ReminderViewModel) => {
  const deletedReminderRes = await fetch(DELETE_REMINDER_ENDPOINT, {
    method: "DELETE",
    headers: PostPatchHeaders(token),
    body: JSON.stringify({
      id: reminder.id,
    }),
  });
  const toggledReminder = await deletedReminderRes.json();
  return toggledReminder;
};

export const GetRemindersByEmail = async (token: string, email: string) => {
  const response = await fetch(`http://localhost:3000/reminders/byEmail/${email}`, {
    method: "GET",
    headers: GetHeaders(token),
  });
  const remindersRes = await response.json();
  return remindersRes;
};

const PostPatchHeaders = (token: string): HeadersInit => {
  return {
    "Content-type": "application/json; charset=utf-8",
    Authorization: "Bearer " + token,
  };
};

const GetHeaders = (token: string): HeadersInit => {
  return {
    Authorization: "Bearer " + token,
  };
};
