import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';

const {width, height} = Dimensions.get("window");

const CameraSmallHome = (props) => {

    const {navigation} = props;

    const [cameraModal, setCameraModal] = useState(false);

    const nextNavigation = () => {
        navigation.navigate("ImageConfirm");
        setCameraModal(false);
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                <Box>
                    <Image source={require('../images/smallBanner.png')} alt='소형이사 배너' style={[{width:width, height:width}]} />
                </Box>
            </ScrollView>
            <Box pt='30px' pb='20px' backgroundColor='#fff' borderTopLeftRadius={30} borderTopRightRadius={30} shadow={6}>
                <Box px='25px'>
                    <DefText text='간단하게 사진으로 이사하기' style={[styles.infoTitle]} />
                    <VStack mt='20px'>
                        <HStack alignItems={'flex-start'}>
                            <DefText text="1. " style={[styles.infoText]} />
                            <DefText text={"옷장, 냉장고, 서랍장과 같이 문이 있는 이삿짐은 문을\n열고 내부가 보이게 촬영해 주세요."} style={[styles.infoText]}  />
                        </HStack>
                        <HStack alignItems={'flex-start'} mt='15px'>
                            <DefText text="2. " style={[styles.infoText]} />
                            <DefText text={"카메라 안에 이삿짐이 최대한 담기게 멀리서 촬영해\n주세요."} style={[styles.infoText]}  />
                        </HStack>
                        <HStack alignItems={'flex-start'} mt='15px'>
                            <DefText text="3. " style={[styles.infoText]} />
                            <DefText text={"빠짐 없이 이삿짐을 촬영해 주세요."} style={[styles.infoText]}  />
                        </HStack>
                    </VStack>
                    <DefText text={'※ 꼼꼼하게 촬영하시지 않으면 현장에서 비용이 추가 될\n수 있어요.'} style={[styles.infoAddText]} />
                    <DefButton text='AI 견적 시작하기' btnStyle={[colorSelect.sky, {marginTop:30}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)} />
                </Box>
            </Box>
            <Modal isOpen={cameraModal} onClose={()=>setCameraModal(false)}>
                <Modal.Content width={width - 50}>
                    <Modal.Body py='25px' px='20px'>
                        <DefText text={"카메라에 이삿짐이 최대한 담긴\n사진을 올려주세요."} style={[styles.modalText]}/>
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
    infoTitle: {
        ...fweight.b,
        ...fsize.fs18
    },
    infoText: {
        ...fsize.fs14,
        color:'#aaa',
    },
    infoAddText: {
        ...fsize.fs14,
        ...fweight.b,
        color:'#FF5050',
        marginTop:30
    },
    modalText: {
        ...fweight.b,
        textAlign:'center'
    },
    modalButton: {
        width: (width - 90) * 0.48,
        height: 50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10
    }
})

export default CameraSmallHome;