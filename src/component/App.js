import React from 'react'
import Navbar from './Navbar/Navbar'
import Base from './Base/Base'

function App() {
  return (
    <div className='relative bg-primary text-neutral-500 min-h-screen overflow-auto flex flex-col items-center'>
      <Navbar/>
      <Base/>
    <p className='text-neutral-200'>Bagi yang sudah naik kelas 11 dan informasi akunnya masih kelas 10, sistem buat edit informasi akunnya masih dalam tahap pengembangan ya :) jadi pakai akun yang lama tidak apa</p>
    <p className='text-neutral-200'>- huddin tadi malam sakit ketiduran</p>
    </div>
  )
}

export default App
