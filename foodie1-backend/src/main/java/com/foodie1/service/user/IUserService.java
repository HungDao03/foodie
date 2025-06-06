package com.foodie1.service.user;


import com.foodie1.model.User;
import com.foodie1.service.IGenericService;
import org.springframework.security.core.userdetails.UserDetails;

public interface IUserService extends IGenericService<User> {
    UserDetails loadUserByUsername(String username);
    User findByUsername(String username);
}
