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
import {api} from './components/Api';
import store from './redux/store';
import {withNavigationFocus} from 'react-navigation';
import Cargando from './Modals/Cargando';
import Mensajes from './Modals/Mensaje';
class Direcciones extends React.Component {
  constructor() {
    super();
    this.state = {
      direcciones: [],
      loading: false,
      visible: false,
      mensaje: '',
      dir: ''
    };
    this.eliminar = this.eliminar.bind(this)
    this.cerrarInfo = this.cerrarInfo.bind(this)
  }

  componentDidMount() {
    this.getDirecciones();
  }

  componentDidUpdate(prevProps,prevState){
    if(this.props.isFocused!==prevProps.isFocused && this.props.isFocused) this.getDirecciones()
  }

  getDirecciones() {
    this.setState({loading: true});
    fetch(`${api}/client/address`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.getState().token.toString(),
      },
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
              this.setState({direcciones: res,loading:false});
            }
          })
          .catch(error => this.setState({loading: false}, alert(error))),
      )
      .catch(error => this.setState({loading: false}, alert(error)));
  }

  eliminar() {
    this.setState({loading: true});
    fetch(`${api}/client/address/${this.state.dir}`, {
      method: 'DELETE',
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
            console.log(res)
            if (res.error) {
              this.setState({
                loading: false,
                visible: true,
                mensaje: res.error,
              });
            } else {
              this.setState({
                mensaje:'¡Direccion eliminada exitosamente!',
                visible:true,
                loading: false
              })
              this.getDirecciones()
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
              style={{width: 40, height: 40}}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
          {/* Centro Header */}
          <View style={{marginLeft: -20}}>
            <Text style={{fontSize: 18}}>Mis Direcciones</Text>
          </View>

          {/* Derecha Header */}
          <View />
        </View>
        {/* Fin Header */}

        <View style={estilos.contOpciones}>
          {this.state.direcciones.map((el, i) => {
            return (
              <View 
                key={'ad' + i} 
                style={{
                  justifyContent:'space-between', 
                  flexDirection: 'row',
                  borderColor: 'black',
                  borderBottomWidth: 2,
                  alignItems:'center'
                }}
              >
                <View
                  style={{
                    height: 40,
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: 'black', textAlign: 'left'}}>
                    {el.nombre}
                  </Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Icon
                    onPress={()=>this.props.navigation.navigate('NewDireccion',{direccion:el})}
                    name="arrow-dropright"
                    style={{
                      fontSize: 20,
                      width: 25,
                      height: 25,
                      marginRight: 10
                    }}
                  />
                  <Icon
                    onPress={()=>this.setState({
                      visible: true,
                      mensaje: '¿Seguro que desea eliminar esta dirección?',
                      dir : el._id
                    })}
                    name="trash"
                    style={{
                      fontSize: 20,
                      width: 25,
                      height: 25
                    }}
                  />
                </View>
              </View>
            );
          })}
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => this.props.navigation.navigate('NewDireccion')}>
            <View style={{position: 'relative'}}>
              <View
                style={{
                  height: 40,
                  borderColor: 'black',
                  borderBottomWidth: 2,
                  justifyContent: 'center',
                }}>
                <Text>Agregar nueva direccion</Text>
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

export default withNavigationFocus(Direcciones)

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
    bottom: Platform.select({ios:-20,android:0}),
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
