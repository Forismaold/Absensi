import React from 'react'
import Navbar from './Navbar/Navbar'
import Base from './Base/Base'

function App() {
  return (
    <div className='relative bg-indigo-500 text-neutral-500 min-h-screen overflow-auto flex flex-col items-center'>
      <Navbar/>
      <Base/>
    </div>
  )
}

export default App