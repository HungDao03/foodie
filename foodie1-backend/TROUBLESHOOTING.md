# Hướng dẫn khắc phục lỗi xóa món ăn

## Lỗi 400 (Bad Request) khi xóa món ăn

### Nguyên nhân:
1. **Vấn đề quyền truy cập**: Chỉ ADMIN mới có quyền xóa món ăn
2. **Vấn đề ràng buộc dữ liệu**: Món ăn đang được sử dụng trong đơn hàng

### Giải pháp:

#### 1. Tạo tài khoản ADMIN

**Cách 1: Sử dụng API endpoint**
```bash
curl -X POST http://localhost:8080/api/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "email": "admin@foodie.com",
    "fullName": "Administrator",
    "phoneNumber": "0123456789",
    "address": "123 Admin Street, City"
  }'
```

**Cách 2: Sử dụng script Node.js**
```bash
# Cài đặt axios nếu chưa có
npm install axios

# Chạy script tạo admin
node create-admin.js
```

#### 2. Đăng nhập với tài khoản ADMIN
- Username: `admin`
- Password: `admin123`

#### 3. Kiểm tra quyền truy cập
```javascript
// Trong browser console
console.log('Current user:', JSON.parse(localStorage.getItem('user')));
console.log('Is Admin:', AuthService.isAdmin());
```

#### 4. Xử lý ràng buộc dữ liệu
Nếu món ăn đang được sử dụng trong đơn hàng:
- Xóa các đơn hàng liên quan trước
- Hoặc cập nhật logic xóa để xử lý soft delete

### Kiểm tra database:
```sql
-- Kiểm tra đơn hàng chứa món ăn ID 41
SELECT * FROM orders WHERE food_item_id = 41;

-- Kiểm tra role của user
SELECT u.username, r.name as role_name 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id;
```

### Logs để debug:
```bash
# Xem logs backend
tail -f foodie1-backend/replay_pid12600.log
``` 