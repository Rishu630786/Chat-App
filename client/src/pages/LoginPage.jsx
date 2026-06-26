import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx';

const LoginPage = () => {
    const [currState, setCurrState] = useState("Sign up")
    const [showPassword, setShowPassword] = useState(true)
    const [showPassword2, setShowPassword2] = useState(true)
    const [onFocus, setOnFocus] = useState(false)
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isDataSubmitted,setIsDataSubmitted] = useState(false);
    const [formData, setformDta] = useState({
        fullName:"",
        email:"",
        password:"",
        re_password:"",
        bio:""
    })
    const isPasswordMatch =
  formData.password &&
  formData.password === formData.re_password;

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
     name="fullName" type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ' placeholder='Full Name' required/>
    )}

    {!isDataSubmitted && (
        <>
        <input onChange={handleChange} type="email" name="email" value={formData.email} placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none  focus:ring-2 focus:ring-indigo-500' />

       <span className='relative p-2 border border-gray-500 rounded-md {onFocus ? "focus:outline-none focus:ring-2 focus:ring-indigo-500" : ""}'>
        <input onChange={handleChange} onFocus={() => setOnFocus(true)} onBlur={() => setShowPassword(false)} type={!showPassword ? "text" : "password"} name="password" value={formData.password} placeholder='Enter Password' required className='w-full bg-transparent boder-none outline-none text-white placeholder-gray-400 '
        />
           <img onClick={() => setShowPassword(!showPassword)} src={!showPassword ? assets.eye_open : assets.eye_off} alt="" className='w-5 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' />
        </span>



        {/* second password input */}

       {currState === "Sign up" &&  <span className='relative p-2 border border-gray-500 rounded-md {onFocus ? "focus:outline-none focus:ring-2 focus:ring-indigo-500" : ""}'>
        <input onChange={handleChange} onFocus={() => setOnFocus(true)} onBlur={() => setShowPassword2(false)} type={!showPassword ? "text" : "password"} name="re_password" value={formData.re_password} placeholder='Re-Enter Password' required className='w-full bg-transparent boder-none outline-none text-white placeholder-gray-400 '
        />
           <img onClick={() => setShowPassword2(!showPassword2)} src={!showPassword2 ? assets.eye_open : assets.eye_off} alt="" className='w-5 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' />
        </span>}
        </>
    )}

    {
        currState === "Sign up" && isDataSubmitted && (
            <textarea onChange={handleChange} name='bio' value={formData.bio} rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='provide a short bio...' required></textarea>
        )
    }

    {/* password matching */}

    {currState === "Sign up" && formData.re_password && (
      <p className={isPasswordMatch ? "text-green-500" : "text-red-500"}>
        {isPasswordMatch ? "Passwords match!" : "Passwords do not match."}
      </p>
    )}


    {/* submit button */}

<button
  type="submit"
  disabled={
    currState === "Sign up" &&
    (!agreeTerms || !isPasswordMatch)
  }
  className={`py-3 rounded-md text-white transition
    ${
      currState === "Sign up" &&
      (!agreeTerms || !isPasswordMatch)
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-gradient-to-r from-purple-400 to-violet-600 cursor-pointer"
    }`}
>
  {currState === "Sign up" ? "Create Account" : "Login Now"}
</button>



    {/* <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>{currState === "Sign up" ? "Create Account" : "Login Now"}</button> */}

  { currState === "Sign up" &&   (  <div className='flex items-center gap-2 text-sm text-gray-500'>

       <input  type="checkbox"
  checked={agreeTerms}
  onChange={(e) => setAgreeTerms(e.target.checked)}/>
          <p>Agree to the terms of use & privacy policy.</p>

    </div>
    )}
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
