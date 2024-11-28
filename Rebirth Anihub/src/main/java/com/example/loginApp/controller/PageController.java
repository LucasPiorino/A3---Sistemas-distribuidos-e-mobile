package com.example.loginApp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String index() {
        return "index"; // Renderiza index.html
    }

    @GetMapping("/search")
    public String search() {
        return "search"; // Renderiza search.html
    }

    @GetMapping("/register")
    public String register() {
        return "register"; // Renderiza register.html
    }

    @GetMapping("/login")
    public String login() {
        return "login.html"; // Renderiza login.html
    }

    @GetMapping("/anime-details")
    public String animeDetails() {
        return "anime-details.html"; // Renderiza anime-details.html
    }

    @GetMapping("/favoritos")
    public String favoritos() {
        return "favoritos.html"; // Renderiza favoritos.html
    }

    @GetMapping("/curriculo")
    public String curriculo() {
        return "curriculo.html"; // Renderiza favoritos.html
    }

    @GetMapping("/LP")
    public String lp() {
        return "LP.html"; // Renderiza LP.html
    }
}
