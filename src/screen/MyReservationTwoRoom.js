import React, {useEffect, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ImagePicker from 'react-native-image-crop-picker';
import Api from '../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import ApiExpert from '../ApiExpert';
import Swiper from 'react-native-swiper';
import { BASE_URL } from '../Utils/APIConstant';
import FastImage from 'react-native-fast-image'

const {width, height} = Dimensions.get("window");

const MyReservationTwoRoom = (props) => {

    const {navigation, route, userInfo} = props;
    const {params} = route;

    console.log(params);

    const [loading, setLoading] = useState(true);
    const [twoRoomData, setTwoRoomData] = useState("");
    const [twoRoomStructure, setTwoRoomStructure] = useState("");
    const [twoRoomImageData, setTwoRoomImageData] = useState([]);
    const [twoRoomModal, setTwoRoomModal] = useState(false);

    const [houseStructure, setHouseStructure] = useState([]);

    const twoRoomDataApi = async () => {
        await setLoading(true);
        await ApiExpert.send('tworoom_auctionView', {"idx":params.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('참여가능한 가정집이사 상세 성공', arrItems);
               setTwoRoomData(arrItems.data);
               setTwoRoomStructure(arrItems.structure);
            }else{
               console.log('참여가능한 가정집이사 상세 실패', resultItem);
            }
        });
        await Api.send('tworoom_myVisitImages', {'bidx':params.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

                console.log('내 가정집이사 이미지 가져오기 성공!', resultItem, arrItems);
				setHouseStructure(arrItems);
            }else{

               console.log('내 가정집이사 이미지 가져오기 실패!', resultItem);
              
            }
        });
        await setLoading(false);
    }


    //사진으로 이사 경매참여하기
    const twoRoomSubmitApi = () => {
        ApiExpert.send('tworoom_auctionSubmit', {"idx":params.idx, "mid":twoRoomData.mid, "expert_id":userInfo.ex_id, "expert_name":userInfo.ex_name}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('가정집이사 견적 참여 성공', resultItem);

               ToastMessage(resultItem.message);
               navigation.reset({
                    routes: [{ name: 'ExpertNavi', screen: 'PlayMove' }],
                });

            }else{
               console.log('가정집이사 견적 참여 실패', resultItem);
            }
        });
    }

    const auctionCancle = () => {
        ApiExpert.send('tworoom_homeAuctionCancle', {"auc_idx":params.idx, "mid":twoRoomData.mid, "expert_id":userInfo.ex_id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('가정집이사 견적 취소 성공', resultItem);

               ToastMessage(resultItem.message);
            //    navigation.reset({
            //         routes: [{ name: 'ExpertNavi', screen: 'PlayMove' }],
            //     });


                navigation.replace("ExpertNavi", {
                    screen: "PlayMove",
                    params:{
                        moveCate : "가정집 이사" ,
                        homeCate: "사진",
                    }
                })

            }else{
               console.log('가정집이사 견적 취소 실패', resultItem);
               ToastMessage(resultItem.message);
            }
        });

        setTwoRoomModal(false);
    }

    useEffect(()=>{
        twoRoomDataApi();
    },[])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='가정집이사 예약확인' />
            {
                loading ?
                <Box flex={1} alignItems='center' justifyContent='center' >
                    <ActivityIndicator size="large" color="#333" />
                </Box>
                :
                <ScrollView>
                    <Box px='25px' py='20px'>
                    <DefText text="이미지 확인" style={[fweight.b]} />
                    {
                        houseStructure != "" &&
                        houseStructure.map((item, index) => {
                            return(
                                <Box key={index} mt={ '20px'}>
                                    <DefText text={item.st_title} style={[fsize.fs16,fweight.m]} />
                                    {
                                        item.images.length > 0 && 
                                        <HStack flexWrap={'wrap'}>
                                        {
                                            item.images.map((img, idx) => {
                                                return(
                                                    <Box key={idx} mr={ (idx + 1) % 2 == 0 ? 0 : (width - 50) * 0.038} mt='15px' style={[styles.imgBox]}>
                                                        <TouchableOpacity activeOpacity={1} onPress={()=>navigation.navigate("TwoRoomImageViewEx", item.images)}>
                                                            <FastImage 
                                                                style={[styles.imgSize]}
                                                                source={{
                                                                    uri:BASE_URL + "/data/file/tworoom/" + img.f_file,
                                                                    headers: { Authorization: 'someAuthToken' },
                                                                }} 
                                                                resizeMode={FastImage.resizeMode.stretch}
                                                            />
                                                        </TouchableOpacity>
                                                    </Box>
                                                )
                                            })
                                        }
                                        </HStack>
                                    }
                                </Box>
                            )
                        })
                    }
                    </Box>
                    
                    <Box borderTopWidth={8} borderTopColor='#F3F4F5' px='25px' pt='27px' py='20px'>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='이사전문가' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            <HStack>
                                <TouchableOpacity style={[{marginTop:10, borderBottomWidth:1, borderBottomColor:'#0195ff'}]} onPress={()=>navigation.navigate("ReservationExpert", {"id":params.ex_id, "pay":"S"})}>
                                    <DefText text={params.ex_name + " 전문가님"} style={[fsize.fs14, {color:'#0195ff'}]} />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='집 형태' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                                {
                                    twoRoomData.houseType != "" &&
                                    <DefText text={twoRoomData.houseType} style={[styles.confirmBoxText]}/>
                                }
                            </Box>
                            
                        </Box>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='내집 구조' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                                <HStack flexWrap={'wrap'}>
                                {
                                    houseStructure.map((item, index) => {
                                        return(
                                            <HStack key={index}  alignItems={'flex-end'}>
                                                <DefText 
                                                text={item.st_title}  
                                                style={[styles.confirmBoxText]}
                                                />
                                                {
                                                    (index + 1) != houseStructure.length &&
                                                    <DefText text=", " />
                                                }
                                            </HStack>
                                        )
                                    })
                                }
                                </HStack>
                            </Box>
                            
                        </Box>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='평수' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            {
                                twoRoomData.houseSize != "" &&
                                <DefText text={twoRoomData.houseSize + '평(' + twoRoomData.houseSizem2 + "㎡)"} style={[styles.confirmBoxText]}/>
                            }
                        </Box>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='큰짐 목록' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            {
                                twoRoomStructure != "" &&
                                twoRoomStructure.map((item, index) => {
                                    return(
                                        <Box key={index} mt='10px'>
                                            <HStack>
                                                <DefText text={item.boxtitle + " " + item.boxcount + "개"} style={[styles.confirmBoxText, {marginTop:0}]}/>
                                                {
                                                    item.boxtrash != "N" &&
                                                    <DefText text={" (버릴짐)"} style={[styles.confirmBoxText, {color:'#0195FF', marginTop:0}]} />
                                                }
                                            </HStack>
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='이사날짜 및 시간' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            <DefText text={twoRoomData.moveDate.substring(0,10) + " " + twoRoomData.moveDatetime} style={[styles.confirmBoxText]}/>
                        </Box>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='출발지 / 출발지 작업 정보' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            <HStack alignItems={'center'}>
                                <DefText text={twoRoomData.startAddress + " / " + twoRoomData.startMoveTool } style={[styles.confirmBoxText]}/>
                                {
                                    twoRoomData.startMoveTool == "계단" &&
                                    <DefText text={ " (" +twoRoomData.startFloor + "층)"} style={[styles.confirmBoxText]} />
                                }
                            </HStack>
                        </Box>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='도착지 / 도착지 작업정보' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            <HStack alignItems={'center'}>
                                <DefText text={twoRoomData.destinationAddress + " / " + twoRoomData.destinationMoveTool } style={[styles.confirmBoxText]}/>
                                {
                                    twoRoomData.destinationMoveTool == "계단" &&
                                    <DefText text={ " (" +twoRoomData.destinationFloor + "층)"} style={[styles.confirmBoxText]} />
                                }
                            </HStack>
                        </Box>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='이사 유형' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            <DefText text={twoRoomData.pakageType} style={[styles.confirmBoxText]}/>
                            
                        </Box>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='주방과 욕실 정리 인력 필요 여부' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            {
                                twoRoomData.personStatus == "예" ?
                                <HStack mt='10px'>
                                    <Box px='10px' py='5px' backgroundColor={'#0195ff'}>
                                        <DefText text={"필요있음"} style={[styles.confirmBoxText, {marginTop:0, color:'#fff'}]}/>
                                    </Box>
                                </HStack>
                                :
                                <DefText text={"필요없음"} style={[styles.confirmBoxText]}/>
                            }
                        </Box>
                        <Box style={[styles.confirmBox,  {paddingBottom:0, borderLeftWidth:0}]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='이사보관서비스 필요 여부' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            {
                                twoRoomData.keepStatus == "예" ?
                                <Box>
                                    <HStack mt='10px'>
                                        <Box px='10px' py='5px' backgroundColor={'#0195ff'}>
                                            <DefText text={"필요있음"} style={[styles.confirmBoxText, {marginTop:0, color:'#fff'}]}/>
                                        </Box>
                                    </HStack>
                                    <Box>
                                        <HStack alignItems={'center'} mt='10px'>
                                            <DefText text="이사날짜 : " style={[fsize.fs14]} />
                                            <DefText text={twoRoomData.moveDateKeep.substring(0, 10)} style={[fsize.fs14]} />
                                        </HStack>
                                        <HStack alignItems={'center'} mt='10px'>
                                            <DefText text="입주날짜 : " style={[fsize.fs14]} />
                                            <DefText text={twoRoomData.moveInKeep.substring(0, 10)} style={[fsize.fs14]} />
                                        </HStack>
                                    </Box>
                                </Box>
                                :
                                <DefText text={"필요없음"} style={[styles.confirmBoxText]}/>
                            }
                        </Box>
                    </Box>
                </ScrollView>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    addButton: {
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        backgroundColor:'#0195ff'
    },
    pageTitle: {
        ...fsize.fs18,
        ...fweight.b
    },
    subTitle: {
        ...fsize.fs16,
        ...fweight.b
    },
    houseTypeButton: {
        width: (width-50) * 0.32,
        height: 36,
        borderRadius:10,
        backgroundColor:'#DFDFDF',
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
    },
    houseTypeButtonText: {
        ...fsize.fs14
    },
    houseInfoTitle: {
        ...fweight.m
    },
    countBox: {
        width:100,
        height:34,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#DFDFDF'
    },
    countInnerBox: {
        width: 100 / 3,
        height:34,
        justifyContent:'center',
        alignItems:'center'
    },
    countInnerText: {
        ...fweight.m
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
    submitBtn: {
        ...colorSelect.sky,
        width:width,
        borderRadius:0
    },
    modalText: {
        ...fsize.fs16,
        ...fweight.b
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
    },
    imgBox: {
		width: (width - 50) * 0.48,
		height:120,
		borderRadius:10,
		overflow: 'hidden'
	},
	imgSize: {
        width:'100%',
        height: '100%',
        resizeMode:'stretch',
        borderRadius:10
	},
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    })
)(MyReservationTwoRoom);