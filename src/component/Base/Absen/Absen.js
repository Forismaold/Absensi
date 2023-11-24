import { useRef } from 'react'
import { MapContainer, Marker, Rectangle, TileLayer, Tooltip } from 'react-leaflet'
import { useSelector } from 'react-redux'
import Note from './Note'
import UserAbsenceStatus from './UserAbsenceStatus'
import UserLocation from './UserLocation'
import AreaLocation from './AreaLocation'

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
                <AreaLocation focusOnLocation={() => focusOnLocation(firstCoordinate)}/>
                <UserLocation focusOnLocation={focusOnLocation} focusUserLocation={focusUserLocation}/>
            </div>
        </div>
    )
}