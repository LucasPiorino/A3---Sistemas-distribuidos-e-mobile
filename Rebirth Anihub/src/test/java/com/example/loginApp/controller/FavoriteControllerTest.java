package com.example.loginApp.controller;

import com.example.loginApp.model.Favorite;
import com.example.loginApp.model.User;
import com.example.loginApp.repository.FavoriteRepository;
import com.example.loginApp.service.FavoriteService;
import com.example.loginApp.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpSession;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.*;

class FavoriteControllerTest {

    @Mock
    private FavoriteService favoriteService;

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private UserService userService;

    @Mock
    private HttpSession session;

    @InjectMocks
    private FavoriteController favoriteController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddFavorite() {
        Map<String, Integer> payload = Map.of("userId", 1, "animeId", 101);
        when(favoriteService.addFavorite(1, 101)).thenReturn(true);

        ResponseEntity<?> response = favoriteController.addFavorite(payload);
        assertEquals(OK, response.getStatusCode());
        assertTrue((Boolean) ((Map<?, ?>) response.getBody()).get("success"));
    }

    @Test
    void testRemoveFavorite() {
        Map<String, Integer> payload = Map.of("userId", 1, "animeId", 101);
        when(favoriteService.removeFavorite(1, 101)).thenReturn(true);

        ResponseEntity<?> response = favoriteController.removeFavorite(payload);
        assertEquals(OK, response.getStatusCode());
        assertTrue((Boolean) ((Map<?, ?>) response.getBody()).get("success"));
    }

    @Test
    void testIsFavorite() {
        when(favoriteService.isFavorite(1, 101)).thenReturn(true);

        ResponseEntity<Boolean> response = favoriteController.isFavorite(1, 101);
        assertEquals(OK, response.getStatusCode());
        assertTrue(response.getBody());
    }

    @Test
    void testGetFavoritesByUser_Unauthorized() {
        when(session.getAttribute("username")).thenReturn(null);

        ResponseEntity<?> response = favoriteController.getFavoritesByUser(session);
        assertEquals(UNAUTHORIZED, response.getStatusCode());
        assertEquals("Usuário não está logado.", response.getBody());
    }

    @Test
    void testGetFavoritesByUser_ValidUser() {
        when(session.getAttribute("username")).thenReturn("testuser");
        User user = new User();
        user.setId(1L);
        when(userService.findByUsername("testuser")).thenReturn(user);
        when(favoriteRepository.findByUserId(1)).thenReturn(List.of(new Favorite(1, 101), new Favorite(1, 102)));

        ResponseEntity<?> response = favoriteController.getFavoritesByUser(session);
        assertEquals(OK, response.getStatusCode());
        assertEquals(List.of(101, 102), response.getBody());
    }
}
