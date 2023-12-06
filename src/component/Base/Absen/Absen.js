import Note from './Note'
import UserAbsenceStatus from './UserAbsenceStatus'
import MyMap from './MyMap'

export default function Absen() {
    return <div className={'flex flex-col gap-2'}>
        <MyMap/>
        <UserAbsenceStatus/>
        <Note/>
    </div>
}