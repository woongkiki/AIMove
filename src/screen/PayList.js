import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import { numberFormat } from '../common/DataFunction';
import Api from '../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const {width, height} = Dimensions.get("window");

const PayList = (props) => {

    const {navigation, userInfo} = props;

    const [loading, setLoading] = useState(true);
    const [payData, setPayData] = useState([]);

    const payListApi = async () => {
        await setLoading(true);
        await Api.send('payinfo_list', {"id":userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               
                console.log("내 결제내역:::", arrItems, resultItem);
                setPayData(arrItems);
            }else{
               console.log('내 결제내역 실패!', resultItem);
               
            }
        });
        await setLoading(false);
    }

    useEffect(() => {
        payListApi();
    }, [])

    return (
        <Box flex={1} backgroundColor='#F8F9FA'>
            <SubHeader headerTitle="결제 내역" navigation={navigation} />
            {
                loading ?
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size="large" color="#333" />
                </Box>
                :
                payData != "" ?
                <ScrollView>
                    {
                        payData.map((item, index) => {
                            return(
                                <TouchableOpacity onPress={()=>navigation.navigate("PayView", {"bidx":item.bidx, "auction_status":item.auction_status, "price":item.price, "ex_id":item.ex_id})} style={[styles.payButton]} key={index}>
                                    <HStack alignItems={'center'} justifyContent={'space-between'}>
                                        <DefText text="결제번호" style={[styles.payButtonLabel]} />
                                        <DefText text={item.pay_code} style={[styles.payButtonText]} />
                                    </HStack>
                                    <HStack alignItems={'center'} justifyContent={'space-between'} mt='20px'>
                                        <DefText text="이사전문가" style={[styles.payButtonLabel]} />
                                        <DefText text={item.ex_name + " 전문가"} style={[styles.payButtonText]}  />
                                    </HStack>
                                    <HStack alignItems={'center'} justifyContent={'space-between'} mt='20px'>
                                        <DefText text="총 결제 금액" style={[styles.payButtonLabel]} />
                                        <HStack>
                                            <DefText text={numberFormat(item.price)} style={[styles.payButtonLabel, {color:'#0195FF'}]}  />
                                            <DefText text=" 원" style={[styles.payButtonLabel]} />
                                        </HStack>
                                    </HStack>
                                    <Box position={'absolute'} right='25px' top='50%' marginTop='18px'>
                                        <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:14, height:14, resizeMode:'contain'}} />
                                    </Box>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
                :
                <Box flex={1} justifyContent='center' alignItems={'center'} backgroundColor='#fff'>
                    <DefText text={"진행된 결제 내역이 없습니다."} />
                </Box>
            }
           
        </Box>
    );
};

const styles = StyleSheet.create({
    payButton: {
        padding:25,
        paddingRight:50,
        backgroundColor:'#fff',
        marginTop:15,
    },
    payButtonLabel: {
        ...fsize.fs14,
        ...fweight.b
    },
    payButtonText: {
        ...fsize.fs14,
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
)(PayList);