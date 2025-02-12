import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUserCoordinate } from "../../../../redux/coordinates"
import LoadingIcon from "../../../utils/LoadingIcon"

export function AbsenceStandar() {
    // const showMap = useSelector(state => state.source.showMap)
    // const userCoordinate = useSelector(state => state.coordinates.user)

    const [loadingUserCoor, setLoadingUserCoor] = useState(false)
    const focusOnLocation = useSelector(state => state.map.focusOnLocation)

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
                    enableHighAccuracy: true,
                    maximumAge: 0,
                }
            )
        } else {
            alert('Geolocation tidak didukung browsermu.')
            setLoadingUserCoor(false)
        }
    },[dispatch, focusOnLocation])

    return <div className="flex flex-col">
        <button className='flex flex-1 shadow-lg shadow-primary/50 items-center justify-center rounded text-neutral-100 px-2 click-animation bg-secondary min-h-[32px] mt-auto' onClick={getCurrentLocation}>
            {loadingUserCoor ?
                <LoadingIcon/>
            :
                <span>Absen</span>
            }
        </button>
    </div>
}

export function AbsenceWatch() {
    const [isWatchPosition, setisWatchPosition] = useState(false)
    const userCoordinate = useSelector(state => state.coordinates.user)
    const focusOnLocation = useSelector(state => state.map.focusOnLocation)

    const [intervalWatchId, setIntervalWatchId] = useState(null)

    const dispatch = useDispatch()

    function handleWatchPosition() {
        if (isWatchPosition) {
            console.log('watch position shutting down')
            navigator.geolocation.clearWatch(intervalWatchId)
            setisWatchPosition(false)
            setIntervalWatchId(false)
        } else {
            console.log('watch position power up')
            getCurrentLocation()
            setisWatchPosition(true)
        }
    }

    function getCurrentLocation() {
        if ('geolocation' in navigator) {
            const successCallback = (position) => {
                const { latitude, longitude } = position.coords
                dispatch(setUserCoordinate([latitude,longitude]))
                console.log('watched', [latitude,longitude])
                if (userCoordinate) focusOnLocation(userCoordinate)
            }
    
            const errorCallback = (error) => {
                console.log('Error getting geolocation', error)
            }
        
            const options = {
                enableHighAccuracy: true,
                maximumAge: 0,
            }
        
            const watchId = navigator.geolocation.watchPosition(
                successCallback,
                errorCallback,
                options
            )

            setIntervalWatchId(watchId)        
        } else {
            console.error('Geolocation is not supported by your browser')
        }
    }

    useEffect(() => {
        return () => navigator.geolocation.clearWatch(intervalWatchId)
    },[intervalWatchId])

    // useEffect(() => {
            // if ('geolocation' in navigator) {
            //     const successCallback = (position) => {
            //     const { latitude, longitude } = position.coords
            //     dispatch(setUserCoordinate([latitude,longitude]))
            //     if (userCoordinate) focusOnLocation(userCoordinate)
            // }
        
            // const errorCallback = (error) => {
            //     console.log('Error getting geolocation', error)
            // }
        
            // const options = {
            //     enableHighAccuracy: true,
            //     maximumAge: 0,
            // }
        
            // const watchId = navigator.geolocation.watchPosition(
            //     successCallback,
            //     errorCallback,
            //     options
            // )
        
            // return () => navigator.geolocation.clearWatch(watchId)
            // } else {
            //     console.error('Geolocation is not supported by your browser')
            // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // }, [dispatch])
    useEffect(() => {
        if ('geolocation' in navigator) {
        } else {
            console.error('Geolocation is not supported by your browser')
        }
        return () => navigator.geolocation.clearWatch(intervalWatchId)
    })

    return <div className="flex flex-col">
        <button className='flex flex-1 shadow-lg shadow-primary/50 items-center justify-center rounded text-neutral-100 px-2 click-animation bg-secondary min-h-[32px] mt-auto' onClick={handleWatchPosition}>
            {isWatchPosition ?
                <LoadingIcon/>
            :
                <span>Absen</span>
            }
        </button>
    </div>
}