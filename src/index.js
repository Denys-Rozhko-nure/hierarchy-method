// Імпортуємо бібліотеку React задля корректної роботи рендерингу
import React from 'react';
import ReactDOM from 'react-dom';
// Підключення стилів. Це робиться у файлі джаваскрипт, бо збірник React 
// (на базі WebPack) усе одно переносить їх у HTML самостійно
import './index.css';

// Імпортуємо наш компонент
import App from './App';

// Вбудовуємо наш компонент у HTML-елемент з id="root"
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);