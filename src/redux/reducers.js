import {combineReducers} from 'redux';
import {
  id_user, 
  token, 
  orden,
  envio,
  iva, 
  correo,
  nombre,
  telefono,
  imagen
} from './actions';

const initialState = {
  id_user: '',
  token: '',
  orden: '',
  envio: '',
  iva: '',
  correo: '',
  nombre: '',
  telefono: '',
  imagen: '',
};

function actualizarState(state = initialState, action) {
  switch (action.type) {
    case nombre:
      return Object.assign({}, state, {
        nombre: action.text,
      });
    case id_user:
      return Object.assign({}, state, {
        id_user: action.text,
      });
    case token:
      return Object.assign({}, state, {
        token: action.text,
      });
    case correo:
      return Object.assign({}, state, {
        correo: action.text,
      });
    case telefono:
      return Object.assign({}, state, {
        telefono: action.text,
      });
    case imagen:
      return Object.assign({}, state, {
        imagen: action.text,
      });
    case orden:
      return Object.assign({}, state, {
        orden: action.text,
      });
    case envio:
      return Object.assign({}, state, {
        envio: action.text,
      });
    case iva:
      return Object.assign({}, state, {
        iva: action.text,
      });
    default:
      return state;
  }
}

export default actualizarState;
