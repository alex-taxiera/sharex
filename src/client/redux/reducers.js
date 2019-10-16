import { combineReducers, bindActionCreators } from 'redux'
import { createReducer } from 'reduxsauce'
import { Types } from './actions'

export const INITIAL_STATE = {
  isFetching: false,
  isUpdating: false,
  error: null,
  end: false,
  data: []
}

export const INITIAL_USER_STATE = {
  username: '',
  password: ''
}

const request = (state = INITIAL_STATE, action) => {
  return {
    ...state,
    isFetching: true,
    isUpdating: false,
    error: null
  }
}

const update = (state = INITIAL_STATE, action) => {
  return {
    ...state,
    isFetching: false,
    isUpdating: true,
    error: null
  }
}

const success = (state = INITIAL_STATE, action) => {
  return {
    ...state,
    isFetching: false,
    isUpdating: false,
    end: (action.tail || !action.head) && action.files.length === 0,
    data: action.head
      ? action.files.concat(state.data)
      : state.data.concat(action.files)
  }
}

const successUpdate = (state = INITIAL_STATE, action) => {
  const updateIndex = state.data.findIndex((x) => x.id === action.paste.id)
  const newData = [ ...state.data ]
  newData[updateIndex] = action.paste
  if (window) {
    window.alert('UPDATED')
  }
  return {
    ...state,
    isFetching: false,
    isUpdating: false,
    data: newData
  }
}

const error = (state = INITIAL_STATE, action) => {
  return {
    ...state,
    isFetching: false,
    isUpdating: false,
    error: action.error
  }
}

const LINK_HANDLERS = {
  [Types.REQUEST_LINKS]: request,
  [Types.SUCCESS_LINKS]: success,
  [Types.ERROR_LINKS]: error
}

const PASTE_HANDLERS = {
  [Types.REQUEST_PASTES]: request,
  [Types.SUCCESS_PASTES]: success,
  [Types.ERROR_PASTES]: error,
  [Types.UPDATE_PASTE]: update,
  [Types.SUCCESS_UPDATE_PASTE]: successUpdate
}

const IMAGE_HANDLERS = {
  [Types.REQUEST_IMAGES]: request,
  [Types.SUCCESS_IMAGES]: success,
  [Types.ERROR_IMAGES]: error
}

export default combineReducers({
  links: createReducer(INITIAL_STATE, LINK_HANDLERS),
  pastes: createReducer(INITIAL_STATE, PASTE_HANDLERS),
  images: createReducer(INITIAL_STATE, IMAGE_HANDLERS)
})
