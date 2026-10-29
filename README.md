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

