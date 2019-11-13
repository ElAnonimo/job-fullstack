import React, { useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Routes from './components/Routes';
import store from './store/store';
import { loadUser } from './actions/auth';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store} className="App">
      <BrowserRouter>
        <Route component={Routes} />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
