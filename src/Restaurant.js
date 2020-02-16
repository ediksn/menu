import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  Image,
  Animated,
  SectionList,
  PanResponder,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Icon } from 'native-base';
import {api, url} from './components/Api';
import store from './redux/store';
import { Input } from 'react-native-elements';
import Cargando from './Modals/Cargando';
import moment from 'moment';
import Mensajes from './Modals/Mensaje';
import Horarios from './Modals/Horarios';
import Sedes from './Modals/Sedes';
moment().locale('es')
export default class Restaurant extends React.Component {
  constructor() {
    super();
    this.state = {
      profile: null,
      grupos: [],
      products: [],
      aux: [],
      selected: '',
      offset: new Animated.Value(0),
      position: new Animated.ValueXY({x:0,y:0}),
      scroll: false,
      texto: '',
      buscar: false,
      loading: false,
      disponible: true,
      dia : moment().format('dddd').toUpperCase(),
      visible: false,
      mensaje: '',
      horario: null,
      locacion : null,
      show: false,
      map : false,
    };
    this.cerrarInfo = this.cerrarInfo.bind(this);
    this.cerrarHora = this.cerrarHora.bind(this);
    this.cerrarMapa = this.cerrarMapa.bind(this);
  }

  componentDidMount() {
    let profile = this.props.navigation.getParam('profile')
    this.setState({profile});
    if(profile.horario) {
      this.setState({horario: profile.horario})
      if(profile.horario.find(ele=>{
        let hora = moment().format('dddd HH:mm')
        let open = moment(`${ele.day} ${ele.open}`,'dddd HH:mm').format('dddd HH:mm')
        let close = moment(`${ele.day} ${ele.close}`,'dddd HH:mm').format('dddd HH:mm')
        if(moment(ele.close, 'HH:mm').isSame(moment('00:00','HH:mm'))){
          close = moment(close,'dddd HH:mm').add(1439,'minutes').format('dddd HH:mm')
        }
        if(moment(ele.close, 'HH:mm').isBetween(moment('00:00','HH:mm'),moment('06:00','HH:mm'))){
          close = moment(close,'dddd HH:mm').add(1,'day').format('dddd HH:mm')
        }
        return ele.day && 
          ele.day.toUpperCase() === this.state.dia 
            && moment(hora,'dddd HH:mm').isBetween(moment(open,'dddd HH:mm'),moment(close,'dddd HH:mm'))
      })){
        this.setState({disponible: true})
      }else this.setState({disponible: false})
    }

    if(profile.address.length > 0){
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${profile.address.replace(/ /g,'+').replace('#','nro').replace('.','')}&key=AIzaSyCDYqH0BXCkPeaBkOID5T5qjTfv7o2rxUQ`)
        .then(res=>res.json()
          .then(resp=>{
            this.setState({ 
              locacion: {
                latitude: resp.results[0].geometry.location.lat,
                longitude: resp.results[0].geometry.location.lng,
              }
            })
          })
          .catch(error=>console.log(error))
        )
        .catch(error=>console.log(error))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.profile !== prevState.profile && this.state.profile) {
      this.getGroups();
      this.getProducts();
      this.visitar()
    }
  }

  visitar() {
    fetch(`${api}/contador/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.getState().token.toString(),
      },
      body:JSON.stringify({
        path:'/'+this.state.profile.url
      })
    })
      .then(resp =>
        resp
          .json()
          .then(res => console.log(res))
          .catch(error => console.log(error)),
      )
      .catch(error => console.log(error));
  }

  getGroups() {
    this.setState({loading: true});
    fetch(`${api}/restaurant/${this.state.profile._id}`, {
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
            if (res.status || res.error) {
              this.setState({
                loading: false,
                visible: true,
                mensaje: res.message,
                loading:false
              });
            } else {
              this.setState({grupos: res.groups,loading:false});
            }
          })
          .catch(error => this.setState({loading: false}, console.log(error))),
      )
      .catch(error => this.setState({loading: false}, console.log(error)));
  }

  getProducts() {
    this.setState({loading: true});
    fetch(`${api}/restaurant/productsbyprofile/${this.state.profile._id}`, {
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
              this.setState({products: res, aux: res, loading:false});
            }
          })
          .catch(error => this.setState({loading: false}, console.log(error))),
      )
      .catch(error => this.setState({loading: false}, console.log(error)));
  }

  estrellas(number) {
    for (let i = 0; i < parseInt(number) + 1; i++) {
      return <Icon style={{fontSize: 20}} name="star" />;
    }
  }

  buscar(texto){
    if(texto.length<1){
      this.setState({products:this.state.aux, texto})
    }else{
      let products = this.state.products
      this.setState({texto, products:products.filter(el=>el.name.toUpperCase().includes(texto.toUpperCase()))})
    }
  }

  cerrarInfo(data){
    this.setState({visible:data})
  }

  cerrarHora(data){
    this.setState({show: data})
  }

  cerrarMapa(data){
    this.setState({map: data})
  }

  render() {
    const translateY = this.state.offset.interpolate({
      inputRange:[0,this.state.products.length>4 ? 1000 : 1000],
      outputRange:[0,this.state.products.length>4 ? -alto*0.45 : -alto*0.45 ],
      extrapolate:'clamp'
    })
    const translate = this.state.offset.interpolate({
      inputRange:[0,this.state.products.length>4 ? 1000 : 1000],
      outputRange:[0,this.state.products.length>4 ? -alto*0.35 : -alto*0.7],
      extrapolate:'clamp'
    })
    const height = this.state.offset.interpolate({
      inputRange:[0,1000],
      outputRange:[alto*0.45,0],
      extrapolate:'clamp'
    })
    const opacity = this.state.offset.interpolate({
      inputRange:[0,alto*0.4],
      outputRange:[1,0],
      extrapolate:'clamp'
    })
    if (!this.state.profile) {
      return null;
    } else {
      return (
        <KeyboardAvoidingView 
          style = {estilos.contenedor}
          behavior = 'position'
        >
          {/* Header */}
          <Cargando visible={this.state.loading}/>
          <Horarios
            visible = {this.state.show}
            horario = {this.state.horario}
            cerrarHora = {this.cerrarHora}
          />
          <Sedes
            visible ={this.state.map}
            cerrarMapa = {this.cerrarMapa}
            locacion = {this.state.locacion}
          />
          <Mensajes
            visible = {this.state.visible}
            mensaje = {this.state.mensaje}
            cerrarInfo = {this.cerrarInfo}
          />
          <View>
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
              <View style={{marginLeft: -20}} />

              {/* Derecha Header */}
              <View />
            </View>
            {/* Fin Header */}
            <Animated.View
              onLayout={event=>{
                this.namHeight = event.nativeEvent.layout.height
              }}
              style={{
                position:'absolute',
                width:ancho, 
                top:alto*0.39, 
                zIndex:20,
                transform:[{translateY:translate}],
                height:'auto'
              }}>
              <Text style={{fontSize: 27, textAlign:'center'}}>{this.state.profile.name}</Text>
            </Animated.View>
            <Animated.View
              onLayout={event=>{
                let margin = this.state.namHeight > 40 ? 80 : 40
                this.restView = event.nativeEvent.layout.height+margin
              }}
              style={{
                width: ancho, 
                opacity, 
                position:'absolute', 
                marginTop:65, 
                transform:[{translateY}],
                height:'auto'
              }}
            >
              <Image
                resizeMode={'cover'}
                style={{width: ancho, height: alto / 4}}
                source={{ uri: url + this.state.profile.img}}
              />
              <View
                style={{
                  height:'auto',
                  flexDirection: 'row',
                  width: ancho,
                  paddingTop: 10,
                  paddingRight: 25,
                  paddingLeft: 25,
                  justifyContent: 'space-between',
                }}>
                <Text>20-40 min</Text> 
                <View style={{flexDirection: 'row'}}>
                    {this.estrellas(this.state.profile.star)}
                </View>
              </View>
              <View style={{
                height: 'auto',
                alignItems: 'center', 
                justifyContent: 'center', 
                marginTop: this.namHeight ? this.namHeight : 36
              }}> 
                <View style={{flexDirection:'row'}}>
                  {
                    this.state.profile.categories && 
                      this.state.profile.categories.map((el,i)=>{
                        return (
                          <Text key={'c'+i}>{el.name} {i===this.state.profile.categories.length-1 ? '' :', '}</Text>
                        )
                      })
                  }
                </View>
                <View style={{
                  flexDirection: 'row', 
                  marginTop: 5, 
                  height:'auto', 
                  width: 150, 
                  justifyContent:'space-around'
                }}>
                  <Text onPress = {()=>this.setState({map: true})}>
                    Locación
                  </Text>
                  <Text onPress = {()=>this.setState({show: true})}>
                    Horarios
                  </Text>
                </View>
              </View>
            </Animated.View>
            <Animated.View
              style={{
                width: ancho - 40,
                borderBottomWidth: 2,
                borderTopWidth: 2,
                height: 40,
                margin: 20,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop:this.restView ? this.restView : 305,
                transform:[{translateY}]
              }}>
              {
                this.state.buscar && 
                  <View style={{width:ancho*0.7, height:25, justifyContent:'center',alignItems:'center'}}>
                    <Icon
                      name="close"
                      style={{position: 'absolute', top: -2, left: 0}}
                      onPress={()=>this.setState({texto:'',products:this.state.aux})}
                    />
                    <View style={{ marginLeft:8, width:ancho*0.7}}>
                      <Input
                        value={this.state.texto}
                        onChangeText={text=>this.buscar(text)}
                        placeholder={'Buscar producto'}
                        onBlur={()=>this.setState({buscar:false})}
                      />
                    </View>
                  </View>
              }
              {
                !this.state.buscar &&
                  <View style={{width:ancho-50, height:40, justifyContent:'center', alignItems:'center',}}>
                    <ScrollView
                      horizontal={true} >
                      <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}>
                        <Text
                          style={
                            this.state.selected === ''
                              ? estilos.selec
                              : estilos.no_selec
                          }
                          onPress={() =>
                            this.setState({products: this.state.aux, selected: ''})
                          }>
                          Todo
                        </Text>
                      </View>
                      {this.state.grupos.map((el, i) => {
                        return (
                          <View key={'g' + i} style={{height: 40, alignItems: 'center', justifyContent: 'center'}}>
                            <Text
                              style={
                                this.state.selected === i
                                  ? estilos.selec
                                  : estilos.no_selec
                              }
                              onPress={() =>
                                this.setState({products: el.products, selected: i})
                              }>
                              {el.name}
                            </Text>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
              }
              {
                !this.state.buscar &&
                  <Icon
                    name="search"
                    style={{position: 'absolute', top: 5, right: 0, width: 30, backgroundColor: 'white'}}
                    onPress={()=>this.setState({buscar:true})}
                  />
              }
              {
                this.state.buscar && 
                  <Icon
                    name="undo"
                    style={{position: 'absolute', top: 5, right: 0}}
                    onPress={()=>this.setState({buscar:false, products:this.state.aux})}
                  />
              }
            </Animated.View>
            <Animated.SectionList
              style={[{height: this.state.products.length>4 ? alto * 0.7 : alto*0.3 , marginBottom:40, transform:[{translateY}]}]}
              keyExtractor={(item,i)=>item._id}
              data={this.state.products}
              sections={[{title:'',data:this.state.products}]}
              scrollEventThrottle={16}
              onScroll={
                !this.state.buscar ? 
                  Animated.event(
                    [{nativeEvent:{contentOffset:{y:this.state.offset}}}],
                    {useNativeDriver:true}
                  ) 
                : null
              }
              renderItem={({item})=>(
                <TouchableHighlight
                  underlayColor={'transparent'}
                  onPress={() =>{
                    if(this.state.disponible){
                      this.props.navigation.navigate('Producto', {
                        producto: item,
                        profile: this.state.profile,
                      })
                    }else this.setState({
                      visible: true,
                      mensaje: this.state.profile.name+' no se encuentra disponible en este momento'
                    })
                  }}
                >
                  <View
                    style={estilos.item}>
                    <View style={{width: ancho / 3 - 20, height: 100}}>
                      {/* <Image
                        resizeMode={'cover'}
                        style={{width: ancho / 4.5, height: ancho / 4.5}}
                        source={{ uri: item.cover? url + item.cover : ''}}
                      /> */}
                    </View>
                    <View style={{width: ancho / 2.5}}>
                      <Text style={{fontSize: 14, fontWeight:'100'}}>{item.name}</Text>
                      <Text style={{color: '#999A99', fontSize: 10}}>
                        {item.description}
                      </Text>
                    </View>
                    <View>
                      <Text style={{fontSize: 12}}>RD${item.price}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
            />
          </View>
          <View style={[estilos.barra, {flexDirection: 'row',top:alto*0.92}]}>
            <Text style={{color: '#fff'}}>Carrito - </Text>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>RD${store.getState().orden ? store.getState().orden.total : 0.00}</Text>
          </View>
          <View style={{flex:1}}></View>
        </KeyboardAvoidingView>
      );
    }
  }
}
const alto = Dimensions.get('window').height - 25;
const ancho = Dimensions.get('window').width;

const estilos = StyleSheet.create({
  contenedor: {
    height: alto,
    flex:1
  },
  header: {
    height: 65,
    width: ancho,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex:30,
    marginTop:Platform.select({ios:15,android:0})
  },
  barra: {
    width: ancho,
    height: alto * 0.09,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'black',
    zIndex: 2000,
  },
  selec: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: Platform.select({ios:10,android:20}),
    paddingHorizontal: 5,
    height: 25,
    alignItems: 'center',
    textAlign:'center'
  },
  no_selec: {
    paddingHorizontal: 5,
    textAlign:'center'
  },
  item:{
    width: ancho - 40,
    borderBottomWidth: 2,
    marginRight: 20,
    marginLeft: 20,
    flexDirection: 'row',
    paddingBottom: 10,
    marginTop: 10,
  }
});