import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faRotate, faServer, faEllipsisV, faTrash, faTable, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { API, formatBeautyDate, formatDate, getPermission, isUserWithinBoundsCSV } from "../../../utils"
import LoadingIcon from '../../utils/LoadingIcon'
import { Link } from 'react-router-dom'
import Modal, { Confirm } from '../../utils/Modal'
import { loadingToast } from '../../utils/myToast'
import DisplayTableUsers from './DisplayTableUsers'
import xlsx from 'json-as-xlsx'


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
            <Link to={'/admin/users'} className='flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 border-transparent  text-neutral-500 bg-neutral-200'>
                <FontAwesomeIcon icon={faUserGroup}/> User
            </Link>
        </div>
        <button className='flex gap-2 items-center self-end justify-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 click-animation' onClick={() => fetchRiwayats()}>{isLoading?<LoadingIcon/>:<FontAwesomeIcon icon={faRotate} className='p-0.5'/>} Segarkan riwayat</button>
        <div className="flex flex-col gap-2">
            {riwayats?.length === 0 && <span className='text-center'>Tidak ada riwayat</span>}
            {/* {riwayats?.map(x => <RiwayatRow data={x} key={x._id} setRiwayats={setRiwayats}/>)} */}
            {riwayats?.map(x => <RiwayatControlDashboard riwayat={x} key={x._id} setRiwayats={setRiwayats}/>)}
        </div>
    </div>
}

function RiwayatControlDashboard({riwayat, setRiwayats}) {
    const [showOption, setShowOption] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    async function deleteRiwayat() {
        const promise = loadingToast('Menghapus Riwayat')
        try {
            await axios.delete(API+'/riwayats/'+riwayat._id)
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

    return <div className="relative flex py-2 gap-2 flex-col shadow-lg p-2 rounded my-2 bg-neutral-200">
        <div className='absolute top-2 right-2 cursor-pointer click-animation grid items-center px-4 py-2' onClick={() => setShowOption(true)}>
            <FontAwesomeIcon icon={faEllipsisV}/>
        </div>
        {riwayat && <div className='flex flex-col'>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Judul</p>
                <p>{riwayat?.title}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Status</p>
                <p>{riwayat?.status ? "Buka" : "Tutup"}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>{riwayat?.status ? 'Dibuka oleh': 'Ditutup oleh'}</p>
                <p>{riwayat?.openedBy || 'Anon'}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Pada</p>
                <p>{formatBeautyDate(riwayat?.date)}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Koordinat Pertama</p>
                <p className='max-w-full overflow-auto'>{riwayat?.coordinates?.first?.join(',') || '-'}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Koordinat Kedua</p>
                <p className='max-w-full overflow-auto'>{riwayat?.coordinates?.second?.join(',') || '-'}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Catatan</p>
                <p>{riwayat?.note || '-'}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Jumlah Peserta</p>
                <p>{riwayat?.tickets?.length || '-'}</p>
            </div>
        </div>}
        <DisplayTableUsers usersTicket={riwayat?.tickets} absensi={riwayat}/>
        <Modal isOpen={showOption} onClose={() => setShowOption(false)}>
            <div className='flex flex-col gap-2'>
                <DownloadCSVButton onClose={() => setShowOption(false)} riwayat={riwayat}/>
                <p className='hover:bg-neutral-300 rounded p-2 cursor-pointer' onClick={() => {
                    setShowDeleteConfirm(true)
                }}><FontAwesomeIcon icon={faTrash}/> Hapus Riwayat</p>
            </div>
        </Modal>
        <Confirm isOpen={showDeleteConfirm} title='Hapus riwayat' subTitle={`Hapus riwayat ${riwayat.title} pada ${formatBeautyDate(riwayat.date)}`} textConfirm='Hapus' callBack={deleteRiwayat} onClose={() => setShowDeleteConfirm(false)}/>
    </div>
}

function DownloadCSVButton({onClose, riwayat}) {

    async function handleDownload() {
        let usersWithTicketsAndTheTickets = []
        try {
            await axios.get(API + '/users/all').then(res => {
                const users = res.data
                usersWithTicketsAndTheTickets = riwayat.tickets.map(ticket => {
                    const getUser = users.find(u => u._id === ticket.user?._id);
                    const { user, _id, ...ticketDetails } = ticket
                    const returnTicketAndUser = {
                        ...getUser,
                        ...ticketDetails
                    }
                    console.log(returnTicketAndUser)
                    return returnTicketAndUser;
                });
            })
            .catch(err => {
                console.log(err)
                throw new Error(err);
            });
            const sortedData = [...usersWithTicketsAndTheTickets]?.sort((a, b) => {
                const classOrder = { 'X.E': 1, 'XI.F': 2, 'XII.F': 3}
            
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
            console.log('riwayat?.coordinates', riwayat?.coordinates)
            let dataToXLSX = [
                {
                    sheet: riwayat.title,
                    columns: [
                        { label: "Kelas", value: row => `${row.kelas}-${row.nomorKelas}` },
                        { label: "Nama", value: 'nama' },
                        { label: "Absen", value: 'absen' },
                        { label: "Kode", value: 'kode' },
                        { label: "Keterangan", value: 'keterangan' },
                        { label: "Lokasi", value: row => `${isUserWithinBoundsCSV(riwayat?.coordinates, row.koordinat)}` },
                        { label: "Latitude", value: row => row.koordinat[0] || 0 },
                        { label: "Longitude", value: row => row.koordinat[1] || 0 },
                        { label: "Waktu", value: row => formatDate(row.waktuAbsen) },
                    ],
                    content: sortedData
                }
            ]
                
            let settings = {
                fileName: `${riwayat.title} ${formatDate(riwayat.date)} - ${riwayat.openedBy}`,
                extraLength: 3,
            }
            xlsx(dataToXLSX, settings)
        } catch (error) {
            console.log('Error at find all users:', error);
        }
    }

    return <p className='hover:bg-neutral-300 rounded p-2 cursor-pointer' onClick={() => {
        handleDownload()
        onClose()
    }}><FontAwesomeIcon icon={faTable}/> Download sebagai XLSX</p>
}