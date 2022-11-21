import React, {useEffect, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, View } from 'react-native';
import { Box, VStack, HStack } from 'native-base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { fsize, fweight } from '../common/StyleCommon';
import ExpertMessage from './ExpertMessage';
import ExpertService from './ExpertService';
import ExpertExperience from './ExpertExperience';
import ExpertSetting from './ExpertSetting';
import PlayMove from './PlayMove';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const Tab = createBottomTabNavigator();

const {width, height} = Dimensions.get("window");
const tabBarWidth = width / 5;

function CustomTabBar(props){

    const {state, navigation, chatInfo} = props;

    console.log("chatInfo TabBar:::", chatInfo);

    const screenName = state.routes[state.index].name; //tabbar 현재 스크린명

    //tabbar 스크린 이동..
    const HomeNavigate = () => {
        navigation.navigate("ExpertNavi", {
            screen: "PlayMove",
            params:{
                moveCate : "소형 이사" ,
                homeCate: "",
            }
        })
    }

    const ReservationNavigate = () => {
        navigation.navigate('ExpertNavi', {
            screen: 'ExpertMessage',
        });
    }

    const ChatingNavigate = () => {
        navigation.navigate('ExpertNavi', {
            screen: 'ExpertService',
        });
    }

    const ExpertNavigate = () => {
        navigation.navigate('ExpertNavi', {
            screen: 'ExpertExperience',
        });
    }

    const MypageNavigate = () => {
        navigation.navigate('ExpertNavi', {
            screen: 'ExpertSetting',
        });
    }

    return(
        <View style={[styles.TabBarMainContainer]}>
            <HStack shadow={9} backgroundColor='#fff' borderTopLeftRadius={24} borderTopRightRadius={24}>
                <TouchableOpacity 
                    activeOpacity={0.8}
                    style={[styles.button, {borderTopLeftRadius:24}]}
                    onPress={HomeNavigate}
                >
                    {
                        screenName == 'PlayMove' ?
                        <>
                            <Image
                                source={require('../images/exNaviIconOn01.png')}
                                alt='홈'
                                style={[{
                                    width:32,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='참여' style={[styles.tabButtonText, styles.tabButtonTextOn]} />
                        </>
                        :
                        <>
                            <Image
                                source={require('../images/exNaviIconOff01.png')}
                                alt='홈'
                                style={[{
                                    width:32,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='참여' style={[styles.tabButtonText]} />
                        </>
                    }
                    
                </TouchableOpacity>
                <TouchableOpacity 
                    activeOpacity={0.8} 
                    style={[styles.button]}
                    onPress={ReservationNavigate}
                >
                    {
                        screenName == 'ExpertMessage' ?
                        <>
                            <Image
                                source={require('../images/exNaviIconOn02.png')}
                                alt='예약'
                                style={[{
                                    width:21,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='메시지' style={[styles.tabButtonText, styles.tabButtonTextOn]} />
                        </>
                        :
                        <>
                            <Image
                                source={require('../images/exNaviIconOff02.png')}
                                alt='예약'
                                style={[{
                                    width:21,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='메시지' style={[styles.tabButtonText]} />
                        </>
                    }
                     {
                        chatInfo > 0 &&
                        <Box
                            width='25px'
                            height='25px'
                            borderRadius='20px'
                            backgroundColor={'#f00'}
                            alignItems='center'
                            justifyContent={'center'}
                            position='absolute'
                            top='5px'
                            right='14px'
                        >
                            <DefText text={chatInfo} style={{color:'#fff', fontSize:12, lineHeight:20}} />
                        </Box>
                    }
                    
                </TouchableOpacity>
                <TouchableOpacity 
                    activeOpacity={0.8} 
                    style={[styles.button]}
                    onPress={ChatingNavigate}
                >
                    {
                        screenName == 'ExpertService' ?
                        <>
                            <Image
                                source={require('../images/exNaviIconOn03.png')}
                                alt='메세지'
                                style={[{
                                    width:21,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='내 서비스' style={[styles.tabButtonText, styles.tabButtonTextOn]} />
                        </>
                        :
                        <>
                            <Image
                                source={require('../images/exNaviIconOff03.png')}
                                alt='메세지'
                                style={[{
                                    width:21,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='내 서비스' style={[styles.tabButtonText]} />
                        </>
                    }
                    
                </TouchableOpacity>
                <TouchableOpacity 
                    activeOpacity={0.8} 
                    style={[styles.button]}
                    onPress={ExpertNavigate}
                >
                    {
                        screenName == 'ExpertExperience' ?
                        <>
                            <Image
                                source={require('../images/exNaviIconOn04.png')}
                                alt='활동경험'
                                style={[{
                                    width:33,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='활동경험' style={[styles.tabButtonText, styles.tabButtonTextOn]} />
                        </>
                        :
                        <>
                            <Image
                                source={require('../images/exNaviIconOff04.png')}
                                alt='활동경험'
                                style={[{
                                    width:33,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='활동경험' style={[styles.tabButtonText]} />
                        </>
                    }
                    
                </TouchableOpacity>
                <TouchableOpacity 
                    activeOpacity={0.8} 
                    style={[styles.button, {borderTopRightRadius:24}]}
                    onPress={MypageNavigate}
                >
                    {
                        screenName == 'ExpertSetting' ?
                        <>
                            <Image
                                source={require('../images/exNaviIconOn05.png')}
                                alt='설정'
                                style={[{
                                    width:18,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='설정' style={[styles.tabButtonText, styles.tabButtonTextOn]} />
                        </>
                        :
                        <>
                            <Image
                                source={require('../images/exNaviIconOff05.png')}
                                alt='설정'
                                style={[{
                                    width:18,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='설정' style={[styles.tabButtonText]} />
                        </>
                    }
                    
                </TouchableOpacity>
            </HStack>
        </View>
    )

}

const ExpertNavi = (props) => {

    const {navigation, userInfo, chatInfo, member_chatCnt} = props;


    const chatCntHandler = async () => {
        const formData = new FormData();
        formData.append('ex_id', userInfo.ex_id);
        formData.append('method', 'member_exchatCnt');

        const chat_cnt = await member_chatCnt(formData);

        console.log("chat_cnt Expertnav::", chat_cnt);
    }

    useEffect(() => {
        chatCntHandler();
    }, [])

    const toastConfig = {
        custom_type: (internalState) => (
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: '#FFFFFF',
                fontSize: 15,
                lineHeight: 22,
                letterSpacing: -0.38,
              }}
            >
              {internalState.text1}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: '#FFFFFF',
                fontSize: 15,
                lineHeight: 22,
                letterSpacing: -0.38,
              }}
            >
              {internalState.text2}
            </Text>
          </View>
        ),
    };

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    }

    if (Platform.OS === 'ios') { PushNotificationIOS.setApplicationIconBadgeNumber(0); }

    useEffect(()=> {
        requestUserPermission();

        messaging().onMessage((remoteMessage) => {

            if(remoteMessage.data?.intent != ""){
                Toast.show({
                    type: 'info', //success | error | info
                    position: 'top',
                    text1: remoteMessage.notification.title,
                    text2: remoteMessage.notification.body,
                    visibilityTime: 3000,
                   // autoHide: remoteMessage.data.intent === 'SellerReg' ? false : true,    // true | false
                    topOffset: Platform.OS === 'ios' ? 66 + getStatusBarHeight() : 10,
                    style: { backgroundColor: 'red' },
                    bottomOffset: 100,
                    onShow: () => {},
                    onHide: () => {},
                    onPress: () => {
      
                      //console.log('12312312313::::', remoteMessage.data)
                      if (remoteMessage.data?.intent != null && remoteMessage.data?.intent != '') {
                 
                      }
                    },
                  });
            }
            
          
            console.log('실행중 메시지:::',remoteMessage);
            chatCntHandler();
          });
          // 포그라운드
          messaging().onNotificationOpenedApp((remoteMessage) => {
             console.log('onNotificationOpenedApp', remoteMessage);
            if (remoteMessage.data?.intent != null && remoteMessage.data?.intent != '') {
                
            }
            console.log("포그라운드")
            chatCntHandler();
          });
          // 백그라운드
          messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage.data?.intent != null && remoteMessage.data?.intent != '') {
                   
                }
                console.log("백그라운드")
                chatCntHandler();
            });
            //const unsubscribe = await dynamicLinks().onLink(handleDynamicLink);
            //return () => unsubscribe();
            // Register background handler
            messaging().setBackgroundMessageHandler(async remoteMessage => {
                console.log('Message handled in the background!', remoteMessage);
                chatCntHandler();
            });
    },[])

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown:false
            }}
            tabBar={(props) => <CustomTabBar {...props} userInfo={userInfo} chatInfo={chatInfo} />}
        >
            <Tab.Screen name="PlayMove" component={PlayMove} />
            <Tab.Screen name="ExpertMessage" component={ExpertMessage} />
            <Tab.Screen name="ExpertService" component={ExpertService} />
            <Tab.Screen name="ExpertExperience" component={ExpertExperience} />
            <Tab.Screen name="ExpertSetting" component={ExpertSetting} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    TabBarMainContainer: {
        justifyContent:'space-between',
        alignItems:'center',
        height: 70,
        flexDirection:'row',
        width:'100%',
        backgroundColor:'#fff'
    },
    button:{
        width:tabBarWidth,
        height: 70,
        justifyContent:'center',
        backgroundColor:'#fff',
        alignItems:'center',
        //borderTopWidth:1,
        //borderTopColor:'#e3e3e3'
    },
    tabButtonText: {
        ...fsize.fs12,
        color: '#707070',
        marginTop:10
    },
    tabButtonTextOn: {
        color:'#0195FF',
        ...fweight.b
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_hospital : User.user_hospital, // 병원회원권정보
        chatInfo : User.chatInfo
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_hospital: (user) => dispatch(UserAction.member_hospital(user)), //회원 정보 조회
        member_chatCnt: (user) => dispatch(UserAction.member_chatCnt(user))
    })
)(ExpertNavi);