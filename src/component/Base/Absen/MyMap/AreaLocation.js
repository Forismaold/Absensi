import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export default function AreaLocation({focusOnLocation}) {
    const showMap = useSelector(state => state.source.showMap)

    const [showLocation, setShowLocation] = useState(false)
    const [showCoordinate, setShowCoordinate] = useState(false)

    return <div className='flex flex-1 flex-col shadow-md rounded-xl p-2 h-fit'>
        <div className='flex gap-2'>
            <button className='flex flex-1 items-center rounded-lg text-neutral-500 click-animation justify-between' onClick={() => setShowLocation(prev => !prev)}><span>Lokasi absen {showCoordinate && 'diantara'}</span> <FontAwesomeIcon icon={showLocation ? faChevronDown : faChevronRight} className='px-3'/></button>
            {showMap && <button className='flex items-center justify-center rounded-lg text-neutral-200 bg-secondary p-2 shadow-lg shadow-primary/50 click-animation' onClick={focusOnLocation}><FontAwesomeIcon icon={faLocationCrosshairs}/></button>}
        </div>
        {showLocation &&
            <div onClick={() => setShowCoordinate(prev => !prev)} className='flex-1 cursor-pointer click-animation'>
                <span>Dekat Jl. Medang No.17, Rejowinangun Utara, Kec. Magelang Tengah, Kota Magelang, Jawa Tengah 56127</span>
            </div>
        }
    </div>
}