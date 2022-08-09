import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get("window");

const Mypage = (props) => {

    const {navigation, userInfo, member_logout, member_out} = props;

    const [logoutModal, setLogoutModal] = useState(false);
    const [leaveModal, setLeaveModal] = useState(false);

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


    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                <Box p='25px'>
                    <HStack alignItems={'center'} justifyContent='space-between' flexWrap='wrap'>
                        <HStack alignItems={'center'} flexWrap='wrap' width='75%'>
                            <Image 
                                source={require('../images/expertEx2.png')}
                                alt='홍길동'
                                style={[
                                    {
                                        width: 66,
                                        height: 66,
                                        borderRadius: 33,
                                        resizeMode:'contain'
                                    }
                                ]}
                            />
                            <VStack ml='20px' width='65%'>
                                {
                                    userInfo?.name != "" ?
                                    <DefText text={userInfo?.name+'님'} style={[styles.myPageName]} />
                                    :
                                    <DefText text="프로필을 작성하세요" style={[styles.myPageName]} />
                                }

                                <DefText text={userInfo?.joinDate != "" && userInfo?.joinDate.substr(0,10)} style={[styles.myPageDate]} />
                            </VStack>
                        </HStack>
                        <Box style={[styles.certiBox]}>
                            <DefText text="인증완료" style={[styles.certiBoxText]} />
                        </Box>
                    </HStack>
                </Box>
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
                    <TouchableOpacity style={[styles.menuButton]}>
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
                </Box>
                <Box borderTopWidth={7} borderTopColor='#F3F4F5' p='25px'>
                    <DefText text="내집이사 서비스" style={[styles.myPageName]} />
                    <TouchableOpacity onPress={()=>navigation.navigate("ServiceQa")} style={[styles.menuButton]}>
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
                
            </ScrollView>
            <Box position={'absolute'} bottom='25px' right='25px'>
                <HStack justifyContent={'flex-end'}>
                    <TouchableOpacity onPress={()=>setLogoutModal(true)} style={[{marginRight:20}]}>
                        <DefText text="로그아웃" style={[styles.bottomButtonText]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setLeaveModal(true)}>
                        <DefText text="회원탈퇴" style={[styles.bottomButtonText]} />
                    </TouchableOpacity>
                </HStack>
            </Box>
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
        ...colorSelect.sky
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
    })
)(Mypage);