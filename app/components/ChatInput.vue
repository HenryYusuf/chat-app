<script setup lang="ts">
// Define props for the component.
// isStreaming: A boolean indicating if the AI is currently generating a response.
// We destructure it with a default value of false.
const { isStreaming = false } = defineProps<{
  isStreaming?: boolean;
}>();

// Define events that this component can emit to its parent.
// 'send-message': Emitted when the user sends a message, carrying the message string.
const emit = defineEmits<{
  (e: "send-message", message: string): void;
}>();

// Create a reference to the textarea DOM element using useTemplateRef.
// This matches the ref="textareaRef" attribute in the template.
const textareaRef = useTemplateRef("textareaRef");

// Reactive state for the new message input.
const newMessage = ref("");

// Function to handle sending the message.
const handleSendMessage = () => {
  // Prevent sending if the message is empty (whitespace only) or if currently streaming.
  if (!newMessage.value.trim() || isStreaming) return;

  // Emit the 'send-message' event with the trimmed message content.
  emit("send-message", newMessage.value.trim());

  // Clear the input field.
  newMessage.value = "";

  // Use nextTick to wait for the DOM to update after clearing the value.
  nextTick(() => {
    // Reset the textarea height to its base size.
    adjustTextareaHeight();
    // Keep focus on the textarea for better UX.
    textareaRef.value?.focus();
  });
};

// Function to auto-resize the textarea based on its content.
const adjustTextareaHeight = async (): Promise<void> => {
  if (textareaRef.value) {
    // First reset height to auto to correctly calculate the new scrollHeight (shrink if needed).
    textareaRef.value.style.height = "auto";
    // Wait for the DOM update.
    await nextTick();
    // Set the height to the scrollHeight (the full height of the content).
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
};

// When the component is mounted, automatically focus the textarea.
onMounted(() => {
  textareaRef.value?.focus();
});

// Watch the 'isStreaming' prop.
// When streaming finishes (value becomes false), re-focus the textarea.
watch(
  () => isStreaming,
  async (value: boolean) => {
    if (!value) {
      await nextTick();
      textareaRef.value?.focus();
    }
  }
);
</script>

<template>
  <!-- Form wrapper for the input area.
       @submit.prevent prevents the default form submission (page reload) and calls handleSendMessage. -->
  <form class="message-form-wrapper" @submit.prevent="handleSendMessage">
    <!-- Textarea for multi-line input.
         ref="textareaRef": Connects to the script's textareaRef.
         v-model="newMessage": Two-way binding with the newMessage state.
         :disabled="isStreaming": Disables input while AI is generating.
         @input="adjustTextareaHeight": Adjusts height whenever the user types.
         @keydown.enter.prevent="handleSendMessage": Sends message on Enter key (preventing default newline). -->
    <textarea
      ref="textareaRef"
      v-model="newMessage"
      class="message-input"
      :disabled="isStreaming"
      :rows="1"
      @input="adjustTextareaHeight"
      @keydown.enter.prevent="handleSendMessage"
    />
    <!-- Send button.
         :disabled: Disabled if message is empty or currently streaming.
         icon: Uses an icon from the heroicons set. -->
    <UButton
      type="submit"
      :disabled="!newMessage || isStreaming"
      color="primary"
      variant="solid"
      icon="i-heroicons-paper-airplane"
      class="absolute right-3 bottom-3 rounded-full"
      square
    />
  </form>
</template>

<style scoped>
/* Wrapper for the input form, providing the rounded border and layout */
.message-form-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease-in-out;
  border: 1px solid var(--ui-border);
  border-radius: 1.8rem;
  overflow: hidden;
  padding: 1rem 2rem 1rem 1.2rem;
  background-color: var(--ui-bg);
}

/* Prevent transform effects on focus/hover to keep it stable */
.message-form-wrapper:focus-within,
.message-form-wrapper:hover {
  transform: none;
}

/* Remove default outline and shadow on hover */
.message-form-wrapper:hover {
  outline: none;
  box-shadow: none;
}

/* Styling for the textarea input itself */
.message-input {
  width: 100%;
  padding: 0;
  margin-right: 1.5rem; /* Space for the send button */
  resize: none; /* Disable manual resizing */
  background-color: transparent;
  outline: none;
}

/* Add a subtle shadow on hover for depth */
.message-form-wrapper:hover {
  outline: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Styling for disabled state */
.message-input:disabled {
  cursor: not-allowed;
}
</style>
