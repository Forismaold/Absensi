import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { API } from "../../../utils"
import axios from "axios"
import { setUsers } from "../../../redux/users"
import ButtonSendText from "../../utils/ButtonSendText"

export default function AdminDashboard() {

    return <div>
        <p>ini halaman admin</p>
        <ButtonSendText/>
        <UsersList/>
    </div>
}

function UsersList() {
    const users = useSelector(state => state.users.users)
    const dispatch = useDispatch()
    const fetchData = useCallback(async () => {
        axios.get(API + '/users/all')
        .then(res => {
            dispatch(setUsers(res.data))
        })
    },[dispatch])
    useEffect(() => {
        fetchData()
    },[fetchData])
    return <div className="flex gap-2">
        <UsersGroup title={'Belum absen'} data={users?.filter(x => !x.absen)}/>
        <UsersGroup title={'Sudah absen'} data={users?.filter(x => x.absen)}/>
    </div>
}

function UsersGroup({title, data}) {
    useEffect(() => console.log(data))
    return <div className='flex flex-col flex-1 shadow-md p-2 rounded overflow-hidden'>
        <p className="text-neutral-600 font-medium py-2">{title}</p>
        <div>
            {data.map(x => <UserGroupModel key={x._id} data={x}/>)}
        </div>
    </div>
}

function UserGroupModel({data}) {
    return <div className="odd:bg-neutral-200 p-2 rounded w-full">
        <p className="truncate text-neutral-600">{data.nama}<span>{data?.NIS && `#${data.NIS}`}</span> </p>
    </div>
}