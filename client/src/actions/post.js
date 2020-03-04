import axios from 'axios';
import { setAlert } from '../reducers/alert';
import { GET_POSTS, POST_ERROR, UPDATE_LIKE } from './types';

//Get Posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('http://localhost:5000/api/posts')
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

//add like
export const addLike = (id) => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:5000/api/posts/like/${id}`)
        dispatch({
            type: UPDATE_LIKE,
            payload: { id, likes: res.data }
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}


//remove like
export const removeLike = (id) => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:5000/api/posts/unlike/${id}`)
        dispatch({
            type: UPDATE_LIKE,
            payload: { id, likes: res.data }
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}