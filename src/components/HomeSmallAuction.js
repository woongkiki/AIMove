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

const {width} = Dimensions.get("window");

const HomeSmallAuction = (props) => {

    const {navigation, userInfo} = props;
    const [auctionData, setAuctionData] = useState([]);
    const [myAucitonIdx, setMyAuctionIdx] = useState([]);
    const [myAuctionPrice, setMyAuctionPrice] = useState([]);

    const auctionListApi = async () => {
      
         ApiExpert.send('auction_possiblelist', {'id':userInfo.ex_id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('참여가능한 역경매 리스트 보기: ', resultItem, arrItems);
                setAuctionData(arrItems);
            }else{
               console.log('참여가능한 역경매 리스트 실패!', resultItem);
               
            }
        });

        ApiExpert.send('auction_myAuction', {'ex_id':userInfo.ex_id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('내가 참여한 소형이사 리스트: ', resultItem, arrItems);
               setMyAuctionIdx(arrItems.idx);
               setMyAuctionPrice(arrItems.price);
            }else{
               console.log('내가 참여한 소형이사 리스트 실패!', resultItem);
               setMyAuctionIdx("");
               setMyAuctionPrice("");
            }
        });
    }


    useEffect(()=> {
        auctionListApi();
    }, [])


    return (
        <Box flex={1} backgroundColor='#fff'>
            {
                auctionData != "" ?
                <ScrollView>
                    <Box px='25px' py='25px'>
                        {
                            auctionData.map((item, index) => {
                                return(
                                    <Box key={index} backgroundColor={'#fff'} borderRadius='10px' shadow={9} mt={ index != 0 ? "20px" : 0}>
                                        <TouchableOpacity key={index} style={[styles.moveButton]} onPress={()=>navigation.navigate("ExpertAuctionView", item)}>
                                            <HStack justifyContent={'space-between'} pb='15px' borderBottomWidth={1} borderBottomColor='#ccc' flexWrap={'wrap'} alignItems='center'>
                                                <VStack width='60%' >
                                                    <DefText text={item.moveType} style={[styles.moveTitle]} />
                                                    <DefText text={'이사날짜 : ' + item.moveDateChange} style={[styles.moveDate]} />
                                                    <CountDown 
                                                        until={item.times}
                                                        timeToShow={['H', 'M', 'S']}
                                                        timeLabels={{m: null, s: null}}
                                                        size={14}
                                                        digitStyle={{width:22, height:'auto', marginTop:4}}
                                                        //digitTxtStyle={[fsize.fs16, fweight.m, {color:'#000'}]}
                                                        digitTxtStyle={{fontSize:16, fontFamily:Font.SCoreDreamM, color:'#000'}}
                                                        showSeparator
                                                        style={{marginTop:-4, alignItems:'flex-start'}}
                                                    />
                                                    {
                                                        myAucitonIdx.includes(item.idx) &&
                                                        <Box mt='10px'>
                                                            <DefText text={'신청완료'} style={[styles.moveTitle, {color:'#0195ff'}]}  />
                                                        </Box>
                                                    }
                                                    
                                                </VStack>
                                                <Box width='40%'>
                                                    <Box width='100%' height={'100px'} borderRadius='5px' overflow={'hidden'}>
                                                    <Image 
                                                        source={{uri: BASE_URL + "/data/file/ai/" + item.mid + "/" + item.imgName}}
                                                        style={{
                                                            width:'100%',
                                                            height:100,
                                                            resizeMode:'stretch',
                                                        }}
                                                    />
                                                    </Box>
                                                </Box>
                                            
                                            </HStack>
                                            <Box>
                                                {
                                                    myAucitonIdx.includes(item.idx) &&
                                                    <HStack style={[styles.labelBox]}>
                                                        <Box width='25%' >
                                                            <DefText text="입찰 금액" style={[styles.labelLeft]} />
                                                        </Box>
                                                        <Box width='70%' alignItems='flex-end'>
                                                            {
                                                                myAuctionPrice != "" ?
                                                                <DefText text={ numberFormat(myAuctionPrice[myAucitonIdx.indexOf(item.idx)]) + '원'} style={[styles.labelRight]} />
                                                                :
                                                                <DefText text={ '-'} style={[styles.labelRight]} />
                                                            }
                                                        </Box>
                                                    </HStack>
                                                }
                                                <HStack style={[styles.labelBox]}>
                                                    <Box width='25%' >
                                                        <DefText text="AI 추천견적" style={[styles.labelLeft]} />
                                                    </Box>
                                                    <Box width='70%' alignItems='flex-end'>
                                                        <DefText text={ numberFormat(item.lowPrice) + '원 ~ ' + numberFormat(item.highPrice) + '원'} style={[styles.labelRight]} />
                                                    </Box>
                                                </HStack>
                                                <HStack style={[styles.labelBox]}>
                                                    <Box width='25%' >
                                                        <DefText text="출발지" style={[styles.labelLeft]} />
                                                    </Box>
                                                    <Box width='70%' alignItems='flex-end'>
                                                        <DefText text={item.startAddress} style={[styles.labelRight]} />
                                                    </Box>
                                                </HStack>
                                                <HStack style={[styles.labelBox]}>
                                                    <Box width='25%' >
                                                        <DefText text="도착지" style={[styles.labelLeft]} />
                                                    </Box>
                                                    <Box width='70%' alignItems='flex-end'>
                                                        <DefText text={item.destinationAddress} style={[styles.labelRight]} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        </TouchableOpacity>
                                    </Box>
                                )
                            })
                        }
                    </Box>
                </ScrollView>
                :
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <DefText text='참여가능한 소형이사목록이 없습니다.' />
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
        ...fsize.fs18,
        ...fweight.b,
        
    },
    moveDate: {
        color:'#777',
        ...fsize.fs12,
        marginTop:10,
        marginBottom:10
    },
    labelBox: {
        justifyContent:'space-between',
        marginTop:15,
        alignItems:'center'
    },
    labelLeft: {
        ...fsize.fs15,
        ...fweight.b
    },
    labelRight: {
        color:'#747474',
        ...fsize.fs15,
        textAlign:'right'
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
)(HomeSmallAuction);