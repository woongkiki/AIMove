import React, {useState, useEffect, useCallback} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Select, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import {numberFormat, textLengthOverCut} from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ApiExpert from '../ApiExpert';
import ToastMessage from '../components/ToastMessage';
import {WebView} from 'react-native-webview';
import { BASE_URL } from '../Utils/APIConstant';
import Swiper from 'react-native-swiper';
import { useIsFocused } from '@react-navigation/native';

const {width} = Dimensions.get("window");

const ExpertExperience = (props) => {
    
    const {navigation, userInfo, member_chatCnt} = props;


    const today = new Date();
    let date = moment(today);
    let year = date.year();
    console.log("date::", year);

    //날짜 선택..
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateTimeText, setDateTimeText] = useState(date.format('MM'));
    const [loading, setLoading] = useState(true);
    const [moveType, setMoveType] = useState("소형이사");
    const [moveList, setMoveList] = useState([]);
    const [reviewList, setReviewList] = useState([]);

    const [sumPrice, setSumPrice] = useState("");

    const myMoveList = async () => {
        await setLoading(true);
        await ApiExpert.send('myInfo_view', {"ex_id":userInfo.ex_id, "days":dateTimeText}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('내 실적 가져오기 성공: ', resultItem, arrItems);
               setMoveList(arrItems);
            }else{
               console.log('내 실적 가져오기 실패!', resultItem);
            }
        });
        //리뷰내역
        await ApiExpert.send('review_list', {"ex_id":userInfo.ex_id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('내 후기 가져오기 성공: ', resultItem, arrItems);
               setReviewList(arrItems);
            }else{
               console.log('내 후기 가져오기 실패!', resultItem);
            }
        });
        await ApiExpert.send('price_venefit', {"ex_id":userInfo.ex_id, "days":dateTimeText}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('내 매출 가져오기 성공: ', resultItem, arrItems);
               setSumPrice(arrItems);
            }else{
               console.log('내 매출 가져오기 실패!', resultItem);
               setSumPrice(arrItems);
            }
        });
        await setLoading(false);
    }

    const isFocused = useIsFocused();

    const chatCntHandler = async () => {
        const formData = new FormData();
        formData.append('ex_id', userInfo.ex_id);
        formData.append('method', 'member_exchatCnt');

        const chat_cnt = await member_chatCnt(formData);

        //console.log("chat_cnt ExpertExperience Screen::", chat_cnt);
    }

    useEffect(() => {
        if(isFocused){
            chatCntHandler();
        }
    }, [isFocused])

    useEffect(()=> {
        myMoveList();
    }, [dateTimeText])

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        //console.log("A date has been picked: ", date);
        console.log(date.format("MM"));
        hideDatePicker();
        setDateTimeText(date.format("MM"))
    };

    return (
        <Box flex={1} backgroundColor='#fff'>
            {/* <SubHeader headerTitle='2022년 8월 실적' navigation={navigation} /> */}
            {
                loading ?
                <Box flex={1} justifyContent='center' alignItems='center'>
                    <ActivityIndicator size="large" color="#333" />
                </Box>
                :
                <ScrollView>
                    <HStack  height='50px' justifyContent={'flex-end'} alignItems='center'  width='100%' backgroundColor={'#F1F1F1'} borderRadius={7} >
                        <Box width='100%' position='absolute' height='50px' top='0' left='0' alignItems={'center'} justifyContent='center' >
                            <DefText text={year + "년 " + dateTimeText + "월 실적"} />
                        </Box>
                        <TouchableOpacity onPress={showDatePicker}>
                            <Image source={require('../images/carlendarNew.png')} alt='달력' style={{width:20, resizeMode:'contain', marginRight:25}}  />
                        </TouchableOpacity>

                    </HStack>
                    {
                        moveList != "" &&
                        <Box py='20px'>
                            {/* <HStack alignItems={'center'} justifyContent='space-between' mb='20px'>
                                <TouchableOpacity onPress={()=>setMoveType("소형이사")} style={[styles.expeienceTab, moveType == "소형이사" && colorSelect.sky]}>
                                    <DefText text="소형이사" style={[moveType == "소형이사" && {color:'#fff'}]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>setMoveType("가정집이사")} style={[styles.expeienceTab, moveType == "가정집이사" && colorSelect.sky]}>
                                    <DefText text="가정집이사" style={[moveType == "가정집이사" && {color:'#fff'}]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>setMoveType("차량만제공")} style={[styles.expeienceTab, moveType == "차량만제공" && colorSelect.sky]}>
                                    <DefText text="차량만제공" style={[moveType == "차량만제공" && {color:'#fff'}]} />
                                </TouchableOpacity>
                            </HStack> */}
                            <Swiper
                                loop={true}
                                height={196}
                                dot={
                                    <Box
                                    style={{
                                        backgroundColor: 'transparent',
                                        width: 7,
                                        height: 7,
                                        borderRadius: 7,
                                        marginLeft: 7,
                                        marginRight: 7
                                    }}
                                    />
                                }
                                activeDot={
                                    <Box
                                    style={{
                                        backgroundColor: 'transparent',
                                        width: 7,
                                        height: 7,
                                        borderRadius: 7,
                                        marginLeft: 7,
                                        marginRight: 7
                                    }}
                                    />
                                }
                                paginationStyle={{
                                    bottom: 20
                                }}
                                backgroundColor='transparent'
                            >
                            {
                                moveList.map((item, index) => {

                                    let auctionDate = moment(item.auction_date);
                                    auctionDate = auctionDate.format("YYYY년 MM월 DD일");

                                    return(
                                        <Box key={index} px='25px' py='10px'>
                                            <Box  px='15px' py='20px' borderRadius={'10px'} backgroundColor='#fff' shadow={4}>
                                                <DefText text="소형이사(원룸)" style={[styles.moveTitle]} />
                                                <DefText text={auctionDate} style={[styles.dateTitle]} />
                                                <Box style={[styles.priceBox]}>
                                                    <HStack justifyContent={'space-between'}>
                                                        <DefText text="금액" style={[styles.oneBoxLeftLabel]} />
                                                        <DefText text={numberFormat(item.auction_price) + "원"} style={[styles.oneBoxRightLabel]} />
                                                    </HStack>
                                                    <HStack mt='15px' justifyContent={'space-between'}>
                                                        <DefText text="합계" style={[styles.oneBoxLeftLabel]} />
                                                        <DefText text={numberFormat(item.auction_price) + "원"} style={[styles.oneBoxRightLabel]} />
                                                    </HStack>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                })
                            }
                            </Swiper>
                        </Box>
                    }
                    
                    <Box borderTopWidth={8} borderTopColor='#F3F4F5' p='25px'>
                        <HStack style={[styles.benefitBox]}>
                            <DefText text="이번 달 총 매출" style={[styles.benefitText]} />
                            <DefText text={sumPrice != "" ? numberFormat(parseInt(sumPrice)) + "원" : "-"} style={[styles.benefitText]} />
                        </HStack>
                        {/* <HStack style={[styles.monthBenefitBox]}>
                            <TouchableOpacity onPress={()=>ToastMessage("준비중입니다.")}>
                                <HStack style={[styles.monthBenefitInner]}>
                                    <DefText text="월별 매출액" style={[styles.monthBenefitText]} />
                                    <Image
                                        source={require("../images/ex_arr.png")}
                                        alt="화살표"
                                        style={{
                                            width:20,
                                            height:10,
                                            resizeMode:'contain'
                                        }}
                                    />
                                </HStack>
                            </TouchableOpacity>
                        </HStack> */}

                        <Box style={[styles.priceSendBox]}>
                            <DefText text={"현재 "+ userInfo?.ex_name + " 전문가님은 내집이사 무료 사용 혜택을 받고 계십니다."} style={[styles.priceSendText]}  />
                        </Box>
                        <HStack style={[styles.benefitBox, {borderColor:'#FF5050'}]} mt='20px'>
                            <DefText text="월 사용료" style={[styles.benefitText, {color:'#FF5050'}]} />
                            <DefText text="무료" style={[styles.benefitText, {color:'#FF5050'}]} />
                        </HStack>
                        {/* <HStack style={[styles.monthBenefitBox]}>
                            <TouchableOpacity onPress={()=>ToastMessage("준비중입니다.")}>
                                <HStack style={[styles.monthBenefitInner]}>
                                    <DefText text="납부내역" style={[styles.monthBenefitText]} />
                                    <Image
                                        source={require("../images/ex_arr.png")}
                                        alt="화살표"
                                        style={{
                                            width:20,
                                            height:10,
                                            resizeMode:'contain'
                                        }}
                                    />
                                </HStack>
                            </TouchableOpacity>
                        </HStack> */}
                        <Box my='20px'>
                           
                            <Box width={width} height={ Platform.OS === 'ios' ? '320px' : '300px'} mt='20px' ml='-20px'>
                                <WebView
                                    originWhitelist={['*']}
                                    source={{uri:BASE_URL + "/chart.php?expert_id=" + userInfo?.ex_id}}
                                    // onMessage={(e)=>{
                                    //     console.log('e', e.nativeEvent.data);
                                    //     setStartAddress(e.nativeEvent.data);
                                    //     setInputAddr(e.nativeEvent.data);
                                    // }}
                                    style={{
                                        opacity:0.99,
                                        minHeight:1,
                                        marginTop:-50,
                                        
                                    }}
                                />
                                <Box width={width} height={ Platform.OS === 'ios' ? '320px' : '300px'} position={'absolute'} top='0' left='0' backgroundColor={'transparent'} />
                            </Box>
                        </Box>
                    </Box>
                    {
                        reviewList != "" &&
                        <Box backgroundColor='#fff'  shadow={6} overflow='hidden'>
                            <HStack alignItems={'flex-end'} px='25px' >
                                <DefText text='이용후기' style={[styles.reviewTitle]} />
                                <DefText text={'(' + reviewList.length +'개)'} style={[styles.reviewCountTitle]} />
                            </HStack>
                            <Box >
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                >
                                      <HStack mt='20px' pb='25px' px='25px' >
                                    {
                                        reviewList.map((item, index)=> {
                                            return(
                                              
                                                <TouchableOpacity key={index} activeOpacity={0.8} style={[index != 0 ? {marginLeft:20} : {marginLeft:0}]}>
                                                    <Box p='20px' backgroundColor='#FCFCFC' borderRadius={10} shadow={3} style={{width: (width-50) * 0.68}}>
                                                        <HStack alignItems={'center'} justifyContent='space-between'>
                                                            <VStack>
                                                                <HStack alignItems={'flex-end'}>
                                                                    <DefText text={item.review_name} style={[styles.expertName]} />
                                                                </HStack>
                                                                {/* <DefText text='포장이사' style={[styles.expertCate]} /> */}
                                                                {/* <DefText text={ numberFormat(230000) + '원' } style={[styles.expertPrice]} /> */}
                                                            </VStack>
                                                            {
                                                                item.expertProfile != "" ?
                                                                <Image 
                                                                    source={{uri:BASE_URL + "/data/file/member/" + item.expertProfile}}
                                                                    alt='홍길동'
                                                                    style={[
                                                                        {
                                                                            width: 60,
                                                                            height: 60,
                                                                            borderRadius: 10,
                                                                            resizeMode:'stretch'
                                                                        }
                                                                    ]}
                                                                />
                                                                :
                                                                <Image 
                                                                    source={{uri:BASE_URL + "/images/appLogo.png"}}
                                                                    alt={userInfo?.ex_name}
                                                                    style={[
                                                                        {
                                                                            width: 60,
                                                                            height: 60,
                                                                            borderRadius: 10,
                                                                            resizeMode:'stretch'
                                                                        }
                                                                    ]}
                                                                />

                                                            }
                                                        </HStack>
                                                        <Box mt='10px'>
                                                            <HStack>
                                                                <Image
                                                                    source={require('../images/starIcon.png')}
                                                                    alt='별점'
                                                                    style={[
                                                                        {
                                                                            width: (width - 50) * 0.04,
                                                                            height: (width - 50) * 0.038,
                                                                            resizeMode:'contain'
                                                                        }
                                                                    ]}
                                                                />
                                                                <DefText text={item.scoreAvg} style={[styles.scoreText]} />
                                                            </HStack>
                                                            <DefText text={ textLengthOverCut(item.review_open, 18, '...')} style={[styles.reviewContent]} />
                                                        </Box>
                                                    </Box>
                                                </TouchableOpacity>
                                               
                                            )
                                        })
                                    }
                                     </HStack>
                                </ScrollView>
                            </Box>
                        </Box>
                    }
                </ScrollView>
            }
           
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                display={'spinner'}
            />
            
        </Box>
    );
};

const styles = StyleSheet.create({
    moveTitle: {
        ...fsize.fs19,
        ...fweight.b,
    },
    dateTitle: {
        ...fsize.fs13,
        color:'#777',
        marginVertical:15
    },
    priceBox: {
        paddingTop:15,
        borderTopWidth:2,
        borderTopColor:'#F3F4F5'
    },
    oneBoxLeftLabel: {
        ...fsize.fs15,
        ...fweight.b
    },
    oneBoxRightLabel: {
        ...fsize.fs15,
        color:'#747474'
    },

    benefitBox: {
        borderWidth:1,
        borderColor:'#0195FF',
        borderRadius:7,
        height: 57,
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:20
    },
    benefitText: {
        color:'#0195FF',
        ...fsize.fs16,
        ...fweight.b
    },
    monthBenefitBox: {
        justifyContent:'flex-end',
        marginTop:10,
    },
    monthBenefitInner: {
        alignItems:'center'
    },
    monthBenefitText: {
        ...fsize.fs12,
    },

    priceSendBox: {
        marginTop:25,
    },
    priceSendText: {
        ...fsize.fs14,
    },


    reviewTitle: {
        ...fweight.b
    },
    reviewCountTitle: {
        ...fsize.fs13,
        marginLeft:5
    },
    expertName: {
        ...fweight.b,
        marginRight:5
    },
    expertSubject: {
        ...fsize.fs12,
        ...fweight.b,
        color:'#979797'
    },
    expertCate: {
        ...fsize.fs13,
        color:'#6C6C6C',
        marginVertical:10
    },
    expertPrice: {
        ...fsize.fs13,
        ...fweight.m,
        color:'#777676'   
    },
    scoreText: {
        ...fsize.fs12,
        ...fweight.b,
        color:'#6C6C6C',
        marginLeft:7
    },
    reviewContent: {
        ...fsize.fs12,
        marginTop:20,
    },
    expeienceTab: {
        width: (width-50) * 0.3,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        ...colorSelect.gray,
        borderRadius:5
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_chatCnt: (user) => dispatch(UserAction.member_chatCnt(user))
    })
)(ExpertExperience);