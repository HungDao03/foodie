Use foodie1;

-- Categories
INSERT INTO categories (name) VALUES ('Đồ ăn');
INSERT INTO categories (name) VALUES ('Đồ uống');

-- Roles
INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');

-- Users (password cần mã hóa thực tế)
INSERT INTO users (username, password, role_id) VALUES ('user1', '$2a$10$XoL...hashedPassword...', 1);
INSERT INTO users (username, password, role_id) VALUES ('admin1', '$2a$10$XoL...hashedPassword...', 2);

-- Food Items
INSERT INTO food_items (name, price, discountPrice, deliveryTime, restaurant, category_id)
VALUES ('Trà Sữa TocoToco', 29000, 25000, 15, 'Nguyễn Huệ', 2);
INSERT INTO food_items (name, price, discountPrice, deliveryTime, restaurant, category_id)
VALUES ('Vịt 29 - Vịt Quay Bắc Kinh', 68000, 55000, 35, 'Vịt Quay Bắc Kinh', 1);
INSERT INTO food_items (name, price, discountPrice, deliveryTime, restaurant, category_id)
VALUES ('Anh Béo Quán - Bún Bò Nam Bộ', 40000, 35000, 30, 'Anh Béo Quán', 1);
INSERT INTO food_items (name, price, discountPrice, deliveryTime, restaurant, category_id)
VALUES ('Bún Thủy - Trân Châu Đậu', 36000, 30000, 25, 'Trân Nhất Đậu', 1);
INSERT INTO food_items (name, price, discountPrice, deliveryTime, restaurant, category_id)
VALUES ('Cocktail Trái Cây', 45000, 40000, 20, 'Bar XYZ', 2);

-- Orders
INSERT INTO orders (user_id, foodItem_id, status, orderTime)
VALUES (1, 1, 'PENDING', '2025-06-04 21:17:00');
INSERT INTO orders (user_id, foodItem_id, status, orderTime)
VALUES (1, 2, 'CONFIRMED', '2025-06-04 21:16:00');
INSERT INTO orders (user_id, foodItem_id, status, orderTime)
VALUES (2, 3, 'DELIVERED', '2025-06-04 21:15:00');