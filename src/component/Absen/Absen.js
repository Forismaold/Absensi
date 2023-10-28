import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Rectangle, TileLayer, Tooltip } from 'react-leaflet'
import LoadingSvg from '../utils/LoadingIcon'
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'

const first = [-7.4822300,  110.2220029]
const second = [-7.4820399, 110.2222523]
const center = [-7.4821396, 110.2221400]

export default function Absen() {
    return <div className="">
        <p>ini halaman absen</p>
        <MyMap/>
    </div>
}

const MyMap = () => {
    const [firstCoordinate, ] = useState(first)
    const [secondCoordinate, ] = useState(second)
    const [userCoor, setUserCoor] = useState([0,0])
    const [loadingUserCoor, setLoadingUserCoor] = useState(false)
    const [showCoordinate, setShowCoordinate] = useState(false)

    const mapRef = useRef(null)

    function getCurrentLocation(callback) {
        if (navigator.geolocation) {
            setLoadingUserCoor(true)
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    const value = [latitude, longitude]
                    callback(value)
                    setLoadingUserCoor(false)
                    mapRef.current?.flyTo(value, mapRef.current.getZoom())
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
    }

    const focusOnLocation = (location) => {
        const map = mapRef.current
        map && map?.flyTo(location, map.getZoom())
    }

    useEffect(() => {
        getCurrentLocation(setUserCoor)
    },[firstCoordinate])

    return (
        <div>
            <MapContainer ref={mapRef} center={center} style={{ height: '20rem', width: '100%' }} zoom={18} scrollWheelZoom={false}>
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
                <Marker position={userCoor}>
                    <Tooltip>
                        Lokasi kamu disini
                    </Tooltip>
                </Marker>
            </MapContainer>
            <div className='flex gap-2 flex-wrap mt-2 flex-col md:flex-row'>
                <div className='relative flex flex-1 flex-col shadow rounded p-2'>
                <button className='absolute top-1 right-1 flex items-center justify-center rounded text-neutral-100 bg-indigo-600 p-2' onClick={() => focusOnLocation(firstCoordinate)}><FontAwesomeIcon icon={faLocationCrosshairs}/></button>
                    <p>Lokasi absen</p>
                    <div onClick={() => setShowCoordinate(prev => !prev)}>
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
                <div className='relative flex flex-1 flex-col shadow rounded p-2'>
                    <button className='absolute top-1 right-1 flex items-center justify-center rounded text-neutral-100 bg-indigo-600 p-2' onClick={() => focusOnLocation(userCoor)}><FontAwesomeIcon icon={faLocationCrosshairs}/></button>
                    <p>Lokasi kamu</p>
                    <span>{userCoor[0]}, {userCoor[1]}</span>
                    <button className='flex items-center justify-center rounded text-neutral-100 px-2 py-1 bg-indigo-600 min-h-[32px] mt-auto' onClick={() => {
                        getCurrentLocation(setUserCoor)
                        focusOnLocation(userCoor)
                    }}>
                        {loadingUserCoor ? <LoadingSvg /> : <span>Segarkan</span>}
                    </button>
                </div>
            </div>
        </div>
    )
}