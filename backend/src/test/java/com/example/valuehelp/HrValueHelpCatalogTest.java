package com.example.valuehelp;

import com.example.valuehelp.dto.SearchRequest;
import com.example.valuehelp.registry.Registry;
import com.example.valuehelp.repository.mock.MockValueHelpRepository;
import com.example.valuehelp.service.ValueHelpService;
import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class HrValueHelpCatalogTest {
    private final Registry registry = new Registry();
    private final ValueHelpService service = new ValueHelpService(registry, new MockValueHelpRepository());

    @Test
    void everyRegisteredIdHasSearchableMockDataAndResolvableKeys() {
        assertEquals(40, registry.registeredIds().size());
        for (String id : registry.registeredIds()) {
            var metadata = service.metadata(id);
            var page = service.search(id, new SearchRequest(Map.of(), 0, 10, null, null));
            assertFalse(page.items().isEmpty(), id);
            var first = page.items().get(0);
            assertNotNull(first.get(metadata.keyField()), id);
            assertNotNull(first.get(metadata.textField()), id);
            assertEquals(first, service.item(id, first.get(metadata.keyField()).toString()), id);
            for (var filter : registry.get(id).filters()) {
                assertNotNull(first.get(filter.webField()), id + "." + filter.webField());
                var filtered = service.search(id, new SearchRequest(Map.of(filter.webField(), first.get(filter.webField())), 0, 10, null, null));
                assertTrue(filtered.items().contains(first), id + "." + filter.webField());
            }
        }
    }

    @Test
    void parentFiltersRestrictDependentValues() {
        var subareas = service.search("PERSONNEL_SUBAREA", new SearchRequest(Map.of("personnelArea", "A100"), 0, 10, null, null));
        assertEquals(1, subareas.totalCount());
        assertEquals("S110", subareas.items().get(0).get("personnelSubarea"));
        var reasons = service.search("ACTION_REASON", new SearchRequest(Map.of("actionType", "A02"), 0, 10, null, null));
        assertEquals("R02", reasons.items().get(0).get("actionReason"));
    }
}
