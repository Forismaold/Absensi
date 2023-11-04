import { createPortal } from "react-dom"

export default function Modal({isOpen, children, onClose}) {
    if (!isOpen) return null
    
    return createPortal(
        <MyOverlay onClose={onClose}>
            <div className="bg-neutral-200 text-neutral-500 rounded-md p-2 w-full">
                {children}
            </div>
        </MyOverlay>
    , document.getElementById('portal'))
}

function MyOverlay({onClose, children}) {
    function handleOnClose(e) {
        if (e.target.classList.contains('overlay')) onClose()
    }
    return <div onClick={handleOnClose} className="overlay fixed top-0 b-0 r-0 l-0 h-full w-full bg-neutral-900/[.5] z-[1] p-4 flex justify-center items-center">
        {children}
    </div>
}