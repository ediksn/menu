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
export default class Horarios extends React.Component {
  render() {
    if(!this.props.horario) return null
    return (
      <Modal visible={this.props.visible} transparent={true}>
        <View style={estilos.back}>
          <View style={estilos.cont}>
            <View style={estilos.barra}>
                <TouchableHighlight onPress={() => this.props.cerrarHora(false)}>
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
                <Icon name="calendar" style={{color: 'white'}} />
                <Text
                  style={{color: 'white', marginLeft: 5, fontWeight: 'bold'}}>
                  Horarios
                </Text>
              </View>
            </View>
            <View style={estilos.cuerpo}>
              <View style={estilos.item}>
                <Text style={{fontWeight: 'bold'}}>Día               Abre         Cierra</Text>
                {
                    this.props.horario.map((el,i)=>{
                        return (
                            <View
                                key ={'i'+i}
                                style={{
                                    flexDirection:'row', 
                                    width: ancho*0.6,
                                    justifyContent: 'space-between'
                                }}>
                                <Text
                                    style={{
                                        textAlign: 'center', 
                                        fontSize: 16,
                                        marginVertical: 10
                                    }}>
                                    {el.day}
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    width: 140,
                                    justifyContent: 'space-around'
                                }}>
                                    <Text
                                        style={{
                                            textAlign: 'center', 
                                            fontSize: 16,
                                            marginVertical: 10
                                        }}>
                                        {el.open}
                                    </Text>
                                    <Text
                                        style={{
                                            textAlign: 'center', 
                                            fontSize: 16,
                                            marginVertical: 10
                                        }}>
                                        {el.close}
                                    </Text>
                                </View>
                            </View>
                        )
                    })
                }
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
});
