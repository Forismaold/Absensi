import { faArrowRightFromBracket, faLink, faXmark, faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Modal, { Confirm } from '../../utils/Modal'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { API, decryptObject, setLocalStorage } from '../../../utils'
import axios from 'axios'
import { refreshAccount } from '../../../redux/source'
import { loadingToast } from '../../utils/myToast'
import Auth from './Auth'
import AbsenceQrCode from './AbsenceQrCode'

export default function Akun() {
    const account = useSelector(state => state.source.account)
    const [showKeluarDialog, setShowKeluarDialog] = useState(false)

    const dispatch = useDispatch()

    function checkForAccount() {
        setShowKeluarDialog(true)
    }
    
    function keluar() {
        localStorage.removeItem('account')
        dispatch(refreshAccount())
        setShowKeluarDialog(false)
    }

    return <div>
        {account?
        <>
            <Profile/>
            <hr />
            <div className='mt-2 items-center flex gap-2 flex-wrap'>
                {account.email ? <p>{account.email}</p> : <TautkanDenganGoogle/>}
                <div className='flex gap-2 rounded p-2 px-3 items-center bg-neutral-200 text-neutral-600 cursor-pointer shadow click-animation' onClick={() => checkForAccount()}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket}/>
                    <span>keluar</span>
                </div>
            </div>
            {/* <Confirm isOpen={openKeluarDialog} onClose={() => setOpenKeluarDialog(false)} callBack={keluar} title='Anda Belum mentautkan email' subTitle='Untuk mempermudah saat masuk kembali, kami menyarankan untuk menautkan akun Google kamu sebelum keluar. Kamu tetap ingin lanjut keluar?'/> */}
            <Confirm isOpen={showKeluarDialog} onClose={() => setShowKeluarDialog(false)} callBack={keluar} title='Lanjutkan keluar' subTitle='Apakah kamu ingin keluar dari akun ini?'/>
        </>
        : <Auth/>}
    </div>
}

function Profile() {
    const akun = useSelector(state => state.source.account)
    const [bioData, setBioData] = useState([
        { prop: 'Nama', value: akun.nama },
        { prop: 'Panggilan', value: akun.panggilan },
        { prop: 'Kelas', value: `${akun.kelas}-${akun.nomorKelas}` },
        { prop: 'Nomor Absen', value: akun.nomorAbsen },
        { prop: 'Agama', value: akun.agama },
        { prop: 'Jenis Kelamin', value: akun.jenisKelamin },
    ])
    const [editorMode, setEditorMode] = useState(false)
    useEffect(() => {
        setBioData([
            { prop: 'Nama', value: akun.nama },
            { prop: 'Panggilan', value: akun.panggilan },
            { prop: 'Kelas', value: `${akun.kelas}-${akun.nomorKelas}` },
            { prop: 'Nomor Absen', value: akun.nomorAbsen },
            { prop: 'Agama', value: akun.agama },
            { prop: 'Jenis Kelamin', value: akun.jenisKelamin },
        ])
    },[akun])
    return <div className="flex flex-col shadow-md bg-primary-300/10 rounded-3xl overflow-hidden">
        <div className="flex flex-col sm:flex-row shadow-md rounded-2xl p-2 items-center gap-2 bg-primary py-6 shadow-primary/50 m-2 ">
            <img src={akun.avatar} alt={akun.nama} className="h-24 w-24 shadow rounded-full mx-6" referrerPolicy="no-referrer"/>
            <div className="flex flex-col p-2 justify-center font-medium text-neutral-700 items-center sm:items-start">
                <p className='break-all text-neutral-200'>{akun.nama_panggilan||akun.nama}<span>#{akun.NIS||akun._id}</span></p>
                <div>{akun?.peran?.map(x => (
                    <span key={x} className="px-2 rounded-full bg-tertiary text-neutral-500 text-sm">{x}</span>
                ))}</div>
            </div>
        </div>
        <div className="px-4 my-4 relative">
            <div className='absolute -top-12 right-4 p-2 px-4 rounded-full shadow click-animation cursor-pointer bg-neutral-200' onClick={() => setEditorMode(prev => !prev)}>
                {editorMode ? <FontAwesomeIcon icon={faXmark}/> : <FontAwesomeIcon icon={faPencil}/>}
            </div>
            {editorMode ? 
                <ProfileEditor closeEditor={() => setEditorMode(false)}/>
                :
                <div className='flex flex-col gap-2'>
                    {bioData.map(({ prop, value }) => (
                        <ProfileBioCell key={prop} prop={prop} value={value} />
                    ))}
                    <AbsenceQrCode/>
                </div>
            }
        </div>
    </div>
}

function ProfileEditor({closeEditor}) {
    const account = useSelector(state => state.source.account)
    const [nama, setNama] = useState(account?.nama || '')
    const [panggilan, setPanggilan] = useState(account?.panggilan || '')
    const [kelas, setKelas] = useState(account?.kelas || 'X.E')
    const [nomorKelas, setNomorKelas] = useState(account?.nomorKelas || '')
    const [nomorAbsen, setNomorAbsen] = useState(account?.nomorAbsen || '')
    const [jenisKelamin, setJenisKelamin] = useState(account?.jenisKelamin)
    function handleChangeName(e) {
        setNama(e.target.value.replace(/[^A-Za-z ]/ig, ''))
    }

    const dispatch = useDispatch()
    async function handleSubmit(e) {
        e.preventDefault()
        const dataToSend = {
            nama: nama.trim(),
            panggilan: panggilan.trim(),
            kelas,
            nomorKelas,
            nomorAbsen,
            jenisKelamin,
        }

        const promise = loadingToast('Memperbarui akun')
        try {
            await axios.put(API + '/akun/' + account._id, dataToSend)
            .then(res => {
                setLocalStorage('account', res.data.user)
                dispatch(refreshAccount())
                console.log(decryptObject(res.data.user))
                closeEditor()
                promise.onSuccess(res.msg)
            })
            .catch(err => {
                promise.onError(err?.response?.data.msg)
            })
        } catch (error) {
            promise.onError('Gagal memperbarui akun')
        }
    }
    return <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
        <input className='p-2 rounded shadow w-full' type="text" value={nama} onChange={handleChangeName} placeholder='Nama' autoComplete='off' required/>
        <input className='p-2 rounded shadow w-full' type="text" value={panggilan} onChange={e => setPanggilan(e.target.value)} placeholder='Panggilan' autoComplete='off'/>
        <div className='flex gap-2 items-center'>
            <select value={kelas} onChange={(e) => setKelas(e.target.value)} className='min-h-[40px] shadow p-2 rounded flex-1' required>
                <option value="X.E" defaultValue>X.E</option>
                <option value="XI.F">XI.F</option>
                <option value="XII.F">XII.F</option>
            </select>
            <span>-</span>
            <input className='p-2 rounded shadow w-full flex-1' type="number" value={nomorKelas} onChange={e => setNomorKelas(e.target.value)} placeholder='Kelas' autoComplete='off' required max={10}/>
        </div>
        <input className='p-2 rounded shadow w-full' type="text" value={nomorAbsen} onChange={e => setNomorAbsen(e.target.value)} placeholder='Nomor Absen' autoComplete='off' max={40}/>
        <select value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} className='min-h-[40px] shadow p-2 rounded flex-1'>
            <option value="-" defaultValue>-</option>
            <option value="L">L</option>
            <option value="P">P</option>
        </select>
        <button className='flex gap-2 text-center bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer' type='submit'>
            Simpan
        </button>
    </form>
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
        const promise = loadingToast('Menautkan dengan Google')
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
            promise.onError(error?.msg || 'Server error')
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
