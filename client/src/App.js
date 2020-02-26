import React, { Fragment, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import store from './store';
import './App.css';

//Actions
import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken';

//Components
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';

if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => {
  //empty brackets makes it run only once
  useEffect(()=> {
    store.dispatch(loadUser());
  }, [])

  return (
    <BrowserRouter>
      <Fragment>
        <Navbar />
        <Route exact path='/'  component={Landing} />
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
          </Switch>
        </section>
      </Fragment>
    </BrowserRouter>
  );
}

export default App;
