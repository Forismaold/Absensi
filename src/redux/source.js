import { createSlice } from "@reduxjs/toolkit";

const source = createSlice({
    name: 'source',
    initialState: {
        account: {
            "NIS": 500,
            "avatar": "https://th.bing.com/th/id/OIP.ZvirSVF47jPTxgL0yJ6pyAAAAA?pid=ImgDet&rs=1",
            "nama": "Anak Forisma",
            "nama_panggilan": "AnkForisma",
            "password": "anjayDulu",
            "email": "ankforisma@example.com",
            "jenis_kelamin": "L",
            "nomor_absen": 1,
            "kelas": "F-0",
            "agama": "Islam",
            "peran": ["siswa"],
            "absen": false
        }
    },
    reducers: {
        setAccount: (state, action) => {
            state.account = action.payload
        },
    }
})
export const { setUsers } = source.actions
export default source.reducer