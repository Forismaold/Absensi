import CryptoJS from "crypto-js"

export const API = process.env.REACT_APP_API

function encryptObject(object) {
    const jsonString = JSON.stringify(object)

    const encryptedMessage = CryptoJS.AES.encrypt(jsonString, process.env.REACT_APP_CRYPTO_KEY).toString()
    return encryptedMessage
}

function dencryptObject(encryptedMessage) {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, process.env.REACT_APP_CRYPTO_KEY)
    const decryptedJsonString = decryptedBytes.toString(CryptoJS.enc.Utf8)

    const decryptedObject = JSON.parse(decryptedJsonString)

    return decryptedObject
}

export function setLocalStorage(key, string) {
    localStorage.setItem(key, string)
}
  
export function getLocalStorage(key) {
    const dataString = localStorage.getItem(key)

    if (dataString) {
        return dataString
    } else {
        return null
    }
}
export function setObjectLocalStorage(key, data) {
    const dataString = JSON.stringify(data)
    localStorage.setItem(key, dataString)
}
  
export function getObjectLocalStorage(key) {
    const dataString = localStorage.getItem(key)

    if (dataString) {
        const data = JSON.parse(dataString)
        return data
    } else {
        return null
    }
}

export function setEncryptObjectLocalStorage(key, data) {
    const dataString = encryptObject(data)
    localStorage.setItem(key, dataString)
}
  
export function getDecryptObjectLocalStorage(key) {
    try {
        const dataString = localStorage.getItem(key)
        
        if (dataString) {
            const data = dencryptObject(dataString)
            return data
        } else {
            return null
        }
    } catch (error) {
        localStorage.removeItem(key)
    }
}