export default function UsersGroup({title, data}) {
    return <div className='flex flex-col flex-1 shadow-md p-2 rounded-md overflow-hidden'>
        <p className="text-neutral-600 font-medium py-2 flex items-center justify-between">
            <span>{title}</span>
            <span>{data.length}</span>
        </p>
        <div className="flex flex-col items-center flex-1">
            {data.map(x => <UserGroupModel key={x._id} data={x}/>)}
            {!data.length && <p className="text-center m-auto">Kosong</p>}
        </div>
    </div>
}

function UserGroupModel({data}) {
    return <div className="odd:bg-neutral-200 p-2 rounded w-full">
        <p className="truncate text-neutral-600">{data.nama}<span>{data?.NIS && `#${data.NIS}`}</span> </p>
    </div>
}