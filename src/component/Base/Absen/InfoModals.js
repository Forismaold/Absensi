import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars, faBolt, faChevronRight, faRefresh } from '@fortawesome/free-solid-svg-icons'
import Modal from '../../utils/Modal'
import { useSelector } from 'react-redux'

export function InfoCommonProblem({isOpen, onClose}) {
    return <Modal isOpen={isOpen} onClose={onClose} zIndex={'z-[1001]'}>
        <div className='text-neutral-500 p-2'>
            <h3 className='font-semibold'>GPS</h3>
            <p>Mungkin koordinat yang browser anda berikan tidak presisi. kamu bisa meminta teman untuk mengirimkannya dengan menunjukkan kode QR</p>
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

export function InfoGoldenQr({isOpen, onClose}) {
    return <Modal isOpen={isOpen} onClose={onClose} zIndex={'z-[1001]'}>
        <div className='text-neutral-500 p-2'>
            <h3 className='font-semibold mt-2'>Cara Menggunakan Golden QR</h3>
            <p>Memindai QR untuk melakukan absensi tanpa akses lokasi, dapatkan QR di setiap absensi dari admin.</p>
            <p>Kode QR Emas memiliki garis tepi berwarna kekuningan.</p>
            <h3 className='font-semibold mt-2'>Pindai</h3>
            <ol className='pl-4'>
                <li>Arahkan kamera pemindai ke Kode QR Emas</li>
            </ol>
            <h3 className='font-semibold mt-2'>Kirim</h3>
            <ol className='pl-4'>
                <li>Kirim absensi seperti biasa dan selamat, anda sudah absen</li>
            </ol>
        </div>
    </Modal>
}

export function InfoCostumCoordinate({isOpen, onClose}) {
    const coordinates = useSelector(state => state.coordinates)

    return <Modal isOpen={isOpen} onClose={onClose} zIndex={'z-[1001]'} portalName='portalDeeper'>
        <div className='text-neutral-500 p-2'>
            <h3 className='font-semibold mt-2'>Cara Menyetel Koordinat</h3>
            <h3 className='font-semibold mt-2'>Format</h3>
            <p>Gunakan latitude(Garis Lintang) dan longitude(Garis bujur).</p>
            <p>Gunakan format dengan <span className="font-semibold">urutan garis lintang kemudian garis bujur</span> yang <span className="font-semibold">dipisah dengan tanda koma</span>.</p>
            <p>Gunakan titik sebagai desimal contoh jika <span className="font-semibold">dua koma empat puluh lima</span> maka <span className="font-semibold">2.45</span></p>
            <p>Gunakan koma sebagai pemisah antara nilai garis lintang dan garis bujur contoh jika garis lintang adalah <span className="font-semibold">dua koma empat puluh lima</span> dan garis bujur adalah <span className="font-semibold">lima koma dua puluh lima</span> maka <span className="font-semibold">2.45, 5.25</span></p>
            <h3 className='font-semibold mt-2'>Catatan</h3>
            <p>Nilai koordinat jika tidak diisi maka akan menyediakan nilai bawaan yang tersedia.</p>
            <p>Koordinat petama <span className='font-semibold'>{coordinates?.first.join(', ')}</span></p>
            <p>Koordinat Kedua <span className='font-semibold'>{coordinates?.second.join(', ')}</span></p>
            <h3 className='font-semibold mt-2'>Fun fact</h3>
            <p>Di negara orang yang membuat bahasa javascript (Amerika, Brendan Eich), mereka menggunakan tanda titik sebagai tanda desimal pada angka, tidak seperti di indonesia yang menggunakan tanda koma. Itulah kenapa developer menggunakan format diatas :)</p>
        </div>
    </Modal>
}