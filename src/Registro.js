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
import {Icon, Input} from 'native-base';
import {api} from './components/Api';
import Mensajes from './Modals/Mensaje';
import CountryPicker from 'react-native-country-picker-modal'
import {setId, setToken, setCorreo, setNombre, setTelefono} from './redux/actions';
import store from './redux/store';
import AsyncStorage from '@react-native-community/async-storage';
import Cargando from './Modals/Cargando';
export default class Registro extends React.Component {
  constructor() {
    super();
    this.state = {
      correo: '',
      password: '',
      nombre: '',
      apellido: '',
      telefono: '',
      cca2: 'DO',
      codigo: '+1',
      ver: true,
      visible: false,
      loading:false
    };
    this.cerrarInfo = this.cerrarInfo.bind(this);
  }

  cerrarInfo(data) {
    this.setState({visible: data});
  }

  registro() {
    if(this.state.telefono.length<1 || this.state.nombre.length<1
      || this.state.correo.length<1 || this.state.password.length<1
      || this.state.apellido.length<1){
        this.setState({
          visible:true,
          mensaje:'Debe completar todos los campos'
        })
      }
    else{
      this.setState({loading: true})
      fetch(`${api}/client`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: this.state.nombre,
          lastname: this.state.apellido,
          email: this.state.correo.replace(/ /g,'').toLowerCase(),
          password: this.state.password,
          phone: this.state.telefono.replace(/[^\d]/g,''),
        }),
      })
        .then(resp =>
          resp
            .json()
            .then(res => {
              if (res.status === 'denied' || res.error) {
                this.setState({
                  visible: true,
                  mensaje: res.error,
                  loading:false
                });
              } else {
                this.setState({
                  visible: true,
                  mensaje: '¡Registo realizado exitosamente! Vaya a su bandeja de correo y verifique su emial a través del enlace enviado.',
                  nombre: '',
                  apellido: '',
                  telefono: '',
                  password: '',
                  correo: '',
                  loading:false
                });
                setTimeout(() => this.props.navigation.navigate('Login'), 2000);
                // store.dispatch(setId(res.id));
                // store.dispatch(setToken(res.token));
                // store.dispatch(setCorreo(res.user.email));
                // store.dispatch(setTelefono(res.user.phone));
                // store.dispatch(setNombre(res.user.firstname));
                // AsyncStorage.multiSet([
                //   ['id_user', res.id], 
                //   ['token', res.token],
                //   ['correo',res.user.email],
                //   ['nombre',res.user.firstname],
                //   ['telefono',res.user.phone]
                // ])
                //   .then(
                //     () => {
                //       this.setState({
                //         visible: true,
                //         mensaje: 'Registo realizado exitosamente',
                //         nombre: '',
                //         password: '',
                //         correo: '',
                //         loading:false
                //       });
                //       setTimeout(() => this.props.navigation.navigate('Login'), 2000);
                //     },
                //     error => this.setState({loading: false}, console.log(error)),
                //   )
                //   .catch(error => this.setState({loading: false}, console.log(error)));
              }
            })
            .catch(error => this.setState({loading: false}, console.log(error))),
        )
        .catch(error => this.setState({loading: false}, console.log(error)));
    }
  }

  format(text){
    text = text.replace(/[^\d]/g,'')
    if(text.length<1) return text
    else if(text.length<4) return `(${text.substring(0,3)}`
    else if(text.length<7) return `(${text.substring(0,3)}) ${text.substring(3,6)}`
    else return `(${text.substring(0,3)}) ${text.substring(3,6)}-${text.substring(6,10)}`
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
          onPress={() => this.props.navigation.goBack()}>
          <Icon
            name="ios-arrow-back"
            style={{
              fontSize: 35, 
              fontWeight: 'bold', 
              color: 'black',
              width: 40, 
              height: 40
            }}
            onPress={() => this.props.navigation.goBack()}
          />
        </TouchableHighlight>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            position:'absolute',
            top:90
          }}>
          Regístrate
        </Text>
        <View style={estilos.cuadro}>
          <View style={estilos.item}>
            <Input
              placeholder="Nombre"
              value={this.state.nombre}
              onChangeText={text => this.setState({nombre: text})}
            />
          </View>
          <View style={estilos.item}>
            <Input
              placeholder="Apellido"
              value={this.state.apellido}
              onChangeText={text => this.setState({apellido: text})}
            />
          </View>
          <View style={estilos.item}>
            <Input
              placeholder="Correo"
              value={this.state.correo}
              onChangeText={text => this.setState({correo: text})}
            />
          </View>
          <View style={estilos.item}>
            <CountryPicker
              onChange={value=>this.setState({cca2:value.cca2, codigo:'+'+value.callingCode})}
              cca2={this.state.cca2}
              showCallingCode={true}
              translation='es'
            />
            <Text style={{marginLeft:8}}>{this.state.codigo}</Text>
            <Input
              placeholder="Teléfono"
              value={this.state.telefono}
              keyboardType={'numeric'}
              onChangeText={text => this.setState({telefono: this.format(text)})}
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
        <TouchableHighlight
          style={estilos.boton}
          onPress={() => this.registro()}>
          <Text
            style={{color: 'black', fontSize: 20}}
            onPress={() => this.registro()}>
            Registrar
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
    height: alto * 0.07,
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
