import revIcon from '../../assets/forisma.webp'
import { setProMode } from "../../redux/source"
import { useDispatch, useSelector } from "react-redux"

export default function Header() {
    const proMode = useSelector(state => state.source.proMode)
    const dispatch = useDispatch()

    return <header className="flex gap-2 items-center w-full">
        <img src={revIcon} alt="aaa" className="w-16 h-16"/>
        <div className="flex flex-col">
            <h4 className="font-montserrat text-neutral-100 font-extrabold text-3xl">For IS MA.</h4>
            <span className="text-neutral-200 text-[8px]">(untuk presensi siswa muslim SMA 3 Magelang)</span>
        </div>
        <span onClick={() => dispatch(setProMode(!proMode))} className="p-2 px-4 rounded-md shadow text-neutral-200 cursor-pointer">{proMode ? 'Pro' : 'Lite'}</span>
    </header>
}