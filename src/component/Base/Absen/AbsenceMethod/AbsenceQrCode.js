import QRCode from "react-qr-code"
import { useSelector } from "react-redux"
import { encryptObject } from "../../../../utils"
import { useEffect, useState } from "react"

export default function AbsenceQrCode() {
    const account = useSelector(state => state.source.account)

    const [value, setValue] = useState('')

    useEffect(() => {
        setValue(encryptObject([
            account._id,
            account.nama,
            account.kelas,
            account.nomorKelas,
            account.nomorAbsen,
        ]))
    }, [account._id, account.kelas, account.nama, account.nomorAbsen, account.nomorKelas])
    // useEffect(() => {
    //     setValue(encryptObject({
    //         _id: account._id,
    //         nama: account.nama,
    //         kelas: account.kelas,
    //         nomorKelas: account.nomorKelas,
    //         nomorAbsen: account.nomorAbsen,
    //         status: Boolean(status)
    //     }))
    // }, [account._id, account.kelas, account.nama, account.nomorAbsen, account.nomorKelas, status])
    return <div className="flex flex-col gap-2 items-center">
        <div className="bg-neutral-100">
            <QRCode value={value}/>
        </div>
        {/* <p className="break-all">{value}</p> */}
    </div>
}