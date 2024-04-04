import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { createMessage, getConversationByUser } from '../../store/apiRequest'
import { CreateAxios } from '../../createInstance'
import { ProfileImage } from '../../components/ProfileImage/ProfileImage'
import toast from 'react-hot-toast'
import { Spin } from 'antd'
import { SearchAndResults } from '../../components/SearchAndResults/SearchAndResults'

const Messenger = () => {
  const dispatch = useDispatch()
  const userInitial = useSelector((state) => state.Auth.login?.currentUser)
  let axiosJWT = CreateAxios(userInitial, dispatch)
  const accessToken_daniel = userInitial?.data?.AccessToken
  const [loadingMsg, setLoadingMsg] = useState(false)
  const [loadingList, setLoadingList] = useState(false)
  const userReal = useSelector((state) => state.User)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})
  const [message, setMessage] = useState('')

  const [socket, setSocket] = useState(null)
  const messageRef = useRef(null)

  useEffect(() => {
    //wss://api-pinterrest.up.railway.app
    setSocket(
      io(`wss://api-pinterrest.up.railway.app/`, {
        path: '/socket/',
        transports: ['websocket', 'polling'] // use WebSocket first, if available
      })
    )
  }, [])

  useEffect(() => {
    socket?.emit('join', userReal?._id)
    socket?.on('getUsers', (users) => {
      console.log('active users: ', users)
    })
    socket?.on('getMessage', (data) => {
      setMessages((prev) => ({
        ...prev,
        messages: [...prev.messages, { message: data.data, user: { ...data.user, _id: data.user.id } }]
      }))
    })
    socket?.on('disconnect', () => {
      console.log('Disconnected from server')
    })
    return () => socket?.disconnect() // Cleanup on unmount
  }, [socket])

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages?.messages])

  // fetch conversation của thằng user hiện tại
  useEffect(() => {
    const fetchConversations = async () => {
      setLoadingList(true)
      const res = await getConversationByUser(accessToken_daniel, axiosJWT)
      const resData = res.data
      if (res.statusCode === 200) {
        setConversations(resData)
        setLoadingList(false)
      } else {
        console.log('error: ', resData)
        setLoadingList(false)
      }
    }
    fetchConversations()
  }, [])

  const handleConversationCreated = () => {
    // fetch lại danh sách conversation
    const fetchConversations = async () => {
      const res = await getConversationByUser(accessToken_daniel, axiosJWT)
      const resData = res.data
      if (res.statusCode === 200) {
        setConversations(resData)
      } else {
        console.log('error: ', resData)
      }
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
      if (res.data.statusCode === 200) {
        setMessages({ messages: resData, receiver, conversationId })
        setLoadingMsg(false)
      } else {
        setLoadingMsg(false)
      }
    } catch (error) {
      setLoadingMsg(false)
      console.log(error)
    }
  }

  const sendMessage = async () => {
    setMessage('')
    socket?.emit('sendMessage', {
      senderId: userReal?._id,
      receiverId: messages?.receiver?._id,
      message,
      conversationId: messages?.conversationId
    })
    // Gọi hàm createMessage để lưu tin nhắn vào cơ sở dữ liệu
    const resData = await createMessage(
      messages?.conversationId,
      userReal?._id,
      messages?.receiver?._id,
      message,
      accessToken_daniel,
      axiosJWT
    )
    if (resData.statusCode === 200) {
      toast.success('Tin nhắn gửi thành công')
    } else {
      toast.error('Gửi tin nhắn thất bại')
    }
  }

  // Xử lý members trước khi truyền vào hàm map
  const processedConversations = conversations.map(({ _id, members }) => {
    const receiverIndex = members.findIndex((member) => member._id !== userReal._id)
    const receiver = receiverIndex !== -1 ? members[receiverIndex] : null
    return {
      conversationId: _id,
      receiver
    }
  })

  // console.log('check array message:', messages)
  // console.log(conversations)
  // console.log(processedConversations)

  return (
    <div className='w-screen md:flex font-inter items-center md:justify-center bg-dark_blue'>
      <div className='md:w-[30%] lg:w-[27%] xl:w-[23%] px-8 py-5 overflow-scroll bg-light_blue shadow-md rounded-l-2xl my-10 h-[50rem]'>
        <div className='text-white text-2xl mb-4 font-bold'>Chats</div>
        <SearchAndResults
          onConversationCreated={handleConversationCreated}
          conversations={conversations}
          fetchMessages={fetchMessages}
        />
        <div className='mt-5'>
          <div>
            {loadingList ? (
              <div className='flex flex-col absolute top-[45%] ml-[10%]'>
                <Spin size='large' />
              </div>
            ) : processedConversations.length > 0 ? (
              processedConversations.map(({ conversationId, receiver }) => {
                return (
                  <div
                    key={conversationId}
                    className='flex items-center p-2 hover:bg-[#384454] cursor-pointer hover:rounded-xl text-[#ffffff]'
                  >
                    <div
                      className='cursor-pointer flex items-center'
                      onClick={() => fetchMessages(conversationId, accessToken_daniel, axiosJWT, receiver)}
                    >
                      <div className='receiver-image rounded-full w-16 h-16 aspect-square overflow-hidden shrink-0'>
                        <ProfileImage src={receiver?.Avatar} alt='receiver-avt' />
                      </div>
                      <div className='ml-4 font-medium flex flex-col gap-2'>
                        <p className='text-base'>{receiver?.FullName}</p>
                        {/* <p className='text-[15px]'>@{receiver?.UserName}</p> */}
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
      <div className='md:w-[60%] lg:w-[57%] xl:w-[53%] flex flex-col items-center border-gray-700 border-l-2 bg-light_blue shadow-md rounded-r-2xl h-[50rem] my-10'>
        {messages?.receiver && (
          <div className='w-full border-b-[1.5px] border-gray-700 h-[50px] flex items-center px-6 py-10'>
            <div className='receiver-image rounded-full w-12 h-12 aspect-square overflow-hidden shrink-0 cursor-pointer'>
              <ProfileImage src={messages?.receiver?.Avatar} alt='receiver-avt' />
            </div>
            <div className='ml-6 mr-auto font-medium text-[#ffffff] flex flex-col gap-0.5'>
              <p className='text-lg font-semibold'>
                {messages?.receiver?.FullName ? messages?.receiver?.FullName : messages?.receiver?.UserName}
              </p>
              <p className='text-sm text-[#22c55e]'>Online</p>
            </div>
          </div>
        )}
        <div className='h-[80%] w-full overflow-scroll shadow-sm'>
          <div className='p-12'>
            {/* Kiểm tra xem dữ liệu đã được tải hoàn toàn chưa */}
            {loadingMsg ? (
              <div className='flex flex-col gap-3 items-center justify-center ml-[40%] xl:ml-[30%] absolute inset-0 text-[#ffffffb3]'>
                <span className=''>Đang tải tin nhắn...</span>
                <Spin size='large' />
              </div>
            ) : messages?.messages?.length >= 0 ? (
              messages.messages.map(({ message, user }) => (
                <div
                  ref={messageRef}
                  key={message._id}
                  className={`flex mb-6 ${user?._id === userReal?._id ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Hiển thị avatar của sender bên trái */}
                  {user?._id !== userReal?._id && (
                    <div className='mr-2'>
                      <img src={messages?.receiver?.Avatar} alt='Sender Avatar' className='w-8 h-8 rounded-full' />
                    </div>
                  )}
                  <div
                    className={`font-medium ${
                      user?._id === userReal?._id
                        ? 'max-w-sm rounded-[20px] bg-gradient-to-tr from-sky-500 to-blue-500 px-4 py-2 text-white shadow'
                        : 'px-4 py-2 rounded-[20px] max-w-sm bg-[#334150] text-white shadow'
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
              <div className='text-center text-base font-medium mt-24 text-white'>
                Không có tin nhắn hoặc không có cuộc trò chuyện nào được chọn
              </div>
            )}
          </div>
        </div>

        {messages?.receiver && (
          <div className='relative flex w-full px-10 gap-2 border-t-2 border-gray-700'>
            <input
              placeholder='Nhập tin nhắn...'
              rows='1'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage()
                }
              }}
              class='bg-[#334155] w-full resize-none outline-none rounded-full p-3 px-4 text-[#ffffff] placeholder:text-[#ffffff] mt-4'
            />

            <div
              className={`p-2 flex justify-center items-center mt-4 cursor-pointer bg-light rounded-full hover:bg-[#384454] ${
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
                stroke='#fff'
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
      {/* <div className='xl:w-[10%] w-0 md:h-screen overflow-scroll'></div> */}
    </div>
  )
}

export default Messenger
