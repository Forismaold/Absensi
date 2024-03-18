import { useEffect } from "react"
import { createPortal } from "react-dom"

function MyOverlay({onClose, children, zIndex = 'z-[1]'}) {
    function handleOnClose(e) {
        console.log(onClose);
        if (e.target.classList.contains('overlay') && e.target.classList.contains(zIndex)) onClose()
    }

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [])    

    return <div onClick={handleOnClose} className={`${zIndex} overlay fixed top-0 b-0 r-0 l-0 h-full w-full bg-neutral-900/[.5] p-4 flex justify-center items-center`}>
        {children}
    </div>
}

export default function Modal({isOpen, children, onClose, zIndex, portalName = 'portal'}) {
    if (!isOpen) return null
    
    return createPortal(
        <MyOverlay onClose={onClose} zIndex={zIndex}>
            <div className="bg-neutral-200 text-neutral-600 rounded-md p-2 w-full max-h-full overflow-auto">
                {children}
            </div>
        </MyOverlay>
    , document.getElementById(portalName))
}

export function Confirm({isOpen = false, title = 'Lanjutkan operasi', subTitle = 'Kamu yakin?', textCancel = 'Batal', textConfirm = 'Ya', onClose, zIndex, callBack}) {
    if (!isOpen || !onClose) return null
    
    return createPortal(
        <MyOverlay onClose={onClose} zIndex={zIndex = 'z-[2]'}>
            <div className="bg-neutral-200 text-neutral-600 rounded-md p-2 w-full max-h-full overflow-auto p-4 flex flex-col gap-2">
                <p className="font-medium">{title}</p>
                <p>{subTitle}</p>
                <div className="flex gap-2 justify-end">
                    <p className="p-3 cursor-pointer px-12 sm:px-16 bg-neutral-300 rounded shadow-lg shadow-neutral-500/50 click-animation" onClick={onClose}>{textCancel}</p>
                    <p className="p-3 cursor-pointer px-12 sm:px-16 bg-primary text-neutral-200 rounded shadow-lg shadow-primary/50 click-animation" onClick={callBack}>{textConfirm}</p>
                </div>
            </div>
        </MyOverlay>
    , document.getElementById('confirm'))
}