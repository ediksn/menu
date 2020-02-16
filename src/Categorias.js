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
import {Icon, Input, Button, Picker} from 'native-base';
import Menu from './components/Menu';
import {FlatList} from 'react-native-gesture-handler';
import {api, url} from './components/Api';
import {thisExpression} from '@babel/types';
import store from './redux/store';
export default class Categorias extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurantes: [],
      aux: [],
      categoria:null,
    };
  }

  componentDidMount() {
    let categoria = this.props.navigation.getParam('categoria')
    this.getRestaurantes(categoria);
    this.setState({categoria})
  }

  // cerrarInfo(data){
  //     this.setState({visible:data})
  // }

  getRestaurantes(cat) {
    this.setState({loading: true});
    fetch(`${api}/restaurant/category/${cat._id}`, {
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
              this.setState({
                restaurantes: res, 
                aux: res,
              });
            }
          })
          .catch(error => this.setState({loading: false}, alert(error))),
      )
      .catch(error => this.setState({loading: false}, alert(error)));
  }

  buscarPorLetra(letra) {
    let arr = this.state.aux.filter(el => {
      return el.name.substring(0, 1) === letra;
    });
    this.setState({restaurantes: arr});
  }

  buscar(text) {
    if (text === '') {
      this.setState({restaurantes: this.state.aux});
    } else {
      let arr = this.state.aux.filter(el => {
        return el.name.toLowerCase().includes(text.toLowerCase());
      });
      this.setState({restaurantes: arr});
    }
  }

  letras() {
    let arr = [];
    for (let i = 65; i < 91; i++) {
      arr.push(
        <Text
          key={String.fromCharCode(i)}
          style={{textAlign: 'auto', marginHorizontal: Platform.select({ios:2,android:2})}}
          onPress={() => this.buscarPorLetra(String.fromCharCode(i))}>
          {String.fromCharCode(i)}
        </Text>,
      );
    }
    return arr;
  }

    render() {
        return (
        <View style={estilos.vista}>
            <View
                style={[
                    estilos.barra,
                    {justifyContent: 'space-between', paddingHorizontal: 12},
                ]}
            >
            <Icon
                name="close-circle-outline"
                style={{fontSize: 35, fontWeight: 'bold',width:40,height:40}}
                onPress={() => {
                    this.props.navigation.goBack();
                    this.setState({categorias: this.state.aux});
                }}
            />
            <Input
                onChangeText={text => this.buscar(text)}
                placeholder="Buscar restaurantes por tipo, comida..."
                textAlignVertical="center"
                placeholderTextColor="grey"
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    textAlign: 'center',
                    justifyContent: 'center',
                    width: ancho * 0.8,
                }}
            />
            <Icon name="search" style={{fontSize: 35, fontWeight: 'bold'}} />
            </View>
            <View
            style={[
                estilos.barra,
                {
                    backgroundColor: 'transparent',
                    marginTop: alto * 0.1,
                    justifyContent: 'center',
                    flexDirection: 'column',
                },
            ]}>
            <View
                style={[
                estilos.item,
                {
                    borderWidth: 0,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    width: ancho,
                },
                ]}
            >
                {this.letras()}
            </View>
            </View>
            <View
            style={[
                estilos.content,
                {height: alto * 0.4, marginTop: alto * 0.2},
            ]}>
                <Text
                    style={{
                        color: 'black',
                        fontSize: 15,
                        marginVertical: 10,
                        fontWeight: 'bold',
                    }}
                >
                    {this.state.categoria ?  'Restaurantes por categoria '+this.state.categoria.name : ''}
                </Text>
                <View
                    style={{
                        width: ancho * 0.95,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        height: alto * 0.6,
                    }}
                >
                    <FlatList
                    style={{flex: 1, width: ancho * 0.95, height: alto * 0.6}}
                    numColumns={2}
                    keyExtractor={(item, index) => item._id}
                    data={this.state.restaurantes}
                    renderItem={({item}) => (
                        <TouchableHighlight 
                            underlayColor={'transparent'}
                            onPress={() =>
                            this.props.navigation.navigate('Restaurant', {
                                profile: item,
                            })}
                            style={{marginHorizontal: 2, height: alto * 0.25}}>
                            <View style={{height: '100%'}}>
                                <Image
                                source={{uri: url + item.img}}
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'black',
                                    width: ancho * 0.45,
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
