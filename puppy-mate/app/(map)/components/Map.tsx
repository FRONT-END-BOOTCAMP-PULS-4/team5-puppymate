'use client';
import { Map as KakaoMap, MapMarker, Polyline } from 'react-kakao-maps-sdk';
import useKakaoLoader from '../lib/use-kakao-loader';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useRef, useEffect, useState } from 'react';
import useMapStore from '@/store/useMapStore';
import { getDistance } from '../utils/getDistance';
import { SaveCourseModal } from '@/app/components/Modal';
export function Map() {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const { location, error } = useCurrentLocation();
  const { coordinates, addCoursePoint, startRecordingCourse, isSavingCourse, startTime } = useMapStore();
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  useKakaoLoader();

  useEffect(() => {
    if (!mapRef.current) return;

    if (location) {
      const center = new kakao.maps.LatLng(location.lat, location.lng);
      mapRef.current.setCenter(center);
    }

    if (isSavingCourse && location) {
      const lastPosition = coordinates.at(-1);
      if (!lastPosition || getDistance(lastPosition, location) > 1) {
        addCoursePoint(location); // 경로 저장
      }
    }
  }, [location, isSavingCourse]);

  if (error) {
    return <div>위치 정보를 가져올 수 없습니다: {error}</div>;
  }
  const onModalOpenChange = (open: boolean) => {
    setIsCreateCourseModalOpen(open);
  };

  const handleToggleBtnClick = () => {
    if (isSavingCourse) {
      setIsCreateCourseModalOpen(true);
    } else {
      startRecordingCourse(); // 시작
    }
  };

  const handleSaveCourse = (name: string) => {
    const geocoder = new kakao.maps.services.Geocoder();
    const duration = new Date().getTime() - startTime;
    let totalDistance = 0;
    let address = '';
    // 도로 좌표 {lat: 37.56423690189401, lng: 127.00764941529607}
    coordinates.forEach((coord, index) => {
      if (index > 0) {
        totalDistance += getDistance(coordinates[index - 1], coord);
      }
    });

    geocoder.coord2Address(coordinates[0].lng, coordinates[0].lat, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const addressObject = result[0].address || result[0].road_address;
        address =
          addressObject.region_1depth_name +
          ' ' +
          addressObject.region_2depth_name +
          ' ' +
          addressObject.region_3depth_name;
        console.log(addressObject);
      }
      console.log(name);
      console.log(totalDistance);
      console.log(duration);
      console.log(address);
    });
  };

  return (
    <>
      <button onClick={handleToggleBtnClick}>토글 버튼{isSavingCourse ? 'on' : 'off'}</button>
      <KakaoMap
        id="map"
        ref={mapRef}
        center={{ lat: 37.566535, lng: 126.977125 }}
        style={{
          width: '100%',
          height: '350px',
        }}
        level={3} // 지도의 확대 레벨
      >
        {location && (
          <>
            {/* 현재 위치에 마커 표시 */}
            <MapMarker position={location} />

            {/* 이동 경로를 따라 폴리라인 그리기 */}
            {isSavingCourse && (
              <Polyline
                path={coordinates} // 폴리라인 경로
                strokeWeight={5} // 선 두께
                strokeColor="#FF0000" // 선 색상
                strokeOpacity={0.8} // 선 투명도
                strokeStyle="solid" // 선 스타일
              />
            )}
          </>
        )}
      </KakaoMap>
      {/* Modal 컴포넌트 */}
      <SaveCourseModal open={isCreateCourseModalOpen} onSave={handleSaveCourse} onOpenChange={onModalOpenChange} />
    </>
  );
}
