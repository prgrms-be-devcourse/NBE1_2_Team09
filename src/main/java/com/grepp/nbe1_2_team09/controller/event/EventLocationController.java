package com.grepp.nbe1_2_team09.controller.event;

import com.grepp.nbe1_2_team09.controller.event.dto.*;
import com.grepp.nbe1_2_team09.domain.service.event.EventLocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventLocationController {

    private final EventLocationService eventLocationService;
    private final RedisTemplate<String, String> eventLocationRedisTemplate;

    @PostMapping("/{eventId}/locations")
    public ResponseEntity<EventLocationDto> addLocationToEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody AddEventLocationReq request) {
        EventLocationDto result = eventLocationService.addLocationToEvent(eventId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/{eventId}/locations")
    public ResponseEntity<List<EventLocationInfoDto>> getEventLocations(@PathVariable Long eventId) {
        List<EventLocationInfoDto> locations = eventLocationService.getEventLocations(eventId);
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/{pinId}/eventLocations")
    public ResponseEntity<EventLocationInfoDto> getEventLocationsById(@PathVariable Long pinId) {
        EventLocationInfoDto locations = eventLocationService.getEventLocationsById(pinId);
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/{eventId}/locationsByDate")
    public ResponseEntity<List<EventLocationInfoDto>> getEventLocationsByDate(
            @PathVariable Long eventId,
            @RequestParam("date") LocalDate date) {
        List<EventLocationInfoDto> locations = eventLocationService.getEventLocationByDate(eventId, date);
        return ResponseEntity.ok(locations);
    }


    @PatchMapping("/{pinId}/eventLocations")
    public ResponseEntity<EventLocationDto> updateEventLocation(
            @PathVariable Long pinId,
            @Valid @RequestBody UpdateEventLocationReq request) {
        EventLocationDto result = eventLocationService.updateEventLocation(pinId, request);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{pinId}/eventLocations")
    public ResponseEntity<Void> removeLocationFromEvent(@PathVariable Long pinId) {
        eventLocationService.removeLocationFromEvent(pinId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/unlockLocation")
    public ResponseEntity<Void> unlockLocation(@RequestBody UnlockLocationRequest request) {
        Long pinId = request.pinId();
        String lockKey = "lock:eventLocation:" + pinId;
        eventLocationRedisTemplate.delete(lockKey); // 락 해제
        return ResponseEntity.ok().build();
    }

}
