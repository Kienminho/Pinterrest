import { Button, Label, Modal, TextInput, ToggleSwitch } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { updatePost } from '../../store/apiRequest'
import { useDispatch, useSelector } from 'react-redux'
import { createAxios } from '../../createInstance'
import { loginSuccess } from '../../store/slices/AuthSlice'
import { FaRegEdit } from 'react-icons/fa'

export default function UpdatePost({ id, Title, Description, IsComment }) {
  const [openModal, setOpenModal] = useState(false)
  const [title, setTitle] = useState(Title)
  const [description, setDescription] = useState(Description)
  const [allowComment, setAllowComment] = useState(IsComment)
  console.log(allowComment)

  const user = useSelector((state) => state.Auth.login?.currentUser)
  const dispatch = useDispatch()
  let axiosJWT = createAxios(user, dispatch, loginSuccess)
  const accessToken_daniel = user?.data?.AccessToken

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
    setOpenModal(false)
  }

  useEffect(() => {}, [openModal])

  return (
    <>
      <FaRegEdit
        size='1.5rem'
        color='#e8e8e8'
        className='pointer-events-auto cursor-pointer shrink-0 hover:opacity-80 transition-opacity duration-200'
        onClick={() => setOpenModal(true)}
      />
      <Modal show={openModal} size='lg' onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className='space-y-6'>
            <h3 className='text-2xl text-center font-medium text-gray-900 dark:text-white'>
              Cập nhật bài viết của bạn
            </h3>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='title' value='Tiêu đề' />
              </div>
              <TextInput
                id='title'
                placeholder='Tiêu đề bài viết'
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='description' value='Mô tả' />
              </div>
              <TextInput
                id='description'
                placeholder='Mô tả về bài viết'
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>

            <div className='flex items-center'>
              <input
                type='checkbox'
                color='indigo'
                className='w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500'
                checked={allowComment}
                label='Cho phép bình luận'
                onChange={(event) => setAllowComment(event.target.checked)}
              />
              <div className='ml-2 block'>
                <Label htmlFor='description' value='Cho phép bình luận' />
              </div>
            </div>
            <div className='w-full flex justify-evenly'>
              <Button color='failure' onClick={handleSave}>
                Cập nhật bài viết
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
