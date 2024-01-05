import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faRotate, faServer } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { API, getPermission } from "../../../utils"
import LoadingIcon from '../../utils/LoadingIcon'
import RiwayatRow from './RiwayatRow'
import { Link } from 'react-router-dom'

export default function AdminRiwayat() {
    const [riwayats, setRiwayats] = useState(null)
    const [permission, setPermission] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
        setPermission(getPermission())
    }, [])

    const fetchRiwayats = useCallback(async () => {
        setIsLoading(true)
        try {
            await axios.get(API+'/riwayats/all')
            .then(res => {
                setRiwayats(res.data.riwayats)
                console.log(res.data)
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
    },[])
    
    useEffect(() => {
        if (!riwayats) fetchRiwayats()
    }, [riwayats, fetchRiwayats])

    if (!permission) return <div>
        <p>Anda bukan pengelola!</p>
    </div>

    return <div className='flex flex-col gap-2'>
        <div className='flex items-center rounded shadow overflow-hidden'>
            <Link to={'/admin/server'} className='flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 border-transparent text-neutral-500 bg-neutral-200'>
                <FontAwesomeIcon icon={faServer}/> Server
            </Link>
            <Link to={'/admin/riwayat'} className='flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 border-secondary text-secondary bg-quaternary'>
                <FontAwesomeIcon icon={faClockRotateLeft}/> Riwayat
            </Link>
        </div>
        <button className='flex gap-2 items-center self-end justify-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 click-animation' onClick={() => fetchRiwayats()}>{isLoading?<LoadingIcon/>:<FontAwesomeIcon icon={faRotate} className='p-0.5'/>} Segarkan riwayat</button>
        <div className="flex flex-col gap-2">
            {riwayats?.length === 0 && <span className='text-center'>Tidak ada riwayat</span>}
            {riwayats?.map(x => <RiwayatRow data={x} key={x._id} setRiwayats={setRiwayats}/>)}
        </div>
    </div>
}

