import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
// import { API } from "../../../utils"
// import axios from "axios"
import { useState } from 'react'

export default function Register() {
    return <div>
        <p>ini halaman daftar</p>
        <LoginButton/>
        <div className='flex'>
            <Link to={'/akun'}>
            <div className="text-neutral-700 flex gap-2 items-center p-2 px-3 shadow cursor-pointer rounded-full">
                <FontAwesomeIcon icon={faArrowLeft}/>
                <p>Kembali</p>
            </div>
            </Link>
        </div>
    </div>
}

function LoginButton() {
    const [nama, setNama] = useState('')
    const [kelas, setKelas] = useState('')
    const [noAbsen, setNoAbsen] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        // const dataToSend = {
        //     nama,
        //     kelas,
        //     nomor_absen: noAbsen
        // }

        return alert('Sabar, masi dalam tahap pengembangan')

        // try {
        //     axios.post(API + '/akun/register', dataToSend)
        //     .then(res => console.log(res))
        //     .catch(err => console.log(err))
        // } catch (error) {
        //     console.log(error);
        // }
    }

    return <div className="p-4 flex flex-col justify-center gap-2">
        <div className='flex gap-4 text-neutral-700 items-center font-mediumm'>
            <FontAwesomeIcon icon={faUser}/>
            <p>isi data diri</p>
        </div>
        <form className='flex flex-col gap-2 text-neutral-800' onSubmit={handleSubmit}>
            <input className='p-2 rounded shadow w-full' type="text" id='nama' value={nama} onChange={(e) => setNama(e.target.value)} placeholder='Nama' autoComplete='off'/>
            <div className='flex gap-2 flex-col md:flex-row'>
                <input className='p-2 rounded shadow w-full' type="text" id='nama' value={kelas} onChange={(e) => setKelas(e.target.value)} placeholder='Kelas' autoComplete='off'/>
                <input className='p-2 rounded shadow w-full' type="number" id='nama' value={noAbsen} onChange={(e) => setNoAbsen(e.target.value)} placeholder='Nomor absen' autoComplete='off'/>
            </div>
            <button type='submit' className='text-center rounded bg-indigo-500 text-neutral-200 shadow p-2'>Submit</button>
        </form>
    </div>
}