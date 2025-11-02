import { useState } from 'react'

import './App.css'

function App() {

  return (
    <>
      <div className="p-base bg-background w-screen min-h-screen flex flex-col items-center justify-between sm:justify-center">
        <img src="/vetsync-wname.png" className="mt-48 h-24 w-auto" alt="Vetsync Logo" />
        <div className="w-full mt-6 flex flex-col items-center justify-center">
          <p className="text-center mb-4">Sync up with the best vets near you.</p>
          <button className="w-full sm:w-fit bg-primary text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">Get Started</button>
        </div>
      </div>
    </>
  )
}

export default App
