import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get("window");
const aiImg = (width - 50) * 0.3;
const aiImgP = (width - 50) * 0.05;
const aiImgH = aiImg / 1.37;

const samples = [
    {
        idx:1,
        product:'에어컨'
    },
    {
        idx:2,
        product:'에어컨'
    },
    {
        idx:3,
        product:'에어컨'
    },
    {
        idx:4,
        product:'에어컨'
    },
]

const SmallMoveConfirm = (props) => {

    const {navigation, route} = props;
    const {params} = route;

    console.log(params.item);

    const [bigBoxModal, setBigBoxModal] = useState(false);


    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='소형이사 (원룸이사) 견적요청' />
            <ScrollView>
                <Box>
                    <Image
                        source={require("../images/ImageAiSample.png")}
                        alt='샘플'
                        style={{
                            width:width,
                            height: width * 1.36,
                            resizeMode:'stretch'
                        }}
                    />
                </Box>
                <Box px='25px' py='15px' pb='30px'>
                    <HStack flexWrap={'wrap'}>
                        <TouchableOpacity style={[{marginRight:aiImgP}]}>
                            <Image source={require('../images/sample1.png')} alt='샘플1' style={{width:aiImg, height:aiImgH, resizeMode:'contain'}} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[{marginRight:aiImgP}]}>
                            <Image source={require('../images/sample2.png')} alt='샘플1' style={{width:aiImg, height:aiImgH, resizeMode:'contain'}} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require('../images/sample3.png')} alt='샘플1' style={{width:aiImg, height:aiImgH, resizeMode:'contain'}} />
                        </TouchableOpacity>
                    </HStack>
                    <HStack justifyContent={'flex-end'} mt='40px'>
                        <TouchableOpacity>
                            <HStack alignItems={'center'}>
                                <DefText text='수정하기' />
                                <Image source={require("../images/imgArr.png")} alt="화살표" style={{width:22, height:12, resizeMode:'contain'}} />
                            </HStack>
                        </TouchableOpacity>
                    </HStack>
                    <Box style={[styles.aiTitleBox]}>
                        <DefText text="AI 이사 견적은 다음과 같습니다." style={[styles.aiTitle]} />
                    </Box>
                </Box>
                <Box borderTopWidth={8} borderTopColor='#F3F4F5' px='25px' pt='27px' py='20px'>
                    <Box style={[styles.confirmBox]}>
                        <Box>
                            <Box style={[styles.confirmBoxCircle]} />
                            <DefText text='이사날짜 및 시간' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                        </Box>
                        <DefText text={params.moveDate + " " + params.moveDatetime} style={[styles.confirmBoxText]}/>
                    </Box>
                    <Box style={[styles.confirmBox]}>
                        <Box>
                            <Box style={[styles.confirmBoxCircle]} />
                            <DefText text='출발지 / 출발지 작업 정보' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                        </Box>
                        <DefText text={params.startAddress + " / " + params.startMoveTool } style={[styles.confirmBoxText]}/>
                    </Box>
                    <Box style={[styles.confirmBox]}>
                        <Box>
                            <Box style={[styles.confirmBoxCircle]} />
                            <DefText text='도착지 / 도착지 작업정보' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                        </Box>
                        <DefText text={params.destinationAddress + " / " + params.destinationMoveTool} style={[styles.confirmBoxText]}/>
                    </Box>
                    <Box style={[styles.confirmBox]}>
                        <Box>
                            <Box style={[styles.confirmBoxCircle]} />
                            <DefText text='이사 업체 추천방법' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                        </Box>
                        <DefText text={params.moveCategory} style={[styles.confirmBoxText]}/>
                    </Box>
                    <Box style={[styles.confirmBox]}>
                        <Box>
                            <Box style={[styles.confirmBoxCircle]} />
                            <DefText text='이사 유형' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                        </Box>
                        <DefText text={params.pakageType} style={[styles.confirmBoxText]}/>
                    </Box>
                    <Box style={[styles.confirmBox]}>
                        <Box>
                            <Box style={[styles.confirmBoxCircle]} />
                            <DefText text='주방과 욕실 정리 인력 필요 여부' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                        </Box>
                        <DefText text={params.personStatus == "예" ? "필요" : "필요없음"} style={[styles.confirmBoxText]}/>
                    </Box>
                    <Box style={[styles.confirmBox]}>
                        <Box>
                            <Box style={[styles.confirmBoxCircle]} />
                            <DefText text='이사보관서비스 필요 여부' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                        </Box>
                        <DefText text={params.keepStatus == "예" ? "필요" : "필요없음"} style={[styles.confirmBoxText]}/>
                    </Box>
                    <Box style={[styles.confirmBox]}>
                        <Box>
                            <Box style={[styles.confirmBoxCircle]} />
                            <DefText text='이사할 때 도와줄 사람 여부' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                        </Box>
                        <DefText text={params.moveHelp == "예" ? "있음" : "없음"} style={[styles.confirmBoxText]}/>
                    </Box>
                    <Box style={[styles.confirmBox]}>
                        <Box>
                            <Box style={[styles.confirmBoxCircle]} />
                            <DefText text='큰짐 목록' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                        </Box>
                        <TouchableOpacity onPress={()=>setBigBoxModal(true)} style={[{width:49, height:28, borderRadius:14, justifyContent:'center', alignItems:'center', marginTop:10}, colorSelect.sky]}>
                            <DefText text='확인' style={[fsize.fs13, {color:'#fff'}]} />
                        </TouchableOpacity>
                        {/* <DefText text={params.moveHelp == "예" ? "있음" : "없음"} style={[styles.confirmBoxText]}/> */}
                    </Box>
                    <Box style={[styles.confirmBox, {paddingBottom:0, borderLeftWidth:0}]}>
                        <Box>
                            <Box style={[styles.confirmBoxCircle]} />
                            <DefText text='잔짐의 개수' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                        </Box>
                        <DefText text={"11 ~ 13 BOX"} style={[styles.confirmBoxText]}/>
                    </Box>
                </Box>
                <Box borderTopWidth={8} borderTopColor='#F3F4F5' px='25px' py='20px'>
                    <HStack style={[styles.priceBox]}>
                        <DefText text='AI 이사견적' style={[styles.priceBoxText]} />
                        <DefText text='20 ~ 30만원' style={[styles.priceBoxText]} />
                    </HStack>
                    <HStack my='30px'>
                        <DefText text="※ " style={[styles.confirmText]} />
                        <DefText text={"사전에 전문가님과 협의되지 않은 이삿짐은\n추가 비용이 발생할 수 있습니다."} style={[styles.confirmText]}  />
                    </HStack>
                    <DefButton text='AI 견적으로 전문가 찾기' btnStyle={[styles.submitBtn]} textStyle={[{color:'#fff'}, fweight.m]} />
                </Box>
            </ScrollView>
            <Modal isOpen={bigBoxModal} onClose={()=>setBigBoxModal(false)}>
                <Modal.Content width={width-50}>
                    <Modal.Body p='20px' width={width-50}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <DefText text="큰짐목록은 다음과 같습니다." style={[styles.modalTitle]} />
                            <TouchableOpacity style={[styles.modalInsertBtn]}>
                                <DefText text="수정" style={[styles.modalInsertBtnText]} />
                            </TouchableOpacity>
                        </HStack>
                        {
                            params.item != "" &&
                            <HStack flexWrap={'wrap'}>
                                {
                                    params.item.map((item, index)=> {
                                        return(
                                            <Box 
                                                key={index} 
                                                mr={ (index + 1) % 3 == 0 ? 0 : (width - 90) * 0.019} 
                                                mt="15px"
                                                alignItems='center'
                                            >
                                                <Image 
                                                    source={require("../images/bigBoxImage.png")} 
                                                    alt={item.product}
                                                    style={{
                                                        width: (width - 90) * 0.32,
                                                        height:140,
                                                        resizeMode:'contain'
                                                    }}
                                                />
                                                <DefText text={item.product} style={[fsize.fs15, {marginTop:10}]} />
                                            </Box>
                                        )
                                    })
                                }
                            </HStack>
                        }
                        <HStack>

                        </HStack>
                        <DefButton 
                            text="확인" 
                            btnStyle={[styles.modalConfirmBtn]}
                            textStyle={[styles.modalConfirmBtnText]} 
                            onPress={()=>setBigBoxModal(false)}
                        />
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    aiTitleBox: {
        width: width - 50,
        paddingVertical:10,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        ...colorSelect.sky
    },
    aiTitle: {
        ...fsize.fs18,
        ...fweight.b,
        color:'#fff'
    },
    confirmBox: {
        borderLeftWidth:1,
        borderLeftColor:'#0195FF',
        paddingLeft:15,
        paddingBottom:20,
    },
    confirmBoxTitle: {
        ...fsize.fs15,
        ...fweight.b
    },
    confirmBoxText: {
        ...fsize.fs15,
        color:'#5F5F5F',
        marginTop:10
    },
    confirmBoxCircle: {
        width:11,
        height:11,
        borderRadius:6,
        position: 'absolute',
       top:0,
       left:-21,
        ...colorSelect.sky
    },
    priceBox: {
        width: width-50,
        height: 57,
        borderRadius: 7,
        borderWidth:1,
        borderColor:'#0195FF',
        paddingHorizontal:25,
        alignItems:'center',
        justifyContent:'space-between'
    },
    priceBoxText: {
        ...fweight.b,
        color:'#0195FF'
    },
    confirmText: {
        ...fsize.fs14,
        ...fweight.b,
        color:'#FF5050'
    },
    submitBtn: {
        ...colorSelect.sky,

    },
    modalTitle: {
        ...fweight.b
    },
    modalInsertBtn: {
        ...colorSelect.sky,
        paddingHorizontal:10,
        height:26,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10
    },
    modalInsertBtnText: {
        ...fsize.fs12,
        color:'#fff'
    },
    modalConfirmBtn: {
        width:width-90,
        height:50,
        ...colorSelect.sky,
        marginTop:20
    },
    modalConfirmBtnText: {
        color:'#fff',
        ...fweight.m
    }
})

export default SmallMoveConfirm;