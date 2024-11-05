import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateTime } from 'luxon';
import Modal from 'react-modal';
import ScheduleDetail from './ScheduleDetail';
import ScheduleUpdate from './ScheduleUpdate';
import { useNotification } from '../../context/NotificationContext';
import './Schedular.css';

Modal.setAppElement('#root');

const Schedular = () => {
  const { eventId } = useParams();
  const [events, setEvents] = useState([]);
  const [initialDate, setInitialDate] = useState(null);
  const [validRange, setValidRange] = useState({});
  const [numberOfDays, setNumberOfDays] = useState(7);
  const { selectedCell, deletedCell,deletedCellId, updatedCell, savedCell, stompClient } = useNotification();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editEventData, setEditEventData] = useState(null);
  const [originalEvent, setOriginalEvent] = useState(null);


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

          const dayDifference = DateTime.fromISO(endDate).diff(DateTime.fromISO(startDate), 'days').days + 1;
          setNumberOfDays(dayDifference);
        }

        const locationResponse = await fetch(`/events/${eventId}/locations`);
        const locationData = await locationResponse.json();
         console.error('dsfs:',locationData)
        if (locationData) {
          const loadedEvents = locationData.map(location => ({
            id: location.pinId,
            title: location.description,
            start: DateTime.fromISO(location.visitStartTime).toISO(),
            end: DateTime.fromISO(location.visitEndTime).toISO(),
            extendedProps: { editable: true },
            color:location.color
          }));
          setEvents(loadedEvents);
        }
      } catch (error) {
        console.error('이벤트 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchEventData();
  }, [eventId]);

  // WebSocket으로 데이터 수신
  useEffect(() => {
    if (selectedCell) handleReceivedSelection(selectedCell);//셀 선택
    if (deletedCell) handleRemoveSelection(deletedCell);//셀 시간으로 삭제
    if (deletedCellId) handleRemoveSelectionId(deletedCellId);//셀 아이디로 삭제
    if (updatedCell) handleUpdatedSelection(updatedCell);//셀 수정
    if (savedCell) handleSavedSelection(savedCell);//셀 저장
  }, [selectedCell, deletedCell, deletedCellId, updatedCell, savedCell]);

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
  };

  const handleRemoveSelection = (cellData) => {
    const { startTime } = cellData;

    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.filter((event) => {
        const eventStartWithoutTZ = event.start.split('.')[0];
        return eventStartWithoutTZ !== startTime;
      });
      return updatedEvents;
    });
  };

  const handleRemoveSelectionId = (cellIdToDelete) => {
    setEvents((prevEvents) => prevEvents.filter(event => event.id !== cellIdToDelete));
  };

const handleUpdatedSelection = (updatedData) => {
  const newEvent = {
      id: updatedData.pinId,
      title: updatedData.description,
      start: DateTime.fromISO(updatedData.visitStart).toISO(),
      end: DateTime.fromISO(updatedData.visitEnd).toISO(),
      extendedProps: { editable: true },
  };

  setEvents((prevEvents) => {
      const filteredEvents = prevEvents.filter((event) => 
          !(event.id === newEvent.id)
      );
      return [...filteredEvents, newEvent];
  });
};

  const handleSavedSelection = (savedCell) => {
    const newEvent = {
        id: savedCell.pinId,
        title: savedCell.description,
        start: DateTime.fromISO(savedCell.visitStart).toISO(),
        end: DateTime.fromISO(savedCell.visitEnd).toISO(),
        color:savedCell.color,
        extendedProps: { editable: true }
    };
    setEvents((prevEvents) => {
        const filteredEvents = prevEvents.filter(event => {
            const eventStartWithoutTZ = event.start.split('.')[0];
            const newEventStartWithoutTZ = newEvent.start.split('.')[0];
            return eventStartWithoutTZ !== newEventStartWithoutTZ;
        });

        return [...filteredEvents, newEvent];
    });
};

  // 날짜 선택 시 이벤트 발생
  const handleDateSelect = (selectInfo) => {

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

 // 이벤트 클릭 시 수정페이지로
 const handleEventClick = async (clickInfo) => {
  console.log("ddfsfsdfsf,",clickInfo.event.color)
  await fetchEventLocation(clickInfo.event.id, clickInfo.event.start, clickInfo.event.end);
};

// "선택중" 셀의 드래그 비활성화 및 커서 스타일 설정
const handleEventDidMount = (eventInfo) => {
  if (eventInfo.event.title === '선택중') {
    eventInfo.el.style.cursor = 'not-allowed';
    eventInfo.event.setProp('editable', false); // 드래그 불가능하도록 설정
  }
  
};

// KST로 변환하여 ISO 문자열로 반환하는 함수
const convertToISODate = (date) => {
  const kstOffset = 9 * 60 * 60 * 1000; // KST 오프셋 (9시간)
  const kstDate = new Date(date.getTime() + kstOffset);
  return kstDate.toISOString().replace(".000Z", ""); // .000Z 제거
};

const handleEventChange = async (eventInfo) => {
  // 드래그 또는 리사이즈가 유효한 경우
  if (eventInfo.event.extendedProps.editable) {
    await fetchEventLocation(eventInfo.event.id, eventInfo.event.start, eventInfo.event.end,eventInfo.event.color);
  }
};

const handleOriginChange = async (info) => {
  const startDateTime = convertToISODate(info.oldEvent.start);
  const endDateTime = convertToISODate(info.oldEvent.end);

  // 드롭 또는 리사이즈 직전의 원래 이벤트 정보 저장
  const originalEventInfo = {
    id: info.oldEvent.id,
    title: info.oldEvent.title,
    start: startDateTime,
    end: endDateTime,
    color: info.oldEvent.color,
    extendedProps: { editable: true },
  };
  setOriginalEvent(originalEventInfo);
};

const handleEventDrop = async (dropInfo) => {

  handleOriginChange(dropInfo)

  await handleEventChange(dropInfo);
};

const handleEventResize = async (resizeInfo) => {

  handleOriginChange(resizeInfo)

  await handleEventChange(resizeInfo);
};

const fetchEventLocation = async (pinId, startTime, endTime) => {
  try {

    const startDateTime = convertToISODate(startTime);
    const endDateTime = convertToISODate(endTime);

    const response = await fetch(`/events/${pinId}/eventLocations`);
    if (!response.ok) throw new Error('Failed to fetch event location');

    const data = await response.json();
    setEditEventData({
      pinId: pinId,
      location: data.location,
      description: data.description,
      visitStartTime: startDateTime,
      visitEndTime: endDateTime,
    });
    setIsEditModalOpen(true); // 모달 열기
  } catch (error) {
    console.error('Error fetching event location:', error);
    alert("다른 사용자가 수정중입니다. 잠시 후에 다시 시도해 주세요.");
  }
};

const closeEditModal = (action) => {

  if (action === 'back') {
      setEvents((prevEvents) => {
          if (!originalEvent) {
              return prevEvents;
          }
          const updatedEvents = prevEvents.filter(event => {
              return event.id !== originalEvent.id || event.start !== originalEvent.start;
          });

          return [...updatedEvents, originalEvent];
      });
  }

  setIsEditModalOpen(false); // 모달 닫기
};

  // 모달 닫기
  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
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
        eventDidMount={handleEventDidMount}
        eventDrop={handleEventDrop}       // 이벤트 이동 시 트리거
        eventResize={handleEventResize}   // 이벤트 리사이즈 시 트리거
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
          shouldCloseOnOverlayClick={false} // 배경 클릭 비활성화
        >
          <ScheduleDetail
            startTime={startTime}
            endTime={endTime}
            eventId={eventId}
            onClose={closeScheduleModal}
          />
        </Modal>
      )}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          className="modal-content"
          overlayClassName="modal-overlay-update"
          shouldCloseOnOverlayClick={false} // 배경 클릭 비활성화
        >
        <ScheduleUpdate
            {...editEventData} // editEventData의 모든 속성을 props로 전달
            originalEvent={originalEvent} // originalEvent를 props로 전달
          onClose={closeEditModal} // 모달 닫기
        />
        </Modal>
        
      )}
      
    </div>
  );
};

export default Schedular;
