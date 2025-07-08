package com.demo.medapp.controllers;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patient")
public class PatientController {

    @GetMapping
    public String get() {
        return "GET:: patient controller";
    }
    @PostMapping
    public String post() {
        return "POST:: patient controller";
    }
    @PutMapping
    public String put() {
        return "PUT:: patient controller";
    }
    @DeleteMapping
    public String delete() {
        return "DELETE:: patient controller";
    }
}
