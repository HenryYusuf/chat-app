import type { Chat, ChatMessage } from "~/types";
import { MOCK_CHAT } from "~/composables/mockData";

export default function useChat() {
  // State reaktif untuk objek chat, diinisialisasi dengan data mock.
  const chat = ref<Chat>(MOCK_CHAT);
  // Computed property untuk mengakses pesan dari objek chat.
  const messages = computed<ChatMessage[]>(() => chat.value.messages);

  // Fungsi helper untuk membuat objek pesan baru.
  // Menerima konten pesan dan peran (user atau assistant).
  function createMessage(message: string, role: ChatMessage["role"]) {
    // Membuat ID sederhana berdasarkan panjang array pesan saat ini.
    const id = messages.value.length.toString();

    return {
      id,
      role,
      content: message,
    };
  }

  // Fungsi untuk mengirim pesan.
  // Menambahkan pesan pengguna ke daftar pesan, lalu mensimulasikan respons asisten.
  function sendMessage(message: string) {
    // Tambahkan pesan pengguna ke state.
    messages.value.push(createMessage(message, "user"));

    // Simulasikan penundaan jaringan sebelum asisten merespons.
    setTimeout(() => {
      // Tambahkan respons asisten (echo pesan pengguna).
      messages.value.push(createMessage(`You said: ${message}`, "assistant"));
    }, 200);
  }

  // Kembalikan state dan fungsi yang diperlukan oleh komponen.
  return {
    chat,
    messages,
    sendMessage,
  };
}
