import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack, Select, Modal } from 'native-base';
import { BottomNextButton, DefButton, DefText } from '../common/BOOTSTRAP';
import { fsize, fweight } from '../common/StyleCommon';
import { numberFormat } from '../common/DataFunction';
import SubHeader from '../components/SubHeader';
import { BASE_URL } from '../Utils/APIConstant';

const {width, height} = Dimensions.get("window");

const ReviewScreen2 = (props) => {

    const {navigation} = props;


    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle='후기 작성' navigation={navigation} />
        </Box>
    );
};

export default ReviewScreen2;