import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_HASHTAG = 'SELECT_HASHTAG'
export const INVALIDATE_HASHTAG = 'INVALIDATE_HASHTAG'

export function selectHashtag(hashtag) {
  return {
    type: SELECT_HASHTAG,
    hashtag
  }
}

export function invalidateHashtag(hashtag) {
  return {
    type: INVALIDATE_HASHTAG,
    hashtag
  }
}

function requestPosts(hashtag) {
  return {
    type: REQUEST_POSTS,
    hashtag
  }
}

function receivePosts(hashtag, json) {
  return {
    type: RECEIVE_POSTS,
    hashtag,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

function fetchPosts(hashtag) {
  return dispatch => {
    dispatch(requestPosts(hashtag))
    return fetch(`https://www.reddit.com/r/${hashtag}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(hashtag, json)))
  }
}

function shouldFetchPosts(state, hashtag) {
  const posts = state.postsByHashtag[hashtag]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

export function fetchPostsIfNeeded(hashtag) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), hashtag)) {
      return dispatch(fetchPosts(hashtag))
    }
  }
}
