package com.example.loginApp.controller;

import com.example.loginApp.model.User;
import com.example.loginApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User newUser = userService.registerUser(user);
            return ResponseEntity.ok().body(Map.of("success", true, "message", "Usuário registrado com sucesso"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Erro ao registrar usuário"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest, HttpSession session) {
        User user = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (user != null) {
            session.setAttribute("username", loginRequest.getUsername());
            return ResponseEntity.ok().body(Map.of("success", true, "message", "Login realizado com sucesso"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "Credenciais inválidas"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().body(Map.of("success", true, "message", "Logout realizado com sucesso"));
    }

    @GetMapping("/isLoggedIn")
    public ResponseEntity<?> isLoggedIn(HttpSession session) {
        boolean isLoggedIn = session.getAttribute("username") != null;
        return ResponseEntity.ok().body(Map.of("isLoggedIn", isLoggedIn));
    }
    
    @GetMapping("/getUserId")
    public ResponseEntity<?> getUserId(HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Usuário não está logado"));
        }

        User user = userService.findByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(Map.of("userId", user.getId()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Usuário não encontrado"));
        }
    }
    
}





