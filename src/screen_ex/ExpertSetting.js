import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import { BASE_URL } from '../Utils/APIConstant';
import { useIsFocused } from '@react-navigation/native';

const {width, height} = Dimensions.get("window");

const ExpertSetting = (props) => {

    const {navigation, userInfo, member_logout, member_out, member_info, member_chatCnt} = props;

    const [logoutModal, setLogoutModal] = useState(false);
    const [leaveModal, setLeaveModal] = useState(false);


    const expertInfo = async () => {

        const formData = new FormData();
        formData.append("method", "expert_myInfos");
        formData.append("id", userInfo?.ex_id);

        const memberInfo = await member_info(formData);
    }

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

    const memberLeaveHandler = async () => {

        const formData = new FormData();
        formData.append('method', 'member_leave');
        formData.append('id', userInfo.id);
        

        const leave = await member_out(formData);

        ToastMessage(leave.msg);
        navigation.reset({
            routes: [{ name: 'Login' }],
        });  
    }


    const isFocused = useIsFocused();

    const chatCntHandler = async () => {
        const formData = new FormData();
        formData.append('ex_id', userInfo.ex_id);
        formData.append('method', 'member_exchatCnt');

        const chat_cnt = await member_chatCnt(formData);

        console.log("chat_cnt ExpertSetting Screen::", chat_cnt);
    }

    useEffect(() => {
        if(isFocused){
            chatCntHandler();
        }
    }, [isFocused])


    useEffect(() => {
        expertInfo();

        console.log("userInfo", userInfo);
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                <Box p='25px'>
                    <HStack alignItems={'center'} justifyContent='space-between' flexWrap='wrap'>
                        <HStack alignItems={'center'} flexWrap='wrap' width='75%'>
                            <Box width="25%">
                            {
                                userInfo?.profileUrl != "" ?
                                <Box width='66px' height='66px' borderRadius='66px' overflow={'hidden'}>
                                    <Image 
                                        source={{uri:userInfo?.profileUrl}}
                                        alt={userInfo?.ex_name}
                                        style={[
                                            {
                                                width: 66,
                                                height: 66,
                                                resizeMode:'stretch'
                                            }
                                        ]}
                                    />
                                </Box>
                                :
                                <Box width='66px' height={'66px'} borderRadius='33px' overflow={'hidden'} justifyContent='center' alignItems={'center'} backgroundColor='#dfdfdf'>
                                    <Image 
                                        source={require("../images/noProfileImg.png")}
                                        alt={userInfo?.ex_name}
                                        style={[
                                            {
                                                width: 27,
                                                height: 31,
                                                resizeMode:'stretch'
                                            }
                                        ]}
                                    />
                                </Box>
                            }
                            </Box>
                            
                            <VStack pl='20px' width='70%' >
                                {
                                    userInfo?.ex_name != "" ?
                                    <DefText text={userInfo?.ex_name+'님'} style={[styles.myPageName]} />
                                    :
                                    <DefText text="프로필을 작성하세요" style={[styles.myPageName]} />
                                }

                                <DefText text={userInfo?.ex_date != "" && userInfo?.ex_date.substr(0,10)} style={[styles.myPageDate]} />
                            </VStack>
                        </HStack>
                        <Box style={[styles.certiBox]}>
                            <DefText text="인증완료" style={[styles.certiBoxText]} />
                        </Box>
                    </HStack>
                </Box>
                <Box borderTopWidth={7} borderTopColor='#F3F4F5' p='25px'>
                    <DefText text="전문가" style={[styles.myPageName]} />
                    {
                        userInfo?.business_certi != "Y" &&
                        <TouchableOpacity onPress={()=>navigation.navigate("ExpertCerti")} style={[styles.menuButton]}>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <HStack alignItems={'center'}>
                                    <Box style={[styles.menuImgBox]}>
                                        <Image source={require("../images/ex_mypage_icon.png")} alt="회원 정보 수정" style={{width:21, height:24, resizeMode:'contain'}} />
                                    </Box>
                                    <DefText text="전문가 인증하기" style={[styles.menuText]} />
                                </HStack>
                                <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                            </HStack>
                        </TouchableOpacity>
                    }
                    {/* <TouchableOpacity style={[styles.menuButton]}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <HStack alignItems={'center'}>
                                <Box style={[styles.menuImgBox]}>
                                    <Image source={require("../images/ex_textinsert_icon.png")} alt="결제정보" style={{width:17, height:17, resizeMode:'contain'}} />
                                </Box>
                                <DefText text="고객님 알고 계셔야 해요 등록" style={[styles.menuText]} />
                            </HStack>
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={[styles.menuButton]} onPress={()=>navigation.navigate("ExpertProfileSetting")}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <HStack alignItems={'center'}>
                                <Box style={[styles.menuImgBox]}>
                                    <Image source={require("../images/ex_insert_icon.png")} alt="결제정보" style={{width:19, height:19, resizeMode:'contain'}} />
                                </Box>
                                <DefText text="업체정보 수정" style={[styles.menuText]} />
                            </HStack>
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuButton]} onPress={()=>navigation.navigate("ExpertAreaInsert")}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <HStack alignItems={'center'}>
                                <Box style={[styles.menuImgBox]}>
                                    <Image source={require("../images/ex_insert_icon.png")} alt="결제정보" style={{width:19, height:19, resizeMode:'contain'}} />
                                </Box>
                                <DefText text="이사가능지역 수정" style={[styles.menuText]} />
                            </HStack>
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("ExpertCard")} style={[styles.menuButton]}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <HStack alignItems={'center'}>
                                <Box style={[styles.menuImgBox]}>
                                    <Image source={require("../images/ex_card_submit_icon.png")} alt="결제정보" style={{width:23, height:15, resizeMode:'contain'}} />
                                </Box>
                                <DefText text="업체카드 등록" style={[styles.menuText]} />
                            </HStack>
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("ExpertNotice")} style={[styles.menuButton]}>
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
                    <TouchableOpacity onPress={()=>navigation.navigate("AppNotice", {"m_type":"전문가"})} style={[styles.menuButton]}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <HStack alignItems={'center'}>
                                <Box style={[styles.menuImgBox]}>
                                    <Image source={require("../images/ex_alarm_icon.png")} alt="공지사항" style={{width:20, height:19, resizeMode:'contain'}} />
                                </Box>
                                <DefText text="알림 설정 및 확인" style={[styles.menuText]} />
                            </HStack>
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                    </TouchableOpacity>
                </Box>
                <Box borderTopWidth={7} borderTopColor='#F3F4F5' p='25px'>
                    <DefText text="내집이사 서비스" style={[styles.myPageName]} />
                    <TouchableOpacity onPress={()=>navigation.navigate("ServiceQaList", {"m_type":"ex"})} style={[styles.menuButton]}>
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
                <Box px='25px' mt='40px' mb='20px'>
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
        padding:10,
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
        width:23,
        height: 24,
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
)(ExpertSetting);