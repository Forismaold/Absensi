import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis, faFilter, faSearch, faTable, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { API, formatBeautyDate, formatDate, isUserWithinBoundsCSV } from "../../../utils"
import UsersGroup from './UsersGroup'
import Modal, { Confirm } from '../../utils/Modal'
import { loadingToast } from '../../utils/myToast'
import xlsx from 'json-as-xlsx'

export default function RiwayatRow({data, setRiwayats}) {
    const [showSearch, setShowSearch] = useState(false)
    const [showOption, setShowOption] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    async function deleteRiwayat() {
        const promise = loadingToast('Menghapus Riwayat')
        try {
            await axios.delete(API+'/riwayats/'+data._id)
            .then(res => {
                setShowDeleteConfirm(false)
                setShowOption(false)
                promise.onSuccess(res.data.msg)
                setRiwayats(res.data.riwayats)
            })
            .catch(res => {
                promise.onError(res.response.data.msg)
            })
        } catch (error) {
            console.log(error)
            promise.onError('Internal server error')
        }
    }

    return <div className='flex flex-col text-neutral-600 p-2 gap-2 rounded shadow'>
        <div className="flex bg-neutral-300 text-neutral-600 items-center p-2 gap-2 rounded flex-wrap justify-between flex-col sm:flex-row">
            <div className='flex gap-2 justify-between'>
                <p>{data.title}</p>
                <p className='ml-auto'>{formatDate(data.date)}</p>
            </div>
            <div className='flex gap-2 self-end'>
                <FontAwesomeIcon icon={faEllipsis} className='shadow p-2 rounded text-neutral-600 cursor-pointer click-animation self-end' onClick={() => setShowOption(true)}/>
            </div>
        </div>
        <div className='flex gap-2'>
            <UsersGroup title={'Tidak absen'} data={data.users?.filter(x => x.absen === false) || []}/>
            <UsersGroup title={'Sudah absen'} data={data.users?.filter(x => x.absen === true) || []}/>
        </div>
        <SearchUser isOpen={showSearch} onClose={() => setShowSearch(false)} users={data.users} title={data.title} date={formatBeautyDate(data.date)}/>
        <Modal isOpen={showOption} onClose={() => setShowOption(false)}>
            <div className='flex flex-col gap-2'>
                <DownloadCSVButton onClose={() => setShowOption(false)} data={data}/>
                <p className='hover:bg-neutral-300 rounded p-2 cursor-pointer' onClick={() => {
                    setShowSearch(true)
                    setShowOption(false)
                }}><FontAwesomeIcon icon={faFilter}/> Filter Riwayat</p>
                <p className='hover:bg-neutral-300 rounded p-2 cursor-pointer' onClick={() => {
                    setShowDeleteConfirm(true)
                }}><FontAwesomeIcon icon={faTrash}/> Hapus Riwayat</p>
            </div>
        </Modal>
        <Confirm isOpen={showDeleteConfirm} title='Hapus riwayat' subTitle={`Hapus riwayat ${data.title} pada ${formatBeautyDate(data.date)}`} textConfirm='Hapus' callBack={deleteRiwayat} onClose={() => setShowDeleteConfirm(false)}/>
    </div>
}

function DownloadCSVButton({onClose, data}) {

    function handleDownload() {
        const sortedData = [...data.users]?.sort((a, b) => {
            const classOrder = { 'X.E': 1, 'XI.F': 2, 'XII MIPA': 3, 'XII IPS': 4 }
        
            try {
                const classComparison = classOrder[a.kelas] - classOrder[b.kelas]
                if (classComparison !== 0) {
                    return classComparison
                }
            } catch (error) {
                console.log('error at class comparison')
            }
        
        try {
            const sectionComparison = a.nomorKelas - b.nomorKelas
            if (sectionComparison !== 0) {
                return sectionComparison
            }
        } catch (error) {
            console.log('error at section comparison')
        }
        
            return 1
        }) || []
        let dataToXLSX = [
            {
                sheet: data.title,
                columns: [
                    { label: "Kelas", value: row => `${row.kelas}-${row.nomorKelas}` },
                    { label: "Nama", value: 'nama' },
                    { label: "Absen", value: 'absen' },
                    { label: "Kode", value: 'kode' },
                    { label: "Keterangan", value: 'keterangan' },
                    { label: "Lokasi", value: row => `${isUserWithinBoundsCSV(data?.coordinates, row.koordinat)}` },
                    { label: "Latitude", value: row => row.koordinat[0] || 0 },
                    { label: "Longitude", value: row => row.koordinat[1] || 0 },
                    { label: "Waktu", value: row => formatDate(row.waktuAbsen) },
                ],
                content: sortedData
            }
        ]
            
        let settings = {
            fileName: `${data.title} ${formatDate(data.date)}`,
            extraLength: 3,
        }

        xlsx(dataToXLSX, settings)
    }

    return <p className='hover:bg-neutral-300 rounded p-2 cursor-pointer' onClick={() => {
        handleDownload()
        onClose()
    }}><FontAwesomeIcon icon={faTable}/> Download sebagai XLSX</p>
}

function SearchUser({isOpen, onClose, users = [], title, date}) {
    const [searchKey, setSearchKey] = useState('')
    const [kelas, setKelas] = useState('')
    const [nomorKelas, setNomorKelas] = useState(0)
    const [result, setResult] = useState([])
    const handleSearch = useCallback(() => {
        const usernameRegex = new RegExp(`^${searchKey}`, 'i')

        const result = users.filter((user) => (searchKey === '' || usernameRegex.test(user.nama)) && (kelas === '' || user.kelas === kelas) &&  (nomorKelas === 0 || user.nomorKelas === nomorKelas || kelas === ''))

        setResult(result)
    },[kelas, nomorKelas, searchKey, users])
    useEffect(() => {
        handleSearch()
    },[handleSearch])

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
                    <input className='p-2 rounded-x shadow' type="number" value={nomorKelas} onChange={(e) => setNomorKelas(e.target.value)} placeholder='nomor kelas' autoComplete='off' min='0' max='9'/>
                </>}
                <FontAwesomeIcon onClick={handleSearch} icon={faSearch} className='rounded text-neutral-100 bg-secondary p-3 shadow-lg shadow-primary/50 click-animation cursor-pointer'/>
            </div>
            <div className='flex flex-wrap gap-2'>
                {result.map(user => <span key={user._id} className={`p-2 rounded-xl ${user.absen ? 'bg-secondary text-neutral-200' : 'bg-neutral-300 text-neutral-700'}`}>{user.kelas}-{user.nomorKelas} {user.nama}</span>)}
            </div>
        </div>
    </Modal>
}