package com.cardeasy.backend.controllers;

import com.cardeasy.backend.dtos.CardDTO;
import com.cardeasy.backend.dtos.SectionDTO;
import com.cardeasy.backend.models.Card;
import com.cardeasy.backend.models.Section;
import com.cardeasy.backend.models.User;
import com.cardeasy.backend.services.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/section")
public class SectionController {
    @Autowired
    private SectionService sectionService;


    @PostMapping
    public ResponseEntity<Void> createSection(@RequestBody SectionDTO sectionDto, @AuthenticationPrincipal User user) {
        sectionService.createSection(sectionDto,user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Section> getSectionById(@PathVariable Long id){
        Section section = sectionService.findSectionById(id);
        return ResponseEntity.status(HttpStatus.OK).body(section);
    }


    @PutMapping("/{id}")
    public ResponseEntity<String> updateSectionById(@PathVariable Long id, @RequestBody SectionDTO section){
        sectionService.updateSection(id,section);
        return new ResponseEntity<>("Section atualizado com sucesso", HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSectionById(@PathVariable Long id){
        sectionService.deleteSection(id);
        return new ResponseEntity<>("Section deletado com sucesso", HttpStatus.NO_CONTENT);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Section>> getAllSections(){
        List<Section> sections = sectionService.findAllSections();
        return ResponseEntity.status(HttpStatus.OK).body(sections);
    }

    @GetMapping("/alluser")
    public ResponseEntity<List<Section>> getAllUserSections(@AuthenticationPrincipal User user){
        List<Section> sections = sectionService.findAllSectionsByUser(user);
        return ResponseEntity.status(HttpStatus.OK).body(sections);
    }

    @GetMapping("{id}/card/{cardId}")
    public ResponseEntity<Card> getCard(@PathVariable Long id, @PathVariable Long cardId){
        Card card = sectionService.findCard(id,cardId);
        return ResponseEntity.status(HttpStatus.OK).body(card);
    }
    @PutMapping("{id}/card/{cardId}/move/{newSectionId}")
    public ResponseEntity<String> moveCard(@PathVariable Long id, @PathVariable Long cardId, @PathVariable Long newSectionId){
        sectionService.moveCard(id,cardId,newSectionId);
        return new ResponseEntity<>("Card movido com sucesso", HttpStatus.OK);
    }

    @PostMapping("/{id}/card")
    public ResponseEntity<Void> createCard(@PathVariable Long id, @RequestBody CardDTO cardDto){
        sectionService.addCardToSection(id,cardDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    @PutMapping("{id}/card/{cardId}")
    public ResponseEntity<String> updateCard(@PathVariable Long id, @PathVariable Long cardId, @RequestBody CardDTO cardDto){
        sectionService.updateCard(id,cardId,cardDto);
        return new ResponseEntity<>("Card atualizado com sucesso", HttpStatus.OK);
    }
    @DeleteMapping("/{id}/card/{cardId}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id, @PathVariable Long cardId) {
        sectionService.removeCardFromSection(id, cardId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
