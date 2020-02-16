import {createStore} from 'redux';
import actualizarState from './reducers';

const store = createStore(actualizarState);

export default store;
