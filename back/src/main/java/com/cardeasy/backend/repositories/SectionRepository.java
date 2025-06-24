package com.cardeasy.backend.repositories;

import com.cardeasy.backend.models.Section;
import com.cardeasy.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByUser(User user);
}
