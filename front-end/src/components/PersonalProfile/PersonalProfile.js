import './PersonalProfile.css'

const PersonalProfile = () => (
  <div>
    <div className='mt-5 edit-container'>
      <h3>
        <b>Quản lý tài khoản</b>
      </h3>
      <p className='mb-4'>
        Chỉnh sửa thông tin cá nhân cơ bản của bạn để cải thiện đề xuất. Thông tin này là riêng tư và sẽ không hiển thị
        trong hồ sơ công khai của bạn.
      </p>
      <h5>Tài khoản của bạn</h5>
      <div className='form-group col-md-6'>
        <label>
          <small>Email - Riêng Tư</small>
        </label>
        <input
          type='email'
          className='form-control input-fields'
          id='email'
          // value={publicProfile.Username}
          // onChange={(e) => setPublicProfile({ ...publicProfile, Username: e.target.value })}
          placeholder='Email của bạn'
        />
      </div>
      <h5 className='mt-4'>Thông tin cá nhân</h5>
      <div class='form-group mt-3'>
        <label>
          <small>Ngày sinh</small>
        </label>
        <input
          type='date'
          className='form-control input-fields'
          id='Birthday'
          // value={personal.Birthday}
          // onChange={(e) => setPublicProfile({ ...publicProfile, Birthday: e.target.value })}
        />
      </div>
      <div class='form-group mt-3'>
        <label>
          <small>Giới tính</small>
        </label>
        <div className='d-flex flex-row flex-wrap'>
          <div class='form-check'>
            <input class='form-check-input' type='radio' />
            <label>Nam</label>
          </div>
          <div class='form-check mx-3'>
            <input class='form-check-input' type='radio' />
            <label>Nữ</label>
          </div>
          <div class='form-check'>
            <input class='form-check-input' type='radio' />
            <label>Khác</label>
          </div>
        </div>
      </div>
      <div class='form-group mt-3'>
        <label>
          <small>Quốc gia</small>
        </label>
        <select class='form-select input-fields' style={{ height: '50px' }}>
          <option selected>Việt Nam</option>
          <option value='America'>Hoa Kỳ</option>
          <option value='England'>Anh</option>
          <option value='France'>Pháp</option>
          <option value='Italia'>Ý</option>
          <option value='Spain'>Tây Ban Nha</option>
          <option value='China'>Trung Quốc</option>
          <option value='Germany'>Đức</option>
          <option value='Thailand'>Thái Lan</option>
          <option value='Korea'>Hàn Quốc</option>
          <option value='Australia'>Úc</option>
          <option value='Japan'>Nhật Bản</option>
        </select>
      </div>
      <div class='form-group mt-3'>
        <label>
          <small>Ngôn ngữ</small>
        </label>
        <select class='form-select input-fields' style={{ height: '50px' }}>
          <option selected>Tiếng Anh (Mỹ)</option>
          <option value='1'>Tiếng Việt</option>
        </select>
      </div>
    </div>
  </div>
)
export default PersonalProfile
