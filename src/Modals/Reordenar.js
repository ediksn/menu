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
import store from '../redux/store';
import AsyncStorage from '@react-native-community/async-storage';
import {setOrden} from '../redux/actions';
export default class Reordenar extends React.Component {
  constructor() {
    super();
    this.state = {
      orden: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.visible !== prevProps.visible && this.props.visible) {
      this.setState({orden: store.getState().orden});
    }
  }

  ordenar() {
    if (
      !this.state.orden ||
      this.state.orden === '' ||
      (this.state.orden&&this.state.orden.restaurant._id !== this.props.orden.restaurant._id)
    ) {
      this.setState({
        orden: this.props.orden,
      });
      AsyncStorage.setItem('orden', JSON.stringify(this.state.orden))
        .then(() => {
          store.dispatch(setOrden(JSON.stringify(this.state.orden)));
          this.props.navigation.navigate('Carrito');
        })
        .catch(error => alert(error));
    } else {
      let total 
      this.state.orden.products.forEach(el => {
        total=+el.price
      });
      this.setState(prevState => ({
        orden: {
          ...prevState.orden,
          products: [
            ...prevState.orden.products,
          ],
          total:total
        },
      }));
      AsyncStorage.setItem('orden', JSON.stringify(this.state.orden))
        .then(() => {
          store.dispatch(setOrden(JSON.stringify(this.state.orden)));
          this.props.navigation.navigate('Carrito');
        })
        .catch(error => alert(error));
      }
  }

  render() {
    if (!this.props.orden) {
      return null;
    } else {
      return (
        <Modal visible={this.props.visible} transparent={true}>
          <View style={estilos.back}>
            <View style={estilos.cont}>
              <View style={estilos.barra}>
                <Icon
                  name="close-circle-outline"
                  style={{color: 'black', marginRight: 10, fontSize: 35}}
                  onPress={() => this.props.cerrarOrden(false)}
                />
              </View>
              <View style={estilos.cuerpo}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    marginVertical: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Factura
                </Text>
                {this.props.orden &&
                  this.props.orden.products.map((el, i) => {
                    return (
                      <View key={'i' + i} style={estilos.item}>
                        <Text>{el.name}</Text>
                        <Text>RD${el.price}</Text>
                      </View>
                    );
                  })}
              </View>
              <View
                style={[
                  estilos.item,
                  {borderColor: 'white', justifyContent: 'space-between'},
                ]}>
                <Text style={{fontWeight: 'bold'}}>Total</Text>
                <Text style={{fontWeight: 'bold'}}>
                  RD${this.props.orden.total}
                </Text>
              </View>
              <Text
                onPress={() => {
                  this.ordenar();
                  this.props.cerrarOrden(false);
                }}
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  fontWeight: 'bold',
                  width: ancho * 0.5,
                  height: 45,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 30,
                }}>
                Reordenar
              </Text>
            </View>
          </View>
        </Modal>
      );
    }
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
    height: alto * 0.75,
    width: ancho * 0.9,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: ancho * 0.8,
    height: alto * 0.07,
  },
  cuerpo: {
    alignItems: 'center',
    width: ancho * 0.8,
    justifyContent: 'flex-start',
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
    width: ancho * 0.8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',
  },
});
