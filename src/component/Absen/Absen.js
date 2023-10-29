import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Rectangle, TileLayer, Tooltip } from 'react-leaflet'
import LoadingSvg from '../utils/LoadingIcon'
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { setUserCoordinate } from '../../redux/coordinates'

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

    return (
        <div>
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
                            <span>{firstCoordinate[0] || ''}, {firstCoordinate[1] || ''}</span>
                            <span>{secondCoordinate[0] || ''}, {secondCoordinate[1] || ''}</span>
                        </>
                        :
                            <span>Dekat Jl. Medang No.17, Rejowinangun Utara, Kec. Magelang Tengah, Kota Magelang, Jawa Tengah 56127</span>
                        }
                    </div>
                </div>
                <div className='relative flex flex-1 flex-col shadow-md rounded p-2'>
                    <button className='absolute top-1 right-1 flex items-center justify-center rounded text-neutral-100 bg-indigo-600 p-2' onClick={() => focusOnLocation(userCoordinate)}><FontAwesomeIcon icon={faLocationCrosshairs}/></button>
                    <p>Lokasi kamu</p>
                    {userCoordinate && <span>{userCoordinate[0] || 0}, {userCoordinate[1] || 0}</span>}
                    <button className='flex items-center justify-center rounded text-neutral-100 px-2 py-1 bg-indigo-600 min-h-[32px] mt-auto' onClick={getCurrentLocation}>
                        {loadingUserCoor ? <LoadingSvg /> : <span>Segarkan</span>}
                    </button>
                </div>
            </div>
        </div>
    )
}