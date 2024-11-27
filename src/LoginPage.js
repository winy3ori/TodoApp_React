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
      <h2 className="title">Log In</h2>
      <p className="sub">Login to your account</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="signupButton">
          Log In
        </button>
      </form>

      <p className="link">
        New to Todo? <Link to="/signUpPage">Sign Up</Link>
      </p>

      <div className="social-login-buttons">
        <button type="button" onClick={onGoogleLogin} className="oauth2btn">
          Continue with Google
        </button>
        <button type="button" onClick={onNaverLogin} className="oauth2btn">
          Continue with Naver
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
