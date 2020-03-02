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
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/Routing/PrivateRoute';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/Edit-Profile';
import AddEducation from './components/profile-form/AddEducation';
import AddExperience from './components/profile-form/AddExperience'; 
import Profiles from './components/Profiles/Profiles';
import Profile  from './components/Profile/Profile';
import Post from 'module'

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
            <Route exact path='/profiles'  component={Profiles} />
            <Route exact path='/profile/:id'  component={Profile } />
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute exact path='/create-profile' component={CreateProfile} />
            <PrivateRoute exact path='/edit-profile' component={EditProfile} />
            <PrivateRoute exact path='/add-education' component={AddEducation} />
            <PrivateRoute exact path='/add-experience' component={AddExperience} />
            <PrivateRoute exact path='/posts' component={Post} />
          </Switch>
        </section>
      </Fragment>
    </BrowserRouter>
  );
}

export default App;
