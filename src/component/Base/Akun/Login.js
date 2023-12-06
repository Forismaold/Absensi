import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import { API, setLocalStorage } from "../../../utils"
import axios from "axios"
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { refreshAccount, setStatus } from '../../../redux/source'
import { loadingToast } from '../../utils/myToast'
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'


export default function Login() {
    return <div className='flex flex-col'>
        <p>ini halaman login</p>
        <LoginForm/>
        <span className='text-center'>atau</span>
        <GoogleLoginButton/>
    </div>
}

function LoginForm() {
    const [nama, setNama] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    function onChange(value) {
        setRecaptchaVerified(true)
    }

    const [isRecaptchaVerified, setRecaptchaVerified] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault()
        if (!isRecaptchaVerified) return toast.error('Silakan lengkapi reCAPTCHA')
        const promise = loadingToast('Mencari akun')
        try {
            await axios.post(API + '/akun/login/form', {nama, password})
            .then(res => {
                setLocalStorage('account', res.data.user)
                dispatch(refreshAccount())
                dispatch(setStatus())
                navigate('/akun')
                promise.onSuccess('Berhasil masuk ke akun')
            }).catch(err => {
                setNama('')
                setPassword('')
                if (err?.response?.status === 401) return promise.onError(err?.response?.data.msg)
                throw new Error(err)
            })
        } catch (error) {
            promise.onError(error?.msg || 'Server error')
        }
    }

    function handleChangeName(e) {
        setNama(e.target.value.replace(/[^A-Za-z ]/ig, ''))
    }

    return <div className="p-2 flex flex-col justify-center gap-4">
        <form className='flex flex-col gap-2 text-neutral-800' onSubmit={handleSubmit}>
            <div className='flex gap-2 text-neutral-700 items-center font-mediumm'>
                <FontAwesomeIcon icon={faUser}/>
                <p>Data diri</p>
            </div>
            <input className='p-2 rounded shadow w-full' type="text" value={nama} onChange={handleChangeName} placeholder='Nama' autoComplete='off' required/>
            <div className='flex gap-2 text-neutral-700 items-center font-mediumm'>
                <FontAwesomeIcon icon={faKey}/>
                <p>Kata sandi</p>
            </div>
            <input className='p-2 rounded shadow w-full' type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='Kata sandi' autoComplete='off' required/>
            <div className='max-w-full overflow-auto'>
                <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_SITE} onChange={onChange}/>
            </div>
            <button type='submit' className={`text-center rounded ${isRecaptchaVerified ? 'bg-primary' : 'bg-tertiary'} text-neutral-200 shadow-md shadow-primary/50 p-2 duration-200 ease-in-out active:scale-95`}>Submit</button>
        </form>
    </div>
}

function GoogleLoginButton() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function handleSuccess(credential) {
        const promise = loadingToast('Mencari akun')
        try {
            await axios.post(API + '/akun/login/google', {...credential})
            .then(res => {
                setLocalStorage('account', res.data.user)
                dispatch(refreshAccount())
                dispatch(setStatus())
                navigate('/akun')
                promise.onSuccess('Berhasil masuk ke akun')
            })
            .catch(err => {
                if (err?.response?.status === 401) return promise.onError(err?.response?.data.msg)
                throw new Error(err)
            })
        } catch (error) {
            promise.onError(error?.msg || 'Server error')
        }
    }
    return <div className="py-4 flex justify-center">
        <form action=""></form>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {
                    console.log('Login Failed')
                }}
                useOneTap
            />
        </GoogleOAuthProvider>
    </div>
}