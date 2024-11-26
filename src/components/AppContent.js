import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 로그아웃 후 페이지 이동을 위해 추가
import styles from '../styles/modules/app.module.scss';
import TodoItem from './TodoItem';

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};
const child = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function AppContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const todoList = useSelector((state) => state.todo.todoList);
  const filterStatus = useSelector((state) => state.todo.filterStatus);

  const sortedTodoList = [...todoList];
  sortedTodoList.sort((a, b) => new Date(b.time) - new Date(a.time));

  const filteredTodoList = sortedTodoList.filter((item) => {
    if (filterStatus === 'all') {
      return true;
    }
    return item.status === filterStatus;
  });

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      // 1. localStorage의 값 가져오기
      const todos =
        localStorage.getItem('todoList') &&
        localStorage.getItem('todoList') !== ''
          ? JSON.parse(localStorage.getItem('todoList'))
          : [];
      console.log(todos);

      // 2. 서버에 할 일 목록 동기화 요청
      const sync = await fetch('http://localhost:8080/api/todo/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todos), // 로컬 저장소에서 가져온 할 일 목록 전송
        credentials: 'include', // 쿠키 포함 요청
      });
      if (!sync.ok) {
        console.error('Failed to sync todos:', sync.statusText);
      }
      const data = await sync.json();
      console.log('Sync successful:', data);

      localStorage.removeItem('todoList'); // 또는 localStorage.clear();

      // Spring Boot 로그아웃 API 호출
      const response = await fetch('http://localhost:8080/api/auth/logout', {
        method: 'GET',
        credentials: 'include', // 쿠키 포함 요청
      });

      if (response.ok) {
        // 로그인 페이지로 리다이렉트
        navigate('/login');
      } else {
        console.error('Logout failed: ', response.statusText);
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    }
  };

  return (
    <motion.div
      className={styles.content__wrapper}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {filteredTodoList && filteredTodoList.length > 0 ? (
          filteredTodoList.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        ) : (
          <motion.p variants={child} className={styles.emptyText}>
            No Todos
          </motion.p>
        )}
      </AnimatePresence>

      {/* 로그아웃 버튼 */}
      <motion.button
        className={styles.logoutButton}
        onClick={handleLogout}
        variants={child}
      >
        Logout
      </motion.button>
    </motion.div>
  );
}

export default AppContent;
