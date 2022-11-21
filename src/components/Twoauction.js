import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator, LogBox } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefButton, DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import { numberFormat } from '../common/DataFunction';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import { useIsFocused } from '@react-navigation/native';
import CountDown from '@ilterugur/react-native-countdown-component';
import { BASE_URL } from '../Utils/APIConstant';
import Font from '../common/Font';
import ToastMessage from './ToastMessage';

const {width} = Dimensions.get("window");

const Twoauction = (props) => {

    const {navigation, userInfo} = props;

    const [visitList, setVisitList] = useState([]);
    const [visitExpert, setVisitExpert] = useState([]);

    const [visitLoading, setVisitLoading] = useState(true);
    const [reservationModal, setReservationModal] = useState(false);
    const [reservationIdx, setReservationIdx] = useState(""); //예약선택한 업체 idx
    const [reservationAucIdx, setReservationAucIdx] = useState(""); //예약선택한 업체 idx
    const [reservationexid, setReservationExid] = useState(""); //예약선택한 전문가 아이디
    const [reservationexname, setReservationExName] = useState(""); //예약선택한 전문가 아이디
    const [reservationCancleModal, setReservationCancleModal] = useState(false);

    const isFocused = useIsFocused();

    const twoAuction = async () => {
        await setVisitLoading(true);
        await Api.send('house_visitList', {'mid':userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                
                console.log('방문견적 리스트 불러오기 성공!', arrItems, resultItem);
                setVisitList(arrItems);
               
            }else{
                setVisitList([]);
            }
        });
        await setVisitLoading(false);
    }

    const visitExpertApi = async () => {
       
        await Api.send('house_visitExpert', {'auc_idx':visitList.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                
                console.log('방문견적 넣은 업체 리스트 불러오기 성공!', arrItems);
                setVisitExpert(arrItems);

            }else{

               console.log('방문견적 리스트 실패!', resultItem);
               
               
            }
        });
       
    }

    const visitAuctionCancle = () => {
        Api.send('house_visitAuctionCancle', {'idx':visitList.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

                console.log('방문견적 취소 성공!', resultItem);
                twoAuction();
                ToastMessage(resultItem.message);
                setVisitList("");
                setReservationCancleModal(false);

            }else{

               console.log('방문견적 취소 실패!', resultItem);
               ToastMessage(resultItem.message);
               setReservationCancleModal(false);
            }
        });
    }


    //예약 모달띄우기
    const reservationButtion = (idx, aucidx, exid, exname) => {
        //console.log(idx, exid)
        setReservationIdx(idx);
        setReservationAucIdx(aucidx);
        setReservationExid(exid);
        setReservationExName(exname);
        setReservationModal(true);
    }

    const reservationApi = () => {
        Api.send('house_visitReservation', {"idx":reservationIdx, "aucidx":reservationAucIdx, "ex_id":reservationexid, "ex_name":reservationexname, "mid":userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('방문견적 예약 성공: ', resultItem);
               //setExpertList(arrItems);

               setReservationModal(false);
               twoAuction();
               ToastMessage(resultItem.message);


               navigation.navigate('TabNav', {
                    screen: 'Chating',
                });

            }else{
               console.log('방문견적 예약 실패!', resultItem);
               
            }
        });
    }

    useEffect(() => {
        if(isFocused){
            twoAuction();
        }

        return() => {
            setVisitList("");
        }

    }, [isFocused]);

    useEffect(()=> {
        if(visitList !="") {
            visitExpertApi();
        }

        console.log("visitList", visitList);
    }, [visitList])




    return (
        <Box flex={1} backgroundColor='#fff'>
            {
                visitLoading ?
                <Box flex={1} justifyContent='center' alignItems={'center'} minHeight='200px'>
                    <ActivityIndicator size="large" color="#333" />
                </Box>
                :
                <Box>
                {
                    visitList != "" ?
                    <>
                        <Box p='25px' py='15px'>
                            <Box mb='10px'>
                                <DefText text={"방문견적은 고객님께서 이사전문가와 직접 거래하는"} style={[fsize.fs12, {color:'#f00'}]} />
                                <DefText text={"서비스입니다. 계약서 확인도 하시고, 꼼꼼하게"} style={[fsize.fs12, {color:'#f00'}]} />
                                <DefText text={"상담받으시길 바랍니다."} style={[fsize.fs12, {color:'#f00'}]} />
                            </Box>
                            <Box p={'20px'} borderWidth={1} borderRadius={7} borderColor='#d6d6d6' mb='10px'>
                                <HStack alignItems={'center'}  justifyContent={'space-between'}>
                                    <Box width='25%' >
                                        <DefText text="방문주소" style={[styles.priceLeftText]}  />
                                    </Box>
                                    <Box width='70%' alignItems='flex-end'>
                                        <DefText text={visitList.v_addr} style={[styles.certiSmall]}  />
                                    </Box>
                                </HStack>
                                <HStack alignItems={'center'} justifyContent={'space-between'} mt='10px'>
                                    <Box width='25%' >
                                        <DefText text="이사날짜" style={[styles.priceLeftText]}  />
                                    </Box>
                                    <Box width='70%'  alignItems='flex-end'>
                                        <DefText text={visitList.v_date.substring(0, 10)} style={[styles.certiSmall]}  />
                                    </Box>
                                </HStack>
                            </Box>
                            <HStack style={[styles.priceBox, {borderColor:'#D6D6D6'}]}>
                                <DefText text="전문가 찾는 시간" style={[styles.priceLeftText]} />
                                {/* <DefText text="23:54:55" style={[styles.priceRightText, fweight.r, {color:'#000'}]} /> */}
                                {
                                    visitList != "" ?
                                    <CountDown 
                                        until={visitList.times}
                                        timeToShow={['H', 'M', 'S']}
                                        timeLabels={{m: null, s: null}}
                                        size={14}
                                        digitStyle={{width:20, height:'auto', marginTop:4}}
                                        digitTxtStyle={{fontSize:16, lineHeight:19, color:'#000', fontFamily:Font.SCoreDreamB, fontWeight:'bold'}}
                                        showSeparator
                                        separatorStyle={{color:'#000'}}
                                        style={{marginTop:-4}}
                                    />
                                    :
                                    <DefText text="-" />
                                }
                                
                            </HStack>
                            <TouchableOpacity onPress={()=>setReservationCancleModal(true)} style={{borderRadius:5, alignItems:'center', justifyContent:'center', height:45, marginTop:10, borderWidth:1, borderColor:'#f00'}}>
                                <DefText text="전문가 찾기 취소" style={{color:'#f00'}} />
                            </TouchableOpacity>
                        </Box>
                        {
                            visitExpert != "" ?
                            <Box >
                                {
                                    visitExpert.map((item, index) => {
                                        return(
                                            <Box key={index} p='25px' borderTopWidth={7} borderTopColor='#F3F4F5' flex={1}>
                                                <HStack justifyContent={'space-between'}>
                                                    <Box>
                                                        <HStack alignItems={'flex-end'}>
                                                            <DefText text={item.ex_name} style={[fsize.fs15, fweight.b, {marginRight:5}]} />
                                                            <DefText text="이사전문가" style={[fsize.fs13, fweight.b, {color:'#979797'}]} />
                                                        </HStack>
                                                        {/* <DefText text={item.ex_service_name} style={[fsize.fs12, {marginVertical:10}]} /> */}
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
                                                    <Box borderRadius={200} overflow='hidden'>
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
                                                        <Box width='65%'>
                                                            <DefText text={item.ex_service_status + ' 전문'} style={[styles.certiLabel]} />
                                                        </Box>
                                                        <HStack alignItems={'center'} width='35%' justifyContent={'flex-end'}>
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
                                                            onPress={()=>navigation.navigate("ReservationExpert", {"id":item.expert_id, "pay":"N"})}
                                                        />
                                                        <DefButton 
                                                            text="예약하기" 
                                                            btnStyle={[styles.reserButton, {backgroundColor:'#0195FF'}]}
                                                            textStyle={[styles.reserButtonText, {color:'#fff'}]}
                                                            onPress={()=>reservationButtion(item.idx, item.auc_idx, item.expert_id, item.expert_name)}
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
                    </>
                    :
                    <Box alignItems='center' flex={1} py='40px'>
                        <DefText text="요청한 방문견적내역이 없습니다." />
                    </Box>
                }
                </Box>
            }
            <Modal isOpen={reservationModal} onClose={()=>setReservationModal(false)}>
                <Modal.Content width={width-50} backgroundColor='#fff'>
                    <Modal.Body px='20px' py='20px'>
                        <DefText text={reservationexname + "님의 견적요청에 참여하시겠습니까?"} style={[styles.modalText]} />
                        <HStack justifyContent={'space-between'} mt='20px'>
                            <TouchableOpacity onPress={reservationApi}  style={[styles.modalButton]}>
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
                        <DefText text={"진행중인 견적을 취소하시겠습니까?"} style={[styles.modalText]} />
                        <HStack justifyContent={'space-between'} mt='20px'>
                            <TouchableOpacity onPress={visitAuctionCancle} style={[styles.modalButton]}>
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
)(Twoauction);