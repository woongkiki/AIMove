import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, View, Platform, Text } from 'react-native';
import { Box, VStack, HStack } from 'native-base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Reservation from './Reservation';
import Chating from './Chating';
import Expert from './Expert';
import Mypage from './Mypage';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { fsize, fweight } from '../common/StyleCommon';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Toast from 'react-native-toast-message';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const Tab = createBottomTabNavigator();

const {width, height} = Dimensions.get("window");
const tabBarWidth = width / 5;

function CustomTabBar(props){

    const {state, navigation, chatInfo} = props;

    console.log("chatInfo TabBar:::", chatInfo);

    const screenName = state.routes[state.index].name; //tabbar 현재 스크린명

    //tabbar 스크린 이동..
    const HomeNavigate = () => {
        navigation.navigate('TabNav', {
            screen: 'Home',
        });
    }

    const ReservationNavigate = () => {
        navigation.navigate('TabNav', {
            screen: 'Reservation',
            params:{
                moveCate : "" ,
                tabCategory: "",
                twoCate:""
            }
        });
    }

    const ChatingNavigate = () => {
        navigation.navigate('TabNav', {
            screen: 'Chating',
        });
    }

    const ExpertNavigate = () => {
        navigation.navigate('TabNav', {
            screen: 'Expert',
        });
    }

    const MypageNavigate = () => {
        navigation.navigate('TabNav', {
            screen: 'Mypage',
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
                        screenName == 'Home' ?
                        <>
                            <Image
                                source={require('../images/homeIconOn.png')}
                                alt='홈'
                                style={[{
                                    width:21,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='홈' style={[styles.tabButtonText, styles.tabButtonTextOn]} />
                        </>
                        :
                        <>
                            <Image
                                source={require('../images/homeIconOff.png')}
                                alt='홈'
                                style={[{
                                    width:21,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='홈' style={[styles.tabButtonText]} />
                        </>
                    }
                    
                </TouchableOpacity>
                <TouchableOpacity 
                    activeOpacity={0.8} 
                    style={[styles.button]}
                    onPress={ReservationNavigate}
                >
                    {
                        screenName == 'Reservation' ?
                        <>
                            <Image
                                source={require('../images/reservationIconOn.png')}
                                alt='예약'
                                style={[{
                                    width:21,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='예약' style={[styles.tabButtonText, styles.tabButtonTextOn]} />
                        </>
                        :
                        <>
                            <Image
                                source={require('../images/reservationIconOff.png')}
                                alt='예약'
                                style={[{
                                    width:21,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='예약' style={[styles.tabButtonText]} />
                        </>
                    }
                  
                    
                </TouchableOpacity>
                <TouchableOpacity 
                    activeOpacity={0.8} 
                    style={[styles.button]}
                    onPress={ChatingNavigate}
                >
                    {
                        screenName == 'Chating' ?
                        <>
                            <Image
                                source={require('../images/messageIconOn.png')}
                                alt='메세지'
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
                                source={require('../images/messageIconOff.png')}
                                alt='메세지'
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
                    onPress={ExpertNavigate}
                >
                    {
                        screenName == 'Expert' ?
                        <>
                            <Image
                                source={require('../images/expertIconOn.png')}
                                alt='이사전문가'
                                style={[{
                                    width:39,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='이사전문가' style={[styles.tabButtonText, styles.tabButtonTextOn]} />
                        </>
                        :
                        <>
                            <Image
                                source={require('../images/expertIconOff.png')}
                                alt='이사전문가'
                                style={[{
                                    width:39,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='이사전문가' style={[styles.tabButtonText]} />
                        </>
                    }
                    
                </TouchableOpacity>
                <TouchableOpacity 
                    activeOpacity={0.8} 
                    style={[styles.button, {borderTopRightRadius:24}]}
                    onPress={MypageNavigate}
                >
                    {
                        screenName == 'Mypage' ?
                        <>
                            <Image
                                source={require('../images/mypageIconOn.png')}
                                alt='마이페이지'
                                style={[{
                                    width:18,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='마이페이지' style={[styles.tabButtonText, styles.tabButtonTextOn]} />
                        </>
                        :
                        <>
                            <Image
                                source={require('../images/mypageIconOff.png')}
                                alt='마이페이지'
                                style={[{
                                    width:18,
                                    height:21,
                                    resizeMode:'contain'
                                }]}
                            />
                            <DefText text='마이페이지' style={[styles.tabButtonText]} />
                        </>
                    }
                    
                </TouchableOpacity>
            </HStack>
        </View>
    )

}


const TabNav = (props) => {

    const {navigation, userInfo, chatInfo, member_chatCnt} = props;


    const chatCntHandler = async () => {
        const formData = new FormData();
        formData.append('mid', userInfo.id);
        formData.append('method', 'member_chatCnt');

        const chat_cnt = await member_chatCnt(formData);

        console.log("chat_cnt Tabnav::", chat_cnt);
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
            backBehavior={'history'}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Reservation" component={Reservation}  />
            <Tab.Screen name="Chating" component={Chating} />
            <Tab.Screen name="Expert" component={Expert} />
            <Tab.Screen name="Mypage" component={Mypage} />
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
)(TabNav);