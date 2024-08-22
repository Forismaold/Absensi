import React from 'react'
import Navbar from './Navbar/Navbar'
import Base from './Base/Base'
import Header from './Header/Header'

function App() {
  return (
    <div className='relative bg-primary text-neutral-500 min-h-screen overflow-auto flex flex-col items-center'>
      <div className='flex flex-col w-full pb-14'>
        <Header/>
        <Base/>
      </div>
      <Navbar/>
    </div>
  )
}

export default App
