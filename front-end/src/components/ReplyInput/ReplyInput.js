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
            className='text-[15px] border block text-base py-3 hover:bg-[#334155b7] border-none bg-[#334155] w-full resize-none outline-none rounded-full px-4 ps-6 text-[#ffffff] placeholder:text-[#ffffff] transition duration-300 ease-in-out'
          />

          <div className='flex gap-2 justify-end mt-2.5'>
            <button
              className='rounded-full px-5 py-2.5 text-sm btn-pink bg-hover_dark hover:bg-slate-700 text-white-600 border border-gray-700'
              onClick={onReplyCancel}
            >
              Huỷ
            </button>
            <button
              className='btn-pink rounded-full px-5 py-2.5 text-sm btn-pink bg-green-600 hover:bg-green-700'
              onClick={onReplySend}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  )
}
