import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Image,
  Animated,
  FlatList,
  Platform
} from 'react-native';
import {Icon, Picker} from 'native-base';
import Menu from './components/Menu';
import {api, url} from './components/Api';
import store from './redux/store';
import {withNavigationFocus, ScrollView} from 'react-navigation'
import Cargando from './Modals/Cargando';
import Oferta from './Modals/Orferta';
import Acts from './Modals/Acts';
class Home extends React.Component {
  constructor() {
    const view = new Animated.ValueXY({x:0,y:0})
    super();
    this.state = {
      restaurantes: [],
      promociones: [],
      direcciones: [],
      actividades: [],
      addres: null,
      limit:10,
      offset: new Animated.Value(0),
      oferta: null,
      act: null,
      visible:false,
      show : false,
      view,
      loading:false
    };
    this.cerrarOfer = this.cerrarOfer.bind(this)
    this.cerrarAct = this.cerrarAct.bind(this)
  }

  componentDidMount() {
    this.getRestaurantes();
    this.getDirecciones()
    this.getOffers()
    this.getActsOffers()
  }

  componentDidUpdate(prevProps,prevState){
    if(this.state.direcciones!==prevState.direcciones){
      if(this.props.navigation.getParam('address')){ 
        let addres = this.props.navigation.getParam('address')
        this.setState({addres:this.state.direcciones.find(el=>el._id===addres._id)})
      } 
    }
    if(prevProps.isFocused!==this.props.isFocused&&this.props.isFocused){
      this.getDirecciones()
    }
  }

  getRestaurantes() {
    this.setState({loading: true});
    fetch(`${api}/restaurant?limit=${this.state.limit}`, {
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
              this.setState({restaurantes: res,loading:false});
            }
          })
          .catch(error => this.setState({loading: false}, console.log(error))),
      )
      .catch(error => this.setState({loading: false}, console.log(error)));
  }

  getOffers() {
    this.setState({loading: true});
    fetch(`${api}/restaurant/offers/hoy`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
              this.setState({promociones: res,loading:false});
            }
          })
          .catch(error => this.setState({loading: false}, console.log(error))),
      )
      .catch(error => this.setState({loading: false}, console.log(error)));
  }

  getActsOffers() {
    this.setState({loading: true});
    fetch(`${api}/restaurant/act`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
              this.setState({actividades: res,loading:false});
            }
          })
          .catch(error => this.setState({loading: false}, console.log(error))),
      )
      .catch(error => this.setState({loading: false}, console.log(error)));
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
            if (res.status || res.message) {
              this.setState({
                loading: false,
                visible: true,
                mensaje: res.message,
              });
            } else {
              this.setState({direcciones: res, loading:false});
            }
          })
          .catch(error => this.setState({loading: false}, console.log(error))),
      )
      .catch(error => this.setState({loading: false}, console.log(error)));
  }

  estrellas(number) {
    for (let i = 0; i < parseInt(number) + 1; i++) {
      return <Icon name="star" style={{fontSize: 12}} />;
    }
  }

  cerrarOfer(data){
    this.setState({visible: data})
  }

  cerrarAct(data){
    this.setState({show: data})
  }

  render() {
    const height = this.state.offset.interpolate({
      inputRange:[0,1000],
      outputRange:[alto*0.35, 0],
      extrapolate:'clamp'
    })
    const opacity = this.state.offset.interpolate({
      inputRange: [0, 1000],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    const translateY = this.state.offset.interpolate({
      inputRange: [0, 500,1000],
      outputRange: [0, -alto*0.17,-alto*0.35],
      extrapolate: 'clamp',
    });
    return (
      <View style={estilos.vista}>
        <Cargando visible = {this.state.loading}/>
        <Oferta 
          visible = {this.state.visible} 
          cerrarOfer = {this.cerrarOfer}
          oferta = {this.state.oferta}
          navigation = {this.props.navigation}
        />
        <Acts 
          visible = {this.state.show} 
          cerrarAct = {this.cerrarAct}
          act = {this.state.act}
          navigation = {this.props.navigation}
        />
        <View
          style={[
            estilos.barra,
            {
              justifyContent: 'space-between', 
              paddingHorizontal: 12,
              top:Platform.select({ios:20,android:0}),
            },
          ]}>
          <Icon
            name="menu"
            style={{fontSize: 35, fontWeight: 'bold', height: 40, width: 40}}
            onPress={() => this.props.navigation.navigate('Perfil')}
          />
          <Icon
            name="search"
            style={{fontSize: 35, fontWeight: 'bold', height: 40, width: 40}}
            onPress={() => this.props.navigation.navigate('Busqueda')}
          />
        </View>
        <View
          style={[
            estilos.barra,
            {
              backgroundColor: 'transparent',
              marginTop: alto * 0.08,
              justifyContent: 'center',
              flexDirection: 'column',
            },
          ]}>
          <View style={estilos.item}>
            <Picker
              selectedValue={this.state.addres}
              style={{width:ancho*0.7, height:20}}
              onValueChange={item=>{
                if(this.state.addres&&!item)this.setState({addres:this.state.addres})
                else this.setState({addres:item})
              }}
              itemStyle={{
                textAlign: 'center',
                height: alto * 0.09,
                color: 'black',
                fontSize: 15,
              }}>
                <Picker.Item label='' value={null} />
                {this.state.direcciones.map((el,i)=>{
                  return <Picker.Item key={'a'+i} label={el.nombre} value={el} />
                })}
            </Picker>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={[
            estilos.content,
            {height:alto*1.28,marginTop: alto * 0.16},
          ]}>
          <Animated.View style={[
            estilos.content,
            {
              opacity,
              height:'auto',
              transform:[{translateY}],
            }
          ]}>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                marginVertical: 10,
                fontWeight: 'bold',
              }}>
              Populares
            </Text>
            <View
              style={{
                width: ancho * 0.9,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                height: alto * 0.278,
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
                keyExtractor={(item, i) => item._id}
                data={this.state.restaurantes}
                renderItem={({item}) => (
                  <TouchableHighlight
                    underlayColor={'transparent'}
                    onPress={() =>
                      this.props.navigation.navigate('Restaurant', {
                        profile: item,
                      })
                    }
                    style={{marginHorizontal: 5, height: alto * 0.3}}>
                    <View style={{height: 'auto'}}>
                      <Image
                        source={{uri: url + item.img}}
                        style={{
                          borderWidth: 1,
                          borderColor: 'black',
                          width: ancho * 0.4,
                          height: alto * 0.2,
                        }}
                      />
                      <View
                        style={{
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexDirection: 'row',
                          marginTop: 5,
                        }}>
                        <Text
                          style={{
                            backgroundColor: 'black',
                            color: 'white',
                            fontSize: 10,
                          }}>
                          Recomendado
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {this.estrellas(item.stars)}
                        </View>
                      </View>
                      <Text
                        numberOfLines={3}
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                          width:ancho*0.4,
                        }}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableHighlight>
                )}
              />
              <Icon
                name="arrow-dropright"
                style={{fontSize: 35, fontWeight: 'bold'}}
                onPress={()=>this.setState({limit:this.state.limit+10},this.getRestaurantes())}
              />
            </View>
          </Animated.View>
          <Animated.View 
            style={[estilos.content,
              {backgroundColor:'white',transform:[{translateY}]}]}
          >
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                marginVertical: 10,
                fontWeight: 'bold',
              }}>
              Promociones
            </Text>
          </Animated.View>
          <View
            style={{
              width: ancho * 0.9,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              height: alto * 0.278,
            }}>
            <Icon
              name="arrow-dropleft"
              style={{fontSize: 35, fontWeight: 'bold'}}
            />
            <Animated.FlatList
              style={{flex: 1, width: ancho * 0.9, height:'auto', transform:[{translateY}]}}
              keyExtractor={(item, i) => item._id}
              horizontal = {true}
              data={this.state.promociones}
              renderItem={({item}) => (
                <TouchableHighlight 
                  underlayColor={'transparent'}
                  style={{
                    paddingHorizontal:3
                  }}
                  onPress={()=>this.setState({
                    visible: true,
                    oferta: item
                  })}
                >
                  <View>
                    <Image
                      source={{ uri : item.image[0] ? url + item.image[0].url : url}}
                      style={{
                        borderWidth: 1,
                        borderColor: 'black',
                        width: ancho * 0.41,
                        height: alto * 0.2,
                      }}
                    />
                    <View
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginTop: 1,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontWeight: 'bold',
                          fontSize: 12,
                        }}>
                        {item.name}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 10,
                      }}>
                      { item.profileId &&
                        item.profileId.categories && 
                        item.profileId.categories.length>0 && 
                        item.profileId.categories.find((el,i)=>i===0).name
                      }
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
          <Animated.View 
            style={[estilos.content,
              {backgroundColor:'white',transform:[{translateY}]}]}
          >
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                marginVertical: 10,
                fontWeight: 'bold',
              }}>
              Acividades
            </Text>
          </Animated.View>
          <View
            style={{
              width: ancho * 0.9,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              height: alto * 0.278,
            }}>
            <Icon
              name="arrow-dropleft"
              style={{fontSize: 35, fontWeight: 'bold'}}
            />
            <Animated.FlatList
              style={{flex: 1, width: ancho * 0.9, height:'auto', transform:[{translateY}]}}
              keyExtractor={(item, i) => item._id}
              horizontal = {true}
              data={this.state.actividades}
              renderItem={({item}) => (
                <TouchableHighlight 
                  underlayColor={'transparent'}
                  style={{
                    paddingHorizontal:3
                  }}
                  onPress={()=>this.setState({
                    show: true,
                    act: item
                  })}
                >
                  <View>
                    <Image
                      source={{ uri : item.image[0] ? url + item.image[0].url : url}}
                      style={{
                        borderWidth: 1,
                        borderColor: 'black',
                        width: ancho * 0.41,
                        height: alto * 0.2,
                      }}
                    />
                    <View
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginTop: 1,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontWeight: 'bold',
                          fontSize: 12,
                        }}>
                        {item.name}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 10,
                      }}>
                      { item.profileId &&
                        item.profileId.categories && 
                        item.profileId.categories.length>0 && 
                        item.profileId.categories.find((el,i)=>i===0).name
                      }
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
        </ScrollView>
        <View style={[estilos.barra_back,{bottom:Platform.select({ios:-23,android:0})}]}>
          <Menu navigation={this.props.navigation} />
        </View>
      </View>
    );
  }
}

export default withNavigationFocus(Home)

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
});
