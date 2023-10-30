import { useSelector } from "react-redux"

export default function AdminDashboard() {
    return <div>
        <p>ini halaman admin</p>
        <UsersList/>
    </div>
}

function UsersList() {
    const users = useSelector(state => state.users.users)
    return <div className="flex gap-2">
        <UsersGroup title={'Belum absen'} data={users.filter(x => !x.absen)}/>
        <UsersGroup title={'Sudah absen'} data={users.filter(x => x.absen)}/>
    </div>
}

function UsersGroup({title, data}) {
    return <div className='flex flex-col flex-1 shadow-md p-2 rounded overflow-hidden'>
        <p className="text-neutral-600 font-medium py-2">{title}</p>
        <div>
            {data.map(x => <UserGroupModel key={x.NIS} data={x}/>)}
        </div>
    </div>
}

function UserGroupModel({data}) {
    return <div className="odd:bg-neutral-200 p-2 rounded w-full">
        <p className="truncate text-neutral-600">{data.nama}</p>
        <p>{data.NIS}</p>
    </div>
}