<script setup lang="ts">
import { ref } from "vue";
import type { ClarifyQuestion } from "../../../vendor/hermes/gateway-contract.generated.ts";
const props = defineProps<{ questions: ClarifyQuestion[]; disabled: boolean }>();
const emit = defineEmits<{ answer: [answers: Record<string, string>] }>();
const selected = ref<Record<string, string | string[]>>({});
const custom = ref<Record<string, string>>({});
function answers() {
  const result: Record<string, string> = {};
  for (const question of props.questions) {
    const value = selected.value[question.qid];
    const text = custom.value[question.qid];
    if (text?.trim()) result[question.qid] = text;
    else if (Array.isArray(value) && value.length) result[question.qid] = value.join(", ");
    else if (typeof value === "string") result[question.qid] = value;
  }
  return result;
}
function choose(question: ClarifyQuestion, choice: string) {
  if (props.disabled) return;
  if (question.multi_select) {
    const value = selected.value[question.qid];
    const current = Array.isArray(value) ? value : [];
    selected.value[question.qid] = current.includes(choice)
      ? current.filter((item) => item !== choice)
      : [...current, choice];
  } else {
    selected.value[question.qid] = choice;
    delete custom.value[question.qid];
    emit("answer", answers());
  }
}
function send() {
  if (!props.disabled && Object.keys(answers()).length) emit("answer", answers());
}
</script>

<template>
  <div class="clarification-card">
    <form v-for="question in questions" :key="question.qid" @submit.prevent="send">
      <fieldset :disabled="disabled">
        <legend>{{ question.question }}</legend>
        <div v-if="question.choices?.length" class="clarification-choices">
          <button
            v-for="choice in question.choices"
            :key="choice"
            type="button"
            :aria-pressed="
              question.multi_select
                ? (selected[question.qid]?.includes(choice) ?? false)
                : undefined
            "
            @click="choose(question, choice)"
          >
            {{ choice }}
          </button>
        </div>
        <div class="clarification-other">
          <input
            v-model="custom[question.qid]"
            placeholder="Other response"
            :aria-label="question.question + ' — Other response'"
          />
          <button type="submit" :disabled="disabled || !Object.keys(answers()).length">Send</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
.clarification-card {
  display: grid;
  gap: 20px;
  margin: 12px 0;
}
fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
legend {
  margin-bottom: 10px;
  padding: 0;
  font-size: 16px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.clarification-choices {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
}
button,
input {
  min-height: 44px;
  border: 0;
  color: inherit;
  font: inherit;
  font-size: 16px;
}
.clarification-choices button {
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  background: #303030;
  text-align: left;
  white-space: normal;
  overflow-wrap: anywhere;
}
button:hover,
button[aria-pressed="true"] {
  background: #424242;
}
.clarification-other {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 4px;
  border: 1px solid #424242;
  border-radius: 14px;
  background: #171717;
}
.clarification-other input {
  min-width: 0;
  flex: 1;
  padding: 8px 10px;
  background: transparent;
  border-radius: 10px;
}
.clarification-other button {
  flex-shrink: 0;
  padding: 8px 12px;
  border-radius: 10px;
}
button:disabled,
fieldset:disabled button {
  opacity: 0.55;
}
:focus-visible {
  outline: 2px solid #b4b4b4;
  outline-offset: 2px;
}
</style>
