<script setup lang="ts">
// Impor composable useChat untuk mengakses state dan logika chat.
// chat: Objek sesi chat saat ini (berisi judul, id, dll.).
// messages: Array objek pesan (pengguna dan asisten).
// sendMessage: Fungsi untuk mengirim pesan baru ke AI.
const { chat, messages, sendMessage } = useChat();

// Impor composable useChatScroll untuk menangani perilaku scrolling.
// showScrollButton: Ref boolean untuk mengontrol visibilitas tombol "scroll ke bawah".
// scrollToBottom: Fungsi untuk scroll halus ke bagian bawah chat.
// pinToBottom: Fungsi untuk menjaga chat tetap di bawah saat pesan baru masuk.
const { showScrollButton, scrollToBottom, pinToBottom } = useChatScroll();

// Fungsi handler untuk event 'send-message' dari komponen ChatInput.
// Menerima string pesan dan memanggil fungsi composable sendMessage.
function handleSendMessage(message: string) {
  sendMessage(message);
}

// Pantau perubahan pada array messages.
// Saat pesan berubah (misalnya, pesan baru ditambahkan), panggil pinToBottom untuk memastikan
// tampilan tetap pada pesan terbaru jika pengguna sudah berada di bawah.
watch(() => messages.value, pinToBottom, { deep: true });
</script>

<template>
  <!-- Container utama yang dapat di-scroll untuk antarmuka chat. -->
  <div ref="scrollContainer" class="scroll-container">
    <!-- UContainer menyediakan container responsif dan terpusat dengan lebar maksimal. -->
    <UContainer class="chat-container">
      <!-- Keadaan Kosong: Ditampilkan saat tidak ada pesan dalam chat. -->
      <div v-if="!messages?.length" class="empty-state">
        <div class="empty-state-card">
          <h2 class="empty-state-title">Start your chat</h2>
          <!-- Komponen ChatInput digunakan kembali di sini untuk pesan awal. -->
          <ChatInput @send-message="handleSendMessage" />
        </div>
      </div>

      <!-- Antarmuka Chat: Ditampilkan saat ada pesan. -->
      <template v-else>
        <!-- Header menampilkan judul chat. -->
        <div class="chat-header">
          <h1 class="title">
            {{ chat?.title || "Untitled Chat" }}
          </h1>
        </div>

        <!-- Container untuk daftar pesan. -->
        <div class="messages-container">
          <!-- Loop melalui setiap pesan dalam array messages. -->
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="{
              'message-user': message.role === 'user', // Terapkan gaya khusus untuk pesan pengguna
              'message-ai': message.role === 'assistant', // Terapkan gaya khusus untuk pesan AI
            }"
          >
            <!-- Tampilkan konten pesan. -->
            <div class="message-content">{{ message.content }}</div>
          </div>
        </div>

        <!-- Area input tetap di bagian bawah layar. -->
        <div class="message-form-container">
          <!-- Container untuk tombol 'scroll ke bawah'.
               Ditempatkan secara absolut di atas area input. -->
          <div class="scroll-to-bottom-button-container">
            <!-- Tombol untuk scroll ke bawah.
                 Hanya ditampilkan saat showScrollButton bernilai true (pengguna scroll ke atas). -->
            <UButton
              v-if="showScrollButton"
              color="neutral"
              variant="outline"
              icon="i-heroicons-arrow-down"
              class="rounded-full shadow-sm"
              @click="() => scrollToBottom()"
            />
          </div>
          <ChatInput @send-message="handleSendMessage" />
        </div>
      </template>
    </UContainer>
  </div>
</template>

<style scoped>
/* ===== Gaya Tata Letak & Container ===== */
/* Memastikan container utama mengambil tinggi penuh dan memungkinkan scrolling */
.scroll-container {
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
}

/* Membatasi lebar konten chat untuk keterbacaan */
.chat-container {
  max-width: 800px;
  height: 100%;
}

/* ===== Gaya Header ===== */
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

/* ===== Container Pesan ===== */
/* Flex container untuk daftar pesan */
.messages-container {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Jarak antar pesan */
  margin-bottom: 1.5rem;
  overflow-y: auto;
  padding-bottom: 8rem; /* Padding ekstra di bawah untuk mencegah konten tertutup di belakang input tetap */
}

/* ===== Gaya Pesan ===== */
/* Gaya dasar untuk semua pesan */
.message {
  padding: 1rem;
  border-radius: var(--ui-radius);
  transition: all 0.2s;
}

/* Gaya khusus untuk pesan pengguna (rata kanan, latar belakang berbeda) */
.message-user {
  background-color: var(--ui-bg-muted);
  border: 1px solid var(--ui-border);
  width: 70%; /* Batasi lebar untuk membedakan dari pesan AI lebar penuh */
  align-self: flex-end; /* Ratakan ke kanan */
}

/* Gaya khusus untuk pesan AI (lebar penuh, latar belakang transparan) */
.message-ai {
  width: 100%;
  padding: 1rem 0;
  border: none;
  background: none;
}

/* Styling untuk konten teks di dalam pesan */
.message-content {
  color: var(--ui-text);
  word-wrap: break-word; /* Pastikan kata-kata panjang tidak meluap */
  white-space: pre-wrap; /* Pertahankan spasi putih dan baris baru */
  overflow-wrap: break-word;
}

/* ===== Gaya Formulir Input ===== */
/* Memperbaiki formulir input ke bagian bawah viewport */
.message-form-container {
  position: fixed;
  bottom: 1.5rem;
  max-width: 800px;
  width: calc(100% - 3rem); /* Memperhitungkan padding container */
  z-index: 10; /* Pastikan tetap di atas konten lain */
}

/* Container untuk tombol 'scroll ke bawah' (jika diimplementasikan) */
.scroll-to-bottom-button-container {
  position: absolute;
  bottom: calc(100% + 1rem);
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none; /* Izinkan klik melewati container itu sendiri */
}

/* Aktifkan kembali event pointer untuk tombol di dalam container */
.scroll-to-bottom-button-container :deep(button) {
  pointer-events: auto;
}

/* ===== Gaya Keadaan Kosong ===== */
/* Memusatkan konten keadaan kosong secara vertikal dan horizontal */
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

/* ===== Gaya Utilitas ===== */
/* Sembunyikan scrollbar di seluruh browser untuk tampilan yang lebih bersih */
.message-input {
  -ms-overflow-style: none; /* IE dan Edge */
  scrollbar-width: none; /* Firefox */
}

.message-input::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
