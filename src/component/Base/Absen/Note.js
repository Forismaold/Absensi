import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDoorClosed, faDoorOpen, faNoteSticky } from '@fortawesome/free-solid-svg-icons'
import { formatBeautyDate } from '../../../utils'
import { useSelector } from 'react-redux'

export default function Note() {
    const absensi = useSelector(state => state.source.absensi)
    if (!absensi) return null
    return <div className='flex flex-col'>
        <div className='p-2'>
            <p className='text-xl font-semibold'>{absensi.title} <span className='text-sm font-normal'>oleh {absensi.openedBy}</span></p>
        </div>
        {!absensi.status && <div className='p-2 rounded bg-red-300'>Absensi belum dibuka sama admin</div>}
        <div className="flex flex-col gap-2 p-2 text-neutral-500">
            <div className='flex flex-wrap justify-between'>
                <div className='flex gap-2'>
                    <FontAwesomeIcon icon={absensi?.status ? faDoorOpen : faDoorClosed}/>
                    {absensi?.status ?
                        <p>dibuka sejak</p>
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
    </div>
}