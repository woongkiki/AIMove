import React, {useState, useEffect, Fragment} from 'react';
import {ScrollView, Dimensions, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Platform} from 'react-native';
import {Box, VStack, HStack, Modal} from 'native-base';
import { DefButton, DefText } from '../common/BOOTSTRAP';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import SubHeader from '../components/SubHeader';
import ApiExpert from '../ApiExpert';
import { BASE_URL } from '../Utils/APIConstant';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import Api from '../Api';
import { numberFormat } from '../common/DataFunction';
import Swiper from 'react-native-swiper';

const {width} = Dimensions.get("window");

const ExpertAuctionView = (props) => {

    const {navigation, userInfo, route} = props;
    const {params} = route;

    //console.log("params:::", params);

    const [aiImageLoading, setAiImageLoading] = useState(true);
    const [imageIndex, setImageIndex] = useState("0");
    const [aiImageData, setAiImageData] = useState([]);
    const [bigBoxData, setBigBoxData] = useState([]);
    const [bigBoxModal, setBigBoxModal] = useState(false);
    const [smallBoxCount, setSmallBoxCount] = useState('');
    const [aiPrice, setAiPrice] = useState("");
    const [auctionChecked, setAuctionChecked] = useState("");
    

    //새로추가
    const [auctionImage, setAuctionImage] = useState([]);
    const [auctionBoxList, setAuctionBoxList] = useState([]);
    const [auctionBigBox, setAucitonBigBox] = useState([]);

    const auctionViewApi = async () => {
        await setAiImageLoading(true);
        await ApiExpert.send('auction_view', {'idx':params.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('역경매 상세 보기: ', resultItem, arrItems);
                setAiImageData(arrItems);
            }else{
               console.log('역경매 상세 실패!', resultItem);
               
            }
        });

        //이미지 가져오기 추가
        await ApiExpert.send('ai_imgList', {'bidx':params.bidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('역경매 이미지 리스트 보기123: ', resultItem, arrItems);
               // setAiImageData(arrItems);
               setAuctionImage(arrItems);
            }else{
               console.log('역경매 이미지 리스트 보기 실패123!', resultItem);
               
            }
        });
        await ApiExpert.send('ai_auctionView', {'idx':params.idx, 'imageIndex':imageIndex}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('역경매 이미지 상세 보기123: ', resultItem);
               // setAiImageData(arrItems);
               setAuctionBoxList(arrItems);
            }else{
               console.log('역경매 이미지 상세 실패123!', resultItem);
               
            }
        });

        await Api.send('ai_aiBigBox', {'id':params.mid, 'bidx':params.bidx}, (args)=>{

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
        await Api.send('ai_aiSmallBox', {'id':params.mid, 'bidx':params.bidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('잔짐 결과 보기: ', arrItems);
               //setBigBoxData(arrItems);
               //setAiImageData(arrItems);
               setSmallBoxCount(arrItems.boxCnt);
            }else{
               console.log('잔짐 결과 보기 실패!', resultItem);
               
            }
        });
        await ApiExpert.send('ai_aiPrice', {'id':params.mid, 'bidx':params.bidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('총금액 보기: ', arrItems);
               setAiPrice(arrItems);
            }else{
               console.log('총금액 보기 실패!', resultItem);
               
            }
        });
        await ApiExpert.send('auction_check', {'ai_idx':params.idx, 'ex_id':userInfo.ex_id, 'mid':params.mid}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('경매참여 체크: ', arrItems);
               //setAiPrice(arrItems);
               setAuctionChecked(arrItems);
            }else{
               console.log('경매참여 체크 실패!', resultItem);
               
            }
        });

        //주요 이삿짐 목록
        await ApiExpert.send('ai_bigBox', {'bidx':params.bidx, 'id':params.mid}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('주요 이삿짐 목록  체크: ', resultItem,arrItems);
               setAucitonBigBox(arrItems);
            }else{
               console.log('주요 이삿짐 목록 체크 실패!', resultItem);
               
            }
        });
        await setAiImageLoading(false);
    }

    const imageSelect = async (index) => {
        //console.log("이미지번호", index);
        await setAiImageLoading(true);
        await setImageIndex(index);
        await setAiImageLoading(false);
    }

    useEffect(()=> {
        auctionViewApi();
    }, [])

    useEffect(()=> {
        auctionViewApi();
    }, [imageIndex])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='견적확인' />
            <ScrollView>
                <Box>
                    {
                        aiImageLoading ?
                        <Box height='286px' width={width} justifyContent='center' alignItems={'center'}>
                            <ActivityIndicator size='large' color='#333' />
                        </Box>
                        :
                        <Box>
                        {
                            auctionImage != "" && 
                            <Box>
                                <TouchableOpacity onPress={()=>navigation.navigate("ImageView", auctionImage)}>
                                    <Image 
                                        source={{uri:BASE_URL + "/data/file/ai/" + params.mid + "/" + auctionImage[imageIndex].f_file}}
                                        style={{
                                            width:width,
                                            height: 286,
                                            resizeMode:'stretch'
                                        }}
                                    />
                                
                                {
                                    auctionBoxList != "" &&
                                    auctionBoxList.map((box, index) => {

                                        let boxWidth = box.x2 - box.x1;
                                        let boxHeight = box.y2 - box.y1;
                                        let boxLeft = box.x1;
                                        let boxBottom = box.y1;

                                        let boxWidthPercent = boxWidth / box.img_width;
                                        let boxWidthPercent2 = width * boxWidthPercent;

                                        let boxHeightPercent = boxHeight / box.img_height;
                                        let boxHeightPercent2 = 286 * boxHeightPercent;

                                        let leftPercent = boxLeft / box.img_width;
                                        let leftPercent2 = width * leftPercent;
                                        
                                        let bottomPercent = boxBottom / box.img_height;
                                        let bottomPercent2 = 286 * bottomPercent;

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
                                        )
                                    })
                                }
                                </TouchableOpacity>
                            </Box>                            
                        }
                        </Box>
                    }
                    
                </Box>
                <Box px='25px' py='15px' pb='25px'>
                    {
                        aiImageData != "" &&
                        <HStack>
                            {
                                aiImageData.map((item, index) => {

                                    //console.log('item::::::' + index, item);
                                    return(
                                        <Box key={index}>
                                            {
                                                index != imageIndex ?
                                                <TouchableOpacity onPress={()=>imageSelect(index)} style={ (index + 1) % 3 == 0 ? {marginRight:0} : {marginRight:(width - 50) * 0.05}}>
                                                    <Box>
                                                        <Image
                                                            source={{uri:BASE_URL + "/data/file/ai/" + params.mid + "/" + item.imgName}}
                                                            alt='샘플'
                                                            style={{
                                                                width:  (width - 50) * 0.3,
                                                                height: 80,
                                                                resizeMode:'stretch',
                                                                borderRadius:10
                                                            }}
                                                        />
                                                    </Box>
                                                </TouchableOpacity>
                                                :
                                                <Box />
                                            }
                                        </Box>
                                    )
                                })
                            }
                        </HStack>
                    }
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
                        <DefText text={params.moveDate.substr(0, 10) + " " + params.moveDatetime} style={[styles.confirmBoxText]}/>
                    </Box>
                    <Box style={[styles.confirmBox]}>
                        <Box>
                            <Box style={[styles.confirmBoxCircle]} />
                            <DefText text='출발지 / 출발지 작업 정보' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                        </Box>
                        <HStack alignItems={'center'}>
                            <DefText text={params.startAddress + " / " + params.startMoveTool } style={[styles.confirmBoxText]}/>
                            {
                                params.startMoveTool == "계단" &&
                                <DefText text={" " + params.startFloor + "층"} style={[styles.confirmBoxText]} />
                            }
                        </HStack>
                    </Box>
                    <Box style={[styles.confirmBox]}>
                        <Box>
                            <Box style={[styles.confirmBoxCircle]} />
                            <DefText text='도착지 / 도착지 작업정보' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                        </Box>
                        <HStack alignItems={'center'}>
                            <DefText text={params.destinationAddress + " / " + params.destinationMoveTool} style={[styles.confirmBoxText]}/>
                            {
                                params.destinationMoveTool == "계단" &&
                                <DefText text={" " + params.destinationFloor + "층"} style={[styles.confirmBoxText]} />
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
                                        <DefText text={params.moveDateKeep.substring(0,10)} style={[fsize.fs14]} />
                                    </HStack>
                                    <HStack alignItems={'center'} mt='10px'>
                                        <DefText text="입주날짜 : " style={[fsize.fs14]} />
                                        <DefText text={params.moveInKeep.substring(0,10)} style={[fsize.fs14]} />
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
                        auctionBigBox.length > 0 &&
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
                        <Box width='30%' >
                            <DefText text='AI 추천견적' style={[styles.priceBoxText, {textAlign:'left'}]} />
                        </Box>
                        {
                            aiPrice != "" &&
                            <Box width='65%' alignItems='flex-end'>
                                <DefText text={ numberFormat(aiPrice.lowPrice) + '원 ~ ' + numberFormat(aiPrice.highPrice) + '원'} style={[styles.priceBoxText]} />
                            </Box>
                        }
                    </HStack>
                    {
                        auctionChecked == "Y" ?
                        <DefButton text='입찰 참여 완료' btnStyle={[styles.submitBtn, {marginTop:20, backgroundColor:'#999'}]} textStyle={[{color:'#fff'}, fweight.m]} disabled={true}  />
                        :
                        <DefButton text='입찰 참여하기' btnStyle={[styles.submitBtn, {marginTop:20}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>navigation.navigate("ExpertAuction", {params})} />
                    }

                </Box>
            </ScrollView>

            <Modal isOpen={bigBoxModal} onClose={()=>setBigBoxModal(false)}>
                <Modal.Content width={width-50}>
                    <Modal.Body p='20px' width={width-50}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <DefText text="주요 이삿짐 목록은 다음과 같습니다." style={[styles.modalTitle]} />
                            {/* <TouchableOpacity style={[styles.modalInsertBtn]}>
                                <DefText text="수정" style={[styles.modalInsertBtnText]} />
                            </TouchableOpacity> */}
                        </HStack>
                        {
                            auctionBigBox != "" &&
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
                                        auctionBigBox.map((box, index) => {

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
                                                        source={{uri:BASE_URL + "/data/file/ai/" + params.mid + "/" + box.imgName}}
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
        marginTop:20,
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
        color:'#0195FF',
        textAlign:'right'
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
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(ExpertAuctionView);