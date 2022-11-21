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
import Loading from '../components/Loading';
import { BASE_URL } from '../Utils/APIConstant';

const {width, height} = Dimensions.get("window");

const TwoRoomImageSubmit = (props) => {

    const {navigation, visitParam, userInfo} = props;

	const [houseInfo, setHouseInfo] = useState("");
	const [houseStructure, setHouseStructure] = useState([]);
	const [houseBigBox, setHouseBigBox] = useState([]);

    const myAuctionApi = async () => {
        await Api.send('tworoom_myVisitAuction', {'idx':visitParam.idx, 'mid':userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

                //console.log('내 가정집이사 견적확인 성공!', resultItem, arrItems);
				setHouseInfo(arrItems);
            }else{

               console.log('내 가정집이사 견적확인 실패!', resultItem);
              
            }
        });
		await Api.send('tworoom_myVisitImages', {'bidx':visitParam.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

                console.log('내 가정집이사 이미지 가져오기 성공!', resultItem, arrItems[0].images);
				setHouseStructure(arrItems);
            }else{

               console.log('내 가정집이사 이미지 가져오기 실패!', resultItem);
              
            }
        });
		await Api.send('tworoom_myVisitBigBox', {'bidx':visitParam.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {

                //console.log('내 가정집이사 큰짐 가져오기 성공!', resultItem, arrItems);
				setHouseBigBox(arrItems);
            }else{

               console.log('내 가정집이사 큰짐 가져오기 실패!', resultItem);
              
            }
        });
    }
	

    useEffect(()=> {
        myAuctionApi();
    }, [])

    return (
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
													<TouchableOpacity onPress={()=>navigation.navigate("TwoRoomImageViewMy", houseStructure[index]['images'])}>
														<Image 
															source={{uri:BASE_URL + "/data/file/tworoom/" + img.f_file}} style={[styles.imgSize]} 
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
			{
				houseInfo != "" &&
				<Box borderTopWidth={8} borderTopColor='#F3F4F5' px='25px' pt='27px' py='20px'>
					<Box style={[styles.confirmBox]}>
						<Box>
							<Box style={[styles.confirmBoxCircle]} />
							<DefText text='집 형태' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
							{
								houseInfo.houseType != "" &&
								<DefText text={houseInfo.houseType} style={[styles.confirmBoxText]}/>
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
							houseInfo.houseSize != "" &&
							<DefText text={houseInfo.houseSize + '평(' + houseInfo.houseSizem2 + "㎡)"} style={[styles.confirmBoxText]}/>
						}
					</Box>
					<Box style={[styles.confirmBox]}>
						<Box>
							<Box style={[styles.confirmBoxCircle]} />
							<DefText text='큰짐 목록' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
						</Box>
						{
							houseBigBox != "" &&
							houseBigBox.map((item, index) => {
								return(
									<Box key={index} mt='10px'>
										<DefText text={item.boxtitle + " " + item.boxcount + "개"} style={[styles.confirmBoxText, {marginTop:0}]}/>
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
						{
							houseInfo.moveDate && 
							<DefText text={houseInfo.moveDate.substring(0, 10) + " " + houseInfo.moveDatetime} style={[styles.confirmBoxText]}/>
						}
					</Box>
					<Box style={[styles.confirmBox]}>
						<Box>
							<Box style={[styles.confirmBoxCircle]} />
							<DefText text='출발지 / 출발지 작업 정보' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
						</Box>
						{
							houseInfo.startAddress && 
							<DefText text={houseInfo.startAddress + " / " + houseInfo.startMoveTool } style={[styles.confirmBoxText]}/>
						}
					</Box>
					<Box style={[styles.confirmBox]}>
						<Box>
							<Box style={[styles.confirmBoxCircle]} />
							<DefText text='도착지 / 도착지 작업정보' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
						</Box>
						{
							houseInfo.destinationAddress && 
							<DefText text={houseInfo.destinationAddress + " / " + houseInfo.destinationMoveTool} style={[styles.confirmBoxText]}/>
						}
						
					</Box>
					<Box style={[styles.confirmBox]}>
						<Box>
							<Box style={[styles.confirmBoxCircle]} />
							<DefText text='이사 업체 추천방법' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
						</Box>
						{
							houseInfo.destinationAddress && 
							<DefText text={houseInfo.moveCategory} style={[styles.confirmBoxText]}/>
						}
					</Box>
					<Box style={[styles.confirmBox]}>
						<Box>
							<Box style={[styles.confirmBoxCircle]} />
							<DefText text='이사 유형' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
						</Box>
						{
							houseInfo.pakageType && 
							<DefText text={houseInfo.pakageType} style={[styles.confirmBoxText]}/>
						}
					</Box>
					<Box style={[styles.confirmBox]}>
						<Box>
							<Box style={[styles.confirmBoxCircle]} />
							<DefText text='주방과 욕실 정리 인력 필요 여부' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
						</Box>
						{
							houseInfo.personStatus == "예" ?
							<HStack mt='10px'>
								<Box px='10px' py='5px' backgroundColor={'#0195ff'}>
									<DefText text={"필요있음"} style={[styles.confirmBoxText, {marginTop:0, color:'#fff'}]}/>
								</Box>
							</HStack>
							:
							<DefText text={"필요없음"} style={[styles.confirmBoxText]}/>
						}
					</Box>
					<Box style={[styles.confirmBox, {paddingBottom:0, borderLeftWidth:0} ]}>
						<Box>
							<Box style={[styles.confirmBoxCircle]} />
							<DefText text='이사보관서비스 필요 여부' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
						</Box>
						{
							houseInfo.keepStatus == "예" ?
							<Box>
								<HStack mt='10px'>
									<Box px='10px' py='5px' backgroundColor={'#0195ff'}>
										<DefText text={"필요있음"} style={[styles.confirmBoxText, {marginTop:0, color:'#fff'}]}/>
									</Box>
								</HStack>
								<Box>
									<HStack alignItems={'center'} mt='10px'>
										<DefText text="이사날짜 : " style={[fsize.fs14]} />
										<DefText text={houseInfo.moveDateKeep.substring(0, 10)} style={[fsize.fs14]} />
									</HStack>
									<HStack alignItems={'center'} mt='10px'>
										<DefText text="입주날짜 : " style={[fsize.fs14]} />
										<DefText text={houseInfo.moveInKeep.substring(0, 10)} style={[fsize.fs14]} />
									</HStack>
								</Box>
							</Box>
							:
							<DefText text={"필요없음"} style={[styles.confirmBoxText]}/>
						}
					</Box>
				</Box>
			}
			
		</ScrollView>
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
		borderRadius:10,
		overflow: 'hidden'
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
)(TwoRoomImageSubmit);