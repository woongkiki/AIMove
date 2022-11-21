import React, { useEffect, useState } from 'react';
import {Box, HStack, Modal} from 'native-base';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Api from '../Api';
import { useIsFocused } from '@react-navigation/native';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import HeaderHome from '../components/HeaderHome';
import { DefText } from '../common/BOOTSTRAP';
import { fsize, fweight } from '../common/StyleCommon';

const {width, height} = Dimensions.get("window");

const HomeScreen = (props) => {

    const {navigation, userInfo} = props;

    const [loading, setLoading] = useState(true); //페이지 로딩
    const [loginCount, setLoginCount] = useState("0"); //로그인 횟수
    const [infoModal, setInfoModal] = useState(false); //내집이사 소개 모달(팝업)

    const homeScreenApi = async () => {
        await setLoading(true);
        await Api.send('main_loginCount', {'id':userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('로그인 횟수 가져오기: ', resultItem, arrItems);
               setLoginCount(arrItems);
            }else{
               //console.log('로그인 횟수 가져오기 실패!', resultItem);
               setLoginCount("0");
            }
        });
        await setLoading(false);
    }

    const isFocused = useIsFocused();

    useEffect(()=> { //페이지에 진입하면 무조건 실행..
        if(isFocused){
            homeScreenApi();
        }
    }, [isFocused])

    return (
        <Box flex={1} backgroundColor='#fff'>
            {
                loading ?
                <Box
                    flex={1}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <ActivityIndicator 
                        size="large" 
                        color="#333" 
                    />
                </Box>
                :
                <ScrollView>
                    <Box>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.topButton,
                                (loginCount * 1) > 10 &&
                                {paddingVertical:5, height:'auto'}
                            ]}
                            onPress={()=>setInfoModal(true)}
                            disabled={
                                (loginCount * 1) > 10 ?
                                true : false
                            }
                        >
                            {
                                (loginCount * 1) < 10 ?
                                <DefText 
                                    text='내집이사를 소개합니다.' 
                                    style={[
                                        styles.topButtonText
                                    ]}
                                />
                                :
                                <Image 
                                    source={require("../images/headLogoW2.png")} 
                                    style={{
                                        width:90,
                                        height:50,
                                        resizeMode:'contain'
                                    }}
                                />
                            }
                            
                        </TouchableOpacity>
                    </Box>
                </ScrollView>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    topButton: {
        width: width,
        height:39,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#0195ff'
    },
    topButtonText: {
        ...fsize.fs15,
        ...fweight.b,
        color:'#fff'
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
)(HomeScreen);