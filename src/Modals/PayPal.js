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
import {WebView} from 'react-native-webview'
import { api } from '../components/Api';
export default class PayPal extends React.Component {
  constructor() {
    super();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.visible !== prevProps.visible && this.props.visible) {
      this.setState({orden: store.getState().orden});
      alert('esto')
    }
  }

  ordenar() {
    if (
      !this.state.orden ||
      this.state.orden === '' ||
      (this.state.orden&&this.state.order.restaurant._id !== this.props.orden.restaurant._id)
    ) {
      this.setState({
        orden: {
          restaurant:this.state.profile,
          products:[this.state.producto],
          total:this.state.producto.price
        },
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
            this.state.producto,
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
            <Icon name='close-circle-outline' style={{alignSelf:'flex-start'}}/>
            <WebView
                source={{
                    uri:api+'/checkout/paypal',
                    method:'POST',
                    body:JSON.stringify({

                    })
                }}
                style={{height:alto*0.9, width:ancho}}
            />
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
});
