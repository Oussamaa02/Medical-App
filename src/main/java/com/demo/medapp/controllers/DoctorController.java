package com.demo.medapp.controllers;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @GetMapping
    public String get() {
        return "GET:: doctor controller";
    }
    @PostMapping
    public String post() {
        return "POST:: doctor controller";
    }
    @PutMapping
    public String put() {
        return "PUT:: doctor controller";
    }
    @DeleteMapping
    public String delete() {
        return "DELETE:: doctor controller";
    }
}
