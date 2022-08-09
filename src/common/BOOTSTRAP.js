import React from "react";
import { TouchableOpacity, TextInput, Platform, Dimensions, StyleSheet } from 'react-native';
import { Box, Text, Image, Input, HStack} from 'native-base';
import Font from "./Font";
import { colorSelect, fsize, fweight } from './StyleCommon';

const {width, height} = Dimensions.get('window');

//기본 텍스트 고정
export const DefText = ({text, style}) => {
    return (
        <Text style={[fsize.fs16, fweight.r, {color:'#222222'}, style]}>{text}</Text>
    )
}

//기본 버튼
export const DefButton = ({text, onPress, btnStyle, textStyle, disabled, activeOpacity}) => {
    return(
        <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.defButton, btnStyle]}>
            <DefText text={text} style={[{color:'#000'},textStyle]} />
        </TouchableOpacity>
    )
}

//기본 인풋
export const DefInput = ({placeholder, placeholderTextColor, value, onChangeText, inputHeight, inputStyle, multiline, textAlignVertical, onSubmitEditing, secureTextEntry, keyboardType, maxLengthInput}) => {
    return(
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={ !placeholderTextColor ? '#BEBEBE' : placeholderTextColor }
            value={value}
            onChangeText={onChangeText}
            height={ !inputHeight ? 50 : inputHeight}
            backgroundColor='#fff'
            style={[{borderBottomWidth:1, borderBottomColor:'#BEBEBE', paddingLeft:10, color:'#000'}, fweight.r, fsize.fs13, inputStyle]}
            multiline={ !multiline ? false : true }
            textAlignVertical={ !textAlignVertical ? 'center' : 'top' }
            onSubmitEditing={ onSubmitEditing }
            secureTextEntry={ secureTextEntry }
            keyboardType={ !keyboardType ? 'default' : keyboardType}
            maxLength={ maxLengthInput }
        />
    )
}


export const BottomButton = ({leftText, rightText, leftBtnStyle, rightBtnStyle, leftTxtStyle, rightTxtStyle, leftonPress, rightonPress, boxStyle, rightDisable, rightOpacity}) => {
    return(
        <HStack px='25px' pb='20px' justifyContent='space-between' alignItems={'center'} style={[boxStyle]}>
            <DefButton 
                text={leftText} 
                btnStyle={[{width:(width - 50) * 0.3}, {backgroundColor:'#7F7F7F'}, leftBtnStyle]} 
                textStyle={[{color:'#fff'}, leftTxtStyle]}
                onPress={leftonPress}
            />
            <DefButton 
                text={rightText} 
                btnStyle={[{width:(width - 50) * 0.67}, colorSelect.sky, rightBtnStyle]} 
                textStyle={[{color:'#fff'}, fweight.m,rightTxtStyle]} 
                onPress={rightonPress} 
                disabled={rightDisable}
            />
        </HStack>
    )
}

export const BottomNextButton = ({text, onPress, btnStyle, textStyle}) => {
    return(
        <Box px='25px' py='20px'>
            <TouchableOpacity onPress={onPress} style={[styles.nextButton, btnStyle]}>
                <DefText text={text} style={[ styles.nextButtonText, textStyle]} />
            </TouchableOpacity>
        </Box>
    )
}

const styles = StyleSheet.create({
    defButton:{
        width: width - 50,
        paddingVertical:15,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#000'
    },
    nextButton: {
        width:width - 50,
        height: 50,
        borderRadius:10,
        ...colorSelect.sky,
        alignItems:'center',
        justifyContent:'center'
    },
    nextButtonText: {
        ...fweight.m,
        color:'#fff'
    }
})