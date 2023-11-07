import { toast } from 'react-toastify'

export function loadingToast(text = 'Loading...', timeout = 90000) {
    const promise = toast.loading(
        <div>
            <p>{text}</p>
        </div>
    )

    let thisTimeout

    const updateToast = (type, message) => {
        toast.update(promise, { type, render: <p>{message}</p>, isLoading: false, autoClose: 3000, closeOnClick: true, draggable: true })
        clearTimeout(thisTimeout)
    }

    thisTimeout = setTimeout(() => {
        try {
            updateToast(toast.TYPE.DEFAULT, 'Waktu habis')
        } catch (error) {}
    }, timeout)
    
    const onSuccess = (message = 'Success') => updateToast(toast.TYPE.SUCCESS, message)

    const onError = (message = 'Error') => updateToast(toast.TYPE.ERROR, message)

    const close = () => toast.dismiss(promise)


    return { element: promise, onSuccess, onError, close }
}

export function blankToast(text = 'Ok') {
    toast(
    <div>
        <p>{text}</p>
    </div>, {autoClose: 3000})
}