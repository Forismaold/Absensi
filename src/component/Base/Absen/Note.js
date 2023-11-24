import { useSelector } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons'

export default function Note() {
    const absensi = useSelector(state => state.source.absensi)

    if (!absensi?.note) return null
    return <div className="bg-neutral-300 p-2 shadow-lg shadow-neutral-300/50 text-neutral-500">
        <FontAwesomeIcon icon={faNoteSticky} className="pr-2"/>
        <span>{absensi.note}</span>
    </div>
}