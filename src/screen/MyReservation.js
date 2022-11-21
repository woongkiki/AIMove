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
import SubHeader from '../components/SubHeader';
import Loading from '../components/Loading';

const {width, height} = Dimensions.get("window");

const MyReservation = (props) => {

    const {navigation, userInfo} = props;

    const [loading, setLoading] = useState(true);
    const [moveCate, setMoveCate] = useState("소형 이사");
    //const [twoCate, setTwoCate] = useState("사진");
    const [reservationLists, setReservationList] = useState([]);

    const reservationList = async () => {
        await setLoading(true);
        await Api.send('reservation_check', {'id':userInfo.id, "moveCate":moveCate}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('예약 내역 확인 성공::::: ', resultItem, arrItems);
                setReservationList(arrItems);
            }else{
                console.log('예약 내역 확인 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });
        await setLoading(false);
    }


    const reservationNavigation = (auction, item) => {
        if(auction == "소형 이사"){
            navigation.navigate("MyReservationAi", item);
        }else if(auction == "가정집 이사"){
            navigation.navigate("MyReservationTwoRoom", item);
            //console.log(auction);
        }else{
            navigation.navigate("MyReservationCar", item);
        }
    }

    useEffect(() => {
        reservationList();
    }, [moveCate])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle={'예약내역 확인'} navigation={navigation} />
            {
                loading ? 
                <Loading />
                :
                <ScrollView>
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
                    {/* {
                        moveCate == "가정집 이사" &&
                        <HStack px='25px' justifyContent={'space-between'} pt='15px'>
                            <TouchableOpacity onPress={()=>setTwoCate("사진")} style={[styles.twoTabButton, twoCate == "사진" && colorSelect.sky]}>
                                <DefText text="사진으로 이사" style={[styles.twoTabButtonText, twoCate == "사진" && [{color:'#fff'}, fweight.b]]} />
                                
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setTwoCate("방문")} style={[styles.twoTabButton, twoCate == "방문" && colorSelect.sky]}>
                                <DefText text="방문견적요청" style={[styles.twoTabButtonText, twoCate == "방문" && [{color:'#fff'}, fweight.b]]}  />
                            
                            </TouchableOpacity>
                        </HStack>
                    } */}
                    {
                        reservationLists != "" ?
                        reservationLists.map((item, index) => {
                            return(
                                <Box key={index}>
                                    <TouchableOpacity onPress={()=>reservationNavigation(moveCate, item)} style={[styles.payButton]} >
                                        <HStack alignItems={'center'} justifyContent={'space-between'}>
                                            <DefText text={"이사 날짜"} style={[styles.payButtonLabel]}  />
                                            <DefText text={item.moveDate.substring(0, 10) + " " + item.moveDatetime} style={[styles.payButtonText]}  />
                                        </HStack>
                                        <HStack alignItems={'center'} justifyContent={'space-between'} mt='20px'>
                                            <DefText text={"이사 전문가"} style={[styles.payButtonLabel]}  />
                                            <DefText text={item.ex_name} style={[styles.payButtonText]}  />
                                        </HStack>
                                        <HStack alignItems={'center'} justifyContent={'space-between'} mt='20px'>
                                            <DefText text={"결제 금액"} style={[styles.payButtonLabel]}  />
                                            {
                                                item.sumsum != "" ?
                                                <DefText text={numberFormat(item.sumsum) + "원 (세금포함)"} style={[styles.payButtonText]}  />
                                                :
                                                <DefText text="-" />
                                            }
                                        </HStack>
                                        <Box position={'absolute'} right='25px' top='50%' marginTop='18px'>
                                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:14, height:14, resizeMode:'contain'}} />
                                        </Box>
                                    </TouchableOpacity>
                                </Box>
                            )
                        })
                        :
                        <Box flex={1} py='40px' alignItems={'center'} justifyContent='center'>
                            <DefText text={moveCate + " 예약 내역이 존재하지 않습니다."} />
                        </Box>
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
    },
    payButtonLabel: {
        ...fsize.fs14,
        ...fweight.b
    },
    payButtonText: {
        ...fsize.fs14,
    },
    payButton: {
        padding:25,
        paddingRight:50,
        backgroundColor:'#fff',
        borderBottomWidth:7, 
        borderBottomColor:'#F3F4F5'
    },
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인

    })
)(MyReservation);