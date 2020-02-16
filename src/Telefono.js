import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableHighlight
} from 'react-native';
import {Icon, Input} from 'native-base';
import CountryPicker from 'react-native-country-picker-modal'
import { setTelefono } from './redux/actions';
import AsyncStorage from '@react-native-community/async-storage';
import Mensajes from './Modals/Mensaje';
import store from './redux/store';
import { api } from './components/Api';
import Cargando from './Modals/Cargando';
import firebase from 'react-native-firebase';
export default class Telefono extends React.Component {
  constructor() {
    super();
    let numero = store.getState().telefono
    numero.length > 0 ? numero = `(${numero.substring(0,3)}) ${numero.substring(3,6)}-${numero.substring(6,10)}` : numero = ''
    this.state = {
      cca2: 'DO',
      codigo: '+1',
      numero,
      visible: false,
      mensaje : '',
      loading: false,
      count : 30
    };
    this.cerrarInfo = this.cerrarInfo.bind(this)
  }

  cerrarInfo(data){
    this.setState({visible:data})
  }

  saveTelefono(){
    this.setState({loading:true})
    fetch(`${api}/client`,{
      method:'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.getState().token.toString(),
      },
      body:JSON.stringify({
        phone : this.state.numero.replace(/[^\d]/g,'')
      })
    })
    .then(resp=>resp.json()
      .then(res=>{
        if(res.status === 'denied' || res.error){
          this.setState({
            loading:false,
            visible:true,
            mensaje:res.error,
          })
        }else{
          store.dispatch(setTelefono(res.cliente.phone))
          AsyncStorage.setItem('telefono',res.cliente.phone)
          .then(()=>{
            this.setState({
              loading:false,
              mensaje: '¡Número telefónico guardado exitosamente!',
              visible: true
            })
          },
          error=>console.log(error))
          .catch(error=>this.setState({loading:false},alert(error)))
        }
      })
      .catch(error=>this.setState({loading:false},alert(error)))
    )
    .catch(error=>this.setState({loading:false},alert(error)))
  }

  validar(){
    this.setState({loading: true})
    firebase.auth().settings.appVerificationDisabledForTesting = true
    firebase.auth().verifyPhoneNumber(this.state.codigo+this.state.numero.replace(/[^\d]/g,''))
      .on('state_changed',
        phoneAuthSnapshot=>{
          switch(phoneAuthSnapshot.state){
            case firebase.auth.PhoneAuthState.CODE_SENT:
              this.setState({loading: false})
              this.contar()
              console.log(firebase.auth.PhoneAuthState.CODE_SENT)
              break
            case firebase.auth.PhoneAuthState.ERROR:
              this.setState({loading: false})
              console.log(firebase.auth.PhoneAuthState.ERROR)
              break
            case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT:
              this.setState({loading: false})
              this.validarManual()
              console.log(firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT)
              break
            case firebase.auth.PhoneAuthState.AUTO_VERIFIED:
              this.setState({loading: false})
              console.log(firebase.auth.PhoneAuthState.AUTO_VERIFIED)
              break
          }
        },
        error=>{
          console.log(error)
        },
        succes=>{
          console.log(succes)
        }
      )
  }

  validarManual(){
    firebase.auth().signInWithPhoneNumber(this.state.codigo+this.state.numero.replace(/[^\d]/g,''))
      .then(confirm=>{
        this.props.navigation.navigate(
          'Codigo',
          {
            confirm, 
            numero: this.state.codigo+this.state.numero.replace(/[^\d]/g,'')
          })
      })
      .catch(error=>console.log(error))
  }

  contar(){
    if(this.state.count > 0){
      let count = this.state.count
      count--
      this.setState({
        visible: true,
        count,
        mensaje: 'Espera mientras validamos tu número de teléfono.' 
        +`\n Tiempo restante para verificación manual ${count} segundos`
      })
      setTimeout(()=>this.contar(),1000)
    }else{
      this.setState({visible: false})
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
      <KeyboardAvoidingView
        style={estilos.vista}
        contentContainerStyle={estilos.vista}>
        <Mensajes
          visible = {this.state.visible}
          mensaje = {this.state.mensaje}
          cerrarInfo = {this.cerrarInfo}
        />
        <Cargando visible= {this.state.loading}/>
        <View style={estilos.barra}>
          <Icon
            name="ios-arrow-back"
            style={{
              fontSize: 35, 
              fontWeight: 'bold', 
              marginLeft: 10,
              width: 40, 
              height: 40
            }}
            onPress={() => this.props.navigation.goBack()}
          />
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 20,
              marginLeft: ancho / 4,
            }}>
            Teléfono
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'transparent',
            marginTop: alto * 0.1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={estilos.item}>
            <CountryPicker
              onChange={value=>this.setState({cca2:value.cca2, codigo:'+'+value.callingCode})}
              cca2={this.state.cca2}
              showCallingCode={true}
              translation='es'
            />
            <Text style={{marginLeft:8}}>{this.state.codigo}</Text>
            <Input 
              placeholder="(123) 456-7890" 
              keyboardType={'numeric'}
              onChangeText={text=>this.setState({numero:this.format(text)})}
              value={this.state.numero}
            />
          </View>
          <View
            style={{
              width: ancho,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'black',
                fontSize: 12,
                width: ancho * 0.7,
              }}>
              Te enviaremos un SMS para verificar tu número de teléfono. El
              operador móvil puede aplicar cargos
            </Text>
          </View>
        </View>
        <TouchableHighlight
          onPress={() => this.saveTelefono()}
          underlayColor={'transparent'}
          style={estilos.barra_back}>
          <Text style={{color: '#B4B5B4'}}>Guardar</Text>
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
    top: Platform.select({ios:10,android:0}),
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
    bottom: Platform.select({ios:-20,android:0}),
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
