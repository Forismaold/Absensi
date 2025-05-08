import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faBoxOpen, faClipboard, faDoorClosed, faEllipsisV, faFloppyDisk, faPenToSquare, faQrcode, faTable, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from "react-redux"
import { encryptObject, formatBeautyDate, getCenterCoordinates } from "../../../utils"
import axios from '../../utils/axios'
import { blankToast, loadingToast } from '../../utils/myToast'
import { useEffect, useState } from 'react'
import Modal, { Confirm } from '../../utils/Modal'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AbsensiEditor from './AbsensiEditor'
import QRCode from 'react-qr-code'
import DisplayTableUsers from './DisplayTableUsers'

export default function TombolAksiAbsensi({ item, callbackList = () => {}, lite = false }) {
    const [absensi, setAbsensi] = useState(item)
    const account = useSelector(state => state.source.account)
    const [searchParams, ] = useSearchParams()

    const [openEdit, setOpenEdit] = useState(false)
    const [showSaveConfirm, setShowSaveConfirm] = useState(false)
    const [showBuangConfirm, setShowBuangConfirm] = useState(false)
    const [isOpenMore, setIsOpenMore] = useState(false)
    const [selectedOpen, setSelectedOpen] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        setAbsensi(item)
    },[item])

    async function bukaAbsensi() {
        const promise = loadingToast('Membuka absensi')
        try {
            await axios.post('/absensi/buka/' + absensi?._id, {status: absensi.status})
            .then(res => {
                promise.onSuccess(res.data.msg)
                callbackList(res.data?.list || null)
                setAbsensi(res.data.absensi)
            }).catch(err => {
                console.log(err)
                promise.onError(err.response.data.msg)
            })
        } catch (error) {
            console.log(error);
            promise.onError('Internal server error')
        }
    }
    async function editAbsensi(title, note, coordinates) {
        const promise = loadingToast('Mengedit Absensi')
        try {
            await axios.put('/absensi/' + absensi?._id, {title, note, coordinates, openedBy: account?.panggilan || account.nama})
            .then(res => {
                promise.onSuccess(res.data.msg)
                setOpenEdit(false)
                callbackList(res.data?.list || null)
                setAbsensi(res.data.absensi)
            }).catch(err => {
                console.log(err)
                promise.onError(err.response.data.msg)
            })
        } catch (error) {
            console.log(error);
            promise.onError('Internal server error')
        }
    }

    async function saveAbsensi() {
        const promise = loadingToast('Menutup absensi')
        try {
            await axios.post('/absensi/simpan/' + absensi?._id, {status: absensi.status, closedBy: account?.nama})
            .then(res => {
                setShowSaveConfirm(false)
                setAbsensi(null)
                callbackList(res.data?.list || null)
                navigate('/admin/server')
                promise.onSuccess('Berhasil menyimpan data')
            }).catch(err => {
                promise.onError('Gagal menyimpan data')
            })
        } catch (error) {
            promise.onError('Internal server error')
        }
    }
    async function tutupAbsensi() {
        const promise = loadingToast('Menutup absensi')
        try {
            await axios.post('/absensi/tutup/' + absensi?._id, { closedBy: account?.nama, status: absensi?.status })
            .then(res => {
                promise.onSuccess(res.data.msg)
                callbackList(res.data?.list || null)
                setAbsensi(res.data.absensi)
            })
        } catch (error) {
            promise.onError('Internal server error')
        }
    }

    async function handleAbsensi(action) {
        if (action === 'tutup') tutupAbsensi()
        if (action === 'buka') bukaAbsensi()
    }

    async function buangAbsensi() {
        const promise = loadingToast('Membuang absensi')
        try {
            await axios.delete('/absensi/buang/' + absensi?._id)
            .then(res => {
                promise.onSuccess('Absensi berhasil dihapus')
                setShowBuangConfirm(false)
                callbackList(res.data?.list || null)
                navigate('/admin/server')
                setAbsensi(null)
            }).catch(err => {
                promise.onError('Gagal menghapus data')
            })
        } catch (error) {
            promise.onError('Internal server error')
        }
    }

    useEffect(() => {
        setSelectedOpen(searchParams.get('open'))
        console.log(searchParams.get('open'), selectedOpen)

    },[searchParams, selectedOpen])

    const optionList = <div className='flex flex-col gap-2 p-2 bg-neutral-100 text-neutral-500 rounded'>
        {lite && <div className='cursor-pointer' onClick={() => navigate(`/admin/server/detail?q=${absensi._id}`)}>
            <p className='text-xl font-semibold'>{absensi.title} <span className='text-sm font-normal'>oleh {absensi.openedBy}</span></p>
        </div>
        }
            <div className='flex w-full items-stretch bg-white rounded shadow'>
                <input className='flex-1 min-w-0 rounded border-none bg-transparent' onChange={() => null} type='text' value={window.location.origin + '/absen/' + absensi?._id}/>
                
                <div className='flex gap-2 items-center click-animation cursor-pointer px-4 hover:bg-tertiary rounded shadow' onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/absen/' + absensi?._id)
                    blankToast('Link disimpan di papan klip')
                    setIsOpenMore(false)
                }}>
                    <FontAwesomeIcon icon={faClipboard}/>
                </div>
                <div className='flex gap-2 items-center click-animation cursor-pointer px-4 hover:bg-tertiary rounded shadow' onClick={() => {
                    navigate('/absen/' + absensi?._id)
                    setIsOpenMore(false)
                }}>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare}/>
                </div>
            </div>
        <div className='flex gap-2 items-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded shadow' onClick={() => {
            navigate(`/admin/server/detail?q=${absensi._id}&&open=goldenQr`)
        }}>
            <FontAwesomeIcon icon={faQrcode}/> Golden QR
        </div>
        <div className='flex gap-2 items-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded shadow' onClick={() => {
            navigate(`/admin/server/detail?q=${absensi._id}&&open=userTable`)
            setIsOpenMore(false)
            }}>
            <FontAwesomeIcon icon={faTable}/> Peserta
        </div>
        <div className='flex gap-2'>
            <div className='flex flex-1 flex-col gap-2'>
                <div className='flex w-full gap-2 items-center justify-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded shadow' onClick={() => {
                        setIsOpenMore(false)
                        setShowSaveConfirm(true)
                    }}>
                    <FontAwesomeIcon icon={faFloppyDisk}/> Simpan
                </div>
                <div className='flex w-full gap-2 items-center justify-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded shadow' onClick={() => {
                        setIsOpenMore(false)
                        setShowBuangConfirm(true)
                    }}>
                    <FontAwesomeIcon icon={faTrash}/> Buang
                </div>
            </div>
            <div className='flex flex-1 gap-2 items-center justify-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded shadow' onClick={() => {
                setOpenEdit(true)
                setIsOpenMore(false)
            }}>
                <FontAwesomeIcon icon={faPenToSquare}/> Edit
            </div>
        </div>
        
    </div>

    if (!absensi) return null
    
    return <>
        <div className={`relative flex gap-2 p-2 flex-col shadow-lg rounded bg-neutral-200 ${absensi?.status ? 'bg-secondary text-neutral-200' : 'bg-neutral-200'}`}>
            <div className='flex flex-col gap-2'>
                <div className='flex'>
                    <p className='flex-1 text-xl font-semibold' onClick={() => navigate(`/admin/server/detail?q=${absensi._id}`)}>{absensi.title} <span className='text-sm font-normal'>oleh {absensi.openedBy}</span></p>
                    {lite && <div className='cursor-pointer click-animation grid items-center px-4 py-2' onClick={() => setIsOpenMore(true)}>
                        <FontAwesomeIcon icon={faEllipsisV}/>
                    </div>}
                </div>
                <div className='flex flex-col' onClick={() => navigate(`/admin/server/detail?q=${absensi._id}`)}>
                    <p><span className='font-semibold'>{absensi?.status ? "Buka" : "Tutup"}</span> {formatBeautyDate(absensi?.date)}</p>
                    {absensi?.note && <p>{absensi?.note}</p>}
                    <p>{absensi?.tickets?.length || '0'} Peserta</p>
                </div>
            </div>

            {(lite || (selectedOpen !== 'userTable' && selectedOpen !== 'goldenQr'))  && <div className='flex gap-2 justify-end flex-wrap'>
                <div onClick={() => absensi?.status ? handleAbsensi('tutup'):handleAbsensi('buka')} className={`flex flex-1 justify-center gap-2 shadow-lg ${absensi?.status ? 'bg-neutral-200  text-secondary' : 'bg-secondary text-neutral-200'} shadow-secondary/50 cursor-pointer items-center p-2 rounded click-animation`}>
                    <FontAwesomeIcon icon={absensi?.status ? faDoorClosed : faBoxOpen}/>
                    <p>{absensi?.status ? 'Tutup' : 'Buka'}</p>
                </div>
            </div>}
            {lite && <Modal isOpen={isOpenMore} onClose={() => setIsOpenMore(false)} className='max-w-sm'>
                    {optionList}
                </Modal>
            }
            <Confirm isOpen={showSaveConfirm} title={`Tutup dan simpan ${absensi?.title}`} subTitle={`Menutup absensi ${absensi?.title} dan menyimpannya sekarang?`} onClose={() => setShowSaveConfirm(false)} callBack={saveAbsensi} textConfirm={`Simpan ${absensi?.tickets?.length > 0 ? `(${absensi?.tickets?.length})` : ''}`}/>
            <Confirm isOpen={showBuangConfirm} title={`Buang ${absensi?.title}`} subTitle={`Menutup absensi ${absensi?.title} dan membuang perubahan absensi?`} onClose={() => setShowBuangConfirm(false)} callBack={buangAbsensi} textConfirm={`Buang ${absensi?.tickets?.length > 0 ? `(${absensi?.tickets?.length})` : ''}`}/>
            <AbsensiEditor isOpen={openEdit} onClose={() => setOpenEdit(false)} callBack={editAbsensi} submitText='Simpan' title={absensi?.title} note={absensi?.note} coordinates={absensi?.coordinates || {}} absensi={absensi || null}/>
        </div>
        {selectedOpen !== 'userTable' && selectedOpen !== 'goldenQr' && !lite && <div className='flex flex-col'>
            {optionList}
        </div>}
        {selectedOpen === 'userTable' && <DisplayTableUsers usersTicket={absensi?.tickets} absensi={absensi}/>}
        {selectedOpen === 'goldenQr' && <div className='flex flex-col gap-2'>
            <p className='pt-4 font-semibold text-xl'>Golden Qr</p>
            <div className='bg-yellow-500 p-4 w-fit mx-auto'>
            {absensi?.status === false ? <p className='font-semibold text-xl text-red-500'>Buka absensi terlebih dahulu!</p>
            :
                <QRCode value={encryptObject({
                    id: absensi?._id,
                    title: absensi?.title,
                    openedBy: absensi?.openedBy,
                    date: absensi?.date,
                    centerCoordinates: getCenterCoordinates(absensi?.coordinates)
                })}/> 
            }
            </div>
            <p className='font-semibold'>Cara menggunakan</p>
            <p className='text-xs'>Buka halaman https://absensiswa.netlify.app/absengoldenqr</p>
            <p className='text-xs'>Nyalakan kamera</p>
            <p className='text-xs'>Pindai kode QR ini dan kirim absen</p>
        </div>}
    </>
}