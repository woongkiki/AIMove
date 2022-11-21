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
import Loading from '../components/Loading';

const VisitAuctionPayModule = (props) => {

    const {navigation, route, userInfo} = props;
    const {params} = route;

    console.log('방문견적 요청 결제 ',params);
    //결제 ㄱ
    const data = {
        pg: 'html5_inicis',
        pay_method: 'card',
        name: "방문견적 요청",
        merchant_uid: `mid_${new Date().getTime()}`,
        amount: params.sumsum,
        //amount: '1000',
        buyer_name: userInfo.ex_name,
        buyer_tel: userInfo.ex_phone,
        //buyer_email: userInfo.email,
        buyer_addr: userInfo.ex_addr,
        buyer_postcode: userInfo.ex_addr_zip,
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

            Api.send('house_visitAuctionAct', {"expert_id":userInfo.ex_id, "expert_move_cnt":userInfo.move_cnt, "expert_certi":userInfo.business_certi, "expert_review_cnt":userInfo.review_cnt, "expert_name":userInfo.ex_name, "moveStatus":"방문", "imp_uid":response.imp_uid, "merchant_uid":response.merchant_uid, "price":params.sumsum, "or_price":params.def_visit_auction, "comprice":params.commission, "vat":params.vat, "auc_idx":params.auc_idx, 'mid':params.mid, 'mname':params.mname}, (args)=>{

                let resultItem = args.resultItem;
                let arrItems = args.arrItems;
        
                if(resultItem.result === 'Y' && arrItems) {
                console.log('방문견적요청: ', resultItem);
                ToastMessage(resultItem.message);

                    navigation.navigate("ExpertNavi", {
                        screen: "PlayMove",
                        params:{
                            moveCate : "가정집 이사" ,
                            homeCate: "방문",
                        }
                    })

                }else{
                console.log('방문견적요청 실패!', resultItem);
                ToastMessage(resultItem.message);
                }
            });

            
        }else{
            Alert.alert('결제 실패!',response.error_msg);
            navigation.goBack();
        }
    }

    return (
        <Box flex={1}>
            <IMP.Payment
                userCode={'imp05244552'}  // 가맹점 식별코드
                //tierCode={'AAA'}      // 티어 코드: agency 기능 사용자에 한함
                loading={
                    <Loading />
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
)(VisitAuctionPayModule);