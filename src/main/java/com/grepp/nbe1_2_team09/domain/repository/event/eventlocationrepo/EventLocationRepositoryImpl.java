package com.grepp.nbe1_2_team09.domain.repository.event.eventlocationrepo;

import com.grepp.nbe1_2_team09.domain.entity.event.Event;
import com.grepp.nbe1_2_team09.domain.entity.event.EventLocation;
import com.grepp.nbe1_2_team09.domain.entity.event.QEventLocation;
import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class EventLocationRepositoryImpl implements EventLocationRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public List<EventLocation> findByEventAndDate(Event event, LocalDate date) {
        QEventLocation eventLocation = QEventLocation.eventLocation;

        // visitStartTime의 날짜 부분을 "yyyy-MM-dd" 형식으로 포맷팅
        StringTemplate formattedDate = Expressions.stringTemplate(
                "DATE_FORMAT({0}, {1})",
                eventLocation.visitStartTime,
                ConstantImpl.create("%Y-%m-%d")
        );

        return queryFactory.selectFrom(eventLocation)
                .where(eventLocation.event.eq(event)
                        .and(formattedDate.eq(date.toString()))) // LocalDate를 문자열로 변환하여 비교
                .orderBy(eventLocation.visitStartTime.asc())
                .fetch();
    }

    @Override
    public boolean existsByEventIdAndVisitTimes(Long eventId, LocalDateTime visitStartTime, LocalDateTime visitEndTime) {
        QEventLocation eventLocation = QEventLocation.eventLocation;

        return queryFactory.selectFrom(eventLocation)
                .where(eventLocation.event.eventId.eq(eventId)
                        .and(eventLocation.visitStartTime.lt(visitEndTime))
                        .and(eventLocation.visitEndTime.gt(visitStartTime)))
                .fetchOne() != null;
    }
}
