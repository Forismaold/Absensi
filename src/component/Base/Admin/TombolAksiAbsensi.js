import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faDoorClosed, faEllipsisV, faExternalLink, faFloppyDisk, faLink, faPenToSquare, faQrcode, faTable, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from "react-redux"
import { API, formatBeautyDate } from "../../../utils"
import axios from "axios"
import { blankToast, loadingToast } from '../../utils/myToast'
import { useEffect, useState } from 'react'
import Modal, { Confirm } from '../../utils/Modal'
import { useNavigate } from 'react-router-dom'
import AbsensiEditor from './AbsensiEditor'
import DisplayTableUsers from './DisplayTableUsers'
import QRCode from 'react-qr-code'

export default function TombolAksiAbsensi({ item }) {
    const [absensi, setAbsensi] = useState(item)
    const account = useSelector(state => state.source.account)

    const [openEdit, setOpenEdit] = useState(false)
    const [showSaveConfirm, setShowSaveConfirm] = useState(false)
    const [showBuangConfirm, setShowBuangConfirm] = useState(false)
    const [isOpenMore, setIsOpenMore] = useState(false)
    const [showUsers, setShowUsers] = useState(false)
    const [showGoldenQr, setShowGoldenQr] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        setAbsensi(item)
    },[item])

    async function bukaAbsensi() {
        const promise = loadingToast('Membuka absensi')
        try {
            await axios.post(API + '/absensi/buka/' + absensi?._id, {status: absensi.status})
            .then(res => {
                promise.onSuccess(res.data.msg)
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
            await axios.put(API + '/absensi/' + absensi?._id, {title, note, coordinates, openedBy: account?.panggilan || account.nama})
            .then(res => {
                promise.onSuccess(res.data.msg)
                setOpenEdit(false)
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
            await axios.post(API + '/absensi/simpan/' + absensi?._id, {status: absensi.status, closedBy: account?.nama})
            .then(res => {
                setShowSaveConfirm(false)
                setAbsensi(null)
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
            await axios.post(API + '/absensi/tutup/' + absensi?._id, { closedBy: account?.nama, status: absensi?.status })
            .then(res => {
                promise.onSuccess(res.data.msg)
                setAbsensi(res.data.absensi)
            })
        } catch (error) {
            promise.onError('Internal server error')
        }
    }
    async function buangAbsensi() {
        const promise = loadingToast('Membuang absensi')
        try {
            await axios.delete(API + '/absensi/buang/' + absensi?._id)
            .then(res => {
                promise.onSuccess('Absensi berhasil dihapus')
                setShowBuangConfirm(false)
                navigate('/admin/server')
                setAbsensi(null)
            }).catch(err => {
                promise.onError('Gagal menghapus data')
            })
        } catch (error) {
            promise.onError('Internal server error')
        }
    }

    if (!absensi) return <p className='bg-neutral-200 p-2 text-center rounded'>Absensi belum di load atau sudah dihapus!</p>
    
    return <div className="relative flex gap-2 flex-col shadow-lg p-2 rounded bg-neutral-200">
        <div className='flex'>
            <p className='flex-1 text-xl font-semibold'>{absensi.title} <span className='text-sm font-normal'>oleh {absensi.openedBy}</span></p>
            <div className='cursor-pointer click-animation grid items-center px-4 py-2' onClick={() => setIsOpenMore(true)}>
                <FontAwesomeIcon icon={faEllipsisV}/>
            </div>
        </div>
        <div className='flex flex-col'>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>{absensi?.status ? "Buka" : "Tutup"}</p>
                <p>{formatBeautyDate(absensi?.date)}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Catatan</p>
                <p>{absensi?.note || '-'}</p>
            </div>
            <div className='flex flex-wrap flex-col sm:flex-row'>
                <p className='sm:w-2/6 font-semibold'>Jumlah Peserta</p>
                <p>{absensi?.tickets?.length || '-'}</p>
            </div>
        </div>

        <div className='flex gap-2 justify-end flex-wrap'>
            <div className='flex gap-2 shadow-lg shadow-primary/50 cursor-pointer text-primary items-center p-2 rounded border-primary border-2 border-solid click-animation' onClick={() => setShowSaveConfirm(true)}>
                <FontAwesomeIcon icon={faFloppyDisk}/>
                <p>Simpan</p>
            </div>
            {absensi?.status ?
                <>
                    <div onClick={tutupAbsensi} className='flex gap-2 bg-primary shadow-lg shadow-primary/50 cursor-pointer items-center p-2 rounded text-neutral-200 click-animation'>
                        <FontAwesomeIcon icon={faDoorClosed}/>
                        <p>Tutup</p>
                    </div>
                </>
                :
                <>
                <div onClick={bukaAbsensi} className='flex flex-1 justify-center gap-2 shadow-lg shadow-primary/50 cursor-pointer bg-primary items-center p-2 rounded text-neutral-200 click-animation'>
                    <FontAwesomeIcon icon={faBoxOpen}/>
                    <p>Buka</p>
                </div>
                </>
            }
        </div>
        <Modal isOpen={isOpenMore} onClose={() => setIsOpenMore(false)}>
            <div className='flex flex-col gap-2'>
                <div className='flex gap-2 items-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded' onClick={() => navigate(`/admin/server/detail?q=${absensi._id}`)}>
                    <FontAwesomeIcon icon={faExternalLink}/> Detail
                </div>
                <div className='flex gap-2 items-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded' onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/absen/' + absensi?._id)
                    blankToast('Link disimpan di papan klip')
                    setIsOpenMore(false)
                }}>
                    <FontAwesomeIcon icon={faLink}/> Salin link Absensi
                </div>
                <div className='flex gap-2 items-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded' onClick={() => {
                    setShowGoldenQr(true)
                }}>
                    <FontAwesomeIcon icon={faQrcode}/> Golden QR
                </div>
                <div className='flex gap-2 items-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded' onClick={() => {
                    setShowUsers(true)
                    setIsOpenMore(false)
                    }}>
                    <FontAwesomeIcon icon={faTable}/> Peserta
                </div>
                <div className='flex gap-2 items-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded' onClick={() => {
                    setOpenEdit(true)
                    setIsOpenMore(false)
                }}>
                    <FontAwesomeIcon icon={faPenToSquare}/> Edit
                </div>
                <div className='flex gap-2 items-center click-animation cursor-pointer p-2 hover:bg-tertiary rounded' onClick={() => {
                    setIsOpenMore(false)
                    setShowBuangConfirm(true)
                }}>
                    <FontAwesomeIcon icon={faTrash}/> Buang
                </div>
            </div>
        </Modal>
        <Confirm isOpen={showSaveConfirm} title='Tutup dan simpan' subTitle={`Menutup absensi ${absensi?.title} dan menyimpannya sekarang?`} onClose={() => setShowSaveConfirm(false)} callBack={saveAbsensi} textConfirm='Simpan'/>
        <Confirm isOpen={showBuangConfirm} title='Buang' subTitle={`Menutup absensi ${absensi?.title} dan membuang perubahan absensi?`} onClose={() => setShowBuangConfirm(false)} callBack={buangAbsensi} textConfirm='Buang'/>
        <AbsensiEditor isOpen={openEdit} onClose={() => setOpenEdit(false)} callBack={editAbsensi} submitText='Simpan' title={absensi?.title} note={absensi?.note} coordinates={absensi?.coordinates || {}}/>
        <Modal isOpen={showGoldenQr} onClose={() => setShowGoldenQr(false)} fluid={true}>
            <div className='bg-yellow-500 p-4'>
                <QRCode value={absensi?._id}/> 
            </div>
        </Modal>
        <Modal isOpen={showUsers} onClose={() => setShowUsers(false)}>
            <div className="flex flex-col p-2">
                <div className='flex flex-wrap flex-col sm:flex-row'>
                    <p className='sm:w-2/6 font-semibold'>Judul</p>
                    <p>{absensi?.title}</p>
                </div>
                <div className='flex flex-wrap flex-col sm:flex-row'>
                    <p className='sm:w-2/6 font-semibold'>Status</p>
                    <p>{absensi?.status ? "Buka" : "Tutup"}</p>
                </div>
                <div className='flex flex-wrap flex-col sm:flex-row'>
                    <p className='sm:w-2/6 font-semibold'>{absensi?.status ? 'Dibuka oleh': 'Ditutup oleh'}</p>
                    <p>{absensi?.openedBy || 'Anon'}</p>
                </div>
                <div className='flex flex-wrap flex-col sm:flex-row'>
                    <p className='sm:w-2/6 font-semibold'>Pada</p>
                    <p>{formatBeautyDate(absensi?.date)}</p>
                </div>
                <div className='flex flex-wrap flex-col sm:flex-row'>
                    <p className='sm:w-2/6 font-semibold'>Catatan</p>
                    <p>{absensi?.note || '-'}</p>
                </div>
            </div>
            <DisplayTableUsers usersTicket={absensi?.tickets} absensi={absensi}/>
        </Modal>
    </div>
}