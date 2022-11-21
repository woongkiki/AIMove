import React from 'react';
import { StyleSheet, Dimensions} from 'react-native';
import Font from './Font';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
    p:{
        fontSize:14,
        //lineHeight:20,
        //fontFamily: Font.RobotoRegular,
        color: '#333',
        margin:0,
        padding:0,
        fontFamily:Font.SCoreDreamR,
    },
    span:{
        color:'#333'
    },
    img:{
        width:Dimensions.get('window').width
    }
})