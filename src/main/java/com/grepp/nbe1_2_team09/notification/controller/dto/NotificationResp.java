package com.grepp.nbe1_2_team09.notification.controller.dto;

public record NotificationResp(
        String id,
        String type,
        String message,
        Long senderId,
        Long receiverId,
        Long invitationId,
        String createdAt,
        boolean read
) {}