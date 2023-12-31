import UsersGroup from './UsersGroup'


export default function UsersList({users}) {

    return <div className="flex flex-col gap-2">
        {users && <div className="flex flex-col gap-2">
            <div className='flex gap-2'>
                <UsersGroup title={'Tidak absen'} data={users?.filter(x => x.absen === false) || []}/>
                <UsersGroup title={'Sudah absen'} data={users?.filter(x => x.absen === true) || []}/>
            </div>
        </div>}
    </div>
}