import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from 'react'
import Modal from '../../utils/Modal'

export default function AbsensiEditor({isOpen, onClose, callBack, submitText = 'Tambah', title = 'Dzuhur', note = ''}) {
    const [inputTitle, setInputTitle] = useState(title)
    const inputRef = useRef(null);
    const [showNote, setShowNote] = useState(false)
    const [inputNote, setInputNote] = useState(note)

    function handleInput(e) {
        setInputTitle(e.target.value)
    }

    function handleCallback() {
        callBack(inputTitle, inputNote)
    }

    return <Modal isOpen={isOpen} onClose={onClose}>
        <div className='text-neutral-500 flex flex-col gap-2 p-2'>
            <div className='flex flex-col'>
                <p className='flex-1'>Ketik judul absensi</p>
                <input autoFocus ref={inputRef} type="text" placeholder='Bawaan: Dzuhur' className='shadow-lg shadow-primary/50 border-secondary rounded focus:ring-primary' onChange={handleInput} value={inputTitle} maxLength={20}/>
                <p className='flex-1 mt-2 click-animation cursor-pointer' onClick={() => setShowNote(prev => !prev)}>Tambahkan catatan <FontAwesomeIcon icon={showNote ? faChevronDown : faChevronRight}/></p>
                {showNote && <textarea className='shadow-lg shadow-primary/50 border-secondary rounded focus:ring-primary' placeholder='Ketik catatan' onChange={e => setInputNote(e.target.value)} value={inputNote}/>}
            </div>
            <div onClick={handleCallback} className={`flex-1 bg-secondary shadow-lg shadow-secondary/50 text-neutral-200 p-2 click-animation rounded flex justify-center shadow cursor-pointer hover:shadow-xl duration-300 hover:-translate-y-1`}>
                <span>{submitText}</span>
            </div>
        </div>
    </Modal>
}