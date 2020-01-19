import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import LoginPage from '@/views/user/login'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import RouterMap from './router/router-map'
import routes from './router/routes'
import store from './store'
import '@/assets/css/iconfont.css'


function App () {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <RouterMap routes={routes} />
          <Route path="/login" component={LoginPage} />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
