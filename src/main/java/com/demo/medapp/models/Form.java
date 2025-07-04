package com.demo.medapp.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Form {
    @Id
    @GeneratedValue
    private Long id;

    @ElementCollection
    @CollectionTable(name = "form_content", joinColumns = @JoinColumn(name = "form_id"))
    @MapKeyColumn(name = "question")
    @Column(name = "answer")
    private Map<String, String> content = new HashMap<>();

    @OneToOne
    @JoinColumn (name = "appointment_id")
    private Appointment appointment;
}
