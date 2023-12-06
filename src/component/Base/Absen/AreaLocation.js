import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export default function AreaLocation({focusOnLocation}) {
    const firstCoordinate = useSelector(state => state.coordinates.first)
    const secondCoordinate = useSelector(state => state.coordinates.second)
    const showMap = useSelector(state => state.source.showMap)

    const [showLocation, setShowLocation] = useState(false)
    const [showCoordinate, setShowCoordinate] = useState(false)

    return <div className='flex flex-1 flex-col shadow-md rounded-xl bg-neutral-300/50 p-2 h-fit'>
        <div className='flex gap-2'>
            <button className='flex flex-1 items-center justify-center rounded-lg text-neutral-500 duration-200 ease-in-out active:scale-95 justify-between' onClick={() => setShowLocation(prev => !prev)}><span>Lokasi absen {showCoordinate && 'diantara'}</span> <FontAwesomeIcon icon={showLocation ? faChevronDown : faChevronRight} className='px-3'/></button>
            {showMap && <button className='flex items-center justify-center rounded-lg text-neutral-200 bg-secondary p-2 shadow-lg shadow-primary/50 duration-200 ease-in-out active:scale-95' onClick={focusOnLocation}><FontAwesomeIcon icon={faLocationCrosshairs}/></button>}
        </div>
        {showLocation &&
            <div onClick={() => setShowCoordinate(prev => !prev)} className='flex-1 cursor-pointer duration-200 ease-in-out active:scale-95'>
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
        }
    </div>
}