import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faClose, faRotate } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { API } from "../../../utils"
import axios from "axios"
import { setUsers } from "../../../redux/users"
import LoadingSkeleton from "../../utils/LoadingSkeleton"
import { loadingToast } from '../../utils/myToast'

export default function AdminDashboard() {

    return <div>
        <p>ini halaman admin</p>
        <UsersList/>
    </div>
}

function UsersList() {
    const users = useSelector(state => state.users.users)
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
    async function bukaAbsensi() {
        const promise = loadingToast()
        try {
            await axios.get(API + '/absen/bukaAbsensi')
            .then(res => {
                promise.onSuccess(res.data.message)
            })
        } catch (error) {
            console.log(error);
            promise.onError('Internal server error')
        }
    }
    async function tutupAbsensi() {
        const promise = loadingToast()
        try {
            await axios.get(API + '/absen/tutupAbsensi')
            .then(res => {
                promise.onSuccess(`${res.data.messge}, Tidak absen: ${res.data.tidak}, Belum absen: ${res.data.belum}, Sudah absen: ${res.data.sudah}`)
            })
        } catch (error) {
            promise.onError('Internal server error')
        }
    }
    useEffect(() => {
        fetchData()
    },[fetchData])
    return <div className="flex flex-col gap-2">
        <div className="flex justify-end py-2 gap-2 flex-wrap">
            <div onClick={bukaAbsensi} className='flex gap-2 cursor-pointer bg-indigo-500 items-center p-2 rounded text-neutral-200'>
                <FontAwesomeIcon icon={faBoxOpen}/>
                <p>Buka</p>
            </div>
            <div onClick={tutupAbsensi} className='flex gap-2 cursor-pointer bg-indigo-500 items-center p-2 rounded text-neutral-200'>
                <FontAwesomeIcon icon={faClose}/>
                <p>Tutup</p>
            </div>
            <div onClick={fetchData} className='flex gap-2 cursor-pointer bg-indigo-500 items-center p-2 rounded text-neutral-200'>
                <FontAwesomeIcon icon={faRotate}/>
                <p>Segarkan</p>
            </div>
        </div>
        {isLoading && <div className="flex gap-2"><LoadingSkeleton/><LoadingSkeleton/></div>}
        {users && <div className="flex flex-col gap-2">
            <div className='flex gap-2 flex-col items-center sm:flex-row'>
                <div>Tidak absen: {users?.filter(x => x.absen === false).length}</div>
                <div>Belum absen: {users?.filter(x => x.absen === null).length}</div>
                <div>sudah absen: {users?.filter(x => x.absen === true).length}</div>
            </div>
            <div className='flex gap-2'>
                <UsersGroup title={'Tidak absen'} data={users?.filter(x => x.absen === false) || []}/>
                <UsersGroup title={'Sudah absen'} data={users?.filter(x => x.absen === true) || []}/>
            </div>
        </div>}
    </div>
}

function UsersGroup({title, data}) {
    return <div className='flex flex-col flex-1 shadow-md p-2 rounded overflow-hidden'>
        <p className="text-neutral-600 font-medium py-2">{title}</p>
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