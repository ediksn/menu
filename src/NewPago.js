import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  TouchableHighlight,
} from 'react-native';
import {Icon} from 'native-base';
import { api } from './components/Api';
import store from './redux/store';
import Mensajes from './Modals/Mensaje';
import Cargando from './Modals/Cargando';
export default class NewPago extends React.Component {
  constructor() {
    super();
    this.state = {
      numero:'',
      cvv:'',
      exp:'',
      visible:false,
      mensaje:'',
      loading:false
    };
    this.cerrarInfo=this.cerrarInfo.bind(this)
  }

  savePago() {
    this.setState({loading: true});
    fetch(`${api}/client/`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.getState().token.toString(),
      },
      body:JSON.stringify({
        tarjeta:{
          numero:this.state.numero.replace(/\D/g,''),
          cvv:this.state.cvv,
          exp:'20'+this.state.exp.replace(/\D/g,'').substring(2)+this.state.exp.replace(/\D/g,'').substring(0,2),
        }
      })
    })
      .then(resp =>
        resp
          .json()
          .then(res =>{
            console.log(res)
            if (res.status||res.message) {
              this.setState({
                loading: false,
                visible: true,
                mensaje: res.error,
              });
            } else {
              this.setState({
                numero: '',
                cvv: '',
                exp: '',
                visible: true,
                mensaje: '¡Tarjeta registrada exitosamente!',
                loading:false
              });
            }
          })
          .catch(error => this.setState({loading:false},console.log(error))),
      )
      .catch(error => this.setState({loading:false},console.log(error)));
  }

  cerrarInfo(data){
    this.setState({visible:data})
  }

  formatExp(text){
    text=text.replace(/\D/g,'')
    if(text.length<3) return `${text.substring(0,2)}`
    else return `${text.substring(0,2)}/${text.substring(2,4)}`
  }

  formatCard(text){
    text=text.replace(/\D/g,'')
    if(text.length<5) return `${text.substring(0,4)}`
    if(text.length<9) return `${text.substring(0,4)} ${text.substring(4,8)}`
    if(text.length<13) return `${text.substring(0,4)} ${text.substring(4,8)} ${text.substring(8,12)}`
    else return `${text.substring(0,4)} ${text.substring(4,8)} ${text.substring(8,12)} ${text.substring(12,16)}`
  }

  render() {
    return (
      <KeyboardAvoidingView style={estilos.contenedor}>
        {/* Header */}
        <Cargando visible={this.state.loading}/>
        <Mensajes
          visible={this.state.visible}
          mensaje={this.state.mensaje}
          cerrarInfo={this.cerrarInfo}
        />
        <View style={estilos.header}>
          {/* Izquierda Header */}
          <View>
            <Icon
              name="ios-arrow-back"
              style={{fontSize: 35, height: 40, width: 40}}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          {/* Centro Header */}
          <View style={{marginLeft: -20}}>
            <Text style={{fontSize: 18}}>Agregar pago</Text>
          </View>

          {/* Derecha Header */}
          <View />
        </View>
        {/* Fin Header */}

        <View style={estilos.contOpciones}>
          <View
            style={{
              position: 'relative',
              borderColor: 'black',
              borderWidth: 2,
              height: 40,
              flexDirection: 'row',
            }}>
            <TextInput 
              style={{height: 40, width:'100%'}} 
              placeholder={'Numero de Tarjeta'} 
              value={this.state.numero}
              keyboardType={'numeric'}
              onChangeText={text=>this.setState({numero:this.formatCard(text)})}
            />
            <Icon
              name="camera"
              style={{position: 'absolute', right: 10, top: 10, fontSize: 20}}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
            <View
              style={{
                position: 'relative',
                marginTop: 10,
                width: (ancho - 40) / 2,
              }}>
              <TextInput
                style={{height: 40, borderColor: 'black', borderWidth: 2, width:'100%'}}
                placeholder={'Expira MM/YY'}
                value={this.state.exp}
                keyboardType={'numeric'}
                onChangeText={text=>this.setState({exp:this.formatExp(text)})}
              />
            </View>
            <View
              style={{
                position: 'relative',
                marginTop: 10,
                width: (ancho - 40) / 2,
                marginLeft: -1,
              }}>
              <TextInput
                style={{height: 40, borderColor: 'black', borderWidth: 2, width:'100%'}}
                placeholder={'CVV'}
                value={this.state.cvv}
                maxLength={3}
                keyboardType={'numeric'}
                onChangeText={text=>this.setState({cvv:text})}
              />
            </View>
          </View>
        </View>
        <TouchableHighlight 
          style={estilos.barra_back}
          underlayColor={'transparent'}
          onPress={()=>this.savePago()}
        >
          <Text 
            style={{color: '#B4B5B4'}}
            onPress={()=>this.savePago()}
          >
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
  barra_back: {
    width: ancho,
    borderColor: 'black',
    borderTopWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 2000,
    bottom: 0,
    height: 50,
  },
  contOpciones: {
    padding: 20,
  },
  contenedor: {
    flexDirection: 'column',
    position: 'relative',
    height: alto,
    padding: 0,
    margin: 0,
    flex: 1,
  },
  header: {
    height: 65,
    width: ancho,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
