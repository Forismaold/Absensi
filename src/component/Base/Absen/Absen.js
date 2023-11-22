import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars, faBolt, faInfo, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Rectangle, TileLayer, Tooltip } from 'react-leaflet'
import LoadingIcon from '../../utils/LoadingIcon'
import { useDispatch, useSelector } from 'react-redux'
import { setUserCoordinate } from '../../../redux/coordinates'
import { blankToast } from '../../utils/myToast'
import Note from './Note'
import Modal from '../../utils/Modal'
import UserAbsenceStatus from './UserAbsenceStatus'

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
    const [showUserCoordinateTutorial, setShowUserCoordinateTutorial] = useState(false)
    const [toggleHighAccuracy, setToggleHighAccuracy] = useState(false)
    const [isWatchPosition, setIsWatchPosition] = useState(false)

    const mapRef = useRef(null)

    const dispatch = useDispatch()

    const getCurrentLocation = useCallback(() => {
        if (isWatchPosition) return null
        if (navigator.geolocation) {
            if (toggleHighAccuracy === true) blankToast('Mencari lokasi dengan akurasi tinggi')
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
                },
                {
                    enableHighAccuracy: toggleHighAccuracy,
                    maximumAge: 0,
                }
            )
        } else {
            alert('Geolocation tidak didukung browsermu.')
            setLoadingUserCoor(false)
        }
    },[dispatch, isWatchPosition, toggleHighAccuracy])

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
            <div className='rounded-xl overflow-hidden'>
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
            </div>
            <div className='flex gap-2 flex-wrap mt-2 flex-col md:flex-row'>
                <div className='relative flex flex-1 flex-col shadow-md rounded-xl bg-neutral-300/50 p-2'>
                    <button className='absolute top-1 right-1 flex items-center justify-center rounded-lg text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95' onClick={() => focusOnLocation(firstCoordinate)}><FontAwesomeIcon icon={faLocationCrosshairs}/></button>
                    <p>Lokasi absen {showCoordinate && 'diantara'}</p>
                    <div onClick={() => setShowCoordinate(prev => !prev)} className='flex-1 cursor-pointer'>
                        {showCoordinate ?
                            <div className='flex flex-col text-center'>
                                <p>{firstCoordinate[0] || ''}, {firstCoordinate[1] || ''}</p>
                                <p>dan</p>
                                <p>{secondCoordinate[0] || ''}, {secondCoordinate[1] || ''}</p>
                            </div>
                        :
                            <span>Dekat Jl. Medang No.17, Rejowinangun Utara, Kec. Magelang Tengah, Kota Magelang, Jawa Tengah 56127</span>
                        }
                    </div>
                </div>
                <div className='relative flex flex-1 flex-col shadow-md bg-neutral-300/50 rounded-xl p-2'>
                    <div className='absolute top-1 right-1 flex gap-1'>
                        <button className='flex items-center justify-center px-3 text-neutral-500 p-2 duration-200 ease-in-out active:scale-95' onClick={() => setShowUserCoordinateTutorial(true)}><FontAwesomeIcon icon={faInfo}/></button>
                        <button className={`flex items-center justify-center rounded-lg text-neutral-100 ${userCoordinate ? ' bg-secondary' : ' bg-primary-quarternary'} p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95`} onClick={focusUserLocation}><FontAwesomeIcon icon={faLocationCrosshairs}/></button>
                    </div>
                    <p>Lokasi kamu</p>
                    <span>{userCoordinate ? `${userCoordinate[0]}, ${userCoordinate[1]}` : '0, 0'}</span>
                    <div className='flex gap-2 py-1 mt-auto'>
                        {isWatchPosition ? <WatchPosition onClose={() => setIsWatchPosition(false)} toggleHighAccuracy={toggleHighAccuracy} focusOnLocation={focusOnLocation}/> : 
                            <button className={`flex shadow-lg px-2 shadow-primary/50 justify-center items-center rounded text-neutral-500 duration-200 ease-in-out active:scale-95 bg-neutral-200 min-h-[32px] mt-auto`} onClick={() => setIsWatchPosition(true)} title='Akurasi tinggi'>
                                <FontAwesomeIcon icon={faBinoculars}/>
                            </button>
                        }
                        <button className={`flex flex-1 shadow-lg shadow-primary/50 items-center justify-center rounded text-neutral-100 px-2 duration-200 ease-in-out active:scale-95 bg-secondary min-h-[32px] mt-auto`} onClick={getCurrentLocation} title='Akurasi sedang'>
                            {loadingUserCoor ? <LoadingIcon /> : <span>{isWatchPosition ? 'Posisi menonton' : 'Segarkan'}</span>}
                        </button>
                        <button className={`flex shadow-lg px-2 shadow-accent/50 justify-center items-center rounded ${toggleHighAccuracy ? 'text-neutral-700 bg-accent' : 'text-neutral-500 bg-neutral-200'} duration-200 ease-in-out active:scale-95 min-h-[32px] mt-auto`} onClick={() => {
                            toggleHighAccuracy ? blankToast('Akurasi tinggi dimatikan') : blankToast('Akurasi tinggi dinyalakan')
                            setToggleHighAccuracy(prev => !prev)
                            }} title='Akurasi tinggi'>
                            {loadingUserCoor ? <LoadingIcon /> : <FontAwesomeIcon icon={faBolt}/>}
                        </button>
                    </div>
                </div>
            </div>
            <UserAbsenceStatus/>
            <Note/>
            <ShowModalInfoUserCoordinate isOpen={showUserCoordinateTutorial} onClose={() => setShowUserCoordinateTutorial(false)}/>
        </div>
    )
}

function ShowModalInfoUserCoordinate({isOpen, onClose}) {
    return <Modal isOpen={isOpen} onClose={onClose} zIndex={'z-[1001]'}>
        <div className='text-neutral-500 p-2'>
            <h3 className='font-semibold'>Masalah umum</h3>
            <ol className='pl-4'>
                <li><span className='font-medium'>Kondisi cuaca atau atmosfer:</span> Cuaca buruk atau kondisi atmosfer tertentu dapat memengaruhi sinyal GPS dan mengurangi akurasi.</li>
                <li><span className='font-medium'>Penggunaan VPN:</span> Jika pengguna menggunakan VPN, lokasi yang dilaporkan mungkin mencerminkan lokasi server VPN, bukan lokasi fisik pengguna.</li>
                <li><span className='font-medium'>Pembaruan lokasi yang tertunda:</span> Beberapa perangkat mungkin menyimpan data lokasi yang lebih lama sebelum memperbarui lokasi yang akurat. Hal ini dapat mengakibatkan hasil yang tidak selalu mencerminkan lokasi terkini.</li>
            </ol>
            <h3 className='font-semibold mt-2'>Solusi</h3>
            <ol className='pl-4'>
                <li>Klik <FontAwesomeIcon icon={faBinoculars}/> untuk menunjukkan geolokasi dengan waktu sebenarnya</li>
                <li>Klik <FontAwesomeIcon icon={faBolt}/> untuk menggunakan geolokasi dengan akurasi tinggi</li>
                <li><span className='font-medium'>Pergi ke ruang terbuka:</span></li>
                <li><span className='font-medium'>Gunakan akses internet lain:</span> Beberapa provider internet mungkin memberikan lokasi yang tidak akurat</li>
            </ol>
        </div>
    </Modal>
}

function WatchPosition({onClose, toggleHighAccuracy, focusOnLocation}) {
    const userCoordinate = useSelector(state => state.coordinates.user)

    const dispatch = useDispatch()

    useEffect(() => {
        if ('geolocation' in navigator) {
          const successCallback = (position) => {
            const { latitude, longitude } = position.coords
            dispatch(setUserCoordinate([latitude,longitude]))
            console.log(`Current position: ${latitude}, ${longitude}`)
            if (userCoordinate) focusOnLocation(userCoordinate)
          }
    
          const errorCallback = (error) => {
            console.error(`Error getting geolocation: ${error.message}`)
          }
    
          const options = {
            enableHighAccuracy: toggleHighAccuracy,
            maximumAge: 0,
          }
    
        
          const watchId = navigator.geolocation.watchPosition(
            successCallback,
            errorCallback,
            options
          )
    
        
          return () => navigator.geolocation.clearWatch(watchId)
        } else {
          console.error('Geolocation is not supported by your browser')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, toggleHighAccuracy])
    
      return <button className={`flex shadow-lg px-2 shadow-primary/50 justify-center items-center rounded text-neutral-200 duration-200 ease-in-out active:scale-95 bg-secondary min-h-[32px] mt-auto`} onClick={onClose} title='Lacak'>
        <FontAwesomeIcon icon={faBinoculars} className='animate-pulse animate-spin'/>
    </button>
    
}