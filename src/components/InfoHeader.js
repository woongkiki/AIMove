import React from 'react';
import { TouchableOpacity, Image, Dimensions, StyleSheet, Platform } from 'react-native';
import { Box, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { fweight } from '../common/StyleCommon';

const {width} = Dimensions.get('window');

const headerHeight = 55;

const InfoHeader = (props) => {

    const {navigation, headPosition} = props;

    let headPositionNum = headPosition / 300;
    if(headPositionNum>1){
        headPositionNum = 1;
    }

    let headBg = 'rgba(255,255,255,'+headPositionNum+')';

    return (
        <Box position={'absolute'} width={width} height="55px" top='0' left='0' px='25px' justifyContent={'center'} backgroundColor={headBg} zIndex='99'>
            <HStack>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Image
                    source={require("../images/expertViewBackIcon.png")}
                    alt="뒤로가기"
                    style={{
                        width:23,
                        height:23
                    }}
                />
            </TouchableOpacity>
            </HStack>
        </Box>
    );
};

export default InfoHeader;