import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import { API, setLocalStorage } from "../../../utils"
import axios from "axios"
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { refreshAccount } from '../../../redux/source'

export default function Login() {
    return <div>
        <p>ini halaman login</p>
        <LoginForm/>
        {/* <GoogleLoginButton/> */}
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

function LoginForm() {
    const [nama, setNama] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    function handleSubmit(e) {
        e.preventDefault()
        try {
            axios.post(API + '/akun/login/form', {nama, password})
            .then(res => {
                setLocalStorage('account', res.data.user)
                console.log(res.data.user)
                dispatch(refreshAccount())
                navigate('/akun')
            }).catch(err => {
                if (err?.response?.status === 401) alert(err?.response?.data.message)
            })
        } catch (error) {
            
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
            <input className='p-2 rounded shadow w-full' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Kata sandi' autoComplete='off' required/>
            <button type='submit' className='text-center rounded bg-indigo-500 text-neutral-200 shadow p-2'>Submit</button>
        </form>
    </div>
}

// function GoogleLoginButton() {
//     async function handleSuccess(credential) {
//         axios.post(API + '/akun/login', {credential: credential})
//         .then(res => console.log(res))
//         .catch(err => console.log(err))
//     }
//     return <div className="p-8 flex justify-center">
//         <form action=""></form>
//         <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
//             <GoogleLogin
//                 onSuccess={handleSuccess}
//                 onError={() => {
//                     console.log('Login Failed')
//                 }}
//                 useOneTap
//             />
//         </GoogleOAuthProvider>
//     </div>
// }