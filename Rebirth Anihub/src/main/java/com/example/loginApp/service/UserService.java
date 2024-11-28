package com.example.loginApp.service;

import com.example.loginApp.model.User;
import com.example.loginApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // Verifica se o username já existe no banco de dados
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Nome de usuário já existe");
        }
        
        return userRepository.save(user);
    }

    public User loginUser(String username, String password) {
        // Retorna o usuário se as credenciais coincidirem, ou null se não houver correspondência
        return userRepository.findFirstByUsernameAndPassword(username, password).orElse(null);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}



