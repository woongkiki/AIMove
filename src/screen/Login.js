import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Image, StyleSheet, Platform, Dimensions, ScrollView, Button } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefInput, DefButton } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import { phoneFormat } from '../common/DataFunction';
import ToastMessage from '../components/ToastMessage';
import messaging from '@react-native-firebase/messaging';
import {
    KakaoOAuthToken,
    KakaoProfile,
    getProfile as getKakaoProfile,
    login,
    logout,
    unlink,
} from '@react-native-seoul/kakao-login';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import { NaverLogin, getProfile as getNaverProfile } from "@react-native-seoul/naver-login";
import { AppleButton } from '@invertase/react-native-apple-authentication';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import LoginMember from '../components/LoginMember';
import LoginExpert from '../components/LoginExpert';

const {width, height} = Dimensions.get("window");

const Login = (props) => {

    const {navigation, member_login, member_info} = props;

    const [loginType, setLoginType] = useState("일반");

    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                <Box px='25px' py='20px'>
                    <Box alignItems={'center'} mt='20px' mb='40px'>
                        <Image 
                            source={require("../images/loginLogo.png")}
                            alt="내집이사"
                            style={{
                                width: (width - 50) * 0.18,
                                height: ((width - 50) * 0.18) * 1.27,
                                resizeMode:'contain'
                            }}
                        />
                    </Box>
                    <HStack justifyContent={'space-between'}>
                        <DefButton 
                            text="일반회원"
                            btnStyle={[styles.loginTypeBtn, loginType == '일반' && [colorSelect.sky]]}
                            textStyle={[styles.loginTypeBtnText]}
                            onPress={()=>setLoginType("일반")}
                        />
                        <DefButton 
                            text="이사전문가"
                            btnStyle={[styles.loginTypeBtn, loginType == '전문가' && [colorSelect.sky]]}
                            textStyle={[styles.loginTypeBtnText]}
                            onPress={()=>setLoginType("전문가")}
                        />
                    </HStack>
                    {
                        loginType == '일반' ?
                        <LoginMember navigation={navigation} />
                        :
                        <LoginExpert navigation={navigation} />
                    }
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    loginTypeBtn: {
        width: (width-50) * 0.485,
        height: 30,
        borderRadius: 10,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#DFDFDF',
        paddingVertical:0,
    },
    loginTypeBtnText: {
        ...fweight.m,
        color:'#fff'
    },
    loginLabel: {
        ...fsize.fs15,
        ...fweight.b
    },
    certiNumberSend: {
        ...fsize.fs15,
        color: '#0195FF',
        ...fweight.m
    },
    certiConfirmBtn: {
        width: width - 50,
        height: 50,
        backgroundColor: '#DEDEDE',
        paddingVertical:0,
        marginTop:30
    },
    certiConfirmText: {
        ...fweight.m
    },
    kakaoLoginButton: {
        width:width-50,
        height:44,
        backgroundColor:'#FEE500',
        borderRadius:10,
        justifyContent:'center'
    },
    kakaoLoginButtonText: {
        ...fsize.fs15,
        ...fweight.m
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
)(Login);