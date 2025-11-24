<script setup lang="ts">
// Mendefinisikan props untuk komponen.
// isStreaming: Boolean yang menunjukkan apakah AI sedang membuat respons.
// Kita mendestrukturisasinya dengan nilai default false.
const { isStreaming = false } = defineProps<{
  isStreaming?: boolean;
}>();

// Mendefinisikan event yang dapat dipancarkan komponen ini ke induknya.
// 'send-message': Dipancarkan saat pengguna mengirim pesan, membawa string pesan.
const emit = defineEmits<{
  (e: "send-message", message: string): void;
}>();

// Membuat referensi ke elemen DOM textarea menggunakan useTemplateRef.
// Ini cocok dengan atribut ref="textareaRef" di template.
const textareaRef = useTemplateRef("textareaRef");

// State reaktif untuk input pesan baru.
const newMessage = ref("");

// Fungsi untuk menangani pengiriman pesan.
const handleSendMessage = () => {
  // Mencegah pengiriman jika pesan kosong (hanya spasi) atau jika sedang streaming.
  if (!newMessage.value.trim() || isStreaming) return;

  // Memancarkan event 'send-message' dengan konten pesan yang sudah dipangkas (trim).
  emit("send-message", newMessage.value.trim());

  // Membersihkan kolom input.
  newMessage.value = "";

  // Menggunakan nextTick untuk menunggu DOM diperbarui setelah membersihkan nilai.
  nextTick(() => {
    // Mengatur ulang tinggi textarea ke ukuran dasarnya.
    adjustTextareaHeight();
    // Menjaga fokus pada textarea untuk UX yang lebih baik.
    textareaRef.value?.focus();
  });
};

// Fungsi untuk mengubah ukuran textarea secara otomatis berdasarkan kontennya.
const adjustTextareaHeight = async (): Promise<void> => {
  if (textareaRef.value) {
    // Pertama atur ulang tinggi ke auto untuk menghitung scrollHeight baru dengan benar (menyusut jika diperlukan).
    textareaRef.value.style.height = "auto";
    // Tunggu pembaruan DOM.
    await nextTick();
    // Atur tinggi ke scrollHeight (tinggi penuh konten).
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
};

// Saat komponen dipasang (mounted), fokuskan textarea secara otomatis.
onMounted(() => {
  textareaRef.value?.focus();
});

// Pantau prop 'isStreaming'.
// Saat streaming selesai (nilai menjadi false), fokuskan kembali textarea.
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
  <!-- Pembungkus formulir untuk area input.
       @submit.prevent mencegah pengiriman formulir default (muat ulang halaman) dan memanggil handleSendMessage. -->
  <form class="message-form-wrapper" @submit.prevent="handleSendMessage">
    <!-- Textarea untuk input multi-baris.
         ref="textareaRef": Terhubung ke textareaRef di script.
         v-model="newMessage": Binding dua arah dengan state newMessage.
         :disabled="isStreaming": Menonaktifkan input saat AI sedang membuat respons.
         @input="adjustTextareaHeight": Menyesuaikan tinggi setiap kali pengguna mengetik.
         @keydown.enter.prevent="handleSendMessage": Mengirim pesan pada tombol Enter (mencegah baris baru default). -->
    <textarea
      ref="textareaRef"
      v-model="newMessage"
      class="message-input"
      :disabled="isStreaming"
      :rows="1"
      @input="adjustTextareaHeight"
      @keydown.enter.prevent="handleSendMessage"
    />
    <!-- Tombol kirim.
         :disabled: Dinonaktifkan jika pesan kosong atau sedang streaming.
         icon: Menggunakan ikon dari set heroicons. -->
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
/* Pembungkus untuk formulir input, memberikan border bulat dan tata letak */
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

/* Mencegah efek transformasi pada fokus/hover agar tetap stabil */
.message-form-wrapper:focus-within,
.message-form-wrapper:hover {
  transform: none;
}

/* Hapus outline dan shadow default saat hover */
.message-form-wrapper:hover {
  outline: none;
  box-shadow: none;
}

/* Styling untuk input textarea itu sendiri */
.message-input {
  width: 100%;
  padding: 0;
  margin-right: 1.5rem; /* Ruang untuk tombol kirim */
  resize: none; /* Nonaktifkan pengubahan ukuran manual */
  background-color: transparent;
  outline: none;
}

/* Tambahkan bayangan halus saat hover untuk kedalaman */
.message-form-wrapper:hover {
  outline: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Styling untuk keadaan dinonaktifkan (disabled) */
.message-input:disabled {
  cursor: not-allowed;
}
</style>
