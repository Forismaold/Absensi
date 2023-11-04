import { toast } from 'react-toastify'

export function loadingToast(text = 'Loading...', timeout = 90000) {
    const promise = toast.loading(
        <div>
            <p>{text}</p>
        </div>
    )

    const updateToast = (type, message, isLoading = false) => {
        toast.update(promise, { type, render: <p>{message}</p>, isLoading, autoClose: 3000 })
    }

    const onSuccess = (message = 'Success') => {
        updateToast(toast.TYPE.SUCCESS, message)
    }

    const onError = (message = 'Error') => {
        updateToast(toast.TYPE.ERROR, message)
    }

    const close = () => {
        toast.dismiss(promise)
    }

    setTimeout(() => {
        updateToast(toast.TYPE.DEFAULT, 'Waktu habis')
    }, timeout)

    return { element: promise, onSuccess, onError, close }
}

export function blankToast(text = 'Ok') {
    toast(
    <div>
        <p>{text}</p>
    </div>)
}