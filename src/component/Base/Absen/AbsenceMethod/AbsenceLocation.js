import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars, faBolt, faQuestion, faRotate } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useState } from 'react'
import LoadingIcon from '../../../utils/LoadingIcon'
import { useDispatch, useSelector } from 'react-redux'
import { setUserCoordinate } from '../../../../redux/coordinates'
import WatchPosition from './WatchPosition'
import { setIsWatchPosition } from '../../../../redux/source'
import { InfoAutoSubmit } from '../InfoModals'

export default function AbsenceLocation() {
    const isWatchPosition = useSelector(state => state.source.isWatchPosition)
    const account = useSelector(state => state.source.account)
    // const userCoordinate = useSelector(state => state.coordinates.user)
    const focusOnLocation = useSelector(state => state.map.focusOnLocation)

    const [loadingUserCoor, setLoadingUserCoor] = useState(false)
    const [toggleHighAccuracy, setToggleHighAccuracy] = useState(true)
    const [showHowToUseAutoAbsence, setShowHowToUseAutoAbsence] = useState(false)

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

    // useEffect(() => {
    //     if (!userCoordinate) getCurrentLocation()
    // },[getCurrentLocation, userCoordinate])

    return <div className="flex flex-col gap-2 rounded-xl p-2 shadow-lg shadow-primary/50">
        <div className='flex gap-2 items-center justify-between'>
            <p>Kirim lokasi sebagai {account?.panggilan || account?.nama}</p>
            <button className='flex items-center justify-center px-3 text-neutral-500 p-2 click-animation' onClick={() => setShowHowToUseAutoAbsence(true)}><FontAwesomeIcon icon={faQuestion}/></button>
        </div>
        <div className='flex gap-2 py-1 mt-auto'>
            {isWatchPosition ? <WatchPosition onClose={() => dispatch(setIsWatchPosition(false))} toggleHighAccuracy={toggleHighAccuracy} focusOnLocation={focusOnLocation}/> : 
                <>
                <button className={`flex flex-1 gap-2 shadow-lg px-2 shadow-primary/50 justify-center items-center rounded text-neutral-500 click-animation bg-neutral-200 min-h-[32px] mt-auto border-2 border-primary border-solid`} onClick={() => dispatch(setIsWatchPosition(true))} title='Mulai pemindaian lokasi'>
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
        </div>
        <InfoAutoSubmit isOpen={showHowToUseAutoAbsence} onClose={() => setShowHowToUseAutoAbsence(false)}/>
    </div>
}