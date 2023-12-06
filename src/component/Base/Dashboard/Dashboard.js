import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCheckDouble, faClockRotateLeft, faMinus, faRotate, faServer, faXmark } from '@fortawesome/free-solid-svg-icons'
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { API, formatDate, getPermission, isUserWithinBounds } from "../../../utils"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { setRiwayats } from "../../../redux/source"


export default function Dahsboard() {
    const account = useSelector(state => state.source.account)
    const riwayats = useSelector(state => state.source.riwayats)
    const [permission, setPermission] = useState(false)

    useEffect(() => {
        setPermission(getPermission())
    }, [])

    const dispatch = useDispatch()

    const fetchRiwayats = useCallback(async () => {
        try {
            await axios.get(API+'/riwayats/' + account?._id)
            .then(res => {
                dispatch(setRiwayats(res.data.riwayats))
            })
            .catch(err => {
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    },[account, dispatch])
    useEffect(() => {
        if (account || !riwayats?.length) fetchRiwayats()
    }, [account, fetchRiwayats, riwayats])
    if (!account) return <div>
        <p>Untuk melihat riwayat, kamu perlu memiliki akun. Silakan kunjungi <Link to={'/akun'} className="underline">Akun</Link>.</p>
    </div>

    return <div className='flex flex-col'>
        <p>Ini halaman dashboard</p>
        {permission && 
            <div className='flex gap-2 items-center justify-end'>
                <Link to={'/admin/dashboard'}><FontAwesomeIcon icon={faServer} className='rounded text-neutral-500 bg-neutral-300 p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95'/></Link>
                <Link to={'/admin/riwayat'}><FontAwesomeIcon icon={faClockRotateLeft} className='rounded text-neutral-500 bg-neutral-300 p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95'/></Link>
            </div>
        }
        <button className='flex gap-2 items-center self-end justify-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95' onClick={() => fetchRiwayats()}><FontAwesomeIcon icon={faRotate}/> <span>Segarkan</span></button>
        <div className="flex flex-col gap-2 pt-2">
            {riwayats?.map(x => <RiwayatRow data={x} key={x._id}/>)}
        </div>
    </div>
}

function RiwayatRow({data}) {
    const [withinBounds, setWithinBounds] = useState(false)
    useEffect(() => {
        setWithinBounds(isUserWithinBounds(data.koordinat))
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