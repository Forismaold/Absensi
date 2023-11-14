import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { API, formatDate, getPermission } from "../../../utils"
import { setAdminRiwayats } from '../../../redux/source'
import Modal from '../../utils/Modal'
import UsersGroup from './UsersGroup'

export default function AdminRiwayats() {
    const adminRiwayats = useSelector(state => state.source.adminRiwayats)
    const [permission, setPermission] = useState(false)

    useEffect(() => {
        setPermission(getPermission())
    }, [])

    const dispatch = useDispatch()

    const fetchRiwayats = useCallback(async () => {
        try {
            axios.get(API+'/riwayats/all')
            .then(res => {
                dispatch(setAdminRiwayats(res.data.riwayats))
            })
            .catch(err => {
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    },[dispatch])
    
    useEffect(() => {
        if (!adminRiwayats?.length) fetchRiwayats()
    }, [adminRiwayats, fetchRiwayats])

    if (!permission) return <div>
        <p>Anda bukan pengelola!</p>
    </div>

    return <div className='flex flex-col'>
        <button className='flex items-center self-end justify-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95' onClick={() => fetchRiwayats()}><FontAwesomeIcon icon={faRotate}/></button>
        <div className="flex flex-col gap-2 pt-2">
            {adminRiwayats?.map(x => <RiwayatRow data={x} key={x._id}/>)}
        </div>
    </div>
}

function RiwayatRow({data}) {
    const [openDetail, setOpenDetail] = useState(false)
    function handleClick() {
        setOpenDetail(true)
    }
    return <>
        <div className="flex bg-neutral-300 text-neutral-600 items-center p-2 gap-2 rounded cursor-pointer" onClick={handleClick}>
            <p>{data.title}</p>
            <p className='ml-auto'>{formatDate(data.date)}</p>
        </div>
        <Modal isOpen={openDetail} onClose={() => setOpenDetail(false)}>
            <div className='flex gap-2'>
                <UsersGroup title={'Tidak absen'} data={data.users?.filter(x => x.absen === false) || []}/>
                <UsersGroup title={'Sudah absen'} data={data.users?.filter(x => x.absen === true) || []}/>
            </div>
        </Modal>
    </>
}

