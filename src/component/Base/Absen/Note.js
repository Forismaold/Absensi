import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDoorClosed, faDoorOpen, faNoteSticky } from '@fortawesome/free-solid-svg-icons'
import { formatBeautyDate } from '../../../utils'

export default function Note({absensi}) {
    if (!absensi) return null
    return <div className="flex flex-col gap-2 bg-neutral-300 p-2 shadow-lg shadow-neutral-300/50 text-neutral-500">
        <div className='flex flex-wrap justify-between'>
            <div className='flex gap-2'>
                <FontAwesomeIcon icon={absensi?.status ? faDoorOpen : faDoorClosed}/>
                {absensi?.status ?
                    <p>{absensi?.title} dibuka sejak</p>
                    :
                    <p>Terakhir ditutup</p>
                }
            </div>
            <span>{formatBeautyDate(absensi?.date)}</span>
        </div>
        {absensi?.note && <div>
                <FontAwesomeIcon icon={faNoteSticky} className="pr-2"/>
                <span>{absensi?.note}</span>
            </div>
        }
    </div>
}