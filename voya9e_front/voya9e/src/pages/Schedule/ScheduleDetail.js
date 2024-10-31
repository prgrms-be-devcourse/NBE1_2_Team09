import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { SketchPicker } from 'react-color';
import { useNotification } from '../../context/NotificationContext';
import Modal from 'react-modal';
import AutoCompleteSearch from './AutoCompleteSearch';
import './ScheduleDetail.css';

const ScheduleDetail = ({ startTime, endTime, eventId, onClose }) => {
    const [description, setDescription] = useState('');
    const [locationData, setLocationData] = useState(null);
    const navigate = useNavigate();
    const [color, setColor] = useState('#ff0000');
    const { stompClient } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedLocationData = sessionStorage.getItem('locationData');
        if (storedLocationData) {
            setLocationData(JSON.parse(storedLocationData));
            console.log("전달받은 장소 정보:", JSON.parse(storedLocationData));
        }
    }, []);

    const handlePlaceSearch = () => {
        setIsModalOpen(true); // 모달 열기
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // 모달 닫기
        const storedLocationData = sessionStorage.getItem('locationData');
        if (storedLocationData) {
            setLocationData(JSON.parse(storedLocationData));
        }
    };

    const handleBack = () => {
        sessionStorage.removeItem('locationData'); // 세션 스토리지 초기화

        const selectionData = {
            startTime: startTime,
            endTime: endTime,
        };

        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: '/app/deleteCell',
                body: JSON.stringify(selectionData),
            });
        }
        onClose()
    };

    const handleSubmit = async () => {
        if (!locationData) {
            alert("장소 정보를 선택해 주세요.");
            return;
        }
        const locationReq = {
            placeId:locationData.placeId,
            placeName: locationData.placeName,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            address: locationData.address,
            rating: locationData.rating,
            photo: locationData.photo,
        };

        try {
            const locationResponse = await axios.post('/locations', locationReq);
            const locationId = locationResponse.data.locationId;

            const eventLocationReq = {
                eventId: Number(eventId),
                locationId: locationId,
                description,
                visitStartTime: startTime,
                visitEndTime: endTime,
            };
            const eventLocationResponse = await axios.post(`/events/${eventId}/locations`, eventLocationReq);
            alert("일정이 저장되었습니다.");

            onClose()
            sessionStorage.removeItem('locationData');

             // 여기서 웹소켓을 통해 다른 클라이언트에게 알리기
            const savedData = {
                pinId: eventLocationResponse.data.pinId, // 응답에서 pinId 가져오기
                eventId: eventId,
                locationId: locationId,
                description: description,
                visitStart: startTime,
                visitEnd: endTime,
            };
            if (stompClient && stompClient.connected) {
                stompClient.publish({
                  destination: '/app/savedCell',
                  body: JSON.stringify(savedData),
                });
              }

        } catch (error) {
            console.error("오류 발생:", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };
    // 색상 변경 핸들러
    const handleColorChange = (color) => {
        setColor(color.hex); // 선택된 색상 저장
    };

    return (
        <div className="schedule-detail">
            <div className="left-align">
                <button className="small-button" onClick={handleBack}>뒤로가기</button>
            </div>
            <h1 style={{ fontSize: '2em', marginLeft: '10px' }}>일정 추가</h1>
            <p>시작 시간:</p>
            <input
                type="text"
                value={startTime}
                readOnly
                className="readonly-input"
            />
            <p>종료 시간:</p>
            <input
                type="text"
                value={endTime}
                readOnly
                className="readonly-input"
            />
            <div className="left-align">
                <button className="small-button" onClick={handlePlaceSearch}>장소 선택</button>
            </div>
            {locationData && (
                <div className="selected-location">
                    <h3>{locationData.placeName}</h3>
                </div>
            )}
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="일정에 대한 설명을 입력하세요"
            />
             {/* <SketchPicker 
                color={color} 
                onChangeComplete={handleColorChange} 
            /> */}
            <button className="save-button" onClick={handleSubmit}>저장</button>

            {/* 모달 컴포넌트에 eventId를 prop으로 전달 */}
            <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {}}
        shouldCloseOnOverlayClick={false} // 배경 클릭 비활성화
        className="modal-content"
        overlayClassName="modal-overlay"
    >
                <AutoCompleteSearch eventId={eventId} onClose={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default ScheduleDetail;
