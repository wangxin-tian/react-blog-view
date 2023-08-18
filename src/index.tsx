import ReactDOM from 'react-dom/client';
import '@/index.css';
import 'animate.css'; 
import App from '@/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { dot } from './tools';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

function change() {
  // 视口宽度
  const clientWidth = document.body.clientWidth;
  if( clientWidth <= 768 ) {
    document.body.className = 'global-style small-screen-style';
  } else {
    document.body.className = 'global-style';
  }
}

const changeDebance = dot('D',function (){
  change();
}, 500);

window.onresize = changeDebance;
window.onorientationchange = changeDebance;

change();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
