import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight, faMosque, faPen, faQuestion, faSchool } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from 'react'
import Modal from '../../utils/Modal'
import { InfoCostumCoordinate } from '../Absen/InfoModals'
import { useSelector } from 'react-redux'
import { blankToast } from '../../utils/myToast'

const localCoordinates = {
    masjid: {
        first: '-7.482044510981448, 110.22200388577714',
        second: '-7.482209927696517, 110.22228020994946',
        center: '-7.482137557891397, 110.22213944103149',
    },
    smanaga: {
        first: '-7.4820215795622715, 110.2219734580599',
        second: '-7.482713015738791, 110.22282103612045',
        center: '-7.482137557891397, 110.22213944103149]',
    }
}

export default function AbsensiEditor({isOpen, onClose, callBack, submitText = 'Tambah', title = 'Dzuhur', note = '', coordinates = {}}) {
    const storeCoordinates = useSelector(state => state.coordinates)

    const [inputTitle, setInputTitle] = useState(title)
    const inputRef = useRef(null)
    const [inputNote, setInputNote] = useState(note)
    const [firstCoor, setFirstCoor] = useState(coordinates?.first || localCoordinates.masjid.first)
    const [secondCoor, setSecondCoor] = useState(coordinates?.second || localCoordinates.masjid.second)
    
    const [showDetail, setShowDetail] = useState(false)
    const [showQuestion, setShowQuestion] = useState(false)

    function handleInput(e) {
        setInputTitle(e.target.value)
    }

    function handleCallback() {

        let first = firstCoor.replace(' ', ''), second = secondCoor.replace(' ', ''), inputCoordinates = {}
        const regex = /^[-]?\d+(\.\d+)?,[-]?\d+(\.\d+)?$/
        if (firstCoor === '') {
            inputCoordinates.first = storeCoordinates.first
        } else {
            if (!regex.test(first)) return blankToast('Koordinat pertama tidak sesuai format')
            first = first.split(',').map(x => Number(x))
            inputCoordinates.first = first
        }
        if (secondCoor === '') {
            inputCoordinates.second = storeCoordinates.second
        } else {
            if (!regex.test(second)) return blankToast('Koordinat kedua tidak sesuai format')
            second = second.split(',').map(x => Number(x))
            inputCoordinates.second = second
        }
        callBack(inputTitle, inputNote, inputCoordinates)
    }

    return <Modal isOpen={isOpen} onClose={onClose}>
        <div className='text-neutral-500 flex flex-col gap-2 p-2'>
            <div className='flex flex-col'>
                <p className='flex-1'>Ketik judul absensi</p>
                <input autoFocus ref={inputRef} type="text" placeholder='Bawaan: Dzuhur' className='shadow-lg shadow-primary/50 border-secondary rounded focus:ring-primary text-neutral-700' onChange={handleInput} value={inputTitle} maxLength={50}/>
                <p className='flex-1 mt-2 click-animation cursor-pointer' onClick={() => setShowDetail(prev => !prev)}>Lainnya <FontAwesomeIcon icon={showDetail ? faChevronDown : faChevronRight}/></p>
                {showDetail && 
                <div className='flex flex-col gap-2'>
                    <div className="flex gap-2 flex-col">
                        <button className='flex items-center justify-center px-3 text-neutral-500 p-2 click-animation w-fit ml-auto' onClick={() => setShowQuestion(true)}><FontAwesomeIcon icon={faQuestion}/></button>
                        <div className='flex gap-2 flex-col sm:flex-row'>
                            <div className='flex items-center rounded shadow overflow-auto'>
                                <div onClick={() => {
                                    setFirstCoor(localCoordinates.masjid.first)
                                    setSecondCoor(localCoordinates.masjid.second)
                                }} className={`flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 ${firstCoor === localCoordinates.masjid.first && secondCoor === localCoordinates.masjid.second ? 'border-secondary text-secondary bg-quaternary' : 'border-transparent text-neutral-500 bg-neutral-200'}`}>
                                    <FontAwesomeIcon icon={faMosque}/> Masjid
                                </div>
                                <div onClick={() => {
                                    setFirstCoor(localCoordinates.smanaga.first)
                                    setSecondCoor(localCoordinates.smanaga.second)
                                }} className={`flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 ${firstCoor === localCoordinates.smanaga.first && secondCoor === localCoordinates.smanaga.second ? 'border-secondary text-secondary bg-quaternary' : 'border-transparent text-neutral-500 bg-neutral-200'}`}>
                                    <FontAwesomeIcon icon={faSchool}/> SMANAGA
                                </div>
                                <div onClick={() => {
                                    setFirstCoor('')
                                    setSecondCoor('')
                                }} className={`flex flex-1 px-4 items-center py-2 gap-2 click-animation border-b-2 border-transparent ${(firstCoor !== localCoordinates.masjid.first && secondCoor !== localCoordinates.masjid.second) && (firstCoor !== localCoordinates.smanaga.first && secondCoor !== localCoordinates.smanaga.second) ? 'border-secondary text-secondary bg-quaternary' : 'border-transparent text-neutral-500 bg-neutral-200'}`}>
                                    <FontAwesomeIcon icon={faPen}/> Kostum
                                </div>
                            </div>
                            <input disabled={(firstCoor === localCoordinates.masjid.first && secondCoor === localCoordinates.masjid.second) || (firstCoor === localCoordinates.smanaga.first && secondCoor === localCoordinates.smanaga.second)} type="text" placeholder='Koordinat pertama' className='flex-1 shadow-lg shadow-primary/50 border-secondary rounded focus:ring-primary text-neutral-700' onChange={e => setFirstCoor(e.target.value)}  value={firstCoor}/>
                            <input disabled={(firstCoor === localCoordinates.masjid.first && secondCoor === localCoordinates.masjid.second) || (firstCoor === localCoordinates.smanaga.first && secondCoor === localCoordinates.smanaga.second)} type="text" placeholder='Koordinat kedua' className='flex-1 shadow-lg shadow-primary/50 border-secondary rounded focus:ring-primary text-neutral-700' onChange={e => setSecondCoor(e.target.value)}  value={secondCoor}/>
                        </div>
                    </div>
                    <textarea className='shadow-lg shadow-primary/50 border-secondary rounded focus:ring-primary text-neutral-700' placeholder='Ketik catatan' onChange={e => setInputNote(e.target.value)} value={inputNote}/>
                </div>
                }
            </div>
            <div onClick={handleCallback} className={`flex-1 bg-secondary shadow-secondary/50 text-neutral-200 p-2 click-animation rounded flex justify-center shadow cursor-pointer hover:shadow-xl duration-300 hover:-translate-y-1`}>
                <span>{submitText}</span>
            </div>
        </div>
        <InfoCostumCoordinate isOpen={showQuestion} onClose={() => setShowQuestion(false)}/>
    </Modal>
}