import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Image, StyleSheet, Platform, Dimensions, ScrollView, Button } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefInput, DefButton } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import { phoneFormat } from '../common/DataFunction';
import ToastMessage from '../components/ToastMessage';
import messaging from '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';

const {width, height} = Dimensions.get("window");

let t1;
let tcounter;
let temp;

const LoginExpert = (props) => {

    const {navigation, member_login, member_info} = props;

    const [phoneNumber, setPhoneNumber] = useState(""); //휴대폰번호
    const [certiNumber, setCertiNumber] = useState(""); //인증번호
    const [expertName, setExpertName] = useState("");

    const [timeStamp, setTimeStamp] = useState("");
    const [phoneInterval, setPhoneInterval] = useState(false);

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
 

    const sendCertiNumber = () => {
        setPhoneInterval(true)
    }

    //휴대폰번호 입력
    const phoneNumberChange = (num) => {
        setPhoneNumber(phoneFormat(num));
    }

    //인증번호 입력
    const certiNumberChange = (num) => {
        setCertiNumber(num);
    }

    const expertNameChange = (text) => {
        setExpertName(text);
    }

    useEffect(()=>{
        
        if(!phoneInterval) {timer_stop()}
        else                {timer_start()}
    },[phoneInterval]);


    const navigo = () => {
        navigation.navigate("ExpertStart");
        // navigation.navigate("TabNav", {
        //     screen: "Home"
        // })
    }

    const loginHandler = async () => {

        setPhoneInterval(false);


        const formData = new FormData();
        formData.append("ex_name", expertName);
        formData.append("phone", phoneNumber);
        formData.append("method", "expert_login");

        const login = await member_login(formData);

        if(login.state){
            //const info = await member_info(formData);
            console.log("login::::", login);
            if(login.result.register_status == "Y"){
                navigation.replace("ExpertStart");
            }else{
                navigation.replace("ExpertNavi", {
                    screen: "PlayMove"
                })
            }
            ToastMessage(login.msg);
   
        }else{
            ToastMessage(login.msg)
        }
        
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <VStack mt='20px'>
                <Box>
                    <DefText text="성명 (본명)" style={[styles.loginLabel]} />
                    <DefInput
                        placeholder={"정산금 입금 때문에 본명을 입력해 주세요."}
                        value={expertName}
                        onChangeText={expertNameChange}
                    />
                </Box>
                <Box mt='30px'>
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
                    onPress={loginHandler}
                    // onPress={certiNumberCheck}
                />
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
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(LoginExpert);