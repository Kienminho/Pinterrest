import { Label, Sidebar } from 'flowbite-react'
import { Input, Radio, Spin, DatePicker, Upload } from 'antd'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { getUserByEmail, updateUserInfo, uploadFiles } from '../../store/apiRequest'
import { useDispatch, useSelector } from 'react-redux'
import { CreateAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { updateAvatar, updateState } from '../../store/slices/UserSlice'
import toast from 'react-hot-toast'
import './Setting.css'
import { MailOutlined, UserOutlined } from '@ant-design/icons'
import { HiTable, HiUser, HiViewBoards } from 'react-icons/hi'
import { MdDriveFileRenameOutline } from 'react-icons/md'

import { BiBuoy } from 'react-icons/bi'
import ImgCrop from 'antd-img-crop'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { NavLink } from 'react-router-dom'
dayjs.extend(customParseFormat)

const Setting = () => {
  const dispatch = useDispatch()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectGender, setSelectGender] = useState('')
  const user = useSelector((state) => state.Auth.login?.currentUser)
  const accessToken_daniel = user?.data?.AccessToken
  const [loading, setLoading] = useState(false)
  const [loadingAvt, setLoadingAvt] = useState(false)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  let axiosJWT = CreateAxios(user, dispatch, loginSuccess)
  const isGenderSelected = (value) => selectGender === value
  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY']

  const [fileList, setFileList] = useState([])
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }
  const onPreview = async (file) => {
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }
  const [userData, setUserData] = useState({
    FullName: '',
    UserName: '',
    Email: '',
    Gender: '',
    Birthday: selectedDate
  })

  const handleChangeAvatar = async (e) => {
    const File = fileList[0].originFileObj
    try {
      setLoadingAvt(true)
      // Gọi hàm uploadFiles để tải file lên
      const uploadData = await uploadFiles([File], dispatch, accessToken_daniel, axiosJWT)

      // Kiểm tra xem việc tải lên file có thành công hay không
      if (uploadData) {
        // Lấy đường dẫn của file đã tải lên
        const newAvatarPath = uploadData.ThumbnailPath

        // Gọi API cập nhật avatar sử dụng đường dẫn mới
        const updateAvatarData = {
          newAvatar: newAvatarPath
        }

        const updateResponse = await axiosJWT.put(
          `${process.env.REACT_APP_API_URL}/user/update-avatar`,
          updateAvatarData,
          {
            headers: { authorization: `Bearer ${accessToken_daniel}` }
          }
        )
        if (updateResponse.data.statusCode === 200) {
          toast.success('Thay đổi avatar thành công!')
          dispatch(updateAvatar(newAvatarPath))
          setFileList([])
          setLoadingAvt(false)
        } else {
          toast.error('Thay đổi avatar thất bại!')
          setLoadingAvt(false)
        }
      } else {
        toast.error('Thay đổi avatar thất bại!')
        setLoadingAvt(false)
      }
    } catch (error) {
      console.log('Xảy ra lỗi khi thực hiện tải lên và cập nhật avatar:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setUserData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  //  Xử lý submit Save
  const handleSave = async () => {
    try {
      setLoadingUpdate(true)
      const userCurrentEmail = user.data.Email
      const userCurrent = await getUserByEmail(userCurrentEmail, accessToken_daniel, axiosJWT)
      const updateBody = {
        FullName: userData.FullName,
        UserName: userData.UserName,
        Email: userData.Email,
        Gender: selectGender,
        Birthday: selectedDate !== '' ? selectedDate : userCurrent.data.Birthday
      }

      const updateBodyWithOutBirthday = {
        FullName: userData.FullName,
        UserName: userData.UserName,
        Email: userData.Email,
        Gender: selectGender
      }

      const res = await updateUserInfo(updateBody, accessToken_daniel, axiosJWT)
      if (res.statusCode === 200) {
        // Gửi action để cập nhật thông tin người dùng trong Redux Toolkit
        dispatch(updateState(updateBodyWithOutBirthday))
        toast.success('Cập nhật thông tin thành công')
        setLoadingUpdate(false)
      } else {
        toast.error('Đã xảy ra lỗi khi cập nhật thông tin')
        setLoadingUpdate(false)
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi cập nhật thông tin')
      setLoadingUpdate(false)
    }
  }

  // Xử lý submit Huỷ
  const handleCancel = async () => {
    const userCurrentEmail = user.data.Email
    const userCurrent = await getUserByEmail(userCurrentEmail, accessToken_daniel, axiosJWT)

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

  // Lấy thông tin người dùng từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const userCurrentEmail = user.data.Email
        const userCurrent = await getUserByEmail(userCurrentEmail, accessToken_daniel, axiosJWT)

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
        // setSelectedDate(selectedDate)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error('Lỗi khi lấy thông tin người dùng', error)
      }
    }
    fetchData()
  }, [user, fileList])

  const onChangeDate = (_, dateStr) => {
    setUserData((prevState) => ({
      ...prevState,
      Birthday: dateStr
    }))
    setSelectedDate(_.$d)
  }

  const onChangeRadio = (e) => {
    setSelectGender(e.target.value)
  }

  return (
    <>
      {/* Phan binh thuong */}
      <div className='flex flex-col md:flex-row gap-5 lg:gap-10 font-roboto'>
        <Sidebar className='ml-3 mt-[2%]' aria-label='Sidebar with content separator example'>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <NavLink to='/settings'>
                <Sidebar.Item className='font-medium text-dark_color' icon={HiUser}>
                  Thông tin người dùng
                </Sidebar.Item>
              </NavLink>

              <NavLink to='/settings/category'>
                <Sidebar.Item className='font-medium text-dark_color' icon={HiTable}>
                  Chọn chủ đề quan tâm
                </Sidebar.Item>
              </NavLink>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Item className='font-medium text-dark_color' href='#' icon={HiViewBoards}>
                Tài liệu
              </Sidebar.Item>
              <Sidebar.Item className='font-medium text-dark_color' href='#' icon={BiBuoy}>
                Hỗ trợ
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
        <div className='min-h-fit py-2 lg:px-40 flex items-center justify-center rounded-xl '>
          <div className='container max-w-screen-lg mx-auto relative'>
            {loading || loadingAvt || loadingUpdate ? (
              <div className='absolute left-0 right-0 z-50 bg-white bg-opacity-50 min-h-screen'>
                <Spin className='px-64 z-60 absolute top-1/3' size='large' />
              </div>
            ) : (
              ''
            )}
            <div className='rounded-xl p-4 px-4 md:p-10 '>
              <div className='grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-1'>
                <div className='text-gray-700 mb-6'>
                  <p className='text-xl md:text-3xl font-medium mb-3'>Chỉnh sửa hồ sơ</p>
                  <p className='text-base'>Thực hiện thay đổi thông tin cá nhân hoặc loại tài khoản của bạn..</p>
                </div>
                <div className='lg:col-span-2'>
                  <div className='grid gap-4 grid-cols-1'>
                    {/* Avatar */}
                    <div className='flex gap-7 items-center'>
                      <img
                        src={userData.Avatar}
                        className='-mt-2 h-12 w-12 sm:h-[100px] sm:w-[100px] rounded-full aspect-square	'
                        alt='avatar'
                      />
                      <ImgCrop rotationSlider modalTitle='Chỉnh sửa hình ảnh' modalCancel='Huỷ' modalOk='Lưu'>
                        <Upload
                          action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                          listType='picture-circle'
                          fileList={fileList}
                          onChange={onChange}
                          onPreview={onPreview}
                          value={userData.Avatar}
                        >
                          {fileList.length === 0 && '+ Tải lên'}
                        </Upload>
                      </ImgCrop>
                      <button className='btn-greysave text-[15px] shrink-0' onClick={handleChangeAvatar}>
                        Lưu Avatar
                      </button>
                    </div>
                    {/* Fullname */}
                    <div className='md:col-span-5 mb-4'>
                      <div className='mb-2 block'>
                        <Label htmlFor='full_name' className='text-base' value='Họ và Tên' />
                      </div>
                      <Input
                        size='large'
                        name='FullName'
                        prefix={<MdDriveFileRenameOutline />}
                        placeholder='Thêm họ tên của bạn...'
                        value={userData.FullName}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Username */}
                    <div className='md:col-span-5 mb-4'>
                      <div className='mb-2 block'>
                        <Label htmlFor='username' className='text-base' value='Tên người dùng' />
                      </div>
                      <Input
                        size='large'
                        name='UserName'
                        prefix={<UserOutlined />}
                        value={userData.UserName}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Email */}
                    <div className='md:col-span-5 mb-4'>
                      <div className='mb-2 block'>
                        <Label htmlFor='email' className='text-base' value='Địa chỉ Email' />
                      </div>
                      <Input
                        disabled={true}
                        size='large'
                        prefix={<MailOutlined />}
                        value={userData.Email}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Birthday */}
                    <div className='md:col-span-5 mb-4'>
                      <div className='mb-2 block'>
                        <Label htmlFor='birthday' className='text-base' value='Ngày sinh' />
                      </div>
                      <DatePicker
                        size='large'
                        className='block'
                        format={dateFormatList[0]}
                        value={dayjs(userData.Birthday, dateFormatList[0])}
                        onChange={onChangeDate}
                      />
                    </div>

                    {/* Gender */}
                    <div className='md:col-span-5 mb-4'>
                      <Radio.Group size='large' onChange={onChangeRadio} value={selectGender}>
                        <Radio value={'Nam'} checked={isGenderSelected('Nam')}>
                          Nam
                        </Radio>
                        <Radio value={'Nữ'} checked={isGenderSelected('Nữ')}>
                          Nữ
                        </Radio>
                        <Radio value={'Khác'} checked={isGenderSelected('Khác')}>
                          Khác
                        </Radio>
                      </Radio.Group>
                    </div>

                    <div className='md:col-span-5 text-right mt-3'>
                      <div className='inline-flex items-end gap-2'>
                        <button
                          className='btn-upload rounded-full px-6 py-3.5 text-base bg-zinc-300/60 hover:bg-zinc-300/90 transition duration-300 ease-in-out text-dark_color'
                          onClick={handleCancel}
                        >
                          Huỷ
                        </button>
                        <button className='btn-upload rounded-full px-6 py-3.5 text-base' onClick={handleSave}>
                          Lưu
                        </button>
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
