package com.example.loginApp.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

class PageControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/templates/");
        viewResolver.setSuffix(".html");

        mockMvc = MockMvcBuilders.standaloneSetup(new PageController())
                .setViewResolvers(viewResolver)
                .build();
    }

    @Test
    void testIndex() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(view().name("index"));
    }

    @Test
    void testRegister() throws Exception {
        mockMvc.perform(get("/register"))
                .andExpect(view().name("register"));
    }

    @Test
    void testSearch() throws Exception {
        mockMvc.perform(get("/search"))
                .andExpect(view().name("search"));
    }
    @Test
    void testLogin() throws Exception {
        mockMvc.perform(get("/login"))
                .andExpect(view().name("login.html"));
    }

    @Test
    void testAnimeDetails() throws Exception {
        mockMvc.perform(get("/anime-details"))
                .andExpect(view().name("anime-details.html"));
    }

    @Test
    void testFavoritos() throws Exception {
        mockMvc.perform(get("/favoritos"))
                .andExpect(view().name("favoritos.html"));
    }
}
