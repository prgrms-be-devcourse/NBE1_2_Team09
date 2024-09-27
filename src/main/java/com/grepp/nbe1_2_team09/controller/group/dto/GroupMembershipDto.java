package com.grepp.nbe1_2_team09.controller.group.dto;

import com.grepp.nbe1_2_team09.domain.entity.GroupMembership;
import com.grepp.nbe1_2_team09.domain.entity.Role;

public record GroupMembershipDto(Long id, Long groupId, Long userId, Role role) {
    public static GroupMembershipDto from(GroupMembership membership) {
        return new GroupMembershipDto(
                membership.getMembershipId(),
                membership.getGroup().getGroupId(),
                membership.getUser().getUserId(),
                membership.getRole()
        );
    }
}