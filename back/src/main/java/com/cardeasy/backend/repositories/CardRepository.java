package com.cardeasy.backend.repositories;

import com.cardeasy.backend.models.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, Long> {
}
