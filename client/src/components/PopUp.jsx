import React, { useState } from 'react'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'

const PopUp = () => {
   
    const {alert,setAlert,deleteChat} = useContext(ChatContext)

  return alert && (
    <div className='fixed inset-0 z-1 flex flex-col items-center justify-center bg-black/90 text-white '>
        <div className='bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-8 py-3 shadow-lg flex flex-col justify-center items-center'>
        <h1 className='mt-10'>Do you want to clear chat ?</h1>
         <div className='p-10 flex gap-4'>
            <button onClick={()=>deleteChat()} className='w-15 cursor-pointer bg-red-600 border border-red-800 rounded-xl  hover:scale-110 transition-transform duration-300'>Yes</button>
            <button onClick={()=>setAlert(false)} className='w-15 cursor-pointer bg-gray-600 border border-gray-800 rounded-xl
             hover:scale-110 transition-transform duration-300 '>No</button>
         </div>
         </div>
        
    </div>
  )
}

export default PopUp
