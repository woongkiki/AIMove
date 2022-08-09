import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Image, StyleSheet, Platform, Dimensions, ScrollView, Button } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefInput, DefButton } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';

const {width, height} = Dimensions.get("window");

const Intro = (props) => {

    const {navigation} = props;

    setTimeout(() => {

        navigation.replace('Login');
   
    }, 2500);

    return (
        <Box flex={1} backgroundColor='#0195FF' alignItems={'center'} justifyContent='center'>
            <Image 
                source={require("../images/introLogo.png")}
                alt="내집이사"
                style={{
                    width: width * 0.35,
                    height: (width * 0.35) * 1.24,
                    resizeMode:'contain'
                }}
            />
            <Box style={[styles.introBox]} mt='30px'>
                <HStack alignItems={'center'}>
                    <Box style={[styles.introNumBox]}>
                        <DefText text="2" style={[styles.introNumBoxText]} />
                    </Box>
                    <Box style={[styles.introNumBox]}>
                        <DefText text="1" style={[styles.introNumBoxText]} />
                    </Box>
                    <Box style={[styles.introNumBox]}>
                        <DefText text="9" style={[styles.introNumBoxText]} />
                    </Box>
                    <Box style={[styles.introNumBox]}>
                        <DefText text="1" style={[styles.introNumBoxText]} />
                    </Box>
                    <DefText text="명" style={[styles.introNumBoxText2]} />
                </HStack>
                <HStack mt='15px'>
                    <DefText text="내집이사" style={[styles.introText, fweight.b, {color:'#0195FF'}]} />
                    <DefText text="를 통해 견적 중" style={[styles.introText]} />
                </HStack>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    introBox: {
        paddingVertical:10,
        width:width-50,
        borderRadius:30,
        backgroundColor:'#F2F7F8',
        justifyContent:'center',
        alignItems:'center'
    },
    introNumBox: {
        width:38,
        height: 38,
        backgroundColor:'#fff',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        marginRight:5
    },
    introNumBoxText: {
        ...fsize.fs22,
        ...fweight.b,
        lineHeight:40,
        color:'#0195FF'
    },
    introNumBoxText2: {
        ...fsize.fs20,
        ...fweight.m,
        marginLeft:5
    },
    introText: {
        ...fsize.fs22,
    }
})

export default Intro;