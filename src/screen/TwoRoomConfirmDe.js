import React, {useEffect, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
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
import { ActivityIndicator } from 'react-native-paper';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Swiper from 'react-native-swiper';

const {width, height} = Dimensions.get("window");

//임시
const animationImages = [
	'https://mymoving.cafe24.com/images/loginImg1.png',
	'https://mymoving.cafe24.com/images/loginImg2.png',
	'https://mymoving.cafe24.com/images/loginImg3.png',
	'https://mymoving.cafe24.com/images/loginImg4.png',
	'https://mymoving.cafe24.com/images/loginImg5.png',
	'https://mymoving.cafe24.com/images/loginImg1.png',
	'https://mymoving.cafe24.com/images/loginImg2.png',
	'https://mymoving.cafe24.com/images/loginImg3.png',
	'https://mymoving.cafe24.com/images/loginImg4.png',
	'https://mymoving.cafe24.com/images/loginImg5.png',
	'https://mymoving.cafe24.com/images/loginImg1.png',
	'https://mymoving.cafe24.com/images/loginImg2.png',
	'https://mymoving.cafe24.com/images/loginImg3.png',
	'https://mymoving.cafe24.com/images/loginImg4.png',
	'https://mymoving.cafe24.com/images/loginImg5.png',
	'https://mymoving.cafe24.com/images/loginImg1.png',
	'https://mymoving.cafe24.com/images/loginImg2.png',
	'https://mymoving.cafe24.com/images/loginImg3.png',
	'https://mymoving.cafe24.com/images/loginImg4.png',
	'https://mymoving.cafe24.com/images/loginImg5.png',
]


const TwoRoomConfirmDe = (props) => {

    const {navigation, userInfo, route} = props;
    const {params} = route;


    console.log("params:::", params);

    const [loading, setLoading] = useState(true);
	const [imageNumber, setImageNumber] = useState("0");
    const [imageLoading, setImageLoading] = useState(false);

    const isFocused = useIsFocused();

    const loadingHandler = async () => {
        await setLoading(true);
        await setLoading(false);
    }

    useEffect(()=> {
        loadingHandler();

        //console.log(isFocused);
    }, [isFocused])

		const tworoomImageRequest = async () => {
			await setImageLoading(true);
        	await tworoomRequestApi();
		}

		const tworoomRequestApi = async () => {
        
			const formData = new FormData();
			formData.append('method', 'tworoom_photo');


			let arr = JSON.stringify(params.bigSelectBox);

			formData.append("bigBox", arr);

			let imgData = JSON.stringify(params.houseStructure);
			console.log(params.houseStructure);
			formData.append("imgData", imgData);


			//let gogo = [];

			params.houseStructure.map((item, index) => {

				item.images.map((img, idx) => {
					let tmpName = img.path;
					let fileLength = tmpName.length;
					let fileDot = tmpName.lastIndexOf('.');
					let fileExt = tmpName.substring(fileDot, fileLength).toLowerCase();
					let strtotime = new Date().valueOf();
					let fullName = strtotime + index + fileExt;

					return formData.append('files[]', {'uri' : img.path, 'name': fullName, 'size': img.size, 'type': img.mime});
				})
			});

			// let arr2 = JSON.stringify(params.houseStructure);
			// formData.append("filedata", arr2);

			formData.append("mid", userInfo.id);
			formData.append("mname", userInfo.name);
			formData.append("mphone", userInfo.phoneNumber);
			formData.append("houseType", params.houseType);
			formData.append("houseSize", params.houseSize);
			formData.append("houseSizem2", params.houseSizem2);
			formData.append("moveCategory", params.moveCategory);
			formData.append("pakageType", params.pakageType);
			formData.append("personStatus", params.personStatus);
			formData.append("keepStatus", params.keepStatus);
			formData.append("moveDateKeep", params.moveDateKeep);
			formData.append("moveInKeep", params.moveInKeep);
			formData.append("moveDate", params.moveDate);
			formData.append("moveDatetime", params.moveDatetime);
			formData.append("startAddress", params.startAddress);
			formData.append("startMoveTool", params.startMoveTool);
			formData.append("startFloor", params.startFloor);
			formData.append("startAddrLat", params.startAddrLat);
			formData.append("startAddrLon", params.startAddrLon);
			formData.append("destinationAddress", params.destinationAddress);
			formData.append("destinationMoveTool", params.destinationMoveTool);
			formData.append("destinationFloor", params.destinationFloor);
			formData.append("destinationAddrLat", params.destinationAddrLat);
			formData.append("destinationAddrLon", params.destinationAddrLon);

			const upload = await Api.multipartRequest(formData);

			//console.log("upload::::",upload);
			console.log("사진으로 가정집견적 요청", upload);
			if(upload.result){
				await setImageLoading(false);
				await navigationReservaton();
				ToastMessage(upload.msg);
			}
	}


	const navigationReservaton = () => {
			// navigation.reset({
			// 		routes: [{ name: 'TabNav', screen: 'Reservation' }],
			// });

			navigation.navigate('TabNav', {
				screen: 'Reservation',
				params:{
					moveCate : "가정집 이사" ,
					tabCategory: "찾는중",
					twoCate:"사진"
				}
		});
	}

	useEffect(()=> {
			
		if(imageLoading){

				let count = 0;
				let countInterval = setInterval(()=> {
						setImageNumber((count++) % 5)
						console.log('count', count);

						if(count == 20){
								clearInterval(countInterval);
								// navigation.navigate("MoveConfirm");
								//navigation.goBack();
						}

				}, 1500)
		
				
				return() => {
						clearInterval(countInterval);
				}

		}
	}, [imageLoading]);

    return (
        <Box flex={1} backgroundColor='#fff'>
			<SubHeader navigation={navigation} headerTitle='가정집이사 사진으로 이사' />
            {
                loading ?
                <Box justifyContent={'center'} alignItems='center' flex={1}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
					<Box px='25px' py='20px'>
						<DefText text="이미지 확인" style={[fweight.b]} />
					{
						params.houseStructure.map((item, index) => {
							return(
								<Box key={index} mt={ '20px'}>
									<DefText text={item.title} style={[fsize.fs16,fweight.m]} />
									
									{
										item.images.length > 0 && 
										<HStack flexWrap={'wrap'}>
										{
											item.images.map((img, idx) => {
												return(
													<Box key={idx} mr={ (idx + 1) % 2 == 0 ? 0 : (width - 50) * 0.038} mt='15px' style={[styles.imgBox]}>
														<TouchableOpacity activeOpacity={1} onPress={()=>navigation.navigate("TwoRoomImageView", item.images)}>
															<Image source={{uri:img.path}} style={[styles.imgSize]} />
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
                                <DefText text='집 형태' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            <DefText text={params.houseType} style={[styles.confirmBoxText]}/>
                        </Box>
						<Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='내집 구조' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
							<HStack flexWrap={'wrap'}>
							{
								params.houseStructure.map((item, index) => {
									return(
										<HStack key={index}  alignItems={'flex-end'}>
											<DefText 
												
												text={item.title}  
												style={[styles.confirmBoxText]}
												/>
												{
													(index + 1) != params.houseStructure.length &&
													<DefText text=", " />
												}
										</HStack>
									)
								})
							}
                            </HStack>
                        </Box>
						<Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='평수' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            <DefText text={params.houseSize + '평(' + params.houseSizem2 + "㎡)"} style={[styles.confirmBoxText]}/>
                        </Box>
						<Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='큰짐 목록' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
							{
								params.bigSelectBox != "" &&
								params.bigSelectBox.map((item, index) => {
									return(
										<Box key={index} mt='10px'>
											<DefText text={item.bigTitle + " " + item.bigCount + "개"} style={[styles.confirmBoxText, {marginTop:0}]}/>
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
						<Box style={[styles.confirmBox, {paddingBottom:0, borderLeftWidth:0}]}>
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
                     </Box>
                </ScrollView>
            }
			<BottomButton 
                leftText='이전' 
                rightText='전문가 찾기 요청' 
                leftonPress={()=>navigation.goBack()} 
                rightonPress={tworoomImageRequest}
            />
			{
                imageLoading &&
                <Box flex={1} backgroundColor='rgba(0,0,0,0.8)' height={height} width={width} position='absolute' top='0' right='0' justifyContent={'center'} alignItems='center'>
                    <DefText text='전문가 찾기 준비중입니다.' style={[styles.lodingText, {marginBottom:50}]} />
                    <Image
                        source={{uri:animationImages[imageNumber]}}
                        style={{
                            width:68,
                            height:68,
                            resizeMode:'contain'
                        }}
                    />
                </Box>
            }
						
        </Box>
    );
};

const styles = StyleSheet.create({
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
	imgBox: {
			width: (width - 50) * 0.48,
			height:120,
			borderRadius:10
	},
	imgSize: {
			width:'100%',
			height: '100%',
			resizeMode:'stretch',
			borderRadius:10
	},
	lodingText: {
		...fsize.fs24,
		...fweight.b,
		color:'#fff'
},
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    })
)(TwoRoomConfirmDe);