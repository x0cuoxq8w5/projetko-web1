package com.cardeasy.backend.services;

import com.cardeasy.backend.dtos.CardDTO;
import com.cardeasy.backend.dtos.SectionDTO;
import com.cardeasy.backend.models.Card;
import com.cardeasy.backend.models.Section;
import com.cardeasy.backend.models.User;
import com.cardeasy.backend.repositories.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SectionService {
    @Autowired
    SectionRepository sectionRepository;
    @Autowired
    CardService cardService;

    public void createSection(SectionDTO sectionDTO, User user) {
        Section newSection = Section.builder()
                .name(sectionDTO.name())
                .color(sectionDTO.color())
                .user(user)
                .cards(new ArrayList<>())
                .build();
        sectionRepository.save(newSection);
    }


    public void addCardToSection(Long id, CardDTO cardDTO)  {
            Section section = findSectionById(id);
            Card card = cardService.createCard(cardDTO,section);
            section.getCards().add(card);
            sectionRepository.save(section);
    }

    public void removeCardFromSection(Long id, Long idCard)  {
        cardService.deleteCard(idCard);
    }

    public Section findSectionById(Long id)  {
        return sectionRepository.findById(id).orElseThrow(() -> new RuntimeException("Seção não encontrada"));
    }

    public void updateSection(Long id, SectionDTO sectionDTO) {
            Section updatingsection = findSectionById(id);
            if (updatingsection == null) {
                throw new RuntimeException("Seção não encontrado");
            }
            if (sectionDTO.name() != null) updatingsection.setName(sectionDTO.name());
            if (sectionDTO.color() != null) updatingsection.setColor(sectionDTO.color());
            sectionRepository.save(updatingsection);
        }

    public void deleteSection(Long id) {
            findSectionById(id);
            sectionRepository.deleteById(id);
    }

    public void moveCard(Long sectionId, Long cardId, Long newSectionId) {
        Section oldSection = findSectionById(sectionId);
        Section newSection = findSectionById(newSectionId);
        Card card = cardService.findCardById(cardId);
        if(card.getSection() == oldSection) {
            cardService.moveCard(oldSection, newSection, card);
            sectionRepository.save(oldSection);
            sectionRepository.save(newSection);
        }
        else throw new RuntimeException("Card não pertence a essa seção!");
    }

    public void updateCard(Long sectionId, Long cardId, CardDTO cardDTO) {
        Card card = cardService.findCardById(cardId);
        if (card.getSection().getId().equals(sectionId)) {
            cardService.updateCard(cardId, cardDTO);
        }
        else throw new RuntimeException("Card não pertence a essa seção!");
    }

    public List<Section> findAllSections() {
        return sectionRepository.findAll();
    }

    public List<Section> findAllSectionsByUser(User user) {
        return sectionRepository.findByUser(user);
    }

    public Card findCard(Long id, Long cardId) {
        Card card = cardService.findCardById(cardId);
        if (card.getSection().getId().equals(id)) {
            return card;
        }
        else {
            throw new RuntimeException("Card não pertence a essa seção!");
        }
    }
}
