import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator, LogBox } from 'react-native';
import { Box, VStack, HStack } from 'native-base';
import { DefButton, DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import { numberFormat } from '../common/DataFunction';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import CountDown from '@ilterugur/react-native-countdown-component';
import { useIsFocused } from '@react-navigation/native';
import Twoauction from '../components/Twoauction';
import AIauction from '../components/AIauction';
import Carauction from '../components/Carauction';
import CarAuctionEnd from '../components/CarAuctionEnd';
import TwoauctionImage from '../components/TwoauctionImage';
import TwoauctionImageEnd from '../components/TwoauctionImageEnd';
import TwoauctionEnd from '../components/TwoauctionEnd';
import AIauctionEnd from '../components/AIauctionEnd';

LogBox.ignoreAllLogs();

const {width, height} = Dimensions.get("window");

const Reservation = (props) => {

    const {navigation, userInfo, route, member_chatCnt} = props;
    const {params} = route;
    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [auctionList, setAuctionList] = useState("");
    const [expertList, setExpertList] = useState([]);
    const [tabCategory, setTabCategory] = useState("찾는중");
    const [expertCategory, setExpertCategory] = useState("가격적당");
    const [moveCate, setMoveCate] = useState("소형 이사");
    const [twoCate, setTwoCate] = useState("사진");


    const chatCntHandler = async () => {
        const formData = new FormData();
        formData.append('mid', userInfo.id);
        formData.append('method', 'member_chatCnt');

        const chat_cnt = await member_chatCnt(formData);

        console.log("chat_cnt Reservation Screen::", chat_cnt);
    }


    const reservationApi = async () => {
        await setLoading(true);
        await Api.send('auction_myList', {'id':userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('역경매 리스트 보기: ', resultItem);
               setAuctionList(arrItems);
            }else{
               console.log('역경매 리스트 실패!', resultItem);
               setAuctionList("");
            }
        });
        await Api.send('auction_expertList', {'id':userInfo.id, 'ai_idx':auctionList.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('역경매 참여한 전문가 보기: ', resultItem, arrItems);
               //setAuctionList(arrItems);
               setExpertList(arrItems);
            }else{
               console.log('역경매 참여한 전문가 실패!', resultItem);
               
            }
        });
        await setLoading(false);
    }

    

    useEffect(()=>{
        if(isFocused){
            reservationApi();
            chatCntHandler(); //채팅 카운트..
        }

        if(params.moveCate != ""){
            setMoveCate(params.moveCate);
        }

        if(params.tabCategory != ""){
            setTabCategory(params.tabCategory)
        }

        if(params.twoCate != ""){
            setTwoCate(params.twoCate)
        }

    }, [isFocused])

    return (
        <Box flex={1} backgroundColor='#fff'>
            {
                loading ?
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                <HStack>
                    <TouchableOpacity onPress={()=>setTabCategory("찾는중")} style={[styles.tabButton]}>
                        <DefText text="전문가 찾는중" style={[styles.tabButtonText, tabCategory == "찾는중" && [{color:'#000'}, fweight.b]]} />
                        <Box width={width/2} height={ tabCategory == '찾는중' ? '3px' : '1px'} backgroundColor={ tabCategory == '찾는중' ? '#0195FF' : '#CDCDCD'} position='absolute' bottom='0' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setTabCategory("완료")} style={[styles.tabButton]}>
                        <DefText text="전문가 찾기 완료" style={[styles.tabButtonText, tabCategory == "완료" && [{color:'#000'}, fweight.b]]} />
                        <Box width={width/2} height={ tabCategory == '완료' ? '3px' : '1px'} backgroundColor={ tabCategory == '완료' ? '#0195FF' : '#CDCDCD'} position='absolute' bottom='0'/>
                    </TouchableOpacity>
                </HStack>
                <HStack>
                    <TouchableOpacity onPress={()=>setMoveCate("소형 이사")} style={[styles.tabButton, {width:width * 0.33}]}>
                        <DefText text="소형 이사" style={[styles.tabButtonText, moveCate == "소형 이사" && [{color:'#000'}, fweight.b]]} />
                        <Box width={width * 0.33} height={ moveCate == '소형 이사' ? '3px' : '1px'} backgroundColor={ moveCate == '소형 이사' ? '#0195FF' : '#CDCDCD'} position='absolute' bottom='0' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setMoveCate("가정집 이사")} style={[styles.tabButton, {width:width * 0.33},]}>
                        <DefText text="가정집 이사" style={[styles.tabButtonText, moveCate == "가정집 이사" && [{color:'#000'}, fweight.b]]}  />
                        <Box width={width * 0.33} height={ moveCate == '가정집 이사' ? '3px' : '1px'} backgroundColor={ moveCate == '가정집 이사' ? '#0195FF' : '#CDCDCD'} position='absolute' bottom='0' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setMoveCate("차량제공")} style={[styles.tabButton, {width:width * 0.33}]}>
                        <DefText text="차량제공" style={[styles.tabButtonText, moveCate == "차량제공" && [{color:'#000'}, fweight.b]]}  />
                        <Box width={width * 0.33} height={ moveCate == '차량제공' ? '3px' : '1px'} backgroundColor={ moveCate == '차량제공' ? '#0195FF' : '#CDCDCD'} position='absolute' bottom='0' />
                    </TouchableOpacity>
                </HStack>
                {
                    moveCate == "가정집 이사" &&
                    <HStack px='25px' justifyContent={'space-between'} pt='15px'>
                        <TouchableOpacity onPress={()=>setTwoCate("사진")} style={[styles.twoTabButton, twoCate == "사진" && colorSelect.sky]}>
                            <DefText text="사진으로 이사" style={[styles.twoTabButtonText, twoCate == "사진" && [{color:'#fff'}, fweight.b]]} />
                            
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setTwoCate("방문")} style={[styles.twoTabButton, twoCate == "방문" && colorSelect.sky]}>
                            <DefText text="방문견적요청" style={[styles.twoTabButtonText, twoCate == "방문" && [{color:'#fff'}, fweight.b]]}  />
                           
                        </TouchableOpacity>
                    </HStack>
                }
                
                {
                    (moveCate == "소형 이사" && tabCategory == "찾는중") &&
                    <AIauction navigation={navigation} />
                }
                {
                    (moveCate == "소형 이사" && tabCategory == "완료") &&
                    <AIauctionEnd navigation={navigation} />
                }
                {
                    (moveCate == "가정집 이사" && tabCategory == "찾는중" &&  twoCate == "사진") &&
                    <TwoauctionImage navigation={navigation} />
                }
                {
                    (moveCate == "가정집 이사" && tabCategory == "완료" &&  twoCate == "사진") &&
                    <TwoauctionImageEnd navigation={navigation} />
                }
                {
                    (moveCate == "가정집 이사" && tabCategory == "찾는중" && twoCate == "방문") &&
                    <Twoauction navigation={navigation} />
                }
                {
                    (moveCate == "가정집 이사" && tabCategory == "완료" && twoCate == "방문") &&
                    <TwoauctionEnd navigation={navigation} />
                }
                {
                    (moveCate == "차량제공" && tabCategory == "찾는중") &&
                    <Carauction navigation={navigation} />
                }
                 {
                    (moveCate == "차량제공" && tabCategory == "완료") &&
                    <CarAuctionEnd navigation={navigation} />
                }
                </ScrollView>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    tabButton: {
        width:width / 2,
        height:50,
        justifyContent:'center',
        alignItems:'center'
    },
    tabButtonText: {
        ...fweight.r,
        color:'#CDCDCD'
    },
    priceBox: {
        width: width - 50,
        height:55,
        borderWidth:1,
        borderColor:'#0195ff',
        borderRadius:7,
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:20
    },
    priceLeftText: {
        ...fweight.b
    },
    priceRightText: {
        ...fweight.b,
        color:'#0195FF'
    },
    expertCateBtn: {
        paddingBottom:13,
        marginRight:15
    },
    expertCateBtnText: {
        ...fsize.fs13,
        color:'#BEBEBE',
    },
    checkIcons: {
        ...fsize.fs12,
        marginLeft:5
    },
    certiLabel : {
        ...fsize.fs14,
        ...fweight.b
    },
    certiSmall: {
        ...fsize.fs14
    },
    reserButton: {
        width: (width - 50) * 0.48,
        height:50,
        borderRadius:10,
        paddingTop:0,
        paddingBottom:0
    },
    reserButtonText: {
        ...fweight.m
    },
    expertImportant: {
        ...fsize.fs14,
        ...fweight.b,
        lineHeight:20,
        color:'#FF5050',
        marginTop:20
    },
    twoTabButton: {
        width: (width-50) * 0.48,
        height:45,
        ...colorSelect.gray,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center'
    },
    twoTabButtonText: {
        color:'#000',
        ...fweight.r,
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
        member_chatCnt: (user) => dispatch(UserAction.member_chatCnt(user))
    })
)(Reservation);