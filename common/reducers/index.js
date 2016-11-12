import { combineReducers } from 'redux'
import {
  SELECT_HASHTAG, INVALIDATE_HASHTAG,
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions'

function selectedHashtag(state = 'reactjs', action) {
  switch (action.type) {
  case SELECT_HASHTAG:
    return action.hashtag
  default:
    return state
  }
}

function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_HASHTAG:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function postsByHashtag(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_HASHTAG:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.hashtag]: posts(state[action.hashtag], action)
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsByHashtag,
  selectedHashtag
})

export default rootReducer