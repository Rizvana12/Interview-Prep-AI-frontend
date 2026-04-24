import React from 'react'
import {useNavigate} from 'react-router-dom'
import {useState, useContext } from 'react'
import Input from '../../components/Inputs/Input'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../Context/userContext'
import { validateEmail } from '../../utils/helper'
import uploadImage from '../../utils/uploadImage'

const SignUp = ({setCurrentPage}) => {
  const [profilePic, setProfilePic]=useState(null);
  const [fullName, setFullName]=useState('')
  const [email, setEmail]=useState('')
  const [password, setPassword]=useState('')
  const [error, setError]=useState(null)
  const navigate=useNavigate()
  const { updateUser } = useContext(UserContext)
  // Handle signup form submit
  
  const handleSignUp = async (e) =>{
    e.preventDefault();
    let profileImageUrl = ""
    if(!fullName){
      setError("Please enter full name")
      return;
    }
    if(!validateEmail(email)){
      setError("Please eter a valid email address")
      return;
    }
    if(!password){
      setError("Please enter the password")
      return;
    }
    setError("");

    //Signup API call

    try{
     // upload image if present
     if(profilePic){
      const imgUploadRes = await uploadImage(profilePic);
      profileImageUrl = imgUploadRes.imageUrl || "";
     }
     const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      name: fullName,
      email,
      password,
      profileImageUrl,
     });
     const { token } = response.data;
     if(token){
      localStorage.setItem("token", token);
      updateUser(response.data);
      navigate("/dashboard");
     }
    }catch(error){
       if(error.response && error.response.data.message){
        setError(error.response.data.message);
       }else{
        setError("Something went wrong , Please try again ")
       }
    }
  }

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Create an Account</h3>
      <p className='text-xs text-slate-700 mt-1.25 mb-6'>Join us today by entering your details below.</p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>
        <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
          <Input
          value={fullName}
          onChange={({target})=>setFullName(target.value)}
          label='Full Name'
          placeholder='John'
          type='text'/>
          <Input
          value={email}
          onChange={({target})=>setEmail(target.value)}
          label='Email Address'
          placeholder='John@example.com'
          type='text'/>
          <Input
          value={password}
          onChange={({target})=>setPassword(target.value)}
          label='Password'
          placeholder='Min 8 characters'
          type='password'/>
        </div>
        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        <button type='submit' className='btn-primary'>Sign Up</button>
        <p className='text-[13px] text-slate-800 mt-3'>
          Already an account?{''}
          <button className='font-medium text-primary underline cursor-pointer'
          onClick={()=>{
            setCurrentPage('Login')
          }}>Login</button>
        </p>
      </form>
    </div>
  )
}

export default SignUp