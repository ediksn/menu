import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableHighlight
} from 'react-native';
import {Icon, Input} from 'native-base';
export default class Codigo extends React.Component {
  constructor() {
    super();
    this.state = {
      confirm: null,
      numero: '',
    };
  }

  componentDidMount(){
    this.setState({
      confirm : this.props.navigate.getParam('confirm'),
      numero : this.props.navigate.getParam('numero')
    })
  }

  // cerrarInfo(data){
  //     this.setState({visible:data})
  // }

  // login(){
  //     this.setState({loading:true})
  //     fetch(`${api}/usuario/login`,{
  //         method:'POST',
  //         headers: {
  //             Accept: 'application/json',
  //             'Content-Type': 'application/json',
  //         },
  //         body:JSON.stringify({
  //             correo:this.state.correo,
  //             password:this.state.password,
  //         })
  //     })
  //     .then(resp=>resp.json()
  //         .then(res=>{
  //             if(res.status){
  //                 this.setState({
  //                     loading:false,
  //                     visible:true,
  //                     mensaje:res.message,
  //                 })
  //             }else{
  //                 store.dispatch(setId(res._id))
  //                 store.dispatch(setCorreo(res.correo))
  //                 store.dispatch(setSuscrpcion(res.suscripcion?true:false))
  //                 AsyncStorage.multiSet([
  //                     ['id_user',res._id],
  //                     ['correo',res.correo],
  //                     ['sucripcion',res.suscripcion?"true":"false"]
  //                 ])
  //                 .then(()=>{
  //                     this.setState({
  //                         loading:false,
  //                         correo:'',
  //                         password:'',
  //                     })
  //                     this.props.navigation.goBack()
  //                 })
  //                 .catch(error=>this.setState({loading:false},alert(error)))
  //             }
  //         })
  //         .catch(error=>this.setState({loading:false},alert(error)))
  //     )
  //     .catch(error=>this.setState({loading:false},alert(error)))
  // }

  render() {
    return (
      <KeyboardAvoidingView
        style={estilos.vista}
        contentContainerStyle={estilos.vista}>
        <View style={estilos.barra}>
          <Icon
            name="ios-arrow-back"
            style={{
              fontSize: 35, 
              fontWeight: 'bold', 
              marginLeft: 10,
              width: 40, 
              height: 40
            }}
          />
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 20,
              marginLeft: ancho / 4,
            }}>
            Código de verificación
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'transparent',
            marginTop: alto * 0.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: ancho,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                collor: 'black',
                width: ancho * 0.7,
                fontWeight: 'bold',
                fontSize: 20,
                marginTop: 30,
              }}>
              INTRODUCE TU CÓDIGO
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View maxLength={1} style={estilos.item}>
              <Input
                maxLength={1}
                style={{textAlign: 'center'}}
                keyboardType={'numeric'}
                textAlignVertical={'center'}
              />
            </View>
            <View maxLength={1} style={estilos.item}>
              <Input
                maxLength={1}
                style={{textAlign: 'center'}}
                keyboardType={'numeric'}
                textAlignVertical={'center'}
              />
            </View>
            <View maxLength={1} style={estilos.item}>
              <Input
                maxLength={1}
                style={{textAlign: 'center'}}
                keyboardType={'numeric'}
                textAlignVertical={'center'}
              />
            </View>
            <View maxLength={1} style={estilos.item}>
              <Input
                maxLength={1}
                style={{textAlign: 'center'}}
                keyboardType={'numeric'}
                textAlignVertical={'center'}
              />
            </View>
          </View>
          <View
            style={{
              width: ancho,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                collor: 'black',
                fontSize: 12,
                width: ancho * 0.7,
                fontWeight: 'bold',
              }}>
              Tu codigo fue enviado al +1 800 574 1234
            </Text>
          </View>
          <View
            style={{
              width: ancho,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                collor: 'black',
                width: ancho * 0.7,
                fontWeight: 'bold',
                fontSize: 20,
                marginTop: 30,
              }}>
              Reenviar código
            </Text>
          </View>
        </View>
        <TouchableHighlight
          underlayColor={'transparent'}
          style={estilos.barra_back}>
          <Text style={{color: '#B4B5B4'}}>Validar</Text>
        </TouchableHighlight>
      </KeyboardAvoidingView>
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
    flex: 1,
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
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    marginVertical: 7,
    height: alto * 0.15,
    marginHorizontal: 5,
    flexDirection: 'row',
    width: ancho * 0.15,
  },
});
