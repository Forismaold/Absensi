import { useSelector } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons'

export default function Note() {
    const absensi = useSelector(state => state.source.absensi)

    if (!absensi?.note) return <p>Tidak ada catatan</p>
    return <div className="bg-secondary p-2 shadow-lg shadow-primary/50 text-neutral-200">
        <FontAwesomeIcon icon={faNoteSticky} className="pr-2"/>
        <span>{absensi.note}</span>
    </div>
}