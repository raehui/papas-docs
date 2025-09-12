import React from 'react';
import { Button, Nav, Navbar } from 'react-bootstrap'; // Container 제거
import { useNavigate } from 'react-router-dom';

const IndexNavBar = ({ onLogin, onSignup }) => {
    const brandIconStyle = {
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 22, height: 45, borderRadius: 4, background: "#f0f3f4",
        border: "1px solid #c9d1d3", marginRight: 8,
    };
    const pillBtnStyle = {
        background: "#fff3a3", border: "1px solid #e6d97a", borderRadius: 10,
    };
    const navigate = useNavigate()

    return (
        <Navbar
            expand="lg"
            fixed="top"
            className="w-100 py-2 shadow-sm"
            style={{ backgroundColor: "#6c757d", borderBottom: "1px solid #cfd4d4" }}
        >
            {/* 컨테이너를 부트스트랩의 container-fluid 클래스로 직접 처리 */}
            <div className="container-fluid px-3">
                <Navbar.Brand href="#" className="d-flex align-items-center">
                    <span style={brandIconStyle}>📄</span>
                    <span style={{ fontWeight: 600, fontSize: 18, color: "#233142" }} onClick={()=>navigate('/')}>
                        파쓰문서
                    </span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-nav" />
                <Navbar.Collapse id="main-nav">
                    <Nav className="ms-auto d-flex align-items-center gap-2">
                        <Button size="sm" variant="warning" style={pillBtnStyle} onClick={onLogin}>
                            로그인
                        </Button>
                        <Button size="sm" variant="warning" style={pillBtnStyle} onClick={onSignup}>
                            회원가입
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
};

export default IndexNavBar;