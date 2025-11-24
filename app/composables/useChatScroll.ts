export default function useChatScroll() {
  // Mengambil referensi ke elemen DOM menggunakan useTemplateRef (fitur Nuxt/Vue).
  // 'scrollContainer' adalah div pembungkus chat yang bisa di-scroll.
  const scrollContainer = useTemplateRef<HTMLDivElement>("scrollContainer");
  // 'textareaRef' adalah referensi ke input teks chat.
  const textareaRef = useTemplateRef<HTMLTextAreaElement>("textareaRef");

  // State reaktif untuk melacak apakah pengguna sedang berada di posisi paling bawah chat.
  const isAtBottom = ref(true);
  // State reaktif untuk menentukan kapan tombol "scroll to bottom" harus muncul.
  const showScrollButton = ref(false);

  // Fungsi untuk mengecek posisi scroll saat ini.
  // Dijalankan setiap kali event 'scroll' terjadi pada container.
  const checkScrollPosition = (): void => {
    if (scrollContainer.value) {
      // Mengambil properti scroll dari elemen container.
      // scrollTop: posisi scroll vertikal saat ini.
      // scrollHeight: total tinggi konten (termasuk yang tidak terlihat).
      // clientHeight: tinggi area yang terlihat (viewport container).
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;

      // Menentukan apakah kita berada di bawah (dengan toleransi 200px dari bawah).
      isAtBottom.value = scrollTop + clientHeight >= scrollHeight - 200;

      // Tombol scroll muncul jika kita TIDAK berada di bawah.
      showScrollButton.value = !isAtBottom.value;
    }
  };

  // Fungsi untuk menggulir chat ke posisi paling bawah.
  // Menerima parameter 'immediate' untuk menentukan apakah scroll instan atau animasi halus.
  const scrollToBottom = (immediate = false): void => {
    if (!scrollContainer.value) return;

    // Menghitung posisi target scroll (paling bawah).
    const targetScrollTop =
      scrollContainer.value.scrollHeight - scrollContainer.value.clientHeight;

    // Jika immediate = true, langsung lompat ke bawah tanpa animasi.
    if (immediate) {
      scrollContainer.value.scrollTop = targetScrollTop;
      return;
    }

    // Logika untuk animasi smooth scroll manual (menggunakan requestAnimationFrame).
    const startScrollTop = scrollContainer.value.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    const duration = 300; // Durasi animasi dalam milidetik

    const startTime = performance.now();

    // Fungsi langkah animasi yang dipanggil setiap frame.
    function step(currentTime: number): void {
      const elapsed = currentTime - startTime;
      // Menghitung progress (0 sampai 1).
      const progress = Math.min(elapsed / duration, 1);

      // Fungsi easing (easeInOutCubic) agar animasi terasa lebih natural (lambat-cepat-lambat).
      const easeInOutCubic =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      if (scrollContainer.value) {
        // Mengupdate posisi scroll berdasarkan progress animasi.
        scrollContainer.value.scrollTop =
          startScrollTop + distance * easeInOutCubic;

        // Jika belum selesai, minta frame animasi berikutnya.
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
    }

    // Memulai animasi.
    requestAnimationFrame(step);
  };

  // Fungsi untuk "memaku" posisi scroll ke bawah saat pesan baru masuk.
  // Hanya berjalan jika pengguna sebelumnya memang sudah ada di posisi bawah.
  async function pinToBottom() {
    if (isAtBottom.value) {
      // Memaksa scroll instan ke bawah setelah update DOM (nextTick).
      if (scrollContainer.value) {
        await nextTick();
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
      }
    }
  }

  // Lifecycle Hook: Dijalankan saat komponen dipasang (mounted) ke DOM.
  onMounted(() => {
    if (scrollContainer.value) {
      // Menambahkan event listener untuk mendeteksi scroll manual pengguna.
      scrollContainer.value.addEventListener("scroll", checkScrollPosition);

      // Setelah render awal selesai, scroll ke bawah dan fokus ke input.
      nextTick(() => {
        scrollToBottom(true); // Gunakan scroll instan saat pertama kali load.
        textareaRef.value?.focus();
      });
    }
  });

  // Lifecycle Hook: Dijalankan saat komponen akan dihancurkan (unmounted).
  // Penting untuk membersihkan event listener agar tidak memakan memori (memory leak).
  onUnmounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.removeEventListener("scroll", checkScrollPosition);
    }
  });

  // Lifecycle Hook: Dijalankan setiap kali komponen di-update (re-render).
  // Memastikan status posisi scroll tetap akurat setelah update UI.
  onUpdated(() => {
    checkScrollPosition();
  });

  // Mengembalikan state dan fungsi yang dibutuhkan oleh komponen yang menggunakan composable ini.
  return {
    isAtBottom,
    showScrollButton,
    scrollToBottom,
    textareaRef,
    pinToBottom,
  };
}
