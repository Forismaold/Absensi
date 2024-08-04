import { useSelector } from "react-redux"

export default function StatusAbsensi({ message }) {
    const absensi = useSelector(state => state.source.absensi)

    if (absensi?.status) return

    if (absensi?.status === false) return <div className='border border-primary text-primary rounded-xl p-4 flex gap-2 items-center relative'>
        <p>Absensi {absensi?.title} oleh {absensi.openedBy} belum dibuka!</p>
    </div>

    return <div className='border border-primary text-primary rounded-xl p-4 flex gap-2 items-center relative'>
        {!absensi && <p>{message}</p>}
    </div>
}