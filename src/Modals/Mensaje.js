import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Modal,
  Image,
  TouchableHighlight,
} from 'react-native';
import {Spinner, Icon, Button, Text} from 'native-base';
export default class Mensajes extends React.Component {
  botones() {
    if (this.props.mensaje && this.props.mensaje.includes('cerrar su sesión')) {
      return (
        <View
          style={{
            width: ancho * 0.8,
            justifyContent: 'space-evenly',
            flexDirection: 'row',
          }}>
          <Button
            style={estilos.boton}
            onPress={() => this.props.cerrarInfo(false)}>
            <Text style={{textAlign: 'center', color: 'black'}}>Cerrar</Text>
          </Button>
          <Button
            style={estilos.boton}
            onPress={() => {
              this.props.cerrarInfo(false);
              this.props.logout();
            }}>
            <Text style={{textAlign: 'center', color: 'black'}}>aceptar</Text>
          </Button>
        </View>
      );
    }
    else if (this.props.mensaje && this.props.mensaje.includes('eliminar esta ')) {
      return (
        <View
          style={{
            width: ancho * 0.8,
            justifyContent: 'space-evenly',
            flexDirection: 'row',
          }}>
          <Button
            style={estilos.boton}
            onPress={() => this.props.cerrarInfo(false)}>
            <Text style={{textAlign: 'center', color: 'black'}}>Cerrar</Text>
          </Button>
          <Button
            style={estilos.boton}
            onPress={() => {
              this.props.eliminar();
              this.props.cerrarInfo(false);
            }}>
            <Text style={{textAlign: 'center', color: 'black'}}>aceptar</Text>
          </Button>
        </View>
      );
    }
  }
  render() {
    return (
      <Modal visible={this.props.visible} transparent={true}>
        <View style={estilos.back}>
          <View style={estilos.cont}>
            <View style={estilos.barra}>
              <TouchableHighlight onPress={() => this.props.cerrarInfo(false)}>
                <Icon
                  name="close"
                  style={{color: 'white', marginLeft: 8, fontSize: 35}}
                />
              </TouchableHighlight>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: ancho * 0.18,
                }}>
                <Icon name="information-circle" style={{color: 'white'}} />
                <Text
                  style={{color: 'white', marginLeft: 5, fontWeight: 'bold'}}>
                  Atención
                </Text>
              </View>
            </View>
            <View style={estilos.cuerpo}>
              <View style={estilos.item}>
                <Text style={{textAlign: 'center', fontSize: 20}}>
                  {this.props.mensaje}
                </Text>
              </View>
            </View>
            {this.botones()}
            <View style={{height: 20}} />
          </View>
        </View>
      </Modal>
    );
  }
}

const ancho = Dimensions.get('window').width;
const alto = Dimensions.get('window').height;

const estilos = StyleSheet.create({
  back: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000070',
  },
  cont: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 10,
    height: 'auto',
    width: ancho * 0.8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  borde: {
    height: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#0984E3',
    justifyContent: 'center',
    alignItems: 'center',
    width: ancho * 0.8,
    flexDirection: 'row',
  },
  barra: {
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'black',
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: ancho * 0.8,
    height: alto * 0.08,
  },
  cuerpo: {
    alignItems: 'center',
    width: ancho * 0.8,
    justifyContent: 'center',
    marginVertical: 15,
  },
  boton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 40,
    alignSelf: 'center',
    marginBottom: 5,
    width: ancho * 0.28,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 2,
  },
  item: {
    width: ancho * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
  },
});
