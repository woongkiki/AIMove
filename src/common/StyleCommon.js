import { Platform } from 'react-native';
import Font from './Font';

export const fsize = {
    fs12:{
        fontSize:12,
        lineHeight:15,
    },
    fs13:{
        fontSize:13,
        lineHeight:16,
    },
    fs14:{
        fontSize:14,
        lineHeight:17
    },
    fs15: {
        fontSize:15,
        lineHeight:18,
    },
    fs16:{
        fontSize:16,
        lineHeight:19
    },
    fs17:{
        fontSize:17,
        lineHeight:20
    },
    fs18:{
        fontSize:18,
        lineHeight:21
    },
    fs19:{
        fontSize:19,
        lineHeight:22
    },
    fs20:{
        fontSize:20,
        lineHeight:23
    },
    fs21:{
        fontSize:21,
        lineHeight:24
    },
    fs22:{
        fontSize:22,
        lineHeight:25
    },
    fs23:{
        fontSize:23,
        lineHeight:26
    },
    fs24:{
        fontSize:24,
        lineHeight:27
    },
    fs32: {
        fontSize:32,
        lineHeight:35
    }
}

export const fweight = {
    eb: {
        ...Platform.select({
            android:{
                fontFamily:Font.SCoreDreamEB
            },
            ios: {
                fontFamily:Font.SCoreDreamEB,
                fontWeight:'900'
            }
        })
    },
    b: {
        ...Platform.select({
            android: {
                fontFamily:Font.SCoreDreamB
            },
            ios: {
                fontFamily:Font.SCoreDreamB,
                fontWeight:'bold'
            }
        })
    },
    m: {
        ...Platform.select({
            android: {
                fontFamily:Font.SCoreDreamM
            },
            ios: {
                fontFamily:Font.SCoreDreamM,
                fontWeight:'500'
            }
        })
    },
    r: {
        fontFamily:Font.SCoreDreamR
    },
    l: {
        ...Platform.select({
            android: {
                fontFamily:Font.SCoreDreamL,
            },
            ios: {
                fontFamily:Font.SCoreDreamL,
                fontWeight:'300'
            }

        })
    }
}

export const colorSelect = {
    sky: {
        backgroundColor:'#0195FF'
    },
    black: {
        backgroundColor:'#000'
    },
    gray: {
        backgroundColor:'#DFDFDF'
    }
}