import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import AppContent from './components/AppContent';
import AppHeader from './components/AppHeader';
import PageTitle from './components/PageTitle';
import styles from './styles/modules/app.module.scss';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 로그인 상태 확인 후 todoList를 가져오는 함수
  const fetchTodoList = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/todo/get', {
        method: 'GET',
        credentials: 'include', // 쿠키를 포함시켜 요청을 보냄
      });

      if (response.ok) {
        const todoList = await response.json(); // JSON 데이터 파싱
        console.log('Fetched Todo List:', todoList);

        // 로컬스토리지에 저장
        localStorage.setItem('todoList', JSON.stringify(todoList));
        console.log('Todo List saved to localStorage');
      } else {
        console.error('Failed to fetch todo list:', response.status);
      }
    } catch (err) {
      console.error('Error fetching todo list:', err);
    }
  };

  // 로그인 상태 체크 및 todoList 가져오기
  useEffect(() => {
    // 로그인 상태 확인
    fetch('http://localhost:8080/api/auth/status', {
      method: 'GET',
      credentials: 'include', // 쿠키를 포함시켜 요청을 보냄
    })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setLoading(false);
      });
  }, []);

  // 로그인 시 todoList 가져오기
  useEffect(() => {
    // 로컬스토리지에서 todoList 확인 후 없으면 API 호출
    const cachedTodoList = localStorage.getItem('todoList');
    if (isLoggedIn && !cachedTodoList) {
      fetchTodoList(); // 로그인 시 todoList 가져오기
    }
  }, [isLoggedIn]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signUpPage" element={<SignUpPage />} />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <div className="container">
                <PageTitle>TODO List</PageTitle>
                <div className={styles.app__wrapper}>
                  <AppHeader />
                  <AppContent />
                </div>
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    style: {
                      fontSize: '1.4rem',
                    },
                  }}
                />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
