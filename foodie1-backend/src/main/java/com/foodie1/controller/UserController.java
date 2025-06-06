package com.foodie1.controller;

import com.foodie1.model.User;
import com.foodie1.service.user.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private IUserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Log thông tin user để debug
        System.out.println("Getting profile for user: " + username);
        System.out.println("User avatar URL: " + user.getAvatar());
        
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody User updatedUser) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username);
        
        if (currentUser == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Update user fields
        currentUser.setFullName(updatedUser.getFullName());
        currentUser.setEmail(updatedUser.getEmail());
        currentUser.setPhoneNumber(updatedUser.getPhoneNumber());
        currentUser.setAddress(updatedUser.getAddress());
        
        User savedUser = userService.save(currentUser);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("Starting file upload process...");
            System.out.println("Upload directory configured as: " + uploadDir);

            // Lấy thông tin user hiện tại
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.findByUsername(username);

            if (user == null) {
                System.out.println("User not found: " + username);
                return ResponseEntity.notFound().build();
            }

            // Tạo đường dẫn tuyệt đối cho thư mục upload
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                System.out.println("Creating upload directory: " + uploadPath);
                Files.createDirectories(uploadPath);
            }

            // Xóa file avatar cũ nếu có
            if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
                try {
                    String oldFileName = user.getAvatar().substring(user.getAvatar().lastIndexOf("/") + 1);
                    Path oldFilePath = uploadPath.resolve(oldFileName);
                    Files.deleteIfExists(oldFilePath);
                    System.out.println("Deleted old avatar: " + oldFilePath);
                } catch (Exception e) {
                    System.out.println("Failed to delete old avatar: " + e.getMessage());
                }
            }

            // Tạo tên file mới
            String fileExtension = getFileExtension(file.getOriginalFilename());
            String newFileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(newFileName);

            System.out.println("Absolute upload path: " + uploadPath.toAbsolutePath());
            System.out.println("Saving new file to: " + filePath.toAbsolutePath());

            // Lưu file mới
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Cập nhật đường dẫn trong database
            String fileUrl = "/upload/" + newFileName;
            user.setAvatar(fileUrl);
            User savedUser = userService.save(user);

            System.out.println("File saved successfully");
            System.out.println("New avatar URL: " + fileUrl);
            System.out.println("Updated user avatar in DB: " + savedUser.getAvatar());

            return ResponseEntity.ok().body(fileUrl);
        } catch (IOException e) {
            System.err.println("Error during file upload: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Không thể upload file: " + e.getMessage());
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null) return "";
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1) return "";
        return fileName.substring(lastDotIndex);
    }
} 