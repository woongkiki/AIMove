import React, { useEffect, useState } from 'react';
import {Box, HStack, Image, VStack} from 'native-base';
import { BottomButton, DefButton, DefText } from '../common/BOOTSTRAP';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import SubHeader from '../components/SubHeader';
import { ScrollView, StyleSheet, Dimensions, Platform } from 'react-native';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';

const {width, height} = Dimensions.get("window");

const ExpertServiceStatus = (props) => {

    const {navigation, member_info, member_update, userInfo} = props;
    
    const [serviceStatus, setServiceStatus] = useState([]);

    const [serviceSelect, setServiceSelect] = useState(["포장 이사", "반포장 이사", "일반 이사"]);
    
    //서비스유형 중복선택
    const serviceStatusSelect = (category) => {

        selectServiceRemove(category);

        if(!serviceStatus.includes(category)){
            
            setServiceStatus([...serviceStatus, category]);
        }else{

            const serviceStatusRe = serviceStatus.filter(item => category !== item);
            setServiceStatus(serviceStatusRe);
        }
    }


    const selectServiceRemove = (category) => {

        if(serviceSelect.includes(category)){
            const serviceStatusRe = serviceSelect.filter(item => category !== item);
            setServiceSelect(serviceStatusRe);
        }else{
            setServiceSelect([...serviceSelect, category]);
        }
    }


    const experMoveServiceComple = async () => {

        let moveCategory = serviceStatus.join(",");


        const formData = new FormData();
        formData.append("method", 'expert_update');
        formData.append("ex_move_status", userInfo.ex_move_status);
        formData.append("phone", userInfo.ex_phone);
        formData.append("id", userInfo.ex_id);
        formData.append("ex_start_date", userInfo.ex_start_date);
        formData.append("ex_addr", userInfo.ex_addr);
        formData.append("ex_service_name", userInfo.ex_service_name);
        formData.append("ex_advantages", userInfo.ex_advantages);
        formData.append("ex_select_reason", userInfo.ex_select_reason);
        formData.append("ex_worth", userInfo.ex_worth);
        formData.append("ex_refund", userInfo.ex_refund);
        formData.append("register_status", "Y");

        //추가
        formData.append("ex_service_status", moveCategory);


        const update = await member_update(formData);

        if(update.result){
            
            expertInfo();

            navigation.navigate("ExpertStartDate");
           //console.log(update);
        }
    }

    const expertInfo = async () => {
        const formData = new FormData();
        formData.append('method', 'expert_info');
        formData.append('id', userInfo.ex_id);
        const member_info_list = await member_info(formData);

        //console.log('member_info_list:::::',member_info_list);
    }

    useEffect(()=>{
      
        if(userInfo?.ex_service_status != ""){
            let ex_move_arr = userInfo.ex_service_status.split(",");

            setServiceStatus(ex_move_arr);
        }
  
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="서비스 유형 선택" navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text={"※ 3가지 모두 중복 선택 가능"} style={[styles.pageTitle]} />
                    <DefButton 
                        onPress={()=>serviceStatusSelect('포장 이사')} 
                        text='포장 이사' 
                        btnStyle={[styles.buttonStyle, serviceStatus.includes('포장 이사') && [colorSelect.sky]]} 
                        textStyle={[styles.btnTextStyle, serviceStatus.includes('포장 이사') && {color:'#fff'}]} 
                    />
                    <DefButton 
                        onPress={()=>serviceStatusSelect('반포장 이사')} 
                        text='반포장 이사' 
                        btnStyle={[styles.buttonStyle, serviceStatus.includes('반포장 이사') && [colorSelect.sky]]} 
                        textStyle={[styles.btnTextStyle, serviceStatus.includes('반포장 이사') && {color:'#fff'}]} 
                    />
                    <DefButton 
                        onPress={()=>serviceStatusSelect('일반 이사')} 
                        text='일반 이사' 
                        btnStyle={[styles.buttonStyle, serviceStatus.includes('일반 이사') && [colorSelect.sky]]} 
                        textStyle={[styles.btnTextStyle, serviceStatus.includes('일반 이사') && {color:'#fff'}]} 
                    />

                   {
                        (serviceSelect.length != 3 && serviceSelect.length != 0) &&
                        <Box mt='20px'>
                            {/* <DefText text={serviceSelect.join(",") + "에는 참여가 불가능 합니다."} style={[fsize.fs14, {color:'#f00'}]} /> */}
                            <DefText text={"3가지 모두 선택하는 것이 고객을 많이 만나는 방법입니다."} style={[fsize.fs14]} />
                        </Box>
                   }

                </Box>
            </ScrollView>
            <BottomButton 
                leftText='이전'
                rightText={'다음'}
                leftonPress={()=>navigation.goBack()}
                rightDisable={ serviceStatus.length > 0 ? false : true}
                rightBtnStyle={ serviceStatus.length > 0 ? colorSelect.sky : colorSelect.gray }
                rightonPress={experMoveServiceComple}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    pageTitle:{
        ...fsize.fs14,
        ...fweight.b
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
)(ExpertServiceStatus);