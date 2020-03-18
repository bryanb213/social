import { combineReducers } from 'redux';
//import alerts from './alert';
import auth from './auth';
import profile from './profile';
import errors from './errors';


export default combineReducers({
    auth : auth,
    profile : profile,
    errors: errors
})