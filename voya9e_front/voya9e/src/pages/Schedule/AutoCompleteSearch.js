import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import RecommendationSearch from './RecommendationSearch';
import PlaceDetail from './PlaceDetail';
import './AutoCompleteSearch.css';


function AutoCompleteSearch({onClose}) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const [isPlaceDetailOpen, setIsPlaceDetailOpen] = useState(false);
    const { eventId } = useParams();

    const fetchSuggestions = (input) => {
        if (input.length > 0 && eventId) {
            axios.get(`/api/locations/${eventId}/autocomplete`, { params: { input } })
                .then(response => {
                    setSuggestions(response.data);
                })
                .catch(error => {
                    console.error('Error fetching suggestions:', error);
                    setSuggestions([]);
                });
        } else {
            setSuggestions([]);
        }
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setQuery(inputValue);
        fetchSuggestions(inputValue);
    };

    const toggleSelection = (place) => {
        setSelectedPlace(selectedPlace === place ? null : place); // 같은 장소 선택 시 해제
    };

    const saveSelection = () => {
        if (selectedPlace) {
            axios.get(`/api/locations/${selectedPlace.placeId}`)
                .then(response => {
                    const placeDetail = response.data;
                    const locationData = {
                        placeId:placeDetail.placeId,
                        placeName: placeDetail.name,
                        latitude: placeDetail.latitude,
                        longitude: placeDetail.longitude,
                        address: placeDetail.formattedAddress,
                        rating: placeDetail.rating || 0,
                        photo: placeDetail.photoUrl
                    };
                    
                    // locationData를 sessionStorage에 저장
                    sessionStorage.setItem('locationData', JSON.stringify(locationData));

                    onClose(); // 모달 닫기
                })
                .catch(error => {
                    console.error('장소 상세 정보 가져오는 중 오류 발생:', error);
                    alert('장소 상세 정보 가져오기에 실패했습니다.');
                });
        } else {
            alert('장소를 선택하세요.');
        }
    };

    const goToRecommendationSearch = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handlePlaceClick = (placeId) => {
        setSelectedPlaceId(placeId);
        setIsPlaceDetailOpen(true);
    };

    const handleClosePlaceDetail = () => {
        setIsPlaceDetailOpen(false);
    };



    return (
        <div className="auto-complete-search">
            <div className="header">
                <h1 className="title">Voyage</h1>
                <button className="small-button-auto" onClick={onClose}>뒤로가기</button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="맛집/관광지/숙소 검색"
                />
            </div>

            <button onClick={goToRecommendationSearch} className="recommendation-btn">
                장소 추천
            </button>

            <div className="result-list">
                {suggestions.length === 0 ? (
                    <div className="empty-result">검색 결과가 없습니다</div>
                ) : (
                    suggestions.map((suggestion) => (
                        <div
                            key={suggestion.placeId}
                            className={`result-item-auto ${selectedPlace === suggestion ? 'selected' : ''}`}
                            onClick={() => handlePlaceClick(suggestion.placeId)} // 클릭 시 상세 페이지로 이동
                        >
                            <span className="city-name">{suggestion.name}</span>
                            <button
                                className={`select-button-auto ${selectedPlace === suggestion ? 'selected' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelection(suggestion);
                                }}
                            >
                                {selectedPlace === suggestion ? '취소' : '선택'}
                            </button>
                        </div>
                    ))
                )}
            </div>

            <button className="save-button" onClick={saveSelection}>선택 완료</button>

            {/* RecommendationSearch 모달 */}
            <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}
             shouldCloseOnOverlayClick={false} // 배경 클릭 비활성화
              className="modal-content"
            overlayClassName="modal-overlay" >
                <RecommendationSearch eventId={eventId} onClose={handleCloseModal} />
            </Modal>

             {/* PlaceDetail 모달 */}
             {selectedPlaceId && (
                <Modal isOpen={isPlaceDetailOpen} onRequestClose={handleClosePlaceDetail} className="modal-content-detail" overlayClassName="modal-overlay">
                    <PlaceDetail placeId={selectedPlaceId} onClose={handleClosePlaceDetail} />
                </Modal>
            )}

        </div>
    );
}

export default AutoCompleteSearch;
