package com.grepp.nbe1_2_team09.controller.location.dto;

import com.grepp.nbe1_2_team09.domain.entity.Location;

import java.math.BigDecimal;

public record LocationEventDto(
        Long locationId,
        String placeName,
        BigDecimal latitude,
        BigDecimal longitude,
        String address,
        BigDecimal rating
) {
    public static LocationEventDto from(Location location) {
        return new LocationEventDto(
                location.getLocationId(),
                location.getPlaceName(),
                location.getLatitude(),
                location.getLongitude(),
                location.getAddress(),
                location.getRating()
        );
    }
}
