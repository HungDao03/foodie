package com.foodie1.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Cấu hình để cho phép truy cập các file tĩnh (ảnh) từ bên ngoài
 * Ví dụ: http://localhost:8080/uploads/ten-file-anh.jpg
 */
@Configuration
public class FileStorageConfig implements WebMvcConfigurer {
    
    /**
     * Phương thức này map đường dẫn /uploads/** tới thư mục uploads/ trong project
     * - Khi có request tới /uploads/abc.jpg
     * - Spring sẽ tìm file abc.jpg trong thư mục uploads/
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")  // URL pattern để truy cập file
                .addResourceLocations("file:uploads/"); // Thư mục thực tế chứa file
        registry.addResourceHandler("/uploads/avatar/**")
                .addResourceLocations("file:uploads/avatar/");
    }

} 