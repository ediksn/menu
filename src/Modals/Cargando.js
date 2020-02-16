import React from 'react'
import {View,Dimensions, StyleSheet, Modal} from 'react-native'
import {Spinner} from 'native-base'
export default class Cargando extends React.Component{
    render(){
        return(
            <Modal
                visible={this.props.visible}
                transparent={true}
            >
                <View style={estilos.back}>
                    <View style={estilos.cont}>
                        <Spinner color={'gray'} style={{width:40,height:40}}/>
                    </View>
                </View>
            </Modal>
        )
    }
}

const ancho = Dimensions.get('window').width
const alto = Dimensions.get('window').height

const estilos = StyleSheet.create({
    back:{
        flex:1,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#d2caca33'
    },
    cont:{
        flexDirection: 'column',
        backgroundColor:'#d2caca33',
        height:alto,
        width:ancho,
        alignItems:'center',
        justifyContent:'center'
    },
})