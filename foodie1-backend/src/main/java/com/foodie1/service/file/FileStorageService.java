package com.foodie1.service.file;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Service xử lý các thao tác với file như lưu và xóa
 */
@Service
public class FileStorageService {
    // Đường dẫn tới thư mục lưu file
    private final Path root = Paths.get("uploads");

    /**
     * Constructor - Tạo thư mục uploads nếu chưa tồn tại
     */
    public FileStorageService() {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    /**
     * Lưu file vào thư mục uploads
     * @param file File cần lưu (từ MultipartFile của Spring)
     * @return Tên file đã được lưu (đã được đổi tên để tránh trùng lặp)
     */
    public String saveFile(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return null;
            }

            // Tạo tên file ngẫu nhiên để tránh trùng lặp
            // Ví dụ: ảnh gốc là food.jpg -> lưu thành 123e4567-e89b-12d3-a456-426614174000.jpg
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;

            // Lưu file vào thư mục uploads
            Files.copy(file.getInputStream(), this.root.resolve(filename));
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    /**
     * Xóa file từ thư mục uploads
     * @param filename Tên file cần xóa
     */
    public void deleteFile(String filename) {
        try {
            if (filename != null) {
                Path file = root.resolve(filename);
                Files.deleteIfExists(file);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
} 