import React from 'react';
import { TouchableOpacity, Image, Dimensions, StyleSheet, Platform } from 'react-native';
import { Box, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { fweight } from '../common/StyleCommon';

const {width} = Dimensions.get('window');

const headerHeight = 55;

const SubHeader = (props) => {

    const {navigation, headerTitle} = props;

    return (
        <Box px='25px' height={headerHeight} backgroundColor='#fff'>
            <Box position={'absolute'} width={width} height={headerHeight} alignItems={'center'} justifyContent='center'>
                <DefText text={headerTitle} style={[styles.headerText]} />
            </Box>
            <TouchableOpacity onPress={ ()=>navigation.goBack()} style={[styles.backButton]}>
                <Image source={require('../images/headerBack.png')} alt='뒤로가기' style={{width:28, height:16, resizeMode:'contain'}} />
            </TouchableOpacity>
        </Box>
    );
};

const styles = StyleSheet.create({
    headerText:{
        ...fweight.m
    },  
    backButton: {
        width: headerHeight,
        height: headerHeight,
        
        justifyContent:'center',
        
    }
})

export default SubHeader;