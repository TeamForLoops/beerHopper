// single view redux

import axios from 'axios'

// action types

const SET_SINGLE_REVIEW = 'SET_SINGLE_REVIEW'
const UPDATE_REVIEW = 'UPDATE_REVIEW'

// action creators

export const setSingleReview = review => ({
  type: SET_SINGLE_REVIEW,
  review
})

export const updateReview = review => ({
  type: UPDATE_REVIEW,
  review
})

// thunks

export const fetchSingleReview = reviewId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/reviews/beer/${reviewId}`)
    dispatch(setSingleReview(data))
  } catch (err) {
    console.log(err)
  }
}

export const updateReviewThunk = reviewUpdate => async dispatch => {
  try {
    const {data} = await axios.put(
      `/api/reviews/${beerUpdate.id}`,
      reviewUpdate
    )
    dispatch(updateReview(data))
  } catch (err) {
    console.log(err)
  }
}

// reducer

const initialState = {}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SINGLE_REVIEW:
      return action.review
    case UPDATE_BEER:
      return action.review
    default:
      return state
  }
}
