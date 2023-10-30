import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"

export default function Login() {
    return <div>
        <p>ini halaman login</p>
        <LoginButton/>
    </div>
}

function LoginButton() {
    return <div>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    console.log(credentialResponse)
                }}
                onError={() => {
                    console.log('Login Failed')
                }}
                useOneTap
            />
        </GoogleOAuthProvider>
    </div>
}