import UsersGroup from './UsersGroup'


export default function UsersList({users, absenceData}) {

    return <div className="flex flex-col gap-2">
        {users && <div className="flex flex-col gap-2">
            <div className='flex gap-2'>
                <UsersGroup title={'Tidak absen'} data={users?.filter(x => x.absen === false) || []} absenceData={absenceData}/>
                <UsersGroup title={'Sudah absen'} data={users?.filter(x => x.absen === true) || []} absenceData={absenceData}/>
            </div>
        </div>}
    </div>
}