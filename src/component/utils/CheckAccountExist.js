import { faUserSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Auth from "../Base/Akun/Auth"
import { useSelector } from "react-redux"

export default function CheckAccountExist() {
    const account = useSelector(state => state.source.account)

    if (!account) return <div className='bg-quaternary p-2 py-6 rounded-md shadow-xl text-center'>
        <FontAwesomeIcon icon={faUserSlash} className='text-5xl text-primary p-2'/>
        <div className="mb-4">
            <h2 className='font-bold text-3xl text-neutral-700'>Masuk ke akun</h2>
            <p className='text-neutral-600'>Harap masuk atau daftar sebelum melakukan absensi</p>
        </div>
        <Auth/>
    </div>
    return null
}