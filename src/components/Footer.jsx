import React from 'react';

const Footer = () => {
  return (
    <footer
      className="w-100 border-top py-4 text-center"
      style={{ backgroundColor: '#f5f6f7', marginTop: 'auto' }}
    >
      {/* 네비바처럼 전체 폭: container-fluid + 좌우 여백만 px-3 */}
      <div className="container-fluid px-3">
        <p className="m-0" style={{ color: '#6c757d' }}>
          © 2024 All-Docs. All rights reserved.
        </p>
        <p className="m-0 mt-2" style={{ color: '#6c757d' }}>
          Created by: rae hui Kwak | Contact:{' '}
          <a href="mailto:glasofk12345@gmail.com">glasofk12345@gmail.com</a>
        </p>
        <p className="m-0 mt-2" style={{ color: '#6c757d' }}>
          이 웹사이트와 해당 콘텐츠는 저작권법에 따라 보호됩니다. 무단 전재, 배포 또는 수정은 금지하고 있습니다.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
