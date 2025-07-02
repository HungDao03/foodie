// // Script để tạo tài khoản ADMIN
// // Chạy bằng Node.js: node create-admin.js
//
// const axios = require('axios');
//
// const adminData = {
//     username: "admin",
//     password: "admin123",
//     email: "admin@foodie.com",
//     fullName: "Administrator",
//     phoneNumber: "0123456789",
//     address: "123 Admin Street, City"
// };
//
// async function createAdmin() {
//     try {
//         const response = await axios.post('http://localhost:8080/api/create-admin', adminData);
//         console.log('✅ Tạo tài khoản admin thành công!');
//         console.log('📧 Email:', adminData.email);
//         console.log('👤 Username:', adminData.username);
//         console.log('🔑 Password:', adminData.password);
//         console.log('Response:', response.data);
//     } catch (error) {
//         console.error('❌ Lỗi khi tạo tài khoản admin:');
//         if (error.response) {
//             console.error('Status:', error.response.status);
//             console.error('Message:', error.response.data);
//         } else {
//             console.error('Error:', error.message);
//         }
//     }
// }
//
// createAdmin();