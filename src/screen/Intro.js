import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Image, StyleSheet, Platform, Dimensions, ScrollView, Button } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefInput, DefButton } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import { numberFormat } from '../common/DataFunction';
import messaging from '@react-native-firebase/messaging';

const {width, height} = Dimensions.get("window");

const Intro = (props) => {

    const {navigation, member_info} = props;

    const [appNumber, setAppNumber] = useState([]);
   

    const numberApi = () => {
        Api.send('intro_number', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('앱 사용인원 가져오기: ', arrItems, resultItem);
               setAppNumber(arrItems);

            }else{
               console.log('앱 사용인원 출력 실패!', resultItem);
               
            }
        });
    }


    useEffect(()=> {
        numberApi();
        
        AsyncStorage.getItem('id').then(async (response) => {
           
            if(response == null){
                setTimeout(() => {

                    navigation.replace('Login');
                    
                }, 2500);
            }else{

                const token = await messaging().getToken();

                const formData = new FormData();
                formData.append('method', 'login_auto');
                formData.append('id', response);
                formData.append("app_token", token);

                AsyncStorage.getItem("mtype").then( async(mtype) => {
                    formData.append('mtype', mtype);

                    const member_info_list = await member_info(formData);


                    if(member_info_list.state){

                   

                        ToastMessage(member_info_list.msg);

                        if(mtype == "일반" || mtype == "SNS"){
                            setTimeout(() => {
                                navigation.replace("TabNav", {
                                    screen: "Home"
                                })
                            }, 2500)
                        }else{

                            console.log("member_info_list", member_info_list)

                            if(member_info_list.result.register_status == "Y"){
                                navigation.replace("ExpertStart", {"name":member_info_list.result.ex_name});
                            }else{
                                console.log("mtype", mtype);
                                setTimeout(() => {
                                    
                                    navigation.replace("ExpertNavi", {
                                        screen: "PlayMove",
                                        params:{
                                            moveCate : "소형 이사" ,
                                            homeCate: "",
                                        }
                                    })
                                }, 2500)
                            }

                           
                        }
                        

                    }else{

                        ToastMessage(member_info_list.msg);

                        setTimeout(() => {

                            navigation.replace('Login');
                            
                        }, 2500);
                    }
                })

            
                

            }
        });
    }, []);

    return (
        <Box flex={1} backgroundColor='#0195FF' alignItems={'center'} justifyContent='center'>
            <Image 
                source={require("../images/appIntroNew1021.png")}
                alt="내집이사"
                style={{
                    width: width,
                    height: height,
                    resizeMode:'stretch'
                }}
            />
            <Box height={height * 0.5} width={width}  position={'absolute'} top={0} alignItems='center' justifyContent={'center'}>
                <Image 
                    source={require("../images/appLogoNew1021.png")}
                    alt="내집이사"
                    style={{
                        width: width / 4,
                        height: (width / 4) * 1.33,
                        resizeMode:'contain'
                    }}
                />
                <Box px='20px' pt='11px' pb='4px' backgroundColor={'#fff'} borderRadius='7px' mt='80px'>
                    <DefText text={appNumber != "" ? numberFormat(parseInt(appNumber)) : "0"}  style={[fsize.fs32, fweight.m, {lineHeight:34, color:'#015790'}]} />
                </Box>
                <HStack mt='15px'>
                    <DefText text={"'AI가 식별'"} style={[fweight.b, fsize.fs20, {color:'#fff'}]} />
                    <DefText text={"한 이삿짐 개체수"} style={[fweight.m, fsize.fs20, {color:'#fff'}]} />
                </HStack>
            </Box>
            {/* <Box style={[styles.introBox]} mt='30px'>
                <HStack alignItems={'center'}>
                    {
                        appNumber != "" &&
                        appNumber.map((item, index) => {
                            return(
                                <Box key={index} style={[styles.introNumBox]}>
                                    <DefText text={item} style={[styles.introNumBoxText]} />
                                </Box>
                            )
                        })
                    }
                    <DefText text="명" style={[styles.introNumBoxText2]} />
                </HStack>
                <HStack mt='15px'>
                    <DefText text="내집이사" style={[styles.introText, fweight.b, {color:'#0195FF'}]} />
                    <DefText text="를 통해 견적 중" style={[styles.introText]} />
                </HStack>
            </Box> */}
        </Box>
    );
};

const styles = StyleSheet.create({
    introBox: {
        paddingVertical:10,
        width:width-50,
        borderRadius:30,
        backgroundColor:'#F2F7F8',
        justifyContent:'center',
        alignItems:'center'
    },
    introNumBox: {
        width:38,
        height: 38,
        backgroundColor:'#fff',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        marginRight:5
    },
    introNumBoxText: {
        ...fsize.fs22,
        ...fweight.b,
        lineHeight:40,
        color:'#0195FF'
    },
    introNumBoxText2: {
        ...fsize.fs20,
        ...fweight.m,
        marginLeft:5
    },
    introText: {
        ...fsize.fs22,
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
)(Intro);