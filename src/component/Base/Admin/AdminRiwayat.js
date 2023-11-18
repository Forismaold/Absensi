import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faRotate, faSearch } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { API, formatBeautyDate, formatDate, getPermission } from "../../../utils"
import { setAdminRiwayats } from '../../../redux/source'
import UsersGroup from './UsersGroup'
import Modal from '../../utils/Modal'

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
    const [showSearch, setShowSearch] = useState(false)
    return <div className='flex flex-col text-neutral-600 p-2 gap-2 rounded shadow'>
        <div className="flex bg-neutral-300 text-neutral-600 items-center p-2 gap-2 rounded">
            <p>{data.title}</p>
            <p className='ml-auto'>{formatDate(data.date)}</p>
            <FontAwesomeIcon icon={faFilter} className='shadow p-2 rounded bg-primary text-quaternary cursor-pointer duration-200 ease-in-out active:scale-95' onClick={() => setShowSearch(true)}/>
        </div>
        <div className='flex gap-2'>
            <UsersGroup title={'Tidak absen'} data={data.users?.filter(x => x.absen === false) || []}/>
            <UsersGroup title={'Sudah absen'} data={data.users?.filter(x => x.absen === true) || []}/>
        </div>
        <SearchUser isOpen={showSearch} onClose={() => setShowSearch(false)} users={data.users} title={data.title} date={formatBeautyDate(data.date)}/>
    </div>
}

function SearchUser({isOpen, onClose, users = [], title, date}) {
    const [searchKey, setSearchKey] = useState('')
    const [kelas, setKelas] = useState('')
    const [nomorKelas, setNomorKelas] = useState(0)
    const [result, setResult] = useState([])
    const handleSearch = () => {
        const usernameRegex = new RegExp(`^${searchKey}`, 'i')
      
        const result = users.filter((user) => (searchKey === '' || usernameRegex.test(user.nama)) && (kelas === '' || user.kelas === kelas) &&  (nomorKelas === 0 || user.nomorKelas === nomorKelas || kelas === ''))
        console.log(result, searchKey, kelas, nomorKelas);
      
        setResult(result)
    }

    return <Modal isOpen={isOpen} onClose={onClose}>
        <div className='flex flex-col gap-2'>
            <div className='flex justify-between gap-2'>
                <p>{title}</p>
                <p>{date}</p>
            </div>
            <div className='flex gap-2 items-center flex-wrap'>
                <input type="text" value={searchKey} onChange={e => setSearchKey(e.target.value)} className='flex-[2] rounded-xl max-w-full' placeholder='Cari nama'/>
                <select value={kelas} onChange={(e) => setKelas(e.target.value)} className='min-h-[40px] shadow p-2 rounded-xl w-auto flex-1'>
                    <option value="" defaultValue>Semua Kelas</option>
                    <option value="X.E" defaultValue>X.E</option>
                    <option value="XI.F">XI.F</option>
                    <option value="XII MIPA">XII MIPA</option>
                    <option value="XII IPS">XII IPS</option>
                </select>
                {kelas !== '' && <>
                    <span>-</span>
                    <input className='p-2 rounded-x; shadow' type="number" value={nomorKelas} onChange={(e) => setNomorKelas(e.target.value)} placeholder='nomor kelas' autoComplete='off' min='0' max='9'/>
                </>}
                <FontAwesomeIcon onClick={handleSearch} icon={faSearch} className='rounded text-neutral-100 bg-secondary p-3 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95 cursor-pointer'/>
            </div>
            <div className='flex flex-wrap gap-2'>
                {result.map(user => <span key={user._id} className={`p-2 rounded-xl ${user.absen ? 'bg-secondary text-neutral-200' : 'bg-neutral-300 text-neutral-700'}`}>{user.nama}</span>)}
            </div>
        </div>
    </Modal>
}
