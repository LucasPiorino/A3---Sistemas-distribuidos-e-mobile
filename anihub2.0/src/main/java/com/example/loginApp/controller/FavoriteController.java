package com.example.loginApp.controller;

import com.example.loginApp.service.FavoriteService;
import com.example.loginApp.model.Favorite;
import com.example.loginApp.model.User;
import com.example.loginApp.repository.FavoriteRepository;
import com.example.loginApp.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public ResponseEntity<?> addFavorite(@RequestBody Map<String, Integer> payload) {
        int userId = payload.get("userId");
        int animeId = payload.get("animeId");
        boolean success = favoriteService.addFavorite(userId, animeId);
        return ResponseEntity.ok(Collections.singletonMap("success", success));
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeFavorite(@RequestBody Map<String, Integer> payload) {
        int userId = payload.get("userId");
        int animeId = payload.get("animeId");
        boolean success = favoriteService.removeFavorite(userId, animeId);
        return ResponseEntity.ok(Collections.singletonMap("success", success));
    }

    @GetMapping
    public ResponseEntity<Boolean> isFavorite(@RequestParam int userId, @RequestParam int animeId) {
        boolean isFavorite = favoriteService.isFavorite(userId, animeId);
        return ResponseEntity.ok(isFavorite);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getFavoritesByUser(HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não está logado.");
        }

        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
        }

        List<Favorite> favorites = favoriteRepository.findByUserId(user.getId().intValue());
        List<Integer> animeIds = favorites.stream()
                .map(Favorite::getAnimeId)
                .toList();

        return ResponseEntity.ok(animeIds);
    }
}

