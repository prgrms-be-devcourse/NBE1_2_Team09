package com.grepp.nbe1_2_team09.controller.location.dto;

import com.grepp.nbe1_2_team09.domain.entity.Location;

import java.math.BigDecimal;

public record LocationDto(
        Long locationId,
        String placeId,
        String placeName,
        BigDecimal latitude,
        BigDecimal longitude,
        String address,
        BigDecimal rating,
        String photo
) {
    public static LocationDto fromEntity(Location location){
        return new LocationDto(
                location.getLocationId(),
                location.getPlaceId(),
                location.getPlaceName(),
                location.getLatitude(),
                location.getLongitude(),
                location.getAddress(),
                location.getRating(),
                location.getPhoto()
        );
    }
}
