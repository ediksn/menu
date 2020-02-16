import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Platform,
  Image
} from 'react-native';
import {Icon} from 'native-base';
import Menu from './components/Menu';
import store from './redux/store';
import Mensajes from './Modals/Mensaje';
import { withNavigationFocus } from 'react-navigation'
import AsyncStorage from '@react-native-community/async-storage';
import { setOrden,setCorreo,setId,setNombre,setToken } from './redux/actions';
import { url } from './components/Api';

class Perfil extends React.Component {
  constructor() {
    super();
    this.state = {
      correo: '',
      password: '',
      mensaje: '',
      visible: false,
    };
    this.cerrarInfo = this.cerrarInfo.bind(this)
    this.logout = this.logout.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.isFocused!==this.props.isFocused){
      return true
    }
    return true
  }

  cerrarInfo(data){
    this.setState({visible:data})
  }

  logout(){
    AsyncStorage.multiRemove([
      'id_user',
      'token',
      'correo',
      'nombre',
      'orden'
    ])
    .then(()=>{
      store.dispatch(setId(''));
      store.dispatch(setToken(''));
      store.dispatch(setCorreo(''));
      store.dispatch(setNombre(''));
      store.dispatch(setOrden(''));
      this.props.navigation.navigate('Index');
    })
    .catch(error=>console.log(error))
  }

  renderImage(){
    return(
      <Image
        style={estilos.img}
        source={{uri : url + store.getState().imagen}}
      />
    )
  } 

  render() {
    return (
      <View style={estilos.contenedor}>
        <Mensajes 
          visible={this.state.visible} 
          mensaje={this.state.mensaje} 
          cerrarInfo={this.cerrarInfo} 
          logout={this.logout}
        />
        {/* Header */}
        <View style={[estilos.header,{top:Platform.select({ios:10,android:0})}]}>
          {/* Izquierda Header */}
          <View>
            <Icon
              name="close-circle-outline"
              style={{fontSize:35, height:40 , width: 40}}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          {/* Centro Header */}
          <View style={{marginLeft: -20}} />

          {/* Derecha Header */}
          <View />
        </View>
        {/* Fin Header */}
        <View style={estilos.contPerfil}>
          {
            store.getState().imagen.length > 1 ? this.renderImage() :
            <View style={estilos.imgPerfil}>
              <Icon name="person" style={{color: '#fff', fontSize: 22}} />
            </View>
          }
          <Text style={{marginLeft: 20, fontSize: 18}}>Hola {store.getState().nombre}</Text>
        </View>

        <View style={estilos.contOpciones}>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => this.props.navigation.navigate('Cuenta')}>
            <View style={{position: 'relative'}}>
              <View
                style={{
                  height: 40,
                  borderColor: 'black',
                  borderBottomWidth: 2,
                  justifyContent: 'center',
                }}>
                <Text>Mi Cuenta</Text>
              </View>
              <Icon
                name="arrow-dropright"
                style={{position: 'absolute', right: 10, top: 10, fontSize: 20}}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => this.props.navigation.navigate('Pagos')}>
            <View style={{position: 'relative'}}>
              <View
                style={{
                  height: 40,
                  borderColor: 'black',
                  borderBottomWidth: 2,
                  justifyContent: 'center',
                }}>
                <Text>Pagos</Text>
              </View>
              <Icon
                name="arrow-dropright"
                style={{position: 'absolute', right: 10, top: 10, fontSize: 20}}
              />
            </View>
          </TouchableHighlight>
          <View style={{position: 'relative'}}>
            <View
              style={{
                height: 40,
                borderColor: 'black',
                borderBottomWidth: 2,
                justifyContent: 'center',
              }}>
              <Text>Códigos Promocionales</Text>
            </View>
            <Icon
              name="arrow-dropright"
              style={{position: 'absolute', right: 10, top: 10, fontSize: 20}}
            />
          </View>
          <View style={{position: 'relative'}}>
            <View
              style={{
                height: 40,
                borderColor: 'black',
                borderBottomWidth: 2,
                justifyContent: 'center',
              }}>
              <Text>Preguntas Frecuentes</Text>
            </View>
            <Icon
              name="arrow-dropright"
              style={{position: 'absolute', right: 10, top: 10, fontSize: 20}}
            />
          </View>
          <TouchableHighlight 
            underlayColor={'transparent'}
            style={{position: 'relative'}}
            onPress={()=>this.setState({visible:true,mensaje:'¿Seguro que desea cerrar su sesión?'})}
            // onPress={()=>this.props.navigation.navigate('Index')}
          >
            <View
              style={{
                height: 40,
                borderColor: 'black',
                borderBottomWidth: 2,
                justifyContent: 'center',
              }}>
              <Text>Cerrar Sesión</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View />
        <View />
        <View style={[estilos.barra_back,{bottom:Platform.select({ios:-20,android:0})}]}>
          <Menu navigation={this.props.navigation} />
        </View>
      </View>
    );
  }
}

export default withNavigationFocus(Perfil)

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
    zIndex: 2000,
    bottom: 0,
    position: 'absolute',
  },
  contOpciones: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  iconPerfil: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    backgroundColor: 'black',
    height: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
  },
  contPerfil: {
    width: ancho,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  imgPerfil: {
    width: 46,
    height: 46,
    backgroundColor: 'black',
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  contenedor: {
    flexDirection: 'column',
    position: 'relative',
    height: alto,
    padding: 0,
    margin: 0,
  },
  header: {
    height: 65,
    width: ancho,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  img:{
    width: 40, 
    height: 40, 
    resizeMode: 'contain',
    marginVertical:10,
    borderRadius:11
  }
});
