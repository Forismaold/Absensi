import axios from "./axios";
import { loadingToast } from "./myToast"


export default function ButtonSendText({text = 'Hello'}) {
    async function SendSomething() {
        const promise = loadingToast()
        try {
            await axios.get('/test', {text: text})
            .then(res => {
                console.log(res.data);
                promise.onSuccess()
            })
            .catch(err => {
                throw new Error(err)
            })
        } catch (error) {
            promise.onError(error)
            console.log(error);
        }
    }
    return <button className={`text-center rounded bg-secondary text-neutral-200 shadow p-2`} onClick={SendSomething}>Send</button>
}
export function ButtonGet({route}) {
    async function SendSomething() {
        const promise = loadingToast()
        try {
            await axios.get(route)
            .then(res => {
                console.log(res.data)
                promise.onSuccess()
            })
            .catch(err => {
                throw new Error(err)
            })
        } catch (error) {
            promise.onError(error)
            console.log(error)
        }
    }
    return <button className={`text-center rounded bg-secondary text-neutral-200 shadow p-2`} onClick={SendSomething}>Send</button>
}