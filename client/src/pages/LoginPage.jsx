import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx';

const LoginPage = () => {
    const [currState, setCurrState] = useState("Sign up")
    const [isDataSubmitted,setIsDataSubmitted] = useState(false);
    const [formData, setformDta] = useState({
        fullName:"",
        email:"",
        password:"",
        bio:""
    })

    const {login} = useContext(AuthContext)

    const handleChange =(e)=>{
        const {name,value}= e.target;
        setformDta(prev =>({
            ...prev,[name]:value
    }))
    }

    const onSubmitHandler=(event)=>{
        event.preventDefault();

        if(currState === 'Sign up' && !isDataSubmitted){
            setIsDataSubmitted(true)
            return;
        }

         const {fullName,email,password,bio} = formData
        login(currState === "Sign up"? "signup" : "login", {fullName,email,password,bio})
    }

   
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

{/* ----------left----------- */}
<img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />
{/* -----------right----------  */}
<form onSubmit={onSubmitHandler} action="" className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
<h2 className='font-medium text-2xl flex justify-between items-center'>
    {currState}

{isDataSubmitted &&    <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}

 
    </h2>

     {currState === "Sign up" &&  !isDataSubmitted && (<input onChange={handleChange} value={formData.fullName} 
     name="fullName" type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none ' placeholder='Full Name' required/>
    )}

    {!isDataSubmitted && (
        <>
        <input onChange={handleChange} type="email" name="email" value={formData.email} placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none  focus:ring-2 focus:ring-indigo-500' />

        <input onChange={handleChange} type="password" name="password" value={formData.password} placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none  focus:ring-2 focus:ring-indigo-500' />
        </>
    )}

    {
        currState === "Sign up" && isDataSubmitted && (
            <textarea onChange={handleChange} name='bio' value={formData.bio} rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='provide a short bio...' required></textarea>
        )
    }

    <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>{currState === "Sign up" ? "Create Account" : "Login Now"}</button>

    <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
    </div>
    
    <div className='flex flex-col gap-2'>
         {currState === "Sign up" ? (
            <p className='text-sm text-gray-600'>Already have an account? <span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
         ):(
             <p className='text-sm text-gray-600'>Create an account <span onClick={()=>{setCurrState("Sign up")}} className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
         )}
    </div>
</form>
    </div>
  )
}

export default LoginPage
