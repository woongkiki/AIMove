import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';

const {width, height} = Dimensions.get("window");

const PolicyPrivacy = (props) => {

    const { navigation } = props;

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="개인정보처리방침" navigation={navigation} />
            <Box px='25px' py='20px'>
                <DefText text={'개인정보처리방침을 입력하세요.'} />
            </Box>
        </Box>
    );
};

export default PolicyPrivacy;