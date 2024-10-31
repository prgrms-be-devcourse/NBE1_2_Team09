import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import Modal from 'react-modal';
import AutoCompleteSearch from './AutoCompleteSearch';
import './ScheduleUpdate.css';

const ScheduleUpdate = ({ pinId, location, description, visitStartTime, visitEndTime, onClose }) => {
    const [eventDescription, setEventDescription] = useState(description || ''); // 외부에서 받은 description 초기화
    const [locationData, setLocationData] = useState(location || null); // 외부에서 받은 location 초기화
    const { stompClient } = useNotification();

    const handleUpdate = async () => {
        const updateRequest = {
            description: eventDescription,
            visitStartTime,
            visitEndTime,
        };

        try {
            const response = await axios.patch(`/events/${pinId}/eventLocations`, updateRequest);
            alert("일정이 수정되었습니다.");
            onClose();

            // 웹소켓을 통해 다른 클라이언트에게 알리기
            const updatedData = {
                pinId: response.data.pinId,
                description: eventDescription,
                visitStart: visitStartTime,
                visitEnd: visitEndTime,
            };
            if (stompClient && stompClient.connected) {
                stompClient.publish({
                    destination: '/app/updatedCell',
                    body: JSON.stringify(updatedData),
                });
            }
        } catch (error) {
            console.error("수정 중 오류 발생:", error);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("일정을 정말 삭제하시겠습니까?");
    
        if (!confirmDelete) {
            return;
        }
        try {
            await axios.delete(`/events/${pinId}/eventLocations`);
            alert("일정이 삭제되었습니다.");
            onClose();

            // 웹소켓을 통해 다른 클라이언트에게 알리기
            const deletedData = { pinId };
            if (stompClient && stompClient.connected) {
                stompClient.publish({
                    destination: '/app/deletedCell',
                    body: JSON.stringify(deletedData),
                });
            }
        } catch (error) {
            console.error("삭제 중 오류 발생:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };
    const handleBackButton = () => {
        // 'back' 인자를 onClose에 전달
        onClose('back');
    };


    return (
        <div className="schedule-detail">
             <div className="left-align">
                <button className="small-button" onClick={handleBackButton}>뒤로가기</button>
            </div>
            <h1 style={{ fontSize: '2em', marginLeft: '10px' }}>일정 수정</h1>
            <p>시작 시간:</p>
            <input
                type="text"
                value={visitStartTime}
                readOnly
                className="readonly-input"
            />
            <p>종료 시간:</p>
            <input
                type="text"
                value={visitEndTime}
                readOnly
                className="readonly-input"
            />
            {locationData && (
                <div className="selected-location">
                    <h3>{locationData.placeName}</h3>
                </div>
            )}
            <textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)} // 상태 업데이트
                placeholder="일정에 대한 설명을 입력하세요"
            />
            <button className="btn-warning"   onClick={handleUpdate}>수정</button>
            <button className="btn-danger" onClick={handleDelete}>삭제</button>
        </div>
    );
};

export default ScheduleUpdate;
