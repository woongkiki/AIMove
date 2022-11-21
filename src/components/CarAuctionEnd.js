import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator, LogBox } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefButton, DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import { numberFormat } from '../common/DataFunction';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import CountDown from '@ilterugur/react-native-countdown-component';
import { useIsFocused } from '@react-navigation/native';
import Font from '../common/Font';
import { BASE_URL } from '../Utils/APIConstant';
import ToastMessage from './ToastMessage';

const {width} = Dimensions.get("window");

const CarAuctionEnd = (props) => {

    const {navigation, userInfo} = props;


    const [loading, setLoading] = useState(true);
    const [carEndList, setCarEndList] = useState([]);

    const carauctionList = async () => {
        await setLoading(true);
        await Api.send('car_carAuctionEnd', {'mid':userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('차량제공요청 완료 리스트 보기: ', arrItems, resultItem);
               //setCarAuctionList(arrItems);
               setCarEndList(arrItems);
            }else{
               console.log('차량제공요청 완료 리스트 실패!', resultItem);
                
            }
        });
        
        await setLoading(false);
    }


    const reviewWrite = (moveDate, today, item) => {
        
        if(moveDate > today){
            ToastMessage("이사완료 후 후기를 작성하실 수 있습니다.");
        }else{
            navigation.navigate("ReviewScreen1", item);
        }
        //navigation.navigate("ReviewScreen1")
    }

    useEffect(() => {
        carauctionList();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            {
                loading?
                <Box flex={1} alignItems='center' justifyContent={'center'} py='40px'>
                   <ActivityIndicator size={'large'} color='#333' />
                </Box>
                :
                <Box>
                    {
                        carEndList != "" ?
                        carEndList.map((item, index) => {
                            return(
                                <Box px='25px' key={index}>
                                    <Box>
                                        <HStack justifyContent={'space-between'} mt='30px'>
                                            <Box>
                                                <HStack alignItems={'flex-end'}>
                                                    <DefText text={item.expert_name} style={[fsize.fs15, fweight.b, {marginRight:5}]} />
                                                    <DefText text="이사전문가" style={[fsize.fs13, fweight.b, {color:'#979797'}]} />
                                                </HStack>
                                                {/* <DefText text={item.ex_service_name} style={[fsize.fs12, {marginVertical:10}]} /> */}
                                                <DefText text="이사서비스" style={[fsize.fs13, {color:'#6C6C6C', marginTop:10}]} />
                                                <HStack mt='10px'>
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
                                                    <DefText text={item.star_avg} style={[fsize.fs12, fweight.b, {color:'#6C6C6C', marginLeft:5}]} />
                                                </HStack>
                                            </Box>
                                            <Box>
                                                {
                                                    item.expert_profile != "" ?
                                                    <Image 
                                                        source={{uri:BASE_URL + '/data/file/expert/' + item.expert_profile}}
                                                        alt='홍길동'
                                                        style={[
                                                            {
                                                                width: (width - 50) * 0.26,
                                                                height: (width - 50) * 0.26,
                                                                borderRadius: 200,
                                                                resizeMode:'stretch'
                                                            }
                                                        ]}
                                                    />
                                                    :
                                                    <Image 
                                                        source={{uri:BASE_URL + "/images/appLogo.png"}}
                                                        alt='홍길동'
                                                        style={[
                                                            {
                                                                width: (width - 50) * 0.26,
                                                                height: (width - 50) * 0.26,
                                                                borderRadius: 200,
                                                                resizeMode:'stretch'
                                                            }
                                                        ]}
                                                    />
                                                }
                                            </Box>
                                        </HStack>
                                        <HStack mt='10px' pb='10px'>
                                            <HStack alignItems={'center'} mr='10px'> 
                                                <Image 
                                                    source={require("../images/certiCheckIcon.png")}
                                                    style={{
                                                        width:16,
                                                        height:16,
                                                        resizeMode:'contain'
                                                    }}
                                                />
                                                <DefText text="본인인증완료" style={[styles.checkIcons, {color:'#65D97C'}]} />
                                            </HStack>
                                            {
                                                item.expert_certi != "" &&
                                                <HStack alignItems={'center'}>
                                                    <Image 
                                                        source={require("../images/companyCheckIcon.png")}
                                                        style={{
                                                            width:16,
                                                            height:16,
                                                            resizeMode:'contain'
                                                        }}
                                                    />
                                                    <DefText text="사업자인증완료" style={[styles.checkIcons, {color:'#0E57FF'}]} />
                                                </HStack>
                                            }
                                        </HStack>
                                        <Box py='10px' borderTopWidth={2} borderBottomWidth={2} borderTopColor='#F3F4F5' borderBottomColor={'#F3F4F5'}>
                                            <HStack justifyContent={'space-between'} alignItems='center'>
                                                <Box width="65%">
                                                    <DefText text={item.ex_service_status} style={[styles.certiLabel]} />
                                                </Box>
                                                <HStack alignItems={'center'} width="35%" justifyContent={'flex-end'}>
                                                    <DefText text='이사 건수 ' style={[styles.certiSmall]} />
                                                    <DefText text={item.expert_move_cnt} style={[styles.certiLabel, {borderBottomWidth:1}]}/>
                                                    <DefText text=' 건' style={[styles.certiSmall]} />
                                                </HStack>
                                            </HStack>
                                            <HStack justifyContent={'space-between'} alignItems='center' mt='15px' >
                                                <DefText text={'경력 ' + item.career} style={[styles.certiLabel]} />
                                                <HStack alignItems={'center'}>
                                                    <DefText text='후기 ' style={[styles.certiSmall]} />
                                                    <DefText text={item.expert_review_cnt} style={[styles.certiLabel, {borderBottomWidth:1}]}/>
                                                    <DefText text=' 개' style={[styles.certiSmall]} />
                                                </HStack>
                                            </HStack>
                                        </Box>
                                        <Box pt='10px'>
                                            <HStack justifyContent={'space-between'}>
                                                <DefButton 
                                                    text="전문가정보" 
                                                    btnStyle={[styles.reserButton, {backgroundColor:'#DFDFDF'}]}
                                                    textStyle={[styles.reserButtonText]}
                                                    onPress={()=>navigation.navigate("ReservationExpert", {"id":item.expert_id, "pay":"S"})}
                                                />
                                                <DefButton 
                                                    text="후기작성" 
                                                    btnStyle={[styles.reserButton, {backgroundColor:'#0195FF'}]}
                                                    textStyle={[styles.reserButtonText, {color:'#fff'}]}
                                                    onPress={()=>reviewWrite(item.moveDates, item.today, item)}
                                                />
                                            </HStack>
                                            {
                                                item.moveDates < item.today &&
                                                <DefText text={"서비스에 대한 후기를 남겨주세요\n14일이 지나면 후기를 남길 수 없어요!"} style={[styles.expertImportant]} />
                                            }
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        })
                        :
                        <Box py='40px' alignItems={'center'} justifyContent='center'>
                            <DefText text="완료된 차량내역이 없습니다." />
                        </Box>
                    }
                </Box>
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
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(CarAuctionEnd);