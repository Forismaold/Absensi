import { createPortal } from "react-dom"

export default function Modal({isOpen, children, onClose, zIndex}) {
    if (!isOpen) return null
    
    return createPortal(
        <MyOverlay onClose={onClose} zIndex={zIndex}>
            <div className="bg-neutral-200 text-neutral rounded-md p-2 w-full max-h-full overflow-auto">
                {children}
            </div>
        </MyOverlay>
    , document.getElementById('portal'))
}

function MyOverlay({onClose, children, zIndex = 'z-[1]'}) {
    function handleOnClose(e) {
        if (e.target.classList.contains('overlay')) onClose()
    }

    return <div onClick={handleOnClose} className={`${zIndex} overlay fixed top-0 b-0 r-0 l-0 h-full w-full bg-neutral-900/[.5] p-4 flex justify-center items-center`}>
        {children}
    </div>
}