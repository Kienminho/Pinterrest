import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { createMessage, getConversationByUser } from '../../store/apiRequest'
import { createAxios } from '../../createInstance'
import { ProfileImage } from '../../components/ProfileImage/ProfileImage'
import toast from 'react-hot-toast'
import { Spin } from 'antd'
import { SearchAndResults } from '../../components/SearchAndResults/SearchAndResults'

const Messenger = () => {
  const dispatch = useDispatch()
  const userInitial = useSelector((state) => state.Auth.login?.currentUser)
  let axiosJWT = createAxios(userInitial, dispatch)
  const accessToken_daniel = userInitial?.data?.AccessToken
  const { Avatar, FullName, UserName } = useSelector((state) => state.User)
  const [loadingMsg, setLoadingMsg] = useState(false)
  const [loadingList, setLoadingList] = useState(false)
  const userReal = useSelector((state) => state.User)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})
  const [message, setMessage] = useState('')

  const [socket, setSocket] = useState(null)
  const messageRef = useRef(null)

  useEffect(() => {
    setSocket(
      io(`https://api-pinterrest.up.railway.app/`, {
        transports: ['websocket'],
        upgrade: false
      })
    )
  }, [])

  useEffect(() => {
    socket?.emit('join', userReal?._id)
    socket?.on('getUsers', (users) => {
      console.log('activeUsers :>> ', users)
    })
    socket?.on('getMessage', (data) => {
      console.log(data)
      setMessages((prev) => ({
        ...prev,
        messages: [...prev.messages, { message: data.data, user: { ...data.user, _id: data.user.id } }]
      }))
    })
  }, [socket])

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages?.messages])

  // fetch conversation của thằng user hiện tại
  useEffect(() => {
    const fetchConversations = async () => {
      setLoadingList(true)
      const res = await getConversationByUser(accessToken_daniel, axiosJWT)
      const resData = res.data
      console.log('all conv of user by Nhan: ', resData)
      setConversations(resData)
      setLoadingList(false)
    }
    fetchConversations()
  }, [])

  const handleConversationCreated = () => {
    // fetch lại danh sách conversation
    const fetchConversations = async () => {
      const res = await getConversationByUser(accessToken_daniel, axiosJWT)
      const resData = res.data
      console.log('all conv of user by Nhan: ', resData)
      setConversations(resData)
    }
    fetchConversations()
  }

  const fetchMessages = async (conversationId, accessToken, axiosJWT, receiver) => {
    try {
      setLoadingMsg(true)
      const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/message/get-message/${conversationId}`, {
        headers: { authorization: `Bearer ${accessToken}` }
      })
      const resData = res.data.data
      console.log(resData)
      setMessages({ messages: resData, receiver, conversationId })
      setLoadingMsg(false)
    } catch (error) {
      setLoadingMsg(false)
      console.log(error)
    }
  }

  console.log('check array message:', messages)

  const sendMessage = async () => {
    setMessage('')
    socket?.emit('sendMessage', {
      senderId: userReal?._id,
      receiverId: messages?.receiver?.userId,
      message,
      conversationId: messages?.conversationId
    })
    // Gọi hàm createMessage để lưu tin nhắn vào cơ sở dữ liệu
    const resData = await createMessage(
      messages?.conversationId,
      userReal?._id,
      messages?.receiver?.userId,
      message,
      accessToken_daniel,
      axiosJWT
    )
    if (resData.statusCode === 200) {
      toast.success('Tin nhắn gửi thành công')
      console.log('Message sent successfully')
    }
  }

  // Xử lý members trước khi truyền vào hàm map
  const processedConversations = conversations.map(({ _id, members }) => {
    // Kiểm tra userId của từng thành viên trong cuộc trò chuyện
    const receiverIndex = members.findIndex((member) => member.userId !== userReal._id)
    const receiver = receiverIndex !== -1 ? members[receiverIndex] : null

    // Trả về một object mới chứa thông tin đã xử lý
    return {
      conversationId: _id,
      receiver
    }
  })

  console.log(conversations)
  console.log(processedConversations)

  return (
    <div className='w-screen flex font-roboto items-center justify-center'>
      <div className='w-[20%] h-screen px-8 py-5 overflow-scroll'>
        <div className='text-dark_color text-2xl mb-4 font-bold'>Chat</div>
        <SearchAndResults onConversationCreated={handleConversationCreated} conversations={conversations} />
        <div className='mt-5'>
          <div>
            {loadingList ? (
              <div className='flex flex-col absolute top-[40%] px-24'>
                <Spin size='large' />
              </div>
            ) : processedConversations.length > 0 ? (
              processedConversations.map(({ conversationId, receiver }) => {
                return (
                  <div className='flex items-center py-4 hover:bg-zinc-100 cursor-pointer transition duration-300 ease-in-out hover:rounded-xl'>
                    <div
                      className='cursor-pointer flex items-center'
                      onClick={() => fetchMessages(conversationId, accessToken_daniel, axiosJWT, receiver)}
                    >
                      <div className='receiver-image rounded-full w-12 h-12 aspect-square overflow-hidden shrink-0'>
                        <ProfileImage src={receiver?.avatar} alt='receiver-avt' />
                      </div>
                      <div className='ml-4 font-medium'>
                        <h3 className='text-base'>{receiver?.fullName}</h3>
                        <p className='text-[15px] text-gray-600'>@{receiver?.useName}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className='text-center text-base font-medium mt-24'>Chưa có cuộc trò chuyện nào</div>
            )}
          </div>
        </div>
      </div>
      <div className='w-[45%] h-screen flex flex-col items-center border-zinc-200 border-[1.5px]'>
        {messages?.receiver?.fullName && (
          <div className='w-full border-b-[1.5px] border-zinc-100 h-[50px] flex items-center px-10 py-10'>
            <div className='receiver-image rounded-full w-12 h-12 aspect-square overflow-hidden shrink-0 cursor-pointer'>
              <ProfileImage src={messages?.receiver?.avatar} alt='receiver-avt' />
            </div>
            <div className='ml-6 mr-auto font-medium'>
              <h3 className='text-lg'>{messages?.receiver?.fullName}</h3>
              <p className='text-base text-gray-600'>@{messages?.receiver?.useName}</p>
            </div>
          </div>
        )}
        <div className='h-[70%] w-full overflow-scroll shadow-sm'>
          <div className='p-12'>
            {/* Kiểm tra xem dữ liệu đã được tải hoàn toàn chưa */}
            {loadingMsg ? (
              <div className='flex flex-col gap-3 items-center justify-center absolute inset-0'>
                <span className=''>Đang tải tin nhắn, vui lòng đợi...</span>
                <Spin size='large' />
              </div>
            ) : messages?.messages?.length > 0 ? (
              messages.messages.map(({ message, user }) => (
                <div
                  key={message._id}
                  className={`flex mb-6 ${user?._id === userReal?._id ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Hiển thị avatar của sender bên trái */}
                  {user?._id !== userReal?._id && (
                    <div className='mr-2'>
                      <img src={user?.Avatar} alt='Sender Avatar' className='w-8 h-8 rounded-full' />
                    </div>
                  )}
                  <div
                    className={`w-fit rounded-b-xl p-3 ${
                      user?._id === userReal?._id
                        ? 'bg-[#8879fa] text-[#ffffff] rounded-tl-xl ml-auto'
                        : 'bg-[#e7e7e7] text-black rounded-tr-xl'
                    }`}
                  >
                    {message.message}
                  </div>
                  {/* Hiển thị avatar của receiver bên phải */}
                  {user?._id === userReal?._id && (
                    <div className='ml-2'>
                      <img src={userReal?.Avatar} alt='Receiver Avatar' className='w-8 h-8 rounded-full' />
                    </div>
                  )}
                </div>
              ))
            ) : (
              // Nếu không có tin nhắn, hiển thị thông báo
              <div className='text-center text-base font-medium mt-24'>
                Không có tin nhắn hoặc không có cuộc trò chuyện nào được chọn
              </div>
            )}
          </div>
        </div>

        {messages?.receiver && (
          <div className='px-14 py-7 w-full flex items-center'>
            <input
              placeholder='Nhập tin nhắn...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='ps-5 rounded-xl bg-gray-50 outline-none block w-full border-0 py-3.5 text-dark_color shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:font-normal focus:ring-inset focus:ring-[#818cf8] focus:ring-2 hover:ring-inset hover:ring-1 hover:ring-[#818cf8] font-normal'
            />
            <div
              className={`ml-4 p-2 cursor-pointer bg-light rounded-full hover:bg-zinc-100 ${
                !message && 'pointer-events-none'
              }`}
              onClick={() => sendMessage()}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                class='icon icon-tabler icon-tabler-send'
                width='31'
                height='31'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='#2c3e50'
                fill='none'
                stroke-linecap='round'
                stroke-linejoin='round'
              >
                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                <line x1='10' y1='14' x2='21' y2='3' />
                <path d='M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5' />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className='w-[20%] h-screen overflow-scroll'></div>
    </div>
  )
}

export default Messenger
