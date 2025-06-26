package com.cardeasy.backend.models;

import com.cardeasy.backend.serializers.AbstractEntitySerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "card")
@Entity(name = "Card")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Card extends AbstractEntity {

    @Column(nullable = false)
    String name;
    @Column
    String description;
    @Column(nullable = false)
    String color;
    @Column(nullable = false)
    LocalDateTime creationDate;
    @JoinColumn(nullable = false, name="section_id")
    @ManyToOne
    @JsonSerialize(using = AbstractEntitySerializer.class)
    private Section section;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public Section getSection() {
        return section;
    }

    public void setSection(Section section) {
        this.section = section;
    }
}
