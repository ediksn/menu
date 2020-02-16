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
import { url } from '../components/Api';
export default class Oferta extends React.Component {
  render() {
    if(!this.props.oferta) return null
    return (
      <Modal visible={this.props.visible} transparent={true}>
        <View style={estilos.back}>
          <View style={estilos.cont}>
            <View style={estilos.barra}>
                <TouchableHighlight onPress={() => this.props.cerrarOfer(false)}>
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
                <Icon name="pricetags" style={{color: 'white'}} />
                <Text
                  style={{color: 'white', marginLeft: 5, fontWeight: 'bold'}}>
                  Oferta
                </Text>
              </View>
            </View>
            <View style={estilos.cuerpo}>
              <View style={estilos.item}>
                <Image
                    source={{ uri : this.props.oferta.image[0] ? url + this.props.oferta.image[0].url : url}}
                    style={{
                        width:ancho*0.7,
                        height:alto*0.3
                    }}
                />
                <Text 
                    numberOfLines={10}
                    style={{
                        textAlign: 'center', 
                        fontSize: 16,
                    }}>
                    {this.props.oferta.description}
                </Text>
                <Text 
                  onPress={() =>{
                    this.props.navigation.navigate('Restaurant', {
                      profile: this.props.oferta.profileId,
                    })
                    this.props.cerrarOfer(false)
                  }}
                  numberOfLines={10}
                  style={estilos.boton}>
                  Ir al Restaurante
                </Text>
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
    textAlign: 'center', 
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'black',
    borderRadius: 10,
    color: 'white',
    width: 150,
    height: 30,
    textAlignVertical: 'center',
    marginTop: 10
  },
  item: {
    width: ancho * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
  },
});
