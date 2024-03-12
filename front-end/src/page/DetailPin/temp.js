{
  /* Hiển thị danh sách bình luận */
}
{
  comments.map((comment) => (
    <div
      key={comment._id}
      className={`comment-section flex flex-col w-full gap-2 ${comment.replies.length > 0 ? 'mt-5' : 'mt-3'}`}
      style={{ '--depth': 0 }}
    >
      <div className='comment__body flex gap-1.5'>
        <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden shrink-0'>
          <ProfileImage src={comment.author.avatar} alt='strangers' />
        </div>
        <div className='creator-name whitespace-nowrap overflow-hidden text-ellipsis flex flex-col gap-0.5'>
          <div className='flex items-center gap-1.5'>
            <div className='text-red-700 font-bold'>{comment.author.name}</div>
            <div className='text-base text-dark_color'>{comment.content}</div>
          </div>

          <div className='flex gap-5 items-center'>
            <div className='cursor-pointer text-[#5F5F5F] text-[15px]'>
              <div>{formatRelativeTime(comment.createdAt)}</div>
            </div>

            <div
              onClick={() => handleReplyClick(comment._id)}
              className='cursor-pointer text-[#767676] text-[15px] font-medium'
            >
              {'Trả lời'}
            </div>
          </div>
        </div>
      </div>

      {/* Ô input trả lời 1 bình luận */}
      <div className='w-4/5 ml-[20%]'>
        {isReplying && selectedCommentId === comment._id && (
          <div>
            <Textarea
              id='reply'
              placeholder='Trả lời...'
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              required
              autoFocus
              className='px-4 py-3.5 rounded-full resize-none outline-none text-gray-800 border border-gray-200 focus:ring-gray-300 focus:border-0 focus:bg-white'
              rows={1}
            />
            <div className='flex gap-2 justify-end mt-3'>
              <Button pill color='light' onClick={handleCancelReply}>
                Huỷ
              </Button>
              <Button pill onClick={handleSendReply}>
                Gửi
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Danh sách trả lời của 1 bình luận: cấp 1 */}
      {comment.replies.map((reply) => (
        <div
          key={reply._id}
          className='reply-comment-section flex flex-col gap-1 ml-10'
          depth={1}
          style={{ '--depth': 1 }}
        >
          <div className='reply__body flex gap-1.5'>
            <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden shrink-0'>
              <ProfileImage src={reply.author.avatar} alt='stranger' />
            </div>
            <div className='creator-name whitespace-nowrap flex flex-col gap-0.5'>
              <div className='flex items-center gap-1.5'>
                <div className='text-red-700 font-semibold'>{reply.author.name}</div>
                <div className='text-blue-700 font-semibold'>@{comment.author.name}</div>
                <div className='text-base text-dark_color'>{reply.content}</div>
              </div>
              <div className='flex gap-5 items-center'>
                <div className='cursor-pointer text-[#5F5F5F] text-[15px]'>{formatRelativeTime(reply.createdAt)}</div>
                <div
                  onClick={() => handleReplyToReplyClick(reply._id)}
                  className='cursor-pointer text-[#767676] text-[15px] font-medium'
                >
                  {'Trả lời 1'}
                </div>
              </div>
            </div>
          </div>
          {/* Ô input trả lời của 1 trả lời */}
          <div className='w-4/5 ml-[10%]'>
            {isReplyingToReply && selectedReplyId === reply._id && (
              <div>
                <Textarea
                  id='reply'
                  placeholder={`Trả lời 1 ${reply.author.name}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  required
                  autoFocus
                  className='mt-2 ml-5 px-24 py-3.5 ps-5 rounded-full resize-none outline-none text-gray-800 border border-gray-200 focus:ring-gray-300 focus:border-0 focus:bg-white'
                  rows={1}
                />
                <div className='flex gap-2 justify-end mt-3'>
                  <Button pill color='light' onClick={handleCancelReply1}>
                    Huỷ
                  </Button>
                  <Button pill onClick={handleSendReply1}>
                    Gửi
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Danh sách trả lời của 1 trả lời: cấp 2 */}
          {reply.replies.map((nestedReply) => (
            <div
              key={nestedReply._id}
              depth={2}
              style={{ '--depth': 2 }}
              className={`reply-reply-section flex flex-col mt-1 mb-3 ml-10`}
            >
              <div className='nested__body flex gap-1.5'>
                <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden shrink-0'>
                  <ProfileImage src={nestedReply.author.avatar} alt='stranger' />
                </div>
                <div className='creator-name whitespace-nowrap text-ellipsis flex flex-col  '>
                  <div className='flex items-center gap-1'>
                    <div className='text-red-700 font-semibold'>{nestedReply.author.name}</div>
                    <div className='text-blue-700 font-semibold'>@{reply.author.name}</div>
                    <div>{nestedReply.content}</div>
                  </div>
                  <div className='flex gap-5 items-center'>
                    <div className='cursor-pointer text-[#5F5F5F] text-[15px]'>
                      {formatRelativeTime(nestedReply.createdAt)}
                    </div>
                    <div
                      onClick={() => handleReplyToNestedReplyClick(nestedReply._id)}
                      className='cursor-pointer text-[#767676] text-[15px] font-medium'
                    >
                      {'Trả lời 2'}
                    </div>
                  </div>
                </div>
              </div>
              {/* toi day roi la 3 cap */}
              {/* Ô input trả lời của 1 trả lời cấp 2 */}
              <div className='w-4/5 ml-[10%]'>
                {isReplyingToNestedReply && selectedNestedReplyId === nestedReply._id && (
                  <div>
                    <Textarea
                      id='nested-reply'
                      placeholder={`Trả lời 2 ${nestedReply.author.name}...`}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      required
                      autoFocus
                      className='mt-2 ml-5 px-24 py-3.5 ps-5 rounded-full resize-none outline-none text-gray-800 border border-gray-200 focus:ring-gray-300 focus:border-0 focus:bg-white'
                      rows={1}
                    />
                    <div className='flex gap-2 justify-end mt-3'>
                      <Button pill color='light' onClick={handleCancelReply2}>
                        Huỷ
                      </Button>
                      <Button pill onClick={handleSendReply2}>
                        Gửi
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {nestedReply.replies.map((nestedReply1, index) => (
                <div
                  key={nestedReply1._id}
                  depth={2}
                  style={{ '--depth': 2 }}
                  className={`reply-reply-section flex flex-col ${index === 0 ? 'mt-3' : ''} mb-3`}
                >
                  <div className='nested__body flex gap-1.5'>
                    <div className='creator-image rounded-full w-10 h-10 aspect-square overflow-hidden shrink-0'>
                      <ProfileImage src={nestedReply1.author.avatar} alt='stranger' />
                    </div>
                    <div className='creator-name whitespace-nowrap text-ellipsis flex flex-col  '>
                      <div className='flex items-center gap-1'>
                        <div className='text-red-700 font-semibold'>{nestedReply1.author.name}</div>
                        <div className='text-blue-700 font-semibold'>@{nestedReply.author.name}</div>
                        <div>{nestedReply1.content}</div>
                      </div>
                      <div className='flex gap-5 items-center'>
                        <div className='cursor-pointer text-[#5F5F5F] text-[15px]'>
                          {formatRelativeTime(nestedReply1.createdAt)}
                        </div>
                        <div
                          onClick={() => handleReplyToNestedReplyClick(nestedReply1._id)}
                          className='cursor-pointer text-[#767676] text-[15px] font-medium'
                        >
                          {'Trả lời 2'}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Ô input trả lời của 1 trả lời cấp 3 */}
                  <div className='w-4/5 ml-[10%]'>
                    {isReplyingToNestedReply && selectedNestedReplyId === nestedReply1._id && (
                      <div>
                        <Textarea
                          id='nested-reply'
                          placeholder={`Trả lời 3 ${nestedReply1.author.name}...`}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          required
                          autoFocus
                          className='mt-2 ml-5 px-24 py-3.5 ps-5 rounded-full resize-none outline-none text-gray-800 border border-gray-200 focus:ring-gray-300 focus:border-0 focus:bg-white'
                          rows={1}
                        />
                        <div className='flex gap-2 justify-end mt-3'>
                          <Button pill color='light' onClick={handleCancelReply2}>
                            Huỷ
                          </Button>
                          <Button pill onClick={handleSendReply2}>
                            Gửi
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  ))
}
