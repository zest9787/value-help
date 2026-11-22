package com.example.valuehelp.registry;

import org.springframework.stereotype.Component;
import java.util.*;
import java.util.stream.Collectors;

/** API 문자열을 Enum 카탈로그로 연결한다. 별도 등록 목록은 관리하지 않는다. */
@Component
public class Registry {
    public Definition get(ValueHelpType type) {
        return Objects.requireNonNull(type).definition();
    }

    public Definition get(String id) {
        if (id == null) throw new NoSuchElementException("Value Help ID가 필요합니다.");
        try {
            return get(ValueHelpType.valueOf(id.toUpperCase(Locale.ROOT)));
        } catch (IllegalArgumentException ex) {
            throw new NoSuchElementException("등록되지 않은 Value Help: " + id);
        }
    }

    public Set<String> registeredIds() {
        return Arrays.stream(ValueHelpType.values()).map(Enum::name).collect(Collectors.toUnmodifiableSet());
    }
}
