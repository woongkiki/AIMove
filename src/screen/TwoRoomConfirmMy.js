import React, {useEffect, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ImagePicker from 'react-native-image-crop-picker';
import Api from '../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import { ActivityIndicator } from 'react-native-paper';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import Loading from '../components/Loading';
import TwoRoomImageSubmit from '../components/TwoRoomImageSubmit';

const {width, height} = Dimensions.get("window");

const TwoRoomConfirmMy = (props) => {

    const {navigation, route, userInfo} = props;
    const {params} = route;

    console.log(params);
    const [loading, setLoading] = useState(true);

    const twoRoomApi = async () => {
        await setLoading(true);
        await setLoading(false);
    }

    useEffect(()=> {
        twoRoomApi();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='가정집이사 방문견적요청 확인' />
            {
                loading ?
                <Loading />
                :
                <TwoRoomImageSubmit navigation={navigation} visitParam={params} />
            }
        </Box>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    })
)(TwoRoomConfirmMy);