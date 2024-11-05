package com.grepp.nbe1_2_team09.domain.service.event;

import com.grepp.nbe1_2_team09.common.exception.ExceptionMessage;
import com.grepp.nbe1_2_team09.common.exception.exceptions.EventException;
import com.grepp.nbe1_2_team09.common.exception.exceptions.EventLocationException;
import com.grepp.nbe1_2_team09.common.exception.exceptions.LocationException;
import com.grepp.nbe1_2_team09.controller.event.dto.AddEventLocationReq;
import com.grepp.nbe1_2_team09.controller.event.dto.EventLocationDto;
import com.grepp.nbe1_2_team09.controller.event.dto.EventLocationInfoDto;
import com.grepp.nbe1_2_team09.controller.event.dto.UpdateEventLocationReq;
import com.grepp.nbe1_2_team09.domain.entity.Location;
import com.grepp.nbe1_2_team09.domain.entity.event.Event;
import com.grepp.nbe1_2_team09.domain.entity.event.EventLocation;
import com.grepp.nbe1_2_team09.domain.repository.event.eventlocationrepo.EventLocationRepository;
import com.grepp.nbe1_2_team09.domain.repository.event.eventrepo.EventRepository;
import com.grepp.nbe1_2_team09.domain.repository.location.LocationRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.LockTimeoutException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.LockAcquisitionException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventLocationService {

    private final EventRepository eventRepository;
    private final LocationRepository locationRepository;
    private final EventLocationRepository eventLocationRepository;
    private final RedisTemplate<String, String> eventLocationRedisTemplate;

    //일정에 장소 추가
    @Transactional
    public EventLocationDto addLocationToEvent(Long eventId, AddEventLocationReq req) {
        Event event = findEventByIdOrThrowEventException(eventId);
        Location location = findLocationByIdOrThrowLocationException(req.locationId());

        // 저장할 때 겹치는 시간대 체크
        if (eventLocationRepository.existsByEventIdAndVisitTimes(eventId, req.visitStartTime(), req.visitEndTime())) {
            throw new EventLocationException(ExceptionMessage.UNAVAILABLE_TIME);
        }

        EventLocation eventLocation = EventLocation.builder()
                .event(event)
                .location(location)
                .description(req.description())
                .visitStartTime(req.visitStartTime())
                .visitEndTime(req.visitEndTime())
                .color(req.color())
                .build();

        EventLocation savedEventLocation = eventLocationRepository.save(eventLocation);
        return EventLocationDto.from(savedEventLocation);
    }

    //일정에 포함된 장소 불러오기
    public List<EventLocationInfoDto> getEventLocations(Long eventId) {
        Event event = findEventByIdOrThrowEventException(eventId);

        List<EventLocation> eventLocations = eventLocationRepository.findByEvent(event);

        List<EventLocationInfoDto> infos = eventLocations.stream()
                .map(EventLocationInfoDto::from)
                .collect(Collectors.toList());

        return infos;
    }

    //장소아이디로 일정 가져오기
    @Transactional
    public EventLocationInfoDto getEventLocationsById(Long pinId) {
        String lockKey = "lock:eventLocation:" + pinId;

        // Redis에서 락을 확인 후 설정
        if (Boolean.FALSE.equals(eventLocationRedisTemplate.opsForValue().setIfAbsent(lockKey, "LOCKED", Duration.ofMinutes(1)))) {
            throw new EventLocationException(ExceptionMessage.EVENT_LOCATION_LOCKED);
        }

        EventLocation eventLocation = findEventLocationByIdOrThrowException(pinId);
        return EventLocationInfoDto.from(eventLocation);
    }

    //일정에 포함되고 선택한 날짜랑 같은 장소 불러오기(시간 빠른 순서)
    public List<EventLocationInfoDto> getEventLocationByDate(Long eventId, LocalDate date) {
        Event event = findEventByIdOrThrowEventException(eventId);

        List<EventLocation> eventLocations = eventLocationRepository.findByEventAndDate(event, date);

        List<EventLocationInfoDto> infos = eventLocations.stream()
                .map(EventLocationInfoDto::from)
                .collect(Collectors.toList());

        return infos;
    }

    @Transactional
    public EventLocationDto updateEventLocation(Long pinId, UpdateEventLocationReq req) {

        EventLocation eventLocation = findEventLocationByIdOrThrowException(pinId);

        if (req.description() != null) {
            eventLocation.updateDescription(req.description());
        }
        if (req.visitStartTime() != null && req.visitEndTime() != null) {
            eventLocation.updateVisitTime(req.visitStartTime(), req.visitEndTime());
        }
        // 수정 완료 후 락 해제
        unlockLocation(pinId);

        return EventLocationDto.from(eventLocation);
    }

    //일정에 포함된 장소 삭제
    @Transactional
    public void removeLocationFromEvent(Long pinId) {
        EventLocation eventLocation = findEventLocationByIdOrThrowException(pinId);

        eventLocationRepository.delete(eventLocation);
    }

    public void unlockLocation(Long pinId){
        String lockKey = "lock:eventLocation:" + pinId;
        eventLocationRedisTemplate.delete(lockKey); // 락 해제
    }

    //예외 처리
    private Event findEventByIdOrThrowEventException(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    log.warn(">>>> EventId {} : {} <<<<", eventId, ExceptionMessage.EVENT_NOT_FOUND);
                    return new EventException(ExceptionMessage.EVENT_NOT_FOUND);
                });
    }

    private Location findLocationByIdOrThrowLocationException(Long locationId) {
        return locationRepository.findById(locationId)
                .orElseThrow(() -> {
                    log.warn(">>>> LocationId {} : {} <<<<", locationId, ExceptionMessage.LOCATION_NOT_FOUND);
                    return new LocationException(ExceptionMessage.LOCATION_NOT_FOUND);
                });
    }

    private EventLocation findEventLocationByIdOrThrowException(Long pinId) {
        return eventLocationRepository.findById(pinId)
                .orElseThrow(() -> {
                    log.warn(">>>> PinId {} : {} <<<<",
                            pinId, ExceptionMessage.LOCATION_NOT_FOUND);
                    return new LocationException(ExceptionMessage.LOCATION_NOT_FOUND);
                });
    }
}
