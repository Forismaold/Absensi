import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { API, formatTime, getCenterCoordinates, isUserWithinBounds } from "../../../utils"
import Modal from "../../utils/Modal"
import Cell from "../../utils/Cell"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"

const classList = [
    {classNumberRank: 'X.E', classCount: 9},
    {classNumberRank: 'XI.F', classCount: 9},
    {classNumberRank: 'XII.F', classCount: 8}
]

export default function DisplayTableUsers({usersTicket, absensi}) {
    const [tickets, setTickets] = useState(null)
    const [users, setUsers] = useState(null)
    const [selectedClass, setSelectedClass] = useState(null)
    const [isFetch, setIsFetch] = useState(false)

    function changeSelectedClass(item) {
        if (isFetch) {
            return
        }
        setUsers(null)
        setSelectedClass(item)
    }

    const fetchData = useCallback(async() => {
        if (!selectedClass) return
        setIsFetch(true)
        try {
            let path = selectedClass !== 'semua' ? `/users/class/${selectedClass?.split('-')?.join('/')}` : `/absensi/users/${absensi?._id || ''}`
            await axios.get(API + path)
            .then(res => {
                // const userSorted = res.data.sort((a,b) => a.nomorAbsen - b.nomorAbsen)
                const userSorted = res.data.filter((user, index, self) =>
                    index === self.findIndex((u) => u._id === user._id)
                ).sort((a, b) => a.nomorAbsen - b.nomorAbsen);

                setUsers(userSorted)
                setIsFetch(false)
            }).catch(err => {
                setIsFetch(false)
                throw new Error(err)
            })
        } catch (error) {
            setIsFetch(false)
        }
    }, [absensi?._id, selectedClass])

    useEffect(() => {
        fetchData()
    }, [fetchData, selectedClass])

    useEffect(() => {
        setTickets(usersTicket)
    }, [usersTicket])
    
    
    if (!absensi) return <div><p>menungu absensi...</p></div>

    return <div className="flex flex-col gap-2">
        <div className="flex flex-wrap">
            <div className={`p-2 cursor-pointer click-animation border-b-2 ${!selectedClass && 'border-secondary text-secondary bg-quaternary'}`} onClick={()=>changeSelectedClass(null)}><FontAwesomeIcon icon={faCircleXmark}/></div>
            <div className={`p-2 cursor-pointer click-animation border-b-2 ${selectedClass === 'semua' && 'border-secondary text-secondary bg-quaternary'}`} onClick={()=>changeSelectedClass('semua')}>semua</div>
            {classList.filter(x => absensi.allowedGrades.includes(x.classNumberRank)).map((item, i) => Array.from({ length: item.classCount }, (_, index) => (
                    <div key={index + 1} className={`p-2 cursor-pointer click-animation border-b-2 ${selectedClass === `${item.classNumberRank}-${index + 1}` && 'border-secondary text-secondary bg-quaternary'} ${isFetch && 'opacity-50'}`} onClick={()=>changeSelectedClass(`${item.classNumberRank}-${index + 1}`)}>{item.classNumberRank}-{index + 1}</div>
                ))
            )}
        </div>
        <div>
            {!selectedClass && <p className="p-4 mx-auto">Silahkan pilih kelas!</p>}
            {users?.map((data) => <UserRowModel data={data} key={data._id} tickets={tickets} absensiData={absensi}/>) || []}
        </div>
    </div>
}

function UserRowModel({data, tickets, absensiData}) {
    const [absensi, ] = useState(absensiData)
    const [ticket, setTicket] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [msg, setMsg] = useState('')

    function setUserInBounds() {
        setIsLoading(true)
        try {
            axios.put(API + '/absen/force/hadir/' + absensi._id, {koordinat: getCenterCoordinates(absensi?.coordinates), user: data._id})
            .then(res => {
                if (res.data.success) {
                    setMsg('berhasil diperbarui')
                    setTicket(res.data.ticket)
                } else {
                    setMsg('something error')
                }
            })
        } catch (error) {
            setMsg('error, try again')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        let userExist = tickets?.find(ticket => ticket?.user?._id === data._id)
        if (userExist) {
            setTicket(userExist)
        }
    },[absensi, data, ticket, tickets])

    return <>
        <div className={`p-2 rounded w-full cursor-pointer ${ticket ? 'bg-tertiary' : 'odd:bg-neutral-200'}`} onClick={() => setIsOpenModal(true)}>
            <p className="truncate text-neutral-600">{data.kelas}-{data.nomorKelas}/{data.nomorAbsen} {data.nama}<span>{data?.NIS && `#${data.NIS}`}</span></p>
        </div>
        <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} zIndex={'z-[2]'}>
            <p>{data.nama}{data?.NIS && `#${data.NIS}`} ({ticket?.absen ? 'Absen' : 'Tidak absen'})</p>
            <Cell prop={'Kode'} value={ticket?.kode}/>
            <Cell prop={'Keterangan'} value={ticket?.keterangan}/>
            <Cell prop={'Lokasi'} value={isUserWithinBounds(ticket?.koordinat || [0,0], absensi?.coordinates)? 'Di dalam area' : 'Di luar area'}/>
            <Cell prop={'Koordinat'} value={`${ticket?.koordinat ? ticket.koordinat[0] : 'defaultX'}, ${ticket?.koordinat ? ticket.koordinat[1] : 'defaultY'}`}/>
            <Cell prop={'Waktu Absen'} value={formatTime(ticket?.waktuAbsen)}/>
            {isUserWithinBounds(ticket?.koordinat || [0,0], absensi?.coordinates) ? '' : 
                isLoading ? <div className='flex gap-2 bg-primary shadow-lg shadow-primary/50 cursor-pointer items-center p-2 rounded text-neutral-200 click-animation'>Loading</div> :
                <div onClick={setUserInBounds} className='flex gap-2 bg-primary shadow-lg shadow-primary/50 cursor-pointer items-center p-2 rounded text-neutral-200 click-animation'>{msg ? msg : 'Ubah koordinat di dalam area'}</div>
            }
        </Modal>
    </>
}