package com.cardeasy.backend.serializers;

import com.cardeasy.backend.models.AbstractEntity;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class AbstractEntitySerializer extends StdSerializer<AbstractEntity> {
    public AbstractEntitySerializer() {
        this(null);
    }
    public AbstractEntitySerializer(Class<AbstractEntity> t) {
        super(t);
    }

    @Override
    public void serialize(
            AbstractEntity abstractEntity,
            JsonGenerator generator,
            SerializerProvider provider)
            throws IOException, JsonProcessingException {

        generator.writeObject(abstractEntity.getId());
    }

}
