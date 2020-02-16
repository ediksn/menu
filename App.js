/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import Login from './src/Login';
import Registro from './src/Registro';
import Index from './src/Index';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Inicio from './src/Inicio';
import Home from './src/Home';
import Cuenta from './src/Cuenta';
import Direcciones from './src/Direcciones';
import NewDireccion from './src/NewDireccion';
import Busqueda from './src/Busqueda';
import Favoritos from './src/Favoritos';
import Pedidos from './src/Pedidos';
import Password from './src/Password';
import Telefono from './src/Telefono';
import Codigo from './src/Codigo';
import Perfil from './src/Perfil';
import NewPago from './src/NewPago';
import Restaurant from './src/Restaurant';
import Producto from './src/Producto';
import Orden from './src/Orden';
import Carrito from './src/Carrito';
import Pagos from './src/Pagos';
import Categorias from './src/Categorias';
import Recuperar from './src/Recuperar';

const AppLogin = createStackNavigator(
  {
    Index: Index, 
    Login: Login, 
    Registro: Registro},
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    defaultNavigationOptions: {
      gestureEnabled: false,
    },
  },
);

const AppHome = createStackNavigator(
  {
    Inicio: Inicio,
    Home: Home,
    Favoritos: Favoritos,
    Busqueda: Busqueda,
    Pedidos: Pedidos,
    Password: Password,
    Telefono: Telefono,
    Codigo: Codigo,
    NewDireccion: NewDireccion,
    Direcciones: Direcciones,
    Cuenta: Cuenta,
    Carrito: Carrito,
    Perfil: Perfil,
    NewPago: NewPago,
    Pagos: Pagos,
    Orden: Orden,
    Restaurant: Restaurant,
    Producto: Producto,
    Categorias: Categorias,
    Recuperar:Recuperar
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    defaultNavigationOptions: {
      gestureEnabled: false,
    },
  },
);

const App = createAppContainer(
  createSwitchNavigator(
    {
      AppLogin: AppLogin,
      AppHome: AppHome,
    },
    {
      initialRouteName: 'AppLogin',
    },
  ),
);

export default App;
