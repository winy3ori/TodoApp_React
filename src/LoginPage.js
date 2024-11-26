import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 구글 로그인
  const onGoogleLogin = async () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  // 네이버 로그인
  const onNaverLogin = async () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/naver';
  };

  // 일반 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/member/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // 로그인 성공 시 토큰 저장
        navigate('/'); // 메인 페이지로 리디렉션
      } else {
        const errorData = await response.json();
        setError(errorData.message || '로그인 실패');
      }
    } catch (err) {
      setError('서버와의 연결에 문제가 발생했습니다.');
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <p className="sub">계정에 로그인하세요.</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">아이디</label>
          <input
            type="text"
            id="email"
            placeholder="아이디를 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">로그인</button>
      </form>

      <p className="link">
        계정이 없으신가요? <Link to="/signUpPage">회원가입</Link>
      </p>

      <div className="social-login-buttons">
        <button
          type="button"
          onClick={onGoogleLogin}
          className="google-login-btn"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={onNaverLogin}
          className="naver-login-btn"
        >
          Continue with Naver
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
