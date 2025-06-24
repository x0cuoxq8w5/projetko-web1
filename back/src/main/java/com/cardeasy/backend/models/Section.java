package com.cardeasy.backend.models;

import com.cardeasy.backend.serializers.AbstractEntitySerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Table(name = "section")
@Entity(name = "Section")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Section extends AbstractEntity{
    @Column(nullable = false)
    String name;
    @OneToMany(orphanRemoval = true, cascade = CascadeType.ALL)
    List<Card> cards;
    @Column(nullable = false)
    String color;
    @ManyToOne
    @JsonSerialize(using = AbstractEntitySerializer.class)
    User user;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Card> getCards() {
        return cards;
    }

    public void setCards(List<Card> cards) {
        this.cards = cards;
    }
    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
