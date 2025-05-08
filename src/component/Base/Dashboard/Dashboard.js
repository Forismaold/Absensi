import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCheckDouble, faMinus, faRotate, faXmark } from '@fortawesome/free-solid-svg-icons'
import axios from '../../utils/axios'
import { useCallback, useEffect, useState } from "react"
import { formatDate, isUserWithinBounds } from "../../../utils"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"


export default function Dahsboard() {
    const account = useSelector(state => state.source.account)
    const [riwayats, setRiwayats] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchRiwayats = useCallback(async () => {
        setIsLoading(true)
        try {
            await axios.get('/riwayats/' + account?._id)
            .then(res => {
                setRiwayats(res.data.riwayats)
            })
            .catch(err => {
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    },[account])
    useEffect(() => {
        if (account && !riwayats) fetchRiwayats()
    }, [account, fetchRiwayats, riwayats])
    if (!account) return <div>
        <p>Untuk melihat riwayat, kamu perlu memiliki akun. Silakan kunjungi <Link to={'/akun'} className="underline">Akun</Link>.</p>
    </div>

    return <div className='flex flex-col'>
        <p>Ini halaman dashboard</p>
        <button className='flex gap-2 items-center self-end justify-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 click-animation' onClick={() => fetchRiwayats()}><FontAwesomeIcon className={`${isLoading && 'animate-spin'}`} icon={faRotate}/> <span>Segarkan</span></button>
        <div className="flex flex-col gap-2 pt-2">
            {riwayats?.length === 0 && <span className='text-center'>Tidak ada riwayat</span>}
            {riwayats?.map(x => <RiwayatRow data={x} key={x._id}/>)}
        </div>
    </div>
}

function RiwayatRow({data}) {
    const [withinBounds, setWithinBounds] = useState(false)
    useEffect(() => {
        setWithinBounds(isUserWithinBounds(data?.koordinat))
    }, [data.koordinat])
    if (data.absen === true) return <div className="flex bg-primary text-neutral-200 items-center p-2 gap-2 rounded">
        <FontAwesomeIcon icon={withinBounds?faCheckDouble:faCheck}/>
        <p>{data.title}</p>
        <p className='ml-auto'>{formatDate(data.date)}</p>
    </div>

    if (data.absen === false) return <div className="flex bg-neutral-300 text-neutral-600 items-center p-2 gap-2 rounded">
        <FontAwesomeIcon icon={faXmark}/>
        <p>{data.title}</p>
        <p className='ml-auto'>{formatDate(data.date)}</p>
    </div>

    return <div className="flex bg-neutral-300 text-neutral-600 items-center p-2 gap-2 rounded">
        <FontAwesomeIcon icon={faMinus}/>
        <p>{data.title}</p>
        <p className='ml-auto'>{formatDate(data.date)}</p>
    </div>
}