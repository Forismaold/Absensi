import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, Rectangle, TileLayer } from 'react-leaflet'

export default function Absen() {
    return <div className="">
        <p>ini halaman absen</p>
        <MyMap/>
    </div>
}

const MyMap = () => {
    const [firstCoordinate, setFirstCoordinate] = useState([-7.4825645,  110.2221515])
    const [secondCoordinate, setSecondCoordinate] = useState([-7.4822054, 110.2221904])
    const [center, setcenter] = useState([-7.4825645,  110.2221515])

    function getCurrentLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    const value = [latitude, longitude]
                    callback(value)
                },
                (error) => {
                    console.error('Error getting location:', error)
                }
            )
        } else {
            alert('Geolocation is not supported by your browser.')
        }
    }

    useEffect(() => {
        console.log(firstCoordinate)
    },[firstCoordinate])
  
    return (
        <div>
            <MapContainer center={firstCoordinate} style={{ height: '20rem', width: '100%' }} zoom={22} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Rectangle
                bounds={[firstCoordinate, secondCoordinate]}
                color="blue"
                fillOpacity={0.5}
                />
                <Marker position={center}>
                    <Popup>
                        Lokasimu
                    </Popup>
                </Marker>
            </MapContainer>
            <div className='flex gap-2 flex-wrap mt-2 flex-col md:flex-row'>
                <div className='flex flex-1 flex-col shadow rounded p-2'>
                    <p>First</p>
                    <span>{firstCoordinate[0] || ''}, {firstCoordinate[1] || ''}</span>
                    <button className='rounded text-neutral-100 px-2 py-1 bg-indigo-600' onClick={() => getCurrentLocation(setFirstCoordinate)}>Refresh</button>
                </div>
                <div className='flex flex-1 flex-col shadow rounded p-2'>
                    <p>Center</p>
                    <span>{center[0]}, {center[1]}</span>
                    <button className='rounded text-neutral-100 px-2 py-1 bg-indigo-600' onClick={() => getCurrentLocation(setcenter)}>Refresh</button>
                </div>
                <div className='flex flex-1 flex-col shadow rounded p-2'>
                    <p>Second</p>
                    <span>{secondCoordinate[0]}, {secondCoordinate[1]}</span>
                    <button className='rounded text-neutral-100 px-2 py-1 bg-indigo-600' onClick={() => getCurrentLocation(setSecondCoordinate)}>Refresh</button>
                </div>
            </div>
        </div>
    )
}