import React, {Fragment, useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import { BASE_URL } from '../Utils/APIConstant';
import Swiper from 'react-native-swiper';

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

    const {navigation, route, userInfo} = props;
    const {params} = route;

    //console.log('총 이사견적 확인::::',params);

    const [aiImageLoading, setAiImageLoading] = useState(false);
    const [bigBoxModal, setBigBoxModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imageIndex, setImageIndex] = useState("0");
    const [aiImageData, setAiImageData] = useState([]);
    const [bigBoxData, setBigBoxData] = useState([]);
    const [smallBoxCount, setSmallBoxCount] = useState('');
    const [aiPrice, setAiPrice] = useState("");


    //추가
    const [imgaeList, setImageList] = useState([]);
    const [boxList, setBoxList] = useState([]);
    const [trashBoxList, setTrashBoxList] = useState([]);
    const [trashBoxModal, setTrashBoxModal] = useState(false);

    const imageSelect = async (index) => {
        //console.log("이미지번호", index);
        await setAiImageLoading(true);
        await setImageIndex(index);
        await setAiImageLoading(false);
    }

    const aiImageConfirmApi = async () => {
        await setLoading(true);
        await Api.send('ai_aiImage', {'id':userInfo.id, 'bidx':params.bidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('ai 분석 결과 보기: ', arrItems);

               setAiImageData(arrItems);

            }else{
               console.log('ai 분석 결과 보기 실패!', resultItem);
               
            }
        });

        //추가
        await Api.send('ai_confirm', {'id':userInfo.id, 'bidx':params.bidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
              // console.log('ai 분석 결과 이미지 출력 보기: ', arrItems);
               setImageList(arrItems);
            //    setAiImageData(arrItems);

            }else{
               console.log('ai 분석 결과 보기 실패!', resultItem);
               
            }
        });
        await Api.send('ai_confirmBoxList', {'id':userInfo.id, 'bidx':params.bidx, 'imageIndex':imageIndex}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
              // console.log('ai 분석 결과 출력 보기: ', arrItems);
               setBoxList(arrItems);
            //    setAiImageData(arrItems);

            }else{
               console.log('ai 분석 결과 출력 보기!', resultItem);
               
            }
        });
        //추가

        await Api.send('ai_aiBigBox', {'id':userInfo.id, 'bidx':params.bidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('큰짐목록 결과 보기: ', arrItems);
               setBigBoxData(arrItems);
               //setAiImageData(arrItems);

            }else{
               console.log('큰짐목록 결과 보기 실패!', resultItem);
               
            }
        });
        await Api.send('ai_aiSmallBox', {'id':userInfo.id, 'bidx':params.bidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('잔짐 결과 보기: ', resultItem, arrItems);
               //setBigBoxData(arrItems);
               //setAiImageData(arrItems);
               setSmallBoxCount(arrItems.boxCnt);
            }else{
               console.log('잔짐 결과 보기 실패!', resultItem);
               
            }
        });

        await Api.send('ai_aiPrice', {'id':userInfo.id, 'bidx':params.bidx, 'pakageType':params.pakageType, 'personStatus':params.personStatus, 'keepStatus':params.keepStatus, 'startMoveTool':params.startMoveTool, 'destinationMoveTool':params.destinationMoveTool, 'moveHelp':params.moveHelp}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('총금액 보기: ', arrItems, resultItem);
               //setAiPrice(arrItems);
            }else{
               console.log('총금액 보기 실패!', resultItem);
               
            }
        });

        await Api.send('ai_priceAcc', {'id':userInfo.id, 'bidx':params.bidx, 'pakageType':params.pakageType, 'personStatus':params.personStatus, 'keepStatus':params.keepStatus, 'startMoveTool':params.startMoveTool, "startFloor":params.startFloor, 'destinationMoveTool':params.destinationMoveTool, "destinationFloor":params.destinationFloor, 'moveHelp':params.moveHelp, 'startLat':params.startLat, 'startLon':params.startLon, 'destinationLat':params.destinationLat, 'destinationLon':params.destinationLon, "moveDate":params.moveDate}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('총금액 보기 (추가): ', arrItems, resultItem);
               setAiPrice(arrItems);
            }else{
               console.log('총금액 보기 실패!(추가)', resultItem);
               
            }
        });

        //버릴짐
        await Api.send('ai_trashBox', {'id':userInfo.id, 'bidx':params.bidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('버릴짐 확인하기 보기: ', arrItems);
               //setAiPrice(arrItems);
               setTrashBoxList(arrItems);
            }else{
               console.log('버릴짐 확인하기 실패!', resultItem);
               
            }
        });
        await setLoading(false);
    }

    const auctionSubmitApi = () => {

        let parame = {
            'moveDate':params.moveDate,
            'moveDatetime':params.moveDatetime,
            'startAddress':params.startAddress,
            'startMoveTool':params.startMoveTool,
            'startFloor':params.startFloor,
            'startFloorStatus':params.startFloorStatus,
            'destinationAddress':params.destinationAddress,
            'destinationMoveTool':params.destinationMoveTool,
            'destinationFloor':params.destinationFloor,
            'destinationFloorStatus':params.destinationFloorStatus,
            'moveCategory':params.moveCategory,
            'pakageType':params.pakageType,
            'personStatus':params.personStatus,
            'keepStatus':params.keepStatus,
            'moveDateKeep':params.moveDateKeep,
            'moveInKeep':params.moveInKeep,
            'moveHelp':params.moveHelp,
            'bidx':params.bidx,
            'mid':userInfo.id,
            'ai_price':aiPrice.orPrice,
            'startLat':params.startLat,
            'startLon':params.startLon,
            'destinationLat':params.destinationLat,
            'destinationLon':params.destinationLon
        };

        Api.send('auction_request', parame, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('역경매요청 보기: ', resultItem);
               //setAiPrice(arrItems);
                ToastMessage(resultItem.message);
            //    navigation.reset({
            //         routes: [{ name: 'TabNav', screen: 'Reservation' }],
            //     });

                navigation.navigate('TabNav', {
                    screen: 'Reservation',
                    params:{
                        moveCate : "소형 이사" ,
                        tabCategory: "찾는중",
                        twoCate:""
                    }
                });

            }else{
               console.log('역경매요청 실패!', resultItem);
               
            }
        });
    }

    const aiImageInsertNavi = () => {
        navigation.push("MoveConfirm", {
            "bidx":params.bidx, 
            "w":"u",
            "moveCategory":params.moveCategory, "pakageType":params.pakageType, "personStatus":params.personStatus, "keepStatus":params.keepStatus, "startMoveTool":params.startMoveTool, "startFloor":params.startFloor, "startAddress": params.startAddress, "destinationMoveTool":params.destinationMoveTool, "destinationFloor":params.destinationFloor, "destinationAddress":params.destinationAddress, "moveDate":params.moveDate, "moveDatetime":params.moveDatetime, 'moveHelp':params.moveHelp, 'moveDateKeep':params.moveDateKeep, 'moveInKeep':params.moveInKeep
        });
    }

    useEffect(()=> {
        aiImageConfirmApi();
    }, [imageIndex])

    useEffect(()=>{
        aiImageConfirmApi();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='소형이사 (원룸이사) 견적요청' />
            {
                loading ?
                <Box flex={1} justifyContent='center' alignItems='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box>
                        {/* <Image
                            source={require("../images/ImageAiSample.png")}
                            alt='샘플'
                            style={{
                                width:width,
                                height: width * 1.36,
                                resizeMode:'stretch'
                            }}
                        /> */}
                        {
                            aiImageLoading ?
                            <Box height='286px' width={width} justifyContent='center' alignItems={'center'}>
                                <ActivityIndicator size='large' color='#333' />
                            </Box>
                            :
                            <Box>
                            {
                                aiImageData != "" && 
                                <Box>
                                    {
                                        imgaeList != "" &&
                                        <Image 
                                            source={{uri:BASE_URL + "/data/file/ai/" + userInfo.id + "/" + imgaeList[imageIndex].f_file + '?date' + new Date()}}
                                            style={{
                                                width:width,
                                                height: 300,
                                                resizeMode:'stretch'
                                            }}
                                        />
                                    }
                                    {
                                        boxList != "" && 
                                        boxList.map((box, index) => {

                                            let boxWidth = box.x2 - box.x1;
                                            let boxHeight = box.y2 - box.y1;
                                            let boxLeft = box.x1;
                                            let boxBottom = box.y1;

                                            let boxWidthPercent = boxWidth / box.img_width;
                                            let boxWidthPercent2 = width * boxWidthPercent;

                                            let boxHeightPercent = boxHeight / box.img_height;
                                            let boxHeightPercent2 = 300 * boxHeightPercent;

                                            let leftPercent = boxLeft / box.img_width;
                                            let leftPercent2 = width * leftPercent;
                                            
                                            let bottomPercent = boxBottom / box.img_height;
                                            let bottomPercent2 = 300 * bottomPercent;
                                            
                                            if( box.itemCheck == 1){
                                                return(
                                                    <Box 
                                                        key={index}
                                                        width={ boxWidthPercent2 + 'px' }
                                                        height={ boxHeightPercent2 + 'px' }
                                                        backgroundColor='rgba(0,0,0,0.3)'
                                                        borderWidth={ box.size >= 3 ? 2 : 1}
                                                        borderColor={ box.size >= 3 ? '#ff0' : '#0195ff'}
                                                        position={'absolute'}
                                                        //bottom={ Platform.OS == 'ios' ? 'auto' : bottomPercent2 + 'px'}
                                                        top={ bottomPercent2 + 'px'}
                                                        left={ leftPercent2 + 'px' }
                                                        justifyContent='center'
                                                        alignItems={'center'}
                                                        
                                                        zIndex={ box.size >= 3 ? 10 : 1}
                                                    >
                                                        {
                                                            box.size >= 3 &&
                                                            <DefText text={box.product} style={[fweight.b, {color:'#fff'}]} />
                                                        }
                                                    </Box>
                                                )
                                            }
                                        })
                                    }
                                    {/* {
                                        aiImageData[imageIndex].boxdata != "" &&
                                        aiImageData[imageIndex].boxdata.map((box, idx) => {
                                            return(
                                                <Fragment key={idx}>
                                                    {
                                                        box.itemCheck == 1 &&
                                                        box.product != '상자' &&
                                                        <Box 
                                                            
                                                            width={box.widthPer + '%'}
                                                            height={box.heightPer + '%'}
                                                            backgroundColor='rgba(0,0,0,0.3)'
                                                            borderWidth={2}
                                                            borderColor='#ff0'
                                                            position={'absolute'}
                                                            top={box.topPer + '%'}
                                                            left={box.leftPer + '%'}
                                                            justifyContent='center'
                                                            alignItems={'center'}
                                                        >
                                                            <DefText text={box.product} style={[fweight.b, {color:'#fff'}]} />
                                                        </Box>
                                                    }
                                                </Fragment>
                                            )
                                        })
                                    } */}
                                </Box>
                            }
                            </Box>
                        }
                       
                    </Box>
                    <Box px='25px' py='0px' pb='25px'>
                        {
                            imgaeList != "" &&
                            <HStack flexWrap={'wrap'} mb='20px' mt='10px'>
                                {
                                    imgaeList.map((item, index) => {
                                        return(
                                            <Box key={index} style={[ {borderWidth:3, borderRadius:13, width:  (width - 50) * 0.3, marginTop:10}, (index + 1) % 3 == 0 ? {marginRight:0} : {marginRight:(width - 50) * 0.05}, index == imageIndex ? {borderColor:'#0195ff'} : {borderColor:'#fff'}]} borderRadius='10px' overflow={'hidden'}>
                                                <TouchableOpacity onPress={()=>imageSelect(index)} >
                                                    <Image 
                                                        source={{uri:BASE_URL + "/data/file/ai/" + userInfo.id + "/" + item.f_file + '?date' + new Date()}}
                                                        style={{
                                                            width:  '100%',
                                                            height: 80,
                                                            resizeMode:'stretch',
                                                            borderRadius:10
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </Box>
                                        )
                                    })
                                }
                            </HStack>
                        }
                       
                        <HStack justifyContent={'flex-end'}>
                            <TouchableOpacity onPress={aiImageInsertNavi}>
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
                            <HStack alignItems={'center'}>
                                <DefText text={params.startAddress + " / " + params.startMoveTool } style={[styles.confirmBoxText]}/>
                                {
                                    params.startMoveTool == '계단' &&
                                    <DefText text={' ' + params.startFloorStatus + ' ' + params.startFloor +'층'} style={[styles.confirmBoxText]} />
                                }
                            </HStack>
                        </Box>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='도착지 / 도착지 작업정보' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            <HStack>
                                <DefText text={params.destinationAddress + " / " + params.destinationMoveTool} style={[styles.confirmBoxText]}/>
                                {
                                    params.destinationMoveTool == '계단' &&
                                    <DefText text={' ' + params.destinationFloorStatus + ' ' + params.destinationFloor +'층'} style={[styles.confirmBoxText]} />
                                }
                            </HStack>
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
                            {
                                params.personStatus == "예" ?
                                <HStack mt='10px'>
                                    <Box px='10px' py='5px' backgroundColor={'#0195ff'}>
                                        <DefText text={"필요있음"} style={[styles.confirmBoxText, {marginTop:0, color:'#fff'}]}/>
                                    </Box>
                                </HStack>
                                :
                                <DefText text={"필요없음"} style={[styles.confirmBoxText]}/>
                            }
                        </Box>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='이사보관서비스 필요 여부' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            {
                                params.keepStatus == "예" ?
                                <Box>
                                    <HStack mt='10px'>
                                        <Box px='10px' py='5px' backgroundColor={'#0195ff'}>
                                            <DefText text={"필요있음"} style={[styles.confirmBoxText, {marginTop:0, color:'#fff'}]}/>
                                        </Box>
                                    </HStack>
                                    <Box>
                                        <HStack alignItems={'center'} mt='10px'>
                                            <DefText text="이사날짜 : " style={[fsize.fs14]} />
                                            <DefText text={params.moveDateKeep} style={[fsize.fs14]} />
                                        </HStack>
                                        <HStack alignItems={'center'} mt='10px'>
                                            <DefText text="입주날짜 : " style={[fsize.fs14]} />
                                            <DefText text={params.moveInKeep} style={[fsize.fs14]} />
                                        </HStack>
                                    </Box>
                                </Box>
                                :
                                <DefText text={"필요없음"} style={[styles.confirmBoxText]}/>
                            }
                        </Box>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='이사할 때 도와줄 사람 여부' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            {
                                params.moveHelp != "예" ?
                                <HStack mt='10px'>
                                    <Box px='10px' py='5px' backgroundColor={'#0195ff'}>
                                        <DefText text={"도와줄 사람 있음"} style={[styles.confirmBoxText, {marginTop:0, color:'#fff'}]}/>
                                    </Box>
                                </HStack>
                                :
                                <DefText text={"도와줄 사람 없음"} style={[styles.confirmBoxText]}/>
                            }
                        </Box>
                        {
                            bigBoxData.length > 0 &&
                            <Box style={[styles.confirmBox]}>
                                <Box>
                                    <Box style={[styles.confirmBoxCircle]} />
                                    <DefText text='주요 이삿짐 목록' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                                </Box>
                                <HStack>
                                    <TouchableOpacity onPress={()=>setBigBoxModal(true)} style={[{marginTop:10, borderBottomWidth:1, borderBottomColor:'#0195ff'}]}>
                                        <DefText text='확인' style={[fsize.fs13, {color:'#0195ff'}]} />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                        }
                        {
                            trashBoxList.length > 0 && 
                            <Box style={[styles.confirmBox]}>
                                <Box>
                                    <Box style={[styles.confirmBoxCircle]} />
                                    <DefText text='버릴짐 목록' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                                </Box>
                                <HStack>
                                    <TouchableOpacity onPress={()=>setTrashBoxModal(true)} style={[{marginTop:10, borderBottomWidth:1, borderBottomColor:'#0195ff'}]}>
                                        <DefText text='확인' style={[fsize.fs13, {color:'#0195ff'}]} />
                                    </TouchableOpacity>
                                </HStack>
                                
                            </Box>
                        }
                        
                        <Box style={[styles.confirmBox, {paddingBottom:0, borderLeftWidth:0}]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='잔짐의 개수(추정)' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            {
                                smallBoxCount != "" &&
                                <DefText text={ smallBoxCount + " BOX"} style={[styles.confirmBoxText]}/>
                            }
                        </Box>
                    </Box>
                    <Box borderTopWidth={8} borderTopColor='#F3F4F5' px='25px' py='20px'>
                        <HStack style={[styles.priceBox]}>
                            <DefText text='AI 추천 견적' style={[styles.priceBoxText]} />
                            {
                                aiPrice != "" &&
                                <DefText text={ numberFormat(aiPrice.lowPrice) + '원 ~ ' + numberFormat(aiPrice.highPrice) + '원'} style={[styles.priceBoxText]} />
                            }
                        </HStack>
                        <HStack my='30px'>
                            <DefText text="※ " style={[styles.confirmText]} />
                            <DefText text={"사전에 전문가님과 협의되지 않은 이삿짐은\n추가 비용이 발생할 수 있습니다."} style={[styles.confirmText]}  />
                        </HStack>
                        <DefButton text='나에게 맞는 이사 전문가 찾기' btnStyle={[styles.submitBtn]} textStyle={[{color:'#fff'}, fweight.m]} onPress={auctionSubmitApi} />
                    </Box>
                </ScrollView>
            }
            
            <Modal isOpen={bigBoxModal} onClose={()=>setBigBoxModal(false)}>
                <Modal.Content width={width-50}>
                    <Modal.Body p='20px' width={width-50}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <DefText text="주요 이삿짐 목록" style={[styles.modalTitle]} />
                            {/* <TouchableOpacity style={[styles.modalInsertBtn]}>
                                <DefText text="수정" style={[styles.modalInsertBtnText]} />
                            </TouchableOpacity> */}
                        </HStack>
                        {
                            bigBoxData != "" &&
                            <Box height={width-90} mt='20px'>
                                <Swiper
                                    width={width-90}
                                    height={width-90}
                                    dot={
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
                                    activeDot={
                                        <Box
                                        style={{
                                            backgroundColor: '#0195ff',
                                            width: 7,
                                            height: 7,
                                            borderRadius: 7,
                                            marginLeft: 7,
                                            marginRight: 7
                                        }}
                                        />
                                    }
                                >
                                    {
                                        bigBoxData.map((box, index) => {

                                            let boxWidth = box.x2 - box.x1;
                                            let boxHeight = box.y2 - box.y1;
                                            let boxLeft = box.x1;
                                            let boxBottom = box.y1;

                                            let boxWidthPercent = boxWidth / box.img_width;
                                            let boxWidthPercent2 = (width-90) * boxWidthPercent;

                                            let boxHeightPercent = boxHeight / box.img_height;
                                            let boxHeightPercent2 = (width-90) * boxHeightPercent;

                                            let leftPercent = boxLeft / box.img_width;
                                            let leftPercent2 = (width-90) * leftPercent;
                                            
                                            let bottomPercent = boxBottom / box.img_height;
                                            let bottomPercent2 = (width-90) * bottomPercent;

                                            return(
                                                <Box key={index}>
                                                    <Image 
                                                        source={{uri:BASE_URL + "/data/file/ai/" + userInfo.id + "/" + box.imgName}}
                                                        alt={box.product}
                                                        style={{
                                                            width: '100%',
                                                            height:width - 90,
                                                            resizeMode:'stretch',
                                                            borderRadius:10
                                                        }}
                                                    />
                                                    <Box 
                                                        width={ boxWidthPercent2 + 'px' }
                                                        height={ boxHeightPercent2 + 'px' }
                                                        backgroundColor='rgba(0,0,0,0.3)'
                                                        borderWidth={ box.size >= 3 ? 2 : 1}
                                                        borderColor={ box.size >= 3 ? '#ff0' : '#0195ff'}
                                                        position={'absolute'}
                                                        //bottom={ Platform.OS == 'ios' ? 'auto' : bottomPercent2 + 'px'}
                                                        top={ bottomPercent2 + 'px' }
                                                        left={ leftPercent2 + 'px' }
                                                        justifyContent='center'
                                                        alignItems={'center'}
                                                        
                                                        zIndex={ box.size >= 3 ? 10 : 1}
                                                    >
                                                        {
                                                            box.size >= 3 &&
                                                            <DefText text={box.product} style={[fweight.b, {color:'#fff'}]} />
                                                        }
                                                    </Box>
                                                </Box>
                                            )
                                        })
                                    }
                                </Swiper>
                            </Box>
                        }
                        <DefButton 
                            text="확인" 
                            btnStyle={[styles.modalConfirmBtn]}
                            textStyle={[styles.modalConfirmBtnText]} 
                            onPress={()=>setBigBoxModal(false)}
                        />
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={trashBoxModal} onClose={()=>setTrashBoxModal(false)}>
                <Modal.Content width={width-50}>
                    <Modal.Body width={width-50}>
                        <DefText text="버릴짐 목록" style={[styles.modalTitle]} />
                        {
                            trashBoxList != "" &&
                            <Box height={width-90} mt='20px'>
                                <Swiper
                                    width={width-90}
                                    height={width-90}
                                    dot={
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
                                    activeDot={
                                        <Box
                                        style={{
                                            backgroundColor: '#0195ff',
                                            width: 7,
                                            height: 7,
                                            borderRadius: 7,
                                            marginLeft: 7,
                                            marginRight: 7
                                        }}
                                        />
                                    }
                                >
                                    {
                                        trashBoxList.map((box, index) => {

                                            let boxWidth = box.x2 - box.x1;
                                            let boxHeight = box.y2 - box.y1;
                                            let boxLeft = box.x1;
                                            let boxBottom = box.y1;

                                            let boxWidthPercent = boxWidth / box.img_width;
                                            let boxWidthPercent2 = (width-90) * boxWidthPercent;

                                            let boxHeightPercent = boxHeight / box.img_height;
                                            let boxHeightPercent2 = (width-90) * boxHeightPercent;

                                            let leftPercent = boxLeft / box.img_width;
                                            let leftPercent2 = width * leftPercent;
                                            
                                            let bottomPercent = boxBottom / box.img_height;
                                            let bottomPercent2 = (width-90) * bottomPercent;

                                            return(
                                                <Box key={index}>
                                                    <Image 
                                                        source={{uri:BASE_URL + "/data/file/ai/" + userInfo.id + "/" + box.imgName}}
                                                        alt={box.product}
                                                        style={{
                                                            width: '100%',
                                                            height:width - 90,
                                                            resizeMode:'stretch',
                                                            borderRadius:10
                                                        }}
                                                    />
                                                    <Box 
                                                        width={ boxWidthPercent2 + 'px' }
                                                        height={ boxHeightPercent2 + 'px' }
                                                        backgroundColor='rgba(0,0,0,0.3)'
                                                        borderWidth={ box.size >= 3 ? 2 : 1}
                                                        borderColor={ box.size >= 3 ? '#f00' : '#ff0'}
                                                        position={'absolute'}
                                                        //bottom={ Platform.OS == 'ios' ? 'auto' : bottomPercent2 + 'px'}
                                                        top={  bottomPercent2 + 'px' }
                                                        left={ leftPercent2 + 'px' }
                                                        justifyContent='center'
                                                        alignItems={'center'}
                                                        
                                                        zIndex={ box.size >= 3 ? 10 : 1}
                                                    >
                                                        {
                                                            box.size >= 3 &&
                                                            <DefText text={box.product} style={[fweight.b, {color:'#fff'}]} />
                                                        }
                                                    </Box>
                                                </Box>
                                            )
                                        })
                                    }
                                </Swiper>
                            </Box>
                        }
                        <DefButton 
                            text="확인" 
                            btnStyle={[styles.modalConfirmBtn]}
                            textStyle={[styles.modalConfirmBtnText]} 
                            onPress={()=>setTrashBoxModal(false)}
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

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    })
)(SmallMoveConfirm);