import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  Platform,
} from 'react-native';
import {Icon, Input, Button} from 'native-base';
import {api} from './components/Api';
import Mensajes from './Modals/Mensaje';
import {setId, setToken, setCorreo, setNombre, setTelefono, setImagen} from './redux/actions';
import store from './redux/store';
import AsyncStorage from '@react-native-community/async-storage';
import Cargando from './Modals/Cargando';
export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      correo: '',
      password: '',
      visible: false,
      mensaje: '',
      ver: true,
      loading:false
    };
    this.cerrarInfo = this.cerrarInfo.bind(this);
  }

  componentDidMount(){
    if(this.props.navigation.getParam('state')){
      let state = this.props.navigation.getParam('state')
      if(state === 'validado'){
        this.setState({
          visible: true, 
          mensaje: '¡Verificación exitosa! Puede ingresar a su cuenta'
        })
      }
    }
  }

  cerrarInfo(data) {
    this.setState({visible: data});
  }

  login() {
    this.setState({loading: true});
    fetch(`${api}/client/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.correo.replace(/ /g,'').toLowerCase(),
        password: this.state.password,
      }),
    }).then(
      resp =>
        resp.json().then(res => {
          if (res.status === 'denied') {
            this.setState({visible: true, mensaje: res.message, loading:false});
          } else {
            store.dispatch(setId(res.id));
            store.dispatch(setToken(res.token));
            store.dispatch(setCorreo(res.user.email));
            store.dispatch(setTelefono(res.user.phone));
            store.dispatch(setNombre(res.user.firstname));
            store.dispatch(setImagen(res.user.image));
            AsyncStorage.multiSet([
              ['id_user', res.id], 
              ['token', res.token],
              ['correo',res.user.email],
              ['nombre',res.user.firstname],
              ['telefono',res.user.phone ? res.user.phone : ''],
              ['imagen',res.user.image ? res.user.image : ''],
            ])
              .then(
                () => {
                  this.setState({password: '', correo: '', loading:false});
                  this.props.navigation.navigate('Inicio');
                },
                error => this.setState({loading:false},console.log(error)),
              )
              .catch(error => this.setState({loading:false},console.log(error)));
          }
        })
        .catch(error=>this.setState({loading:false},console.log(error)))
    )
    .catch(error=>this.setState({loading:false},console.log(error)));
  }

  render() {
    return (
      <ScrollView contentContainerStyle={estilos.vista}>
        <Cargando visible={this.state.loading}/>
        <Mensajes
          visible={this.state.visible}
          mensaje={this.state.mensaje}
          cerrarInfo={this.cerrarInfo}
        />
        <TouchableHighlight
          style={estilos.btn_close}
          underlayColor={'transparent'}
          onPress={() => this.props.navigation.navigate('Index')}>
          <Icon
            name="ios-arrow-back"
            style={{fontSize: 35, fontWeight: 'bold', color: 'black'}}
            onPress={() => this.props.navigation.goBack()}
          />
        </TouchableHighlight>
        <View style={estilos.cuadro}>
          <View style={estilos.item}>
            <Input
              placeholder="Correo"
              value={this.state.correo}
              onChangeText={text => this.setState({correo: text})}
            />
          </View>
          <View style={estilos.item}>
            <Input
              secureTextEntry={this.state.ver}
              placeholder="Contraseña"
              value={this.state.password}
              onChangeText={text => this.setState({password: text})}
            />
            <Icon
              style={estilos.icon}
              name={this.state.ver ? 'eye' : 'eye-off'}
              onPress={() => this.setState({ver: !this.state.ver})}
            />
          </View>
        </View>
        <Text
          onPress={()=>this.props.navigation.navigate('Recuperar')}
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            marginTop: 5,
          }}>
          ¿Olvidó su contraseña?
        </Text>
        <TouchableHighlight style={estilos.boton} onPress={() => this.login()}>
          <Text
            style={{color: 'black', fontSize: 20}}
            onPress={() => this.login()}>
            Ingresar
          </Text>
        </TouchableHighlight>
      </ScrollView>
    );
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
    justifyContent: 'flex-start',
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
    borderWidth: 2,
    justifyContent: 'center',
    position: 'absolute',
    height: alto * 0.1,
    bottom: Platform.select({ios:-20,android:0}),
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
    top: Platform.select({ios:20,android:10}),
    left: 10,
  },
});
