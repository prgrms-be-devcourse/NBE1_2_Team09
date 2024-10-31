package com.grepp.nbe1_2_team09.domain.service.location;

import com.grepp.nbe1_2_team09.domain.entity.Location;
import com.grepp.nbe1_2_team09.domain.repository.location.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LocationCacheService {

    private final LocationRepository locationRepository;

    @Cacheable(value = "locationCache", key = "#placeId")
    public Optional<Location> findLocationByPlaceId(String placeId) {
        return locationRepository.findByPlaceId(placeId);
    }
}