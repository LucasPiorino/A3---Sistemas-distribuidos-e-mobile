package com.example.loginApp.service;

import com.example.loginApp.model.Favorite;
import com.example.loginApp.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    public boolean addFavorite(int userId, int animeId) {
        if (!favoriteRepository.existsByUserIdAndAnimeId(userId, animeId)) {
            Favorite favorite = new Favorite(userId, animeId);
            favoriteRepository.save(favorite);
            return true;
        }
        return false;
    }

    @Transactional // Adiciona a transação para a operação de remoção
    public boolean removeFavorite(int userId, int animeId) {
        return favoriteRepository.deleteByUserIdAndAnimeId(userId, animeId) > 0;
    }

    public boolean isFavorite(int userId, int animeId) {
        return favoriteRepository.existsByUserIdAndAnimeId(userId, animeId);
    }
}


