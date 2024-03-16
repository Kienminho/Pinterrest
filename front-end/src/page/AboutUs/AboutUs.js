import { FooterLayout } from '../../components/Footer/Footer'

const AboutUs = () => {
  return (
    <>
      <div class='bg-gray-100 text-[#263c91] leading-10'>
        <div class='container mx-auto px-56 py-8 '>
          <h1 class='mb-16 text-center font-medium'>Giới thiệu về Pinspired</h1>
          <p class='text-2xl leading-10 mb-4'>
            Pinspired là gì? Pinspired là một công cụ tìm kiếm ý tưởng, chia sẻ hình ảnh trực quan như công thức nấu ăn,
            hình ảnh hoạt hình,.. trang trí nhà cửa, kết hợp với những hình ảnh sinh ra từ AI. Với rất nhiều bài đăng
            trên Pinspired, bạn có thể tìm thấy nguồn cảm hứng không ngừng. Khi bạn tìm kiếm các Ghim mà bạn yêu thích,
            bạn có thể lưu chúng vào bảng để dễ dàng sắp xếp và tìm kiếm ý tưởng của mình.
          </p>

          <h2 class='font-medium mb-5 mt-10'>Duyệt qua bảng tin được thiết kế cho bạn</h2>

          <p class='text-2xl  leading-10 mb-4'>
            Đây là nơi mà bạn có thể tìm thấy các Ghim, mà chúng tôi nghĩ rằng bạn sẽ thích, dựa trên hoạt động gần đây
            và những danh mục bạn quan tâm. Chúng tôi cũng sẽ hiển thị cho bạn các Ghim từ những người và bảng mà bạn
            đang theo dõi. Ngoài ra, bạn cũng có thể tìm kiếm các Ghim bằng cách nhập từ khóa vào thanh tìm kiếm.
          </p>

          <h2 class='font-medium mb-5 mt-10'>Tạo Ghim</h2>

          <p class='text-2xl  leading-10 mb-4'>
            Hãy tải ảnh lên từ máy tính hoặc thiết bị di động để tạo Ghim trên Pinspired. Bạn cũng có thể tạo ảnh bằng
            AI thông qua prompt, để bạn có thể thoả sức sáng tạo. Hãy thêm tiêu đề và mô tả cho mỗi Ghim bạn tạo và liên
            kết trang web nếu bạn có. Bạn có thể chỉnh sửa thông tin của Ghim bất kỳ lúc nào.
          </p>

          <h2 class='font-medium mb-5 mt-10'>Xem hồ sơ của bạn</h2>

          <p class='text-2xl leading-10 mb-6'>
            Hãy tìm tất cả các Ghim mà bạn đã lưu, hoặc bạn đã tạo trong hồ sơ của bạn. Bạn cũng có thể xem ai đang theo
            dõi bạn, cũng như những người bạn đang theo dõi chính mình.
          </p>

          <h2 class='font-medium mb-5 mt-10'>Trò chuyện với người khác</h2>

          <p class='text-2xl  leading-10 mb-4'>
            Bạn có thể tìm kiếm người dùng khác trên Pinspired và bắt đầu theo dõi họ. Bạn cũng có thể bắt đầu trò
            chuyện với họ thông qua tin nhắn riêng tư.
          </p>

          <ul class='text-xl leading-10 list-disc list-inside mb-6 ml-10'>
            <li>Đăng nhập vào tài khoản Pinspired của bạn </li>
            <li>Nhấp vào biểu tượng dấu ba chấm ở góc trên bên phải</li>
            <li>Tìm kiếm người dùng và bắt đầu cuộc trò chuyện</li>
            <li>Viết tin nhắn của bạn ở dưới cùng nơi có dòng "Nhập tin nhắn"</li>
            <li>Nhấp vào biểu tượng gửi để gửi tin nhắn của bạn</li>
          </ul>

          <p class='text-2xl  leading-10 mb-6'>
            Nhìn chung, cookie giúp chúng tôi cung cấp cho bạn một trang web tốt hơn bằng cách cho phép chúng tôi giám
            sát những trang bạn tìm thấy hữu ích còn bạn thì không. Cookie không hề cho phép chúng tôi truy cập vào máy
            tính của bạn hoặc bất kỳ thông tin nào về bạn, ngoài dữ liệu bạn chọn chia sẻ với chúng tôi.
          </p>

          <h2 class='font-medium mb-5 mt-10'>Lưu hình ảnh từ bài viết</h2>

          <p class='text-2xl  leading-10 mb-6'>
            Ghim là những dấu trang mà mọi người sẽ sử dụng để lưu những bài viết mà họ thích trên Pinpired. Khi bạn tìm
            thấy bài viết mà bạn thích, để lưu vào tường nhà bạn, hãy nhấp vào nút Lưu màu đỏ bên phải. Ngoài ra nếu bạn
            muốn tải hình ảnh về, chúng tôi cũng để sẵn nút tải hình ảnh về thiết bị của bạn.
          </p>
        </div>
      </div>
      <FooterLayout />
    </>
  )
}

export default AboutUs
