import TextArea from 'antd/es/input/TextArea'
import { Button } from 'flowbite-react'

export const ReplyInput = ({ isReplying, onReplyCancel, onReplySend, placeholder, replyContent, handleChange }) => {
  return (
    <>
      {isReplying && (
        <div className='mt-2 flex flex-col justify-end w-4/5 ml-[20%]'>
          <textarea
            id='reply'
            placeholder={placeholder || 'Trả lời...'}
            value={replyContent}
            onChange={handleChange}
            required
            autoFocus
            className='px-6 py-3.5 rounded-2xl outline-none text-gray-800 border border-gray-200 focus:ring-gray-300 focus:border-0 focus:bg-white text-[15px]'
            rows={2}
          />

          <div className='flex gap-2 justify-end mt-2'>
            <Button pill color='light' onClick={onReplyCancel}>
              Huỷ
            </Button>
            <Button pill color='success' onClick={onReplySend}>
              Gửi
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
