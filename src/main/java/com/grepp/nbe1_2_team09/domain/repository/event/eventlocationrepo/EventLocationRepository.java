package com.grepp.nbe1_2_team09.domain.repository.event.eventlocationrepo;

import com.grepp.nbe1_2_team09.domain.entity.event.Event;
import com.grepp.nbe1_2_team09.domain.entity.event.EventLocation;
import com.grepp.nbe1_2_team09.domain.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EventLocationRepository extends JpaRepository<EventLocation, Long>,EventLocationRepositoryCustom {
    List<EventLocation> findByEvent(Event event);
}
