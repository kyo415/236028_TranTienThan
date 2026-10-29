# Hệ thống quản lý món ăn

## 1. Thông tin sinh viên

- **MSSV:** 236028
- **Họ tên:** Trần Tiến Thân

## 2. Mô tả

Ứng dụng quản lý món ăn được xây dựng bằng React và Vite cho frontend, Node.js và Express cho backend, sử dụng MongoDB Atlas làm cơ sở dữ liệu.

## 3. Công nghệ sử dụng

- React, Vite
- Node.js, Express
- MongoDB Atlas
- Git, GitHub
- Docker, Docker Hub
- Render

## 4. Cấu trúc dự án

- `frontend/`: Mã nguồn giao diện người dùng.
- `backend/`: Mã nguồn Backend API.
- `frontend/Dockerfile`: Cấu hình Docker cho frontend.
- `backend/Dockerfile`: Cấu hình Docker cho backend.

## 5. Cơ sở dữ liệu MongoDB Atlas

- **Database:** `236028_TranTienThan`
- **Collection:** `foods`
- **Các trường dữ liệu:** `foodId`, `name`, `category`, `cuisine`, `ingredients`, `price`, `quantity`, `description`, `imageUrl`.
- **Dữ liệu mẫu:** F001, F002, F003.
- **Kết nối:** Sử dụng biến môi trường `MONGODB_URI`.
- **Bảo mật:** Không lưu thông tin xác thực hoặc chuỗi kết nối chứa thông tin nhạy cảm trong repository.

## 6. Docker Hub

- **Backend image:** `krma415/backend:latest`
- **Frontend image:** `krma415/frontend:latest`

Liên kết Docker Hub:

- [Backend image](https://hub.docker.com/r/krma415/backend)
- [Frontend image](https://hub.docker.com/r/krma415/frontend)

## 7. Triển khai Frontend trên Render

- **Nền tảng:** Render
- **URL:** https://foods-frontend-236028.onrender.com/

Frontend cung cấp giao diện người dùng để tương tác với hệ thống quản lý món ăn.

## 8. Triển khai Backend trên Render

### 8.1. Thông tin triển khai

- **Nền tảng:** Render
- **Backend API:** https://foods-backend-236028.onrender.com/
- **Health check:** https://foods-backend-236028.onrender.com/health
- **API danh sách món ăn:** https://foods-backend-236028.onrender.com/api/foods

### 8.2. Cấu hình môi trường

Backend sử dụng các biến môi trường để cấu hình ứng dụng và kết nối cơ sở dữ liệu:

- `PORT`: Cổng chạy Backend.
- `MONGODB_URI`: Chuỗi kết nối MongoDB Atlas.
- `DB_NAME`: Tên cơ sở dữ liệu `236028_TranTienThan`.
- `CLIENT_URL`: URL frontend được phép truy cập Backend API.

Các biến môi trường được cấu hình trong môi trường triển khai trên Render. Không lưu thông tin xác thực hoặc chuỗi kết nối nhạy cảm trong mã nguồn công khai.

### 8.3. Kiểm tra Backend

Sau khi triển khai, thực hiện kiểm tra:

- Truy cập endpoint `/health` để xác nhận Backend hoạt động.
- Truy cập endpoint `/api/foods` để kiểm tra khả năng lấy danh sách món ăn từ cơ sở dữ liệu MongoDB Atlas.

Kết quả kiểm tra: Health check hoạt động bình thường và API danh sách món ăn trả về dữ liệu.