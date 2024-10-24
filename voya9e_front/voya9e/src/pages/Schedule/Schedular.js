import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateTime } from 'luxon';
import Modal from 'react-modal';
import ScheduleDetail from './ScheduleDetail';
import { useNotification } from '../../context/NotificationContext';
import './Schedular.css';

Modal.setAppElement('#root');

const Schedular = () => {
  const { eventId } = useParams();
  const [events, setEvents] = useState([]);
  const [initialDate, setInitialDate] = useState(null);
  const [validRange, setValidRange] = useState({});
  const [numberOfDays, setNumberOfDays] = useState(7);

  const { selectedCell, deletedCell, stompClient } = useNotification();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await fetch(`/events/${eventId}`);
        const eventData = await eventResponse.json();

        if (eventData) {
          const { startDate, endDate } = eventData;

          setInitialDate(startDate);
          const adjustedEndDate = DateTime.fromISO(endDate).plus({ days: 1 }).toISODate();
          setValidRange({ start: startDate, end: adjustedEndDate });

          const start = DateTime.fromISO(startDate);
          const end = DateTime.fromISO(endDate);
          const dayDifference = end.diff(start, 'days').days + 1;
          setNumberOfDays(dayDifference);
        }

        const locationResponse = await fetch(`/events/${eventId}/locations`);
        const locationData = await locationResponse.json();

        if (locationData) {
          const loadedEvents = locationData.map(location => ({
            title: location.description,
            start: DateTime.fromISO(location.visitStartTime).toISO(),
            end: DateTime.fromISO(location.visitEndTime).toISO(),
          }));
          setEvents(loadedEvents);
        }
      } catch (error) {
        console.error('이벤트 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchEventData();
  }, [eventId]);

  // WebSocket으로 선택된 셀 데이터 받기
  useEffect(() => {
    if (selectedCell) {
      console.log('WebSocket으로 받은 선택 셀 데이터:', selectedCell);
      handleReceivedSelection(selectedCell);
    }
  }, [selectedCell]);

  // WebSocket으로 삭제된 셀 데이터 받기
  useEffect(() => {
    if (deletedCell) {
      console.log('삭제할 셀 정보:', deletedCell);
      handleRemoveSelection(deletedCell);
    }
  }, [deletedCell]);

  const handleReceivedSelection = (cellData) => {
    const { startTime, endTime } = cellData;

    const newEvent = {
      id: Date.now().toString(),
      title: '선택중',
      start: DateTime.fromISO(startTime).toISO(),
      end: DateTime.fromISO(endTime).toISO(),
      backgroundColor: '#ffbf0052',
      borderColor: '#ffbf0052',
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    console.log('추가된 이벤트:', newEvent);
  };

  const handleRemoveSelection = (cellData) => {
    const { startTime } = cellData;

    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.filter((event) => {
        const eventStartWithoutTZ = event.start.split('.')[0];
        return eventStartWithoutTZ !== startTime;
      });
      console.log('업데이트된 이벤트:', updatedEvents);
      return updatedEvents;
    });
    console.log('삭제된 셀에 대한 이벤트가 제거되었습니다:', cellData);
  };

  // 날짜 선택 시 이벤트 발생
  const handleDateSelect = (selectInfo) => {
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    const startDateTime = DateTime.fromISO(selectInfo.startStr, { zone: 'Asia/Seoul' });
    const endDateTime = DateTime.fromISO(selectInfo.endStr, { zone: 'Asia/Seoul' });

    const start = startDateTime.toFormat('yyyy-MM-dd\'T\'HH:mm:ss');
    const end = endDateTime.toFormat('yyyy-MM-dd\'T\'HH:mm:ss');

    const selectionData = {
      id: Date.now().toString(),
      startTime: start,
      endTime: end,
    };

    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/selectCell',
        body: JSON.stringify(selectionData),
      });
    }

    setStartTime(start); // 시작 시간 설정
    setEndTime(end); // 종료 시간 설정
    setIsScheduleModalOpen(true); // 모달 열기

  };

  // 모달 닫기
  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
  };

  // 이벤트 클릭 시 삭제 핸들러
  const handleEventClick = (clickInfo) => {
    if (window.confirm(`'${clickInfo.event.title}' 이벤트를 삭제할까요?`)) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== clickInfo.event.id)
      );
    }
  };

  if (!initialDate) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="schedular-container">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="customWeek"
        views={{
          customWeek: {
            type: 'timeGrid',
            duration: { days: numberOfDays },
          },
        }}
        initialDate={initialDate}
        validRange={validRange}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,customWeek',
        }}
        allDaySlot={false}
        selectable={true}
        selectMirror={true}
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        editable={true}
        slotDuration="00:30:00"
      />

      {/* ScheduleDetail 모달 */}
      {isScheduleModalOpen && (
        <Modal
          isOpen={isScheduleModalOpen}
          onRequestClose={closeScheduleModal}
          className="modal-content"
          overlayClassName="modal-overlay-schedule"
        >
          <ScheduleDetail
            startTime={startTime}
            endTime={endTime}
            eventId={eventId}
            onClose={closeScheduleModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default Schedular;
