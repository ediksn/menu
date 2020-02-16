import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Modal,
  Image,
  TouchableHighlight,
} from 'react-native';
import {Icon, Text} from 'native-base';
import MapView, { Marker } from 'react-native-maps'
import { url } from '../components/Api';
export default class Sedes extends React.Component {
  render() {
    if(!this.props.locacion) return null
    return (
      <Modal visible={this.props.visible} transparent={true}>
        <View style={estilos.back}>
          <View style={estilos.cont}>
            <View style={estilos.barra}>
                <TouchableHighlight onPress={() => this.props.cerrarMapa(false)}>
                    <Icon
                        name="close"
                        style={{color: 'white', marginLeft: 8, fontSize: 35}}
                    />
                </TouchableHighlight>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent:'center',
                  marginLeft:-30,
                  width:'100%'
                }}>
                <Icon name="map" style={{color: 'white'}} />
                <Text
                  style={{color: 'white', marginLeft: 5, fontWeight: 'bold'}}>
                  Locaciones
                </Text>
              </View>
            </View>
            <View style={estilos.cuerpo}>
              <View style={[estilos.item,{height: alto*0.6}]}>
                <MapView
                    style={estilos.mapa}
                    initialRegion={{
                        latitude: this.props.locacion.latitude,
                        longitude: this.props.locacion.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker
                        coordinate={this.props.locacion}
                    />
                </MapView>
              </View>
            </View>
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
  mapa: {
    height: alto*0.6,
    width:ancho*0.7,
    flex: 1,
    position: 'absolute'
  }
});
