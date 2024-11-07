import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

export default function ReminderWrongGrade() {
    const absensi = useSelector(state => state.source.absensi)
    const account = useSelector(state => state.source.account)

    if (!absensi) return

    if (absensi?.allowedGrades.includes(account?.kelas)) return
    
    return <div className="flex flex-col gap-2 items-start justify-start bg-yellow-300/50 text-yellow-700 rounded p-2">
        <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faTriangleExclamation}/>
            <p>Perhatikan bahwa absensi ini untuk angkatan kelas {absensi?.allowedGrades?.join(', ') || ''} sedangkan data di akun kamu menunjukkan kelas {account?.kelas}{account?.nomorKelas}</p>
        </div>
        <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faTriangleExclamation}/>
            <p>Silahkan edit data info kamu di halaman <Link to={'/akun'} className="underline cursor-pointer">akun</Link></p>
        </div>
    </div>
}