import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLink, faRefresh, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import UserAbsenceStatus from './UserAbsenceStatus'
import MyMap from './MyMap'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { API, formatDate } from '../../../utils'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Auth from '../Akun/Auth'

export default function Absen() {
    return <div className={'flex flex-col gap-2'}>
        {/* <MyMap/> */}
        {/* <UserAbsenceStatus/> */}
        {/* <Note/> */}
        {/* <ListAbsence/> */}
        <Routes>
            <Route path='/' Component={ListAbsen}/>
            <Route path='/absen' Component={ListAbsen}/>
            <Route path='/absen/:absenceId' Component={DetailAbsen}/>
        </Routes>
    </div>
}

function ListAbsen() {
    const [list, setList] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const fetchData = useCallback(async () => {
        setIsLoading(true)
        try {
            await axios.get(API + '/absensi/short')
            .then(res => {
                setList(res.data.data)
                console.log(res)
            }).catch(err => {
                console.log(err);
            })
        } catch (error) {
            
        } finally {
            setIsLoading(false)
        }
    },[])

    useEffect(() => {
        if (!list) fetchData()
    },[fetchData, list])

    return <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-end' onClick={fetchData}>
            <div className='flex gap-2 items-center bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer'>
                <FontAwesomeIcon icon={faRefresh} className={`${isLoading && 'animate-spin'}`}/> Segarkan
            </div>
        </div>
        {list?.length === 0 && <span className='text-center'>Tidak ada absensi</span>}
        {list?.map(item => <AbsenCard data={item} key={item._id}/>)}
    </div>
}

function AbsenCard ({data}) {
    const navigate = useNavigate()
    return <div className='relative flex py-2 gap-2 flex-col shadow-lg p-2 rounded my-2 bg-neutral-200'>
        <div className='flex flex-col'>
            <p className='font-medium text-lg'>{data?.title}</p>
            <p>{data?.note} - {data.openedBy}</p>
        </div>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
            <p className=''>{data.status ? 'Dibuka' : 'Ditutup'} sejak {formatDate(data?.date)}</p>
            <div onClick={() => navigate('/absen/' + data?._id)} className={`flex justify-center gap-2 shadow-lg shadow-secondary/50 cursor-pointer items-center p-2 px-4 rounded ${data.status ? 'bg-secondary text-neutral-200' : 'text-secondary border-2 border-secondary'} click-animation`}>
                <FontAwesomeIcon icon={faExternalLink}/>
                <p>Lihat</p>
            </div>
        </div>
    </div>
}

function DetailAbsen() {
    const account = useSelector(state => state.source.account)
    return <div className='flex flex-col gap-2'>
        <CheckAccountExist/>
        <div className={`${!account && 'opacity-50'} flex flex-col gap-2`}>
            <MyMap/>
            <UserAbsenceStatus/>
        </div>
    </div>
}

function CheckAccountExist() {
    const account = useSelector(state => state.source.account)

    if (!account) return <div className='bg-quaternary p-2 py-6 rounded-md shadow-xl text-center'>
        <FontAwesomeIcon icon={faUserSlash} className='text-5xl text-primary p-2'/>
        <div>
            <h2 className='font-bold text-3xl text-neutral-700'>Masuk ke akun</h2>
            <p className='text-neutral-600'>Harap masuk atau daftar sebelum melakukan absensi</p>
        </div>
        <Auth/>
    </div>
    return null
}