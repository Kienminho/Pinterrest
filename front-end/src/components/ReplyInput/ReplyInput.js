import TextArea from 'antd/es/input/TextArea'
import { Button } from 'flowbite-react'

export const ReplyInput = ({ isReplying, onReplyCancel, onReplySend, placeholder, replyContent, handleChange }) => {
  return (
    <>
      {isReplying && (
        <div className='mt-2 flex flex-col justify-end w-4/5 ml-[20%]'>
          <input
            id='reply'
            placeholder={placeholder || 'Trả lời...'}
            value={replyContent}
            onChange={handleChange}
            required
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onReplySend()
              }
            }}
            className='px-6 py-3.5 rounded-2xl outline-gray-200 text-gray-800 text-[15px] bg-gray-50 border border-gray-300 block w-full p-2.5'
          />

          <div className='flex gap-2 justify-end mt-2.5'>
            <button className='btn-linkhover rounded-full px-5 py-2.5 text-sm' onClick={onReplyCancel}>
              Huỷ
            </button>
            <button className='btn-save rounded-full px-5 py-2.5 text-sm' onClick={onReplySend}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  )
}
