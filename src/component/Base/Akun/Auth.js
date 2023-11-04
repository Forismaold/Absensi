import { Link } from "react-router-dom";
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Auth() {
    return <div className='mt-2 flex gap-2 items-center justify-center'>
        <Link to={'/akun/masuk'}>
            <div className='flex gap-2 rounded p-2 px-3 items-center bg-neutral-200 text-neutral-600 cursor-pointer shadow'>
                <FontAwesomeIcon icon={faArrowRightToBracket}/>
                <span>Masuk</span>
            </div>
        </Link>
        <p>atau</p>
        <Link to={'/akun/daftar'}>
            <div className='flex gap-2 rounded p-2 px-3 items-center bg-indigo-500 text-neutral-200 cursor-pointer shadow'>
                <span>Daftar</span>
            </div>
        </Link>
    </div>
}