import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator, LogBox, Alert } from 'react-native';
import { Box, VStack, HStack } from 'native-base';
import { DefButton, DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import { numberFormat } from '../common/DataFunction';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import CountDown from '@ilterugur/react-native-countdown-component';
import { useIsFocused } from '@react-navigation/native';
import IMP from 'iamport-react-native';
import ToastMessage from '../components/ToastMessage';

const PayModule = (props) => {

    const {navigation, route, userInfo} = props;
    const {params} = route;

    console.log('params:::',params);

     //결제 ㄱ
     const data = {
        pg: 'html5_inicis',
        pay_method: 'card',
        name: "AI 이사 예약",
        merchant_uid: `mid_${new Date().getTime()}`,
        amount: params.sumsum,
        //amount: '1000',
        buyer_name: userInfo.name,
        buyer_tel: userInfo.phoneNumber,
        buyer_email: userInfo.email,
        buyer_addr: userInfo.addr1,
        buyer_postcode: userInfo.addrZip,
        app_scheme: 'aimoveapp',
        // [Deprecated v1.0.3]: m_redirect_url
      };
    
    const callback = (response) => {

        console.log("response", response);

        const { imp_success, success, imp_uid, merchant_uid, error_msg, paid_amount, pg_provider, pg_tid } = response;
        const isSuccess = !(imp_success === 'false' || imp_success === false || success === 'false' || success === false);


       

        navigate(isSuccess, response);
    }

    const navigate = (isSuccess, response) => {

        if(isSuccess){

            Api.send('notice_access', {'imp_uid':response.imp_uid, "merchant_uid":response.merchant_uid, "mid":userInfo.id, "mname":userInfo.name, "ex_id":params.expert_id, "ex_name":params.ex_name, "idx":params.idx, "bidx":params.bidx, "price":params.sumsum, "comprice":params.commission, "vat":params.vat, "or_price":params.auction_price}, (args)=>{

                let resultItem = args.resultItem;
                let arrItems = args.arrItems;
        
                if(resultItem.result === 'Y' && arrItems) {
                   console.log('AI 견적 요청 취소 보기: ', resultItem);
                   ToastMessage(resultItem.message);

                   navigation.navigate('TabNav', {
                        screen: 'Chating',
                    });
         
                }else{
                    console.log('AI 견적 요청 취소 보기: ', resultItem);
                }
            });

            
        }else{
            Alert.alert('',response.error_msg);
            navigation.goBack();
        }
    }

    useEffect(() => {
        
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <IMP.Payment
                userCode={'imp05244552'}  // 가맹점 식별코드
                //tierCode={'AAA'}      // 티어 코드: agency 기능 사용자에 한함
                loading={
                    <Box flex={1} justifyContent='center' alignItems={'center'}>
                        <ActivityIndicator size='large' color='#333' />
                    </Box>
                } // 로딩 컴포넌트
                data={data}           // 결제 데이터
                callback={callback}   // 결제 종료 후 콜백
            />
        </Box>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(PayModule);