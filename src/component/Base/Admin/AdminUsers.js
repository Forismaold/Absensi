import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faServer, faUserGroup, faCrown, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { API } from '../../../utils'
import axios from 'axios'
import Cell from '../../utils/Cell'
import Modal from '../../utils/Modal'
import { loadingToast } from '../../utils/myToast'

export default function AdminUsers() {
    const [users, setUsers] = useState(null)
    const fetchData = useCallback(async () => {
        try {
            await axios.get(API + '/users/all')
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
    <div className='flex items-center rounded shadow overflow-hidden'>
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
    <DisplayUsers users={users || []}/>
</div>
}

function DisplayUsers({users}) {
    return <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2 p-2'>
            <h3 className='text-xl font-semibold pt-4'>Admin</h3>
            <p>Setelah seseorang dinaikkan atau diturunkan jabatannya seagai admin, pengguna perlu masuk ulang untuk memperbarui informasi akunnya</p>
            {users.filter(user => user.peran.find(x => x === "admin")).map((user, i) => <UserRowModel user={user} key={i}/>).sort((a,b) => a.nama-b.nama)}
        </div>
        <div className='flex flex-col gap-2 p-2'>
            <h3 className='text-xl font-semibold pt-4'>Peserta</h3>
            {users.map((user, i) => <UserRowModel user={user} key={i}/>)}
        </div>
    </div>
}

function UserRowModel({user}) {
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
        axios.put(API+`/akun/${isAdmin?'deop':'op'}/${user._id}`)
        .then(res => {
            toast.onSuccess(`Berhasil merubah pangkat`)
            console.log(res.data)
        }).catch(err => {
            toast.onSuccess(`Gagal merubah pangkat`)
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
            <div className='w-full click-animation cursor-pointer' onClick={admin}>
                <Cell prop={isAdmin?'Berhentikan sebagai admin':'Tambahkan sebagai admin'} value={isFetchLoading?'Loading...':''}/>
            </div>
        </Modal>
    </div>
}