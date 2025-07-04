package com.demo.medapp.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
