import { useDispatch, useSelector } from "react-redux"
import MyMap from "../MyMap/MyMap"
import { useEffect } from "react"
import { clearAbsensi } from "../../../../redux/source"
import MuatUlangAbsensi from "./MuatUlangAbsensi"
import Note from "../Note"
import DisplayStatusAbsenceUser from "./DisplayStatusAbsenceUser"
import AbsenceMethod from "../AbsenceMethod/AbsenceMethod"
import CheckAccountExist from "../../../utils/CheckAccountExist"

export default function DetailAbsen() {
    const dispatch = useDispatch()
    const account = useSelector(state => state.source.account)

    useEffect(() => {
        return () => {
            dispatch(clearAbsensi())
        }
    }, [dispatch])
    
    return <div className='flex flex-col'>
        <CheckAccountExist/>
        <MuatUlangAbsensi/> {/* absensi difetch disini */}
        <Note/>
        <DisplayStatusAbsenceUser/>
        <div className={`${!account && 'opacity-50'} flex flex-col gap-2`}>
            <MyMap/>
            <AbsenceMethod/>
        </div>
    </div>
}

