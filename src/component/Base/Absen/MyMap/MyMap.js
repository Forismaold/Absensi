import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight, faMap } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef } from 'react'
import { MapContainer, Marker, Rectangle, TileLayer, Tooltip } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'
import UserLocation from './UserLocation'
import AreaLocation from './AreaLocation'
import { toggleShowMap } from '../../../../redux/source'
import { setFocusOnLocation } from '../../../../redux/map'
import { formatBeautyDate } from '../../../../utils'

export default function MyMap() {
    const absensi = useSelector(state => state.source.absensi)
    const firstCoordinate = useSelector(state => state.source.absensi?.coordinates?.first) ?? [0, 0]
    const secondCoordinate = useSelector(state => state.source.absensi?.coordinates?.second) ?? [0, 0]
    const centerCoordinate = useSelector(state => state.source.absensi?.coordinates?.first) ?? [0, 0]
    const userCoordinate = useSelector(state => state.coordinates.user)
    const showMap = useSelector(state => state.source.showMap)
    const status = useSelector(state => state.source.status)

    const mapRef = useRef(null)
    const dispatch = useDispatch()

    const focusOnLocation = (location) => {
        const map = mapRef.current
        map && map?.flyTo(location, map.getZoom())
    }

    useEffect(() => {
        dispatch(setFocusOnLocation(focusOnLocation))
        
        return () => {
            dispatch(setFocusOnLocation(null))
        }
    }, [dispatch])
    

    function focusUserLocation() {
        if (userCoordinate) focusOnLocation(userCoordinate)
    }

    return (
        <div className='flex flex-col gap-2'>
            {absensi && <>
            <div className='flex flex-col bg-neutral-300/50 rounded-xl overflow-hidden'>
                <div className='flex gap-2 p-2 text-neutral-500' onClick={() => dispatch(toggleShowMap())}>
                    <button className='flex flex-1 items-center justify-between px-2'>
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faMap}/>
                            <span>Peta</span> 
                        </div>
                        <FontAwesomeIcon icon={showMap ? faChevronDown : faChevronRight}/>
                    </button>
                </div>
                {showMap && 
                    <>
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
                        {status &&
                            <Marker position={status?.koordinat ? status.koordinat : [0,0]}>
                                <Tooltip permanent>
                                    {status?.user?.nama} absen pada {formatBeautyDate(status?.waktuAbsen)}
                                </Tooltip>
                            </Marker>
                        }
                        <Marker position={userCoordinate? userCoordinate : [0,0]}>
                            <Tooltip>
                                Lokasi kamu disini
                            </Tooltip>
                        </Marker>
                    </MapContainer>
                    <AreaLocation focusOnLocation={() => focusOnLocation(firstCoordinate)}/>
                    </>
                }
            </div>
            {status?.absen === true || status?.absen === false ? null : 
                <div className='flex gap-2 flex-wrap mt-2 flex-col md:flex-row'>
                    <UserLocation focusOnLocation={focusOnLocation} focusUserLocation={focusUserLocation}/>
                </div>
            }
            </>}
        </div>
    )
}