
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Api from './api';
import { Auth0Provider } from '@auth0/auth0-react';
import config from './config';

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

let subscription: any = undefined;

export let subscribeToNotification = async (token?: string | null) => {
  if (token) {
    await fetch(`${config.GATEWAY_ADDRESS}/subscribeToNotification`, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
        "token": token
      }
    })
  }
}

async function registerServiceWorker() {
  const register = await navigator.serviceWorker.register('./worker.js', {
    scope: '/'
  });
  subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: config.publicVapidKey,
  });
}

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

const onRedirectCallback = (appState: any) => {
  window.location = appState && appState.returnTo ? appState.returnTo : window.location.pathname
};

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  onRedirectCallback,
  authorizationParams: {
    redirect_uri: window.location.origin,
    // ...(config.audience ? { audience: config.audience } : null),
    scope: 'openid profile email'
  },
};

registerServiceWorker()

Api.initilize().then((instance: Api) => {
  api = instance
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <Auth0Provider
      {...providerConfig}
    >
      <BrowserRouter>
        <App key={api.key} />
      </BrowserRouter>
    </Auth0Provider>
  );
})
export { api, resetApi }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
