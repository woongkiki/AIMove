import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, View } from 'react-native';
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

const Tab = createBottomTabNavigator();

const {width, height} = Dimensions.get("window");
const tabBarWidth = width / 5;

function CustomTabBar(props){

    const {state, navigation} = props;

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
                            <DefText text='메세지' style={[styles.tabButtonText, styles.tabButtonTextOn]} />
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
                            <DefText text='메세지' style={[styles.tabButtonText]} />
                        </>
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

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown:false
            }}
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Reservation" component={Reservation} />
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

export default TabNav;