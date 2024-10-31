package com.grepp.nbe1_2_team09.domain.repository.location;

import com.grepp.nbe1_2_team09.domain.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByPlaceId(String placeId);
}
