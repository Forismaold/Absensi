// import { Link } from "react-router-dom";
// import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { blankToast, loadingToast } from "../../utils/myToast";
import axios from "axios";
import { API, decryptObject, setLocalStorage } from "../../../utils";
import { useDispatch } from "react-redux";
import { refreshAccount } from "../../../redux/source";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode'
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";

export default function Auth() {
    // login
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userDecode, setUserDecode] = useState(null)
    async function handleSuccess(credential) {
        const promise = loadingToast('Mencari akun')
        try {
            await axios.post(API + '/akun/login/google', {...credential})
            .then(res => {
                const userInfo = decryptObject(res.data.user)
                setLocalStorage('account', res.data.user)
                dispatch(refreshAccount())
                navigate('/akun')
                promise.onSuccess('Selamat datang kembali ' + userInfo.nama)
            })
            .catch(err => {
                if (err?.response?.status === 401) {
                    promise.close()
                    setUserDecode(jwtDecode(credential.credential))
                    return
                }
                throw new Error(err)
            })
        } catch (error) {
            console.log(error)
            promise.onError(error?.msg || 'Server error')
        }
    }
    // register
    const [nama, setNama] = useState('')
    const [nomorKelas, setNomorKelas] = useState('')
    const [kelas, setKelas] = useState('X.E')
    const [nomorAbsen, setNomorAbsen] = useState('')

    const [isRecaptchaVerified, setRecaptchaVerified] = useState(false)
    useEffect(() => {
        setNama(userDecode?.name || '')
    },[userDecode])

    function onChange(value) {
        setRecaptchaVerified(true)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!isRecaptchaVerified) return toast.error('Silakan lengkapi reCAPTCHA')
        const dataToSend = {
            nama: nama.trim(),
            avatar: userDecode.picture,
            email: userDecode.email,
            kelas,
            nomorKelas,
            nomorAbsen,
        }

        const promise = loadingToast('Membuat akun')
        try {
            await axios.post(API + '/akun/register/google', dataToSend)
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
    return <div className='flex gap-2 flex-col'>
        {userDecode ? 
            <form className='flex flex-col gap-2 text-neutral-700' onSubmit={handleSubmit}>
                <p className="text-neutral-500"><span className="font-semibold">Hai orang baru!</span> waktunya mengisi formulir</p>
                <img src={userDecode.picture} alt={userDecode.nama} className="h-24 w-24 shadow rounded-full mx-auto" referrerPolicy="no-referrer"/>
                <input className='p-2 rounded shadow w-full' type="text" value={nama} onChange={handleChangeName} placeholder='Nama' autoComplete='off' required/>
                <div className='flex gap-2 items-center'>
                    <select value={kelas} onChange={(e) => setKelas(e.target.value)} className='min-h-[40px] shadow p-2 rounded' required>
                        <option value="X.E">X.E</option>
                        <option value="XI.F">XI.F</option>
                        <option value="XII.F">XII.F</option>
                    </select>
                    <span>-</span>
                    <input className='p-2 rounded shadow w-full' type="number" value={nomorKelas} onChange={e => setNomorKelas(e.target.value)} placeholder='Nomor kelas' autoComplete='off' required max={10}/>
                </div>
                <input className='p-2 rounded shadow w-full' type="number" value={nomorAbsen} onChange={e => setNomorAbsen(e.target.value)} placeholder='Nomor absen' autoComplete='off' max={40} required/>
                <div className='max-w-full overflow-auto'>
                    <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_SITE} onChange={onChange}/>
                </div>
                <button type='submit' className={`text-center rounded ${isRecaptchaVerified ? 'bg-primary' : 'bg-tertiary'} text-neutral-200 shadow-md shadow-primary/50 p-2 click-animation`}>Kirim</button>
            </form>
        :
            <>
            <div className="flex flex-col">
                <h3 className="font-semibold text-2xl">Selamat datang</h3>
                <p>Ayo masuk dengan Google!</p>
            </div>
            <div className="flex items-center justify-center">
                <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            handleSuccess(credentialResponse)
                        }}
                        onError={() => {
                            console.log('Login Failed')
                            blankToast('Gagal saat masuk dengan Google')
                        }}
                        useOneTap
                    />
                </GoogleOAuthProvider>
            </div>
            </>
        }
    </div>
}
/* <div className="mt-2 flex gap-2 items-center justify-center">
    <Link to={'/akun/masuk'}>
        <div className='flex gap-2 rounded p-2 px-3 items-center bg-neutral-200 text-neutral-600 cursor-pointer shadow click-animation'>
            <FontAwesomeIcon icon={faArrowRightToBracket}/>
            <span>Masuk</span>
        </div>
    </Link>
    <p>atau</p>
    <Link to={'/akun/daftar'}>
        <div className='flex gap-2 rounded p-2 px-3 items-center bg-primary text-neutral-200 cursor-pointer shadow-md shadow-primary/50 click-animation'>
            <span>Daftar</span>
        </div>
    </Link>
</div> */