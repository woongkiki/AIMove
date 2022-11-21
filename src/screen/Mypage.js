import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import { BASE_URL } from '../Utils/APIConstant';
import Api from '../Api';
import { useIsFocused } from '@react-navigation/native';

const {width, height} = Dimensions.get("window");

const Mypage = (props) => {

    const {navigation, userInfo, member_logout, member_out, member_chatCnt} = props;

    const [logoutModal, setLogoutModal] = useState(false);
    const [leaveModal, setLeaveModal] = useState(false);

    const [aiCnt, setAiCnt] = useState("");
    const [carmeraCnt, setCameraCnt] = useState("");
    const [visitCnt, setVisitCnt] = useState("");
    const [carCnt, setCarCnt] = useState("");

    const isFocused = useIsFocused();

    const chatCntHandler = async () => {
        const formData = new FormData();
        formData.append('mid', userInfo.id);
        formData.append('method', 'member_chatCnt');

        const chat_cnt = await member_chatCnt(formData);

        //console.log("chat_cnt Mypage Screen::", chat_cnt);
    }

    useEffect(() => {
        if(isFocused){
            chatCntHandler();
        }
    }, [isFocused])

    const logoutHandler = async () => {
        const formData = new FormData();
        formData.append('method', 'member_logout');

        const logout = await member_logout(formData);

        setLogoutModal(false);
        ToastMessage('로그아웃 합니다.');

        navigation.reset({
            routes: [{ name: 'Login' }],
        });        
    }


    const CountApi = () => {
        Api.send('auction_counts', {'id':userInfo.id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               // console.log('견적 카운트 성공::::: ', arrItems);
                setAiCnt(arrItems.aiCnt);
                setCameraCnt(arrItems.cameraCnt);
                setVisitCnt(arrItems.visitCnt);
                setCarCnt(arrItems.carCnt);
            }else{
                console.log('견적 카운트 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });
    }

    const [reservationCnt, setReservationCnt] = useState("");
    const reservationCount = () => {
        Api.send('reservation_count', {'mid':userInfo.id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('예약완료된 카운트 성공::::: ', resultItem, arrItems);
                setReservationCnt(arrItems);
            }else{
                console.log('예약완료된 카운트 실패!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=> {
        CountApi();
        reservationCount();
    }, [])

    const memberLeaveHandler = async () => {

        if(aiCnt != "0"){
            setLeaveModal(false);
            ToastMessage("진행중인 AI 경매내역이 존재하여 회원 탈퇴가 불가능합니다.");
            return false;
        }

        if(carmeraCnt != "0"){
            setLeaveModal(false);
            ToastMessage("진행중인 사진으로이사 경매내역이 존재하여 회원 탈퇴가 불가능합니다.");
            return false;
        }

        if(visitCnt != "0"){
            setLeaveModal(false);
            ToastMessage("진행중인 방문견적 경매내역이 존재하여 회원 탈퇴가 불가능합니다.");
            return false;
        }

        if(carCnt != "0"){
            setLeaveModal(false);
            ToastMessage("진행중인 차량제공요청 내역이 존재하여 회원 탈퇴가 불가능합니다.");
            return false;
        }



        const formData = new FormData();
        formData.append('method', 'member_leave');
        formData.append('id', userInfo.id) ;
        

        const leave = await member_out(formData);

        if(leave.result){
            ToastMessage(leave.msg);
            navigation.reset({
                routes: [{ name: 'Login' }],
            });  
        }else{
            ToastMessage(leave.msg);
            setLeaveModal(false);
            return false;
        }
        
    }

    console.log(userInfo?.profileUrl);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                <Box p='25px'>
                    <HStack alignItems={'center'} justifyContent='space-between' flexWrap='wrap'>
                        <HStack alignItems={'center'} flexWrap='wrap' width='75%'>
                            <Box width="25%" >
                                {
                                    userInfo?.profileUrl != "" ?
                                    <Box width='66px' height='66px' borderRadius='66px' overflow={'hidden'}>
                                        <Image source={{uri: userInfo?.profileUrl}} alt='프로필' style={{width:'100%', height:'100%', resizeMode:'stretch'}} />

                                    </Box>
                                    :
                                    <Image 
                                        source={{uri:BASE_URL + "/images/appLogo.png"}}
                                        alt='홍길동'
                                        style={[
                                            {
                                                width: 66,
                                                height: 66,
                                                borderRadius: 66,
                                                resizeMode:'stretch'
                                            }
                                        ]}
                                    />
                                }
                                
                            </Box>
                            <VStack pl='20px' width='75%'>
                                {
                                    userInfo?.name != "" ?
                                    <DefText text={userInfo?.name+'님'} style={[styles.myPageName]} />
                                    :
                                    <TouchableOpacity onPress={()=>navigation.navigate("ProfileSetting")}>
                                        <DefText text="프로필을 작성하세요" style={[styles.myPageName]} />
                                    </TouchableOpacity>
                                }

                                <DefText text={userInfo?.joinDate != "" && userInfo?.joinDate.substr(0,10)} style={[styles.myPageDate]} />
                            </VStack>
                        </HStack>
                        {
                            userInfo?.phoneNumber != "" ?
                            <Box style={[styles.certiBox]}>
                                <DefText text="인증완료" style={[styles.certiBoxText]} />
                            </Box>
                            :
                            <Box style={[styles.certiBox, {backgroundColor:'#f00555'}]}>
                                <DefText text="인증대기" style={[styles.certiBoxText]} />
                            </Box>
                        }
                    </HStack>
                </Box>
                {
                    reservationCnt > 0 &&
                    <Box borderTopWidth={7} borderTopColor='#F3F4F5' p='25px'>
                        <DefText text="예약내역 확인" style={[styles.myPageName]} />
                        <TouchableOpacity onPress={()=>navigation.navigate("MyReservation")} style={[styles.menuButton]}>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <HStack alignItems={'center'}>
                                    <Box style={[styles.menuImgBox]}>
                                        <Image source={require("../images/mypageIcon04.png")} alt="내가 작성한 후기" style={{width:16, height:19, resizeMode:'contain'}} />
                                    </Box>
                                    <HStack>
                                        <DefText text="예약내역 확인" style={[styles.menuText]} />
                                        <DefText text={ " (" + reservationCnt + ")"} style={[styles.menuText]} />
                                    </HStack>
                                </HStack>
                                <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                            </HStack>
                        </TouchableOpacity>
                    </Box>
                }
                <Box borderTopWidth={7} borderTopColor='#F3F4F5' p='25px'>
                    <DefText text="내 계정" style={[styles.myPageName]} />
                    <TouchableOpacity style={[styles.menuButton]} onPress={()=>navigation.navigate("ProfileSetting")}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <HStack alignItems={'center'}>
                                <Box style={[styles.menuImgBox]}>
                                    <Image source={require("../images/mypageIcon01.png")} alt="회원 정보 수정" style={{width:16, height:19, resizeMode:'contain'}} />
                                </Box>
                                <DefText text="회원 정보 수정" style={[styles.menuText]} />
                            </HStack>
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("PayList")} style={[styles.menuButton]}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <HStack alignItems={'center'}>
                                <Box style={[styles.menuImgBox]}>
                                    <Image source={require("../images/mypageIcon02.png")} alt="결제정보" style={{width:16, height:19, resizeMode:'contain'}} />
                                </Box>
                                <DefText text="결제정보" style={[styles.menuText]} />
                            </HStack>
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("AppNotice", {"m_type":"일반"})} style={[styles.menuButton]}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <HStack alignItems={'center'}>
                                <Box style={[styles.menuImgBox]}>
                                    <Image source={require("../images/mypageIcon03.png")} alt="알림 설정 및 확인" style={{width:16, height:19, resizeMode:'contain'}} />
                                </Box>
                                <DefText text="알림 설정 및 확인" style={[styles.menuText]} />
                            </HStack>
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("MyReview")} style={[styles.menuButton]}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <HStack alignItems={'center'}>
                                <Box style={[styles.menuImgBox]}>
                                    <Image source={require("../images/mypageIcon04.png")} alt="내가 작성한 후기" style={{width:16, height:19, resizeMode:'contain'}} />
                                </Box>
                                <DefText text="내가 작성한 후기" style={[styles.menuText]} />
                            </HStack>
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("Notice")} style={[styles.menuButton]}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <HStack alignItems={'center'}>
                                <Box style={[styles.menuImgBox]}>
                                    <Image source={require("../images/ex_notice_icon.png")} alt="공지사항" style={{width:20, height:19, resizeMode:'contain'}} />
                                </Box>
                                <DefText text="공지사항" style={[styles.menuText]} />
                            </HStack>
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                    </TouchableOpacity>
                </Box>
                <Box borderTopWidth={7} borderTopColor='#F3F4F5' p='25px'>
                    <DefText text="내집이사 서비스" style={[styles.myPageName]} />
                    <TouchableOpacity onPress={()=>navigation.navigate("ServiceQaList", {"m_type":"de"})} style={[styles.menuButton]}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <HStack alignItems={'center'}>
                                <Box style={[styles.menuImgBox]}>
                                    <Image source={require("../images/mypageIcon05.png")} alt="서비스 문의" style={{width:16, height:19, resizeMode:'contain'}} />
                                </Box>
                                <DefText text="서비스 문의" style={[styles.menuText]} />
                            </HStack>
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("Policy")} style={[styles.menuButton]}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <HStack alignItems={'center'}>
                                <Box style={[styles.menuImgBox]}>
                                    <Image source={require("../images/mypageIcon06.png")} alt="약관 및 정책" style={{width:16, height:19, resizeMode:'contain'}} />
                                </Box>
                                <DefText text="약관 및 정책" style={[styles.menuText]} />
                            </HStack>
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                    </TouchableOpacity>
                </Box>
                <Box px='25px' mt='40px' mb='25px'>
                    <HStack justifyContent={'flex-end'}>
                        <TouchableOpacity onPress={()=>setLogoutModal(true)} style={[{marginRight:20}]}>
                            <DefText text="로그아웃" style={[styles.bottomButtonText]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setLeaveModal(true)}>
                            <DefText text="회원탈퇴" style={[styles.bottomButtonText]} />
                        </TouchableOpacity>
                    </HStack>
                </Box>
            </ScrollView>
            
            <Modal isOpen={logoutModal} onClose={()=>setLogoutModal(false)}>
                <Modal.Content width={width-50}>
                    <Modal.Body px='20px' py='20px'>
                        <DefText text="로그아웃" style={[styles.myPageName]} />
                        <DefText text="내집이사에서 로그아웃하시겠습니까?" style={[styles.modalText]} />
                        <HStack justifyContent={'space-between'} mt='20px'>
                            <TouchableOpacity onPress={logoutHandler} style={[styles.modalButton]}>
                                <DefText text="예" style={[styles.modalButtonText]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setLogoutModal(false)} style={[styles.modalButton, [colorSelect.gray]]}>
                                <DefText text="아니오" style={[styles.modalButtonText, {color:'#000'}]} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={leaveModal} onClose={()=>setLeaveModal(false)}>
                <Modal.Content width={width-50}>
                    <Modal.Body px='20px' py='20px'>
                        <DefText text="회원탈퇴" style={[styles.myPageName]} />
                        <DefText text="내집이사에서 탈퇴하시겠습니까?" style={[styles.modalText]} />
                        <HStack justifyContent={'space-between'} mt='20px'>
                            <TouchableOpacity onPress={memberLeaveHandler} style={[styles.modalButton]}>
                                <DefText text="예" style={[styles.modalButtonText]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setLeaveModal(false)} style={[styles.modalButton, [colorSelect.gray]]}>
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
    myPageName: {
        ...fweight.b
    },
    myPageDate: {
        ...fsize.fs14,
        marginTop:10
    },
    certiBox: {
        paddingVertical:10,
        borderRadius:10,
        ...colorSelect.sky,
        width: (width - 50) * 0.25,
        justifyContent:'center',
        alignItems:'center'
    },
    certiBoxText: {
        ...fsize.fs13,
        color:'#fff'
    },
    menuButton: {
        marginTop:20,
    },
    menuImgBox: {
        width:22,
        height: 22,
        justifyContent:'center',
        alignItems:'center',
        marginRight:12
    },
    menuText: {
        ...fsize.fs14
    },
    bottomButtonText: {
        ...fsize.fs14,
        color:'#999'
    },
    modalText: {
        marginTop:20,
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
        member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
        member_out: (user) => dispatch(UserAction.member_out(user)), //로그아웃
        member_chatCnt: (user) => dispatch(UserAction.member_chatCnt(user))
    })
)(Mypage);