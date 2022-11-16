<template>
  <div class="flex justify-evenly w-full md:w-3/4 lg:w-1/2 rounded-xl mx-auto">
    <div class="flex p-6 w-full justify-between">
      <div class="flex flex-col items-start">
        <h1 class="font-bold">Reminders</h1>
        <h3 class="text-gray-400 text-sm">Manage your existing reminders</h3>
      </div>
      <div class="flex place-items-end">
        <router-link
          class="py-3 px-4 bg-blue-700 rounded-lg text-white hover:bg-blue-900 shadow-md duration-200"
          to="/add-reminder"
          >Create</router-link
        >
      </div>
    </div>
  </div>
  <div
    v-bind:key="reminder.id"
    v-for="reminder in reminders"
    class="flex justify-between w-11/12 md:w-3/4 lg:w-1/2 rounded-lg my-3 px-2 py-2 mx-auto bg-blue-200"
    :class="{ 'bg-green-200': reminder.isCompleted }"
  >
    <div class="flex flex-col">
      <div class="flex gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 text-blue-600"
          :class="{ 'text-green-600': reminder.isCompleted }"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <div class="font-bold">{{ reminder.content }}</div>
      </div>
      <div class="flex text-sm text-blue-600" :class="{ 'text-green-700': reminder.isCompleted }">
        {{ reminder.dueDateUtc }}
      </div>
    </div>
    <div class="flex flex-col">
      <div class="flex justify-end gap-1">
        <svg
          @click="ToggleReminder(reminder)"
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
        <svg
          @click="HandleDelete(reminder)"
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
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </div>
      <div class="flex text-sm text-blue-600" :class="{ 'text-green-700': reminder.isCompleted }">
        {{ reminder.dueDateUtcRelative }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { DateTime } from "luxon";
import ReminderServerModel from "@/models/ReminderServerModel";
import ReminderViewModel from "@/models/ReminderViewModel";
import { DeleteReminder, DueDateOption, GetRemindersByEmail, ToggleIsCompleted } from "@/Ajax/ReminderAjax";

const { getAccessTokenSilently, user } = useAuth0();

const reminders = ref<ReminderViewModel[]>([]);
const errorMsg = ref<string>("");

onMounted(async () => {
  errorMsg.value = "";
  const token = await getAccessTokenSilently();
  if (!user?.value?.email) {
    errorMsg.value = "User email cannot be empty.";
    return;
  }
  const remindersRes = await GetRemindersByEmail(token, user.value.email);
  if (remindersRes.success) {
    reminders.value = remindersRes.data.map((r: ReminderServerModel): ReminderViewModel => {
      return {
        incrementId: r.increment_id,
        content: r.content,
        creatorEmail: r.creator_email,
        dueDateUtc: `Due ${DateTime.fromISO(r.due_date_utc as string).toLocaleString(DateTime.DATETIME_MED)}`,
        dueDateUtcRelative: `${DateTime.fromISO(r.created_at_utc as string).toRelative()}`,
        id: r.id,
        isCompleted: r.is_completed,
        isDeleted: r.is_deleted,
        email: r.creator_email,
        dueDateAlert: r.due_date_alert as DueDateOption,
      };
    });
  } else {
    errorMsg.value = remindersRes.msg;
  }
});

const ToggleReminder = async (reminder: ReminderViewModel) => {
  const token = await getAccessTokenSilently();
  const updatedReminder = await ToggleIsCompleted(token, reminder);
  if (updatedReminder.success) {
    reminders.value = reminders.value.map((r): ReminderViewModel => {
      if (r.id === reminder.id) {
        return { ...r, isCompleted: !r.isCompleted };
      }
      return r;
    });
  } else {
    errorMsg.value = updatedReminder.msg;
  }
};

const HandleDelete = async (reminder: ReminderViewModel) => {
  const token = await getAccessTokenSilently();
  const deletedReminder = await DeleteReminder(token, reminder);
  if (deletedReminder.success) {
    reminders.value = reminders.value.filter((r) => {
      return r.id !== reminder.id;
    });
  } else {
    errorMsg.value = deletedReminder.msg;
  }
};
</script>
