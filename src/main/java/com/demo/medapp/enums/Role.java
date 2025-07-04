package com.demo.medapp.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import static com.demo.medapp.enums.Permission.ADMIN_CREATE;
import static com.demo.medapp.enums.Permission.ADMIN_DELETE;
import static com.demo.medapp.enums.Permission.ADMIN_READ;
import static com.demo.medapp.enums.Permission.ADMIN_UPDATE;
import static com.demo.medapp.enums.Permission.DOCTOR_CREATE;
import static com.demo.medapp.enums.Permission.DOCTOR_DELETE;
import static com.demo.medapp.enums.Permission.DOCTOR_READ;
import static com.demo.medapp.enums.Permission.DOCTOR_UPDATE;
import static com.demo.medapp.enums.Permission.PATIENT_CREATE;
import static com.demo.medapp.enums.Permission.PATIENT_DELETE;
import static com.demo.medapp.enums.Permission.PATIENT_READ;
import static com.demo.medapp.enums.Permission.PATIENT_UPDATE;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@RequiredArgsConstructor
public enum Role {
    ADMIN(
            Set.of(
                    ADMIN_READ,
                    ADMIN_UPDATE,
                    ADMIN_DELETE,
                    ADMIN_CREATE,
                    DOCTOR_READ,
                    DOCTOR_UPDATE,
                    DOCTOR_DELETE,
                    DOCTOR_CREATE,
                    PATIENT_READ,
                    PATIENT_UPDATE,
                    PATIENT_DELETE,
                    PATIENT_CREATE
            )
    ),
    DOCTOR(
            Set.of(
                    DOCTOR_READ,
                    DOCTOR_UPDATE,
                    DOCTOR_DELETE,
                    DOCTOR_CREATE
            )
    ),

    PATIENT(
            Set.of(
                    PATIENT_READ,
                    PATIENT_UPDATE,
                    PATIENT_DELETE,
                    PATIENT_CREATE
            )
    )

    ;

    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
