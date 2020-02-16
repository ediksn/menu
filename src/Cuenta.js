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
import Imagen from './Modals/Imagen';
import Mensajes from './Modals/Mensaje';
import {url} from '../src/components/Api';
import Cargando from './Modals/Cargando';

export default class Cuenta extends React.Component {
  constructor() {
    super();
    this.state = {
      correo: '',
      password: '',
      mensaje: '',
      image:false,
      visible:false,
    };
    this.cerrarImg = this.cerrarImg.bind(this)
    this.cerrarInfo = this.cerrarInfo.bind(this)
  }

  componentDidMount(){
    console.log(store.getState().telefono)
  }

  renderImage(){
    return(
      <Image
        style={[estilos.imgPerfil,{backgroundColor:'transparent',height:180,width:180,borderRadius:90}]}
        source={{uri: this.replaceUri(store.getState().imagen)}}
      />
    )
  }   

  replaceUri(imagen){
    let img = imagen
    if(img){
      img=url+img
    }
    return img
  }

  format(texto){
    if(texto.length>1) return `(${texto.substring(0,3)}) ${texto.substring(3,6)}-${texto.substring(6,11)}`
    else return '(000) 000-0000'
  }

  cerrarImg(data){
    this.setState({image:data})
  }

  cerrarInfo(data, mensaje=this.state.mensaje){
    this.setState({visible:data,mensaje})
  }

  render() {
    return (
      <View style={estilos.contenedor}>
        <Imagen 
          visible={this.state.image} 
          cerrarImg={this.cerrarImg}
          cerrarInfo={this.cerrarInfo}
        />
        <Mensajes 
          visible={this.state.visible} 
          mensaje={this.state.mensaje}
          cerrarInfo={this.cerrarInfo}
         />
        {/* Header */}
        <View style={estilos.header}>
          {/* Izquierda Header */}
          <View>
            <Icon
              name="ios-arrow-back"
              style={{width:40,height:40}}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          {/* Centro Header */}
          <View style={{marginLeft: -20}}>
            <Text style={{fontSize: 18}}>Mi Cuenta</Text>
          </View>

          {/* Derecha Header */}
          <View />
        </View>
        {/* Fin Header */}
        <View style={estilos.contPerfil}>
          <TouchableHighlight 
            underlayColor={'transparent'}
            onPress={()=>this.setState({image:true})}
          >
            {
              store.getState().imagen.length>1 ? this.renderImage() :
              <View style={estilos.imgPerfil}>
                <Icon name="person" style={{color: '#fff'}} />
                <View style={estilos.iconPerfil}>
                  <Icon name="create" style={{color: '#fff', fontSize: 12}} />
                </View>
              </View>
            }
          </TouchableHighlight>
        </View>

        <View style={estilos.contOpciones}>
          <View style={{position: 'relative'}}>
            <Text
              style={{height: 40, borderColor: 'black', borderBottomWidth: 2}}
            >
              {store.getState().correo}
            </Text>
            <Icon
              name="close-circle-outline"
              style={{position: 'absolute', right: 10, top: 10, fontSize: 14}}
            />
          </View>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => this.props.navigation.navigate('Password')}>
            <View style={{position: 'relative'}}>
              <View
                style={{
                  height: 40,
                  borderColor: 'black',
                  borderBottomWidth: 2,
                  justifyContent: 'center',
                }}>
                <Text>Contraseña</Text>
              </View>
              <Icon
                name="arrow-dropright"
                style={{position: 'absolute', right: 10, top: 10, fontSize: 20}}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => this.props.navigation.navigate('Telefono')}>
            <View style={{position: 'relative'}}>
              <View
                style={{
                  height: 40,
                  borderColor: 'black',
                  borderBottomWidth: 2,
                  justifyContent: 'center',
                }}>
                <Text>{this.format(store.getState().telefono)}</Text>
              </View>
              <Icon
                name="arrow-dropright"
                style={{position: 'absolute', right: 10, top: 10, fontSize: 20}}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => this.props.navigation.navigate('Direcciones')}>
            <View style={{position: 'relative'}}>
              <View
                style={{
                  height: 40,
                  borderColor: 'black',
                  borderBottomWidth: 2,
                  justifyContent: 'center',
                }}>
                <Text>Mis Direcciones</Text>
              </View>
              <Icon
                name="arrow-dropright"
                style={{position: 'absolute', right: 10, top: 10, fontSize: 20}}
              />
            </View>
          </TouchableHighlight>
        </View>
        <View />
        <View />
        <View style={estilos.barra_back}>
          <Menu navigation={this.props.navigation} />
        </View>
      </View>
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
    zIndex: 2000,
    bottom: Platform.select({ios:-20,android:0}),
  },
  contOpciones: {
    padding: 20,
  },
  iconPerfil: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    backgroundColor: 'black',
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
  },
  contPerfil: {
    justifyContent: 'center',
    alignItems: 'center',
    width: ancho,
    marginTop: 50,
  },
  imgPerfil: {
    width: 60,
    height: 60,
    backgroundColor: 'black',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  contenedor: {
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    top:Platform.select({ios:10,android:0})
  },
});
