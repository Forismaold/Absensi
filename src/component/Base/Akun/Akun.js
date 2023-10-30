import { useState } from "react"
import { useEffect } from "react"
import { useSelector } from "react-redux"


export default function Akun() {
    return <div>
        <p>Ini halaman akun</p>
        <Profile/>
    </div>
}

function Profile() {
    const akun = useSelector(state => state.source.account)
    useEffect(() => console.log(akun),[akun])
    const [bioData,] = useState([
        { property: 'Nama', value: akun.nama },
        { property: 'Kelas', value: akun.kelas },
        { property: 'Nomor Absen', value: akun.nomor_absen },
        { property: 'Agama', value: akun.agama },
        { property: 'Jenis Kelamin', value: akun.jenis_kelamin },
    ])
    return <div className="flex flex-col shadow rounded-3xl overflow-hidden">
        <div className="flex flex-col sm:flex-row shadow-md rounded-md p-2 items-center gap-2">
            <img src={akun.avatar} alt={akun.nama} className="h-24 w-24 shadow rounded-full"/>
            <div className="flex flex-col p-2 justify-center font-medium text-neutral-700 items-center sm:items-start">
                <p>{akun.nama_panggilan}<span>#{akun.NIS}</span></p>
                <div>{akun?.peran?.map(x => (
                    <span key={x} className="px-2 rounded-full bg-indigo-200 text-indigo-600 text-sm">{x}</span>
                ))}</div>
            </div>
        </div>
        <div className="px-4 mt-4">
            {bioData.map(({ property, value }) => (
                <ProfileBioCell key={property} property={property} value={value} />
            ))}
        </div>
    </div>
}

function ProfileBioCell({property, value}) {
    return <div className="flex flex-col sm:flex-row border-b-[1px] border-solid border-neutral-400 last:border-transparent py-2">
        <p className="sm:w-2/6 font-medium">{property}</p>
        <p>{value}</p>
    </div>
}