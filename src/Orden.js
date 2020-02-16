import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Icon} from 'native-base';
import io from 'socket.io-client'
import { url, api } from './components/Api';
import store from './redux/store';
import Cargando from './Modals/Cargando';
export default class Orden extends React.Component {
  constructor() {
    super();
    this.state = {
      orden: null,
      loading:false
    };
  }

  componentDidMount() {
    this.setState({orden: this.props.navigation.getParam('orden')});
    this.socket = io(url);
    this.socket.on('orden',data=>{
      console.log('socket recibido')
      if(data===this.state.orden.client || data===this.state.orden.client._id) this.getOrden()
    })
  }

  componentDidUpdate(prevProps,prevState){
    if(this.state.orden!==prevState.orden&&this.state.orden){
      this.socket = io(url)
      this.socket.emit('room',this.state.orden.client._id ? this.state.orden.client._id : this.state.orden.client) 
    }
  }

  getOrden() {
    this.setState({loading: true});
    fetch(`${api}/order/${this.state.orden._id}`, {
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
            if (res.message) {
              this.setState({
                loading: false,
                visible: true,
                mensaje: res.message,
              });
            } else {
              this.setState({orden:res,loading: false});
            }
          })
          .catch(error => this.setState({loading: false}, alert(error))),
      )
      .catch(error => this.setState({loading: false}, alert(error)));
  }

  cargando(){
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            borderWidth: 5,
            width: 5,
            height: 5,
            borderRadius: 2.5,
            borderColor: '#8A8B8A',
          }}
        />
        <View
          style={{
            width: 1.5,
            height: 8,
            borderWidth: 1.5,
            marginTop: 2.5,
            borderColor: '#8A8B8A',
          }}
        />
        <View
          style={{
            width: 1.5,
            height: 8,
            borderWidth: 1.5,
            marginTop: 5,
            marginBottom: 2.5,
            borderColor: '#8A8B8A',
          }}
        />
        <View
          style={{
            borderWidth: 5,
            width: 5,
            height: 5,
            borderRadius: 2.5,
            borderColor: '#8A8B8A',
          }}
        />
      </View>
    )
  }

  listo(){
    return(
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{borderWidth: 5, width: 5, height: 5, borderRadius: 2.5}}
        />
        <View
          style={{
            width: 1.5,
            height: 25,
            borderWidth: 1.5,
            marginTop: -2,
          }}
        />
        <View
          style={{
            borderWidth: 5,
            width: 5,
            height: 5,
            borderRadius: 2.5,
            marginTop: -2,
          }}
        />
      </View>
    )
  }

  render() {
    if (!this.state.orden) {
      return null;
    } else {
      return (
        <View style={estilos.contenedor}>
          <Cargando visible={this.state.loading}/>
          {/* Header */}
          <View style={estilos.header}>
            {/* Izquierda Header */}
            <View>
              <Icon
                name="close-circle-outline"
                style={{fontSize:35, height:40 , width: 40}}
                onPress={() => this.props.navigation.navigate('Pedidos')}
              />
            </View>
            {/* Centro Header */}
            <View style={{marginLeft: -20}}>
              <Text style={{fontSize: 18}}>
                Orden #{this.state.orden.id}
              </Text>
            </View>

            {/* Derecha Header */}
            <View />
          </View>
          {/* Fin Header */}

          <View
            style={{
              width: ancho - 40,
              borderBottomWidth: 2,
              paddingBottom: 5,
              margin: 20,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              {this.state.orden.address.nombre}
            </Text>
            <Text style={{fontSize: 12}}>
              {this.state.orden.address.calle +
                ', ' +
                this.state.orden.address.edificio +
                ', ' +
                this.state.orden.address.provincia}
            </Text>
          </View>
          <View
            style={{
              width: ancho - 40,
              borderBottomWidth: 2,
              paddingBottom: 5,
              margin: 20,
              height: 100,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />

          <View
            style={{
              width: ancho - 40,
              borderBottomWidth: 2,
              paddingBottom: 5,
              marginRight: 20,
              marginLeft: 20,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text 
              style={this.state.orden.state==='pendiente'? {} : estilos.letra}
            >
              Tu orden a sido confirmada
            </Text>
            {this.state.orden.state==='proceso' || 
            this.state.orden.state==='entregado' || 
            this.state.orden.state==='listo' ? this.listo() : this.cargando()}
            <Text 
              style={
                this.state.orden.state==='proceso' || 
                this.state.orden.state==='entregado' || 
                this.state.orden.state==='listo'? estilos.letra : {}
              }
            >
              Preparando orden
            </Text>
            {this.state.orden.state==='listo' || this.state.orden.state==='entregado' ? this.listo() : this.cargando()}
            <Text 
              style={this.state.orden.state==='entregado' ? estilos.letra : {}}
            >
              Orden en camino
            </Text>
            {this.state.orden.state==='entregado'?this.listo():this.cargando()}
            <Text
              style={this.state.orden.state==='entregado'?estilos.letra:{}}
            >
              Orden llegando
            </Text>
          </View>
          {/*<View
            style={{
              margin: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={estilos.contPerfil}>
              <View style={estilos.imgPerfil}>
                <Icon name="person" style={{color: '#fff'}} />
              </View>
              <View style={{marginLeft: 20}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                  Miguel | 4.87
                </Text>
                <Text>Hyundai sonata</Text>
                <Text>A0000000</Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: 'black',
                height: 20,
                borderRadius: 10,
                paddingRight: 2,
                paddingLeft: 2,
              }}>
              <Text style={{color: '#fff'}}>Contactar</Text>
            </View>
          </View>*/}
        </View>
      );
    }
  }
}
const alto = Dimensions.get('window').height - 25;
const ancho = Dimensions.get('window').width;

const estilos = StyleSheet.create({
  contPerfil: {
    flexDirection: 'row',
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
  letra:{
    fontSize: 18, 
    fontWeight: 'bold'
  }
});
