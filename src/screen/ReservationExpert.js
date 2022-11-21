import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefButton, DefInput, DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import Swiper from 'react-native-swiper';
import InfoHeader from '../components/InfoHeader';
import Api from '../Api';
import { useIsFocused } from '@react-navigation/native';
import { BASE_URL } from '../Utils/APIConstant';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import ApiExpert from '../ApiExpert';

const {width, height} = Dimensions.get("window");

const categoryData = ["친절함", "가성비"];

const ReservationExpert = (props) => {

    const {navigation, route, userInfo} = props;
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

    const [expertReview, setExpertReview] = useState([]);
    const [expertImage, setExpertImage] = useState([]); //전문가 이미지

    //환불정책 모달
    const [refundModal, setRefundModal] = useState(false);
    const [refundInfo, setRefundInfo] = useState("");


    const [config, setConfig] = useState("");

    const [banner, setBanner] = useState("");
    
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


    const expertAuctionInfo = () => {
        ApiExpert.send('auction_info', {'ex_id':params.id, "aidx":params.aidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('이사전문가 경매 참여 정보: ', arrItems, resultItem);
               setConfig(arrItems);
               //setExpertImage(arrItems);
            }else{
               console.log('이사전문가 경매 참여 정보 실패!', resultItem);
  
            }
        });
    }

    const expertInfo = async () => {
        await setExpertLoading(true);
        await Api.send('expert_detailImage', {'ex_id':params.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('이사전문가 이미지 리스트: ', arrItems);
               setExpertImage(arrItems);
            }else{
               console.log('이사전문가 이미지 리스트 실패!', resultItem);
  
            }
        });

        await Api.send('expert_bannerProfile', {'ex_id':params.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('이사전문가 이미지 리스트: ', arrItems);
               setBanner(arrItems);
            }else{
               console.log('이사전문가 이미지 리스트 실패!', resultItem);
  
            }
        });
        await Api.send('expert_detail', {'ex_id':params.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('이사전문가 상세 리스트: ', arrItems);
               setExpertView(arrItems);
            }else{
               console.log('이사전문가 상세 리스트 실패!', resultItem);
  
            }
        });
        await Api.send('expert_detailReview', {'ex_id':params.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('이사전문가 후기 리스트: ', arrItems);
               setExpertReview(arrItems);
            }else{
               console.log('이사전문가 후기 리스트 실패!', resultItem);
              
            }
        });
        await Api.send('refund_detail', {'ex_id':params.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
            //   console.log('이사전문가 환불정책 정보: ', arrItems);
               setRefundInfo(arrItems);
            }else{
               console.log('이사전문가 환불정책 정보 실패!', resultItem);
              
            }
        });

        //정보가져오기
        if(params.pay == "Y"){
            await expertAuctionInfo();
        }
        await setExpertLoading(false);
    }


    const expertQa = () => {
        Api.send('expert_qa', {'ex_id':params.id, "mid":userInfo.id, "mname":userInfo.name, "qa_content":qaContent}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('이사전문가 문의하기 성공: ', resultItem);
               setQaModal(false);
               setQaContent("");
                ToastMessage(resultItem.message);
            }else{
               console.log('이사전문가 문의하기 실패!', resultItem);
               setQaModal(false);
                ToastMessage(resultItem.message);
            }
        });
    }


    const expertReport = () => {
        Api.send('expert_report', {'ex_id':params.id, "mid":userInfo.id, "report_title":singoCate, "report_content":singoContent}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('이사전문가 신고하기 성공: ', resultItem);
                ToastMessage(resultItem.message);
                setSingoModal(false);
                setSingoCate("");
                setSingoContent("");
            }else{
               console.log('이사전문가 신고하기 실패!', resultItem);
               ToastMessage(resultItem.message);
               setSingoModal(false);
             
            }
        });
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
                    {
                        banner != "" ?
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
                                    backgroundColor: '#fff',
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
                            {
                                banner.map((item, index) => {
                                    return(
                                        <Box key={index} justifyContent={'center'} alignItems='center'>
                                            <Image 
                                                source={{ uri: BASE_URL + '/data/file/expert_b/' + item.f_file}}
                                                style={{
                                                    width: width,
                                                    height: width / 1.71,
                                                    resizeMode:'contain'
                                                }}                                
                                            />
                                        </Box>
                                    )
                                })
                            }
                        </Swiper>
                        :
                        <Box>
                            <Image 
                                source={{ uri: BASE_URL + '/images/bigThumb.png'}}
                                style={{
                                    width: width,
                                    height: width / 1.71,
                                    resizeMode:'stretch'
                                }}                                
                            />
                        </Box>
                    }
                    
                    <Box p='25px'>
                        <HStack alignItems={'center'} justifyContent='space-between' mb='15px'>
                            <Box width='70%'>
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
                            {
                                expertView.ex_advantages != "" && 
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
                            }
                           
                        </HStack>
                    </Box>
                    
                    <Box p='25px' borderTopWidth={'7'} borderTopColor='#F3F4F5'>
                        <HStack alignItems={'center'}>
                            {
                                expertImage != "" ?
                                <Image 
                                    source={{uri:BASE_URL + '/data/file/expert/' + expertImage[0].f_file}}
                                    alt='홍길동'
                                    style={[
                                        {
                                            width: (width - 50) / 3.25,
                                            height: (width - 50) / 3.25,
                                            borderRadius: 20,
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
                                            width: (width - 50) / 3.25,
                                            height: (width - 50) / 3.25,
                                            borderRadius: 10,
                                            resizeMode:'stretch'
                                        }
                                    ]}
                                />
                            }
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
                                <DefText text={"경력 " + expertView.career} style={[styles.expertInfo]} />
                            </VStack>
                        </HStack>
                        {
                            expertView.star_avg > 4.6 &&
                            <DefText text={"자주 있지 않은 기회입니다.\n홍길동 전문가님은 보통 예약이 가득 차 있습니다."} style={[styles.expertImportant]} />
                        }
                    </Box>
                   
                    <Box p='25px' borderTopWidth={'7'} borderTopColor='#F3F4F5'>
                        <Box>
                            <DefText text="내집이사 평판관리시스템" style={[styles.infoTitle, fsize.fs16]} />
                            <DefText text="내집이사만의 전문가 평판 시스템입니다." style={[fsize.fs14, {color:'#BEBEBE', marginTop:10}]} />
                        </Box>
                        <Box width={width} height={ Platform.OS === 'ios' ? '280px' : '300px'} mt='20px' ml='-20px'>
                            <WebView
                                originWhitelist={['*']}
                                source={{uri:BASE_URL + "/chart.php?expert_id=" + expertView.ex_id}}
                                // onMessage={(e)=>{
                                //     console.log('e', e.nativeEvent.data);
                                //     setStartAddress(e.nativeEvent.data);
                                //     setInputAddr(e.nativeEvent.data);
                                // }}
                                style={{
                                    opacity:0.99,
                                    minHeight:1,
                                    marginTop:-50,
                                    
                                }}
                            />
                            <Box width={width} height={ Platform.OS === 'ios' ? '280px' : '300px'} position={'absolute'} top='0' left='0' backgroundColor={'transparent'} />
                        </Box>
                    </Box>
                 
                    {
                        expertReview != "" &&
                        <Box p='25px' borderTopWidth={'7'} borderTopColor='#F3F4F5'>
                            <DefText text="업체 후기" style={[styles.infoTitle, fsize.fs16, {marginBottom:20}]}  />
                            {
                                expertReview.map((item, index) => {
                                    return(
                                        <HStack key={index} mt={ index != 0 ? "20px" : 0 }>
                                            <Box>
                                                {
                                                    item.expert_profile != "" ?
                                                    <Image 
                                                        source={{uri:BASE_URL + "/data/file/member" + item.expert_profile}}
                                                        alt="후기"
                                                        style={{width:93, height:115, resizeMode:'contain'}}
                                                    />
                                                    :
                                                    <Image 
                                                        source={{uri:BASE_URL + "/images/appLogo.png"}}
                                                        alt="후기"
                                                        style={{width:93, height:115, resizeMode:'stretch'}}
                                                    />
                                                }
                                                
                                            </Box>
                                            <VStack width={(width-50) - 93} pl='15px' pt='15px'>
                                                <HStack alignItems={'center'} mb='15px'>
                                                    <DefText text={item.r_name} style={[fsize.fs15, fweight.b, {marginRight:10}]} />
                                                    <HStack alignItems={'center'} mt="-2px">
                                                      
                                                        <Image 
                                                            source={{uri:BASE_URL + "/images/star1.png"}}
                                                            style={{ width:13, height:13, resizeMode:'stretch'}}
                                                        />
                                                        <DefText text={item.scoreAvg} style={[fsize.fs1, {marginBottom:-2, marginLeft:5}]} />
                                                    
                                                    </HStack>
                                                </HStack>
                                                <DefText text={ textLengthOverCut(item.review_open, 20, '...')} />
                                            </VStack>
                                        </HStack>
                                    )
                                })
                            }
                        </Box>

                    }
                    <Box p='25px' borderTopWidth={'7'} borderTopColor='#F3F4F5'>
                        <DefText text={"전문가님의 서비스를 선택해야하는\n이유가 무엇인가요?"} style={[styles.infoTitle, fsize.fs16, {marginBottom:20}]}  />
                        <HStack justifyContent={'space-between'} alignItems='center'>
                            {
                                expertImage != "" ?
                                <Image 
                                    source={{uri:BASE_URL + '/data/file/expert/' + expertImage[0].f_file}}
                                    alt='홍길동'
                                    style={[
                                        {
                                            width: (width - 50) / 3.25,
                                            height: (width - 50) / 3.25,
                                            borderRadius: 10,
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
                                            width: (width - 50) / 3.25,
                                            height: (width - 50) / 3.25,
                                            borderRadius: 10,
                                            resizeMode:'stretch'
                                        }
                                    ]}
                                />
                            }
                            <Box>
                                <Box>
                                    <Box style={[styles.bubbleBoxTri]} />
                                    <Box style={[styles.bubbleBoxSquare]} >
                                        <DefText text={expertView.ex_select_reason} style={[fsize.fs13]} />
                                    </Box>
                                </Box>
                            </Box>
                        </HStack>
                    </Box>
                    <Box p='25px' borderTopWidth={'7'} borderTopColor='#F3F4F5'>
                        <DefText text="이사하면서 가장 보람을 느낄 때는 언제입니까?" style={[styles.infoTitle, fsize.fs16, {marginBottom:20}]}  />
                        <HStack justifyContent={'space-between'} alignItems='center'>
                            {
                                expertImage != "" ?
                                <Image 
                                    source={{uri:BASE_URL + '/data/file/expert/' + expertImage[0].f_file}}
                                    alt='홍길동'
                                    style={[
                                        {
                                            width: (width - 50) / 3.25,
                                            height: (width - 50) / 3.25,
                                            borderRadius: 10,
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
                                            width: (width - 50) / 3.25,
                                            height: (width - 50) / 3.25,
                                            borderRadius: 10,
                                            resizeMode:'stretch'
                                        }
                                    ]}
                                />
                            }
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
                    {
                        (params.pay === "Y" && expertView.expertOneWord != "") &&
                        <Box p='25px' borderTopWidth={'7'} borderTopColor='#F3F4F5'>
                            <DefText text="고객님 미리 알고 계셔야 해요." style={[styles.infoTitle, fsize.fs16, {marginBottom:20}]}  />
                            <HStack justifyContent={'space-between'} alignItems='center'>
                                {
                                    expertImage != "" ?
                                    <Image 
                                        source={{uri:BASE_URL + '/data/file/expert/' + expertImage[0].f_file}}
                                        alt='홍길동'
                                        style={[
                                            {
                                                width: (width - 50) / 3.25,
                                                height: (width - 50) / 3.25,
                                                borderRadius: 10,
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
                                                width: (width - 50) / 3.25,
                                                height: (width - 50) / 3.25,
                                                borderRadius: 10,
                                                resizeMode:'stretch'
                                            }
                                        ]}
                                    />
                                }
                                <Box>
                                    <Box>
                                        <Box style={[styles.bubbleBoxTri]} />
                                        <Box style={[styles.bubbleBoxSquare]} >
                                            <DefText text={expertView.expertOneWord} style={[fsize.fs13]} />
                                        </Box>
                                    </Box>
                                </Box>
                            </HStack>
                        </Box>
                    }
                    
                    {
                        (params.pay === "Y" && config != "") ?
                        <Box p='25px' borderTopWidth={'7'} borderTopColor='#F3F4F5'>
                            <HStack justifyContent={'space-between'}>
                                <DefText text="입찰 금액" style={[styles.expertPriceLabel]} />
                                {
                                    config.auction_price != "" ?
                                    <DefText text={numberFormat(config.auction_price) + '원'} style={[styles.expertPriceNumber, {color:'#0195FF'}]} />
                                    :
                                    <DefText text={'-'} style={[styles.expertPriceNumber,   {color:'#0195FF'}]} />
                                }
                            </HStack>
                            <HStack justifyContent={'space-between'} mt='10px'>
                                <DefText text="서비스 수수료" style={[styles.expertPriceLabel]} />
                                {
                                    config.commission != "" ?
                                    <DefText text={numberFormat(config.commission) + '원'} style={[styles.expertPriceNumber]} />
                                    :
                                    <DefText text={'-'} style={[styles.expertPriceNumber,   {color:'#0195FF'}]} />
                                }
                            </HStack>
                            <HStack justifyContent={'space-between'} mt='10px'>
                                <DefText text="세금" style={[styles.expertPriceLabel]} />
                                {
                                    config.vat != "" ?
                                    <DefText text={numberFormat(config.vat) + '원'} style={[styles.expertPriceNumber]} />
                                    :
                                    <DefText text={'-'} style={[styles.expertPriceNumber,   {color:'#0195FF'}]} />
                                }
                            </HStack>
                            <HStack justifyContent={'space-between'} mt='10px'>
                                <DefText text="합계" style={[styles.expertPriceLabel]} />
                                {
                                    config.sumsum != "" ?
                                    <DefText text={numberFormat(config.sumsum) + '원'} style={[styles.expertPriceNumber, {color:'#0195FF'}]} />
                                    :
                                    <DefText text={'-'} style={[styles.expertPriceNumber,   {color:'#0195FF'}]} />
                                }
                            </HStack>
                            <HStack justifyContent={'space-between'} mt='10px'>
                                <DefText text="환불정책" style={[styles.expertPriceLabel]} />
                                <TouchableOpacity onPress={()=>setRefundModal(true)} style={{borderBottomWidth:1, borderBottomColor:'#C2C2C2'}}>
                                    <DefText text="자세히보기" style={[styles.expertPriceNumber, {color:'#C2C2C2'}]} />
                                </TouchableOpacity>
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
                        :
                        <Box px='25px' py='15px' pb='25px' borderTopWidth={'7'} borderTopColor='#F3F4F5'>
                            <HStack justifyContent={'space-between'} mt='10px'>
                                <DefText text="환불정책" style={[styles.expertPriceLabel]} />
                                <TouchableOpacity onPress={()=>setRefundModal(true)} style={{borderBottomWidth:1, borderBottomColor:'#C2C2C2'}}>
                                    <DefText text="자세히보기" style={[styles.expertPriceNumber, fsize.fs14,  {color:'#C2C2C2'}]} />
                                </TouchableOpacity>
                            </HStack>

                            <TouchableOpacity onPress={()=>setQaModal(true)} style={[styles.expertButton]}>
                                <DefText text="문의하기" style={[fsize.fs14, fweight.m]} />
                            </TouchableOpacity>
                            <HStack mt='20px' justifyContent={'flex-end'}>
                                <TouchableOpacity onPress={()=>setSingoModal(true)} style={{borderBottomWidth:1, borderBottomColor:'#FF5050'}}>
                                    <DefText text='신고하기' style={[fsize.fs14, {color:'#FF5050'}]} />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                    }
                    
                </ScrollView>
            }
            {/* {
                params.pay != "S" &&
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
            } */}
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
                            <TouchableOpacity onPress={expertQa} style={[styles.modalButton, colorSelect.sky]}>
                                <DefText text="문의하기" style={[styles.modalButtonText, {color:'#fff'}]} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
               
                
            </Modal>
            <Modal isOpen={refundModal} onClose={()=>setRefundModal(false)}>
                <Modal.Content width={width-50} backgroundColor='#fff'>
                    <Modal.Body px='20px'>
                        <DefText text={refundInfo.re_title} style={[fweight.b]} />
                        <Box mt='15px'>
                            <DefText text={refundInfo.re_content} style={[fsize.fs14, {color:'#333', lineHeight:20}]} />
                        </Box>
                        <TouchableOpacity onPress={()=>setRefundModal(false)} style={[styles.modalButton, colorSelect.sky, {width:width - 90, marginTop:20}]}>
                            <DefText text="확인" style={[styles.modalButtonText, {color:'#fff'}]} />
                        </TouchableOpacity>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
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
                            <TouchableOpacity onPress={expertReport} style={[styles.modalButton, colorSelect.sky]}>
                                <DefText text="신고하기" style={[styles.modalButtonText, {color:'#fff'}]} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
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
        marginTop:20
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

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(ReservationExpert);