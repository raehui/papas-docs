import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
  return (
    <>
        <h1 className="text-center mt-4">자동 문서 작성</h1>
        
        {/* 밝은 사각형 영역 */}
        <div 
          className="d-flex justify-content-center align-items-center mx-auto mt-5"
          style={{ 
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '500px',
            height: '400px'
          }}
        >
          {/* 버튼 컨테이너 */}
          <div className="d-flex flex-column gap-4">
            <button 
              className="btn btn-warning btn-lg px-5 py-3"
              style={{ 
                backgroundColor: '#ffc107',
                borderColor: '#ffc107',
                color: '#000',
                fontWeight: '600'
              }}
              onClick={()=>navigate('/estimate')}
            >
              견적서
            </button>
            <button 
              className="btn btn-warning btn-lg px-5 py-3"
              disabled
              style={{ 
                backgroundColor: '#ffc107',
                borderColor: '#ffc107',
                color: '#000',
                fontWeight: '600',
              }}
            >
              이력서
            </button>
            <button 
              className="btn btn-warning btn-lg px-5 py-3"
              disabled
              style={{ 
                backgroundColor: '#ffc107',
                borderColor: '#ffc107',
                color: '#000',
                fontWeight: '600'
              }}
            >
              계약서
            </button>
          </div>
        </div>
    </>
  )
}

export default Home