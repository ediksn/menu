import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {Icon, Picker} from 'native-base';
import Reordenar from './Modals/Reordenar';
import {api} from './components/Api';
import store from './redux/store';
import {withNavigationFocus} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { setOrden } from './redux/actions';
import PayPal from './Modals/PayPal';
import {CheckBox} from 'react-native-elements'
import DateTimePicker from 'react-native-modal-datetime-picker'                
import moment from 'moment';
import 'moment/locale/es'
import Mensajes from './Modals/Mensaje';
import Cargando from './Modals/Cargando';
moment().locale('es')
class Carrito extends React.Component {
  constructor() {
    super();
    let orden = store.getState().orden
    orden.total=0
    orden.products.forEach(el => {
      orden.total+=el.price*el.count
    });
    this.state = {
      visible: false,
      direcciones: [],
      tarjetas:[],
      orden,
      paypal:false,
      propina:'',
      now:true,
      hora:null,
      reloj:false,
      ver :false,
      mensaje:'',
      loading: false
    };
    this.cerrarOrden = this.cerrarOrden.bind(this);
    this.cerrarInfo=this.cerrarInfo.bind(this)
  }

  componentDidMount() {
    this.getDirecciones();
    this.getTarjetas();
  }

  componentDidUpdate(prevProps,prevState){
    if(this.state.now!==prevState.now&&!this.state.now){
      this.setState(prevState=>({
        orden:{
          ...prevState.orden,
          agendado:true,
          hora:this.state.hora
        }
      }))
    }
    if(this.state.now!==prevState.now&&this.state.now){
      this.setState(prevState=>({
        orden:{
          ...prevState.orden,
          agendado:false,
          hora:null
        }
      }))
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isFocused !== this.props.isFocused && nextProps.isFocused) {
      this.setState({orden: this.props.navigation.getParam('orden')});
      return true;
    }
    return true;
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
              this.setState(prevState=>({
                loading: false,
                tarjetas:res.tarjetas,
                orden:{
                  ...prevState.orden,
                  tarjeta: res.tarjetas.length > 0 ? res.tarjetas[0] : '',
                  payment:'tarjeta'
                }
              }));
            }
          })
          .catch(error => this.setState({loading: false},console.log(error))),
      )
      .catch(error => this.setState({loading: false},console.log(error)));
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
              this.setState({direcciones: res,loading: false});
            }
          })
          .catch(error => this.setState({loading: false}, alert(error))),
      )
      .catch(error => this.setState({loading: false}, alert(error)));
  }

  cerrarOrden(data) {
    this.setState({visible: data});
  }

  removeItem(i){
    let products = [...this.state.orden.products]
    let total = this.state.orden.total
    total-=products[i].price
    products.splice(i,1)
    this.setState(prevState=>({
      orden:{
        ...prevState.orden,
        products:products,
        total:total
      }
    }))
    AsyncStorage.setItem('orden',JSON.stringify(this.state.orden))
    .then(()=>{
      store.dispatch(setOrden(JSON.stringify(this.state.orden)))
    })
    .catch(error=>alert(error))
  }

  total(){
    let total= this.state.orden.total
    let iva =this.state.orden.iva
    let envio=this.state.orden.cost_shipping
    if(typeof(this.state.orden.total)==='string') total = parseFloat(this.state.orden.total)
    if(typeof(this.state.orden.cost_shipping)==='string') envio = parseFloat(this.state.orden.cost_shipping)
    if(typeof(this.state.orden.iva)==='string') iva = parseFloat(this.state.orden.iva)
    return (total+envio+((total+envio)*(iva)/100)).toFixed(2)
  }

  subtotal(){
    let subtotal =this.state.orden.total
    let iva =this.state.orden.iva
    if(typeof(this.state.orden.total)==='string') total = parseFloat(this.state.orden.total)
    if(typeof(this.state.orden.iva)==='string') iva = parseFloat(this.state.orden.iva)
    return (subtotal+((subtotal)*(iva)/100)).toFixed(2)
  }

  ordenar(){
    // if(this.state.orden.tarjeta.length < 1){
    //   this.setState({
    //     ver: true,
    //     mensaje: 'Debe seleccionar un metodo de pago para poder procesar su orden'
    //   })
    // }else{
      this.setState({loading:true})
      store.dispatch(setOrden(this.state.orden))
      fetch(`${api}/checkout`,{
        method:'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(this.state.orden)
      })
      .then(resp=>
        resp.json()
        .then(  
          res=>{
            console.log(res)
            if(res.state||res.status==='success'){
              this.props.navigation.navigate('Orden',{orden:res})
              this.setState({loading:false})
            }else this.setState({
              mensaje:res.error, 
              ver:true,
              loading: false
            })
          },
        ).catch(error=>this.setState({loading: false},console.log(error)))
      )
      .catch(error=>this.setState({loading: false},console.log(error)))
    // }
  }

  cerrarInfo(data){
    this.setState({ver:data})
  }

  render() {
    if (!this.state.orden) {
      return null;
    } else {
      return (
        <View style={estilos.vista}>
          <Cargando visible={this.state.loading}/>
          <Reordenar
            visible={this.state.visible}
            cerrarOrden={this.cerrarOrden}
          />
          <Mensajes
            visible={this.state.ver}
            mensaje={this.state.mensaje}
            cerrarInfo={this.cerrarInfo}
          />
          <PayPal visible={this.state.paypal}/>
          <View
            style={[
              estilos.barra,
              {justifyContent: 'flex-start', paddingHorizontal: 12},
            ]}>
            <Icon
              name="close-circle-outline"
              style={{fontSize: 35, fontWeight: 'bold',width:40,height:40}}
              onPress={() => this.props.navigation.goBack()}
            />
            <Text style={{textAlign: 'center', width: ancho * 0.8}}>
              Tu carrito
            </Text>
          </View>
          <View style={estilos.content}>
            <ScrollView
              contentContainerStyle={{
                height: 'auto',
                width: ancho,
                alignItems: 'center',
                marginBottom:20
              }}>
              <View
                style={{
                  width: ancho * 0.8,
                  justifyContent: 'center',
                  height: 20,
                  zIndex: 200,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {this.state.orden.restaurant.name}
                </Text>
              </View>
              <View
                style={{
                  width: ancho * 0.8,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  height: 'auto',
                  marginTop: 5,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'grey',
                    height: 20,
                    marginBottom: 5,
                  }}>
                  30.45 min
                </Text>
                <View
                  style={[estilos.item, {flexDirection: 'row', height: 90}]}>
                  <View style={{width: ancho * 0.4}}>
                    <Picker
                      style={{
                        width: ancho * 0.3,
                        height: 20,
                      }}
                      selectedValue={this.state.orden.address}
                      onValueChange={text =>
                        this.setState(prevState => ({
                          orden: {
                            ...prevState.orden,
                            address: text,
                          },
                        }))
                      }>
                      {this.state.direcciones.length > 0 &&
                        this.state.direcciones.map((el, i) => {
                          return <Picker.Item key={'a'+i} label={el.nombre} value={el} />;
                        })}
                      </Picker>
                    {this.state.orden.address && (
                      <View>
                        <Text>{this.state.orden.address.calle}</Text>
                        <Text>{this.state.orden.address.edificio}</Text>
                        <Text>{this.state.orden.address.provincia}</Text>
                      </View>
                    )}
                  </View>
                </View>
                {this.state.orden.products.map((el, i) => {
                  return (
                    <View
                      key={'i' + i}
                      style={[estilos.item, {height:'auto',flexDirection: 'row'}]}>
                      <View>
                        <Text 
                          numberOfLines={2}
                          style={{
                            fontWeight: 'bold',
                            width:ancho*0.6
                          }}>
                          {el.name} x{el.count}
                        </Text>
                        <View style={{width:ancho*0.5, flexGrow:1}}>
                          {
                            el.ingredients &&
                              el.ingredients.length > 0 ? 
                                el.ingredients[0].selected ?
                                  el.ingredients[0].selected.map((ele,id)=>{
                                    return (<Text key={'ti'+id} style={{color:'grey'}}>x {ele.text} </Text>)
                                  }):
                                  el.ingredients[0].options.map((ele,id)=>{
                                    return (<Text key={'ti'+id} style={{color:'grey'}}>x {ele.text} </Text>)
                                  })
                                : null
                          }
                        </View>
                      </View>
                      <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{fontWeight: 'bold',paddingHorizontal:5}}>RD${el.price * el.count}</Text>
                        <Icon 
                          name='close-circle-outline' 
                          style={{fontWeight:'bold'}}
                          onPress={()=>this.removeItem(i)}
                        />
                      </View>
                    </View>
                  );
                })}
                <View style={[estilos.item,{height:'auto',alignItems:'flex-start'}]}>
                  <Text style={{fontWeight: 'bold', fontSize:11}}>Comentarios</Text>
                  <Text style={{ fontSize:11}}>
                    {this.state.orden.note}
                  </Text>
                </View>
                <View style={[estilos.item, {height: 'auto'}]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: ancho * 0.8,
                    }}>
                    <Text style={{fontWeight: 'bold', fontSize:11}}>Subtotal</Text>
                    <Text style={{fontWeight: 'bold', fontSize:11}}>
                      RD${this.subtotal()}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: ancho * 0.8,
                    }}>
                    <Text style={{fontWeight: 'bold', fontSize:11}}>Costo de envio</Text>
                    <Text style={{fontWeight: 'bold', fontSize:11}}>
                      RD${this.state.orden.cost_shipping}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: ancho * 0.8,
                    }}>
                    <Text style={{fontWeight: 'bold', fontSize:14}}>Total</Text>
                    <Text style={{fontWeight: 'bold', fontSize:14}}>
                      RD${this.total()}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    estilos.item,
                    {height: 'auto', alignItems: 'flex-start'},
                  ]}>
                  <Text
                    style={{
                      color: 'grey',
                      height: 40,
                      textAlignVertical: 'center',
                    }}>
                    Código promocional
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 80,
                    width: ancho * 0.8,
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 11}}>
                    Agregar Propina
                  </Text>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <Text
                      onPress={()=>this.setState(prevState=>({
                        orden:{
                          ...prevState.orden,
                          propina:'0'
                        },
                        propina:'0'
                      }))}
                      style={this.state.propina==='0'?estilos.selec:estilos.no_selec}>
                      RD$0
                    </Text>
                    <Text
                      onPress={()=>this.setState(prevState=>({
                        orden:{
                          ...prevState.orden,
                          propina:'25'
                        },
                        propina:'25'
                      }))}
                      style={this.state.propina==='25'?estilos.selec:estilos.no_selec}>
                      RD$25
                    </Text>
                    <Text
                      onPress={()=>this.setState(prevState=>({
                        orden:{
                          ...prevState.orden,
                          propina:'50'
                        },
                        propina:'50'
                      }))}
                      style={this.state.propina==='50'?estilos.selec:estilos.no_selec}>
                      RD$50
                    </Text>
                    <Text
                      onPress={()=>this.setState(prevState=>({
                        orden:{
                          ...prevState.orden,
                          propina:'75'
                        },
                        propina:'75'
                      }))}
                      style={this.state.propina==='75'?estilos.selec:estilos.no_selec}>
                      RD$75
                    </Text>
                    <Text
                      onPress={()=>this.setState(prevState=>({
                        orden:{
                          ...prevState.orden,
                          propina:'100'
                        },
                        propina:'100'
                      }))}
                      style={this.state.propina==='100'?estilos.selec:estilos.no_selec}>
                      RD$100
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: ancho * 0.8,
                    height:'auto',
                    alignContent: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: 'black',
                      borderWidth: 2,
                      width: (ancho * 0.8) / 3,
                    }}>
                    <Text>Orden</Text>
                    <Text>RD${this.total()}</Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: 'black',
                      borderWidth: 2,
                      width: (ancho * 0.8) / 3,
                    }}>
                    <Text>Envío</Text>
                    <Text>RD${this.state.orden.envio?this.state.orden.envio:this.state.orden.cost_shipping}</Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: 'black',
                      borderWidth: 2,
                      width: (ancho * 0.8) / 3,
                    }}>
                    <Text>Propina</Text>
                    <Text>{this.state.orden.propina?this.state.orden.propina:'0'}</Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    width: ancho * 0.8,
                    borderWidth: 2,
                    borderColor: 'black',
                    height: 30,
                    alignItems: 'flex-end',
                  }}>
                  <Picker
                    selectedValue={this.state.orden.tarjeta}  
                    onValueChange={text=>this.setState(prevState=>({
                      orden:{
                        ...prevState.orden,
                        payment:'tarjeta',
                        tarjeta: text ? text : '' 
                      }
                    }))}
                    style={{
                      width: ancho * 0.5,
                    }}>
                    {this.state.tarjetas.map((el,i)=>{
                      return (
                        <Picker.Item 
                          key={'p'+i} 
                          label={`Visa  ****${el.numero.substring(12,16)}`}
                          value={el} 
                        />
                      ) 
                    })}
                  </Picker>
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 80,
                    marginBottom:this.state.now?100:0,
                    width: ancho * 0.8,
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 11}}>
                    Programar pedido
                  </Text>
                  <CheckBox
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checkedColor='black'
                    checked={this.state.now}
                    onPress={()=>this.setState({now:true})}
                  />
                  <Text style={{fontWeight: 'bold', fontSize: 11}}>
                    Ahora
                  </Text>
                  <CheckBox
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checkedColor='black'
                    checked={!this.state.now}
                    onPress={()=>this.setState({now:false,reloj:true})}
                  />
                  <Text style={{fontWeight: 'bold', fontSize: 11}}>
                    Mas tarde
                  </Text>
                </View>
                {!this.state.now&&
                  <View 
                    style={{
                      marginTop:-10, 
                      flexDirection:'row', 
                      alignItems:'center', 
                      right:10, 
                      width:ancho*0.8,
                      marginBottom:70, 
                      justifyContent:'flex-end'
                    }}
                  >
                    <Text style={{textAlign:'right', fontWeight:'bold',marginRight:10, fontSize:14}}>
                      {moment(this.state.hora).format('H:mm')}
                    </Text>
                    <Icon name='clock' onPress={()=>this.setState({reloj:true})}/>
                    <DateTimePicker
                      isVisible={this.state.reloj}
                      timePickerModeAndroid={'clock'}
                      mode='time'
                      onConfirm={date=>
                        this.setState(prevState=>
                          ({
                            orden:{
                              ...prevState.orden,
                              hora:date
                            },
                            hora:date,
                            reloj:!this.state.reloj
                          }))
                      }
                      onCancel={()=>this.setState({reloj:!this.state.reloj})}
                    />
                  </View>
                } 
              </View>
            </ScrollView>
          </View>
          <TouchableHighlight
            underlayColor={'transparent'}
            style={estilos.barra_back}
            onPress={() =>this.ordenar()}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
              Colocar orden
            </Text>
          </TouchableHighlight>
        </View>
      );
    }
  }
}

export default withNavigationFocus(Carrito);

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
    height: alto * 0.8,
    marginTop: alto * 0.1,
    flex: 1,
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
    backgroundColor: 'black',
    bottom: -1,
    zIndex: 2000,
  },
  item: {
    borderColor: 'black',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    height: alto * 0.08,
    width: ancho * 0.8,
  },
  selec:{
    textAlign: 'center',
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor:'black',
    color:'white'
  },
  no_selec:{
    textAlign: 'center',
    borderColor: 'black',
    borderWidth: 2,
  }
});
