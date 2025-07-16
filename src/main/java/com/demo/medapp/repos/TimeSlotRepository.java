package com.demo.medapp.repos;

import com.demo.medapp.models.Doctor;
import com.demo.medapp.models.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.print.Doc;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface TimeSlotRepository extends JpaRepository<TimeSlot,Long> {
    Optional<TimeSlot> findByStartTime(LocalTime startTime);

    @Query("SELECT t FROM TimeSlot t JOIN t.doctors d WHERE d.email = :email")
    List<TimeSlot> findByDoctorEmail(String email);

    Optional<TimeSlot> findByStartTimeAndDoctorsEmail(LocalTime startTime, String email);

    Optional<TimeSlot> findByStartTimeAndDoctorsId(LocalTime startTime, long id);


    @Query("SELECT t FROM TimeSlot t JOIN t.doctors d WHERE d.id = :id")
    List<TimeSlot> findByDoctorId(long id);

}