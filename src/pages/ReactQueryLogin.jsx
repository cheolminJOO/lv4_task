import React, { useState } from 'react'
import * as S from '../shared/LoginStyle'
import { useNavigate } from 'react-router-dom'
import { checkLogin } from '../api/todos';
import {Portal} from 'react-portal'
import Modal from '../shared/Modal';
import {setCookie } from '../shared/Cookie';
import Auth from '../shared/Auth';


export default function Login() {
  const [token,setToken] = useState('')
  const [id,setId] = useState('')
  const [password,setPassword] = useState('')
  const [isOpenFirstModal, setIsOpenFirstModal] = useState(false);

  const onChangeId = (event) => {
    setId(event.target.value)
  }

  const onChangePW = (event) => {
    setPassword(event.target.value)
  }

  const navigate = useNavigate();

  const onClickSignUp = () => {
    navigate('/signup')
  }
//login api
  const onClickLoginBtn = async() => {
    if(!id && !password) {
      return alert("아이디와 비밀번호를 입력하세요")
    }
    const checkIdAndPW = {
      id,
      password,
    }

    const response =await checkLogin(checkIdAndPW)
    setToken(response)
    setIsOpenFirstModal((prev) => !prev)
  }

  const onClickCloseModal = () => {
    setIsOpenFirstModal((prev) => !prev)
  }


  if(token) { // 토큰이 쿠키에 담김.ㄷㄷㄷㄷ
    const time = 3600; //1시간
    const expiration = new Date(Date.now() + time * 1000);
    //Date.now() => 현재 시간을 밀리세컨으로 반환
    //그래서 1000을 곱한다.
    ///이러면 현재시간 나온다.
    setCookie('token', token, {
      path: "/",
      secure : true,
      sameSite : "none",
      expires:expiration //만료
    });
    setTimeout (() => {
      alert("토큰이 만료됐습니다. 다시 로그인해주세요");
    }, time * 1000)
  }



  return (
    <S.Wrapper>
      <Auth/>
      <S.BoxWrapper>
        {token && (
        <Portal node = {document && document.getElementById('modal-root')}>
          <Modal token ={token} onClickCloseModal={onClickCloseModal}/>
        </Portal>
       )} 
        <div>
          <h1>Todo Diary</h1>
        </div>
        <S.InputWrapper>
          <S.InputContentsWrapper>
            <S.LabelStyle>아이디 :</S.LabelStyle>
            <S.InputStyle type='text' value={id} onChange={onChangeId}/>
          </S.InputContentsWrapper>
          <S.InputContentsWrapper>
            <S.LabelStyle>비밀번호 :</S.LabelStyle>
            <S.InputStyle type='password' value={password} onChange={onChangePW}/>
          </S.InputContentsWrapper>
        </S.InputWrapper>
        <S.ButtonWrapper>
          <button onClick={onClickLoginBtn} >로그인</button>
          <button onClick={onClickSignUp}>회원가입</button>
        </S.ButtonWrapper>
      </S.BoxWrapper>
    </S.Wrapper>
  )
}
