import { useSelector } from "react-redux"
import AbsenceMethod from '../AbsenceMethod/AbsenceMethod'
import DisplayStatusAbsenceUser from './DisplayStatusAbsenceUser'

export default function UserAbsenceStatus() {
    // const account = useSelector(state => state.source.account)
    // const status = useSelector(state => state.source.status)
    // const [absensi, setAbsensi] = useState(null)
    const absensi = useSelector(state => state.source.absensi)
    // const dispatch = useDispatch()

    // const fetchStatus = useCallback(async () => {
    //     setIsFetchLoading(true)
    //     try {
    //         await axios.get(API + '/absen/status/' + account?._id)
    //         .then(res => {
    //             dispatch(setStatus(res.data.status))
    //             dispatch(setAbsensi(res.data.absensi))
    //             setIsFetchLoading(false)
    //         })
    //         .catch(err => {
    //             setIsFetchLoading(false)
    //             console.log(err)
    //         })
    //     } catch (error) {
    //         setIsFetchLoading(false)
    //         console.log(error);
    //     }
    // },[account, dispatch])

    // useEffect(() => {
    //     if (!status) fetchStatus()
    // },[account, fetchStatus, status])

    // const absensi = useSelector(state => state.source.absensi)

    


    // if (!absensi === null) return <div>
    //     <button className='flex ml-auto items-center justify-center rounded text-neutral-100 bg-secondary p-2 shadow-lg shadow-primary/50 click-animation' onClick={() => fetchStatus()}>{isFetchLoading ? <LoadingIcon/> : <><FontAwesomeIcon icon={faRotate} className='p-0.5 pr-2'/> Segarkan status absensi</>}</button>
    // </div>

    if (!absensi === null) return null

    return <>
        {/* <div className='flex items-center justify-end' onClick={() => dispatch(clearAbsensi())}>
            <div className='flex gap-2 items-center bg-secondary p-2 shadow-lg shadow-primary/50 click-animation rounded-lg text-neutral-100 cursor-pointer'>
                <FontAwesomeIcon icon={faRefresh} className={`${isFetchLoading && 'animate-spin'}`}/> Segarkan Absensi
            </div>
        </div> */}

        <DisplayStatusAbsenceUser/> 
        <AbsenceMethod/>
        {/* <SubmitAbsenceForm absensi={absensi} setAbsensi={setAbsensi} status={absensi?.users?.find(item => item._id === account?._id) || undefined}/> */}
        {/* <UserAbsenceLocation /> */}
    </>
}

