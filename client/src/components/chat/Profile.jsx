import React, { useState, useEffect } from 'react'
import { IoArrowBack } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import { setShowProfile } from '../../redux/profileSlice'
import { IoMdLogOut } from "react-icons/io"
import InputEdit from './profile/InputEdit'
import { updateUser } from '../../apis/auth'
import { toast } from 'react-toastify'
import { setUserNameAndBio } from '../../redux/activeUserSlice'
import UserService from "@/services/user-service";
import DefaultImage from '../../../public/img/default_avatar.png';


function Profile(props) {
  const dispatch = useDispatch()
  const { showProfile } = useSelector((state) => state.profile)
  const activeUser = useSelector((state) => state.activeUser)
  const [user, setUser] = useState([]);
  const API_URL = process.env.API_URL;
  const [formData, setFormData] = useState({
    contact_person: activeUser.contact_person,
    bio: activeUser.bio
  })
  useEffect(() => {
    async function fetchData() {
      const response = await UserService.getUser();
      setUser(response.user);
      setFormData({
        contact_person: response.user.contact_person,
        bio: activeUser.bio
      })
    }
    fetchData();
  }, [])
  const logoutUser = () => {
    toast.success("Logout Successfull!")
    localStorage.removeItem("token")
    window.location.href = "/auth/sign-in"
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const submit = async () => {

    dispatch(setUserNameAndBio(formData))
    toast.success("Updated!")
    await updateUser(user._id, formData)

  }

  return (

    <div style={{ transition: showProfile ? "0.3s ease-in-out" : "" }} className={props.className}>
      <div className='absolute  w-[100%]'>
        <div className='bg-[#166e48] pt-12 pb-3'>
          <button onClick={() => dispatch(setShowProfile(false))} className='flex items-center'>
            <IoArrowBack style={{ color: "#fff", width: "30px", height: "20px" }} />
            <h6 className='text-[16px] text-[#fff] font-semibold'>Profile</h6>
          </button>
        </div>
        <div className=' pt-5'>
          <div className='flex items-center flex-col mt-3'>
            <img className='w-[150px] h-[150px] rounded-[100%] -ml-5 mt-3' src={user.profile_image ? API_URL + '/' + user.profile_image : DefaultImage} alt="" />
          </div>
          <InputEdit type="contact_person" handleChange={handleChange} input={formData.contact_person} handleSubmit={submit} />

          <div>

            <div className='py-5 px-4'>
              <p className='text-[10px] tracking-wide text-[#3b4a54] '>
                This is not your username or pin. This name will be visible to your contacts
              </p>
            </div>

          </div>
          <InputEdit type="bio" handleChange={handleChange} input={formData.bio} handleSubmit={submit} />
        </div>

        <div onClick={logoutUser} className='flex items-center justify-center mt-5 cursor-pointer shadow-2xl'>
          <IoMdLogOut className='text-[#e44d4d] w-[27px] h-[23px]' />
          <h6 className='text-[17px] text-[#e44d4d] font-semibold'>Logout</h6>
        </div>
      </div>
    </div>
  )
}

export default Profile