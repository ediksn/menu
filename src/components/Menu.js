import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Icon} from 'native-base';

export default class Menu extends React.Component {
  render() {
    return (
      <View style={estilos.menu}>
        <Icon
          name="home"
          style={{fontSize: 35, fontWeight: 'bold'}}
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Icon
          name="star-outline"
          style={{fontSize: 35, fontWeight: 'bold'}}
          onPress={() => this.props.navigation.navigate('Favoritos')}
        />
        <Icon
          name="paper"
          style={{fontSize: 35, fontWeight: 'bold'}}
          onPress={() => this.props.navigation.navigate('Pedidos')}
        />
      </View>
    );
  }
}

const alto = Dimensions.get('window').height - 25;
const ancho = Dimensions.get('window').width;

const estilos = StyleSheet.create({
  menu: {
    width: ancho,
    height: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
