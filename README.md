# Hệ thống quản lý món ăn

## 1. Thông tin sinh viên
- **MSSV:** 236028
- **Họ tên:** Trần Tiến Thân

## 2. Mô tả
Ứng dụng quản lý món ăn gồm frontend React, backend Node.js/Express và cơ sở dữ liệu MongoDB Atlas. Ứng dụng cung cấp API để truy vấn và quản lý dữ liệu món ăn.

## 3. Công nghệ
- React, Vite
- Node.js, Express
- MongoDB Atlas
- Git, GitHub
- Docker, Docker Hub
- Render

## 4. Cấu trúc dự án
- `frontend/`: Giao diện người dùng
- `backend/`: Backend API
- `backend/Dockerfile`: Cấu hình Docker cho backend
- `frontend/Dockerfile`: Cấu hình Docker cho frontend

## 5. Cơ sở dữ liệu MongoDB Atlas
- **Database:** `236028_TranTienThan`
- **Collection:** `foods`
- **Các trường dữ liệu:** `foodId`, `name`, `category`, `cuisine`, `ingredients`, `price`, `quantity`, `description`, `imageUrl`
- **Dữ liệu mẫu:** F001, F002, F003
- **Kết nối:** Sử dụng biến môi trường `MONGODB_URI`.
- **Bảo mật:** Không lưu thông tin xác thực trong repository.

### 6. Docker Hub
- **Backend image:** `krma415/backend:latest`
- **Frontend image:** `krma415/frontend:latest`

Docker Hub:
- Backend: https://hub.docker.com/r/krma415/backend
- Frontend: https://hub.docker.com/r/krma415/frontend
