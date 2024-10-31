package com.grepp.nbe1_2_team09.schedule.controller.dto;


import java.io.Serializable;

public record UpdatedData(Long pinId,String description, String visitStart, String visitEnd) implements Serializable {
}
