import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
import {Icon, Picker, Input} from 'native-base';
import {api} from './components/Api';
import {withNavigationFocus} from 'react-navigation';
import PayPal from './Modals/PayPal';
import 'moment/locale/es'
import Mensajes from './Modals/Mensaje';
import Cargando from './Modals/Cargando';
class Recuperar extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      email:'',
      estado:'',
      codigo:'',
      password:'',
      pass:'',
      id:'',
      ver_password:true,
      valido:true,
      loading:false
    };
    this.cerrarInfo=this.cerrarInfo.bind(this)
  }

  solicitar(){
    this.setState({loading: false})
    fetch(`${api}/client/recuperar/${this.state.email.toLocaleLowerCase()}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
    })
    .then(res=>res.json()
        .then(resp=>{
            console.log(resp)
            if(resp.status==='denied' || resp.error){
                this.setState({
                    visible:true,
                    mensaje:resp.error
                })
            }else{
                this.setState({
                    visible:true,
                    mensaje:'Su código ha sido enviado a la dirección de correo suministrada',
                    email:'',
                    estado:'solicitado',
                    id:resp._id
                })
            }
        })
        .catch(err=>this.setState({loading: false},console.log(err)))
    )
    .catch(error=>this.setState({loading: false},console.log(error)))
  }

  validar(){
    this.setState({loading: false})
    fetch(`${api}/client/validar/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            _id:this.state.id,
            codigo: this.state.codigo
        })
    })
    .then(res=>res.json()
        .then(resp=>{
            if(resp.status==='denied' || resp.error){
                this.setState({
                    visible:true,
                    mensaje:resp.error
                })
            }else{
                this.setState({
                    visible:true,
                    mensaje:'Código validado exitosamente',
                    estado:'validado',
                    codigo:''
                })
            }
        })
        .catch(err=>this.setState({loading: false},console.log(err)))
    )
    .catch(error=>this.setState({loading: false},console.log(error)))
  }

  guardar(){
    if(this.state.pass===this.state.password && this.state.pass.length>0 && this.state.password.length>0){
        this.setState({loading: false})
        fetch(`${api}/client/password/`, {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                _id:this.state.id,
                password: this.state.password
            })
        })
        .then(res=>res.json()
            .then(resp=>{
                if(resp.status==='denied' || resp.error){
                    this.setState({
                        visible:true,
                        mensaje:resp.error,
                        loading: false
                    })
                }else{
                    this.setState({
                        visible:true,
                        mensaje:'¡Contraseña actualizada exitosamente!',
                        estado:'',
                        codigo:'',
                        password:'',
                        pass:'',
                        loading: false
                    })
                }
            })
            .catch(err=>this.setState({loading: false},console.log(err)))
        )
        .catch(error=>this.setState({loading: false},console.log(error)))
    }
  }

  cerrarInfo(data){
    this.setState({visible:data})
  }

  render() {
      return (
        <KeyboardAvoidingView style={estilos.vista}>
          <Cargando visible={this.state.loading}/>
          <Mensajes
            visible={this.state.visible}
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
              style={{fontSize:35, height:40 , width: 40, fontWeight: 'bold'}}
              onPress={() => this.props.navigation.navigate('Login')}
            />
            <Text style={{textAlign: 'center', fontSize:18,width: ancho * 0.8, }}>
              Recuperar contraseña
            </Text>
          </View>
          {
              this.state.estado ==='' &&
                <View style={{flex:1, marginTop:alto*0.15,alignItems:'center'}}>
                    <Text style={{textAlign:'center'}}>
                        Ingrese el correo con el que se registro, el cúal se usará para enviarle un código de seguridad
                    </Text>
                    <View style={[estilos.item,{marginTop:5}]}>
                        <Input
                            placeholder='Correo'
                            value={this.state.email}
                            onChangeText={text=>this.setState({email:text})}
                            style={{width:'100%'}}
                        />  
                    </View>
                </View>
          }
          {
              this.state.estado==='solicitado' && 
                <View style={{flex:1, marginTop:alto*0.15,alignItems:'center'}}>
                    <Text style={{textAlign:'center'}}>
                        Ingrese el código que se le ha enviado
                    </Text>
                    <View style={[estilos.item,{marginTop:5}]}>
                        <Input
                            placeholder='Código'
                            value={this.state.codigo}
                            onChangeText={text=>this.setState({codigo:text})}
                            style={{width:'100%'}}
                        />  
                    </View>
                </View>

          }
          {
              this.state.estado==='validado' && 
                <View style={{flex:1, marginTop:alto*0.15,alignItems:'center'}}>
                    <Text style={{textAlign:'center'}}>
                        Ingrese las contraseña nueva
                    </Text>
                    <View style={ this.state.password.length>0 && this.state.pass.length>0 && this.state.pass!==this.state.password ?
                        [estilos.no_item,{marginTop:5, justifyContent:'space-between',flexDirection:'row'}] : 
                        [estilos.item,{marginTop:5, justifyContent:'space-between',flexDirection:'row'}]
                    }>
                        <Input
                            placeholder='Contraseña'
                            onChangeText={text=>this.setState({password:text})}
                            value={this.state.password}
                            secureTextEntry={this.state.ver_password}
                            style={{flex:5}}
                        /> 
                        <Icon
                            style={{flex:1}}
                            name={this.state.ver_password ? 'eye' : 'eye-off'}
                            onPress={()=>this.setState({ver_password:!this.state.ver_password})}
                        /> 
                    </View>
                    <View style={ this.state.password.length>0 && this.state.pass.length>0 && this.state.pass!==this.state.password ?
                        [estilos.no_item,{marginTop:5}] : [estilos.item,{marginTop:5}]
                    }>
                        <Input
                            placeholder='Confirmar contraseña'
                            value={this.state.pass}
                            secureTextEntry={this.state.ver_password}
                            onChangeText={text=>this.setState({pass:text})}
                            style={{width:'100%'}}
                        />  
                    </View>
                </View>
          }
            <TouchableHighlight
                underlayColor={'transparent'}
                style={estilos.barra_back}
                onPress={() =>{
                    if(this.state.estado==='') this.solicitar() 
                    if(this.state.estado==='solicitado') this.validar() 
                    if(this.state.estado==='validado') this.guardar() 
                }}
            >
                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
                { this.state.estado==='' ? 'Solicitar código' : this.state.estado==='solicitado' ? 'Validar código' : 'Guardar'}
                </Text>
            </TouchableHighlight>
            <View style={{flex:1}}></View>
        </KeyboardAvoidingView>
      );
  }
}

export default withNavigationFocus(Recuperar);

const alto = Dimensions.get('window').height - 25;
const ancho = Dimensions.get('window').width;

const estilos = StyleSheet.create({
  vista: {
    height: alto,
    width: ancho,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex:1
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
    borderWidth:1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    height: alto * 0.08,
    width: ancho * 0.8,
  },
  no_item: {
    borderColor: 'red',
    borderWidth:1,
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
  },
  boton:{
    backgroundColor:'black',
    borderRadius:10,
    color:'white',
    textAlign:'center',
    width:ancho*0.4,
    height:35,
    fontSize:18,
    marginVertical:7,
    textAlignVertical:'center'
  }
});
