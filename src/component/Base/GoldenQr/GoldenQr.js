import { faInfo, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function GoldenQr() {
    return <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="w-1/4"/>
            <p className="w-3/4">Akses fitur baru ini masih ditutup karena masih belum stabil!</p>
        </div>
        <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faInfo} className="w-1/4"/>
            <p className="w-3/4">Developer akan merilis fitur baru bernama Golden QR. Saatnya memindai QR untuk melakukan absensi tanpa akses lokasi, dapatkan QR di setiap absensi dari admin.</p>
        </div>
        <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faInfo} className="w-1/4"/>
            <p className="w-3/4">Fitur Golden Qr dirilis untuk mengatasi beberapa perangkat yang tidak dapat memberikan lokasi secara akurat!</p>
        </div>
    </div>
}