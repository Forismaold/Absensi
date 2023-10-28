import { useEffect, useState } from 'react'
import { MapContainer, Marker, Rectangle, TileLayer, Tooltip } from 'react-leaflet'
import LoadingSvg from '../utils/LoadingIcon'

const first = [-7.4822300,  110.2220029]
const second = [-7.4820399, 110.2222523]

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

    function getCurrentLocation(callback) {
        if (navigator.geolocation) {
            setLoadingUserCoor(true)
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    const value = [latitude, longitude]
                    callback(value)
                    setLoadingUserCoor(false)
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

    useEffect(() => {
        getCurrentLocation(setUserCoor)
    },[firstCoordinate])

    return (
        <div>
            <MapContainer center={firstCoordinate} style={{ height: '20rem', width: '100%' }} zoom={18} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
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
                <div className='flex flex-1 flex-col shadow rounded p-2'>
                        <p>Lokasi absen</p>
                        <span>{firstCoordinate[0] || ''}, {firstCoordinate[1] || ''}</span>
                        <span>{secondCoordinate[0] || ''}, {secondCoordinate[1] || ''}</span>
                </div>
                <div className='flex flex-1 flex-col shadow rounded p-2'>
                    <p>Lokasi kamu</p>
                    <span>{userCoor[0]}, {userCoor[1]}</span>
                    
                    <button className='flex items-center justify-center rounded text-neutral-100 px-2 py-1 bg-indigo-600' onClick={() => getCurrentLocation(setUserCoor)}>
                        {loadingUserCoor? <LoadingSvg/>:<span>Segarkan</span>}
                    </button>
                </div>
            </div>
        </div>
    )
}