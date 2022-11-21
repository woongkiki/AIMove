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
import Loading from '../components/Loading';
import Swiper from 'react-native-swiper';
import { BASE_URL } from '../Utils/APIConstant';

const {width, height} = Dimensions.get('window');

const CarAuctionCheck = (props) => {

    const {navigation, route} = props;
    const {params} = route;

    console.log(params);
    const [carAuctionViewData, setCarAuctionViewData] = useState(params);

    const [loading, setLoading] = useState(true);
    const [carImage, setCarImage] = useState("");

    const carAuctionCheckHandler = async () => {
        await setLoading(true);
        await Api.send('car_carAuctionImage', {'idx':params.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('차량제공요청 이미지 자세히 보기: ', resultItem, arrItems);
               setCarImage(arrItems);
            }else{
               console.log('차량제공요청 이미지 자세히 실패!', resultItem);
               
            }
        });
        await setLoading(false);
    }

    useEffect(()=> {
        carAuctionCheckHandler();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="차량 제공요청 상세" navigation={navigation} />
            {
                loading ? 
                <Loading />
                :
                <ScrollView>
                    {
                        carImage != "" &&
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
                                carImage.map((item, index) => {
                                    return(
                                        <Box key={index} justifyContent={'center'} alignItems='center'>
                                            <TouchableOpacity onPress={()=>navigation.navigate("CarAuctionImageView", carImage)}>
                                            <Image 
                                                source={{ uri: BASE_URL + '/data/file/car/' + item.f_file}}
                                                style={{
                                                    width: width,
                                                    height: width / 1.71,
                                                    resizeMode:'stretch'
                                                }}                                
                                            />
                                            </TouchableOpacity>
                                        </Box>
                                    )
                                })
                            }
                        </Swiper>
                        
                    }
                    <Box borderTopWidth={8} borderTopColor='#F3F4F5' px='25px' pt='27px' py='20px'>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='이사날짜 및 시간' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            <DefText text={carAuctionViewData.moveDate.substr(0, 10) + " " + carAuctionViewData.moveDatetime} style={[styles.confirmBoxText]}/>
                        </Box>
                        <Box style={[styles.confirmBox]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='출발지' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            <DefText text={carAuctionViewData.startAddress} style={[styles.confirmBoxText]}/>
                        </Box>
                        <Box style={[styles.confirmBox, {paddingBottom:0, borderLeftWidth:0}]}>
                            <Box>
                                <Box style={[styles.confirmBoxCircle]} />
                                <DefText text='도착지' style={[styles.confirmBoxTitle, {marginTop:-2}]} />
                            </Box>
                            <DefText text={carAuctionViewData.destinationAddress} style={[styles.confirmBoxText]}/>
                        </Box>
                    </Box>
                </ScrollView>
            }
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
        color:'#0195FF'
    },
    confirmText: {
        ...fsize.fs14,
        ...fweight.b,
        color:'#FF5050'
    },
    submitBtn: {
        ...colorSelect.sky,
        width: width,
        borderRadius:0,
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
    }
})


export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    })
)(CarAuctionCheck);