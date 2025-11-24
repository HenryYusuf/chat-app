<script setup lang="ts">
// Menggunakan composable useChat untuk mendapatkan state dan fungsi chat.
// chat: Objek data chat saat ini.
// messages: Daftar pesan dalam chat tersebut.
// sendMessage: Fungsi untuk mengirim pesan baru.
const { chat, messages, sendMessage } = useChat();
</script>

<template>
  <!-- Merender komponen ChatWindow.
      Kita meneruskan data (props) 'chat' dan 'messages' ke dalam komponen ini.
      Kita juga mendengarkan event 'send-message' yang dipancarkan oleh ChatWindow,
      dan menghubungkannya dengan fungsi 'sendMessage' dari composable. -->
  <ChatWindow :chat="chat" :messages="messages" @send-message="sendMessage" />
</template>
