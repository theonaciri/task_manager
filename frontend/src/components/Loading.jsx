import React from 'react';
import './Loading.css';

const Loading = ({ size = 'medium', text = 'Chargement...' }) => {
  return (
    <div className={`loading loading-${size}`}>
      <div className="spinner"></div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
};

export default Loading;
