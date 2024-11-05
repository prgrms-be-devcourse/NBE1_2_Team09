package com.grepp.nbe1_2_team09.domain.repository.event.eventlocationrepo;

import com.grepp.nbe1_2_team09.domain.entity.event.Event;
import com.grepp.nbe1_2_team09.domain.entity.event.EventLocation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface EventLocationRepositoryCustom {
    List<EventLocation> findByEventAndDate(Event event, LocalDate date);

    boolean existsByEventIdAndVisitTimes(Long eventId, LocalDateTime visitStartTime, LocalDateTime visitEndTime);

}
