package com.example.loginApp.service;

import com.example.loginApp.model.Favorite;
import com.example.loginApp.repository.FavoriteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FavoriteServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;

    @InjectMocks
    private FavoriteService favoriteService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddFavorite() {
        when(favoriteRepository.existsByUserIdAndAnimeId(1, 101)).thenReturn(false);

        boolean result = favoriteService.addFavorite(1, 101);
        assertTrue(result);

        verify(favoriteRepository, times(1)).save(any(Favorite.class));
    }

    @Test
    void testRemoveFavorite() {
        when(favoriteRepository.deleteByUserIdAndAnimeId(1, 101)).thenReturn(1);

        boolean result = favoriteService.removeFavorite(1, 101);
        assertTrue(result);

        verify(favoriteRepository, times(1)).deleteByUserIdAndAnimeId(1, 101);
    }
}

