import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Image,
  Platform,
} from 'react-native';
import {Icon} from 'native-base';
import Menu from './components/Menu';
import {FlatList} from 'react-native-gesture-handler';
import Reordenar from './Modals/Reordenar';
import store from './redux/store';
import { api, url } from './components/Api';
import moment from 'moment';
import 'moment/locale/es'
import Cargando from './Modals/Cargando';
moment().locale('es')
export default class Favoritos extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      favoritos:[],
      disponibles:[],
      no_disponibles:[],
      dia : moment().format('dddd').toUpperCase(),
      loading:false
    };
    this.cerrarOrden = this.cerrarOrden.bind(this);
  }

  componentDidMount(){
    this.getRestaurantes()
  }

  cerrarOrden(data) {
    this.setState({visible: data});
  }

  getRestaurantes() {
    this.setState({loading: true});
    fetch(`${api}/client/${store.getState().id_user}`, {
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
              this.setState({favoritos: res.favoritos,loading:false});
              let disponibles = []
              let no_disponibles = []
              // console.log(res.favoritos[0].horario[0].day.toUpperCase())
              // console.log(moment().format('dddd').toUpperCase())
              // let uno = moment(moment().format('H:mm'),'H:mm')
              // let dos = moment(res.favoritos[0].horario[0].open,'H:mm')
              // let tres = moment(res.favoritos[0].horario[0].close,'H:mm')
              // console.log(moment(uno))
              // console.log(moment(uno).isBetween(dos,tres))
              // console.log(moment(res.favoritos[0].horario[0].open,'H:mm'))
              // console.log(moment(moment().format('H:mm'),'H:mm'))
              let fav = res.favoritos.filter(el=>el&&el.horario)
              fav.forEach(el => {
                let favo = el.horario.find(ele=>{
                  return ele.day&&ele.day.toUpperCase()===this.state.dia&&
                  moment(moment(moment().format('H:mm'),'H:mm'))
                  .isBetween(moment(ele.open,'H:mm'),moment(ele.close,'H:mm'))
                })
                if(favo) disponibles.push(el)
                else no_disponibles.push(el)
              });
              this.setState({disponibles,no_disponibles})
            }
          })
          .catch(error => this.setState({loading: false}, alert(error))),
      )
      .catch(error => this.setState({loading: false}, alert(error)));
  }

  render() {
    return (
      <View style={estilos.vista}>
        <Cargando visible={this.state.loading} />
        <Reordenar
          visible={this.state.visible}
          cerrarOrden={this.cerrarOrden}
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
            Mis Favoritos
          </Text>
          <Icon
            name="search"
            style={{fontSize: 35, fontWeight: 'bold', height: 40, width: 40}}
            onPress={() => this.props.navigation.navigate('Busqueda')}
          />
        </View>
        <View
          style={[
            estilos.content,
            {height: alto * 0.4, marginTop: Platform.select({ios:alto*0.11,android:alto*0.1})},
          ]}>
          <Text
            style={{
              color: 'black',
              fontSize: 15,
              marginVertical: 10,
              fontWeight: 'bold',
            }}>
            Disponibles
          </Text>
          <View
            style={{
              width: ancho * 0.9,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              height: alto * 0.3,
            }}>
            <Icon
              name="arrow-dropleft"
              style={{fontSize: 35, fontWeight: 'bold'}}
            />
            <FlatList
              style={{
                flex: 1,
                width: ancho * 0.8,
                paddingHorizontal: 8,
                height: alto * 0.3,
              }}
              horizontal={true}
              keyExtractor={(item,i)=>item._id}
              data={this.state.disponibles}
              renderItem={({item}) => (
                <TouchableHighlight
                  underlayColor={'transparent'}
                  onPress={() =>
                    this.props.navigation.navigate('Restaurant', {
                      profile: item,
                    })
                  }
                  style={{marginHorizontal: 5, height: alto * 0.3}}>
                  <View style={{height: '100%'}}>
                    <Image
                      source={{uri : url + item.img}}
                      style={{
                        borderWidth: 1,
                        borderColor: 'black',
                        width: ancho * 0.4,
                        height: alto * 0.2,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        color: 'black',
                        fontWeight: 'bold',
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'black',
                        fontWeight: 'bold',
                      }}>
                      {item.categories && item.categories.length>0 && item.categories.find((el,i)=>i===0).name}
                    </Text>
                    <Text
                      onPress={() => this.setState({visible: true})}
                      style={{
                        backgroundColor: 'black',
                        color: 'white',
                        fontSize: 10,
                        width: 80,
                      }}>
                      Mi ultima orden
                    </Text>
                  </View>
                </TouchableHighlight>
              )}
            />
            <Icon
              name="arrow-dropright"
              style={{fontSize: 35, fontWeight: 'bold'}}
            />
          </View>
          <Text
            style={{
              color: 'black',
              fontSize: 15,
              marginVertical: 10,
              fontWeight: 'bold',
            }}>
            No disponibles
          </Text>
          <View
            style={[
              estilos.content,
              {height: alto * 0.38, justifyContent: 'center'},
            ]}>
            <FlatList
              style={{flex: 1, width: ancho * 0.9, height: alto * 0.4}}
              data={this.state.no_disponibles}
              numColumns={2}
              keyExtractor={(item,i)=>item._id}
              renderItem={({item}) => (
                <TouchableHighlight
                  underlayColor={'transparent'}
                  onPress={() =>
                    this.props.navigation.navigate('Restaurant', {
                      profile: item,
                    })
                  }
                >
                  <View>
                    <Image
                      style={{
                        borderWidth: 1,
                        marginHorizontal: 3,
                        marginVertical: 3,
                        borderColor: 'black',
                        width: ancho * 0.43,
                        height: alto * 0.2,
                      }}
                    />
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 15,
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 12,
                      }}>
                      {item.categories && item.categories.length>0 && item.categories.find((el,i)=>i===0).name}
                    </Text>
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
    top: Platform.select({ios:20,android:0}),
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
