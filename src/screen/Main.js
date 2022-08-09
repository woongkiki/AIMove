import React, { useEffect, useState } from 'react';
import { extendTheme, NativeBaseProvider, Box, Text, Image} from 'native-base';
import Theme from '../common/Theme';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import store from '../redux/configureStore';
import {Provider} from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView, View, Dimensions, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Toast from 'react-native-toast-message';

//스크린
import Login from './Login';
import TabNav from './TabNav';
import MoveType from './MoveType';
import CameraSmallHome from './CameraSmallHome';
import ImageConfirm from './ImageConfirm';
import MoveConfirm from './MoveConfirm';
import SmallMoveCategory from './SmallMoveCategory';
import PackageMoveStatus from './PackageMoveStatus';
import SmallMovePerson from './SmallMovePerson';
import SmallMoveKeep from './SmallMoveKeep';
import SmallMoveStartTool from './SmallMoveStartTool';
import SmallMoveStartAddress from './SmallMoveStartAddress';
import SmallMoveDestinationAddress from './SmallMoveDestinationAddress';
import SmallMoveDestinationTool from './SmallMoveDestinationTool';
import SmallMoveDate from './SmallMoveDate';
import SmallMoveHelp from './SmallMoveHelp';
import SmallMoveConfirm from './SmallMoveConfirm';
import ReservationExpert from './ReservationExpert';
import ReviewScreen1 from './ReviewScreen1';
import ReviewScreen2 from './ReviewScreen2';
import ProfileSetting from './ProfileSetting';
import PayList from './PayList';
import MyReview from './MyReview';
import Policy from './Policy';
import PolicyPrivacy from './PolicyPrivacy';
import PolicyTermuse from './PolicyTermuse';
import ServiceQa from './ServiceQa';
import Intro from './Intro';
import ExpertStart from '../screen_ex/ExpertStart';
import ExpertNavi from '../screen_ex/ExpertNavi';
import ExpertMoveStatus from '../screen_ex/ExpertMoveStatus';
import ExpertServiceStatus from '../screen_ex/ExpertServiceStatus';
import ExpertStartDate from '../screen_ex/ExpertStartDate';
import ExpertAddr from '../screen_ex/ExpertAddr';
import ExpertImageSelect1 from '../screen_ex/ExpertImageSelect1';
import ExpertImageConfirm from '../screen_ex/ExpertImageConfirm';
import ExpertInfo1 from '../screen_ex/ExpertInfo1';
import ExpertInfo2 from '../screen_ex/ExpertInfo2';
import ExpertInfo3 from '../screen_ex/ExpertInfo3';
import ExpertLastConfirm from '../screen_ex/ExpertLastConfirm';


const Stack = createStackNavigator();

const theme = extendTheme({ Theme });

const {width, height} = Dimensions.get("window");

const tabBarWidth = width / 5;

const Main = (props) => {

    const toastConfig = {
        custom_type: (internalState) => (
          <View
            style={{
              backgroundColor: '#000000e0',
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 20,
              opacity: 0.8,
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
          </View>
        ),
    };

    return (
        <Provider store={store}>
            <PaperProvider>
                <NativeBaseProvider theme={theme}>
                    <NavigationContainer>
                        <SafeAreaView style={{flex:1}}>
                            <Stack.Navigator
                                screenOptions={{
                                    headerShown:false,
                                }}
                            >
                                <Stack.Screen name="Intro" component={Intro} />
                                <Stack.Screen name="Login" component={Login} />
                                <Stack.Screen name="TabNav" component={TabNav} />
                                <Stack.Screen name="MoveType" component={MoveType} />
                                <Stack.Screen name="CameraSmallHome" component={CameraSmallHome} />
                                <Stack.Screen name="ImageConfirm" component={ImageConfirm} />
                                <Stack.Screen name="MoveConfirm" component={MoveConfirm} />
                                <Stack.Screen name="SmallMoveCategory" component={SmallMoveCategory} />
                                <Stack.Screen name="PackageMoveStatus" component={PackageMoveStatus} />
                                <Stack.Screen name="SmallMovePerson" component={SmallMovePerson} />
                                <Stack.Screen name="SmallMoveKeep" component={SmallMoveKeep} />
                                <Stack.Screen name="SmallMoveStartTool" component={SmallMoveStartTool} />
                                <Stack.Screen name="SmallMoveStartAddress" component={SmallMoveStartAddress} />
                                <Stack.Screen name="SmallMoveDestinationTool" component={SmallMoveDestinationTool} />
                                <Stack.Screen name="SmallMoveDestinationAddress" component={SmallMoveDestinationAddress} />
                                <Stack.Screen name="SmallMoveDate" component={SmallMoveDate} />
                                <Stack.Screen name="SmallMoveHelp" component={SmallMoveHelp} />
                                <Stack.Screen name="SmallMoveConfirm" component={SmallMoveConfirm} />
                                <Stack.Screen name="ReservationExpert" component={ReservationExpert} />
                                <Stack.Screen name="ReviewScreen1" component={ReviewScreen1} />
                                <Stack.Screen name="ReviewScreen2" component={ReviewScreen2} />
                                <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
                                <Stack.Screen name="PayList" component={PayList} />
                                <Stack.Screen name="MyReview" component={MyReview} />
                                <Stack.Screen name="Policy" component={Policy} />
                                <Stack.Screen name="PolicyPrivacy" component={PolicyPrivacy} />
                                <Stack.Screen name="PolicyTermuse" component={PolicyTermuse} />
                                <Stack.Screen name="ServiceQa" component={ServiceQa} />
                                <Stack.Screen name="ExpertStart" component={ExpertStart} />
                                <Stack.Screen name="ExpertNavi" component={ExpertNavi} />
                                <Stack.Screen name="ExpertMoveStatus" component={ExpertMoveStatus} />
                                <Stack.Screen name="ExpertServiceStatus" component={ExpertServiceStatus} />
                                <Stack.Screen name="ExpertStartDate" component={ExpertStartDate} />
                                <Stack.Screen name="ExpertAddr" component={ExpertAddr} />
                                <Stack.Screen name="ExpertImageSelect1" component={ExpertImageSelect1} />
                                <Stack.Screen name="ExpertImageConfirm" component={ExpertImageConfirm} />
                                <Stack.Screen name="ExpertInfo1" component={ExpertInfo1} />
                                <Stack.Screen name="ExpertInfo2" component={ExpertInfo2} />
                                <Stack.Screen name="ExpertInfo3" component={ExpertInfo3} />
                                <Stack.Screen name="ExpertLastConfirm" component={ExpertLastConfirm} />
                            </Stack.Navigator>
                        </SafeAreaView>
                    </NavigationContainer>
                    <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
                </NativeBaseProvider>
            </PaperProvider>
        </Provider>
    );
};

export default Main;