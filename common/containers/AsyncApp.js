import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectHashtag, fetchPostsIfNeeded, invalidateHashtag } from '../actions'
// import Picker from '../components/Picker'
import Posts from '../components/Posts'

class AsyncApp extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch, selectedHashtag } = this.props
    dispatch(fetchPostsIfNeeded(selectedHashtag))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedHashtag !== this.props.selectedHashtag) {
      const { dispatch, selectedHashtag } = nextProps
      dispatch(fetchPostsIfNeeded(selectedHashtag))
    }
  }

  handleChange(nextHashtag) {
    this.props.dispatch(selectHashtag(nextHashtag))
  }

  handleRefreshClick(e) {
    e.preventDefault()

    const { dispatch, selectedHashtag } = this.props
    dispatch(invalidateHashtag(selectedHashtag))
    dispatch(fetchPostsIfNeeded(selectedHashtag))
  }

  render() {
    const { selectedHashtag, posts, isFetching, lastUpdated } = this.props
    return (
      <div>
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <a href='#'
               onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }
        </p>
        {isFetching && posts.length === 0 &&
          <h2>Loading...</h2>
        }
        {!isFetching && posts.length === 0 &&
          <h2>Empty.</h2>
        }
        {posts.length > 0 &&
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        }
      </div>
    )
  }
}

AsyncApp.propTypes = {
  selectedHashtag: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedHashtag, postsByHashtag } = state
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsByHashtag[selectedHashtag] || {
    isFetching: true,
    items: []
  }

  return {
    selectedHashtag,
    posts,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(AsyncApp)