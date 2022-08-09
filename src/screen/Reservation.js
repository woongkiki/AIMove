import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack } from 'native-base';
import { DefButton, DefText } from '../common/BOOTSTRAP';
import { fsize, fweight } from '../common/StyleCommon';
import { numberFormat } from '../common/DataFunction';

const {width, height} = Dimensions.get("window");

const Reservation = (props) => {

    const {navigation} = props;

    const [tabCategory, setTabCategory] = useState("찾는중");
    const [expertCategory, setExpertCategory] = useState("가격적당");

    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                <HStack>
                    <TouchableOpacity onPress={()=>setTabCategory("찾는중")} style={[styles.tabButton]}>
                        <DefText text="전문가 찾는중" style={[styles.tabButtonText, tabCategory == "찾는중" && [{color:'#000'}, fweight.b]]} />
                        <Box width={width/2} height={ tabCategory == '찾는중' ? '3px' : '1px'} backgroundColor={ tabCategory == '찾는중' ? '#0195FF' : '#CDCDCD'} position='absolute' bottom='0' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setTabCategory("완료")} style={[styles.tabButton]}>
                        <DefText text="전문가 찾기 완료" style={[styles.tabButtonText, tabCategory == "완료" && [{color:'#000'}, fweight.b]]} />
                        <Box width={width/2} height={ tabCategory == '완료' ? '3px' : '1px'} backgroundColor={ tabCategory == '완료' ? '#0195FF' : '#CDCDCD'} position='absolute' bottom='0'/>
                    </TouchableOpacity>
                </HStack>
                
               
                {/* 전문가 컴포넌트 */}
                {
                    tabCategory == "찾는중" &&
                    <>
                        <Box p='25px'>
                            <HStack style={[styles.priceBox]}>
                                <DefText text="AI 이사 견적" style={[styles.priceLeftText]} />
                                <DefText text="20 ~ 30만원" style={[styles.priceRightText]} />
                            </HStack>
                            <HStack style={[styles.priceBox, {borderColor:'#D6D6D6', marginTop:15}]}>
                                <DefText text="전문가 찾는 시간" style={[styles.priceLeftText]} />
                                <DefText text="23:54:55" style={[styles.priceRightText, fweight.r, {color:'#000'}]} />
                            </HStack>
                        </Box>
                        <Box p='25px' borderTopWidth={7} borderTopColor='#F3F4F5'>
                            <HStack>
                                <TouchableOpacity onPress={()=>setExpertCategory("가격적당")} style={[styles.expertCateBtn]}>
                                    <DefText text="가격적당" style={[styles.expertCateBtnText, expertCategory == '가격적당' && [{color:'#0195ff'}, fweight.b]]} />
                                    {
                                        expertCategory == '가격적당' &&
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
                            <Box>
                                <HStack justifyContent={'space-between'} mt='30px'>
                                    <Box>
                                        <HStack alignItems={'flex-end'}>
                                            <DefText text="홍길동" style={[fsize.fs15, fweight.b, {marginRight:5}]} />
                                            <DefText text="이사전문가" style={[fsize.fs13, fweight.b, {color:'#979797'}]} />
                                        </HStack>
                                        <DefText text="내집처럼 이사해드리겠습니다." style={[fsize.fs12, {marginVertical:10}]} />
                                        <DefText text="이사서비스" style={[fsize.fs13, {color:'#6C6C6C'}]} />
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
                                            <DefText text='4.0' style={[fsize.fs12, fweight.b, {color:'#6C6C6C', marginLeft:5}]} />
                                        </HStack>
                                    </Box>
                                    <Box>
                                        <Image 
                                            source={require('../images/expertEx2.png')}
                                            alt='홍길동'
                                            style={[
                                                {
                                                    width: (width - 50) * 0.26,
                                                    height: (width - 50) * 0.26,
                                                    borderRadius: 10,
                                                    resizeMode:'contain'
                                                }
                                            ]}
                                        />
                                    </Box>
                                </HStack>
                                <HStack mt='20px' pb='20px'>
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
                                </HStack>
                                <Box py='20px' borderTopWidth={2} borderBottomWidth={2} borderTopColor='#F3F4F5' borderBottomColor={'#F3F4F5'}>
                                    <HStack justifyContent={'space-between'} alignItems='center'>
                                        <DefText text='반포장이사 / 일반이사 전문' style={[styles.certiLabel]} />
                                        <HStack alignItems={'center'}>
                                            <DefText text='이사 건수 ' style={[styles.certiSmall]} />
                                            <DefText text='38' style={[styles.certiLabel, {borderBottomWidth:1}]}/>
                                            <DefText text=' 건' style={[styles.certiSmall]} />
                                        </HStack>
                                    </HStack>
                                    <HStack justifyContent={'space-between'} alignItems='center' mt='15px' >
                                        <DefText text='경력 7년' style={[styles.certiLabel]} />
                                        <HStack alignItems={'center'}>
                                            <DefText text='후기 ' style={[styles.certiSmall]} />
                                            <DefText text='38' style={[styles.certiLabel, {borderBottomWidth:1}]}/>
                                            <DefText text=' 개' style={[styles.certiSmall]} />
                                        </HStack>
                                    </HStack>
                                </Box>
                                <Box py='20px' borderBottomWidth={2}  borderBottomColor={'#F3F4F5'}>
                                    <HStack justifyContent={'space-between'} alignItems='center'>
                                        <DefText text='차량' style={[styles.certiLabel]} />
                                        <DefText text='1톤 1대 ' style={[styles.certiSmall]} />
                                    </HStack>
                                    <HStack justifyContent={'space-between'} alignItems='center' mt='15px' >
                                        <DefText text='참여 인력' style={[styles.certiLabel]} />
                                        <DefText text='남성 2명 / 여성 2명' style={[styles.certiSmall]} />
                                    </HStack>
                                </Box>
                                <Box py='20px' borderBottomWidth={2}  borderBottomColor={'#F3F4F5'}>
                                    <HStack justifyContent={'space-between'} alignItems='center'>
                                        <DefText text='입찰금액' style={[styles.certiLabel]} />
                                        <VStack  alignItems='flex-end'>
                                            <DefText text={numberFormat(244600) + '원'} style={[styles.certiSmall, {color:'#0195FF'}]} />
                                            <DefText text='(세금포함)' style={[styles.certiSmall, {marginTop:3}]} />
                                        </VStack>
                                    </HStack>
                                </Box>
                                <Box pt='20px'>
                                    <HStack justifyContent={'space-between'}>
                                        <DefButton 
                                            text="업체정보" 
                                            btnStyle={[styles.reserButton, {backgroundColor:'#DFDFDF'}]}
                                            textStyle={[styles.reserButtonText]}
                                            onPress={()=>navigation.navigate("ReservationExpert", {"idx":1})}
                                        />
                                        <DefButton 
                                            text="예약하기" 
                                            btnStyle={[styles.reserButton, {backgroundColor:'#0195FF'}]}
                                            textStyle={[styles.reserButtonText, {color:'#fff'}]}
                                        />
                                    </HStack>
                                </Box>
                            </Box>
                        </Box>
                    </>
                }
                {
                    tabCategory == '완료' && 
                    <Box px='25px'>
                        <Box>
                            <HStack justifyContent={'space-between'} mt='30px'>
                                <Box>
                                    <HStack alignItems={'flex-end'}>
                                        <DefText text="홍길동" style={[fsize.fs15, fweight.b, {marginRight:5}]} />
                                        <DefText text="이사전문가" style={[fsize.fs13, fweight.b, {color:'#979797'}]} />
                                    </HStack>
                                    <DefText text="내집처럼 이사해드리겠습니다." style={[fsize.fs12, {marginVertical:10}]} />
                                    <DefText text="이사서비스" style={[fsize.fs13, {color:'#6C6C6C'}]} />
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
                                        <DefText text='4.0' style={[fsize.fs12, fweight.b, {color:'#6C6C6C', marginLeft:5}]} />
                                    </HStack>
                                </Box>
                                <Box>
                                    <Image 
                                        source={require('../images/expertEx2.png')}
                                        alt='홍길동'
                                        style={[
                                            {
                                                width: (width - 50) * 0.26,
                                                height: (width - 50) * 0.26,
                                                borderRadius: 10,
                                                resizeMode:'contain'
                                            }
                                        ]}
                                    />
                                </Box>
                            </HStack>
                            <HStack mt='20px' pb='20px'>
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
                            </HStack>
                            <Box py='20px' borderTopWidth={2} borderBottomWidth={2} borderTopColor='#F3F4F5' borderBottomColor={'#F3F4F5'}>
                                <HStack justifyContent={'space-between'} alignItems='center'>
                                    <DefText text='반포장이사 / 일반이사 전문' style={[styles.certiLabel]} />
                                    <HStack alignItems={'center'}>
                                        <DefText text='이사 건수 ' style={[styles.certiSmall]} />
                                        <DefText text='38' style={[styles.certiLabel, {borderBottomWidth:1}]}/>
                                        <DefText text=' 건' style={[styles.certiSmall]} />
                                    </HStack>
                                </HStack>
                                <HStack justifyContent={'space-between'} alignItems='center' mt='15px' >
                                    <DefText text='경력 7년' style={[styles.certiLabel]} />
                                    <HStack alignItems={'center'}>
                                        <DefText text='후기 ' style={[styles.certiSmall]} />
                                        <DefText text='38' style={[styles.certiLabel, {borderBottomWidth:1}]}/>
                                        <DefText text=' 개' style={[styles.certiSmall]} />
                                    </HStack>
                                </HStack>
                            </Box>
                           
                            <Box py='20px' borderBottomWidth={2}  borderBottomColor={'#F3F4F5'}>
                                <HStack justifyContent={'space-between'} alignItems='center'>
                                    <DefText text='입찰금액' style={[styles.certiLabel]} />
                                    <VStack  alignItems='flex-end'>
                                        <DefText text={numberFormat(244600) + '원'} style={[styles.certiSmall, {color:'#0195FF'}]} />
                                        <DefText text='(세금포함)' style={[styles.certiSmall, {marginTop:3}]} />
                                    </VStack>
                                </HStack>
                            </Box>
                            <Box pt='20px'>
                                <HStack justifyContent={'space-between'}>
                                    <DefButton 
                                        text="업체정보" 
                                        btnStyle={[styles.reserButton, {backgroundColor:'#DFDFDF'}]}
                                        textStyle={[styles.reserButtonText]}
                                        onPress={()=>navigation.navigate("ReservationExpert", {"idx":1})}
                                    />
                                    <DefButton 
                                        text="후기작성" 
                                        btnStyle={[styles.reserButton, {backgroundColor:'#0195FF'}]}
                                        textStyle={[styles.reserButtonText, {color:'#fff'}]}
                                        onPress={()=>navigation.navigate("ReviewScreen1")}
                                    />
                                </HStack>
                                <DefText text={"서비스에 대한 후기를 남겨주세요\n14일이 지나면 후기를 남길 수 없어요!"} style={[styles.expertImportant]} />
                            </Box>
                        </Box>
                    </Box>
                }
                    
            </ScrollView>
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

export default Reservation;