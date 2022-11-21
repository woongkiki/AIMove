import React from 'react';
import { TouchableOpacity, Image, Dimensions, StyleSheet, Platform, Linking } from 'react-native';
import { Box, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { fweight } from '../common/StyleCommon';

const {width} = Dimensions.get('window');

const headerHeight = 55;

const ChatHeader = (props) => {

    const {navigation, headerTitle, phoneNumbers, phone} = props;

    const call = () => {
        let phoneNumber = '';
        if (Platform.OS === 'ios') phoneNumber = `telprompt:${phoneNumbers}`;
        else                       phoneNumber = `tel:${phoneNumbers}`;
        Linking.openURL(phoneNumber);
    }

    return (
        <Box px='25px' height={headerHeight} backgroundColor='#fff'>
            <Box position={'absolute'} width={width} height={headerHeight} alignItems={'center'} justifyContent='center'>
                <DefText text={headerTitle} style={[styles.headerText]} />
            </Box>
            <HStack alignItems={'center'} height={headerHeight} justifyContent='space-between'>
                <TouchableOpacity onPress={ ()=>navigation.goBack()} style={[styles.backButton]}>
                    <Image source={require('../images/headerBack.png')} alt='뒤로가기' style={{width:28, height:16, resizeMode:'contain'}} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={
                        phone == '시스템' ?
                        ()=>navigation.navigate("ServiceQaList", {"m_type":"de"})
                        :
                        ()=>call(phoneNumbers)
                    }
                >
                    {
                        phone == '시스템' ?
                        <Image
                            source={require("../images/qa_neww.png")}
                            alt="전화걸기"
                            style={{
                                width:23,
                                height:23,
                                resizeMode:'contain'
                            }}
                        />
                        :
                        <Image
                            source={require("../images/chatPhoneIcon.png")}
                            alt="전화걸기"
                            style={{
                                width:23,
                                height:23,
                                resizeMode:'contain'
                            }}
                        />
                    }
                    
                </TouchableOpacity>
            </HStack>
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

export default ChatHeader;