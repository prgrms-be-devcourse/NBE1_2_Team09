package com.grepp.nbe1_2_team09.domain.service.location;

import com.grepp.nbe1_2_team09.common.exception.ExceptionMessage;
import com.grepp.nbe1_2_team09.common.exception.exceptions.LocationException;
import com.grepp.nbe1_2_team09.common.util.aop.LogExecutionTime;
import com.grepp.nbe1_2_team09.controller.location.dto.CreateLocationRequest;
import com.grepp.nbe1_2_team09.controller.location.dto.LocationDto;
import com.grepp.nbe1_2_team09.domain.entity.Location;
import com.grepp.nbe1_2_team09.domain.repository.location.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocationService {

    private final LocationRepository locationRepository;
    private final LocationCacheService locationCacheService;

    @LogExecutionTime
    @Transactional
    public LocationDto saveLocation(CreateLocationRequest locationReq) {
        //캐시 사용
        Optional<Location> existingLocation = locationCacheService.findLocationByPlaceId(locationReq.placeId());

        if (existingLocation.isPresent()) {
            return LocationDto.fromEntity(existingLocation.get());
        }
        // 중복이 없을 때만 저장
        Location savedLocation = locationRepository.save(locationReq.toEntity());
        return LocationDto.fromEntity(savedLocation);
    }


    //장소 조회
    @Transactional
    public LocationDto getLocationById(Long locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new LocationException(ExceptionMessage.LOCATION_NOT_FOUND));
        return LocationDto.fromEntity(location);
    }

    //장소 삭제
    @Transactional
    public void deleteLocationById(Long locationId) {
       locationRepository.deleteById(locationId);

    }
}
