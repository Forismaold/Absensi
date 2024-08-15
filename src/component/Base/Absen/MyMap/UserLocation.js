import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faInfo, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useState } from 'react'
// import LoadingIcon from '../../utils/LoadingIcon'
import { useDispatch, useSelector } from 'react-redux'
import { InfoCommonProblem } from '../InfoModals'
import { setUserCoordinate } from '../../../../redux/coordinates'
import LoadingIcon from '../../../utils/LoadingIcon'

export default function UserLocation({focusUserLocation, focusOnLocation}) {
    const showMap = useSelector(state => state.source.showMap)
    const userCoordinate = useSelector(state => state.coordinates.user)

    const [loadingUserCoor, setLoadingUserCoor] = useState(false)
    const [toggleHighAccuracy, setToggleHighAccuracy] = useState(true)
    const [showCommonProblem, setShowCommonProblem] = useState(false)

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
    },[dispatch, focusOnLocation, toggleHighAccuracy])

    // useEffect(() => {
    //     if (!userCoordinate) getCurrentLocation()
    // },[getCurrentLocation, userCoordinate])

    return <div className='relative flex flex-1 flex-col shadow-md bg-neutral-300/50 rounded-xl p-2 gap-2'>
        <div className='flex gap-2 items-center'>
            <p className='flex flex-1'>Lokasi kamu</p>
            <button className='flex items-center justify-center px-3 text-neutral-500 p-2 click-animation' onClick={() => setShowCommonProblem(true)}><FontAwesomeIcon icon={faInfo}/></button>
            {showMap && <button className={`flex items-center justify-center rounded-lg ${userCoordinate ? ' bg-secondary shadow-primary/50 shadow-lg text-neutral-100' : ' bg-primary-quarternary text-transparent'} p-2 click-animation`} onClick={focusUserLocation}><FontAwesomeIcon icon={faLocationCrosshairs}/></button>}
        </div>
        {/* <span>{userCoordinate ? `${userCoordinate[0]}, ${userCoordinate[1]}` : '0, 0'}</span> */}
        {/* <div className='flex gap-2 py-1 mt-auto'>
            {isWatchPosition ? <WatchPosition onClose={() => dispatch(setIsWatchPosition(false))} toggleHighAccuracy={toggleHighAccuracy} focusOnLocation={focusOnLocation}/> : 
                <>
                <button className={`flex flex-1 gap-2 shadow-lg px-2 shadow-primary/50 justify-center items-center rounded text-neutral-500 click-animation bg-neutral-200 min-h-[32px] mt-auto border-2 border-primary border-solid text-primary`} onClick={() => dispatch(setIsWatchPosition(true))} title='Mulai pemindaian lokasi'>
                    <FontAwesomeIcon icon={faBinoculars}/>
                    <span>Mulai</span>
                </button>
                <button className={`flex shadow-lg shadow-primary/50 items-center justify-center rounded text-neutral-100 px-2 click-animation bg-secondary min-h-[32px] mt-auto`} onClick={getCurrentLocation} title='Segarkan lokasi'>
                    {loadingUserCoor ? <LoadingIcon /> : <FontAwesomeIcon icon={faRotate}/>}
                </button>
                </>
            }
            <button className={`flex shadow-lg px-2 shadow-accent/50 justify-center items-center rounded ${toggleHighAccuracy ? 'text-neutral-700 bg-accent' : 'text-neutral-500 bg-neutral-200'} click-animation min-h-[32px] mt-auto`} onClick={() => setToggleHighAccuracy(prev => !prev)} title='Akurasi tinggi'>
                <FontAwesomeIcon icon={faBolt}/>
            </button>
        </div> */}
        <div className='flex gap-2'>
            <div onClick={getCurrentLocation} className='flex flex-1 shadow-lg shadow-primary/50 items-center justify-center rounded text-neutral-100 px-2 click-animation bg-secondary min-h-[32px] mt-auto'>
                {loadingUserCoor ?
                    <LoadingIcon/>
                :
                    <span>Dapatkan koordinat</span>
                    
                }
            </div>
            <div className={`flex shadow-lg px-2 shadow-accent/50 justify-center items-center rounded ${toggleHighAccuracy ? 'text-neutral-700 bg-accent' : 'text-neutral-500 bg-neutral-200'} click-animation min-h-[32px] mt-auto cursor-pointer`} onClick={() => setToggleHighAccuracy(prev => !prev)} title='Akurasi tinggi'>
                <FontAwesomeIcon icon={faBolt}/>
            </div>
        </div>
        <InfoCommonProblem isOpen={showCommonProblem} onClose={() => setShowCommonProblem(false)}/>
    </div>
}
