import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Image, StyleSheet, Platform, Dimensions, ScrollView, Button } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefInput, DefButton } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import { phoneFormat } from '../common/DataFunction';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const {width, height} = Dimensions.get("window");

const ExpertImageSelect1 = (props) => {

    const {navigation, userInfo, member_info, member_update} = props;

    const [infoModal, setInfoModal] = useState(false);
    const [cameraModal, setCameraModal] = useState(false);

    const nextNavigation = () => {
        navigation.navigate("ExpertImageConfirm");
        setCameraModal(false);
    }

    return (
        <Box flex={1} backgroundColor='#fff' justifyContent={'space-between'}>
            <Box>
                <Box position={'absolute'} top='20px' right='25px'>
                    <TouchableOpacity onPress={()=>setInfoModal(true)}>
                        <Image 
                            source={require("../images/keepIcon.png")}
                            alt='이사보관서비스란?'
                            style={{
                                width:21,
                                height:21,
                                resizeMode:'contain'
                            }}
                        />
                    </TouchableOpacity>
                </Box>
            </Box>
            <Box px='25px' py='20px' backgroundColor={'#fff'} borderTopLeftRadius={20} borderTopRightRadius={20} shadow={9}>
        
                <DefText text="이제 전문가님이 보이는 사진을 올릴 차례입니다." style={[styles.titleText]} />
                <DefText text={"내집이사 전문가가 되시면 내집이사에서\n모든과정을 도와드립니다.`"} style={[styles.contentText, {marginTop:10}]}/>
                <TouchableOpacity onPress={()=>setCameraModal(true)}  style={[styles.startButton]}>
                    <DefText text="시작하기" style={[styles.startButtonText]} />
                </TouchableOpacity>
             </Box>
             <Modal isOpen={infoModal} onClose={()=>setInfoModal(false)}>
                <Modal.Content p='0' width={width-50}>
                    <Modal.Body p='0'>
                        <Box>
                            <Box p='20px' borderBottomWidth={2} borderBottomColor='#F3F4F5'>
                                <HStack alignItems={'center'} justifyContent='space-between'>
                                    <DefText text="서비스가 돋보이는 사진 촬영 방법" style={[styles.modalTitle]} />
                                    <TouchableOpacity onPress={()=>setInfoModal(false)}>
                                        <Image
                                            source={require("../images/keepModalClose.png")}
                                            alt="팝업 닫기"
                                            style={[{
                                                width:12,
                                                height: 12,
                                                resizeMode:'contain'
                                            }]}
                                        />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                            <Box p='20px'>
                                <DefText text={'사진을 효과적으로 촬영하고 정렬하면 전문가님이 가진 매력을 더욱 돋보이게 할 수 있습니다.'} style={[styles.modalText]} />
                                <Image
                                    source={require("../images/relImage.png")}
                                    alt="관련이미지"
                                    style={[{
                                        width:width - 90,
                                        height:120,
                                        resizeMode:'contain',
                                        marginTop:20,
                                        marginBottom:20
                                    }]}
                                />
                                <DefText text={'대부분의 고객은 사진을 통해 이사 서비스를 한눈에 파악하고 싶어 하므로, 이사 서비스가 완성된 사진이나 고객에게 알리고 싶은 부분을 표현하면 좋습니다.'} style={[styles.modalText]} />
                                <Box mt='40px'>
                                    <DefText text="대표사진" style={[styles.modalTitle, {marginBottom:10}]} />
                                    <DefText text="가장 마음에 드는 고화질 사진을 첫번째로 선택하세요." style={[styles.modalText]} />
                                </Box>
                                <Box mt='40px'>
                                    <DefText text="프로필 사진" style={[styles.modalTitle, {marginBottom:10}]} />
                                    <DefText text="배경이 없고, 웃고 있는 모습인 경우 고객이 호감을 느낍니다." style={[styles.modalText]} />
                                </Box>
                                <Box mt='40px'>
                                    <DefText text="다음에 표시될 사진" style={[styles.modalTitle, {marginBottom:10}]} />
                                    <DefText text="이사 서비스의 특별함을 더하는 요소를 강조하고, 전문가님의 개성도 사진에 담아 보세요." style={[styles.modalText]} />
                                </Box>
                            </Box>
                        </Box>
                    </Modal.Body>
                </Modal.Content>
             </Modal>

             <Modal isOpen={cameraModal} onClose={()=>setCameraModal(false)}>
                <Modal.Content width={width - 50}>
                    <Modal.Body py='25px' px='20px'>
                        <DefText text={"프로필 이미지 및 업체와 관련된\n이미지를 등록합니다."} style={[styles.cameraTitle]}/>
                        <HStack justifyContent={'space-between'} mt='25px'>
                            <TouchableOpacity onPress={nextNavigation} style={[styles.modalButton, colorSelect.black]}>
                                <HStack alignItems={'center'}>
                                    <Image source={require('../images/aiGallIcon.png')} alt='갤러리' style={{width:22, height:19, resizeMode:'contain'}} />
                                    <DefText text='갤러리 (앨범)' style={[fweight.m, {color:'#fff', marginLeft:7, lineHeight:19}]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, colorSelect.sky]}>
                                <HStack alignItems={'center'}>
                                    <Image source={require('../images/aiCameraIcon.png')} alt='갤러리' style={{width:22, height:19, resizeMode:'contain'}} />
                                    <DefText text='카메라' style={[fweight.m, {color:'#fff', marginLeft:10, lineHeight:19}]} />
                                </HStack>
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    titleText: {
        ...fsize.fs18,
        ...fweight.b
    },
    contentText: {
        ...fsize.fs14,
        color:'#aaa'
    },
    startButton: {
        width:width - 50,
        height:50,
        borderRadius:10,
        ...colorSelect.sky,
        alignItems:'center',
        justifyContent:'center',
        marginTop:30
    },
    startButtonText: {
        color:'#fff',
        ...fweight.m,
        
    },
    modalTitle: {
        ...fweight.b,
    },
    modalText: {
        ...fsize.fs15,
    },
    modalButton: {
        width: (width - 90) * 0.48,
        height: 50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10
    },
    cameraTitle: {
        ...fweight.b,
        textAlign:'center'
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_update: (user) => dispatch(UserAction.member_update(user)), //회원정보 변경
    })
)(ExpertImageSelect1);