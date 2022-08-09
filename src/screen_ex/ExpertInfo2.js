import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Image, Platform, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, BottomButton, DefInput } from '../common/BOOTSTRAP';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import SubHeader from '../components/SubHeader';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get("window");


const ExpertInfo2 = (props) => {

    const {navigation, member_info, member_update, userInfo} = props;

    const [serviceReason, setServiceReason] = useState("");
    const [seriviceWorth, setServiceWorth] = useState("");
    const [rightDisable, setRightDisalbe] = useState(true);

    const reasonChange = (text) => {
        setServiceReason(text);
    }

    const worthChange = (text) => {
        setServiceWorth(text);
    }

    useEffect(()=> {

        if(serviceReason.length >= 3 && seriviceWorth.length >= 3){
            setRightDisalbe(false);
        }

    }, [serviceReason, seriviceWorth]);


    const expertUpdate = async () => {

        const formData = new FormData();
        formData.append("method", 'expert_update');
        formData.append("ex_move_status", userInfo.ex_move_status);
        formData.append("phone", userInfo.ex_phone);
        formData.append("id", userInfo.ex_id);
        formData.append("ex_service_status", userInfo.ex_service_status);
        formData.append("ex_start_date", userInfo.ex_start_date);
        formData.append("ex_addr", userInfo.ex_addr);
        formData.append("ex_service_name", userInfo.ex_service_name);
        formData.append("ex_advantages", userInfo.ex_advantages);
        formData.append("ex_refund", userInfo.ex_refund);
        formData.append("register_status", "Y");
        
        //추가
        formData.append("ex_select_reason", serviceReason);
        formData.append("ex_worth", seriviceWorth);


        const update = await member_update(formData);

        if(update.result){
            
            expertInfo();

            navigation.navigate("ExpertInfo3");
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
        if(userInfo != null){
            setServiceReason(userInfo.ex_select_reason);
            setServiceWorth(userInfo.ex_worth);
        }
    },[])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader text="업체 정보 입력" />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <Box>
                        <HStack>
                            <Box style={[styles.pageBox]}>
                                <DefText text="2 / 3" style={[styles.pageNum]} />
                            </Box>
                        </HStack>
                        <Box style={[styles.gageBox]}>
                            <Box style={[styles.gageSky]} />
                        </Box>
                    </Box>
                    <Box mt='20px'>
                        <DefText text="고객님이 전문가님의 서비스를 선택해야 하는 이유가 무엇인가요?" style={[styles.labelTitle]} />
                        <Box>
                            <DefText text="(충실하게 작성할수록 고객이 선택할 확률이 높습니다.)" style={[styles.labelSmallTitle]} />
                            <DefInput
                                placeholder={'이유를 입력해 주세요.'}
                                inputStyle={{width:width - 50, height:160, borderWidth:1, borderColor:'#CCCCCC', borderRadius:5, paddingTop:10, marginTop:10}}
                                value={serviceReason}
                                multiline={true}
                                onChangeText={reasonChange}
                            />
                        </Box>
                    </Box>
                    <Box mt='20px'>
                        <DefText text="이사하면서 가장 보람 있을 때가 언제인가요?" style={[styles.labelTitle]} />
                        <Box>
                            <DefInput
                                placeholder={'내용를 입력해 주세요.'}
                                inputStyle={{width:width - 50, height:160, borderWidth:1, borderColor:'#CCCCCC', borderRadius:5, paddingTop:10}}
                                value={seriviceWorth}
                                multiline={true}
                                onChangeText={worthChange}
                            />
                        </Box>
                    </Box>
                </Box>
            </ScrollView>
            <BottomButton 
                leftText='이전'
                rightText={'다음'}
                leftonPress={()=>navigation.goBack()}
                rightDisable={ rightDisable }
                rightBtnStyle={ !rightDisable ? colorSelect.sky : colorSelect.gray }
                rightonPress={expertUpdate}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    pageNum: {
        ...fsize.fs12,
        ...fweight.m
    },
    pageBox: {
        paddingVertical:5,
        paddingHorizontal:10,
        backgroundColor:'#F8F8F8',
        borderRadius:15
    },
    gageBox: {
        width: width - 50,
        height:6,
        borderRadius:3,
        backgroundColor:'#F8F8F8',
        marginTop:20
    },
    gageSky: {
        width: (width-50) * 0.66,
        height:6,
        borderRadius:3,
        ...colorSelect.sky
    },
    labelTitle: {
        ...fsize.fs18,
        ...fweight.b,
        marginBottom:10
    },
    labelSmallTitle: {
        ...fsize.fs14,
        color:'#A2A2A2'
    },
    advanButton: {
        width: (width-50) * 0.32,
        height: 36,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        backgroundColor:'#DFDFDF',
        marginTop:10
    },
    advanButtonText: {
        ...fsize.fs14
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
)(ExpertInfo2);