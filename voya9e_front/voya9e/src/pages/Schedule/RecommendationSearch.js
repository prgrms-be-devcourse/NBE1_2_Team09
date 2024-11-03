import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import PlaceDetail from './PlaceDetail';
import './RecommendationSearch.css';

function RecommendationSearch({ eventId, onClose }) {
    const [placeType, setPlaceType] = useState('establishment');
    const [sortOption, setSortOption] = useState('rating');
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const [isPlaceDetailOpen, setIsPlaceDetailOpen] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null); // 현재 선택된 마커 상태
    const placeListRef = useRef(); // 목록에 대한 참조

    const fetchRecommendations = useCallback((type, sort) => {
        if (!eventId) {
            console.error('eventId가 없습니다.');
            return;
        }
        axios.get(`/api/locations/${eventId}/recommend`, { params: { type } })
            .then(response => {
                let data = response.data;
                if (sort === 'rating') {
                    data.sort((a, b) => b.rating - a.rating);
                } else if (sort === 'reviews') {
                    data.sort((a, b) => b.user_ratings_total - a.user_ratings_total);
                }
                setPlaces(data);
                initMap(data);
            })
            .catch(error => {
                console.error('Error fetching recommendations:', error);
            });
    }, [eventId]);

    const initMap = (placesData) => {
        if (!placesData || placesData.length === 0) return;

        const center = { lat: placesData[0].latitude, lng: placesData[0].longitude };
        const newMap = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: center,
        });

        placesData.forEach((place, index) => {
            const marker = new window.google.maps.Marker({
                position: { lat: place.latitude, lng: place.longitude },
                map: newMap,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: '#FF5733',
                    fillOpacity: 0.8,
                    strokeWeight: 2,
                    strokeColor: '#ffffff',
                    scale: 13,
                },
            });

            const infowindow = new window.google.maps.InfoWindow({
                content: `<div><strong>${place.name}</strong><br>평점: ${place.rating || 0}<br>리뷰 수: ${place.user_ratings_total}</div>`,
            });
    
            marker.addListener('click', () => {
                infowindow.open(newMap, marker);
            });

            // 마커 클릭 시 장소 정보 표시 및 목록으로 스크롤
            marker.addListener('click', () => {
                setSelectedMarker(place); // 클릭된 마커의 정보를 상태에 저장
                scrollToPlace(index); // 해당 인덱스의 장소로 스크롤
            });
        });
    };

    const scrollToPlace = (index) => {
        if (placeListRef.current) {
            const placeItem = placeListRef.current.children[index];
            if (placeItem) {
                placeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    useEffect(() => {
        fetchRecommendations(placeType, sortOption);
    }, [fetchRecommendations, placeType, sortOption]);

    const handlePlaceTypeChange = (type) => {
        setPlaceType(type);
        fetchRecommendations(type, sortOption);
    };

    const handleSortChange = (sort) => {
        setSortOption(sort);
        fetchRecommendations(placeType, sort);
    };

    const handlePlaceClick = (placeId) => {
        setSelectedPlaceId(placeId);
        setIsPlaceDetailOpen(true); // PlaceDetail 모달 열기
    };

    const handleClosePlaceDetail = () => {
        setIsPlaceDetailOpen(false); // PlaceDetail 모달 닫기
    };

    const handleSelectionComplete = () => {
        if (!selectedPlace) {
            alert('선택된 장소가 없습니다.'); // 선택된 장소가 없을 경우 경고창 표시
        } else {
            console.log('선택된 장소:', selectedPlace);

            const locationData = {
                placeId: selectedPlace.placeId,
                placeName: selectedPlace.name,
                latitude: selectedPlace.latitude,
                longitude: selectedPlace.longitude,
                address: selectedPlace.address,
                rating: selectedPlace.rating || 0,
                photo: selectedPlace.photoUrl || null
            };
            console.log('보낼 장소데이터:', locationData);

            // locationData를 sessionStorage에 저장
            sessionStorage.setItem('locationData', JSON.stringify(locationData));

            onClose(); // 모달 닫기
        }
    };

    const handleMarkerClose = () => {
        setSelectedMarker(null); // 마커 선택 해제
    };

    return (
        <div className="recommendation-search" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div className="header">
                <h1 className="title-reco">추천장소</h1>
                <button className="small-button-auto" onClick={onClose}>뒤로가기</button>
            </div>

            {/* Google Map */}
            <div id="map" style={{ height: '150px', width: '100%' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="place-types">
                    <button onClick={() => handlePlaceTypeChange('establishment')} className={placeType === 'establishment' ? 'selected' : ''}>모두</button>
                    <button onClick={() => handlePlaceTypeChange('restaurant')} className={placeType === 'restaurant' ? 'selected' : ''}>맛집</button>
                    <button onClick={() => handlePlaceTypeChange('tourist_attraction')} className={placeType === 'tourist_attraction' ? 'selected' : ''}>관광지</button>
                    <button onClick={() => handlePlaceTypeChange('lodging')} className={placeType === 'lodging' ? 'selected' : ''}>숙소</button>
                </div>

                <div className="sort-options">
                    <button onClick={() => handleSortChange('rating')} className={sortOption === 'rating' ? 'selected' : ''}>평점순</button>
                    <button onClick={() => handleSortChange('reviews')} className={sortOption === 'reviews' ? 'selected' : ''}>리뷰순</button>
                </div>
            </div>

            <div className="place-list" style={{ flex: 1, overflowY: 'auto' }} ref={placeListRef}>
                {places.map((place, index) => (
                    <div
                        key={place.placeId}
                        className={`place-item ${selectedPlace === place ? 'selected' : ''}`}
                        onClick={() => handlePlaceClick(place.placeId)}
                    >
                        <div className="place-image-container">
                            <img src={place.photoUrl} alt={place.name} className="place-image-reco" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <span className="place-name">{place.name}</span>
                            <p>평점: {place.rating} | 리뷰 수: {place.user_ratings_total}</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // 클릭 이벤트 전파 방지
                                setSelectedPlace(place); // 장소 선택
                            }}
                            className={`select-button-reco ${selectedPlace === place ? 'selected' : ''}`}
                        >
                            {selectedPlace === place ? '취소' : '선택'}
                        </button>
                    </div>
                ))}
            </div>

            <button className="save-button" style={{ "margin-top": 0 }}onClick={handleSelectionComplete}>
                선택 완료
            </button>

            {/* PlaceDetail 모달 */}
            {selectedPlaceId && (
                <Modal isOpen={isPlaceDetailOpen} onRequestClose={handleClosePlaceDetail} shouldCloseOnOverlayClick={false} className="modal-content-detail" overlayClassName="modal-overlay">
                    <PlaceDetail placeId={selectedPlaceId} onClose={handleClosePlaceDetail} />
                </Modal>
            )}
        </div>
    );
}

export default RecommendationSearch;
