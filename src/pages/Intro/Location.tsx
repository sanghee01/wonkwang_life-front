import React, { useEffect } from "react";
import styled from "styled-components";
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { IoMdBus } from "react-icons/io";
import { MdDirectionsSubway } from "react-icons/md";

const Location: React.FC = () => {
  useEffect(() => {
    const { kakao } = window as any;
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(37.49879082400211, 126.72478981193977),
      level: 2,
    };

    const map = new kakao.maps.Map(container, options);

    const markerPosition = new kakao.maps.LatLng(
      37.49879082400211,
      126.72478981193977
    );
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    marker.setMap(map);

    const iwContent = `<div style="text-align:center;padding:2px;width:210px;">인천광역시 부평구 부흥로 295</div>`;
    const infowindow = new kakao.maps.InfoWindow({
      content: iwContent,
    });
    infowindow.open(map, marker);

    kakao.maps.event.addListener(marker, "click", () => {
      window.open(
        "https://map.kakao.com/link/map/CompanyName,37.49879082400211,126.72478981193977"
      );
    });
  }, []);

  return (
    <Container>
      <Title>오시는 길</Title>
      <MapContainer id="map"></MapContainer>
      <InfoContainer>
        <InfoBox>
          <FaLocationDot />
          <span>인천광역시 부평구 부흥로 295, 2층 201호(부평동, 부평빌딩)</span>
        </InfoBox>
        <InfoBox>
          <IoCall />
          <span>TEL: 032-515-7417</span>
        </InfoBox>
      </InfoContainer>
      <TrafficContainer>
        <h3>교통편</h3>
        <TrafficBox>
          <TrafficWay>
            <IoMdBus />
            <div>
              <b>버스</b>
              <span>부평구보건소 하차</span>
            </div>
          </TrafficWay>
          <TrafficWay>
            <MdDirectionsSubway />
            <div>
              <b>지하철</b>
              <span>부평시장역 1번 출구 도보로 4분</span>
            </div>
          </TrafficWay>
        </TrafficBox>
      </TrafficContainer>
    </Container>
  );
};

export default Location;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 1.7rem;
  margin-bottom: 20px;
`;

const MapContainer = styled.div`
  width: 60%;
  height: 500px;
  border: 1px solid #ddd;
`;

const InfoContainer = styled.div`
  width: 60%;
  display: flex;
  justify-content: space-between;
`;

const InfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  font-size: 1.1rem;
  & svg {
    font-size: 1.5rem;
    background-color: #d3d3d3;
    width: 50px;
    height: 50px;
    padding: 12px;
    border-radius: 50%;
  }
`;

const TrafficContainer = styled.div`
  width: 60%;
  margin-top: 50px;
  & h3 {
    color: var(--base-color);
    font-size: 1.4rem;
  }
`;

const TrafficBox = styled.div`
  display: flex;
  gap: 40px;
`;

const TrafficWay = styled(InfoBox)`
  margin-bottom: 30px;
  & b {
    font-weight: 600;
  }

  & div {
    display: flex;
    flex-direction: column;
  }
`;
