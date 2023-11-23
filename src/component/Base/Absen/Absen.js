import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from 'react'
import { MapContainer, Marker, Rectangle, TileLayer, Tooltip } from 'react-leaflet'
import { useSelector } from 'react-redux'
import Note from './Note'
import UserAbsenceStatus from './UserAbsenceStatus'
import UserLocation from './UserLocation'

export default function Absen() {
    return <div className={'flex flex-col gap-2'}>
        <p>ini halaman absen</p>
        <MyMap/>
        <UserAbsenceStatus/>
        <Note/>
    </div>
}

const MyMap = () => {
    const firstCoordinate = useSelector(state => state.coordinates.first)
    const secondCoordinate = useSelector(state => state.coordinates.second)
    const centerCoordinate = useSelector(state => state.coordinates.center)
    const userCoordinate = useSelector(state => state.coordinates.user)

    const [showCoordinate, setShowCoordinate] = useState(false)

    const mapRef = useRef(null)

    const focusOnLocation = (location) => {
        const map = mapRef.current
        map && map?.flyTo(location, map.getZoom())
    }

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
                <UserLocation focusOnLocation={focusOnLocation} focusUserLocation={focusUserLocation}/>
            </div>
        </div>
    )
}