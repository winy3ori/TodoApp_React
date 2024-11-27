import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import './SignUpPage.css'; // CSS 파일 연결

function SignUpPage() {
  const navigate = useNavigate(); // navigate 훅 사용
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState(''); // 전체 메시지
  const [emailMessage, setEmailMessage] = useState(''); // 이메일 인증 메시지
  const [verificationCodeMessage, setVerificationCodeMessage] = useState(''); // 인증 코드 메시지
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [username, setUsername] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordCheckChange = (e) => {
    setPasswordCheck(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // 이메일 인증 요청
  const handleEmailVerification = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/emailAuth/sendEmail`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage('인증 이메일이 전송되었습니다.');
        } else {
          setMessage('인증 이메일 전송 실패.');
        }
      } else {
        setMessage('인증 이메일 전송 실패.');
      }
    } catch (error) {
      setMessage('서버와의 연결에 실패했습니다.');
      console.error('Error:', error);
    }
  };

  // 인증 코드 확인
  const handleVerifyCode = async () => {
    if (!email || !verificationCode) {
      setVerificationCodeMessage('이메일과 인증 코드를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:8080/emailAuth/verifyCode',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, verifyCode: verificationCode }), // 이메일과 인증 코드를 함께 전송
        }
      );

      if (response.ok) {
        const data = await response.json();
        setVerificationCodeMessage('인증 완료되었습니다!'); // 인증 코드 성공 메시지
      } else {
        const errorData = await response.json();
        setVerificationCodeMessage(
          errorData.message || '인증 코드가 잘못되었습니다.'
        );
      }
    } catch (error) {
      setVerificationCodeMessage('서버와의 연결에 실패했습니다.');
      console.error('Error:', error);
    }
  };

  // 회원가입 요청
  const handleSignUp = async (e) => {
    e.preventDefault(); // 폼 제출 방지

    // 비밀번호 확인
    if (password !== passwordCheck) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/member/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.alert('회원가입이 완료되었습니다!');
        navigate('/'); // 로그인 페이지로 이동
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || '회원가입 실패.');
      }
    } catch (error) {
      setMessage('서버와의 연결에 실패했습니다.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>회원가입</h2>
      <p className="sub">새 계정을 만드세요.</p>
      <div className="form-group">
        <label htmlFor="email">이메일</label>
        <div className="email-container">
          <input
            type="text"
            id="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={handleEmailChange}
          />
          <button
            type="button"
            className="verify-btn"
            onClick={handleEmailVerification}
          >
            인증
          </button>
        </div>
        {emailMessage && <p>{emailMessage}</p>} {/* 이메일 인증 메시지 */}
      </div>
      <div className="form-group">
        <label htmlFor="verificationCode">인증 코드</label>
        <div className="verification-container">
          <input
            type="text"
            id="verificationCode"
            placeholder="인증 코드를 입력하세요"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
          />
          <button
            type="button"
            className="verify-btn"
            onClick={handleVerifyCode}
          >
            확인
          </button>
        </div>
        {verificationCodeMessage && <p>{verificationCodeMessage}</p>}{' '}
        {/* 인증 코드 메시지 */}
      </div>
      <div className="form-group">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="passwordCheck">비밀번호 확인</label>
        <input
          type="password"
          id="passwordCheck"
          placeholder="비밀번호를 한번 더 입력하세요"
          value={passwordCheck}
          onChange={handlePasswordCheckChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="username">이름</label>
        <input
          type="text"
          id="username"
          placeholder="이름을 입력하세요"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <button type="submit" className="signupButton" onClick={handleSignUp}>
        회원가입
      </button>
      {message && <p>{message}</p>} {/* 회원가입 메시지 */}
      <p className="link">
        이미 계정이 있으신가요? <Link to="/">로그인</Link>
      </p>
    </div>
  );
}

export default SignUpPage;
