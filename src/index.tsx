
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Api from './api';

window.addEventListener('error', e => {
  if (e.message === 'ResizeObserver loop limit exceeded') {
    const resizeObserverErrDiv = document.getElementById(
      'webpack-dev-server-client-overlay-div'
    );
    const resizeObserverErr = document.getElementById(
      'webpack-dev-server-client-overlay'
    );
    if (resizeObserverErr) {
      resizeObserverErr.setAttribute('style', 'display: none');
    }
    if (resizeObserverErrDiv) {
      resizeObserverErrDiv.setAttribute('style', 'display: none');
    }
  }
});

(window as any).install();

let api: Api;

const resetApi = async (): Promise<void> => {
  return new Promise(resolve => {
    Api.reset().then(instance => {
      api = instance;
      resolve()
    })
  })
}

Api.initilize().then((instance: Api) => {
  api = instance
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <BrowserRouter>
      <App key={api.key} />
    </BrowserRouter>
  );
})
export { api, resetApi }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
