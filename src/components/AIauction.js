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
import ToastMessage from './ToastMessage';
import { BASE_URL } from '../Utils/APIConstant';

import IMP from 'iamport-react-native';

const {width} = Dimensions.get("window");

const AIaiction = (props) => {

    const {navigation, userInfo} = props;

   

    const [auctionList, setAuctionList] = useState("");
    const [expertList, setExpertList] = useState([]);
    const [expertCategory, setExpertCategory] = useState("가격 낮은순");

    const [reservationModal, setReservationModal] = useState(false);
    const [reservationIdx, setReservationIdx] = useState(""); //예약선택한 업체 idx
    const [reservationexid, setReservationExid] = useState(""); //예약선택한 전문가 아이디
    const [reservationexname, setReservationExName] = useState(""); //예약선택한 전문가 아이디
    const [reservationCancleModal, setReservationCancleModal] = useState(false);

    const isFocused = useIsFocused();

    const reservationApi = async () => {
        await Api.send('auction_myList', {'id':userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('역경매 리스트 보기: ', arrItems);
               setAuctionList(arrItems);
            }else{
               console.log('역경매 리스트 실패!', resultItem);
               setAuctionList("");
            }
        });
       
    }

    const reservationListApi = async () => {
        await Api.send('auction_expertList', {'id':userInfo.id, 'ai_idx':auctionList.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('역경매 참여한 전문가 보기: ', arrItems);
               //setAuctionList(arrItems);
               setExpertList(arrItems);
            }else{
               console.log('역경매 참여한 전문가 실패!', resultItem);
               
            }
        });
    }


    const aiAuctionCancle = () => {

        console.log("견적 취소");
        Api.send('ai_aiAuctionCancle', {'idx':auctionList.idx, "mid":userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('AI 견적 요청 취소 보기: ', resultItem);
               ToastMessage(resultItem.message);
               reservationApi();
               setAuctionList([]);
                setReservationCancleModal(false);
            }else{
               console.log('AI 견적 요청 취소 실패!', resultItem);
               ToastMessage(resultItem.message);
               setReservationCancleModal(false);
            }
        });
    }


    const aiAuctionReservation = () => {
        Api.send('ai_aiReservation', {"aucidx":reservationIdx, "ex_id":reservationexid, "mid":userInfo.id, "exname":reservationexname}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('AI 견적 예약 성공: ', resultItem);
               //setExpertList(arrItems);
               setReservationModal(false);
               reservationApi();
               ToastMessage(resultItem.message);


               navigation.navigate('TabNav', {
                    screen: 'Chating',
                });

            }else{
               console.log('AI 견적 예약 실패!', resultItem);
               
            }
        });
    }

    const reservationButtion = (idx, exid, exname) => {
        //console.log(idx, exid)
        setReservationIdx(idx);
        setReservationExid(exid);
        setReservationExName(exname);
        setReservationModal(true);
    }

    

    useEffect(()=> {
        if(auctionList != ""){
            reservationListApi();
        }
    }, [auctionList])

    useEffect(()=>{
        if(isFocused){
            reservationApi();
        }

        return() => {
            setAuctionList("");
        }

    }, [isFocused])

    return (
        <Box flex={1}>
            {
                auctionList != "" ?
                <Box flex={1}>
                    <Box p='25px' py='15px'>
                        <HStack  style={[styles.priceBox]}>
                            <Box width='30%'>
                                <DefText text={"AI 추천 견적"} style={[styles.priceLeftText]} />
                            </Box>
                            {
                                auctionList != "" ?
                                <Box width='70%' alignItems={'flex-end'}>
                                    <DefText text={ numberFormat(auctionList.lowPrice) + "원 ~ " + numberFormat(auctionList.highPrice + '원') } style={[styles.priceRightText]} />
                                </Box>
                                :
                                <Box width='70%' >
                                    <DefText text="-" />
                                </Box>
                            }
                        </HStack>
                        <HStack style={[styles.priceBox, {borderColor:'#D6D6D6', marginTop:15}]}>
                            <DefText text="전문가 찾는 시간" style={[styles.priceLeftText]} />
                            {/* <DefText text="23:54:55" style={[styles.priceRightText, fweight.r, {color:'#000'}]} /> */}
                            {
                                auctionList != "" ?
                                <CountDown 
                                    until={auctionList.times}
                                    timeToShow={['H', 'M', 'S']}
                                    timeLabels={{m: null, s: null}}
                                    size={14}
                                    digitStyle={{width:20, height:'auto', marginTop:4}}
                                    digitTxtStyle={{fontSize:16, lineHeight:19, color:'#000', fontFamily:Font.SCoreDreamB, fontWeight:'bold'}}
                                    showSeparator
                                    style={{marginTop:-4}}
                                />
                                :
                                <DefText text="-" />
                            }
                            
                        </HStack>
                        <TouchableOpacity onPress={()=>navigation.navigate("AIMoveConfirm", auctionList)} style={{borderRadius:5, alignItems:'center', justifyContent:'center', height:45, marginTop:10, backgroundColor:'#0195ff'}}>
                            <DefText text={"견적 확인"} style={[fweight.b, {color:'#fff'}]}  />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setReservationCancleModal(true)} style={{borderRadius:5, alignItems:'center', justifyContent:'center', height:45, marginTop:15, borderWidth:1, borderColor:'#f00'}}>
                            <DefText text="전문가 찾기 취소" style={{color:'#f00'}} />
                        </TouchableOpacity>
                    </Box>
                    {
                        expertList != "" ?
                        <Box>
                            <Box px='25px' pt='25px' borderTopWidth={7} borderTopColor='#F3F4F5' flex={1}>
                                {
                                (auctionList.moveCategory == "이사 비용이 착한 업체" || auctionList.moveCategory == "가격은 적당, 서비스가 좋은 업체") &&
                                    <HStack>
                                        <TouchableOpacity onPress={()=>setExpertCategory("가격 낮은순")} style={[styles.expertCateBtn]}>
                                            <DefText text="가격 낮은순" style={[styles.expertCateBtnText, expertCategory == '가격 낮은순' && [{color:'#0195ff'}, fweight.b]]} />
                                            {
                                                expertCategory == '가격 낮은순' &&
                                                <Box width={'16px'} height='2px' backgroundColor={'#0195ff'} position='absolute' bottom='0' left="50%" marginLeft='-8px' />
                                            }   
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>setExpertCategory("서비스 좋은순")}  style={[styles.expertCateBtn]}>
                                            <DefText text="서비스 좋은순" style={[styles.expertCateBtnText, expertCategory == '서비스 좋은순' && [{color:'#0195ff'}, fweight.b]]} />
                                            {
                                                expertCategory == '서비스 좋은순' &&
                                                <Box width={'16px'} height='2px' backgroundColor={'#0195ff'} position='absolute' bottom='0' left="50%" marginLeft='-8px' />
                                            }  
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>setExpertCategory("경매입찰순")}  style={[styles.expertCateBtn]}>
                                            <DefText text="경매입찰순" style={[styles.expertCateBtnText, expertCategory == '경매입찰순' && [{color:'#0195ff'}, fweight.b]]} />
                                            {
                                                expertCategory == '경매입찰순' &&
                                                <Box width={'16px'} height='2px' backgroundColor={'#0195ff'} position='absolute' bottom='0' left="50%" marginLeft='-8px' />
                                            }  
                                        </TouchableOpacity>
                                    </HStack>
                                }
                                {
                                    auctionList.moveCategory == "서비스가 좋은 업체" && 
                                    <HStack>
                                        <TouchableOpacity onPress={()=>setExpertCategory("서비스 좋은순")}  style={[styles.expertCateBtn]}>
                                            <DefText text="서비스 좋은순" style={[styles.expertCateBtnText, expertCategory == '서비스 좋은순' && [{color:'#0195ff'}, fweight.b]]} />
                                            {
                                                expertCategory == '서비스 좋은순' &&
                                                <Box width={'16px'} height='2px' backgroundColor={'#0195ff'} position='absolute' bottom='0' left="50%" marginLeft='-8px' />
                                            }  
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>setExpertCategory("가격 낮은순")} style={[styles.expertCateBtn]}>
                                            <DefText text="가격 낮은순" style={[styles.expertCateBtnText, expertCategory == '가격 낮은순' && [{color:'#0195ff'}, fweight.b]]} />
                                            {
                                                expertCategory == '가격 낮은순' &&
                                                <Box width={'16px'} height='2px' backgroundColor={'#0195ff'} position='absolute' bottom='0' left="50%" marginLeft='-8px' />
                                            }   
                                        </TouchableOpacity>
                                    
                                        <TouchableOpacity onPress={()=>setExpertCategory("경매입찰순")}  style={[styles.expertCateBtn]}>
                                            <DefText text="경매입찰순" style={[styles.expertCateBtnText, expertCategory == '경매입찰순' && [{color:'#0195ff'}, fweight.b]]} />
                                            {
                                                expertCategory == '경매입찰순' &&
                                                <Box width={'16px'} height='2px' backgroundColor={'#0195ff'} position='absolute' bottom='0' left="50%" marginLeft='-8px' />
                                            }  
                                        </TouchableOpacity>
                                    </HStack>
                                }
                            </Box>
                            {
                                expertList.map((item, index) => {
                                    return(
                                        <Box key={index}  p='25px' py='15px' borderTopWidth={ index != 0 ? 7 : 0} borderTopColor={ index != 0 ? '#F3F4F5' : 'transparent'} flex={1}>
                                            <HStack justifyContent={'space-between'}>
                                                <Box>
                                                    <HStack alignItems={'flex-end'}>
                                                        <DefText text={item.ex_name} style={[fsize.fs15, fweight.b, {marginRight:5}]} />
                                                        <DefText text="이사전문가" style={[fsize.fs13, fweight.b, {color:'#979797'}]} />
                                                    </HStack>
                                                    <DefText text={item.ex_move_status} style={[fsize.fs13, {color:'#6C6C6C', marginTop:10}]} />
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
                                                        <Box borderRadius={15} overflow='hidden'>
                                                            <Image 
                                                                source={{uri:BASE_URL + '/data/file/expert/' + item.expert_profile}}
                                                                alt='홍길동'
                                                                style={[
                                                                    {
                                                                        width: (width - 50) * 0.26,
                                                                        height: (width - 50) * 0.26,
                                                                        borderRadius: 15,
                                                                        resizeMode:'stretch'
                                                                    }
                                                                ]}
                                                            />
                                                        </Box>
                                                        :
                                                        <Box borderRadius={15} overflow='hidden'>
                                                            <Image 
                                                                source={{uri:BASE_URL + "/images/appLogo.png"}}
                                                                alt='홍길동'
                                                                style={[
                                                                    {
                                                                        width: (width - 50) * 0.26,
                                                                        height: (width - 50) * 0.26,
                                                                        borderRadius: 15,
                                                                        resizeMode:'stretch'
                                                                    }
                                                                ]}
                                                            />
                                                        </Box>
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
                                                <HStack justifyContent={'space-between'} alignItems='center' flexWrap='wrap'>
                                                    <Box width='65%'>
                                                        <DefText text={item.ex_service_status + ' 전문'} style={[styles.certiLabel]} />
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
                                            <Box py='10px' borderBottomWidth={2}  borderBottomColor={'#F3F4F5'}>
                                                <HStack justifyContent={'space-between'} alignItems='center'>
                                                    <DefText text='차량' style={[styles.certiLabel]} />
                                                    <DefText text={item.expert_car} style={[styles.certiSmall]} />
                                                </HStack>
                                                <HStack justifyContent={'space-between'} alignItems='center' mt='15px' >
                                                    <DefText text='참여 인력' style={[styles.certiLabel]} />
                                                    <DefText text={'남성 ' + item.expert_person_m + '명 / 여성 '+ item.expert_person_w +'명'} style={[styles.certiSmall]} />
                                                </HStack>
                                            </Box>
                                            <Box py='10px' borderBottomWidth={2}  borderBottomColor={'#F3F4F5'}>
                                                <HStack justifyContent={'space-between'} alignItems='center'>
                                                    <DefText text='입찰금액' style={[styles.certiLabel]} />
                                                    <VStack  alignItems='flex-end'>
                                                        <DefText text={numberFormat(item.sumsum) + '원'} style={[styles.certiSmall, {color:'#0195FF'}]} />
                                                        <DefText text='(세금포함)' style={[styles.certiSmall, {marginTop:3}]} />
                                                    </VStack>
                                                </HStack>
                                            </Box>
                                            <Box pt='10px'>
                                                <HStack justifyContent={'space-between'}>
                                                    <DefButton 
                                                        text="전문가정보" 
                                                        btnStyle={[styles.reserButton, {backgroundColor:'#DFDFDF'}]}
                                                        textStyle={[styles.reserButtonText]}
                                                        onPress={()=>navigation.navigate("ReservationExpert", {"id":item.expert_id, "pay":"Y", "aidx":auctionList.idx})}
                                                    />
                                                    {/* <DefButton 
                                                        text="예약하기" 
                                                        btnStyle={[styles.reserButton, {backgroundColor:'#0195FF'}]}
                                                        textStyle={[styles.reserButtonText, {color:'#fff'}]}
                                                        onPress={()=>reservationButtion(item.idx, item.expert_id, item.ex_name)}
                                                    /> */}
                                                    <DefButton 
                                                        text="예약하기" 
                                                        btnStyle={[styles.reserButton, {backgroundColor:'#0195FF'}]}
                                                        textStyle={[styles.reserButtonText, {color:'#fff'}]}
                                                        onPress={()=>navigation.navigate("PayModule", item)}
                                                    />
                                                </HStack>
                                            </Box>
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                        :
                        <Box p='40px' borderTopWidth={7} borderTopColor='#F3F4F5' justifyContent={'center'} alignItems='center' flex={1}>
                            <DefText text="아직 전문가를 찾고 있습니다." />
                        </Box>
                    }
                </Box>
                :
                <Box alignItems='center' flex={1} justifyContent='center' py='40px' >
                    <DefText text="요청한 AI이사 견적요청이 없습니다." />
                </Box>
            }
            <Modal isOpen={reservationModal} onClose={()=>setReservationModal(false)}>
                <Modal.Content width={width-50} backgroundColor='#fff'>
                    <Modal.Body px='20px' py='20px'>
                        <DefText text={reservationexname + "님의 견적요청에 참여하시겠습니까?"} style={[styles.modalText]} />
                        <HStack justifyContent={'space-between'} mt='20px'>
                            <TouchableOpacity onPress={aiAuctionReservation}  style={[styles.modalButton]}>
                                <DefText text="예" style={[styles.modalButtonText]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setReservationModal(false)} style={[styles.modalButton, [colorSelect.gray]]}>
                                <DefText text="아니오" style={[styles.modalButtonText, {color:'#000'}]} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={reservationCancleModal} onClose={()=>setReservationCancleModal(false)}>
                <Modal.Content width={width-50} backgroundColor='#fff'>
                    <Modal.Body px='20px' py='20px'>
                        <DefText text={"진행중인 전문가 찾기를 취소하시겠습니까?"} style={[styles.modalText]} />
                        <HStack justifyContent={'space-between'} mt='20px'>
                            <TouchableOpacity onPress={aiAuctionCancle} style={[styles.modalButton]}>
                                <DefText text="예" style={[styles.modalButtonText]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setReservationCancleModal(false)} style={[styles.modalButton, [colorSelect.gray]]}>
                                <DefText text="아니오" style={[styles.modalButtonText, {color:'#000'}]} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>        
        </Box>
    );
};

const styles = StyleSheet.create({
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
        color:'#0195FF',
        textAlign:'right'
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
    modalText: {
        ...fsize.fs16,
        ...fweight.b
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
)(AIaiction);