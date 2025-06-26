package com.cardeasy.backend.services;

import com.cardeasy.backend.dtos.CardDTO;
import com.cardeasy.backend.models.Card;
import com.cardeasy.backend.models.Section;
import com.cardeasy.backend.repositories.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CardService {
    @Autowired
    private CardRepository cardRepository;

    public Card createCard(CardDTO cardDTO, Section section) {
        Card card = Card.builder()
                .name(cardDTO.name())
                .description(cardDTO.description())
                .color(cardDTO.color())
                .creationDate(LocalDateTime.now())
                .section(section)
                .build();
        cardRepository.save(card);
        return card;
    }
    public Card findCardById(Long id) {
        return cardRepository.findById(id).orElseThrow(() -> new RuntimeException("Card not found"));
    }

    public void updateCard(Long id, CardDTO cardDTO) {
        Card card = findCardById(id);
        if (cardDTO.name() != null) card.setName(cardDTO.name());
        if (cardDTO.description() != null) card.setDescription(cardDTO.description());
        if (cardDTO.color() != null) card.setColor(cardDTO.color());
        cardRepository.save(card);
    }

    public void moveCard(Section oldSection, Section newSection, Card card) {
            oldSection.getCards().remove(card);
            newSection.getCards().add(card);
            card.setSection(newSection);
            cardRepository.save(card);
    }


    public void deleteCard(Long id) {
        cardRepository.delete(findCardById(id));
    }
}
