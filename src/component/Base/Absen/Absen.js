import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLink, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { API, formatBeautyDate } from '../../../utils'
import { Route, Routes, useNavigate } from 'react-router-dom'
import DetailAbsen from './DetailAbsen/DetailAbsen'
import { useSelector } from 'react-redux'

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
    const account = useSelector(state => state.source.account)
    const [list, setList] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showAll, setShowAll] = useState(false)
    const fetchData = useCallback(async () => {
        setIsLoading(true)
        try {
            await axios.get(API + '/absensi/short')
            .then(res => {
                setList(res.data.data)
                console.log(res.data.data)
            }).catch(err => {
                console.log(err);
            })
        } catch (error) {
            
        } finally {
            setIsLoading(false)
        }
    },[])

    const handleCheckboxChange = (event) => {
        setShowAll(event.target.checked);
      };

    useEffect(() => {
        if (!list) fetchData()
    },[fetchData, list])

    return <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-end' onClick={fetchData}>
            <div className='flex gap-2 items-center bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer'>
                <FontAwesomeIcon icon={faRefresh} className={`${isLoading && 'animate-spin'}`}/> Segarkan
            </div>
        </div>
        <label className='flex gap-2 cursor-pointer items-center' htmlFor='showall'>
            <span>Tampilkan semua</span>
            <input type='checkbox' id='showall' checked={showAll} onChange={handleCheckboxChange} className='rounded'/>
        </label>
        {list?.filter(i => i.allowedGrades.includes(account?.kelas)).length === 0 && !showAll && <span className='text-center bg-neutral-200 text-neutral-500 p-2 rounded'>Belum ada absensi yang cocok untuk kamu</span>}
        {list?.filter(i => i.allowedGrades.includes(account?.kelas) || showAll)?.map(item => <AbsenCard data={item} key={item._id}/>) || []}
    </div>
}

function AbsenCard ({data}) {
    const [isOpened, setIsOpened] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        setIsOpened(data.status)
    },[data])
    
    return <div className={`relative flex p-2 py-4 pt-5 gap-2 flex-col shadow-lg rounded my-2 cursor-pointer ${isOpened ? 'bg-secondary text-neutral-200' : 'bg-neutral-200'}`} onClick={() => navigate('/absen/' + data?._id)}>
        <div className='flex flex-col'>
            <p className='text-lg font-semibold'>{data?.title} <span className='text-xs font-normal'>oleh {data.openedBy}</span></p>
            <p className='text-sm'>{data?.note}</p>
            <p className='text-sm'>{isOpened ? 'Dibuka' : 'Ditutup'} {formatBeautyDate(data?.date)}</p>
            <FontAwesomeIcon icon={faExternalLink} className='absolute top-2 right-2'/>
        </div>
    </div>
}