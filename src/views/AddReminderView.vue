<template>
  <div class="flex flex-col justify-evenly w-4/5 md:w-3/4 lg:w-1/2 rounded-xl mx-auto">
    <div class="flex">
      <h1 class="text-3xl">Create Reminder</h1>
    </div>
    <div class="flex flex-col items-start">
      <div class="flex gap-2">
        <label>Content</label>
        <span class="bg-blue-500 rounded-md px-1 text-white text-sm">Required</span>
      </div>
      <input
        @input="handleContentChanged"
        class="rounded-md border-2 border-slate-400 w-full px-3 py-2 my-2"
        type="text"
        placeholder="Content"
        :value="content"
      />
    </div>
    <div class="flex flex-col items-start">
      <div class="flex gap-2">
        <label>Due Date</label>
        <span class="bg-blue-500 rounded-md px-1 text-white text-sm">Required</span>
      </div>
      <input
        class="rounded-md border-2 border-slate-400 w-full px-3 py-2 my-2"
        type="date"
        placeholder="Due Date"
        @input="handleDueDateChanged"
        :value="dueDate"
      />
    </div>
    <div class="flex flex-col items-start">
      <div class="flex gap-2">
        <label>Due Date Time</label>
        <span class="bg-blue-500 rounded-md px-1 text-white text-sm">Required</span>
      </div>
      <input
        @input="handleDueDateTimeChanged"
        class="rounded-md border-2 border-slate-400 w-full px-3 py-2 my-2"
        type="time"
        placeholder="Due Date Time"
        :value="dueDateTime"
      />
    </div>
    <div class="flex flex-col items-start mb-3">
      <div class="flex gap-2">
        <label>Alert</label>
      </div>
      <select
        @input="handleDueDateAlertChanged"
        :value="dueDateAlert"
        class="rounded-md border-2 border-slate-400 bg-white w-full px-3 py-2 my-2"
      >
        <option value="none">None</option>
        <option value="5m">5 minutes before</option>
        <option value="10m">10 minutes before</option>
        <option value="15m">15 minutes before</option>
        <option value="30m">30 minutes before</option>
        <option value="1h">1 hour before</option>
        <option value="2h">2 hours before</option>
        <option value="1d">1 day before</option>
        <option value="2d">2 days before</option>
        <option value="1w">1 week before</option>
      </select>
    </div>
    <button
      class="py-3 px-4 bg-blue-700 rounded-lg text-white hover:bg-blue-900 shadow-md duration-200"
      @click="Create"
      type="button"
    >
      Create
    </button>
    <div>
      <span v-if="error.length > 0">{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { DateTime } from "luxon";
import { CreateReminder, DueDateOption } from "@/Ajax/ReminderAjax";
import router from "@/router";

const { getAccessTokenSilently, user } = useAuth0();
const content = ref("");
const error = ref("");
const dueDate = ref<Date>(new Date());
const dueDateTime = ref<string>("");
const dueDateAlert = ref<DueDateOption>("none");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleContentChanged = (e: any) => {
  content.value = e.target.value;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDueDateChanged = (e: any) => {
  dueDate.value = e.target.value;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDueDateTimeChanged = (e: any) => {
  dueDateTime.value = e.target.value;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDueDateAlertChanged = (e: any) => {
  dueDateAlert.value = e.target.value;
};

const Create = async (e: any) => {
  e.preventDefault();
  error.value = "";
  const token = await getAccessTokenSilently();
  if (!user?.value?.email) {
    error.value = "authenticated user email cannot be undefined";
    return;
  }

  if (!content.value) {
    error.value = "Content cannot be empty.";
    return;
  }

  if (!dueDateTime.value) {
    error.value = "Due date time is required";
    return;
  }

  const ee = dueDate.value;
  const ff = ee.toString();
  const gg = DateTime.fromISO(ff);
  const hh = gg.set({ hour: parseInt(dueDateTime.value.substring(0, 2)) });
  const ii = hh.set({ minute: parseInt(dueDateTime.value.substring(3)) });
  const kk = ii.toUTC();
  const ll = kk.toJSDate();

  if (!ii.isValid) {
    error.value = "Due Date is invalid.";
    return;
  }
  if (ii.diff(DateTime.now()).milliseconds < 0) {
    error.value = "Due Date cannot be in the past.";
    return;
  }

  const reminder = await CreateReminder(token, content.value, user.value.email, ll, dueDateAlert.value);
  if (reminder.success) {
    // redirect to reminders
    router.push("/reminders");
  } else {
    error.value = reminder.msg;
  }
};
</script>
