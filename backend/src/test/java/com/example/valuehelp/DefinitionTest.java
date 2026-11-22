package com.example.valuehelp;

import com.example.valuehelp.registry.*;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

class DefinitionTest {
    @Test
    void enumCatalogKeepsAllApiIdsAndSupportsTypedLookup() {
        var registry = new Registry();
        assertEquals(40, ValueHelpType.values().length);
        assertEquals(40, registry.registeredIds().size());
        for (var type : ValueHelpType.values()) {
            assertEquals(type.name(), type.definition().metadata().id());
            assertSame(type.definition(), registry.get(type));
            assertSame(type.definition(), registry.get(type.name().toLowerCase(Locale.ROOT)));
        }
        assertThrows(NoSuchElementException.class, () -> registry.get("unknown"));
    }
}
