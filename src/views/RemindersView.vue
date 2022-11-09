<template>
  <div class="flex justify-evenly w-3/4 rounded-xl mx-auto">
    <div class="flex p-6 w-full justify-between">
      <div class="flex flex-col items-start">
        <h1 class="font-bold">Reminders</h1>
        <h3 class="text-gray-400 text-sm">Manage your existing reminders</h3>
      </div>
      <div class="flex place-items-end">
        <button
          @click="CreateReminder"
          class="py-3 px-4 bg-blue-700 rounded-lg text-white hover:bg-blue-900 shadow-md duration-200"
        >
          Create New Reminder
        </button>
      </div>
    </div>
  </div>
  <div
    v-bind:key="reminder.Id"
    v-for="reminder in reminders"
    class="flex justify-between w-3/4 rounded-lg my-3 px-2 py-2 mx-auto bg-blue-200"
    :class="{ 'bg-green-200': reminder.IsCompleted }"
  >
    <div class="flex gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 text-blue-600"
        :class="{ 'text-green-600': reminder.IsCompleted }"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>

      <div class="font-bold">{{ reminder.Content }}</div>
    </div>
    <div class="flex gap-2">
      <div class="text-sm text-blue-600">{{ reminder.DueDateUtc }}</div>
      <svg
        @click="ToggleIsCompleted(reminder)"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 cursor-pointer hover:text-slate-400"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { DateTime } from "luxon";

interface Reminder {
  IncrementId: string;
  Id: string;
  CreatorEmail: string;
  CreatorName: string;
  DueDateUtc: string;
  Content: string;
  IsCompleted: boolean;
}

/* eslint-disable */
interface ReminderApi {
  increment_id: string;
  id: string;
  creator_email: string;
  creator_name: string;
  due_date_utc: string;
  content: string;
  is_completed: boolean;
}
/* eslint-enable */

const { getAccessTokenSilently, user } = useAuth0();

const reminders = ref<Reminder[]>([]);
const errorMsg = ref<string>("");

onMounted(async () => {
  errorMsg.value = "";
  const token = await getAccessTokenSilently();
  const response = await fetch("http://localhost:3000/reminders/byEmail/alexbarke002@outlook.com", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const remindersRes = await response.json();
  if (remindersRes.success) {
    reminders.value = remindersRes.reminders.map((r: ReminderApi) => {
      return {
        IncrementId: r.increment_id,
        Content: r.content,
        CreatorEmail: r.creator_email,
        DueDateUtc: `Due ${DateTime.fromISO(r.due_date_utc).toRelativeCalendar()}`,
        Id: r.id,
        IsCompleted: r.is_completed,
      };
    });
  } else {
    errorMsg.value = remindersRes.msg;
  }
});

const CreateReminder = async () => {
  const token = await getAccessTokenSilently();
  await fetch("http://localhost:3000/reminders/create", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      content: "Walk the dog",
      email: user.value.email,
      dueDate: DateTime.utc(2022, 11, 9, 8, 55).toJSDate(),
    }),
  });
};

const ToggleIsCompleted = async (reminder: Reminder) => {
  const token = await getAccessTokenSilently();
  const updatedReminderRes = await fetch("http://localhost:3000/reminders/toggleIsCompleted", {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      id: reminder.Id,
      isCompleted: reminder.IsCompleted,
    }),
  });
  const updatedReminder = await updatedReminderRes.json();
  if (updatedReminder.success) {
    reminders.value = reminders.value.map((r) => {
      if (r.Id === reminder.Id) {
        return { ...r, IsCompleted: !r.IsCompleted };
      }
      return r;
    });
  } else {
    errorMsg.value = updatedReminder.msg;
  }
};
</script>
