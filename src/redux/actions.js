export const id_user = 'id_user';
export const token = 'token';
export const correo = 'correo';
export const nombre = 'nombre';
export const telefono = 'telefono';
export const imagen = 'imagen';
export const orden = 'orden';
export const envio ='envio';
export const iva ='iva';
// export const suscripcion = 'suscrito';
export function setNombre(text) {
  return {type: nombre, text};
}
export function setId(text) {
  return {type: id_user, text};
}
export function setToken(text) {
  return {type: token, text};
}
export function setCorreo(text) {
  return {type: correo, text};
}
export function setTelefono(text) {
  return {type: telefono, text};
}
export function setImagen(text) {
  return {type: imagen, text};
}
export function setOrden(text) {
  return {type: orden, text};
}
export function setIva(text) {
  return {type: iva, text};
}
export function setEnvio(text) {
  return {type: envio, text};
}
