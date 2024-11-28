package com.example.loginApp.repository;

import com.example.loginApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findFirstByUsernameAndPassword(String username, String password);

    // Novo método para buscar por username
    Optional<User> findByUsername(String username);
}


