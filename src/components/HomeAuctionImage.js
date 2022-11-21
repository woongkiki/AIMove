import React, {useState, useEffect} from 'react';
import {Box, HStack, Modal, Toast, VStack} from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { ActivityIndicator, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { useIsFocused } from '@react-navigation/native';
import ApiExpert from '../ApiExpert';
import { BASE_URL } from '../Utils/APIConstant';
import { numberFormat } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import CountDown from '@ilterugur/react-native-countdown-component';
import Api from '../Api';
import ToastMessage from './ToastMessage';
import Font from '../common/Font';

const {width} = Dimensions.get("window");

const HomeAuctionImage = (props) => {

    const {navigation, userInfo} = props;

    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [auctionList, setAuctionList] = useState([]);
    const [myAuctionList, setMyAuctionList] = useState([]);
    const [myAuctionPrice, setMyAuctionPrice] = useState([]);

    //참여가능한 가정집이사 목록
    const auctionListApi = async () => {
        await setLoading(true);
        await ApiExpert.send('tworoom_auctionList', {'mid':userInfo.ex_id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('참여가능한 가정집이사 목록 성공', resultItem, arrItems);
               setAuctionList(arrItems);
            }else{
               console.log('참여가능한 가정집이사 목록 실패', resultItem);
            }
        });

        //이미참여한 경매목록
        await ApiExpert.send('tworoom_myAuctionList', {'mid':userInfo.ex_id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('이미 참여한 가정집이사 목록 성공', resultItem, arrItems);
               setMyAuctionList(arrItems.idx);
               setMyAuctionPrice(arrItems.price);
            }else{
               console.log('이미 참여한 가정집이사 목록 실패', resultItem);
            }
        });
        await setLoading(false);
    }

    const navigateMove = (idx) => {

        if(myAuctionList.includes(idx)){

            navigation.navigate("TwoRoomConfirm", {"idx":idx, "status":"Y"})
            //ToastMessage("이미 신청이 완료된 견적입니다.\n고객님의 선택을 기다리고 있어요");
            //return false;
        }else{
            navigation.navigate("TwoRoomConfirm", {"idx":idx, "status":"N"})
        }
    }

    useEffect(()=> {
        if(isFocused){
            auctionListApi();
        }
    },[isFocused])

    return (
        <Box flex={1} backgroundColor='#fff'>
            {
                loading ?
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size='large' color={'#333'} />
                </Box>
                :
                auctionList != "" ?
                <ScrollView>
                    <Box p='25px'>
                        {
                            auctionList.map((item, index) => {
                                return(
                                    <Box key={index} backgroundColor={'#fff'} borderRadius='10px' shadow={9} mt={ index != 0 ? "20px" : 0}>
                                        <TouchableOpacity onPress={()=>navigateMove(item.idx)} style={[styles.moveButton]}>
                                            
                                            <VStack borderBottomWidth={1} borderBottomColor='#F3F4F5' >
                                                <HStack justifyContent={'space-between'} alignItems='center'>
                                                    <Box width="70%">
                                                        <DefText text={'가정집이사 (사진으로이사)'} style={[styles.moveTitle]} />
                                                    </Box>
                                                    {
                                                        myAuctionList.includes(item.idx) &&
                                                        <DefText text={'신청완료'} style={[styles.moveTitle, {color:'#0195ff'}]}  />
                                                    }
                                                </HStack>
                                                <DefText text={'이사날짜 : ' + item.moveDate.substring(0, 10)} style={[styles.moveDate]} />
                                            </VStack>

                                            <HStack style={[styles.labelBox]} alignItems='center'>
                                                <DefText text="남은시간" style={[styles.labelLeft]} />
                                                <CountDown 
                                                    until={item.times}
                                                    timeToShow={['H', 'M', 'S']}
                                                    timeLabels={{m: null, s: null}}
                                                    size={14}
                                                    digitStyle={{width:22, height:'auto', marginTop:4}}
                                                    digitTxtStyle={{fontSize:16, fontFamily:Font.SCoreDreamM, color:'#000'}}
                                                    showSeparator
                                                    style={{marginTop:-4, alignItems:'flex-start'}}
                                                />
                                            </HStack>

                                            {
                                                myAuctionList.includes(item.idx) &&
                                                <HStack style={[styles.labelBox]}>
                                                    <Box width='25%' >
                                                        <DefText text="입찰 금액" style={[styles.labelLeft]} />
                                                    </Box>
                                                    <Box width='70%' alignItems='flex-end'>
                                                        {
                                                            myAuctionPrice != "" ?
                                                            <DefText text={ numberFormat(myAuctionPrice[myAuctionList.indexOf(item.idx)]) + '원'} style={[styles.labelRight]} />
                                                            :
                                                            <DefText text={ '-'} style={[styles.labelRight]} />
                                                        }
                                                    </Box>
                                                </HStack>
                                            }
                                            <HStack style={[styles.labelBox]} alignItems='center'>
                                                <DefText text="신청자" style={[styles.labelLeft]} />
                                                <Box width="70%" alignItems='flex-end'>
                                                    <DefText text={item.mname} style={[styles.labelRight]} />
                                                </Box>
                                            </HStack>
                                            <HStack style={[styles.labelBox]} alignItems='center'>
                                                <DefText text="출발지" style={[styles.labelLeft]} />
                                                <Box width="70%" alignItems='flex-end'>
                                                    <DefText text={item.startAddress} style={[styles.labelRight]} />
                                                </Box>
                                            </HStack>
                                            <HStack style={[styles.labelBox]} alignItems='center'>
                                                <DefText text="도착지" style={[styles.labelLeft]} />
                                                <Box width="70%" alignItems='flex-end'>
                                                    <DefText text={item.destinationAddress} style={[styles.labelRight]} />
                                                </Box>
                                            </HStack>
                                        
                                        </TouchableOpacity>
                                    </Box>
                                )
                            })
                        }
                    </Box>
                </ScrollView>
                :
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <DefText text='참여가능한 가정집이사 목록이 없습니다.' />
                </Box>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    moveButton: {
        paddingHorizontal:15,
        paddingVertical:20,
    },
    moveTitle: {
        ...fsize.fs19,
        ...fweight.b,
        
    },
    moveDate: {
        color:'#777',
        ...fsize.fs13,
        marginTop:10,
        marginBottom:10
    },
    labelBox: {
        justifyContent:'space-between',
        marginTop:15
    },
    labelLeft: {
        ...fsize.fs15,
        ...fweight.b
    },
    labelRight: {
        color:'#747474',
        ...fsize.fs15,
    },
    modalText: {
        ...fsize.fs14
    },
    modalButton: {
        width: (width - 90) * 0.48,
        height:40,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        ...colorSelect.sky
    },
    modalButtonText: {
        color:'#fff',
        ...fsize.fs14,
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
        
    })
)(HomeAuctionImage);