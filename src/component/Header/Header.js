import revIcon from '../../assets/forisma.webp'
import Navbar from '../Navbar/Navbar'

export default function Header() {
    

    return <header className="flex gap-2 items-center w-full justify-between">
        <img src={revIcon} alt="aaa" className="w-16 h-16"/>
        <div className="flex flex-col">
            <h4 className="font-montserrat text-neutral-100 font-extrabold text-3xl">For IS MA.</h4>
            <span className="text-neutral-200 text-[8px]">(untuk presensi siswa muslim SMA 3 Magelang)</span>
        </div>
        <Navbar/>
    </header>
}