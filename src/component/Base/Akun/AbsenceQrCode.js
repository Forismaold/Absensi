import QRCode from "react-qr-code"
import { useSelector } from "react-redux"
import { encryptObject } from "../../../utils"
import { useEffect, useState } from "react"
import { Tooltip } from 'react-tooltip'

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
    return <div className="flex flex-col gap-2 items-center">
        <div className="bg-neutral-100">
            {value? <div href="value" data-tooltip-id="my-tooltip" data-tooltip-content="Ini kode QR berisi sebagian data kamu yang dienkripsi! cuma admin yang bisa ngisi absensi kamu dengan nunjukin kode ini ke mereka" data-tooltip-place="top"><QRCode value={value}/></div> : <p>Tidak dapat menampilkan value</p> }
        </div>
        <Tooltip id="my-tooltip" />
    </div>
}