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
import ImageCropPicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { api, url } from '../components/Api';
import store from '../redux/store';
import { setImagen } from '../redux/actions';
import Cargando from './Cargando';
import AsyncStorage from '@react-native-community/async-storage';
export default class Imagen extends React.Component {
  constructor(){
    super()
    this.state={
        img: store.getState().imagen.length > 1 ? {url:store.getState().imagen} : null,
        loading: false
    }
  }

  componentDidMount(){
    console.log(this.state.img)
  }

    saveImagen(){
        this.setState({loading:true})
        let createFormData = (foto) => {
            const data = new FormData()
            data.append('image',{
                name:'foto',
                uri:foto.uri,
                type:foto.mime
            })
            return data
        }
        fetch(api + '/client', {
            method:'PUT',
            headers:{
                Accept: 'application/json',
                'Content-Type':'multipart/form-data',
                'Authorization': 'Bearer '+store.getState().token.toString()
            },
            body: createFormData(this.state.img)
        })
        .then(res=>
            res.json()
                .then(resp=>{
                    if(resp.error || res.message){
                        this.setState({
                            loading:false,
                        })
                        this.props.cerrarImg(false)
                        this.props.cerrarInfo(true,resp.error)
                    }else{
                        this.setState({
                            loading:false,
                        })
                        store.dispatch(setImagen(resp.cliente.image))
                        AsyncStorage.setItem('imagen',resp.cliente.image)
                        .then(
                            ()=>{
                                setTimeout(()=>{
                                    this.props.cerrarImg(false)
                                    this.props.cerrarInfo(true,'¡Imagen guardada exitosamente!')
                                },2000)
                            },
                            err=>console.log(err)
                        )
                        .catch(error=>console.log(error))
                    }
                })
                .catch(err=>this.setState({loading:false},console.log(err)))
        )
        .catch(error=>this.setState({loading:false},console.log(error)))
    }

    pickSingleWithCamera() {
        ImageCropPicker.openCamera({
            waitAnimationEnd:true
        }).then(image => {
            this.setState({
                img:{ uri: image.path, width: image.width, height: image.height, mime: image.mime}
            });
        }).catch(e => alert(e));
    }

    chooseFile = () => {
        ImagePicker.openPicker({
            waitAnimationEnd:true,
        }).then(image => {
            this.setState({
                img:{ uri: image.path, width: image.width, height: image.height, mime: image.mime}
            })
        }).catch(error=>alert(error))
    };

    renderImage(){
        return(
            <Image
                style={estilos.img}
                source={this.replaceUri(this.state.img)}
            />
        )
    }   

    replaceUri(imagen){
        let img = imagen
        if(img && img.url){
            img.uri=url+img.url
        }
        return img
    }

  render() {
    return (
      <Modal visible={this.props.visible} transparent={true}>
        <Cargando visible={this.state.loading}/>
        <View style={estilos.back}>
          <View style={estilos.cont}>
            <View style={estilos.barra}>
              <TouchableHighlight onPress={() => this.props.cerrarImg(false)}>
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
                <Icon name="image" style={{color: 'white'}} />
                <Text
                  style={{color: 'white', marginLeft: 5, fontWeight: 'bold'}}>
                  Imágen de Perfil
                </Text>
              </View>
            </View>
            <View style={estilos.cuerpo}>
              {this.renderImage()}
            </View>
            <View
                style={{
                    width: ancho * 0.8,
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                }}>
                <Button
                    style={estilos.boton}
                    onPress={() => this.chooseFile()}>
                    <Text style={{textAlign: 'center', color: 'black'}}>seleccionar</Text>
                </Button>
                <Button
                    style={estilos.boton}
                    onPress={() => {
                        this.pickSingleWithCamera();
                    }}>
                    <Text style={{textAlign: 'center', color: 'black'}}>tomar foto</Text>
                </Button>
            </View>
            {
                this.state.img &&
                    <Button
                        style={[estilos.boton,{marginTop:5}]}
                        onPress={() => {
                            this.saveImagen();
                        }}>
                        <Text style={{textAlign: 'center', color: 'black'}}>guadar</Text>
                    </Button>
            }
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
    width: ancho * 0.38,
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
  img:{
    width: 300, 
    height: 200, 
    resizeMode: 'contain',
    marginVertical:10,
    borderRadius:200
  }
});
