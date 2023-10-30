# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Project Requirement

### Halaman Order Produk

#### Bagian Daftar Produk

- [x] Daftar produk yang menampilkan "gambar" , "judul", dan "harga" produk
- [x] Ketika produk ditekan maka produk akan ditambahkan ke Daftar Pesanan
- [x] Produk dapat diurutkan berdasarkan "judul" dan "harga"
- [x] Produk dapat difilter berdasarkan kategori
- [x] Tersedia fitur pencarian produk berdasarkan "judul"

#### Bagian Daftar Pesanan

- [x] Daftar produk yang telah dipesan yang menampilkan "judul", "kuantitas", dan "harga" produk
- [x] Terdapat tombol Hapus pada setiap produk yang dipesan
- [x] Total harga dari semua pesanan
- [x] Tombol Bayar yang ketika ditekan akan mengarah ke halaman Pembayaran

### Halaman Pembayaran

#### Bagian Rincian Pesanan

- [x] Halaman ini menampilkan daftar rincian pesanan yang berisi "judul", "harga", "kuantitas", "subtotal" dari setiap produk,  "total" harga pesanan, "jumlah yang dibayar", dan "jumlah kembalian"
- [x] Terdapat tombol Selesaikan Pesanan yang ketika ditekan akan menampilkan pop up pembelian sukses, kemudian me-reset Daftar Pesanan, dan mengembalikan ke halaman Order Produk

#### Bagian Pembayaran

- [x] Halaman ini menampilkan Total Harga yang akan dibayar, Jumlah Uang yang konsumer beri, dan Jumlah Kembalian, dan Tombol Rincian Pesanan
- [x] Jumlah Kembalian berubah secara otomatis ketika Input Jumlah Uang Konsumer berubah
- [ ] Ketika tombol Rincian Pesanan ditekan, maka akan diarahkan ke halaman Rincian Pesanan

### Halaman Riwayat Transaksi

- [x] Halaman ini menampilkan tabel riwayat transaksi yang berisi "tanggal transaksi", "total harga", dan "action/opsi" yang berisi tombol "detail transaksi"
- [x] ketika tombol detail transaksi ditekan, maka akan diarahkan ke halaman detail transaksi

### Halaman Detail Transaksi

- [x] Halaman ini menampilkan detail dari transaksi yang berisi daftar produk yang dibeli, dan semua data yang berkaitan dengan transaksi
