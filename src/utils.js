import CryptoJS from "crypto-js"
import store from "./redux/store"
import moment from "moment-timezone"
import 'moment/locale/id'

export const API = process.env.REACT_APP_API

export function encryptObject(object) {
    const jsonString = JSON.stringify(object)

    const encryptedMessage = CryptoJS.AES.encrypt(jsonString, process.env.REACT_APP_CRYPTO_KEY).toString()
    return encryptedMessage
}

export function decryptObject(encryptedMessage) {
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
            const data = decryptObject(dataString)
            return data
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        localStorage.removeItem(key)
    }
}

export function formatTime(time) {
    return moment(time).tz('Asia/Jakarta').format('HH:mm')
}
export function formatDate(time) {
    return moment(time).tz('Asia/Jakarta').format('D/M/YYYY HH:mm')
}
export function formatBeautyDate(time = Date.now()) {
    moment.locale('id')
    const asiaTime = moment(time).tz('Asia/Jakarta')
    
    const formattedDate = asiaTime.format('ddd, D MMMM YYYY HH:mm')

    return formattedDate
}

export function getPermission() {
    const account = store.getState().source?.account || {}
    return account?.peran?.some(role => ['admin', 'forisma'].includes(role)) || false
}

// kode sebelumnya seperti ini
// const userWithin = (coordinate[0] >= first[0] && coordinate[0] <= second[0]) && (coordinate[1] >= first[1] && coordinate[1] <= second[1])
// return userWithin

export function getDefaultCoordinates() {
    let {first, second} = store.getState().coordinates || {}
    return {first, second}
}

export function isUserWithinBounds (userCoordinate = [0, 0], absenceCoordinates = {}) {
    // dapatkan data dari parameter dan redux
    const coordinate = userCoordinate || [0, 0]
    let {first, second} = absenceCoordinates; // Mengambil dari parameter pertama
    const reduxCoordinates = store?.getState()?.source?.absensi?.coordinates
    if (!first || !second) {
        if(reduxCoordinates) {
            // Jika absenceCoordinates kosong dan terdapat data Redux
            ({first, second} = reduxCoordinates) // Mengambil dari Redux
        } else {
            console.log('cannot check within bounds before set')
            return false
        }
    }


    // buat variable sendiri 
    const [userLat, userLng] = coordinate
    const [firstLat, firstLng] = first
    const [secondLat, secondLng] = second
    
    // Mengecek apakah userLat berada di antara firstLat dan secondLat
    const isLatInRange = userLat >= Math.min(firstLat, secondLat) && userLat <= Math.max(firstLat, secondLat)

    // Mengecek apakah userLng berada di antara firstLng dan secondLng
    const isLngInRange = userLng >= Math.min(firstLng, secondLng) && userLng <= Math.max(firstLng, secondLng)

    // Jika kedua koordinat (latitude dan longitude) berada dalam jangkauan, maka user berada dalam jangkauan
    return isLatInRange && isLngInRange
}

export function isUserWithinBoundsCSV (bounds = {}, userCoordinate = [0, 0]) {
    // dapatkan data dari parameter dan redux
    if (!userCoordinate[0] || !userCoordinate[1] || !bounds) {
        console.log('requirement not complete');
        return false
    }

    const coordinate = userCoordinate
    let {first, second} = bounds

    // buat variable sendiri 
    const [userLat, userLng] = coordinate
    const [firstLat, firstLng] = first
    const [secondLat, secondLng] = second
    
    // Mengecek apakah userLat berada di antara firstLat dan secondLat
    const isLatInRange = userLat >= Math.min(firstLat, secondLat) && userLat <= Math.max(firstLat, secondLat)

    // Mengecek apakah userLng berada di antara firstLng dan secondLng
    const isLngInRange = userLng >= Math.min(firstLng, secondLng) && userLng <= Math.max(firstLng, secondLng)

    // Jika kedua koordinat (latitude dan longitude) berada dalam jangkauan, maka user berada dalam jangkauan
    return isLatInRange && isLngInRange
}

export function getCenterCoordinates(coordinates = {}) {
    const {first, second} = coordinates
    if (!first || !second) {
        console.log('cannot check within bounds before set')
        return [0,0]
    }

    const centerX = (first[0] + second[0]) / 2
    const centerY = (first[1] + second[1]) / 2
    
    return [centerX, centerY]
}