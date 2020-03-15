import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import thunk from 'redux-thunk'

import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas'

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware, thunk))
    sagaMiddleware.run(rootSaga)
    return store
}