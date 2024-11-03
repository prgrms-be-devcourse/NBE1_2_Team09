package com.grepp.nbe1_2_team09.domain.service.location;

import com.grepp.nbe1_2_team09.common.util.aop.LogExecutionTime;
import com.grepp.nbe1_2_team09.controller.event.dto.EventDto;
import com.grepp.nbe1_2_team09.controller.location.dto.*;
import com.grepp.nbe1_2_team09.controller.location.dto.api.*;
import com.grepp.nbe1_2_team09.domain.service.event.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationApiService {

    private final RestTemplate restTemplate;
    private final EventService eventService;

    @Value("${google.api.key}")

    private String apiKey;

    //장소 자동 검색
    public List<PlaceResponse> getAutocompletePlaces(Long eventId, String input) {
        EventDto eventDto = eventService.getEventById(eventId);
        String cityName = eventDto.city();

        String location = getCoordinatesFromCityName(cityName);

        String url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + input +
                "&location=" + location + "&radius=5000&types=establishment&key=" + apiKey;

        ResponseEntity<GooglePlacesAutocompleteResponse> response = restTemplate.getForEntity(url, GooglePlacesAutocompleteResponse.class);

        return response.getBody().predictions()
                .stream()
                .map(prediction -> new PlaceResponse(prediction.place_id(), prediction.description(), null))
                .collect(Collectors.toList());
    }

    //장소 추천
    // @LogExecutionTime
    //@Cacheable(value = "recommendedPlaces", key = "#eventId + '-' + #type")
    public List<PlaceRecommendResponse> getRecommendedPlaces(Long eventId, String type) {
        EventDto eventDto = eventService.getEventById(eventId);
        String cityName = eventDto.city();

        String location = getCoordinatesFromCityName(cityName);
        String placeType = Optional.ofNullable(type).orElse("establishment");
        String url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + location
                + "&radius=5000&type=" + placeType + "&key=" + apiKey;

        ResponseEntity<GooglePlacesNearbyResponse> response = restTemplate.getForEntity(url, GooglePlacesNearbyResponse.class);
        return response.getBody().results()
                .stream()
                .map(result -> new PlaceRecommendResponse(
                        result.place_id(),
                        result.name(),
                        result.geometry().location().lat(),
                        result.geometry().location().lng(),
                        Optional.ofNullable(result.rating()).orElse(0.0),
                        result.user_ratings_total(),
                        result.vicinity(),
                        getPhotoUrl_PlaceRecommend(result.photos())))
                .collect(Collectors.toList());
    }

    // id로 장소 상세 정보 조회
    // @LogExecutionTime
    //@Cacheable(value = "placeDetails", key = "#placeId")
    public PlaceDetailResponse getPlaceDetail(String placeId) {
        String url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeId + "&key=" + apiKey;

        ResponseEntity<PlaceDetailApiResponse> response = restTemplate.getForEntity(url, PlaceDetailApiResponse.class);

        PlaceDetailApiResponse.Result result = response.getBody().result();

        return new PlaceDetailResponse(
                result.place_id(),
                result.name(),
                result.geometry().location().lat(),
                result.geometry().location().lng(),
                result.formatted_address(),
                result.formatted_phone_number(),
                getPhotoUrl_PlaceDetail(result.photos()),
                result.rating(),
                result.url(),
                getWeekdayText(result),
                result.website(),
                isOpenNow(result)
        );
    }

    private String getPhotoUrl_PlaceRecommend(List<GooglePlacesNearbyResponse.Photo> photos) {
        if (photos != null && !photos.isEmpty()) {
            return "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" + photos.get(0).photo_reference() + "&key=" + apiKey;
        }
        return null;
    }

    private String getPhotoUrl_PlaceDetail(List<PlaceDetailApiResponse.Photo> photos) {
        if (photos != null && !photos.isEmpty()) {
            return "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" + photos.get(0).photo_reference() + "&key=" + apiKey;
        }
        return null;
    }

    public String getCoordinatesFromCityName(String cityName) {
        String geocodingUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityName + "&key=" + apiKey;

        ResponseEntity<GeocodingApiResponse> geocodingResponse = restTemplate.getForEntity(geocodingUrl, GeocodingApiResponse.class);

        GeocodingApiResponse.Result geocodingResult = geocodingResponse.getBody().results().get(0);
        double latitude = geocodingResult.geometry().location().lat();
        double longitude = geocodingResult.geometry().location().lng();

        return latitude + "," + longitude;
    }

    private String getWeekdayText(PlaceDetailApiResponse.Result result) {
        return Optional.ofNullable(result.current_opening_hours())
                .map(openingHours -> String.join(", ", openingHours.weekday_text()))
                .orElse("운영 시간 정보가 없습니다.");
    }

    private boolean isOpenNow(PlaceDetailApiResponse.Result result) {
        return result.current_opening_hours() != null && result.current_opening_hours().open_now();
    }



}

