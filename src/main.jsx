import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// router 정의한 라우팅 규칙 전체어 적용
import { RouterProvider } from 'react-router-dom'
// 라우터 설정 가지고 오기
import router from './router/index.jsx'

// MVP 는 전역 상태 관리가 필요 없으니 리덕스 사용 X -> 추후에 추가 가능성 있음

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)