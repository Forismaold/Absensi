import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight, faEllipsisH, faUser } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { setLocalStorage } from "../../../utils"
import axios from '../../utils/axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { refreshAccount } from '../../../redux/source'
import { toast } from 'react-toastify'
import { loadingToast } from '../../utils/myToast'
import ReCAPTCHA from "react-google-recaptcha";

export default function Register() {
    const account = useSelector(state => state.source.account)
    const navigate = useNavigate()
    useEffect(() => {
        if (account) navigate('/akun')
    },[account, navigate])
    return <div>
        <p>ini halaman daftar</p>
        <RegisterForm/>
    </div>
}

function RegisterForm() {
    const [nama, setNama] = useState('')
    const [panggilan, setPanggilan] = useState('')
    const [nomorKelas, setNomorKelas] = useState('')
    const [kelas, setKelas] = useState('X.E')
    const [nomorAbsen, setNomorAbsen] = useState('')
    const [NIS, setNIS] = useState('')
    const [jenisKelamin, setJenisKelamin] = useState('-')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showOptionalInput, setShowOptionalInput] = useState(false)

    const [isRecaptchaVerified, setRecaptchaVerified] = useState(false);
    function onChange(value) {
        setRecaptchaVerified(true)
    }

    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function handleSubmit(e) {
        e.preventDefault()
        if (password !== confirmPassword) return toast.error('Kata sandi dan Konfirmasi kata sandi tidak cocok!')
        if (!isRecaptchaVerified) return toast.error('Silakan lengkapi reCAPTCHA')
        const dataToSend = {
            nama: nama.trim(),
            panggilan,
            kelas,
            nomorKelas,
            nomorAbsen,
            jenisKelamin,
            password,
            NIS
        }

        const promise = loadingToast('Membuat akun')
        try {
            await axios.post('/akun/daftar', dataToSend)
            .then(res => {
                setLocalStorage('account', res.data.user)
                dispatch(refreshAccount())
                navigate('/akun')
                promise.onSuccess('Berhasil membuat akun')
            })
            .catch(err => {
                if (err?.response?.status === 409) promise.onError(err?.response?.data.msg)
            })
        } catch (error) {
            promise.onError(error.msg)
        }
    }

    function handleChangeName(e) {
        setNama(e.target.value.replace(/[^A-Za-z ]/ig, ''))
    }
    function handleChangeNickname(e) {
        setPanggilan(e.target.value.replace(/[^A-Za-z._0-9 ]/ig, ''))
    }

    return <div className="p-2 flex flex-col justify-center gap-4">
        <form className='flex flex-col gap-2 text-neutral-800' onSubmit={handleSubmit}>
            <div className='flex gap-2 text-neutral-700 items-center font-mediumm'>
                <FontAwesomeIcon icon={faUser}/>
                <p>Data diri</p>
            </div>
            <input className='p-2 rounded shadow w-full' type="text" value={nama} onChange={handleChangeName} placeholder='Nama' autoComplete='off' required/>
            <div className='flex gap-2 items-center'>
                <select value={kelas} onChange={(e) => setKelas(e.target.value)} className='min-h-[40px] shadow p-2 rounded' required>
                    <option value="X.E">X.E</option>
                    <option value="XI.F">XI.F</option>
                    <option value="XII.F">XII.F</option>
                </select>
                <span>-</span>
                <input className='p-2 rounded shadow w-full' type="number" value={nomorKelas} onChange={e => setNomorKelas(e.target.value)} placeholder='Kelas' autoComplete='off' required/>
            </div>
            <input className='p-2 rounded shadow w-full' type="number" value={nomorAbsen} onChange={e => setNomorAbsen(e.target.value)} placeholder='Nomor absen' autoComplete='off' max={40}/>
            <p>Kata sandi</p>
            <input className='p-2 rounded shadow w-full' type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='Kata sandi' autoComplete='off' required/>
            <input className='p-2 rounded shadow w-full' type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder='Konfirmasi kata sandi' autoComplete='off' required/>
            <div className='flex gap-2 text-neutral-700 items-center font-mediumm justify-between click-animation cursor-pointer' onClick={() => setShowOptionalInput(prev => !prev)}>
                <div className='flex gap-2 items-center'>
                    <FontAwesomeIcon icon={faEllipsisH}/>
                    <p>Opsional</p>
                </div>
                <FontAwesomeIcon icon={showOptionalInput ? faChevronDown : faChevronRight}/>
            </div>
            {showOptionalInput &&
                <>
                <input className='p-2 rounded shadow w-full' type="number" value={NIS} onChange={e => setNIS(e.target.value)} placeholder='NIS' autoComplete='off' maxLength={4}/>
                <input className='p-2 rounded shadow w-full' type="text" value={panggilan} onChange={handleChangeNickname} placeholder='Nama panggilan' autoComplete='off' maxLength={20}/>
                <select value={jenisKelamin} onChange={e => setJenisKelamin(e.target.value)} className='min-h-[40px] shadow p-2 rounded' placeholder='Jenis kelamin'>
                    <option value="-" disabled>Jenis kelamin</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                </select>
                </>
            }
            <div className='max-w-full overflow-auto'>
                <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_SITE} onChange={onChange}/>
            </div>
            <button type='submit' className={`text-center rounded ${isRecaptchaVerified ? 'bg-primary' : 'bg-tertiary'} text-neutral-200 shadow-md shadow-primary/50 p-2 click-animation`}>Buat akun</button>
        </form>
    </div>
}