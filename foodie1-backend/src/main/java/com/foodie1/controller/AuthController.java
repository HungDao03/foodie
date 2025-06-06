package com.foodie1.controller;

import com.foodie1.config.jwt.JwtResponse;
import com.foodie1.config.service.JwtService;
import com.foodie1.dto.RegisterRequest;
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

import java.util.HashSet;
import java.util.Set;

@RestController
@CrossOrigin(
        origins = "*",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
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
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        // Check if username already exists
        if (userService.findByUsername(registerRequest.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Tên đăng nhập đã tồn tại!");
        }

        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getFullName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setAddress(registerRequest.getAddress());

        // Set default role as ROLE_USER
        Set<Role> roles = new HashSet<>();
        Role userRole = roleService.findByName("ROLE_USER");
        if (userRole == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi: Không tìm thấy vai trò người dùng!");
        }
        roles.add(userRole);
        user.setRoles(roles);

        // Save user
        try {
            User savedUser = userService.save(user);
            
            // Generate authentication token
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequest.getUsername(), registerRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtService.generateTokenLogin(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            return ResponseEntity.ok(new JwtResponse(
                savedUser.getId(), 
                jwt, 
                userDetails.getUsername(), 
                userDetails.getUsername(), 
                userDetails.getAuthorities()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi lưu người dùng: " + e.getMessage());
        }
    }
}
