import { GET_POSTS, POST_ERROR, UPDATE_LIKE } from "../actions/types"

const initialState= {
    post: null,
    posts: [],
    loading: true,
    error: {}
}

export default function(state = initialState, action){
    const { type, payload } = action

    switch(type){
        case GET_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false
            };
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        case UPDATE_LIKE:
            return {
                ...state,
                posts: state.post.map(post => post._id === payload.id ? { ...post, likes: payload.likes } : post),
                loading: false
            }
        default:
            return state;
    }
} 