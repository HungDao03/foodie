package com.foodie1.controller;

import com.foodie1.dto.request.UserUpdateRequest;
import com.foodie1.dto.response.UserResponse;
import com.foodie1.model.User;
import com.foodie1.service.user.IUserService;
import com.foodie1.dto.mapper.EntityDtoMapper;
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
import java.util.stream.Collectors;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private IUserService userService;

    @Autowired
    private EntityDtoMapper mapper;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapper.toUserResponse(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateUserProfile(@Valid @RequestBody UserUpdateRequest req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username);
        if (currentUser == null) {
            return ResponseEntity.notFound().build();
        }
        currentUser.setFullName(req.getFullName());
        currentUser.setEmail(req.getEmail());
        currentUser.setPhoneNumber(req.getPhoneNumber());
        currentUser.setAddress(req.getAddress());
        currentUser.setAvatar(req.getAvatar());
        User savedUser = userService.save(currentUser);
        return ResponseEntity.ok(mapper.toUserResponse(savedUser));
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            Path uploadPath = Paths.get(uploadDir, "avatar");
            if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
                try {
                    String oldFileName = user.getAvatar();
                    Path oldFilePath = uploadPath.resolve(oldFileName);
                    Files.deleteIfExists(oldFilePath);
                } catch (Exception e) {}
            }
            String fileExtension = getFileExtension(file.getOriginalFilename());
            String newFileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(newFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            user.setAvatar(newFileName);
            User savedUser = userService.save(user);
            return ResponseEntity.ok().body(newFileName);
        } catch (IOException e) {
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