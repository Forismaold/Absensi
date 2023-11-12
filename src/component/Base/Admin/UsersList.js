import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUsers } from "../../../redux/users"
import axios from "axios"
import { API } from "../../../utils"
import LoadingSkeleton from '../../utils/LoadingSkeleton'


export default function UsersList() {
    const users = useSelector(state => state.users.users)
    const absensi = useSelector(state => state.source.absensi)
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const fetchData = useCallback(async () => {
        setIsLoading(true)
        dispatch(setUsers(null))
        try {
            axios.get(API + '/users/all')
            .then(res => {
                dispatch(setUsers(res.data))
                setIsLoading(false)
            }).catch(err => {
                throw new Error(err)
            })
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    },[dispatch])
    
    useEffect(() => {
        if (absensi) fetchData()
    },[absensi, fetchData])

    if (!absensi) return null

    return <div className="flex flex-col gap-2">
        <div onClick={fetchData} className='flex gap-2 shadow-lg shadow-primary/50 cursor-pointer bg-primary items-center p-2 rounded text-neutral-200'>
            <FontAwesomeIcon icon={faRotate}/>
            <p>Segarkan</p>
        </div>
        {isLoading && <div className="flex gap-2"><LoadingSkeleton/><LoadingSkeleton/></div>}
        {users && <div className="flex flex-col gap-2">
            <div className='flex gap-2 flex-col items-center sm:flex-row'>
                <div>Belum absen: {users?.filter(x => x.absen === null).length}</div>
            </div>
            <div className='flex gap-2'>
                <UsersGroup title={'Tidak absen'} data={users?.filter(x => x.absen === false) || []}/>
                <UsersGroup title={'Sudah absen'} data={users?.filter(x => x.absen === true) || []}/>
            </div>
        </div>}
    </div>
}


function UsersGroup({title, data}) {
    return <div className='flex flex-col flex-1 shadow-md p-2 rounded-md overflow-hidden'>
        <p className="text-neutral-600 font-medium py-2 flex items-center justify-between">
            <span>{title}</span>
            <span>{data.length}</span>
        </p>
        <div className="flex flex-col items-center flex-1">
            {data.map(x => <UserGroupModel key={x._id} data={x}/>)}
            {!data.length && <p className="text-center m-auto">Kosong</p>}
        </div>
    </div>
}

function UserGroupModel({data}) {
    return <div className="odd:bg-neutral-200 p-2 rounded w-full">
        <p className="truncate text-neutral-600">{data.nama}<span>{data?.NIS && `#${data.NIS}`}</span> </p>
    </div>
}