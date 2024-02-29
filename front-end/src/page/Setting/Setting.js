import { Button, Datepicker, Label, Radio, Sidebar, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { BiBuoy } from 'react-icons/bi'
import { HiMail, HiTable, HiUser, HiViewBoards } from 'react-icons/hi'
import { getUserByEmail, updateUserInfo } from '../../store/apiRequest'
import { useDispatch, useSelector } from 'react-redux'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import toast from 'react-hot-toast'
import { updateState } from '../../store/slices/UserSlice'
import Avvvatars from 'avvvatars-react'
import UserPicUploader from '../../components/UserPicUploader/UserPicUploader'
import { ProfileImage } from '../../components/ProfileImage/ProfileImage'
import AvatarUploader from '../../components/UserPicUploader/AvatarUploader'
import './Setting.css'

const Setting = () => {
  const dispatch = useDispatch()
  const [selectedDate, setSelectedDate] = useState(false)
  const [selectGender, setSelectGender] = useState('')
  const [tempPic, setTempPic] = useState(null)
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const accessToken_daniel = user?.data?.AccessToken
  let axiosJWT = createAxios(user, dispatch, loginSuccess)
  const isGenderSelected = (value) => selectGender === value

  const [userData, setUserData] = useState({
    FullName: '',
    UserName: '',
    Email: '',
    Gender: '',
    Birthday: ''
  })

  const handleRadioClick = (event) => {
    setSelectGender(event.currentTarget.value)
  }

  const handleDatePickerChange = (selectedDate) => {
    // Đảm bảo selectedDate là một đối tượng Date
    if (selectedDate instanceof Date) {
      // Format ngày thành chuỗi theo định dạng "yyyy-MM-dd"
      const formattedDate = moment(selectedDate).format('YYYY/MM/DD')

      console.log(formattedDate)

      // Cập nhật state hoặc thực hiện các xử lý khác tùy theo yêu cầu của bạn
      setUserData((prevState) => ({
        ...prevState,
        Birthday: formattedDate
      }))
      setSelectedDate(formattedDate)
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setUserData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  //  Xử lý submit Save
  const handleSave = async () => {
    try {
      const updateBody = {
        FullName: userData.FullName,
        UserName: userData.UserName,
        Email: userData.Email,
        Gender: selectGender,
        Birthday: selectedDate
      }

      console.log(updateBody)

      await updateUserInfo(updateBody, accessToken_daniel, axiosJWT)

      // // Gửi action để cập nhật thông tin người dùng trong Redux Toolkit
      dispatch(updateState(updateBody))

      toast.success('Cập nhật thông tin thành công')
      console.log('Thông tin người dùng đã được cập nhật thành công.')
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi cập nhật thông tin')
      console.log('Đã xảy ra lỗi khi cập nhật thông tin người dùng:', error)
    }
  }

  // Xử lý submit Huỷ
  const handleCancel = async () => {
    const userCurrentEmail = user.data.Email
    const userCurrent = await getUserByEmail(userCurrentEmail, accessToken_daniel, axiosJWT)
    console.log(userCurrent)

    const formattedDate = moment(userCurrent.data.Birthday).format('DD/MM/YYYY')

    // Cập nhật state với dữ liệu từ API
    setUserData({
      FullName: userCurrent.data.FullName,
      UserName: userCurrent.data.UserName,
      Email: userCurrent.data.Email,
      Gender: userCurrent.data.Gender,
      Birthday: formattedDate
    })
    setSelectGender(userCurrent.data.Gender)
    setSelectedDate(formattedDate)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCurrentEmail = user.data.Email
        const userCurrent = await getUserByEmail(userCurrentEmail, accessToken_daniel, axiosJWT)
        console.log(userCurrent)

        const formattedDate = moment(userCurrent.data.Birthday).format('DD/MM/YYYY')

        // Cập nhật state với dữ liệu từ API
        setUserData({
          FullName: userCurrent.data.FullName,
          UserName: userCurrent.data.UserName,
          Email: userCurrent.data.Email,
          Gender: userCurrent.data.Gender,
          Avatar: userCurrent.data.Avatar,
          Birthday: formattedDate
        })
        setSelectGender(userCurrent.data.Gender)
        setSelectedDate(formattedDate)
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng', error)
      }
    }
    fetchData()
  }, [user])

  console.log(userData)

  return (
    <>
      <div className='flex gap-10'>
        <Sidebar className='ml-3 mt-10' aria-label='Sidebar with content separator example'>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href='#' icon={HiUser}>
                Thông tin người dùng
              </Sidebar.Item>
              <Sidebar.Item href='#' icon={HiTable}>
                Chính sách riêng tư
              </Sidebar.Item>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Item href='#' icon={HiViewBoards}>
                Tài liệu
              </Sidebar.Item>
              <Sidebar.Item href='#' icon={BiBuoy}>
                Hỗ trợ
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>

        <div class='min-h-fit py-2 px-48 flex items-center justify-center rounded-xl '>
          <div class='container max-w-screen-lg mx-auto'>
            <div class='rounded-xl p-4 px-4 md:p-10'>
              <div class='grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-1'>
                <div class='text-gray-700 mb-6'>
                  <h3 className='font-semibold mb-3'>Quản lý tài khoản</h3>
                  <p className='text-base'>Thực hiện thay đổi thông tin cá nhân hoặc loại tài khoản của bạn..</p>
                </div>

                <div class='lg:col-span-2'>
                  <div class='grid gap-4 gap-y-2 text-sm grid-cols-1'>
                    {/* Avatar */}
                    <div class='md:col-span-5 mb-4'>
                      <div className='mb-2 block'>
                        <Label htmlFor='avatar' className='text-base' value='Ảnh' />
                      </div>
                      <div className='flex items-center gap-4'>
                        {/* Avatar part */}
                        <div className=' profile-pic-main mb-4 flex gap-5 items-center'>
                          <div className='w-32 flex justify-center rounded-full aspect-square overflow-hidden'>
                            {tempPic ? (
                              <ProfileImage src={URL.createObjectURL(tempPic)} alt='pic' />
                            ) : (
                              <ProfileImage src={userData.Avatar} alt='pic' />
                            )}
                          </div>
                          <AvatarUploader setTempPic={(file) => setTempPic(file)} />
                        </div>

                        {/* <div>
                          {' '}
                          <Avvvatars value={userData.Email} />
                        </div> */}
                      </div>
                    </div>
                    {/* Fullname */}
                    <div class='md:col-span-5 mb-4'>
                      <div className='mb-2 block'>
                        <Label htmlFor='full_name' className='text-base' value='Họ và Tên' />
                      </div>
                      <TextInput
                        type='text'
                        name='FullName'
                        id='FullName'
                        value={userData.FullName}
                        onChange={handleInputChange}
                        placeholder='Add your full name...'
                      />
                    </div>

                    {/* Username */}
                    <div class='md:col-span-5 mb-4'>
                      <div className='mb-2 block'>
                        <Label htmlFor='username' className='text-base' value='Tên người dùng' />
                      </div>
                      <TextInput
                        type='text'
                        id='UserName'
                        name='UserName'
                        placeholder='Bonnie Green'
                        addon='@'
                        value={userData.UserName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div class='md:col-span-5 mb-4'>
                      <div className='mb-2 block'>
                        <Label htmlFor='email' className='text-base' value='Địa chỉ Email' />
                      </div>
                      <TextInput
                        disabled
                        id='Email'
                        name='Email'
                        type='email'
                        rightIcon={HiMail}
                        value={userData.Email}
                        onChange={handleInputChange}
                        placeholder='name@flowbite.com'
                        required
                      />
                    </div>

                    {/* Birthday */}
                    <div class='md:col-span-5 mb-4'>
                      <div className='mb-2 block'>
                        <Label htmlFor='birthday' className='text-base' value='Ngày sinh' />
                      </div>
                      <Datepicker
                        name='Birthday'
                        value={userData.Birthday}
                        onSelectedDateChanged={handleDatePickerChange}
                        minDate={new Date(1900, 0, 1)}
                      />
                    </div>

                    {/* Gender */}
                    <div class='md:col-span-5 mb-4'>
                      <fieldset className='flex max-w-md gap-4'>
                        <legend className='mb-3 text-base'>Giới tính</legend>
                        <div className='flex items-center gap-2'>
                          <Radio
                            id='Nam'
                            name='Gender'
                            value='Nam'
                            onChange={handleRadioClick}
                            checked={isGenderSelected('Nam')}
                          />
                          <Label htmlFor='Nam'>Nam</Label>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Radio
                            id='Nữ'
                            name='Gender'
                            value='Nữ'
                            onChange={handleRadioClick}
                            checked={isGenderSelected('Nữ')}
                          />
                          <Label htmlFor='Nữ'>Nữ</Label>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Radio
                            id='Khác'
                            name='Gender'
                            value='Khác'
                            onChange={handleRadioClick}
                            checked={isGenderSelected('Khác')}
                          />
                          <Label htmlFor='Khác'>Khác</Label>
                        </div>
                      </fieldset>
                    </div>

                    <div class='md:col-span-5 text-right mt-3'>
                      <div class='inline-flex items-end gap-2'>
                        <Button size='lg' color='indigo' pill onClick={handleCancel}>
                          Huỷ
                        </Button>
                        <Button size='lg' pill color='failure' onClick={handleSave}>
                          Lưu
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Setting
