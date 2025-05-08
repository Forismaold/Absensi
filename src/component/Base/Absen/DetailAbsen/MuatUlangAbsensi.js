import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRefresh } from "@fortawesome/free-solid-svg-icons"
import { useCallback, useEffect, useState } from "react"
import axios from "../../../utils/axios"
import { clearAbsensi, setAbsensi } from '../../../../redux/source'
import { useDispatch, useSelector } from "react-redux"
import StatusAbsensi from "./StatusAbsensi"
import { useParams } from "react-router-dom"


export default function MuatUlangAbsensi() {
    const absensi = useSelector(state => state.source.absensi)
    const proMode = useSelector(state => state.source.proMode)
    
    const [isFetchLoading, setIsFetchLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const dispatch = useDispatch()
    const param = useParams()


    const fetchData = useCallback(async () => {
        setIsFetchLoading(true)
        try {
            await axios.get('/absensi/' + param.absenceId)
            .then(res => {
                dispatch(setAbsensi(res.data.data))
            }).catch(err => {
                setErrorMessage(err?.response?.data?.msg || err?.message || 'Error: Gagal mendapatkan data! periksa kembali jaringan anda dan coba lagi. atau hubungi admin')
            })
        } catch (error) {
            console.log(error)
            setErrorMessage(error?.response?.data?.msg)
        } finally {
            setIsFetchLoading(false)
        }
    },[dispatch, param.absenceId])
    
    useEffect(() => {
        setErrorMessage('')
    },[absensi])
    useEffect(() => {
        
        if (!absensi) {
            fetchData()
        } else if (absensi && absensi?._id !== param.absenceId) {
            fetchData()
        }
    },[absensi, dispatch, fetchData, param.absenceId])

    return <>
        {proMode && <div className='flex items-center justify-end' onClick={() => {
                dispatch(clearAbsensi())
                if (!absensi && !isFetchLoading) {
                    setErrorMessage('')
                    fetchData()
                }
            }}>
                <div className='flex gap-2 items-center bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer'>
                    <FontAwesomeIcon icon={faRefresh} className={`${isFetchLoading && 'animate-spin'}`}/> Muat ulang
                </div>
            </div>
        }
        {errorMessage && <StatusAbsensi message={errorMessage}/>}
    </>
}