import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Rectangle, TileLayer, Tooltip } from 'react-leaflet'
import LoadingSvg from '../../utils/LoadingIcon'
import { faChevronLeft, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { setUserCoordinate } from '../../../redux/coordinates'
import { blankToast, loadingToast } from '../../utils/myToast'
import axios from 'axios'
import { API } from '../../../utils'

export default function Absen() {
    return <div>
        <p>ini halaman absen</p>
        <MyMap/>
    </div>
}

const MyMap = () => {
    const firstCoordinate = useSelector(state => state.coordinates.first)
    const secondCoordinate = useSelector(state => state.coordinates.second)
    const centerCoordinate = useSelector(state => state.coordinates.center)
    const userCoordinate = useSelector(state => state.coordinates.user)

    const [loadingUserCoor, setLoadingUserCoor] = useState(false)
    const [showCoordinate, setShowCoordinate] = useState(false)

    const mapRef = useRef(null)

    const dispatch = useDispatch()

    const getCurrentLocation = useCallback(() => {
        if (navigator.geolocation) {
            setLoadingUserCoor(true)
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    const value = [latitude, longitude]
                    dispatch(setUserCoordinate(value))
                    setLoadingUserCoor(false)
                    focusOnLocation(value)
                },
                (error) => {
                    console.error('Error getting location:', error)
                    setLoadingUserCoor(false)
                }
            )
        } else {
            alert('Geolocation tidak didukung browsermu.')
            setLoadingUserCoor(false)
        }
    },[dispatch])

    const focusOnLocation = (location) => {
        const map = mapRef.current
        map && map?.flyTo(location, map.getZoom())
    }

    useEffect(() => {
        if (!userCoordinate) getCurrentLocation()
    },[getCurrentLocation, userCoordinate])

    function focusUserLocation() {
        if (userCoordinate) focusOnLocation(userCoordinate)
    }

    return (
        <div className='flex flex-col gap-2'>
            <MapContainer ref={mapRef} center={centerCoordinate} style={{ height: '20rem', width: '100%' }} zoom={18} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" className='rounded-md'/>
                    <Rectangle
                        bounds={[firstCoordinate, secondCoordinate]}
                        color="blue"
                        fillOpacity={0.5}
                    >
                    <Tooltip sticky>
                        Lokasi Absen disini
                    </Tooltip>
                </Rectangle>
                <Marker position={userCoordinate? userCoordinate : [0,0]}>
                    <Tooltip>
                        Lokasi kamu disini
                    </Tooltip>
                </Marker>
            </MapContainer>
            <div className='flex gap-2 flex-wrap mt-2 flex-col md:flex-row'>
                <div className='relative flex flex-1 flex-col shadow-md rounded p-2'>
                    <button className='absolute top-1 right-1 flex items-center justify-center rounded text-neutral-100 bg-indigo-600 p-2' onClick={() => focusOnLocation(firstCoordinate)}><FontAwesomeIcon icon={faLocationCrosshairs}/></button>
                    <p>Lokasi absen</p>
                    <div onClick={() => setShowCoordinate(prev => !prev)} className='flex-1 cursor-pointer'>
                        {showCoordinate ?
                        <>
                            <p>Diantara </p>
                            <div className='flex flex-col text-center'>
                                <p>{firstCoordinate[0] || ''}, {firstCoordinate[1] || ''}</p>
                                <p>dan</p>
                                <p>{secondCoordinate[0] || ''}, {secondCoordinate[1] || ''}</p>
                            </div>
                        </>
                        :
                            <span>Dekat Jl. Medang No.17, Rejowinangun Utara, Kec. Magelang Tengah, Kota Magelang, Jawa Tengah 56127</span>
                        }
                    </div>
                </div>
                <div className='relative flex flex-1 flex-col shadow-md rounded p-2'>
                    <button className={`absolute top-1 right-1 flex items-center justify-center rounded text-neutral-100 bg-indigo-${userCoordinate ? '600' : '200'} p-2`} onClick={focusUserLocation}><FontAwesomeIcon icon={faLocationCrosshairs}/></button>
                    <p>Lokasi kamu</p>
                    <span>{userCoordinate ? `${userCoordinate[0]}, ${userCoordinate[1]}` : '0, 0'}</span>
                    <button className='flex items-center justify-center rounded text-neutral-100 px-2 py-1 bg-indigo-600 min-h-[32px] mt-auto' onClick={getCurrentLocation}>
                        {loadingUserCoor ? <LoadingSvg /> : <span>Segarkan</span>}
                    </button>
                </div>
            </div>
            <KirimAbsen/>
        </div>
    )
}

function KirimAbsen() {
    const firstCoordinate = useSelector(state => state.coordinates.first)
    const secondCoordinate = useSelector(state => state.coordinates.second)
    const userCoordinate = useSelector(state => state.coordinates.user)
    const account = useSelector(state => state.source.account)

    const [kode, setKode] = useState('-')
    const [keterangan, setKeterangan] = useState('')
    const [showTidak, setShowTidak] = useState(true)
    const [showKirim, setShowKirim] = useState(true)
    const [showFormTidak, setShowFormTidak] = useState(false)

    if (!account) return null

    function handleTidakHadir() {
        setShowKirim(prev => !prev)
        setShowTidak(prev => !prev)
        setShowFormTidak(prev => !prev)
    }

    async function handleSubmitTidakHadir(e) {
        e.preventDefault()
        const dataToSend = {
            _id: account._id,
            kode,
            keterangan
        }
        const promise = loadingToast()
        try {
            await axios.post(API + '/absen/tidakHadir', dataToSend)
            .then(res => {
                promise.onSuccess(res.data.msg)
                handleTidakHadir()
            }).catch(err => {
                promise.onError(err.response.data.msg)
            })
        } catch (error) {
            promise.onError('Server error')
        }
    }

    async function handleHadir() {
        const dataToSend = {
            _id: account._id,
        }

        const isUserWithinBounds = (userCoordinate[0] >= firstCoordinate[0] && userCoordinate[0] <= secondCoordinate[0]) &&(userCoordinate[1] >= firstCoordinate[1] && userCoordinate[1] <= secondCoordinate[1])

        if (!isUserWithinBounds) blankToast('Kamu berada diluar area, pengiriman tetap dilanjutkna')

        const promise = loadingToast()
        try {
            await axios.post(API + '/absen/hadir', dataToSend)
            .then(res => {
                promise.onSuccess(res.data.msg)
            }).catch(err => {
                promise.onError(err.response.data.msg)
            })
        } catch (error) {
            promise.onError('Server error')
        }
    }

    return <div className='bg-indigo-600 text-neutral-100 rounded-xl p-4 flex flex-col gap-2'>
        <p>Kirim sebagai {account?.panggilan || account?.nama}</p>
        <div className='flex sm:flex-row flex-col gap-2'>
            {showTidak &&
                <div className='flex-1 border-2 border-solid border-neutral-200 bg-inherit text-neutral-200 p-2 rounded flex justify-center shadow cursor-pointer' onClick={handleTidakHadir}>
                    <span>Tidak</span>
                </div>
            }
            {showFormTidak &&
                <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmitTidakHadir}>
                    <div className='flex items-center gap-2 bg-indigo-500 rounded p-2 shadow cursor-pointer' onClick={handleTidakHadir}>
                        <FontAwesomeIcon icon={faChevronLeft}/>
                        <p>Tidak hadir</p>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-2 flex-1'>
                        <select value={kode} onChange={(e) => setKode(e.target.value)} className='min-h-[40px] shadow px-2 rounded bg-indigo-600 border-2 border-solid border-neutral-200 shadow' placeholder='Kode keterangan'>
                            <option value="-" disable='true'>Kode</option>
                            <option value="I">Izin</option>
                            <option value="S">Sakit</option>
                            <option value="A">Alpa</option>
                        </select>
                        <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className='shadow border-2 border-solid border-neutral-200 bg-indigo-600 p-2 flex-[5] rounded placeholder:text-neutral-300 shadow' placeholder='Tambahkan keterangan'></textarea>
                    </div>
                    <button type='submit' className='rounded bg-indigo-600 border-2 border-solid border-neutral-200 p-2 hover:text-indigo-700 hover:bg-neutral-200'>Kirim</button>
                </form>
            }
            {showKirim &&
                <div className='flex-[4] bg-neutral-200 text-indigo-600 p-2 rounded flex justify-center shadow cursor-pointer hover:shadow-xl duration-300 hover:-translate-y-1' onClick={handleHadir}>
                    <span>Kirim</span>
                </div>
            }
        </div>
    </div>
}