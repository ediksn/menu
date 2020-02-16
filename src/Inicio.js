import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  Picker,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {Icon, Input, Button} from 'native-base';
import MapView from 'react-native-maps';
import {api} from './components/Api';
import {FlatList} from 'react-native-gesture-handler';
import store from './redux/store';
import Cargando from './Modals/Cargando';
export default class Inicio extends React.Component {
  constructor() {
    super();
    this.state = {
      direcciones: [],
      select: '',
      address:'Ubicacion actual',
      loading:false
    };
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          ubicacion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          },
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
      },
    );
  }

  componentDidMount() {
    this.getDirecciones();
    this.getFavoritos();
  }

  // cerrarInfo(data){
  //     this.setState({visible:data})
  // }

  getLocacion() {
    Geolocation.getCurrentPosition(
      position => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyCDYqH0BXCkPeaBkOID5T5qjTfv7o2rxUQ`)
        .then(res=>res.json()
          .then(resp=>{
            let address = resp
            address = address.results[0].formatted_address
            this.setState({address})
          })
          .catch(error=>console.log(error))
        )
        .catch(error=>console.log(error))
      },
      error => console.log(error),
      {enableHighAccuracy:true}
    );
  }

  getDirecciones() {
    this.setState({loading: true});
    fetch(`${api}/client/address`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.getState().token,
      },
    })
      .then(resp =>
        resp
          .json()
          .then(res => {
            if (res.status||res.message) {
              this.setState({
                loading: false,
                visible: true,
                mensaje: res.message,
              });
            } else {
              this.setState({direcciones: res,loading:false});
            }
          })
          .catch(error => this.setState({loading: false}, console.log(error))),
      )
      .catch(error => this.setState({loading: false}, console.log(error)));
  }

  getFavoritos() {
    fetch(`${api}/stats/favoritos?id=${store.getState().id_user}`, {
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
            if (res.status||res.message) {
              this.setState({
                loading: false,
                visible: true,
                mensaje: res.message,
              });
            } else {
              this.setState({loading: false})
            }
          })
          .catch(error => this.setState({loading: false}, console.log(error))),
      )
      .catch(error => this.setState({loading: false}, console.log(error)));
  }

  render() {
    return (
      <View style={estilos.vista}>
        <Cargando visible={this.state.loading}/>
        <MapView
          style={estilos.map}
          showsUserLocation={true}
          showsMyLocationButton={false}
          initialRegion={this.state.ubicacion}
        />
        <View style={[estilos.barra,{top:Platform.select({ios:20,android:0})}]}>
          <Icon
            name="menu"
            style={{fontSize: 35, fontWeight: 'bold', marginLeft: 10, height:40, width:40}}
            onPress={() => this.props.navigation.navigate('Perfil')}
          />
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 20,
              marginLeft: ancho / 4,
            }}>
            ¿Dónde enviar?
          </Text>
        </View>
        <View
          style={[
            estilos.barra,
            {
              backgroundColor: 'transparent',
              marginTop: Platform.select({ios:alto * 0.15,android:alto * 0.1}),
              justifyContent: 'center',
              flexDirection: 'column',
              height: 'auto',
            },
          ]}>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => this.props.navigation.navigate('NewDireccion')}>
            <View style={estilos.item}>
              <Icon
                name="add"
                style={{
                  marginHorizontal: 10,
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: 25,
                }}
              />
              <Text style={{textAlign: 'center', color: 'black', fontSize: 15}}>
                Nueva dirección
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => this.getLocacion()}>
            <View style={estilos.item}>
              <Icon
                name="ios-navigate"
                style={{
                  marginHorizontal: 10,
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: 25,
                }}
              />
              <Text style={{textAlign: 'center', color: 'black', fontSize: 15}}>
                {this.state.address}
              </Text>
            </View>
          </TouchableHighlight>
          <View style={estilos.item}>
            <Icon
              name="ios-pin"
              style={{
                marginHorizontal: 10,
                color: 'black',
                fontWeight: 'bold',
                fontSize: 25,
              }}
            />
            <Picker
              mode="dropdown"
              style={{width: ancho * 0.7, height: 30}}
              selectedValue={this.state.select}
              onValueChange={(item, value) => this.setState({select: item})}>
              <Picker.Item label="" value="" />
              {this.state.direcciones.map((el, i) => {
                return (
                  <Picker.Item
                    key={'op' + i}
                    label={el.nombre}
                    value={el}
                  />
                );
              })}
            </Picker>
            {this.state.select !== '' && (
              <Icon
                style={{color: 'black', fontWeight: 'bold', fontSize: 25}}
                name="checkmark"
              />
            )}
          </View>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => this.props.navigation.navigate('Busqueda')}>
            <View style={estilos.item}>
              <Icon
                name="search"
                style={{
                  marginHorizontal: 10,
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: 25,
                }}
              />
              <Text style={{textAlign: 'center', color: 'black', fontSize: 15}}>
                Buscar restaurante
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
          underlayColor={'transparent'}
          style={[estilos.barra_back,{marginBottom:Platform.select({ios:-20,android:0})}]}
          onPress={() => this.props.navigation.navigate('Home',{address:this.state.select})}>
          <Text
            style={{color: 'black', fontSize: 20}}
            onPress={() => this.props.navigation.navigate('Home',{address:this.state.select})}>
            Seleccionar
          </Text>
        </TouchableHighlight>
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
    justifyContent: 'center',
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
    bottom: 0,
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
    top: 10,
    left: 10,
  },
});
