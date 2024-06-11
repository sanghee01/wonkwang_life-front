import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import { confirm, successAlert, warningAlert } from "../../components/Alert";
import api from "../../api";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import "react-quill/dist/quill.snow.css";

interface PostData {
  title: string;
  content: string;
  oneLineIntroduce: string;
  storeLink: string;
  productType: string;
  packingUnit: string;
  tag: string;
  hit: number;
}

const Post = () => {
  const [postData, setPostData] = useState<PostData | null>(null);
  const [images, setImages] = useState<[String] | null>(null);
  const { id } = useParams();
  const user = useRecoilValue(userState);

  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await api.get(`/post/${id}`);
        console.log("API Response:", response.data); // 디버깅용
        if (response.data && response.data.content) {
          setPostData(response.data.content);
          setImages(response.data.content.imageUrls);
        } else {
          console.error("예상치 못한 API 응답 구조");
        }
      } catch (error: any) {
        const result = await warningAlert(error.response.data.message);
        console.log(result);
      }
    };
    getPost();

    setTimeout(() => {
      console.log(user);
    }, 2000);
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: url,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("URL이 클립보드에 복사되었습니다.");
      } catch (error) {
        console.error("클립보드 복사 실패:", error);

        // 일부 브라우저에서는 execCommand를 사용해 클립보드에 복사하는 대체 방법
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          alert("URL이 클립보드에 복사되었습니다.");
        } catch (err) {
          alert("클립보드 복사에 실패했습니다. 수동으로 복사해주세요.");
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const handleDelete = async () => {
    const result = await confirm("정말 글을 삭제하시겠습니까?");
    if (!result.isConfirmed) return;
    try {
      const response = await api.delete(`/post/${id}`);
      const result = await successAlert("글 삭제가 완료되었습니다.");
      if (result.isConfirmed) navigate("/product");
    } catch (error: any) {
      const result = await warningAlert(error.response.data.message);
      console.log(result);
    }
  };

  return (
    <Container>
      <PostForm>
        {user && (
          <ButtonContainer>
            <Button onClick={(e) => navigate(`/write?edit=${id}`)}>수정</Button>
            <Button onClick={handleDelete} style={{ background: "tomato" }}>
              삭제
            </Button>
            <div>조회수 : {postData?.hit}</div>
          </ButtonContainer>
        )}
        <TopContainer>
          {images && <img src={images[0]} alt="대표이미지" />}
          <TopContent>
            <Title>{postData?.title}</Title>
            <Introduce>
              <div>{postData?.oneLineIntroduce}</div>
            </Introduce>
            <Detail>
              <div>제품유형</div>
              <div>{postData?.productType}</div>
            </Detail>
            <Detail>
              <div>포장단위</div>
              <div>{postData?.packingUnit}</div>
            </Detail>
            <Detail>
              <div>권장소비자가격</div>
              <div>30,000원</div>
            </Detail>
            <Detail>
              <div>구매채널</div>
              <div>네이버스토어</div>
            </Detail>
            <Tag>
              <div>{postData?.tag}</div>
            </Tag>
            {postData?.storeLink && (
              <NaverBtn href={postData?.storeLink} target="_blank">
                구매하기
              </NaverBtn>
            )}
            <Button onClick={() => handleShare()}>공유하기</Button>
          </TopContent>
        </TopContainer>
        <Hr />
        <Content
          dangerouslySetInnerHTML={{ __html: postData?.content }}
          className="ql-editor"
        />
        {images?.map(
          (image: any, index) =>
            index !== 0 && <Image key={index} src={image} alt={"상품이미지"} />
        )}
        <ButtonContainer>
          <Button onClick={() => navigate("/product")}>목록으로</Button>
        </ButtonContainer>
      </PostForm>
    </Container>
  );
};

const centeredFlex = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  ${centeredFlex}
  width: 100%;
  min-height: 100vh;
  padding: 20px;
`;

const PostForm = styled.div`
  ${centeredFlex}
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  padding: 40px 30px;
  gap: 20px;

  @media screen and (max-width: 500px) {
    padding: 40px 10px;
  }
`;

const TopContainer = styled.div`
  ${centeredFlex}
  width: 100%;
  height: auto;
  flex-flow: row nowrap;
  align-items: center;
  gap: 60px;

  & img {
    width: 50%;
    height: 100%; // 추가된 부분
    object-fit: cover; // 이미지 비율을 유지하면서 요소를 채우도록 설정
  }

  @media screen and (max-width: 900px) {
    flex-flow: column;

    & img {
      width: 100%;
    }
  }
`;

const TopContent = styled.div`
  ${centeredFlex}
  width: 50%;
  height: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;

  @media screen and (max-width: 900px) {
    width: 100%;
  }
`;

const Detail = styled.div`
  display: flex;
  font-size: 1.2rem;
  width: 100%;

  & :nth-child(1) {
    width: 210px;
  }
  & :nth-child(2) {
    width: calc(100% - 210px);
    white-space: wrap;
  }
`;

const Tag = styled.div`
  margin-top: 20px;
  word-spacing: 15px;
`;

const Title = styled.div`
  width: 100%;
  font-size: 1.8rem;
  font-weight: 700;
  color: #333333;
`;

const Introduce = styled.div`
  width: 100%;
  font-size: 1.4rem;
  font-weight: 700;
  text-align: left;
  color: #333333;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  ${centeredFlex}
  flex-direction: row;
  gap: 10px;
`;

const Button = styled.button`
  width: 120px;
  height: 50px;
  background-color: #0288d1;
  color: #ffffff;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0277bd;
  }
`;

const Content = styled.div`
  width: 100%;
  min-height: auto;
  line-height: 1.5;
  color: #555555;
  padding: 0;
`;

const Image = styled.img`
  width: 100%;
  max-width: 100%;
  border-radius: 8px;
  margin-top: 20px;
`;

const NaverBtn = styled.a`
  padding: 10px 30px;
  background-color: #03c75a;
  font-weight: bolder;
  font-size: 1.1rem;
  color: white !important;
  align-self: flex-start;
  margin-top: 50px;
`;

const Hr = styled.hr`
  width: 100%;
  color: #808080aa;
  margin: 30px auto;
`;

export default Post;
