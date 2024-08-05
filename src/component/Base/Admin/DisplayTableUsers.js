import { useState } from "react"

const classList = [
    {classNumberRank: 'X.E', classCount: 9},
    {classNumberRank: 'XI.F', classCount: 9},
    {classNumberRank: 'XII.F', classCount: 8}
]

export default function DisplayTableUsers() {
    const [selectedClass, setSelectedClass] = useState(null)
    // const [isFetch, setIsFetch] = useState(false)


    return <div className="flex flex-col gap-2">
        <div className="flex flex-wrap">
            <div className={`p-2 cursor-pointer click-animation border-b-2 ${!selectedClass && 'border-secondary text-secondary bg-quaternary'}`} onClick={()=>setSelectedClass(null)}>null</div>
            {classList.map((item, i) => Array.from({ length: item.classCount }, (_, index) => (
                    <div key={index + 1} className={`p-2 cursor-pointer click-animation border-b-2 ${selectedClass === `${item.classNumberRank}-${index + 1}` && 'border-secondary text-secondary bg-quaternary'}`} onClick={()=>setSelectedClass(`${item.classNumberRank}-${index + 1}`)}>{item.classNumberRank}-{index + 1}</div>
                ))
            )}
        </div>
        <div>
            {!selectedClass && <p className="p-4 mx-auto">Silahkan pilih kelas!</p>}
        </div>
    </div>
}