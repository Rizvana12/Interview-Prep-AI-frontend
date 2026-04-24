import React from 'react'
import {LuUser, LuUpload, LuTrash} from 'react-icons/lu'
import {useRef, useState} from 'react'
import Input from './Input'

const ProfilePhotoSelector = ({image, setImage, preview, setPreview}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null)
  const handleImageChange=(event)=>{
    const file = event.target.files[0];
    if(file){
      //upload the image state
      setImage(file)
      //generate preview url from the file
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
      if(setPreview){
        setPreview(previewUrl)
      }
    }
  }
  const handleRemoveImage=()=>{
    setImage(null)
    setPreviewUrl(null)
    if(setPreview){
      setPreview(null)
    }
  }

  const onChooseFile =()=>{
    inputRef.current.click();
  }
  return (
    <div className='flex justify-center mb-6'>
      <Input
      type='file'
      accept='image/*'
      ref={inputRef}
      onChange={handleImageChange}
      className='hidden'/>

      {!image?(
        <div className='w-20 h-20 flex items-center justify-center bg-orange-50 rounded-full relative cursor-pointer'>
          <LuUser className='text-4xl text-orange-500'/>
          <button
          type='button'
          className='w-8 h-8 flex items-center justify-center bg-linear-to-r from-orange-500/85 to-orange-600 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
          onClick={onChooseFile}>
            <LuUpload/>
          </button>
        </div>
      ):(
        <div className='relative'>
          <img src={preview||previewUrl} alt="profile photo"
          className='w-20 h-20 rounded-full object-cover' />
          <button
          type='button'
          onClick={handleRemoveImage}
          className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'>
            <LuTrash/>
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePhotoSelector