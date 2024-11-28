package com.example.loginApp.controller;

import com.example.loginApp.model.User;
import com.example.loginApp.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpSession;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private HttpSession session;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser() {
        User user = new User();
        user.setUsername("testuser");

        when(userService.registerUser(any(User.class))).thenReturn(user);

        ResponseEntity<?> response = userController.registerUser(user);
        assertEquals(OK, response.getStatusCode());
    }

    @Test
    void testLoginUser() {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password");

        when(userService.loginUser("testuser", "password")).thenReturn(user);

        ResponseEntity<?> response = userController.loginUser(user, session);
        assertEquals(OK, response.getStatusCode());
    }
}
