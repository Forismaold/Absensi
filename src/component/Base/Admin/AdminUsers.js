import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faServer, faUserGroup, faCrown, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import axios from '../../utils/axios'
import Cell from '../../utils/Cell'
import Modal from '../../utils/Modal'
import { loadingToast } from '../../utils/myToast'

export default function AdminUsers() {
    const [users, setUsers] = useState(null)
    const fetchData = useCallback(async () => {
        try {
            await axios.get('/users/adminGetAll')
            .then(res => {
                setUsers(res.data)
                console.log(res.data)
            }).catch(err => {
            })
        } catch (error) {
        } finally {
        }
    },[])
    useEffect(() => {
        if (!users) fetchData()
    }, [fetchData, users])
    
    return <div className='flex flex-col gap-2'>
    <div className='flex items-center rounded shadow overflow-auto'>
        <Link to={'/admin/server'} className='flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 text-neutral-500 bg-neutral-200'>
            <FontAwesomeIcon icon={faServer}/> Server
        </Link>
        <Link to={'/admin/riwayat'} className='flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 border-transparent text-neutral-500 bg-neutral-200'>
            <FontAwesomeIcon icon={faClockRotateLeft}/> Riwayat
        </Link>
        <Link to={'/admin/users'} className='flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 border-transparent  border-secondary text-secondary bg-quaternary'>
            <FontAwesomeIcon icon={faUserGroup}/> User
        </Link>
    </div>
    {/* <DashboardActionButton/> */}
    {/* <UsersList/> */}
    <DisplayUsers users={users || []} setUsers={setUsers}/>
</div>
}

function DisplayUsers({users = null, setUsers}) {
    const [userWhoWantUpdate, setUserWhoWantUpdate] = useState(null)
    useEffect(() => {
        console.log(users)
    }, [users])
    
    return <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2 p-2'>
            <h3 className='text-xl font-semibold pt-4'>Admin</h3>
            <p>Setelah seseorang dinaikkan atau diturunkan jabatannya seagai admin, pengguna perlu masuk ulang untuk memperbarui informasi akunnya</p>
            {users.filter(user => user.peran.find(x => x === "admin")).map((user, i) => <UserRowModel user={user} key={i} users={users} setUsers={setUsers} setUserWhoWantUpdate={setUserWhoWantUpdate}/>).sort((a,b) => a.nama-b.nama)}
        </div>
        <div className='flex flex-col gap-2 p-2'>
            <h3 className='text-xl font-semibold pt-4'>Peserta</h3>
            {users.map((user, i) => <UserRowModel user={user} key={i} users={users} setUsers={setUsers} setUserWhoWantUpdate={setUserWhoWantUpdate}/>)}
        </div>
        {userWhoWantUpdate && <AdminUpdateUser userWhoWantUpdate={userWhoWantUpdate} setUserWhoWantUpdate={setUserWhoWantUpdate} setUsers={setUsers}/>}
    </div>
}

function UserRowModel({user, setUsers, setUserWhoWantUpdate}) {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isFetchLoading, setIsFetchLoading] = useState(false)

    useEffect(() => {
        if (user.peran.includes('admin')) {
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
        }
    },[user.peran])

    async function admin() {
        setIsFetchLoading(true)
        const toast = loadingToast()
        axios.put(`/akun/${isAdmin?'deop':'op'}/${user._id}`)
        .then(res => {
            toast.onSuccess(`Berhasil merubah pangkat`)
            setIsOpenModal(false)
            setUsers(res.data.users)
            console.log(res.data)
        }).catch(err => {
            console.log(err)
            toast.onError(`Gagal merubah pangkat`)
        }).finally(() => {
            setIsFetchLoading(false)
        })
    }

    return <div className='flex flex-col even:bg-neutral-200'>
        <div className={`p-2 rounded w-full cursor-pointer`} onClick={() => setIsOpenModal(true)}>
            <div className="flex gap-2 truncate text-neutral-600">
                <div className='w-1//6'>
                    <FontAwesomeIcon icon={isAdmin ? faCrown : faUser}/>
                </div>
                <span className='w-1/6 text-center overflow-auto'>{user.kelas}-{user.nomorKelas}/{user.nomorAbsen}</span>
                <div className='w-4/6 overflow-auto'>{user.nama} <span>{user?.NIS && `#${user.NIS}`}</span></div>
            </div>
        </div>

        <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} zIndex={'z-[2]'}>
            <Cell prop={'ID'} value={user?._id || ''}/>
            <Cell prop={'Nama'} value={user?.nama || ''}/>
            <Cell prop={'Panggilan'} value={user?.panggilan || ''}/>
            <Cell prop={'kelas/absen'} value={`${user?.kelas || ''}-${user?.nomorKelas || ''}/${user?.nomorAbsen || ''}`}/>
            <Cell prop={'email'} value={user?.email || ''}/>
            <div className="w-full click-animation cursor-pointer bg-secondary rounded shadow text-neutral-200 p-2 " onClick={() => {
                setUserWhoWantUpdate(user)
                setIsOpenModal(false)
            }}>
                <p>Edit Data Pengguna</p>
            </div>
            <div className='w-full click-animation cursor-pointer' onClick={admin}>
                
                <Cell prop={isAdmin?'Berhentikan sebagai admin':'Tambahkan sebagai admin'} value={isFetchLoading?'Loading...':''}/>
            </div>
        </Modal>
    </div>
}

function AdminUpdateUser({userWhoWantUpdate, setUserWhoWantUpdate, setUsers}) {
    const [nama, setNama] = useState(userWhoWantUpdate?.nama || '')
    const [panggilan, setPanggilan] = useState(userWhoWantUpdate?.panggilan || '')
    const [kelas, setKelas] = useState(userWhoWantUpdate?.kelas || 'X.E')
    const [nomorKelas, setNomorKelas] = useState(userWhoWantUpdate?.nomorKelas || '')
    const [nomorAbsen, setNomorAbsen] = useState(userWhoWantUpdate?.nomorAbsen || '')
    const [email, setEmail] = useState('')
    const [isChanged, setIsChanged] = useState(false);

    function handleChangeName(e) {
        setNama(e.target.value.replace(/[^A-Za-z ]/ig, ''))
    }

    useEffect(() => {
        const hasChanged = (
            nama.trim() !== userWhoWantUpdate?.nama ||
            panggilan.trim() !== userWhoWantUpdate?.panggilan ||
            kelas !== userWhoWantUpdate?.kelas ||
            nomorKelas !== userWhoWantUpdate?.nomorKelas ||
            nomorAbsen !== userWhoWantUpdate?.nomorAbsen
        );
        console.log('haschange?', hasChanged)
    
        setIsChanged(hasChanged);
    }, [nama, panggilan, kelas, nomorKelas, nomorAbsen, userWhoWantUpdate]);
    

    async function handleSubmit(e) {
        e.preventDefault()
        const dataToSend = {
            nama: nama.trim(),
            panggilan: panggilan.trim(),
            kelas,
            nomorKelas,
            nomorAbsen,
        }

        if (email) {
            dataToSend.email = email.trim()
        }

        const toast = loadingToast('Memperbarui akun')
        try {
            await axios.put('/akun/' + userWhoWantUpdate._id, dataToSend, {params: {alsoreturnallusers: true}})
            .then(res => {
                toast.onSuccess(`Berhasil memperbarui akun`)
                setUsers(res.data.users)
                setUserWhoWantUpdate(null)
            }).catch(err => {
                toast.onError(`Gagal memperbarui akun`)
                console.log(err)
            }).finally(() => {
            })
        } catch (error) {
            toast.onError('Gagal memperbarui akun')
        }
    }

    return <Modal isOpen={userWhoWantUpdate} onClose={() => setUserWhoWantUpdate(null)} zIndex={'z-[2]'}>
        <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row sm:items-center border-b-[1px] border-solid border-neutral-300 last:border-transparent py-2">
                <label htmlFor="nama" className="sm:w-2/6 font-medium">Nama</label>
                <input id="nama" className="p-2 rounded shadow w-full sm:flex-1" type="text" value={nama} onChange={handleChangeName} placeholder="Nama" autoComplete="off" required />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center border-b-[1px] border-solid border-neutral-300 last:border-transparent py-2">
                <label htmlFor="panggilan" className="sm:w-2/6 font-medium">Panggilan</label>
                <input id="panggilan" className="p-2 rounded shadow w-full sm:flex-1" type="text" value={panggilan} onChange={e => setPanggilan(e.target.value)} placeholder="Panggilan" autoComplete="off" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center border-b-[1px] border-solid border-neutral-300 last:border-transparent py-2">
                <label htmlFor="kelas" className="sm:w-2/6 font-medium">Kelas & Nomor Kelas</label>
                <div className="flex flex-1 items-center">
                    <select id="kelas" value={kelas} onChange={(e) => setKelas(e.target.value)} className="min-h-[40px] shadow p-2 rounded flex-1" required>
                        <option value="X.E">X.E</option>
                        <option value="XI.F">XI.F</option>
                        <option value="XII.F">XII.F</option>
                    </select>
                    <span className="px-1">-</span>
                    <input id="nomorKelas" className="p-2 rounded shadow flex-1 w-full" type="number" value={nomorKelas} onChange={e => setNomorKelas(e.target.value)} placeholder="Nomor Kelas" autoComplete="off" required max={10} />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center border-b-[1px] border-solid border-neutral-300 last:border-transparent py-2">
                <label htmlFor="nomorAbsen" className="sm:w-2/6 font-medium">Nomor Absen</label>
                <input id="nomorAbsen" className="p-2 rounded shadow w-full sm:flex-1" type="text" value={nomorAbsen} onChange={e => setNomorAbsen(e.target.value)} placeholder="Nomor Absen" autoComplete="off" max={40} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center border-b-[1px] border-solid border-neutral-300 last:border-transparent py-2">
                <label htmlFor="email" className="sm:w-2/6 font-medium flex flex-col">
                    <span>Email</span>
                    <span className="text-sm opacity-75">{userWhoWantUpdate?.email || 'Tidak ada email'}</span>
                </label>
                <input id="email" className="p-2 rounded shadow w-full sm:flex-1" type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder='email' autoComplete="off" />
            </div>

            <button 
                className={`flex gap-2 text-center p-2 shadow-lg shadow-primary/50 click-animation rounded-lg cursor-pointer ${
                    isChanged ? 'bg-secondary text-neutral-100' : 'bg-transparent text-neutral-400 cursor-not-allowed'
                }`}
                type='submit'
                disabled={!isChanged}
            >
                Perbarui
            </button>

            </form>
    </Modal>
}

// function AdminProfileEditor({user, closeEditor}) {
    // const account = useSelector(state => state.source.account)
    // const [nama, setNama] = useState(account?.nama || '')
    // const [panggilan, setPanggilan] = useState(account?.panggilan || '')
    // const [kelas, setKelas] = useState(account?.kelas || 'X.E')
    // const [nomorKelas, setNomorKelas] = useState(account?.nomorKelas || '')
    // const [nomorAbsen, setNomorAbsen] = useState(account?.nomorAbsen || '')
    // const [jenisKelamin, setJenisKelamin] = useState(account?.jenisKelamin)
//     function handleChangeName(e) {
//         setNama(e.target.value.replace(/[^A-Za-z ]/ig, ''))
//     }

//     const dispatch = useDispatch()
//     async function handleSubmit(e) {
//         e.preventDefault()
//         const dataToSend = {
//             nama: nama.trim(),
//             panggilan: panggilan.trim(),
//             kelas,
//             nomorKelas,
//             nomorAbsen,
//             jenisKelamin,
//         }

//         const promise = loadingToast('Memperbarui akun')
//         try {
//             await axios.get( '/akun/' + account._id, dataToSend)
//             .then(res => {
//                 setLocalStorage('account', res.data.user)
//                 dispatch(refreshAccount())
//                 console.log(decryptObject(res.data.user))
//                 closeEditor()
//                 promise.onSuccess(res.msg)
//             })
//             .catch(err => {
//                 promise.onError(err?.response?.data.msg)
//             })
//         } catch (error) {
//             promise.onError('Gagal memperbarui akun')
//         }
//     }
//     return <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
//         <input className='p-2 rounded shadow w-full' type="text" value={nama} onChange={handleChangeName} placeholder='Nama' autoComplete='off' required/>
//         <input className='p-2 rounded shadow w-full' type="text" value={panggilan} onChange={e => setPanggilan(e.target.value)} placeholder='Panggilan' autoComplete='off'/>
//         <div className='flex gap-2 items-center'>
//             <select value={kelas} onChange={(e) => setKelas(e.target.value)} className='min-h-[40px] shadow p-2 rounded flex-1' required>
//                 <option value="X.E" defaultValue>X.E</option>
//                 <option value="XI.F">XI.F</option>
//                 <option value="XII.F">XII.F</option>
//             </select>
//             <span>-</span>
//             <input className='p-2 rounded shadow w-full flex-1' type="number" value={nomorKelas} onChange={e => setNomorKelas(e.target.value)} placeholder='Kelas' autoComplete='off' required max={10}/>
//         </div>
//         <input className='p-2 rounded shadow w-full' type="text" value={nomorAbsen} onChange={e => setNomorAbsen(e.target.value)} placeholder='Nomor Absen' autoComplete='off' max={40}/>
//         <select value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} className='min-h-[40px] shadow p-2 rounded flex-1'>
//             <option value="-" defaultValue>-</option>
//             <option value="L">L</option>
//             <option value="P">P</option>
//         </select>
//         <button className='flex gap-2 text-center bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer' type='submit'>
//             Simpan
//         </button>
//     </form>
// }