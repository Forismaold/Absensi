import { faArrowRightFromBracket, faArrowRightToBracket, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Modal from '../../utils/Modal'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { API, setLocalStorage } from '../../../utils'
import axios from 'axios'
import { refreshAccount } from '../../../redux/source'
import { loadingToast } from '../../utils/myToast'


export default function Akun() {
    const akun = useSelector(state => state.source.account)

    useEffect(() => console.log(akun))
    const dispatch = useDispatch()
    
    function keluar() {
        localStorage.removeItem('account')
        dispatch(refreshAccount())
    }

    return <div>
        <p>Ini halaman akun</p>
        {akun?
        <>
            <Profile/>
            <hr />
            <div className='mt-2 items-center flex gap-2'>
                {akun.email ? <p>{akun.email}</p> : <TautkanDenganGoogle/>}
                <div className='flex gap-2 rounded p-2 px-3 items-center bg-neutral-200 text-neutral-600 cursor-pointer shadow' onClick={keluar}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket}/>
                    <span>keluar</span>
                </div>
            </div>
        </>
        : <div>
            <div className='mt-2 flex gap-2 items-center justify-center'>
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
        </div>}
    </div>
}

function Profile() {
    const akun = useSelector(state => state.source.account)
    const [bioData,] = useState([
        { prop: 'Nama', value: akun.nama },
        { prop: 'Kelas', value: akun.kelas },
        { prop: 'Nomor Absen', value: akun.nomor_absen },
        { prop: 'Agama', value: akun.agama },
        { prop: 'Jenis Kelamin', value: akun.jenis_kelamin },
    ])
    return <div className="flex flex-col shadow rounded-3xl overflow-hidden">
        <div className="flex flex-col sm:flex-row shadow-md rounded-md p-2 items-center gap-2">
            <img src={akun.avatar} alt={akun.nama} className="h-24 w-24 shadow rounded-full"/>
            <div className="flex flex-col p-2 justify-center font-medium text-neutral-700 items-center sm:items-start">
                <p>{akun.nama_panggilan||akun.nama}<span>#{akun.NIS||akun._id}</span></p>
                <div>{akun?.peran?.map(x => (
                    <span key={x} className="px-2 rounded-full bg-indigo-200 text-indigo-600 text-sm">{x}</span>
                ))}</div>
            </div>
        </div>
        <div className="px-4 mt-4">
            {bioData.map(({ prop, value }) => (
                <ProfileBioCell key={prop} prop={prop} value={value} />
            ))}
        </div>
    </div>
}

function ProfileBioCell({prop, value}) {
    return <div className="flex flex-col sm:flex-row border-b-[1px] border-solid border-neutral-400 last:border-transparent py-2">
        <p className="sm:w-2/6 font-medium">{prop}</p>
        <p>{value}</p>
    </div>
}

function TautkanDenganGoogle() {
    const [openAddGoogleEmail, setOpenAddGoogleEmail] = useState(false)
    const user = useSelector(state => state.source.account)

    const dispatch = useDispatch()

    async function handleSuccess(credential) {
        const promise = loadingToast()
        try {
            await axios.post(API + '/akun/bind/google', {
                ...credential, _id: user._id
            }).then(res => {
                setLocalStorage('account', res.data.user)
                dispatch(refreshAccount())
                setOpenAddGoogleEmail(false)
                promise.onSuccess('Akun berhasil ditautkan')
            }).catch(err => {
                console.log(err)
                promise.onError('Akun gagal ditautkan')
            })
        } catch (error) {
            promise.onError(error?.message || 'Server error')
        }
    }

    return <div>
        <div className='flex gap-2 rounded p-2 px-3 items-center cursor-pointer shadow' onClick={() => setOpenAddGoogleEmail(true)}>
            <FontAwesomeIcon icon={faLink}/>
            <span>Tautkan akun dengan Google</span>
        </div>
        <Modal isOpen={openAddGoogleEmail} onClose={() => setOpenAddGoogleEmail(false)}>
            <div className='flex gap-4 items-center justify-center flex-col p-4'>
                <p className='text-neutral-700'>Tautkan email</p>
                <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            handleSuccess(credentialResponse)
                        }}
                        onError={() => {
                            console.log('Login Failed')
                        }}
                        useOneTap
                        />
                </GoogleOAuthProvider>
            </div>
        </Modal>
    </div>
}