import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import { API } from "../../../utils"
import axios from "axios"

export default function Login() {
    return <div>
        <p>ini halaman login</p>
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
    async function handleSuccess(credential) {
        axios.post(API + '/akun/login', {credential: credential})
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
    return <div className="p-8 flex justify-center">
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