import React from 'react';
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

const Tab = createBottomTabNavigator();

const {width, height} = Dimensions.get("window");
const tabBarWidth = width / 5;

function CustomTabBar(props){

    const {state, navigation} = props;

    const screenName = state.routes[state.index].name; //tabbar 현재 스크린명

    //tabbar 스크린 이동..
    const HomeNavigate = () => {
        navigation.navigate('ExpertNavi', {
            screen: 'PlayMove',
        });
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
                            <DefText text='메세지' style={[styles.tabButtonText, styles.tabButtonTextOn]} />
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
                            <DefText text='메세지' style={[styles.tabButtonText]} />
                        </>
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
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown:false
            }}
            tabBar={(props) => <CustomTabBar {...props} />}
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


export default ExpertNavi;