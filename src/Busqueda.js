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
  Keyboard
} from 'react-native';
import {Icon, Input, Spinner} from 'native-base';
import Menu from './components/Menu';
import {FlatList} from 'react-native-gesture-handler';
import {api, url} from './components/Api';
import store from './redux/store';
export default class Busqueda extends React.Component {
  constructor() {
    super();
    this.state = {
      categorias: [],
      aux: [],
      timeId:'',
      loading:false,
      restaurantes: [],
      letra:''
    };
  }

  componentDidMount() {
    this.getCategorias();
  }

  getRestaurantes(letra) {
    this.setState({loading:true})
    fetch(`${api}/restaurant/all/${letra}`, {
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
            if (res.error) {
              this.setState({
                loading: false,
                visible: true,
                mensaje: res.error,
              });
            } else {
              let arr = res.filter(el => {
                return el.name.substring(0, 1) === letra;
              });
              this.setState({categorias: arr, loading:false});
              Keyboard.dismiss()
            }
          })
          .catch(error => this.setState({loading: false}, alert(error))),
      )
      .catch(error => this.setState({loading: false}, alert(error)));
  }

  getCategorias() {
    this.setState({loading:true})
    fetch(`${api}/categories`, {
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
              res=res.filter(el=>el.popularity===true)
              this.setState({categorias: res, aux: res, loading:false});
              Keyboard.dismiss()
            }
          })
          .catch(error => this.setState({loading: false}, alert(error))),
      )
      .catch(error => this.setState({loading: false}, alert(error)));
  }

  buscar(text) {
    if(text===''){
      this.setState({categorias:this.state.aux,loading:false})
    }else{
      this.setState({loading: true});
      fetch(`${api}/search/${text}/Todas%20las%20Provincias/Todos%20los%20Sectores`, {
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
              let arr = res.categories.concat(res.profiles)
              this.setState({categorias:arr, loading:false})
              Keyboard.dismiss()
            })
            .catch(error => this.setState({loading: false}, console.log(error))),
        )
        .catch(error => this.setState({loading: false}, console.log(error)));
    }
  }

  buscarPorLetra(letra) {
    let arr = this.state.restaurantes.filter(el => {
      return el.name.substring(0, 1) === letra;
    });
    this.setState({categorias: arr, letra});
  }

  letras() {
    let arr = [];
    for (let i = 65; i < 91; i++) {
      arr.push(
        <Text
          key={String.fromCharCode(i)}
          style={{
            textAlign: 'center', 
            marginHorizontal: 2, 
            fontWeight: this.state.letra === String.fromCharCode(i) ? 'bold' : 'normal',
            fontSize: this.state.letra === String.fromCharCode(i) ? alto*0.035 : alto*0.023,
          }}
          onPress={() => this.setState(
            {letra:String.fromCharCode(i)},
            this.getRestaurantes(String.fromCharCode(i))
          )}>
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
          ]}>
          <Icon
            name="close-circle-outline"
            style={{fontSize: 35, fontWeight: 'bold',height:40,width:40}}
            onPress={() => {
              this.props.navigation.goBack();
              this.setState({categorias: this.state.aux});
            }}
          />
          <Input
            onChangeText={text => {
              clearTimeout(this.state.timeId)
              this.setState({
                loading:text.length>0 ? true : false,
                timeId:setTimeout(()=>this.buscar(text),600)
              })
            }}
            placeholder="Buscar categorias, restaurantes, prod..."
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
            ]}>
            {this.letras()}
          </View>
        </View>
        <View
          style={[
            estilos.content,
            {height: 'auto', marginTop: alto * 0.18, },
          ]}>
          {
            this.state.letra.length<1 && this.state.timeId.length<1 &&
              <Text
                style={{
                  color: 'black',
                  fontSize: 15,
                  marginVertical: 10,
                  fontWeight: 'bold',
                }}>
                Categorias populares
              </Text>
          }
          <View
            style={{
              width: ancho * 0.95,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              height: alto * 0.65,
            }}>
            {this.state.loading ?
              <View style={{width:ancho,height:alto*0.66}}>
                <Spinner color={'gery'}/>
              </View> :
              <FlatList
                style={{flex: 1, width: ancho * 0.95, height: alto * 0.65}}
                numColumns={2}
                keyExtractor={(item, index) => item._id}
                data={this.state.categorias}
                renderItem={({item}) => (
                  <TouchableHighlight
                    underlayColor={'transparent'}
                    onPress={() =>{
                      if(item.idBranch ) {
                        this.props.navigation.navigate('Restaurant', {
                          profile: item,
                        })
                      }else{
                        this.props.navigation.navigate('Categorias', {
                          categoria: item,
                        })
                      }
                    }}
                    style={{marginHorizontal: 2, height: 'auto',paddingHorizontal:2}}>
                    <View style={{height: 'auto'}}>
                      <Image
                        source={
                          item.idBranch? {uri: url + item.img} : {uri: url + item.image}
                        }
                        style={{
                          borderWidth: 1,
                          borderColor: 'black',
                          width: ancho * 0.45,
                          height: alto * 0.2,
                        }}
                      />
                      <Text
                        numberOfLines={4}
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                          width:ancho*0.3
                        }}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableHighlight>
                )}
              />
            }
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
