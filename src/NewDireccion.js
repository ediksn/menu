import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Icon,Picker} from 'native-base';
import Menu from './components/Menu';
import {api} from './components/Api';
import store from './redux/store';
import Mensajes from './Modals/Mensaje';
import Cargando from './Modals/Cargando';
import { thisExpression } from '@babel/types';

export default class NewDireccion extends React.Component {
  constructor() {
    super();
    this.state = {
      provincias: [],
      sectores: [],
      calle: '',
      edificio: null,
      provincia: null,
      sector: null,
      nombre: '',
      mensaje: '',
      id: null,
      visible: false,
      loading: false,
    };
    this.cerrarInfo = this.cerrarInfo.bind(this);
  }

  componentDidMount() {
    if(this.props.navigation.getParam('direccion')){
      let add = this.props.navigation.getParam('direccion')
      this.setState({
        sector: add.sector,
        provincia: add.provincia,
        calle: add.calle,
        nombre: add.nombre,
        edificio: add.edificio,
        id: add._id
      })
    }
    this.getProvincias();
  }

  getProvincias() {
    this.setState({loading: true});
    fetch(`${api}/prosec`, {
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
                provincias: res.provincia,
                loading:false
              });
            }
          })
          .catch(error => this.setState({loading: false}, alert(error))),
      )
      .catch(error => this.setState({loading: false}, alert(error)));
  }

  getSectores(provincia) {
    this.setState({loading: true});
    fetch(`${api}/prosec/sector/${provincia.name}`, {
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
                sectores: res,
                loading:false
              });
            }
          })
          .catch(error => this.setState({loading: false}, alert(error))),
      )
      .catch(error => this.setState({loading: false}, alert(error)));
  }

  saveDireccion() {
    if(!this.state.provincia || !this.state.edificio || this.state.calle.length<2
      || this.state.nombre.length<2){
      this.setState({
        visible: true,
        mensaje: 'Debe completar todos los campos'
      })
    }else{
      this.setState({loading: true});
      let body = {
        client: store.getState().id_user,
        provincia: this.state.provincia ? this.state.provincia.name: '',
        sector: this.state.sector ? this.state.sector.name : '',
        nombre: this.state.nombre,
        calle: this.state.calle,
        edificio: this.state.edificio,
      }
      this.state.id ? body._id = this.state.id : null
      fetch(`${api}/client/address`, {
        method: this.state.id ? 'PUT' : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.getState().token.toString(),
        },
        body: JSON.stringify(body),
      })
        .then(resp =>
          resp
            .json()
            .then(res => {
              if (res.error || res.status==='denied') {
                this.setState({
                  loading: false,
                  visible: true,
                  mensaje: res.error,
                });
              } else {
                this.setState({
                  provincia: '',
                  sector: '',
                  nombre: '',
                  calle: '',
                  edificio: '',
                  visible: true,
                  mensaje: '¡Dirección registrada exitosamente!',
                  loading:false
                });
              }
            })
            .catch(error => this.setState({loading: false}, alert(error))),
        )
        .catch(error => this.setState({loading: false}, alert(error)));
    }
  }

  cerrarInfo(data) {
    this.setState({visible: data});
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={estilos.contenedor}
        contentContainerStyle={estilos.contenedor}>
        <Cargando visible={this.state.loading}/>
        <Mensajes
          visible={this.state.visible}
          mensaje={this.state.mensaje}
          cerrarInfo={this.cerrarInfo}
        />
        {/* Header */}
        <View style={estilos.header}>
          {/* Izquierda Header */}
          <View>
            <Icon
              name="ios-arrow-back"
              style={{width: 40, height: 40, fontSize: 35}}
              onPress={() => {
                this.setState({
                  provincia: '',
                  sector: '',
                  nombre: '',
                  calle: '',
                  edificio: '',
                });
                this.props.navigation.goBack();
              }}
            />
          </View>
          {/* Centro Header */}
          <View style={{marginLeft: -20}}>
            <Text style={{fontSize: 18}}>Nueva Direccion</Text>
          </View>

          {/* Derecha Header */}
          <View />
        </View>
        {/* Fin Header */}

        <View style={estilos.contOpciones}>
          <View style={{position: 'relative'}}>
            <TextInput
              style={{height: 40, borderColor: 'black', borderWidth: 2}}
              placeholder={'Calle o Avenida, Numero'}
              value={this.state.calle}
              onChangeText={text => this.setState({calle: text})}
            />
          </View>
          <View style={{position: 'relative', marginTop: 10}}>
            <TextInput
              style={{height: 40, borderColor: 'black', borderWidth: 2}}
              placeholder={'Edificio/Apartamento'}
              value={this.state.edificio}
              onChangeText={text => this.setState({edificio: text})}
            />
          </View>
          <View
            style={{flexDirection: 'row', position: 'relative', marginTop: 10}}>
            <View
              style={{
                position: 'relative',
                marginTop: 10,
                width: (ancho - 40) / 2,
                borderColor: 'black',
                borderWidth: 2,
              }}>
              <Picker
                onValueChange={text => {
                  if(text)this.setState({provincia:text},this.getSectores(text))
                }}
                selectedValue={this.state.provincia}
                style={{
                  width: '100%',
                  height: 40,
                }}>
                  <Picker.Item label='' value={null}/>
                {this.state.provincias.map((el, i) => {
                  return (
                    <Picker.Item
                      key={'prov' + i}
                      label={el.name}
                      value={el}
                    />
                  );
                })}
              </Picker>
            </View>
            <View
              style={{
                position: 'relative',
                marginTop: 10,
                width: (ancho - 40) / 2,
                marginLeft: -1,
                borderColor: 'black',
                borderWidth: 2,
              }}>
              <Picker
                onValueChange={text => this.setState({sector: text})}
                selectedValue={this.state.sector}
                style={{
                  width: '100%',
                  height: 40,
                }}>
                {this.state.sectores.map((el, i) => {
                  return (
                    <Picker.Item
                      key={'sec' + i}
                      label={el.name}
                      value={el}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
          <View style={{position: 'relative', marginTop: 10}}>
            <TextInput
              style={{height: 40, borderColor: 'black', borderWidth: 2}}
              placeholder={'Alias'}
              value={this.state.nombre}
              onChangeText={text => this.setState({nombre: text})}
            />
          </View>
        </View>
        <TouchableHighlight
          onPress={() => this.saveDireccion()}
          underlayColor={'transparent'}
          style={estilos.barra_back}>
          <Text style={{color: '#B4B5B4'}}>Guardar</Text>
        </TouchableHighlight>
      </KeyboardAvoidingView>
    );
  }
}
const alto = Dimensions.get('window').height - 25;
const ancho = Dimensions.get('window').width;
const estilos = StyleSheet.create({
  barra_back: {
    width: ancho,
    borderColor: 'black',
    borderTopWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 2000,
    bottom: Platform.select({ios:0,android:0}),
    height: 50,
    color: '#B4B5B4',
  },
  contOpciones: {
    padding: 20,
  },
  contenedor: {
    flexDirection: 'column',
    position: 'relative',
    height: alto,
    padding: 0,
    margin: 0,
    flex: 1,
  },
  header: {
    height: 65,
    width: ancho,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    top:Platform.select({ios:10,android:0})
  },
});
