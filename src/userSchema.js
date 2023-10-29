// const anggotaSchema = {
//   NIS: {
//     type: Number,
//     required: true,
//   },
//   nama: {
//     type: String,
//     required: true
//   },
//   panggilan: {
//     type: String,
//     default: '-'
//   },
//   password: {
//     type: String,
//     required: true,
//     default: null
//   },
//   email: {
//     type: String,
//     default: '-'
//   },
//   jenis_kelamin: {
//     type: String,
//     enum: ['Laki-laki', 'Perempuan', '-'],
//     required: true,
//     default: '-'
//   },
//   nomor_absen: {
//     type: Number,
//     required: true,
//     default: '-'
//   },
//   kelas: {
//     type: String,
//     required: true,
//     default: '-'
//   },
//   agama: {
//     type: String,
//     required: true,
//     default: 'Tidak diketahui'
//   },
//   peran: {
//     type: [String],
//     default: []
//   },
//   absen: {
//     type: Boolean,
//     default: false
//   },
//   lainnya: Object
// }

// class Anggota {
//     constructor(data) {
//       this.NIS = validateField(data.NIS, 'NIS', 'number')
//       this.nama = validateField(data.nama, 'Nama', 'string')
//       this.panggilan = validateField(data.panggilan, 'Panggilan', 'string')
//       this.password = validateField(data.password, 'Password', 'string')
//       this.email = validateField(data.email, 'Email', 'string')
//       this.jenis_kelamin = validateField(data.jenis_kelamin, 'Jenis Kelamin', 'string', ['Laki-laki', 'Perempuan'])
//       this.nomor_absen = validateField(data.nomor_absen, 'Nomor Absen', 'number')
//       this.kelas = validateField(data.kelas, 'Kelas', 'string')
//       this.agama = validateField(data.agama, 'Agama', 'string')
//       this.peran = validateField(data.peran, 'Peran', 'array')
//       this.lainnya = data.lainnya || {}
//     }
//   }
  
//   function validateField(value, fieldName, fieldType, enumValues) {
//     if (typeof value !== fieldType) {
//       throw new Error(`${fieldName} harus bertipe ${fieldType}`)
//     }
  
//     if (enumValues && !enumValues.includes(value)) {
//       throw new Error(`${fieldName} harus salah satu dari: ${enumValues.join(', ')}`)
//     }
  
//     return value
//   }
  
//   // Cara penggunaan:
//   const newAnggota = new Anggota({
//     NIS: 123,
//     nama: 'John Doe',
//     panggilan: 'John',
//     password: 'password123',
//     email: 'john@example.com',
//     jenis_kelamin: 'Laki-laki',
//     nomor_absen: 5,
//     kelas: 'XII IPA',
//     agama: 'Islam',
//     peran: ['Ketua OSIS'],
//     lainnya: { tambahan: 'Informasi tambahan' },
//   })
  
//   console.log(newAnggota)
  

// export {anggotaSchema}

export const exampleUsers = [
  {
      "NIS": 123456,
      "nama": "Andi Susanto",
      "nama_panggilan": "Andi",
      "password": "andipass123",
      "email": "andi.susanto@example.com",
      "jenis_kelamin": "Laki-laki",
      "nomor_absen": 1,
      "kelas": "XII IPA 1",
      "agama": "Islam",
      "peran": ["siswa"],
      "absen": true
  },
  {
      "NIS": 234567,
      "nama": "Dewi Kusuma",
      "nama_panggilan": "Dewi",
      "password": "dewipass456",
      "email": "dewi.kusuma@example.com",
      "jenis_kelamin": "Perempuan",
      "nomor_absen": 5,
      "kelas": "XI IPS 2",
      "agama": "Islam",
      "peran": ["siswa"],
      "absen": false
  },
  {
      "NIS": 345678,
      "nama": "Budi Raharjo",
      "nama_panggilan": "Budi",
      "password": "budi123",
      "email": "budi.raharjo@example.com",
      "jenis_kelamin": "Laki-laki",
      "nomor_absen": 10,
      "kelas": "X Akselerasi",
      "agama": "Islam",
      "peran": ["siswa"],
      "absen": true
  },
  {
      "NIS": 456789,
      "nama": "Citra Anggraini",
      "nama_panggilan": "Citra",
      "password": "citra456",
      "email": "citra.anggraini@example.com",
      "jenis_kelamin": "Perempuan",
      "nomor_absen": 3,
      "kelas": "XII IPS 3",
      "agama": "Buddha",
      "peran": ["siswa"],
      "absen": false
  },
  {
      "NIS": 678801,
      "nama": "Fitri Handayani",
      "nama_panggilan": "Fitri",
      "password": "fitrihandayani",
      "email": "fitri.handayani@example.com",
      "jenis_kelamin": "Perempuan",
      "nomor_absen": 15,
      "kelas": "X IPS 1",
      "agama": "Islam",
      "peran": ["siswa"],
      "absen": true
  },
  {
      "NIS": 719012,
      "nama": "Guntur Wibowo",
      "nama_panggilan": "Guntur",
      "password": "guntur123",
      "email": "guntur.wibowo@example.com",
      "jenis_kelamin": "Laki-laki",
      "nomor_absen": 8,
      "kelas": "XII IPA 2",
      "agama": "Islam",
      "peran": ["siswa"],
      "absen": true
  },
  {
      "NIS": 567890,
      "nama": "Eko Prabowo",
      "nama_panggilan": "Eko",
      "password": "ekopass789",
      "email": "eko.prabowo@example.com",
      "jenis_kelamin": "Laki-laki",
      "nomor_absen": 7,
      "kelas": "XI IPA 3",
      "agama": "Islam",
      "peran": ["siswa"],
      "absen": true
  },
  {
      "NIS": 678901,
      "nama": "Fitri Handayani",
      "nama_panggilan": "Fitri",
      "password": "fitrihandayani",
      "email": "fitri.handayani@example.com",
      "jenis_kelamin": "Perempuan",
      "nomor_absen": 15,
      "kelas": "X IPS 1",
      "agama": "Islam",
      "peran": ["siswa"],
      "absen": false
  },
  {
      "NIS": 789012,
      "nama": "Guntur Wibowo",
      "nama_panggilan": "Guntur",
      "password": "guntur123",
      "email": "guntur.wibowo@example.com",
      "jenis_kelamin": "Laki-laki",
      "nomor_absen": 8,
      "kelas": "XII IPA 2",
      "agama": "Islam",
      "peran": ["siswa"],
      "absen": true
  },
  {
      "NIS": 890123,
      "nama": "Hana Pratiwi",
      "nama_panggilan": "Hana",
      "password": "hanapass456",
      "email": "hana.pratiwi@example.com",
      "jenis_kelamin": "Perempuan",
      "nomor_absen": 12,
      "kelas": "XI IPS 1",
      "agama": "Islam",
      "peran": ["siswa"],
      "absen": false
  }
]