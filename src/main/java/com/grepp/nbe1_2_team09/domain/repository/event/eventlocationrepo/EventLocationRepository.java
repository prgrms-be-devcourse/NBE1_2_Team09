package com.grepp.nbe1_2_team09.domain.repository.event.eventlocationrepo;

import com.grepp.nbe1_2_team09.domain.entity.event.Event;
import com.grepp.nbe1_2_team09.domain.entity.event.EventLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface EventLocationRepository extends JpaRepository<EventLocation, Long>,EventLocationRepositoryCustom {
    List<EventLocation> findByEvent(Event event);
}
