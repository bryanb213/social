import axios from 'axios';
//import { setAlert } from './alert';
import {
    GET_PROFILES, GET_PROFILE, PROFILE_LOADING,
    CLEAR_PROFILE,
    GET_ERRORS,
    SET_CURRENT_USER
} from './types';


//Get current user profile
export const getCurrentProfile = () => async dispatch => {
    dispatch(setProfileLoading());

    axios.get('http://localhost:5000/api/profile')
        .then(res => dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
        )
        .catch(err => dispatch({
            type: GET_PROFILE,
            payload: {}
        }))
}

// Get profile by id
export const getProfileById = id => dispatch => {
    dispatch(setProfileLoading());
    axios
        .get(`http://localhost:5000/api/profile/user/${id}`)
        .then(res =>{console.log(res)
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })}
        )
        .catch(err =>
            dispatch({
                type: GET_PROFILE,
                payload: null
            })
        );
};

// Create Profile
export const createProfile = (profileData, history) => dispatch => {
    axios
        .post('http://localhost:5000/api/profile', profileData)
        .then(res => history.push('/dashboard'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Add experience
export const addExperience = (expData, history) => dispatch => {
    axios
        .post('http://localhost:5000/api/profile/experience', expData)
        .then(res => history.push('/dashboard'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Add education
export const addEducation = (eduData, history) => dispatch => {
    axios
        .post('http://localhost:5000/api/profile/education', eduData)
        .then(res => history.push('/dashboard'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Delete Experience
export const deleteExperience = id => dispatch => {
    axios
        .delete(`http://localhost:5000/api/profile/experience/${id}`)
        .then(res =>
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Delete Education
export const deleteEducation = id => dispatch => {
    axios
        .delete(`http://localhost:5000/api/profile/education/${id}`)
        .then(res =>
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Get all profiles
export const getProfiles = () => dispatch => {
    dispatch(setProfileLoading());
    axios
        .get('http://localhost:5000/api/profile/all')
        .then(res =>
            dispatch({
                type: GET_PROFILES,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_PROFILES,
                payload: null
            })
        );
};

// Delete account & profile
export const deleteAccount = () => dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
        axios
            .delete('http://localhost:5000/api/profile')
            .then(res =>
                dispatch({
                    type: SET_CURRENT_USER,
                    payload: {}
                })
            )
            .catch(err =>
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            );
    }
};

// Profile loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    };
};

// Clear profile
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_PROFILE
    };
};