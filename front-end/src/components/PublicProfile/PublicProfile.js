import './PublicProfile.css'
import React, { useState } from 'react'

export default function PublicProfile() {
  const [publicProfile, setPublicProfile] = useState({
    preview: '',
    raw: '',
    fullname: '',
    about: '',
    website: '',
    username: ''
  })
  const handleChange = (e) => {
    setPublicProfile({
      preview: URL.createObjectURL(e.target.files[0]),
      raw: e.target.files[0],
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(publicProfile)
  }
  const resetInputField = () => {
    setPublicProfile({
      ...publicProfile,
      preview: '',
      raw: '',
      fullname: '',
      about: '',
      website: '',
      username: ''
    })
  }

  return (
    <div className='mt-5 edit-container'>
      <h3>
        <b>Chỉnh sửa hồ sơ</b>
        <br />
        <p class='text-muted mb-4'>
          Hãy giữ riêng tư thông tin cá nhân của bạn. Thông tin bạn thêm vào đây hiển thị cho bất kỳ ai có thể xem hồ sơ
          của bạn.
        </p>
      </h3>

      <form onSubmit={handleSubmit}>
        <small className='text-muted'>Photo</small>
        <br />
        <label htmlFor='profile-pic'>
          {publicProfile.preview ? (
            <img src={publicProfile.preview} alt='dummy' width='200px' className='rounded-circle' />
          ) : (
            <img src='../images/avatar.png' className='rounded-circle' alt='dummy' width='200px' />
          )}
        </label>
        <input type='file' id='profile-pic' style={{ display: 'none' }} onChange={handleChange} />
        <button class='btn mx-2' style={{ backgroundColor: '#f0ecec', fontWeight: 'bold', borderRadius: '20px' }}>
          Change
        </button>
        <div className='form-group col-md-12'>
          <label>
            <small>Họ và tên</small>
          </label>
          <input
            type='text'
            className='form-control input-fields'
            id='fullname'
            value={publicProfile.fullname}
            onChange={(e) => setPublicProfile({ ...publicProfile, fullname: e.target.value })}
            placeholder='Họ và tên'
          />
        </div>
        <div class='form-group col-md-12'>
          <label>
            <small>Tên người dùng</small>
          </label>
          <input
            type='text'
            class='form-control input-fields'
            id='Username'
            value={publicProfile.username}
            onChange={(e) => setPublicProfile({ ...publicProfile, username: e.target.value })}
            placeholder='Username'
          />
          <p className='text-muted footer-margin' style={{ fontSize: '11px' }}>
            www.pinterest.com/username
          </p>
        </div>
        <div class='form-group mt-3'>
          <label>
            <small>Giới thiệu</small>
          </label>
          <textarea
            class='form-control input-fields'
            id='About'
            placeholder='Kể câu chuyện của bạn'
            value={publicProfile.about}
            onChange={(e) => setPublicProfile({ ...publicProfile, about: e.target.value })}
            style={{ width: '100%', rows: '3', minHeight: '90px' }}
          />
        </div>
        <div class='form-group mt-3'>
          <div class='form-group'>
            <label>
              <small>Trang web</small>
            </label>
            <input
              type='url'
              class='form-control input-fields'
              id='Website'
              value={publicProfile.website}
              onChange={(e) => setPublicProfile({ ...publicProfile, website: e.target.value })}
              placeholder='https://www.pexels.com/vi-vn/'
            />
          </div>
        </div>
        <div style={{ marginTop: '150px' }}>
          <div class='footer py-3'>
            <button
              onClick={resetInputField}
              class='btn btn-align'
              style={{ backgroundColor: '#f0ecec', fontWeight: 'bold', borderRadius: '20px', height: '45px' }}
            >
              Thiết lập lại
            </button>
            <button
              type='submit'
              class='btn mx-1'
              style={{
                backgroundColor: '#e80424',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '20px',
                height: '45px'
              }}
            >
              Lưu
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
