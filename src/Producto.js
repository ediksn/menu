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
import {Icon, Input} from 'native-base';
import {CheckBox} from 'react-native-elements';
import store from './redux/store';
import {setOrden} from './redux/actions';
import AsyncStorage from '@react-native-community/async-storage';
import {withNavigationFocus} from 'react-navigation'
import { url } from './components/Api';
class Producto extends React.Component {
  constructor() {
    super();
    this.state = {
      producto: null,
      profile: null,
      cant: 0,
      orden: typeof(store.getState().orden)==='string'? null : store.getState().orden,
      ingredients:[],
      comentario:''
    };
  }

  componentDidMount() {
    this.setState({
      producto: this.props.navigation.getParam('producto'),
      profile: this.props.navigation.getParam('profile'),
      cant: 1,
    });
  }

  componentDidUpdate(prevProps,prevState){
    if (this.props.isFocused!==prevProps.isFocused&&this.props.isFocused){
      this.setState({orden: typeof(store.getState().orden)==='string'? null : store.getState().orden,})
    }
  }

  agregarItem(item){
    let igrts = this.state.ingredients
    let total = this.state.producto.price
    igrts.push(item)
    total+=parseFloat(item.price)
    this.setState(prevState=>({
      producto:{
        ...prevState.producto,
        price:total
      },
      ingredients:igrts
    }))
  }

  quitarItem(item){
    let igrts=this.state.ingredients
    let total = this.state.producto.price
    let i = igrts.findIndex(x=>x.text===item)
    total-=parseFloat(igrts[i].price)
    igrts.splice(i,1)
    this.setState(prevState=>({
      producto:{
        ...prevState.producto,
        price:total,
      }
    }))
  }

  ordenar() {
    let prod = {...this.state.producto}
    prod.count = this.state.cant
    if(prod.ingredients && prod.ingredients.length>0) prod.ingredients[0].selected = this.state.ingredients
    let products =[prod]
    if (
      !this.state.orden ||
      this.state.orden === '' ||
      (this.state.orden&&this.state.orden.restaurant._id !== this.state.profile._id)
    ) {
      let total = this.state.producto.price * this.state.cant
      console.log(total)
      this.setState({
        orden: {
          restaurant:this.state.profile,
          products,
          total,
          cost_shipping:store.getState().envio,
          iva:store.getState().iva,
          client:store.getState().id_user,
          note:this.state.comentario
        },
      });
      AsyncStorage.setItem('orden', JSON.stringify(this.state.orden))
        .then(() => {
          store.dispatch(setOrden(this.state.orden));
          this.props.navigation.navigate('Carrito');
        })
        .catch(error => alert(error));
    } else {
      let produ = this.state.orden.products.find(el=>el._id === prod._id)
      let total = this.state.orden.total + prod.price * this.state.cant
      if(produ){
        prod.count++
        total = total + prod.price
      }else{
        products = products.concat(this.state.orden.products)
      }
      this.setState(prevState => ({
        orden: {
          ...prevState.orden,
          products,
          total,
          cost_shipping:store.getState().envio,
          iva:store.getState().iva,
          client:store.getState().id_user,
          note: prevState.orden.note ? prevState.orden.note +', '+ this.state.comentario : this.state.comentario
        },
      }));
      AsyncStorage.setItem('orden', JSON.stringify(this.state.orden))
        .then(() => {
          store.dispatch(setOrden(this.state.orden));
          console.log(store.getState().orden.total)
          this.props.navigation.navigate('Carrito');
        })
        .catch(error => alert(error));
      }
  }

  render() {
    if (!this.state.producto) {
      return null;
    } else {
      return (
        <View style={estilos.contenedor}>
          <ScrollView>
            <View style={{width: ancho, height: alto / 4}}>
              <Icon
                name="ios-arrow-back"
                style={{
                  position: 'absolute',
                  top: Platform.select({ios:30,android:20}),
                  left: 20,
                  zIndex: 20,
                  fontWeight: 'bold',
                  width: 40,
                  height: 40
                }}
                onPress={() => this.props.navigation.goBack()}
              />
              <Image
                resizeMode={'cover'}
                style={{width: ancho, height: alto / 4}}
                source={{ uri: url + this.state.producto.cover}}
              />
            </View>
            <View
              style={{
                width: ancho - 40,
                borderBottomWidth: 2,
                marginRight: 20,
                marginLeft: 20,
                flexDirection: 'row',
                paddingBottom: 10,
                marginTop: 10,
              }}>
              <View style={{width: ancho - ancho / 3.5}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                  {this.state.producto.name}
                </Text>
                <Text style={{color: '#999A99', fontSize: 10}}>
                  {this.state.producto.description}
                </Text>
              </View>
              <View>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  RD${this.state.producto.price}
                </Text>
              </View>
            </View>
            {/* Ingrediente */}
            {this.state.producto.ingredients &&
              this.state.producto.ingredients.length > 0 && this.state.producto.ingredients.map((el,i)=>{
                return  (
                  <View key={'i'+i} style={{width:'auto', height:'auto'}}>
                    <View
                      style={{
                        width: ancho - 40,
                        borderBottomWidth: 2,
                        marginRight: 20,
                        marginLeft: 20,
                        flexDirection: 'column',
                        justifyContent:'center',
                        marginHorizontal:3
                      }}>
                      <Text style={{fontSize: 14, fontWeight:'bold', textAlignVertical:'center'}}>{el.title}</Text>
                    </View>
                    <View
                      style={{
                        width: ancho - 40,
                        borderBottomWidth: 2,
                        marginRight: 20,
                        marginLeft: 20,
                        paddingBottom: 10,
                        marginTop: 10,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                      }}>
                      {el.options&& 
                        el.options.map((ele,i) => {
                          return (
                            <View key={'o'+i} style={{width: (ancho - 40) / 2, flexDirection:'row', alignItems:'center', marginVertical:3}}>
                              <View style={{height:10, alignItems:'center', justifyContent:'center', }}>
                                <CheckBox
                                  checkedIcon='dot-circle-o'
                                  uncheckedIcon='circle-o'
                                  checkedColor='black'
                                  checked={this.state['check'+el._id+i]} 
                                  onPress={()=>{
                                    if(this.state['check'+el._id+i]) this.quitarItem(ele.text)
                                    else this.agregarItem(ele) 
                                    this.setState({['check'+el._id+i]:!this.state['check'+el._id+i]})}
                                  }
                                />
                              </View>
                              <Text numberOfLines={3} style={{paddingHorizontal:5, width:70, fontSize:10}}>{ele.text}</Text>
                              <Text>RD${ele.price}</Text>
                            </View>
                          );
                      })}
                    </View>
                  </View>
                )}
              )
            }
            {/* FIN INGREDIENTE */}
            <View
              style={{
                width: ancho - 40,
                borderBottomWidth: 2,
                marginRight: 20,
                marginLeft: 20,
                paddingBottom: 0,
                marginTop: 0,
                flexDirection: 'column',
                height: 70,
              }}>
              <Text style={{fontSize: 12}}>Comentarios</Text>
              <Input
                placeholder={'Comentarios'}
                value={this.state.comentario}
                onChangeText={text=>this.setState({comentario:text})}
                style={{
                  textAlign: 'left',
                  width: '100%',
                  fontSize: 12,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 100,
                width: ancho - 40,
                marginRight: 20,
                marginLeft: 20,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  width: ancho / 4,
                }}>
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 10,
                    height: 20,
                    width: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                  }}>
                  <Icon
                    name="remove"
                    style={{fontSize: 18}}
                    onPress={() => {
                      if (this.state.cant > 1) {
                        this.setState({cant: this.state.cant - 1});
                      }
                    }}
                  />
                </View>
                <View
                  style={{
                    borderWidth: 2,
                    width: 40,
                    height: 30,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>{this.state.cant}</Text>
                </View>
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 10,
                    height: 20,
                    width: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    name="add"
                    style={{fontSize: 18}}
                    onPress={() => this.setState({cant: this.state.cant + 1})}
                  />
                </View>
              </View>
              <View>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  Total:RD${this.state.cant * this.state.producto.price}
                </Text>
              </View>
            </View>
          </ScrollView>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => this.ordenar()}
            style={{
              width: ancho,
              height: 50,
              backgroundColor: 'black',
              marginBottom: Platform.select({ios:-20,android:-1}),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: '#fff'}}>Agregar al carrito</Text>
          </TouchableHighlight>
        </View>
      );
    }
  }
}

export default withNavigationFocus(Producto)

const alto = Dimensions.get('window').height - 25;
const ancho = Dimensions.get('window').width;

const estilos = StyleSheet.create({
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
});
