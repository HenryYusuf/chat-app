<script setup lang="ts">
// Import the useChat composable to access chat state and logic.
// chat: The current chat session object (contains title, id, etc.).
// messages: An array of message objects (user and assistant).
// sendMessage: A function to send a new message to the AI.
const { chat, messages, sendMessage } = useChat();

// Handler function for the 'send-message' event from the ChatInput component.
// It receives the message string and calls the sendMessage composable function.
function handleSendMessage(message: string) {
  sendMessage(message);
}
</script>

<template>
  <!-- Main scrollable container for the chat interface. -->
  <div ref="scrollContainer" class="scroll-container">
    <!-- UContainer provides a responsive, centered container with max-width. -->
    <UContainer class="chat-container">
      <!-- Empty State: Shown when there are no messages in the chat. -->
      <div v-if="!messages?.length" class="empty-state">
        <div class="empty-state-card">
          <h2 class="empty-state-title">Start your chat</h2>
          <!-- The ChatInput component is reused here for the initial message. -->
          <ChatInput @send-message="handleSendMessage" />
        </div>
      </div>

      <!-- Chat Interface: Shown when there are messages. -->
      <template v-else>
        <!-- Header displaying the chat title. -->
        <div class="chat-header">
          <h1 class="title">
            {{ chat?.title || "Untitled Chat" }}
          </h1>
        </div>

        <!-- Container for the list of messages. -->
        <div class="messages-container">
          <!-- Loop through each message in the messages array. -->
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="{
              'message-user': message.role === 'user', // Apply specific style for user messages
              'message-ai': message.role === 'assistant', // Apply specific style for AI messages
            }"
          >
            <!-- Display the message content. -->
            <div class="message-content">{{ message.content }}</div>
          </div>
        </div>

        <!-- Fixed input area at the bottom of the screen. -->
        <div class="message-form-container">
          <ChatInput @send-message="handleSendMessage" />
        </div>
      </template>
    </UContainer>
  </div>
</template>

<style scoped>
/* ===== Layout & Container Styles ===== */
/* Ensures the main container takes full height and allows scrolling */
.scroll-container {
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
}

/* Constrains the width of the chat content for readability */
.chat-container {
  max-width: 800px;
  height: 100%;
}

/* ===== Header Styles ===== */
.chat-header {
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ui-text);
}

/* ===== Messages Container ===== */
/* Flex container for the list of messages */
.messages-container {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Space between messages */
  margin-bottom: 1.5rem;
  overflow-y: auto;
  padding-bottom: 8rem; /* Extra padding at bottom to prevent content being hidden behind the fixed input */
}

/* ===== Message Styles ===== */
/* Base style for all messages */
.message {
  padding: 1rem;
  border-radius: var(--ui-radius);
  transition: all 0.2s;
}

/* Specific styles for user messages (aligned right, distinct background) */
.message-user {
  background-color: var(--ui-bg-muted);
  border: 1px solid var(--ui-border);
  width: 70%; /* Limit width to distinguish from full-width AI messages */
  align-self: flex-end; /* Align to the right */
}

/* Specific styles for AI messages (full width, transparent background) */
.message-ai {
  width: 100%;
  padding: 1rem 0;
  border: none;
  background: none;
}

/* Styling for the text content within a message */
.message-content {
  color: var(--ui-text);
  word-wrap: break-word; /* Ensure long words don't overflow */
  white-space: pre-wrap; /* Preserve whitespace and line breaks */
  overflow-wrap: break-word;
}

/* ===== Input Form Styles ===== */
/* Fixes the input form to the bottom of the viewport */
.message-form-container {
  position: fixed;
  bottom: 1.5rem;
  max-width: 800px;
  width: calc(100% - 3rem); /* Account for container padding */
  z-index: 10; /* Ensure it stays on top of other content */
}

/* Container for the 'scroll to bottom' button (if implemented) */
.scroll-to-bottom-button-container {
  position: absolute;
  bottom: calc(100% + 1rem);
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none; /* Allow clicks to pass through the container itself */
}

/* Re-enable pointer events for the button inside the container */
.scroll-to-bottom-button-container :deep(button) {
  pointer-events: auto;
}

/* ===== Empty State Styles ===== */
/* Centers the empty state content vertically and horizontally */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 100%;
}

.empty-state-card {
  background-color: var(--ui-bg-elevated);
  padding: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--ui-text-muted);
  text-align: center;
}

.empty-state-message {
  font-size: 1rem;
  color: var(--ui-text-muted);
}

/* ===== Utility Styles ===== */
/* Hide scrollbar across browsers for a cleaner look */
.message-input {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.message-input::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
