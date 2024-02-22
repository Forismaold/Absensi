import { toast } from 'react-toastify'

export function loadingToast(text = 'Loading...', timeout = 90000) {
    const promise = toast.loading(
        <div>
            <p>{text}</p>
        </div>
    )

    let thisTimeout

    const updateToast = (type, msg) => {
        toast.update(promise, { type, render: <p>{msg}</p>, isLoading: false, autoClose: 3000, closeOnClick: true, draggable: true })
        clearTimeout(thisTimeout)
    }

    thisTimeout = setTimeout(() => {
        try {
            updateToast(toast.TYPE.DEFAULT, 'Waktu habis')
        } catch (error) {}
    }, timeout)
    
    const onSuccess = (msg = 'Success') => updateToast(toast.TYPE.SUCCESS, msg)

    const updateText = (msg) => {
        toast.update(promise, { render: <p>{msg}</p> })
    }

    const onError = (msg = 'Error') => updateToast(toast.TYPE.ERROR, msg)

    const close = () => toast.dismiss(promise)


    return { element: promise, onSuccess, onError, close, updateText }
}

export function blankToast(text = 'Ok') {
    toast(
    <div>
        <p>{text}</p>
    </div>, {autoClose: 3000})
}