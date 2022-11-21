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

const ExpertInfo3 = (props) => {

    const {navigation, userInfo, member_info, member_update} = props;


    const [refundList, setRefundList] = useState([]);
    const [selectRefund, setSelectRefund] = useState("");
    const [rightDisable, setRightDisalbe] = useState(true);


    const refundListApi = () => {
        Api.send('refund_list', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
              // console.log('환불정책 리스트: ', resultItem, arrItems);
               setRefundList(arrItems);
            }else{
               console.log('환불정책 리스트 출력 실패!', resultItem);

            }
        });
    }

    const selectRefundHandler = (cate) => {
        //setSelectRefund(select);
        setSelectRefund(cate);
        console.log("select:::::",cate)
    }


    useEffect(()=>{
        refundListApi();
    }, []);

    useEffect(()=> {
        if(selectRefund != ""){
            setRightDisalbe(false);
        }
    }, [selectRefund]);


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
        formData.append("ex_select_reason", userInfo.ex_select_reason);
        formData.append("ex_worth", userInfo.ex_worth);
        formData.append("ex_area", userInfo.ex_area);
        formData.append("register_status", "Y");

        //추가
        formData.append("ex_refund", selectRefund);

        const update = await member_update(formData);

        if(update.result){
            
            expertInfo();

            navigation.navigate("ExpertLastConfirm");
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
        if(userInfo != null){
            setSelectRefund(userInfo.ex_refund);
        }
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle='환불정책 선택' navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <Box>
                        <HStack>
                            <Box style={[styles.pageBox]}>
                                <DefText text="3 / 3" style={[styles.pageNum]} />
                            </Box>
                        </HStack>
                        <Box style={[styles.gageBox]}>
                            <Box style={[styles.gageSky]} />
                        </Box>
                    </Box>
                    <Box mt='20px'>
                        <DefText text="이사서비스 환불 정책에 대해 선택해 주세요." style={[styles.labelTitle]} />
                        <DefText text={"불가피한 상황에 고객이 예약을 취소해야 하는 상황이 생길 수 있습니다."} style={[styles.labelRedTitle]} />
                        <DefText text={"이사전문가는 원활한 이사 서비스를 위해 환불 정책을 선택할 수 있습니다."} style={[styles.labelRedTitle, {marginTop:5}]} />
                        {
                            refundList != "" && 
                            refundList.map((item, index) => {
                                return(
                                    <VStack key={index}>
                                        <TouchableOpacity style={[styles.refundButton, selectRefund == item.re_title && [colorSelect.sky]]} onPress={()=>selectRefundHandler(item.re_title)}>
                                            <DefText text={item.re_title} style={[styles.refundButtonText, selectRefund == item.re_title && {color:'#fff'}]}/>
                                        </TouchableOpacity>
                                        <DefText text={item.re_content} style={[styles.refundContent]} />
                                    </VStack>
                                )
                            })
                        }
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
        width: width-50,
        height:6,
        borderRadius:3,
        ...colorSelect.sky
    },
    labelTitle: {
        ...fsize.fs18,
        ...fweight.b,
        marginBottom:10
    },
    labelRedTitle:{
       ...fsize.fs14,
       ...fweight.b,
       color:'#FF5050' 
    },
    labelSmallTitle: {
        ...fsize.fs14,
        color:'#A2A2A2'
    },
    refundButton: {
        width:width - 50,
        height: 50,
        backgroundColor:'#DFDFDF',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
    },
    refundButtonText: {
        ...fweight.m,
    },
    refundContent: {
        ...fsize.fs14,
        lineHeight:18,
        color:'#949494',
        marginTop:10
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
)(ExpertInfo3);