import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Platform,
} from 'react-native';
import {Icon} from 'native-base';
import Menu from './components/Menu';
import store from './redux/store';
import { api } from './components/Api';
import {withNavigationFocus} from 'react-navigation'
import Mensajes from './Modals/Mensaje';
import Cargando from './Modals/Cargando';
class Pagos extends React.Component {
  constructor() {
    super();
    this.state = {
      tarjetas:[],
      visible:false,
      mensaje:'',
      index:-1,
      loading:false
    };
    this.cerrarInfo=this.cerrarInfo.bind(this);
    this.eliminar=this.eliminar.bind(this)
  }

  componentDidMount(){
    this.getTarjetas()
  }

  componentDidUpdate(prevProps,prevState){
    if(prevProps.isFocused!==this.props.isFocused&&this.props.isFocused){
      this.getTarjetas()
    }
  }

  getTarjetas() {
    this.setState({loading: true});
    fetch(`${api}/client/${store.getState().id_user}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.getState().token.toString(),
      }
    })
      .then(resp =>
        resp
          .json()
          .then(res =>{
            if (res.message) {
              this.setState({
                loading: false,
                visible: true,
                mensaje: res.message,
              });
            } else {
              this.setState({
                tarjetas:res.tarjetas,
                loading: false
              });
            }
          })
          .catch(error => this.setState({loading: false},console.log(error))),
      )
      .catch(error => this.setState({loading: false},console.log(error)));
  }

  eliminar() {
    this.setState({loading: true});
    fetch(`${api}/client/`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.getState().token.toString(),
      },
      body:JSON.stringify({
        tarjetas:this.state.tarjetas.splice(
            this.state.tarjetas.length<2 ? 1 : this.state.index,
            1
          )
      })
    })
      .then(resp =>
        resp
          .json()
          .then(res =>{
            console.log(res)
            if (res.message) {
              this.setState({
                loading: false,
                visible: true,
                mensaje: res.message,
              });
            } else {
              this.setState({
                mensaje:'¡Tarjeta eliminada exitosamente!',
                visible:true,
                loading: false
              })
              this.getTarjetas()
            }
          })
          .catch(error => this.setState({loading: false},console.log(error))),
      )
      .catch(error => this.setState({loading: false},console.log(error)));
  }

  cerrarInfo(data){
    this.setState({visible:data})
  }

  render() {
    return (
      <View style={estilos.contenedor}>
        <Cargando visible={this.state.loading}/>
        <Mensajes 
          visible={this.state.visible} 
          mensaje={this.state.mensaje}
          cerrarInfo={this.cerrarInfo}
          eliminar={this.eliminar}
        />
        {/* Header */}
        <View style={estilos.header}>
          {/* Izquierda Header */}
          <View>
            <Icon
              name="ios-arrow-back"
              style={{fontSize:35, height:40 , width: 40}}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          {/* Centro Header */}
          <View style={{marginLeft: -20}}>
            <Text style={{fontSize: 18}}>Pagos</Text>
          </View>

          {/* Derecha Header */}
          <View />
        </View>
        {/* Fin Header */}
        <View style={estilos.contOpciones}>
          {this.state.tarjetas.map((el,i)=>{
            return (
              <View key={'p'+i} style={{position: 'relative'}}>
                <Icon
                  name="card"
                  style={{position: 'absolute', left: 0, top: 10, fontSize: 20}}
                />
                <View
                  style={{
                    height: 40,
                    borderColor: 'black',
                    borderBottomWidth: 2,
                    justifyContent: 'center',
                  }}>
                  <Text style={{marginLeft: 30}}>**** {el.numero.substring(12,16)}</Text>
                </View>
                <Icon
                  name="trash"
                  style={{position: 'absolute', right: 10, top: 10, fontSize: 20}}
                  onPress={()=>this.setState({
                    visible:true,
                    index:i,
                    mensaje:'¿Está seguro que desea eliminar esta tarjeta?'
                  })}
                />
              </View>
            )
          })}
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => this.props.navigation.navigate('NewPago')}>
            <View style={{position: 'relative'}}>
              <View
                style={{
                  height: 40,
                  borderColor: 'black',
                  borderBottomWidth: 2,
                  justifyContent: 'center',
                }}>
                <Text>Agregar pago</Text>
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

export default withNavigationFocus(Pagos)

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
    marginTop:Platform.select({ios:15,android:0})
  },
});
