import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  PermissionsAndroid,
  Linking,
  Platform
} from 'react-native';
import {Icon, Spinner} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import store from './redux/store';
import {
  setId, 
  setToken, 
  setOrden, 
  setEnvio, 
  setIva, 
  setCorreo, 
  setNombre, 
  setTelefono,
  setImagen
} from './redux/actions';
import { api } from './components/Api';
export default class Indx extends React.Component {
  constructor() {
    super();
    this.state = {
      logeado: '',
    };
    AsyncStorage.getItem('id_user')
      .then(res => {
        if (res) {
          this.setState({
            logeado: 'si',
          });
        }
        else {
          this.setState({
            logeado: 'no',
          });
        }
      })
      .catch(error => console.log(error));
  }

  componentDidMount() {
    if (Platform.OS === 'android'){
      Linking.getInitialURL()
        .then(url=>{
          if(url) this.navigate(url)
        })
    }else{
      Linking.addEventListener('url',this.handelOpenUrl)
    }
    this.getSetting()
    this.hasLocationPermission();
    AsyncStorage.multiGet(['id_user', 'token', 'orden','correo','nombre', 'telefono','imagen'])
      .then(res => {
        if (res) {
          if (res[0][1]) {
            store.dispatch(setId(res[0][1]));
            store.dispatch(setToken(res[1][1]));
            store.dispatch(setOrden(JSON.parse(res[2][1])));
            store.dispatch(setCorreo(res[3][1]));
            store.dispatch(setNombre(res[4][1]));
            store.dispatch(setTelefono(res[5][1]));
            store.dispatch(setImagen(res[6][1]));
            this.props.navigation.navigate('Inicio');
          } 
        }
      })
      .catch(error => console.log(error));
  }

  componentWillUnmount(){
    Linking.removeAllListeners('url',this.handelOpenUrl)
  }

  handelOpenUrl = event =>{
    this.navigate(event.url)
  }

  navigate = url =>{
    const route = url.replace(/.*?:\/\//g,'')
    const state = route.match(/\/([^\/]+)\/?$/)[1]
    const routeName = route.split('/')[0]
    if(routeName === 'login') this.props.navigation.navigate('Login',{state})
  }

  async hasLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso para usar GPS',
          message: 'Menu requiere que autorices el uso del GPS del dispositivo',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  getSetting(){
    fetch(`${api}/setting`,{
      method:'GET',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
    })
    .then(resp=>resp.json()
      .then(res=>{
        if(res.status){
          this.setState({
            loading:false,
            visible:true,
            mensaje:res.message,
          })
        }else{
          store.dispatch(setEnvio(res.cost_shipping))
          store.dispatch(setIva(res.iva))
          AsyncStorage.multiSet([
            ['iva',res.iva],['envio',res.cost_shipping]
          ])
          .then(()=>{})
          .catch(error=>console.log(error))
        }
      })
      .catch(error=>this.setState({loading:false},console.log(error)))
    )
    .catch(error=>this.setState({loading:false},console.log(error)))
  }

  render() {
    if (this.state.logeado === '') {
      return (
        <View style={{
          width: ancho,
          height: alto,
          justifyContent: 'center',
          alignContent: 'center'
        }}>
          <Spinner color={'black'}/>
        </View>
      );
    } else {
      return (
        <ScrollView contentContainerStyle={estilos.vista}>
          <View style={estilos.cuadro}>
            <TouchableHighlight
              style={[
                estilos.item,
                {
                  backgroundColor: 'blue',
                  borderColor: '#4a66a0',
                  borderRadius: 5,
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  name="logo-facebook"
                  style={{color: 'white', fontSize: 25}}
                />
                <Text style={{marginLeft: 10, color: 'white', fontSize: 20}}>
                  Ingresa con Facebook
                </Text>
              </View>
            </TouchableHighlight>
            <Text
              style={{marginVertical: 5, textAlign: 'center', fontSize: 20}}>
              - o -
            </Text>
            <TouchableHighlight
              style={[estilos.item, {borderRadius: 40, width: ancho * 0.7}]}
              onPress={() => this.props.navigation.navigate('Login')}>
              <Text
                onPress={() => this.props.navigation.navigate('Login')}
                style={{color: 'black', fontSize: 20}}>
                Ingresar
              </Text>
            </TouchableHighlight>
          </View>
          <Text style={{textAlign: 'center', fontSize: 20, marginTop: 5}}>
            ¿No tiene cuenta?
            <Text
              onPress={() => this.props.navigation.navigate('Registro')}
              style={{fontWeight: 'bold'}}>
              Regístrate
            </Text>
          </Text>
          <Text
            numberOfLines={2}
            style={{
              color: 'grey',
              textAlign: 'center',
              width: ancho * 0.7,
              position: 'absolute',
              bottom: 30,
            }}>
            Al aceptar, aceptas nuestros Términos y Condiciones y Políticas de
            Privacidad
          </Text>
        </ScrollView>
      );
    }
  }
}
const alto = Dimensions.get('window').height - 25;
const ancho = Dimensions.get('window').width;

const estilos = StyleSheet.create({
  vista: {
    height: alto,
    width: ancho,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cuadro: {
    width: ancho * 0.9,
    height: alto * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    borderColor: 'black',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    height: alto * 0.08,
    marginHorizontal: 5,
    flexDirection: 'row',
    width: ancho * 0.7,
  },
  icon: {
    marginLeft: 10,
    marginRight: 5,
    fontSize: 40,
    color: 'grey',
  },
  boton: {
    width: ancho,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    position: 'absolute',
    height: alto * 0.1,
    bottom: 0,
    alignItems: 'center',
  },
  franja: {
    width: '101%',
    height: alto * 0.1,
    top: -60,
    position: 'absolute',
    backgroundColor: 'black',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_close: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    position: 'absolute',
    top: 10,
    left: 10,
  },
});
