// UserService.java
package com.minzu.service;
import com.minzu.entity.User;

public interface UserService {
    User login(String username, String password);
    boolean register(User user);
    User getUserById(Integer id);
    boolean updateUser(User user);
}
