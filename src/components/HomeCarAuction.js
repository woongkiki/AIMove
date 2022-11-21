import React, {useState, useEffect} from 'react';
import {Box, HStack, VStack} from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { ActivityIndicator, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { useIsFocused } from '@react-navigation/native';
import ApiExpert from '../ApiExpert';
import { BASE_URL } from '../Utils/APIConstant';
import { numberFormat } from '../common/DataFunction';
import { fsize, fweight } from '../common/StyleCommon';
import CountDown from '@ilterugur/react-native-countdown-component';
import Api from '../Api';
import Font from '../common/Font';
import ToastMessage from './ToastMessage';

const HomeCarAuction = (props) => {

    const {navigation, userInfo} = props;


    const [loading, setLoading] = useState(true);
    const [carAcutionList, setCarAuctionList] = useState([]);
    const [myList, setMyList] = useState([]);

    const auctionListApi = async () => {
       await setLoading(true);
       await  Api.send('car_carauction', {}, (args)=>{

           let resultItem = args.resultItem;
           let arrItems = args.arrItems;
   
           if(resultItem.result === 'Y' && arrItems) {
              //console.log('참여가능한 차량제공 리스트 보기: ', resultItem, arrItems);
              setCarAuctionList(arrItems);
           }else{
              console.log('참여가능한 차량제공 리스트 실패!', resultItem);
              
           }
       });
       await Api.send('car_myCarAuctionList', {'ex_id':userInfo.ex_id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;

            if(resultItem.result === 'Y' && arrItems) {
            console.log('이미 참여한 차량제공 리스트 보기: ', resultItem, arrItems);
            setMyList(arrItems);
            }else{
            console.log('이미 참여한 리스트 실패!', resultItem);
            
            }
        });
       await setLoading(false);
   }


   const carAuctionViewNavi = (idx) => {
        
        console.log("idx", idx);

        if(myList.includes(idx)){
            ToastMessage("이미 차량제공 견적신청이 완료되었습니다.\n고객님의 선택을 기다리고 있어요");
            return false;
        }else{
            navigation.navigate("CarAuctionView", {"idx":idx, "type":"Y"});
        }
   }

   useEffect(()=> {
        auctionListApi();
   }, [])

    return (
        <Box flex={1} backgroundColor="#fff">
            {
                loading ?
                <Box flex={1} justifyContent='center' alignItems='center'>
                    <ActivityIndicator size="large" color="#333" />
                </Box>
                :
                    carAcutionList != "" ?
                    <ScrollView>
                        <Box px='25px' py='25px'>
                            {
                                carAcutionList.map((item, index) => {
                                    return(
                                        <Box key={index} backgroundColor={'#fff'} borderRadius='10px' shadow={9} mt={ index != 0 ? "20px" : 0}>
                                            <TouchableOpacity onPress={()=> carAuctionViewNavi(item.idx)} style={[styles.moveButton]}>
                                                
                                                <VStack borderBottomWidth={1} borderBottomColor='#F3F4F5' >
                                                    <HStack justifyContent={'space-between'} alignItems='center'>
                                                        <Box width="70%">
                                                            <DefText text={'차량만대여'} style={[styles.moveTitle]} />
                                                        </Box>
                                                        {
                                                            myList.includes(item.idx) &&
                                                            <DefText text={'신청완료'} style={[styles.moveTitle, {color:'#0195ff'}]}  />
                                                        }
                                                    </HStack>
                                                    <DefText text={'이사날짜 : ' + item.moveDate.substring(0, 10)} style={[styles.moveDate]} />
                                                </VStack>

                                                <HStack style={[styles.labelBox]}>
                                                    <DefText text="남은시간" style={[styles.labelLeft]} />
                                                    <CountDown 
                                                        until={item.times}
                                                        timeToShow={['H', 'M', 'S']}
                                                        timeLabels={{m: null, s: null}}
                                                        size={14}
                                                        digitStyle={{width:20, height:'auto', marginTop:4}}
                                                        digitTxtStyle={{fontSize:16, fontFamily:Font.SCoreDreamM, color:'#000'}}
                                                        showSeparator
                                                        style={{marginTop:-4, alignItems:'flex-start'}}
                                                    />
                                                </HStack>
                                                <HStack style={[styles.labelBox]} alignItems='center'>
                                                    <DefText text="신청자" style={[styles.labelLeft]} />
                                                    <Box width="70%" alignItems='flex-end'>
                                                        <DefText text={item.mname} style={[styles.labelRight]} />
                                                    </Box>
                                                </HStack>
                                                <HStack style={[styles.labelBox]} alignItems='center'>
                                                    <DefText text="출발지 위치" style={[styles.labelLeft]} />
                                                    <Box width="70%" alignItems='flex-end'>
                                                        <DefText text={item.startAddress} style={[styles.labelRight]} />
                                                    </Box>
                                                </HStack>
                                                <HStack style={[styles.labelBox]} alignItems='center'>
                                                    <DefText text="도착지 위치" style={[styles.labelLeft]} />
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
                    <Box flex={1} justifyContent='center' alignItems='center'>
                        <DefText text='참여가능한 차량만대여 요청이 없습니다.' />
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
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(HomeCarAuction);