import React, { useState } from 'react'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { Button, Spin } from 'antd'
import { MdOutlineFileDownload } from 'react-icons/md'

const ImageDownloader = ({ imageUrl }) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const fileName = 'image.jpg'

  const downloadImage = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      saveAs(blob, fileName) // Set desired filename
      toast.success('Hình ảnh đã được tải xuống')
    } catch (error) {
      toast.error('Lỗi khi tải hình ảnh')
      console.error('Lỗi khi tải hình ảnh:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div>
      <Button
        className=''
        shape='round'
        icon={isDownloading ? '' : <MdOutlineFileDownload size='1.5rem' />}
        size={'large'}
        disabled={isDownloading}
        onClick={downloadImage}
      >
        {isDownloading ? <Spin /> : ''}
      </Button>
    </div>
  )
}

export default ImageDownloader
