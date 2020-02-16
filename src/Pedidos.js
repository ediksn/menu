import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import {Icon} from 'native-base';
import Menu from './components/Menu';
import {FlatList} from 'react-native-gesture-handler';
import {api, url} from './components/Api';
import store from './redux/store';
import moment from 'moment';
import 'moment/locale/es';
import Reordenar from './Modals/Reordenar';
import Cargando from './Modals/Cargando';
export default class Pedidos extends React.Component {
  constructor() {
    super();
    this.state = {
      pedidos: [],
      visible: false,
      orden: null,
      loading: false
    };
    this.cerrarOrden = this.cerrarOrden.bind(this);
  }

  // cerrarInfo(data){
  //     this.setState({visible:data})
  // }

  componentDidMount() {
    this.getPedidos();
  }

  getPedidos() {
    this.setState({loading: true});
    fetch(`${api}/order`, {
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
              this.setState({pedidos: res,loading: false});
            }
          })
          .catch(error => this.setState({loading: false}, alert(error))),
      )
      .catch(error => this.setState({loading: false}, alert(error)));
  }

  cerrarOrden(data) {
    this.setState({visible: data});
  }

  color(estado){
    switch(estado){
      case 'pendiente': return '#ec4a47'
      case 'proceso': return '#fc960f'
      case 'listo': return '#50ab54'
      case 'entregado': return '#2096f3'
      case 'rechazado': return '#2096f3'
    }
  }

  render() {
    return (
      <View style={estilos.vista}>
        <Cargando visible={this.state.loading}/>
        <Reordenar
          visible={this.state.visible}
          cerrarOrden={this.cerrarOrden}
          orden={this.state.orden}
          navigation={this.props.navigation}
        />
        <View
          style={[
            estilos.barra,
            {justifyContent: 'space-between', paddingHorizontal: 12},
          ]}>
          <Icon
            name="menu"
            style={{fontSize: 35, fontWeight: 'bold', height:40, width: 40}}
            onPress={() => this.props.navigation.navigate('Perfil')}
          />
          <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              width: ancho * 0.7,
              textAlign: 'center',
              fontSize: 25,
            }}>
            Mis Pedidos
          </Text>
          <Icon
            name="search"
            style={{fontSize: 35, fontWeight: 'bold'}}
            onPress={() => this.props.navigation.navigate('Busqueda')}
          />
        </View>
        <View
          style={[
            estilos.content,
            {height: alto * 0.08, marginTop: alto * 0.1},
          ]}>
          <View
            style={[
              estilos.content,
              {height: alto * 0.8, justifyContent: 'center'},
            ]}>
            <FlatList
              style={{flex: 1, width: ancho * 0.9, height: alto * 0.8}}
              data={this.state.pedidos}
              keyExtractor={(item, index) => item._id}
              renderItem={({item}) => (
                <TouchableHighlight>
                  <View>
                    <Image
                      source={{uri: url + item.restaurant.img}}
                      style={{
                        borderWidth: 1,
                        marginHorizontal: 3,
                        marginVertical: 3,
                        width: ancho * 0.89,
                        height: alto * 0.2,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{flexDirection: 'row', alignItems:'flex-start'}}>
                        <View
                          style={{
                            backgroundColor: this.color(item.state),
                            borderRadius: 15,
                            height: 15,
                            width: 15,
                            marginTop:3
                          }}
                        />
                        <View style={{paddingLeft: 3}}>
                          <Text style={{color: 'black', fontSize: 15}}>
                            {item.restaurant.name} ({item.state})
                          </Text>
                          <Text style={{color: 'black', fontSize: 12}}>
                            {moment(item.order_time).format(
                              'DD MMMM, YYYY-HH:mm a',
                            )}
                          </Text>
                          <Text style={{color: 'black', fontSize: 12}}>
                            Orden #{item.order}
                          </Text>
                          <Text
                            style={{
                              color: 'black',
                              fontWeight: 'bold',
                              fontSize: 12,
                            }}>
                            RD${item.total}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Text
                          onPress={() =>
                            this.setState({visible: true, orden: item})
                          }
                          style={{
                            width: 80,
                            backgroundColor: 'black',
                            color: 'white',
                            textAlign: 'center',
                            marginBottom: 5,
                          }}>
                          Reordenar
                        </Text>
                        <Text
                          onPress={() =>
                            this.props.navigation.navigate('Orden',{orden:item})
                          }
                          style={{
                            width: 80,
                            backgroundColor: 'black',
                            color: 'white',
                            textAlign: 'center',
                          }}>
                          Ver factura
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
            />
          </View>
        </View>
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
  vista: {
    height: alto,
    width: ancho,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  content: {
    width: ancho,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    borderColor: 'black',
    borderWidth: 2,
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
