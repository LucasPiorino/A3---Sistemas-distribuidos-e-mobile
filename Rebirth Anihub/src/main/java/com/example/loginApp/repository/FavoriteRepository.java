package com.example.loginApp.repository;

import com.example.loginApp.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    boolean existsByUserIdAndAnimeId(int userId, int animeId);
    int deleteByUserIdAndAnimeId(int userId, int animeId); // Método de exclusão personalizado
    List<Favorite> findByUserId(int userId); // Método adicional
}

