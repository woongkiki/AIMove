import React from 'react';
import { TouchableOpacity, Image, Dimensions, StyleSheet, Platform } from 'react-native';
import { Box, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { fweight } from '../common/StyleCommon';

const {width} = Dimensions.get('window');

const headerHeight = 55;

const HeaderHome = (props) => {

    const {navigation} = props;

    return (
        <Box py='10px' px='25px' backgroundColor={'#0195ff'} justifyContent='center' alignItems={'center'}>
            <Image 
                source={require("../images/headLogoW2.png")} 
                style={{
                    width:90,
                    height:90 / 2.7,
                    resizeMode:'contain'
                }}
            />
        </Box>
    );
};

export default HeaderHome;