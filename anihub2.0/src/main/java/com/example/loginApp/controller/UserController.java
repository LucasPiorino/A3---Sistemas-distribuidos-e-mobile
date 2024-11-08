package com.example.loginApp.controller;

import com.example.loginApp.model.User;
import com.example.loginApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User newUser = userService.registerUser(user);
            return ResponseEntity.ok().body("{\"success\": true, \"message\": \"Usuário registrado com sucesso\"}");
        } catch (IllegalArgumentException e) {
            // Retorna uma resposta de erro para duplicidade de nome de usuário
            return ResponseEntity.badRequest().body("{\"success\": false, \"message\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            // Para outros erros inesperados
            return ResponseEntity.status(500).body("{\"success\": false, \"message\": \"Erro ao registrar usuário\"}");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        User user = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (user != null) {
            return ResponseEntity.ok().body("{\"success\": true, \"message\":\"Login realizado com sucesso!\"}");
        } else {
            return ResponseEntity.status(401).body("{\"success\": false, \"message\":\"Credenciais inválidas\"}");
        }
    }
}





