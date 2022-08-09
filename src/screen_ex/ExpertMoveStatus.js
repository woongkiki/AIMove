import React, { useEffect, useState } from 'react';
import {Box, HStack, Image, VStack} from 'native-base';
import { BottomButton, DefButton, DefText } from '../common/BOOTSTRAP';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import SubHeader from '../components/SubHeader';
import { ScrollView, StyleSheet, Dimensions, Platform } from 'react-native';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import Api from '../Api';

const ExpertMoveStatus = (props) => {

    const {navigation, userInfo, member_update, member_info} = props;
    
    const [moveStatus, setMoveStatus] = useState("");

    //이사서비스 중복선택
    const moveStatusSelect = (category) => {

        if(!moveStatus.includes(category)){
            
            setMoveStatus([...moveStatus, category]);
        }else{

            const moveStatusRe = moveStatus.filter(item => category !== item);
            setMoveStatus(moveStatusRe);
        }
    }

    const experMoveServiceComple = async () => {

        let moveCategory = moveStatus.join(",");


        const formData = new FormData();
        formData.append("method", 'expert_update');
        formData.append("phone", userInfo.ex_phone);
        formData.append("id", userInfo.ex_id);
        formData.append("ex_service_status", userInfo.ex_service_status);
        formData.append("ex_start_date", userInfo.ex_start_date);
        formData.append("ex_addr", userInfo.ex_addr);
        formData.append("ex_service_name", userInfo.ex_service_name);
        formData.append("ex_advantages", userInfo.ex_advantages);
        formData.append("ex_select_reason", userInfo.ex_select_reason);
        formData.append("ex_worth", userInfo.ex_worth);
        formData.append("ex_refund", userInfo.ex_refund);
        formData.append("register_status", "Y");

        //변경값
        formData.append("ex_move_status", moveCategory);

        const update = await member_update(formData);

        if(update.result){
            
            expertInfo();

            navigation.navigate("ExpertServiceStatus");
           console.log(update);
        }
    }



    const expertInfo = async () => {
        const formData = new FormData();
        formData.append('method', 'expert_info');
        formData.append('id', userInfo.ex_id);
        const member_info_list = await member_info(formData);

        console.log('member_info_list:::::',member_info_list);
    }


    useEffect(()=>{
      
        if(userInfo?.ex_move_status != ""){
            let ex_move_arr = userInfo.ex_move_status.split(",");

            setMoveStatus(ex_move_arr);
        }
  
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="이사서비스 선택" navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text={"※ 3가지 모두 중복 선택 가능"} style={[styles.pageTitle]} />
                    <DefButton 
                        onPress={()=>moveStatusSelect('소형 이사')} 
                        text='소형 이사' 
                        btnStyle={[styles.buttonStyle, moveStatus.includes('소형 이사') && [colorSelect.sky]]} 
                        textStyle={[styles.btnTextStyle, moveStatus.includes('소형 이사') && {color:'#fff'}]} 
                    />
                    <DefButton 
                        onPress={()=>moveStatusSelect('가정집 이사')} 
                        text='가정집 이사' 
                        btnStyle={[styles.buttonStyle, moveStatus.includes('가정집 이사') && [colorSelect.sky]]} 
                        textStyle={[styles.btnTextStyle, moveStatus.includes('가정집 이사') && {color:'#fff'}]} 
                    />
                    <DefButton 
                        onPress={()=>moveStatusSelect('차량만 대여')} 
                        text='차량만 대여' 
                        btnStyle={[styles.buttonStyle, moveStatus.includes('차량만 대여') && [colorSelect.sky]]} 
                        textStyle={[styles.btnTextStyle, moveStatus.includes('차량만 대여') && {color:'#fff'}]} 
                    />
                </Box>
            </ScrollView>
            <BottomButton 
                leftText='이전'
                rightText={'다음'}
                leftonPress={()=>navigation.goBack()}
                rightDisable={ moveStatus.length > 0 ? false : true}
                rightBtnStyle={ moveStatus.length > 0 ? colorSelect.sky : colorSelect.gray }
                rightonPress={experMoveServiceComple}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    pageTitle:{
        ...fsize.fs14,
        ...fweight.b,
        color:'#FF5050'
    },
    buttonStyle: {
        ...colorSelect.gray,
        marginTop:10
    },
    btnTextStyle: {
        ...fweight.m
    }
})


export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_update: (user) => dispatch(UserAction.member_update(user)), //회원정보 변경
    })
)(ExpertMoveStatus);