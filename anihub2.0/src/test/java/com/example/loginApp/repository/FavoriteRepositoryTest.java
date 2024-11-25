package com.example.loginApp.repository;

import com.example.loginApp.model.Favorite;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test") // Ativa o perfil de teste
class FavoriteRepositoryTest {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Test
    void testExistsByUserIdAndAnimeId() {
        Favorite favorite = new Favorite(1, 101);
        favoriteRepository.save(favorite);

        boolean exists = favoriteRepository.existsByUserIdAndAnimeId(1, 101);
        assertTrue(exists);
    }

    @Test
    void testDeleteByUserIdAndAnimeId() {
        Favorite favorite = new Favorite(1, 101);
        favoriteRepository.save(favorite);

        int deleted = favoriteRepository.deleteByUserIdAndAnimeId(1, 101);
        assertEquals(1, deleted);
    }

    @Test
    void testFindByUserId() {
        favoriteRepository.save(new Favorite(1, 101));
        favoriteRepository.save(new Favorite(1, 102));

        List<Favorite> favorites = favoriteRepository.findByUserId(1);
        assertEquals(2, favorites.size());
    }
}
