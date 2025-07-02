package com.foodie1.controller;

import com.foodie1.config.jwt.JwtResponse;
import com.foodie1.config.service.JwtService;
import com.foodie1.dto.request.UserRegisterRequest;

import com.foodie1.model.Role;
import com.foodie1.model.User;
import com.foodie1.service.role.IRoleService;
import com.foodie1.service.user.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private IUserService userService;

    @Autowired
    private IRoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtService.generateTokenLogin(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User currentUser = userService.findByUsername(user.getUsername());
            return ResponseEntity.ok(new JwtResponse(
                currentUser.getId(),
                jwt,
                userDetails.getUsername(),
                userDetails.getUsername(),
                userDetails.getAuthorities()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Tên đăng nhập hoặc mật khẩu không đúng");
        }
    }

    @PostMapping("/api/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegisterRequest registerRequest) {
        if (userService.findByUsername(registerRequest.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Tên đăng nhập đã tồn tại!");
        }
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getFullName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setAddress(registerRequest.getAddress());
        Set<Role> roles = new HashSet<>();
        Role userRole = roleService.findByName("ROLE_USER");
        if (userRole == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi: Không tìm thấy vai trò người dùng!");
        }
        roles.add(userRole);
        user.setRoles(roles);
        userService.save(user);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

//    @PostMapping("/api/create-admin")
//    public ResponseEntity<?> createAdmin(@Valid @RequestBody UserRegisterRequest registerRequest) {
//        if (userService.findByUsername(registerRequest.getUsername()) != null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                .body("Tên đăng nhập đã tồn tại!");
//        }
//        User user = new User();
//        user.setUsername(registerRequest.getUsername());
//        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
//        user.setEmail(registerRequest.getEmail());
//        user.setFullName(registerRequest.getFullName());
//        user.setPhoneNumber(registerRequest.getPhoneNumber());
//        user.setAddress(registerRequest.getAddress());
//        Set<Role> roles = new HashSet<>();
//        Role adminRole = roleService.findByName("ROLE_ADMIN");
//        if (adminRole == null) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body("Lỗi: Không tìm thấy vai trò admin!");
//        }
//        roles.add(adminRole);
//        user.setRoles(roles);
//        userService.save(user);
//        return ResponseEntity.ok("Tạo tài khoản admin thành công!");
//    }
}
