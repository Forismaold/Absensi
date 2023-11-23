import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars, faBolt } from '@fortawesome/free-solid-svg-icons'
import Modal from '../../utils/Modal'

export default function InfoAboutUserCoordinate({isOpen, onClose}) {
    return <Modal isOpen={isOpen} onClose={onClose} zIndex={'z-[1001]'}>
        <div className='text-neutral-500 p-2'>
            <h3 className='font-semibold'>Masalah Umum</h3>
            <ol className='pl-4'>
                <li><span className='font-medium'>Kondisi Cuaca atau Atmosfer:</span> Cuaca buruk atau kondisi atmosfer tertentu dapat memengaruhi sinyal GPS dan mengurangi akurasi.</li>
                <li><span className='font-medium'>Penggunaan VPN:</span> Jika pengguna menggunakan VPN, lokasi yang dilaporkan mungkin mencerminkan lokasi server VPN, bukan lokasi fisik pengguna.</li>
            </ol>
            <h3 className='font-semibold mt-2'>Solusi</h3>
            <ol className='pl-4'>
                <li>Klik <FontAwesomeIcon icon={faBinoculars}/> untuk mengaktifkan tampilan geolokasi secara real-time.</li>
                <li>Klik <FontAwesomeIcon icon={faBolt}/> untuk mengaktifkan geolokasi dengan akurasi tinggi.</li>
                <li><span className='font-medium'>Pergi ke Ruang Terbuka:</span> Memastikan Anda berada di tempat dengan visibilitas langit yang baik.</li>
                <li><span className='font-medium'>Gunakan Akses Internet Lain:</span> Beberapa provider internet mungkin memberikan lokasi yang tidak akurat.</li>
            </ol>
        </div>
    </Modal>
}
