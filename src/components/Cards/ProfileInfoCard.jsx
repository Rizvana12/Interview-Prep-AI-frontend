import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../../Context/userContext';



const ProfileInfoCard = () => {

    const { user, clearUser } = useContext(UserContext);

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/");
    };
    
  return user && (
    <div className='flex items-center'>
        <img src={user.profileImageUrl} alt="Profile" 
        className='w-11 h-11 bg-gray-300 rounded-full mr-3'/>
        <div>
            <div className='text-[15px] text-bold'>{user.name || ""}</div>
            <button className='text-amber-600 text-xs font-semibold cursor-pointer hover:underline'
            onClick={handleLogout}>Logout</button>
        </div>
    </div>
  )
}
export default ProfileInfoCard