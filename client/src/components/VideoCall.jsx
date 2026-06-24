import React, { useContext, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import assets from '../assets/assets'
import { VideoCallContext } from '../../context/VideoCallContext';
const VideoCall = () => {



const [received,setReceived] = useState(false)
const [controls,setControls] = useState(false)
const  start = useRef(null)


const {
  incomingCall,
  inCall,
  calling,
   callActive,
         localVideo,
         remoteVideo,
         callUser,
         acceptCall,
         rejectCall,
         toggleMic,
         toggleCamera,
         endCall
} = useContext(VideoCallContext);

const ShowControls = ()=>{
  setControls(true);
 start.current = setTimeout(()=>{setControls(false)},5000)
}

const resetTime =()=>{
  clearTimeout(start.current)
}


useEffect(()=>{
  ShowControls()
},[received])


  return (<>

 {/* incoming call */}
   { inCall && 
  <div className='bg-gradient-to-b from-purple-400 to-violet-600 text-white absolute z-20 w-full h-full flex flex-col justify-evenly items-center'>
            <div className='flex flex-col items-center h-[30%]'>
              <span className='text-xl font-bold'>Incoming Call</span>
              <span className='text-sm'>from</span>
              <span className='text-lg font-extrabold'>Jhon Smith</span>
            </div>
            <div className='h-[30%] w-full flex flex-col justify-center items-center'>
                        <div className='rounded-full w-[150px] h-[150px]'>
                          <img src="https://photosfire.com/wp-content/uploads/2024/09/mirror-iphone-selfie-boys-dp_23-576x1024.webp" alt="" className='rounded-full w-[100%] h-[100%] object-cover' />
                        </div>
            </div>
            <div className='w-full h-[30%] inset-0 flex justify-evenly items-center '>
                    <div className='w-[100%] h-[100%]  flex justify-center items-center '>
                              <button>
                              <img src={assets.pick_call}  onClick={()=>acceptCall()} alt="" className='w-[70px] transition-all hover:w-[75px] cursor-pointer'/>
                              </button>
                      </div>
                      <div className='w-[100%] h-[100%] flex justify-center items-center '>
                              <button>
                                <img src={assets.drop_call} onClick={()=>rejectCall()} alt="" className='w-[70px] transition-all hover:w-[75px] cursor-pointer'/>
                              </button>
                    </div>    
           </div>
  </div>}

{/* calling */}

 { calling && 
 <div className='bg-gradient-to-b from-purple-400 to-violet-600 text-white absolute z-20 w-full h-full flex flex-col justify-evenly items-center'>
      <div className='flex flex-col items-center h-[30%]'>
              <span className='text-xl font-bold'>Calling...</span>
              <span className='text-sm'>from</span>
              <span className='text-lg font-extrabold'>Jhon Smith</span>
      </div>
      <div className='h-[30%] w-full flex flex-col justify-center items-center'>
              <div className='rounded-full w-[150px] h-[150px]'>
                   <img src="https://photosfire.com/wp-content/uploads/2024/09/mirror-iphone-selfie-boys-dp_23-576x1024.webp" alt="" className='rounded-full w-[100%] h-[100%] object-cover' />
              </div>
      </div>
       <div className='w-full h-[30%] inset-0 flex justify-evenly items-center '>
                <div className='w-[100%] h-[100%] flex justify-center items-center '>
                    <button>
                      <img src={assets.drop_call} alt="" className='w-[70px] transition-all hover:w-[75px] cursor-pointer'/>
                    </button>
                </div>    
       </div>
 </div>}


{/* Received  */}

{received && 
  <div className='w-full h-full absolute inset-0  bg-red-300'  onClick={()=>ShowControls()}>


    <video src={localVideo} className='h-[95%] w-[95%] inset-0 m-auto absolute object-cover rounded-md' autoPlay></video>
     <video src={remoteVideo} className='h-[20%] w-[20%] m-2 absolute object-cover rounded-mdshadow-md' autoPlay></video>
    {/* buttom nav */}
  {controls && <span className=' flex justify-evenly rounded-full p-3  bg-white w-full absolute transition-all bottom-2' onClick={()=>resetTime()} onMouseEnter={()=>resetTime()} onMouseLeave={()=>ShowControls()}>
      <button><img onClick={()=>''} src={assets.resize} alt="" className='w-[25px] transition-all hover:w-[27px] cursor-pointer'/></button>
      <button><img onClick={()=>''} src={assets.up_sound} alt="" className='w-[25px] transition-all hover:w-[27px] cursor-pointer'/></button>
      <button><img onClick={()=>toggleCamera()} src={assets.video_call} alt="" className='w-[25px] transition-all hover:w-[27px] cursor-pointer'/></button>
      <button><img onClick={()=>toggleMic()} src={assets.mic_on} alt="" className='w-[25px] transition-all hover:w-[27px] cursor-pointer'/></button>
      <button><img onClick={()=>endCall()} src={assets.drop_call} alt="" className='w-[25px] transition-all hover:w-[27px] cursor-pointer'/></button>
    </span>}

  </div>
}


     
    
    </>
  )
}

export default VideoCall
