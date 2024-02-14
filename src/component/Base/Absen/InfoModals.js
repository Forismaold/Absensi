import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars, faBolt, faChevronRight, faRefresh } from '@fortawesome/free-solid-svg-icons'
import Modal from '../../utils/Modal'

export function InfoCommonProblem({isOpen, onClose}) {
    return <Modal isOpen={isOpen} onClose={onClose} zIndex={'z-[1001]'}>
        <div className='text-neutral-500 p-2'>
            <h3 className='font-semibold'>Masalah Umum</h3>
            <ol className='pl-4'>
                <li><span className='font-medium'>Kondisi Cuaca atau Atmosfer:</span> Cuaca buruk atau kondisi atmosfer tertentu dapat memengaruhi sinyal GPS dan mengurangi akurasi.</li>
                <li><span className='font-medium'>Penggunaan VPN:</span> Jika pengguna menggunakan VPN, lokasi yang dilaporkan mungkin mencerminkan lokasi server VPN, bukan lokasi fisik pengguna.</li>
            </ol>
            <h3 className='font-semibold mt-2'>Solusi</h3>
            <ol className='pl-4'>
                <li><span className='font-medium'>Browser dan versi:</span> Kami menyarankan untuk menggunakan browser chrome atau safari dengan versi terbaru.</li>
                <li><span className='font-medium'>Pergi ke Ruang Terbuka:</span> Memastikan Anda berada di tempat dengan visibilitas langit yang baik.</li>
                <li><span className='font-medium'>Gunakan Akses Internet Lain:</span> Beberapa provider internet mungkin memberikan lokasi yang tidak akurat.</li>
                <li><span className='font-medium'>Pastikan GPS kamu:</span> Cobalah untuk membuka Google maps masing-masing untuk mengecek GPS handphone kalian berfungsi dengan baik.</li>
            </ol>
        </div>
    </Modal>
}
export function InfoAutoSubmit({isOpen, onClose}) {
    return <Modal isOpen={isOpen} onClose={onClose} zIndex={'z-[1001]'}>
        <div className='text-neutral-500 p-2'>
            <h3 className='font-semibold mt-2'>Cara Menggunakan</h3>
            <span>Bagian ini akan mengirim absen secara otomatis jika lokasi gps kamu menunjukkan didalam area absensi</span>
            <h3 className='font-semibold mt-2'>Lokasi real-time</h3>
            <ol className='pl-4'>
                <li>Klik [<FontAwesomeIcon icon={faBinoculars}/> <span>Mulai</span>] untuk mengaktifkan tampilan geolokasi secara real-time.</li>
                <li>Klik [<FontAwesomeIcon icon={faBinoculars}/> <span>Selesai</span>] untuk menghentikan pembaruan lokasi terus menerus.</li>
                <li>Klik <FontAwesomeIcon icon={faBolt}/> untuk mengaktifkan geolokasi dengan akurasi tinggi.</li>
            </ol>
            <h3 className='font-semibold mt-2'>Lokasi sekali</h3>
            <ol className='pl-4'>
                <li>Klik <FontAwesomeIcon icon={faRefresh}/> untuk memperbarui lokasi sekali.</li>
            </ol>
        </div>
    </Modal>
}

export function InfoManualSubmit({isOpen, onClose}) {
    return <Modal isOpen={isOpen} onClose={onClose} zIndex={'z-[1001]'}>
        <div className='text-neutral-500 p-2'>
            <h3 className='font-semibold mt-2'>Cara Menggunakan</h3>
            <span>Gunakan bagian ini untuk mengirim absen secara manual, bahkan bisa diluar area.</span>
            <h3 className='font-semibold mt-2'>Kirim absen</h3>
            <ol className='pl-4'>
                <li>Klik tombol [kirim] untuk mengirimkan absen dengan lokasi terbaru kamu</li>
            </ol>
            <h3 className='font-semibold mt-2'>Kirim keterangan tidak hadir</h3>
            <ol className='pl-4'>
                <li>Klik [<FontAwesomeIcon icon={faChevronRight}/>] untuk mengaktifkan bagian keterangan ketidakhadiran.</li>
            </ol>
        </div>
    </Modal>
}

export function InfoScanSubmit({isOpen, onClose}) {
    return <Modal isOpen={isOpen} onClose={onClose} zIndex={'z-[1001]'}>
        <div className='text-neutral-500 p-2'>
            <h3 className='font-semibold mt-2'>Cara Menggunakan</h3>
            <p>Gunakan bagian ini untuk mengirim absen temanmu.</p>
            <p>Dapatkan kode qr di halaman profile akun.</p>
            <h3 className='font-semibold mt-2'>Pindai</h3>
            <ol className='pl-4'>
                <li>Arahkan kamera pemindai ke kode qr</li>
            </ol>
            <h3 className='font-semibold mt-2'>Kirim</h3>
            <ol className='pl-4'>
                <li>Pemindai harus terhubung dengan gps dan berada didalam area</li>
            </ol>
        </div>
    </Modal>
}
