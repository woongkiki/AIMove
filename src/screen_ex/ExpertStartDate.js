import React, { useEffect, useState } from 'react';
import {Box, HStack, Image, VStack} from 'native-base';
import { BottomButton, DefButton, DefText } from '../common/BOOTSTRAP';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import SubHeader from '../components/SubHeader';
import { ScrollView, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get("window");

Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

const ExpertStartDate = (props) => {

    const {navigation, member_info, member_update, userInfo} = props;


    const [career, setCareer] = useState("");
    const [serviceStartDate, setServiceStartDate] = useState("");
    const [startDateModal, setStartDateModal] = useState(false);

    //타임피커 띄우기
    const showTimePicker = () => {
        setStartDateModal(true);
    }

    //타임피커 닫기
    const hideTimePicker = () => {
        setStartDateModal(false);
    }

    const timeHandler = (time) => {

        console.log("time:", time);
        setServiceStartDate(time.format("yyyy-MM-dd"));
        setStartDateModal();
        //console.log(time.format("HH:mm"));
    }


    const dateSum = () => {
        Api.send('career_sum', {'career_date':serviceStartDate}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('경력일자 계산: ', resultItem, arrItems);
               setCareer(arrItems);
            }else{
               //console.log('경력일자 실패!', resultItem);
                ToastMessage(resultItem.message);
                // setServiceStartDate("");
            }
        });
    }

    const experMoveServiceComple = async () => {


        const formData = new FormData();
        formData.append("method", 'expert_update');
        formData.append("ex_move_status", userInfo.ex_move_status);
        formData.append("phone", userInfo.ex_phone);
        formData.append("id", userInfo.ex_id);
        formData.append("ex_service_status", userInfo.ex_service_status);
        formData.append("ex_addr", userInfo.ex_addr);
        formData.append("ex_service_name", userInfo.ex_service_name);
        formData.append("ex_advantages", userInfo.ex_advantages);
        formData.append("ex_select_reason", userInfo.ex_select_reason);
        formData.append("ex_worth", userInfo.ex_worth);
        formData.append("ex_refund", userInfo.ex_refund);
        formData.append("register_status", "Y");

        //추가
        formData.append("ex_start_date", serviceStartDate);


        const update = await member_update(formData);

        if(update.result){
            
            expertInfo();

            navigation.navigate("ExpertAddr");
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


    useEffect(()=> {
        if(serviceStartDate != ""){
            dateSum();
        }

        // if(userInfo?.ex_start_date != "0000-00-00 00:00:00"){
        //     //console.log('선정된 날짜::', userInfo.ex_start_date.substr(0, 10));
        //     setServiceStartDate(userInfo.ex_start_date.substr(0, 10))
        // }

    }, [serviceStartDate])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="이사 서비스 경력" navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text="이사 서비스는 언제부터 하셨어요?" style={[styles.pageTitle]} />
                    <VStack mt='20px'>
                        <DefText text="날짜" style={[styles.label]} />
                        <TouchableOpacity onPress={showTimePicker} style={[styles.dateBox]}>
                            {
                                serviceStartDate != "" ?
                                <DefText text={serviceStartDate} style={[styles.dateOffText, {color:'#000'}]} />
                                :
                                <DefText text='날짜를 선택해주세요.' style={[styles.dateOffText]} />

                            }           
                        </TouchableOpacity>
                    
                    </VStack>
                    {
                        career != "" && 
                        <Box alignItems={'flex-end'} mt='15px'>
                            <HStack alignItems={'flex-end'}>
                                <DefText text="총" />
                                <DefText text={career} style={[styles.careerText]} />
                            </HStack>
                        </Box>
                    }
                </Box>
            </ScrollView>
            <BottomButton 
                leftText='이전'
                rightText={'다음'}
                leftonPress={()=>navigation.goBack()}
                rightDisable={ serviceStartDate != "" ? false : true}
                rightBtnStyle={ serviceStartDate != "" ? colorSelect.sky : colorSelect.gray }
                rightonPress={experMoveServiceComple}
            />
            <DateTimePickerModal
                isVisible={startDateModal}
                mode="date"
                onConfirm={timeHandler}
                onCancel={hideTimePicker}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    pageTitle: {
        ...fsize.fs18,
        ...fweight.b,
        color:'#000000'
    },
    label: {
        ...fsize.fs15,
        ...fweight.b
    },
    dateBox: {
        height:50,
        justifyContent:'center',
        borderBottomWidth:1,
        borderBottomColor:'#BEBEBE',
        paddingLeft:10
    },
    dateOffText: {
        ...fsize.fs13,
        ...fweight.r,
        color:'#BEBEBE'
    },
    careerText: {
        ...fsize.fs18,
        ...fweight.b,
        marginLeft:5
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
)(ExpertStartDate);