import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefButton, DefInput, DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import { numberFormat } from '../common/DataFunction';
import Swiper from 'react-native-swiper';
import InfoHeader from '../components/InfoHeader';
import Api from '../Api';
import { useIsFocused } from '@react-navigation/native';

const {width, height} = Dimensions.get("window");

const categoryData = ["친절함", "가성비"];

const ReservationExpert = (props) => {

    const {navigation, route} = props;
    const {params} = route;

    const isFocused = useIsFocused(); //focus 되었는지 아닌지 true, false 값 반환

    const [expertLoading, setExpertLoading] = useState(true);
    const [expertView, setExpertView] = useState('');
    const [positionY, setPositionY] = useState("0");
    const [qaModal, setQaModal] = useState(false);
    const [qaContent, setQaContent] = useState("");
    const [singoModal, setSingoModal] = useState(false);
    const [singoCate, setSingoCate] = useState("");
    const [singoContent, setSingoContent] = useState("");
    
    const handleScroll = (e) => {
        //console.log("스크롤 이동:::", e.nativeEvent.contentOffset.y);
        setPositionY(e.nativeEvent.contentOffset.y);
    }

    const qaContentChange = (text) => {
        setQaContent(text);
    }

    const singoContentChange = (text) => {
        setSingoContent(text);
    }


    const expertInfo = async () => {
        await setExpertLoading(true);
        await Api.send('expert_detail', {'idx':params.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('이사전문가 상세 리스트: ', arrItems);
               setExpertView(arrItems);
            }else{
               console.log('이사전문가 상세 리스트 실패!', resultItem);
              
            }
        });
        await setExpertLoading(false);
    }

    useEffect(()=> {
        if(isFocused){
            expertInfo();
        }
    }, [isFocused])

   // console.log('이사전문가 상세::::::',params);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <InfoHeader headPosition={positionY} navigation={navigation} />
            {
                expertLoading ?
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    <Swiper
                        loop={true}
                        height={width / 1.71}
                        dot={
                            <Box
                            style={{
                                backgroundColor: 'rgba(0,0,0,.3)',
                                width: 7,
                                height: 7,
                                borderRadius: 7,
                                marginLeft: 7,
                                marginRight: 7
                            }}
                            />
                        }
                        activeDot={
                            <Box
                            style={{
                                backgroundColor: '#000',
                                width: 7,
                                height: 7,
                                borderRadius: 7,
                                marginLeft: 7,
                                marginRight: 7
                            }}
                            />
                        }
                        paginationStyle={{
                            bottom: 20
                        }}
                    >
                        <Box justifyContent={'center'} alignItems='center'>
                            <Image 
                                source={require("../images/expertSample.png")}
                                style={{
                                    width: width,
                                    height: width / 1.71,
                                    resizeMode:'stretch'
                                }}                                
                            />
                        </Box>
                        <Box justifyContent={'center'} alignItems='center'>
                            <Image 
                                source={require("../images/expertSample.png")}
                                style={{
                                    width: width,
                                    height: width / 1.71,
                                    resizeMode:'stretch'
                                }}                                
                            />
                        </Box>
                        
                    </Swiper>
                    <Box p='25px'>
                        <HStack alignItems={'center'} justifyContent='space-between' mb='15px'>
                            <Box width='40%'>
                                <DefText text={expertView.ex_service_name} style={[styles.infoTitle]} />
                            </Box>
                            <HStack alignItems={'center'}>
                                <HStack alignItems={'center'}> 
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
                                    expertView.business_certi != "" && 
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
                        </HStack>
                        <DefText text={expertView.ex_select_reason} style={[styles.infoText]} />
                        <HStack alignItems={'center'} mt='15px'>
                            <DefText text="후기 " />
                            <HStack>
                                <Box borderBottomWidth={1}>
                                    <DefText text={expertView.review_cnt} style={[fweight.b]} />
                                </Box>
                                <DefText text="개" />
                            </HStack>
                        </HStack>
                        <HStack alignItems={'center'} justifyContent='space-between' mt='10px'>
                            <HStack alignItems={'center'}>
                                <Image
                                    source={require('../images/starIcon.png')}
                                    alt='별점'
                                    style={[
                                        {
                                            width: 19,
                                            height: 18,
                                            resizeMode:'stretch'
                                        }
                                    ]}
                                />
                                <DefText text={expertView.star_avg} style={[fsize.fs15, fweight.b, {color:'#6C6C6C', marginLeft:5}]} />
                            </HStack>
                            <HStack alignItems={'center'} justifyContent='flex-end'>
                                {
                                    expertView.ex_advantages.split("^").map((item, index) => {
                                        return(
                                            <Box key={index} style={[styles.categoryBox, colorSelect.sky, index != 0 && {marginLeft:10}]}>
                                                <DefText text={item} style={[styles.categoryBoxText]}/>
                                            </Box>
                                        )
                                    })
                                }
                            </HStack>
                        </HStack>
                    </Box>
                    <Box p='25px' borderTopWidth={'7'} borderTopColor='#F3F4F5'>
                        <HStack alignItems={'center'}>
                            <Image 
                                source={require('../images/expertEx2.png')}
                                alt='홍길동'
                                style={[
                                    {
                                        width: (width - 50) / 3.25,
                                        height: (width - 50) / 3.25,
                                        borderRadius: 10,
                                        resizeMode:'contain'
                                    }
                                ]}
                            />
                            <VStack ml='20px'>
                                <HStack alignItems={'flex-end'} mb='5px'>
                                    <DefText text={expertView.ex_name} style={[styles.expertName]} />
                                    <DefText text=" 전문가님" style={[styles.expert]} />
                                </HStack>
                                <DefText text={expertView.service_status_new} style={[styles.expertInfo]} />
                                <HStack alignItems={'center'}>
                                    <DefText text="이사건수 " style={[styles.expertInfo]} />
                                    <Box borderBottomWidth={1}>
                                        <DefText text={expertView.move_cnt} style={[styles.expertInfo]} />
                                    </Box>
                                    <DefText text="건" style={[styles.expertInfo]} />
                                </HStack>
                                <DefText text="경력 7년" style={[styles.expertInfo]} />
                            </VStack>
                        </HStack>
                        <DefText text={"자주 있지 않은 기회입니다.\n홍길동 전문가님은 보통 예약이 가득 차 있습니다."} style={[styles.expertImportant]} />
                    </Box>
                    <Box p='25px' borderTopWidth={'7'} borderTopColor='#F3F4F5'>
                        <DefText text="내집이사 평판관리시스템" style={[styles.infoTitle, fsize.fs16]} />
                        <DefText text="내집이사만의 전문가 평판 시스템입니다." style={[fsize.fs14, {color:'#BEBEBE', marginTop:10}]} />
                        <Box mt='30px'>
                            <Image 
                                source={require("../images/graphSystemEx.png")}
                                alt="그래프"
                                style={{
                                    width:width - 50,
                                    height:246,
                                    resizeMode:'contain'
                                }}
                            />
                        </Box>
                    </Box>
                    <Box p='25px' borderTopWidth={'7'} borderTopColor='#F3F4F5'>
                        <DefText text="업체 후기" style={[styles.infoTitle, fsize.fs16, {marginBottom:20}]}  />
                        <HStack>
                            <Box>
                                <Image 
                                    source={require("../images/expertInfoSample.png")}
                                    alt="후기"
                                    style={{width:93, height:115, resizeMode:'contain'}}
                                />
                            </Box>
                            <VStack width={(width-50) - 93} pl='15px' pt='15px'>
                                <HStack alignItems={'center'} mb='15px'>
                                    <DefText text="홍*동" style={[fsize.fs15, fweight.b, {marginRight:10}]} />
                                    <Image 
                                        source={require("../images/star5.png")}
                                        style={{ width:82, height:13, resizeMode:'contain'}}
                                    />
                                </HStack>
                                <DefText text={`뒷처리까지 깔끔히 해주셔서\n다음번에도 이용하고 싶어요`} />
                            </VStack>
                        </HStack>
                    </Box>
                    <Box p='25px' borderTopWidth={'7'} borderTopColor='#F3F4F5'>
                        <DefText text="이사하면서 가장 보람을 느낄 때는 언제입니까?" style={[styles.infoTitle, fsize.fs16, {marginBottom:20}]}  />
                        <HStack justifyContent={'space-between'} alignItems='center'>
                            <Image source={require("../images/boramImg.png")} alt="이사전문가" style={{width:(width - 50) / 3, height:(width - 50) / 3, resizeMode:'contain'}} />
                            <Box>
                                <Box>
                                    <Box style={[styles.bubbleBoxTri]} />
                                    <Box style={[styles.bubbleBoxSquare]} >
                                        <DefText text={expertView.ex_worth} style={[fsize.fs13]} />
                                    </Box>
                                </Box>
                            </Box>
                        </HStack>
                    </Box>
                    <Box p='25px' borderTopWidth={'7'} borderTopColor='#F3F4F5'>
                        <HStack justifyContent={'space-between'}>
                            <DefText text="입찰 금액" style={[styles.expertPriceLabel]} />
                            <DefText text={numberFormat(244600) + '원'} style={[styles.expertPriceNumber, {color:'#0195FF'}]} />
                        </HStack>
                        <HStack justifyContent={'space-between'} mt='10px'>
                            <DefText text="서비스 수수료" style={[styles.expertPriceLabel]} />
                            <DefText text={numberFormat(40600) + '원'} style={[styles.expertPriceNumber]} />
                        </HStack>
                        <HStack justifyContent={'space-between'} mt='10px'>
                            <DefText text="세금" style={[styles.expertPriceLabel]} />
                            <DefText text={numberFormat(4060) + '원'} style={[styles.expertPriceNumber]} />
                        </HStack>
                        <HStack justifyContent={'space-between'} mt='10px'>
                            <DefText text="합계" style={[styles.expertPriceLabel]} />
                            <DefText text={numberFormat(289260) + '원'} style={[styles.expertPriceNumber, fweight.m, {color:'#0195FF'}]} />
                        </HStack>
                        <HStack justifyContent={'space-between'} mt='10px'>
                            <DefText text="환불정책" style={[styles.expertPriceLabel]} />
                            <TouchableOpacity style={{borderBottomWidth:1, borderBottomColor:'#C2C2C2'}}>
                                <DefText text="자세히보기" style={[styles.expertPriceNumber, {color:'#C2C2C2'}]} />
                            </TouchableOpacity>
                            {/* <DefText text={numberFormat(244600) + '원'} style={[styles.expertPriceNumber, {color:'#0195FF'}]} /> */}
                        </HStack>

                        <TouchableOpacity onPress={()=>setQaModal(true)} style={[styles.expertButton]}>
                            <DefText text="업체문의하기" style={[fsize.fs14, fweight.m]} />
                        </TouchableOpacity>
                        <HStack mt='20px' justifyContent={'flex-end'}>
                            <TouchableOpacity onPress={()=>setSingoModal(true)} style={{borderBottomWidth:1, borderBottomColor:'#FF5050'}}>
                                <DefText text='신고하기' style={[fsize.fs14, {color:'#FF5050'}]} />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                </ScrollView>
            }
            
            <DefButton 
                text="예약하기"
                btnStyle={{
                    paddingTop:0,
                    paddingBottom:0,
                    borderRadius:0,
                    width:width,
                    height:50,
                    ...colorSelect.sky
                }}
                textStyle={{
                    ...fweight.m,
                    color:'#fff'
                }}
            />
            <Modal isOpen={qaModal} onClose={()=>setQaModal(false)}>
                <Modal.Content width={width - 50} backgroundColor='#fff'>
                    <Modal.Body px='20px'>
                        <DefText text="전문가에게 문의하기" style={[fweight.b]} />
                        <DefInput
                            placeholder={'문의 내용을 입력해 주세요.'}
                            value={qaContent}
                            onChangeText={qaContentChange}
                            multiline={true}
                            inputStyle={{height:265, borderWidth:1, borderColor:'#CCCCCC', borderRadius:5, paddingTop:15, marginTop:15, paddingRight:15}}
                            textAlignVertical='top'
                        />
                        <HStack alignItems={'center'} justifyContent='space-between' mt='20px'>
                            <TouchableOpacity onPress={()=>setQaModal(false)} style={[styles.modalButton, colorSelect.gray]}>
                                <DefText text="취소" style={[styles.modalButtonText]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, colorSelect.sky]}>
                                <DefText text="문의하기" style={[styles.modalButtonText, {color:'#fff'}]} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
                <Modal isOpen={singoModal} onClose={()=>setSingoModal(false)}>
                    <Modal.Content width={width - 50} backgroundColor='#fff'>
                        <Modal.Body px='20px'>
                            <DefText text="이 서비스를 신고하는 이유를 알려주세요." style={[fweight.b]} />
                            <DefText text="신고 내역은 전문가에게 공개되지 않습니다." style={[fsize.fs13, {marginTop:10, marginBottom:20}]} />
                            <Box>
                                <TouchableOpacity onPress={()=>setSingoCate("틀린 정보가 있어요.")} style={[styles.modalSingoBtn, singoCate == "틀린 정보가 있어요." && [colorSelect.sky]]}>
                                    <DefText text="틀린 정보가 있어요." style={[styles.modalSingoBtnText, singoCate == "틀린 정보가 있어요." && {color:'#fff'}]}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>setSingoCate("불쾌해요.")} style={[styles.modalSingoBtn, {marginTop:10}, singoCate == "불쾌해요." && [colorSelect.sky]]}>
                                    <DefText text="불쾌해요." style={[styles.modalSingoBtnText, singoCate == "불쾌해요." && {color:'#fff'}]} />
                                </TouchableOpacity>
                                {
                                    singoCate == "불쾌해요." &&
                                    <DefInput 
                                        placeholder={'불쾌한 내용이 있다면 입력해 주세요.'}
                                        value={singoContent}
                                        onChangeText={singoContentChange}
                                        multiline={true}
                                        inputStyle={[{height:85, borderWidth:1, borderColor:'#CCCCCC', borderRadius:5, paddingTop:10, marginTop:10, paddingRight:15}]}
                                        textAlignVertical='top'
                                    />
                                }
                                <TouchableOpacity onPress={()=>setSingoCate("기타")} style={[styles.modalSingoBtn, {marginTop:10}, singoCate == "기타" && [colorSelect.sky]]}>
                                    <DefText text="기타" style={[styles.modalSingoBtnText, singoCate == "기타" && {color:'#fff'}]} />
                                </TouchableOpacity>
                            </Box>

                            <HStack alignItems={'center'} justifyContent='space-between' mt='20px'>
                                <TouchableOpacity onPress={()=>setSingoModal(false)} style={[styles.modalButton, colorSelect.gray]}>
                                    <DefText text="취소" style={[styles.modalButtonText]} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, colorSelect.sky]}>
                                    <DefText text="신고하기" style={[styles.modalButtonText, {color:'#fff'}]} />
                                </TouchableOpacity>
                            </HStack>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            </Modal>
        </Box>
    );
};


const styles = StyleSheet.create({
    checkIcons: {
        ...fsize.fs12,
        marginLeft:5
    },
    infoTitle: {
        ...fsize.fs17,
        ...fweight.b
    },
    infoText: {
        ...fsize.fs14
    },
    categoryBox: {
        padding:5,
        paddingHorizontal:10,
        borderRadius:10
    },
    categoryBoxText: {
        ...fsize.fs13,
        ...fweight.b,
        color:'#fff'
    },
    expertName: {
        ...fsize.fs17,
        ...fweight.b
    },
    expert: {
        ...fsize.fs15,
        ...fweight.b,
        color:'#979797'
    },
    expertInfo: {
        ...fsize.fs13,
        marginTop:5,
    },
    expertImportant: {
        ...fsize.fs14,
        ...fweight.b,
        lineHeight:20,
        color:'#FF5050',
        marginTop:20
    },
    bubbleBoxSquare: {
        width: (width - 65) - ((width - 20) / 3),
        padding:15,
        borderRadius:10,
        backgroundColor:'#EEEEEE',
        minHeight:65
    },
    bubbleBoxTri: {
        position: "absolute",
        left: -16,
        bottom: 0,
        width: 0,
        height: 0,
        borderTopColor: "transparent",
        borderTopWidth: 24,
        borderRightWidth: 24,
        borderRightColor: "#eee",
        borderBottomWidth: 0,
        borderBottomColor: "transparent",
    },
    expertPriceLabel: {
        ...fsize.fs14,
        ...fweight.b
    },
    expertPriceNumber: {
        color:'#000000'
    },
    expertButton: {
        width:width - 50,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#DFDFDF',
        marginTop:30
    },
    modalButton:{
        width: (width - 90) * 0.47,
        height: 40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10
    },
    modalButtonText: {
        ...fsize.fs14,
        ...fweight.m
    },
    modalSingoBtn: {
        width: width - 90,
        height:30,
        ...colorSelect.gray,
        borderRadius:10,
        justifyContent:'center',
        paddingHorizontal:15
    },
    modalSingoBtnText: {
        ...fsize.fs12,
    }
})

export default ReservationExpert;