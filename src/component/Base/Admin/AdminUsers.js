import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faServer, faUserGroup, faCrown, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { API } from '../../../utils'
import axios from 'axios'
import Cell from '../../utils/Cell'
import Modal from '../../utils/Modal'

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
            {users.filter(user => user.peran.find(x => x === "admin")).map((user, i) => <UserRowModel user={user} key={i}/>)}
        </div>
        <div className='flex flex-col gap-2 p-2'>
            <h3 className='text-xl font-semibold pt-4'>Peserta</h3>
            {users.map((user, i) => <UserRowModel user={user} key={i}/>)}
        </div>
    </div>
}

function UserRowModel({user}) {
    const [isOpenModal, setIsOpenModal] = useState(false)

    return <div className='flex flex-col even:bg-neutral-200'>
        <div className={`p-2 rounded w-full cursor-pointer`} onClick={() => setIsOpenModal(true)}>
            <div className="flex gap-2 truncate text-neutral-600">
                <span className='w-1/6 text-center'>{user.kelas}-{user.nomorKelas}/{user.nomorAbsen}</span>
                <div className='w-4/6'>{user.nama} <span>{user?.NIS && `#${user.NIS}`}</span></div>
                <div className='w-1//6'>
                    <FontAwesomeIcon icon={user.peran.find(x => x === "admin") ? faCrown : faUser}/>
                </div>
            </div>
        </div>
        <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} zIndex={'z-[2]'}>
            <Cell prop={'Waktu Absen'} value={'huh'}/>
        </Modal>
    </div>
}