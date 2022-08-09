import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const {width, height} = Dimensions.get('window');

const bottomBox = height - ((width / 1.08) + 70 + 40)



const Home = (props) => {
    
    const {navigation, userInfo} = props;

    const [loading, setLoading] = useState(true);
    const [infoModal, setInfoModal] = useState(false);

    return (
        <Box flex={1} backgroundColor='#F5F5F5'>
            <ScrollView>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.topButton]}
                    onPress={()=>setInfoModal(true)}
                >
                    <DefText 
                        text='내집이사를 소개합니다.' 
                        style={[
                            styles.topButtonText
                        ]}
                    />
                </TouchableOpacity>
                <Box pt='10px'>
                    <Image 
                        source={require('../images/mainBanners.png')}
                        style={[
                            {
                                width:width,
                                height: width,
                                resizeMode:'stretch'
                            }
                        ]}
                    />
                   
                    <Box position={'absolute'} bottom='30px' right='25px'>
                        <TouchableOpacity
                            style={[
                                styles.cameraButton
                            ]}
                            onPress={()=>navigation.navigate('MoveType')}
                        >
                            <HStack
                                alignItems={'center'}
                                justifyContent='space-around'
                            >
                                <Image 
                                    source={require('../images/cameraIcon.png')} 
                                    style={[
                                        {
                                            width:14,
                                            height:12,
                                            resizeMode:'contain'
                                        }
                                    ]}
                                />
                                <DefText 
                                    text='사진 견적' 
                                    style={[
                                        styles.cameraButtonText
                                    ]}
                                />
                            </HStack>
                        </TouchableOpacity>
                    </Box>
                </Box>
                <Box pt='25px' backgroundColor='#fff' borderTopLeftRadius={30} borderTopRightRadius={30} shadow={6}>
                    <HStack alignItems={'flex-end'} px='25px' >
                        <DefText text='이용후기' style={[styles.reviewTitle]} />
                        <DefText text='(12,890개)' style={[styles.reviewCountTitle]} />
                    </HStack>
                    <Box>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            <HStack mt='20px' pb='25px' px='25px' >
                                <TouchableOpacity activeOpacity={0.8}>
                                    <Box p='20px' backgroundColor='#FCFCFC' borderRadius={10} shadow={3} style={{width: (width-50) * 0.68}}>
                                        <HStack alignItems={'center'} justifyContent='space-between'>
                                            <VStack>
                                                <HStack alignItems={'flex-end'}>
                                                    <DefText text='홍길동' style={[styles.expertName]} />
                                                    <DefText text='이사전문가' style={[styles.expertSubject]} />
                                                </HStack>
                                                <DefText text='포장이사' style={[styles.expertCate]} />
                                                <DefText text={ numberFormat(230000) + '원' } style={[styles.expertPrice]} />
                                            </VStack>
                                            <Image 
                                                source={require('../images/expertExImg.png')}
                                                alt='홍길동'
                                                style={[
                                                    {
                                                        width: (width - 50) * 0.17,
                                                        height: (width - 50) * 0.17,
                                                        borderRadius: ((width - 50) * 0.17) / 2,
                                                        resizeMode:'contain'
                                                    }
                                                ]}
                                            />
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
                                                <DefText text='4.0' style={[styles.scoreText]} />
                                            </HStack>
                                            <DefText text={ textLengthOverCut("감사합니다. 깔끔한 이사가 완료되었습니다.", 17, '...')} style={[styles.reviewContent]} />
                                        </Box>
                                    </Box>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} style={[{marginLeft:20}]}>
                                    <Box p='20px' backgroundColor='#FCFCFC' borderRadius={10} shadow={3} style={{width: (width-50) * 0.68}}>
                                        <HStack alignItems={'center'} justifyContent='space-between'>
                                            <VStack>
                                                <HStack alignItems={'flex-end'}>
                                                    <DefText text='홍길동' style={[styles.expertName]} />
                                                    <DefText text='이사전문가' style={[styles.expertSubject]} />
                                                </HStack>
                                                <DefText text='포장이사' style={[styles.expertCate]} />
                                                <DefText text={ numberFormat(230000) + '원' } style={[styles.expertPrice]} />
                                            </VStack>
                                            <Image 
                                                source={require('../images/expertExImg.png')}
                                                alt='홍길동'
                                                style={[
                                                    {
                                                        width: (width - 50) * 0.17,
                                                        height: (width - 50) * 0.17,
                                                        borderRadius: ((width - 50) * 0.17) / 2,
                                                        resizeMode:'contain'
                                                    }
                                                ]}
                                            />
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
                                                <DefText text='4.0' style={[styles.scoreText]} />
                                            </HStack>
                                            <DefText text={textLengthOverCut("감사합니다. 깔끔한 이사가 완료되었습니다.", 17, '...')} style={[styles.reviewContent]} />
                                        </Box>
                                    </Box>
                                </TouchableOpacity>
                            </HStack>
                        </ScrollView>
                    </Box>
                </Box>
            </ScrollView>
           {
                infoModal && 
                
                <Box backgroundColor='#fff' height={height - 70} alignItems='center' justifyContent='center'>
                    <Box position={'absolute'} top='25px' right='25px'> 
                        <TouchableOpacity onPress={()=>setInfoModal(false)}>
                            <Image source={require('../images/cameraCloseButton.png')} alt='닫기' style={[{width:22, height:22, resizeMode:'contain'}]} />
                        </TouchableOpacity>
                    </Box>
                    <DefText text='내집이사를 소개합니다.' style={[styles.title1, {color:'#6B6B6B'}]} />
                    <HStack alignItems={'center'} my='15px'>
                        <DefText text='사진만으로' style={[styles.title21]} />
                        <DefText text=' 내집이사' style={[styles.title21, {color:'#0195FF'}]} />
                    </HStack>
                    <DefText text='새로운 방식의 이사서비스가 시작됩니다.' style={[styles.title1]} />

                    <VStack mt='60px'>
                        <TouchableOpacity style={[styles.button, colorSelect.sky]}>
                            <HStack alignItems={'center'}>
                                <Image 
                                    source={require('../images/videoPlayIcon.png')}
                                    alt='재생'
                                    style={[{
                                        width:19,
                                        height:19,
                                        resizeMode:'contain'
                                    }]}
                                />
                                <DefText text='동영상 시청' style={[styles.buttonText]} />
                            </HStack>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, colorSelect.black, {marginTop:15}]}>
                            <HStack alignItems={'center'}>
                                <Image 
                                    source={require('../images/contentIcon.png')}
                                    alt='재생'
                                    style={[{
                                        width:14,
                                        height:19,
                                        resizeMode:'contain'
                                    }]}
                                />
                                <DefText text='설명 더 보기' style={[styles.buttonText]} />
                            </HStack>
                        </TouchableOpacity>
                    </VStack>
                </Box>
           }
        </Box>
    );
};

const styles = StyleSheet.create({
    topButton: {
        width:width,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    topButtonText: {
        ...fsize.fs15,
        ...fweight.b,
        color:'#fff',
    },
    bannerText1: {
        ...fsize.fs24,
        color:'#272727'
    },
    bannerText2: {
        ...fsize.fs23,
        ...fweight.b,        
        marginTop:3
    },
    cameraButton: {
        width:93,
        height:34,
        backgroundColor:'#6477FD',
        borderRadius:17,
        justifyContent:'center',
        alignItems:'center',
    },
    cameraButtonText: {
        ...fsize.fs12,
        ...fweight.b,
        color:'#fff',
        marginLeft:5
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

    title1: {
        ...fsize.fs18,
        ...fweight.m,
    },
    title21: {
        ...fsize.fs32,
        ...fweight.b,
    },
    button: {
        width: (width - 50),
        height: 50,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    buttonText: {
        color:'#fff',
        ...fweight.m,
        marginLeft:10
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
)(Home);