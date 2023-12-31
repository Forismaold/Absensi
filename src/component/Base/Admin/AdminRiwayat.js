import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faRotate, faServer } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { API, getPermission } from "../../../utils"
import { setAdminRiwayats } from '../../../redux/source'
import LoadingIcon from '../../utils/LoadingIcon'
import RiwayatRow from './RiwayatRow'
import { Link } from 'react-router-dom'

export default function AdminRiwayat() {
    const adminRiwayats = useSelector(state => state.source.adminRiwayats)
    const [permission, setPermission] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
        setPermission(getPermission())
    }, [])

    const dispatch = useDispatch()

    const fetchRiwayats = useCallback(async () => {
        setIsLoading(true)
        try {
            await axios.get(API+'/riwayats/all')
            .then(res => {
                dispatch(setAdminRiwayats(res.data.riwayats))
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    },[dispatch])
    
    useEffect(() => {
        if (!adminRiwayats?.length) fetchRiwayats()
    }, [adminRiwayats, fetchRiwayats])

    if (!permission) return <div>
        <p>Anda bukan pengelola!</p>
    </div>

    return <div className='flex flex-col gap-2'>
        <div className='flex gap-2 items-center justify-end'>
            <Link to={'/admin/server'}>
                <div className='flex gap-2 items-center bg-neutral-300 p-2 shadow-lg shadow-primary/50 click-animation rounded text-neutral-500'>
                    <FontAwesomeIcon icon={faServer}/> Server
                </div>
            </Link>
            <Link to={'/admin/riwayat'}>
                <div className='flex gap-2 items-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 click-animation'>
                    <FontAwesomeIcon icon={faClockRotateLeft}/> Riwayat
                </div>
            </Link>
        </div>
        <button className='flex gap-2 items-center self-end justify-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 click-animation' onClick={() => fetchRiwayats()}>{isLoading?<LoadingIcon/>:<FontAwesomeIcon icon={faRotate} className='p-0.5'/>} Segarkan riwayat</button>
        <div className="flex flex-col gap-2">
            {adminRiwayats?.map(x => <RiwayatRow data={x} key={x._id}/>)}
        </div>
    </div>
}

