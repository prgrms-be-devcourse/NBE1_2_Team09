package com.grepp.nbe1_2_team09.schedule.controller.dto;


import java.io.Serializable;

public record SavedData(Long pinId, Long eventId, Long locationId, String description, String visitStart, String visitEnd) implements Serializable {
}
