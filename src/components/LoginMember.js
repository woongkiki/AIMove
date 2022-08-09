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

const {width, height} = Dimensions.get("window");

//네이버로그인키
const iosKeys = {
    kConsumerKey: "4YKmeUz6rczTSC5dvctZ",
    kConsumerSecret: "uWza0TRPQn",
    kServiceAppName: "내집이사",
    kServiceAppUrlScheme: "naverLogin" // only for iOS
}

const androidKeys = {
    kConsumerKey: "4YKmeUz6rczTSC5dvctZ",
    kConsumerSecret: "uWza0TRPQn",
    kServiceAppName: "내집이사"
};

const initials = Platform.OS === "ios" ? iosKeys : androidKeys;

let t1;
let tcounter;
let temp;

const LoginMember = (props) => {

    const {navigation, member_login, member_info} = props;

    
    const [phoneNumber, setPhoneNumber] = useState(""); //휴대폰번호
    const [certiNumber, setCertiNumber] = useState(""); //인증번호
    const [naverToken, setNaverToken] = useState("");
    
    const [timeStamp, setTimeStamp] = useState("");
    const [phoneInterval, setPhoneInterval] = useState(false);
    const [certiText, setCertiText] = useState("");

    //이사전문가용
    const [expertName, setExpertName] = useState("");

    const expertNameChange = (text) => {
        setExpertName(text);
    }

    const timer_start = () => {
        tcounter = 30;
        t1 = setInterval(Timer, 1000);
        //Timer();
    }

    const Timer = () => {
        
        tcounter = tcounter - 1;

        temp = Math.floor(tcounter/60);

        if(Math.floor(tcounter/60) < 10) { 
            temp = '0'+temp;								
        }

        temp = temp + ":";

        if((tcounter % 60) < 10){ 
            temp = temp + '0';
        }

        temp = temp + (tcounter % 60);

        console.log("temp:::", temp);
        console.log("tcounter::", tcounter % 60);
        setTimeStamp(temp);

        if (tcounter <= 0) {
            //timer_stop();
            setPhoneInterval(false);
        }

    }

    const timer_stop = () => {
        // setPhoneInterval(true);
        //console.log(phoneIntervel);
        //console.log(t1);
        clearInterval(t1);
        setTimeStamp('');
       
    };

    useEffect(()=>{
        if(!phoneInterval) {timer_stop()}
        else                {timer_start()}
    },[phoneInterval]);

    const sendCertiNumber = () => {
        setPhoneInterval(true)
    }
    

    //인증하기
    const certiNumberCheck = async () => {
        if(!phoneInterval){
            ToastMessage("인증시간이 만료되었습니다\n인증번호를 다시 발송하세요.");
            return false;
        }
        if(!certiNumber){
            ToastMessage("인증번호를 입력하세요.");
            return false;
        }

        if(certiNumber != "111111"){
            ToastMessage("인증번호가 일치하지 않습니다.");
            return false;
        }

        setPhoneInterval(false);
        ToastMessage("휴대폰 번호 인증이 완료되었습니다.");
        // navigation.replace('TabNav', {
        //     screen: 'Home',
        // });


        const formData = new FormData();
        formData.append("phone", phoneNumber);
        formData.append("method", "member_login");

        const login = await member_login(formData);

        if(login.state){
            const info = await member_info(formData);
            //console.log("info::::", info);
            ToastMessage(info.msg);
            navigation.replace("TabNav", {
                screen: "Home"
            })
        }else{
            ToastMessage(login.msg)
        }
        

    }

    //휴대폰번호 입력
    const phoneNumberChange = (num) => {
        setPhoneNumber(phoneFormat(num));
    }

    //인증번호 입력
    const certiNumberChange = (num) => {
        setCertiNumber(num);
    }

    //카카오로그인
    const signInWithKakao = async () => {
        try{
            const token = await login();
            if(token.scopes != undefined){
                const profile = await getKakaoProfile();
    
                const params = {
                    snskey: profile.id,
                    email: profile.email,
                    sns: 'kakao'
                }
    
                //console.log('params::::', params);
                snsLoginHandler(params);
            }
        } catch(error){
           // console.log('카카오 로그인 실패 error', error);
            ToastMessage("로그인을 취소하셨습니다.")
        }
    }

    //구글로그인
    const _signIn = async () => {
        try{
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            //console.log('구글 계정정보',userInfo);
            const authStatus = await messaging().requestPermission();
            const enabled = 
                authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            const params = {
                snskey: userInfo.user.id,
                email: userInfo.user.email,
                sns: 'google'
            }

            //console.log('구글 로그인 params:::', params);
            snsLoginHandler(params);

        }catch(error){
            console.log('구글로그인 오류::::', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // 12501
                ToastMessage("구글 로그인을 취소하셨습니다.");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                ToastMessage("구글 로그인을 진행중입니다.");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                ToastMessage("구글플레이 서비스 이용불가 계정입니다. 구글에 문의 바랍니다.",);
            } else {
                ToastMessage("구글로그인 오류입니다. 잠시후 다시 시도 해주세요.");
            }
        }
    }
    

    //네이버로그인..
    const naverLogin = props => {
        return new Promise((resolve, reject) => {
          NaverLogin.login(props, (err, token) => {
            //console.log(`\n\n  Token is fetched  :: ${token} \n\n`);
            setNaverToken(token);
            if (err) {
                console.log("naver err", err);
              reject(err);
              return;
            }
            //console.log("resolve", token);
            resolve(token);
          });
        });
      };

    //네이버로그인 정보
    const getUserProfile = async () => {
        const profileResult = await getNaverProfile(naverToken.accessToken);
        if(profileResult.resultcode === "024"){
            ToastMessage("로그인이 실패하였습니다.");
            return false;
        }
        console.log("profileResult::::", profileResult.response.id);

        
        const params = {
            snskey: profileResult.response.id,
            email: profileResult.response.email,
            sns: 'naver'
        }
        //console.log("params",params);
        snsLoginHandler(params);

    }


    const onAppleButtonPress = async () => {
        console.log("애플로그인...")
    }


    const snsLoginHandler = async (argData) => {
       

        const formData = new FormData();
        formData.append("email", argData.email);
        formData.append("sns", argData.sns);
        formData.append("snskey", argData.snskey);
        formData.append("method", "member_login");

        const login = await member_login(formData);

       
        if(login.state){
            const info = await member_info(formData);
            console.log("sns 로그인 info:::::", info);
            ToastMessage(info.msg);
            navigation.replace("TabNav", {
                screen: "Home"
            })
        }
        //if(login.state){

    }


    useEffect(()=> {
        GoogleSignin.configure({
            webClientId: "1010442184943-4qcbsdj1tguc471qr8semci8r6t4opr1.apps.googleusercontent.com",
            offlineAccess: true,
            hostedDomain: "",
            forceConsentPrompt: true,
        })

        if(naverToken != ""){
            //console.log("naverToken:::", naverToken);
            getUserProfile();
        }

        return()=>{
            setNaverToken("");
            timer_stop();
        }

    }, [naverToken]);


    return (
        <Box>
            <VStack mt='20px'>
                <Box>
                    <DefText text="휴대폰 번호 로그인" style={[styles.loginLabel]} />
                    <DefInput
                        placeholder={"휴대폰 번호를 입력하세요 (-를 빼고 입력)"}
                        value={phoneNumber}
                        onChangeText={phoneNumberChange}
                        keyboardType={'number-pad'}
                        maxLengthInput={13}
                    />
                    {
                        phoneNumber.length == 13 &&
                        <Box position={'absolute'} right='0' bottom='0' height='50px' justifyContent={'center'}>
                            <TouchableOpacity onPress={sendCertiNumber}>
                                <DefText text="인증번호발송" style={[styles.certiNumberSend]} />
                            </TouchableOpacity>
                        </Box>
                    }
                </Box>
                <Box mt='30px'>
                    <DefText text="인증번호 입력" style={[styles.loginLabel]} />
                    <DefInput 
                        placeholder={"인증번호를 입력하세요"}
                        value={certiNumber}
                        onChangeText={certiNumberChange}
                        keyboardType='number-pad'
                        maxLengthInput={6}
                    />
                    <Box position={'absolute'} right='0' bottom='0' height='50px' justifyContent={'center'} px='20px'>
                        <DefText text={timeStamp} style={{color:'#666'}} />
                    </Box>
                </Box>
                <DefButton
                    disabled={ phoneInterval ? false : true }
                    text="인증하기"
                    btnStyle={[styles.certiConfirmBtn, phoneInterval ? [colorSelect.sky] : [colorSelect.gray]]}
                    textStyle={[styles.certiConfirmText, phoneInterval ? {color:'#fff'} : {color:'#000'}]}
                    //onPress={HomeNavigate}
                    onPress={certiNumberCheck}
                />
            </VStack>
            <VStack mt='30px'>
                <Box >
                    <GoogleSigninButton 
                        style={{
                            width:width - 40,
                            height:48,
                            marginLeft:-5,
                        }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.White}
                        
                        onPress={()=>_signIn()}
                    />
                </Box>
                <Box mt='5px' shadow={3} backgroundColor="#fff" borderRadius={10}>
                    <TouchableOpacity onPress={signInWithKakao} style={[styles.kakaoLoginButton]}>
                        <Box width={width-50} height='44px' justifyContent='center' alignItems={'center'} position='absolute' left='0'>
                            <DefText text="카카오톡으로 로그인" style={[styles.kakaoLoginButtonText]} />
                        </Box>
                        <Box width='44px' height='44px' justifyContent={'center'} alignItems='center'>
                            <Image 
                                source={require("../images/kakaoIcon.png")} 
                                alt="카카오톡으로 로그인"
                                style={[{
                                    width:18,
                                    height:17,
                                    resizeMode:'contain'
                                }]}
                            />
                        </Box>
                    </TouchableOpacity>
                </Box>
                
                <Box mt='10px' shadow={3} backgroundColor="#fff" borderRadius={10}>
                    <TouchableOpacity onPress={()=>naverLogin(initials)} style={[styles.kakaoLoginButton, {backgroundColor:'#03C75A'}]}>
                        <Box width={width-50} height='44px' justifyContent='center' alignItems={'center'} position='absolute' left='0'>
                            <DefText text="네이버로 로그인" style={[styles.kakaoLoginButtonText, {color:'#fff'}]} />
                        </Box>
                        <Box width='44px' height='44px' justifyContent={'center'} alignItems='center'>
                            <Image 
                                source={require("../images/naverLoginLogo.png")} 
                                alt="네이버 로그인"
                                style={[{
                                    width:18,
                                    height:18,
                                    resizeMode:'contain'
                                }]}
                            />
                        </Box>
                    </TouchableOpacity>
                </Box>
                {
                    Platform.OS === 'ios' && 
                    <Box mt='10px' shadow={3} backgroundColor="#fff" borderRadius={10}>
                        <AppleButton
                            buttonStyle={AppleButton.Style.WHITE}
                            buttonType={AppleButton.Type.SIGN_IN}
                            style={{
                            width: width - 50, // You must specify a width
                            height: 44, // You must specify a height
                            }}
                            onPress={() => onAppleButtonPress()}
                        />
                    </Box>
                }
                
            </VStack>
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
)(LoginMember);