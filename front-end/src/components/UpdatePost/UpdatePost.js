import { Button, Label, TextInput, ToggleSwitch } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { updatePost } from '../../store/apiRequest'
import { useDispatch, useSelector } from 'react-redux'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { FaRegEdit } from 'react-icons/fa'
import { Image, Modal, Switch } from 'antd'
import InputField from '../Input/InputField'
import './UpdatePost.css'

export default function UpdatePost({ id, Title, Description, IsComment, ImageSrc }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(Title)
  const [description, setDescription] = useState(Description)
  const [allowComment, setAllowComment] = useState(IsComment)
  console.log(allowComment)

  const user = useSelector((state) => state.Auth.login?.currentUser)
  const dispatch = useDispatch()
  let axiosJWT = createAxios(user, dispatch, loginSuccess)
  const accessToken_daniel = user?.data?.AccessToken

  const handleToggleSwitchChange = (newValue) => {
    setAllowComment(newValue)
  }

  const handleSave = async () => {
    const newData = { id, Title: title.trim(), Description: description.trim(), IsComment: allowComment }
    console.log(newData)
    try {
      await updatePost(newData, accessToken_daniel, axiosJWT)
      onCloseModal()
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error.message)
    }
  }

  function onCloseModal() {
    setOpen(false)
  }

  useEffect(() => {}, [open])

  return (
    <>
      <FaRegEdit
        size='1.4rem'
        color='#d9d9d9'
        className='pointer-events-auto cursor-pointer shrink-0 hover:opacity-70 transition-opacity duration-200'
        onClick={() => setOpen(true)}
      />
      <Modal
        title='Cập nhật bài viết của bạn'
        centered
        open={open}
        okText='Lưu thay đổi'
        cancelText='Hủy'
        onOk={handleSave}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        <div className='edit-form-container grid grid-cols-3 gap-5'>
          <div className='part1 flex flex-col gap-10 col-span-2'>
            <div className='flex gap-20'>
              <div className='mb-2 block'>
                <label className='flex flex-col text-dark_color text-base font-medium gap-2 capitalize'>Tiêu đề</label>
              </div>
              <InputField
                name={'Title'}
                id={'pinTitle'}
                handleChange={(event) => setTitle(event.target.value)}
                value={title}
                placeholder='Thêm tiêu đề...'
              />
            </div>

            <div className='flex gap-20'>
              <label className='flex flex-col text-dark_color text-base font-medium gap-2 capitalize w-[73px]'>
                Mô tả
              </label>
              <textarea
                type='text'
                name='Description'
                id='pinDesc'
                value={description}
                rows={4}
                placeholder='Thêm mô tả chi tiết'
                className='border-[#cdcdcd] placeholder:text-gray-400 px-4 py-2 ps-5 text-base text-gray-900 rounded-xl bg-gray-50 hover:ring-indigo-300 focus:ring-indigo-400 focus:border-indigo-400 focus:border-1 focus:ring-1 resize-none font-normal outline-none block w-full border-1'
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className='flex gap-11'>
              <label className='flex flex-col text-dark_color text-base font-medium gap-2 capitalize w-[90px]'>
                Bình luận
              </label>
              {/* <Switch checked={allowComment} onChange={handleToggleSwitchChange} /> */}
              <ToggleSwitch color='indigo' checked={allowComment} onChange={handleToggleSwitchChange} />
            </div>
          </div>
          <div className='part2 col-span-1'>
            <Image
              width={300}
              // height={120}
              className='rounded-3xl'
              src={ImageSrc}
              alt='preview-img-upload'
              preview={true}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
