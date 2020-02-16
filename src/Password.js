import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Icon, Input} from 'native-base';
import {api} from './components/Api';
import store from './redux/store';
import Mensajes from './Modals/Mensaje';
import Cargando from './Modals/Cargando';
export default class Password extends React.Component {
  constructor() {
    super();
    this.state = {
      ver_pass: true,
      ver_new_pass: true,
      password: '',
      new_pass: '',
      mensaja: '',
      visible: false,
      loading: false
    };
    this.cerrarInfo = this.cerrarInfo.bind(this);
  }

  cerrarInfo(data) {
    this.setState({visible: data});
  }

  savePass() {
    this.setState({loading: true});
    fetch(`${api}/client/password`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.getState().token.toString(),
      },
      body: JSON.stringify({
        password: this.state.new_pass,
      }),
    })
      .then(resp =>
        resp
          .json()
          .then(res => {
            if (res.status) {
              this.setState({
                loading: false,
                visible: true,
                mensaje: res.message,
              });
            } else {
              this.setState({
                password: '',
                new_pass: '',
                visible: true,
                mensaje: '¡Contraseña actualizada exitosamente!',
                loading: false
              });
            }
          })
          .catch(error => this.setState({loading: false}, alert(error))),
      )
      .catch(error => this.setState({loading: false}, alert(error)));
  }

  render() {
    return (
      <KeyboardAvoidingView style={estilos.vista}>
        <Cargando visible={this.state.loading}/>
        <Mensajes
          visible={this.state.visible}
          mensaje={this.state.mensaje}
          cerrarInfo={this.cerrarInfo}
        />
        <View style={estilos.barra}>
          <Icon
            name="ios-arrow-back"
            style={{
              fontSize: 35, 
              fontWeight: 'bold', 
              marginLeft: 10, 
              marginTop:Platform.select({ios:15,android:0}),
              height: 40, 
              width: 40
            }}
            onPress={() => {
              this.setState({
                ver_new_pass: false,
                ver_pass: false,
                password: '',
                new_pass: '',
              });
              this.props.navigation.goBack();
            }}
          />
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 20,
              marginLeft: ancho / 4,
            }}>
            Contraseña
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'transparent',
            marginTop: alto * 0.1,
            justifyContent: 'center',
          }}>
          <View style={estilos.item}>
            <Input
              placeholder="Contraseña Actual"
              value={this.state.password}
              secureTextEntry={this.state.ver_pass}
              onChangeText={text => this.setState({password: text})}
            />
            <Icon
              onPress={() => this.setState({ver_pass: !this.state.ver_pass})}
              name={this.state.ver_pass ? 'eye' : 'eye-off'}
              style={{
                marginHorizontal: 10,
                color: 'black',
                fontWeight: 'bold',
                fontSize: 25,
              }}
            />
          </View>
          <View style={estilos.item}>
            <Input
              placeholder="Contraseña Nueva"
              value={this.state.new_pass}
              secureTextEntry={this.state.ver_new_pass}
              onChangeText={text => this.setState({new_pass: text})}
            />
            <Icon
              onPress={() =>
                this.setState({ver_new_pass: !this.state.ver_new_pass})
              }
              name={this.state.ver_new_pass ? 'eye' : 'eye-off'}
              style={{
                marginHorizontal: 10,
                color: 'black',
                fontWeight: 'bold',
                fontSize: 25,
              }}
            />
          </View>
        </View>
        <TouchableHighlight
          underlayColor={'transparent'}
          style={estilos.barra_back}
          onPress={() => this.savePass()}>
          <Text
            style={{color: 'black', fontSize: 20}}
            onPress={() => this.savePass()}>
            Guardar
          </Text>
        </TouchableHighlight>
      </KeyboardAvoidingView>
    );
  }
}
const alto = Dimensions.get('window').height - 25;
const ancho = Dimensions.get('window').width;

const estilos = StyleSheet.create({
  vista: {
    height: alto,
    width: ancho,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    height: alto,
    width: ancho,
  },
  barra: {
    width: ancho,
    height: alto * 0.1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: 'white',
    top: 0,
    zIndex: 2000,
  },
  barra_back: {
    width: ancho,
    height: alto * 0.09,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    bottom: 0,
    zIndex: 2000,
  },
  item: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    marginVertical: 7,
    height: alto * 0.08,
    marginHorizontal: 5,
    flexDirection: 'row',
    width: ancho * 0.9,
  },
});
