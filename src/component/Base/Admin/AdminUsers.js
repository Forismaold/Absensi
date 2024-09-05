import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faServer, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

export default function AdminUsers() {
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
    <div className='flex flex-col gap-2'>
        <p>Sekarang admin dapat ditambah disini dan bisa edit user</p>
        <p>Masih dalam pengembangan [!]</p>
    </div>
</div>
}