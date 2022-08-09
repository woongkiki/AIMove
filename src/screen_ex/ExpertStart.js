import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Image, StyleSheet, Platform, Dimensions, ScrollView, Button } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefInput, DefButton } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import { phoneFormat } from '../common/DataFunction';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const {width, height} = Dimensions.get("window");

const ExpertStart = (props) => {


    const {navigation, userInfo} = props;

    console.log("userInfo:::", userInfo);

    const move = () => {

        navigation.navigate("ExpertMoveStatus");
    }

    return (
        <Box flex={1} backgroundColor='#fff' justifyContent={'space-between'}>
             <Box>
            </Box>
             <Box px='25px' py='20px' backgroundColor={'#fff'} borderTopLeftRadius={20} borderTopRightRadius={20} shadow={9}>
                <DefText text="환영합니다! 홍길동 전문가님" style={[styles.titleText]} />
                <DefText text="간단하게 이사전문가 시작하기" style={[styles.titleText, {marginTop:20}]} />
                <DefText text={"내집이사 전문가가 되시면 내집이사에서\n모든과정을 도와드립니다.`"} style={[styles.contentText, {marginTop:10}]}/>
                <TouchableOpacity onPress={move} style={[styles.startButton]}>
                    <DefText text="시작하기" style={[styles.startButtonText]} />
                </TouchableOpacity>
             </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    titleText: {
        ...fsize.fs18,
        ...fweight.b
    },
    contentText: {
        ...fsize.fs14,
        color:'#aaa'
    },
    startButton: {
        width:width - 50,
        height:50,
        borderRadius:10,
        ...colorSelect.sky,
        alignItems:'center',
        justifyContent:'center',
        marginTop:30
    },
    startButtonText: {
        color:'#fff',
        ...fweight.m,
        
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(ExpertStart);