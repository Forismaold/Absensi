import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars, faBolt, faInfo, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from 'react'
import LoadingIcon from '../../utils/LoadingIcon'
import { useDispatch, useSelector } from 'react-redux'
import { setUserCoordinate } from '../../../redux/coordinates'
import InfoAboutUserCoordinate from './InfoAboutUserCoordinate'
import WatchPosition from './WatchPosition'
import { setIsWatchPosition } from '../../../redux/source'

export default function UserLocation({focusUserLocation, focusOnLocation}) {
    const isWatchPosition = useSelector(state => state.source.isWatchPosition)
    const userCoordinate = useSelector(state => state.coordinates.user)

    const [loadingUserCoor, setLoadingUserCoor] = useState(false)
    const [toggleHighAccuracy, setToggleHighAccuracy] = useState(false)
    const [showUserCoordinateTutorial, setShowUserCoordinateTutorial] = useState(false)

    const dispatch = useDispatch()

    const getCurrentLocation = useCallback(() => {
        if (isWatchPosition) return null
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
    },[dispatch, focusOnLocation, isWatchPosition, toggleHighAccuracy])

    useEffect(() => {
        if (!userCoordinate) getCurrentLocation()
    },[getCurrentLocation, userCoordinate])

    return <div className='relative flex flex-1 flex-col shadow-md bg-neutral-300/50 rounded-xl p-2'>
        <div className='flex gap-2 items-center'>
            <p className='flex flex-1'>Lokasi kamu</p>
            <button className='flex items-center justify-center px-3 text-neutral-500 p-2 duration-200 ease-in-out active:scale-95' onClick={() => setShowUserCoordinateTutorial(true)}><FontAwesomeIcon icon={faInfo}/></button>
            <button className={`flex items-center justify-center rounded-lg text-neutral-100 ${userCoordinate ? ' bg-secondary' : ' bg-primary-quarternary'} p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95`} onClick={focusUserLocation}><FontAwesomeIcon icon={faLocationCrosshairs}/></button>
        </div>
        <span>{userCoordinate ? `${userCoordinate[0]}, ${userCoordinate[1]}` : '0, 0'}</span>
        <div className='flex gap-2 py-1 mt-auto'>
            {isWatchPosition ? <WatchPosition onClose={() => dispatch(setIsWatchPosition(false))} toggleHighAccuracy={toggleHighAccuracy} focusOnLocation={focusOnLocation}/> : 
                <>
                <button className={`flex shadow-lg px-2 shadow-primary/50 justify-center items-center rounded text-neutral-500 duration-200 ease-in-out active:scale-95 bg-neutral-200 min-h-[32px] mt-auto`} onClick={() => setIsWatchPosition(true)} title='Akurasi tinggi'>
                    <FontAwesomeIcon icon={faBinoculars}/>
                </button>
                <button className={`flex flex-1 shadow-lg shadow-primary/50 items-center justify-center rounded text-neutral-100 px-2 duration-200 ease-in-out active:scale-95 bg-secondary min-h-[32px] mt-auto`} onClick={getCurrentLocation} title='Akurasi sedang'>
                    {loadingUserCoor ? <LoadingIcon /> : <span>{isWatchPosition ? 'Posisi menonton' : 'Segarkan'}</span>}
                </button>
                </>
            }
            <button className={`flex shadow-lg px-2 shadow-accent/50 justify-center items-center rounded ${toggleHighAccuracy ? 'text-neutral-700 bg-accent' : 'text-neutral-500 bg-neutral-200'} duration-200 ease-in-out active:scale-95 min-h-[32px] mt-auto`} onClick={() => setToggleHighAccuracy(prev => !prev)} title='Akurasi tinggi'>
                {loadingUserCoor ? <LoadingIcon /> : <FontAwesomeIcon icon={faBolt}/>}
            </button>
        </div>
        <InfoAboutUserCoordinate isOpen={showUserCoordinateTutorial} onClose={() => setShowUserCoordinateTutorial(false)}/>
    </div>
}