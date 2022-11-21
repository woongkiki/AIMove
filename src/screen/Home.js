import React, {useCallback, useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefInput, DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import Swiper from 'react-native-swiper';
import { BASE_URL } from '../Utils/APIConstant';
import RenderHtml from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import YoutubePlayer from "react-native-youtube-iframe";
import ToastMessage from '../components/ToastMessage';
import { getStatusBarHeight } from "react-native-status-bar-height"; //상태바 높이
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";
import HeaderHome from '../components/HeaderHome';
import { Vimeo } from 'react-native-vimeo-iframe';
import { useIsFocused } from '@react-navigation/native';

const statusBar = getStatusBarHeight(true);
const isIphons = isIphoneX();
const {width, height} = Dimensions.get('window');

let bottomBox = height - width - 70;
if(Platform.OS === 'ios'){
    if(isIphons){
        bottomBox = height - (width) - 70 - statusBar - getBottomSpace();
    }else{
        bottomBox = height - (width) - 70 - statusBar;
    }
}else{
    bottomBox = height - width;
}

const WebRender = React.memo(function WebRender({html}) {
    return(
        <RenderHtml
            source={{html:html}}
            ignoredStyles={[ 'width', 'height', 'margin', 'padding']}
            ignoredTags={['head', 'script', 'src', 'br']}
            imagesMaxWidth={width - 40}
            contentWidth={width - 40}
            tagsStyles={StyleHtml}
        /> 
    )
})

const Home = (props) => {
    
    const {navigation, userInfo, member_chatCnt} = props;

    const [loading, setLoading] = useState(true);
    const [infoModal, setInfoModal] = useState(false);
    const [bannerList, setBannerList] = useState([]);
    const [mainApiData, setMainApiData] = useState([]);
    const [appInfoText, setAppInfoText] = useState("");
    const [appInfoTextModal, setAppInfoTextModal] = useState(false);
    const [appInfoVideoKey, setAppInfoVideoKey] = useState("");
    const [appInfoVideoModal, setAppInfoVideoModal] = useState("");
    const [videoPlay, setVideoPlay] = useState("pause");
    const [loginCount, setLoginCoung] = useState("0");

    const onStateChange = useCallback((state) => {
        if(state === "ended"){
            setVideoPlay("pause");
        }
    })

    const isFocused = useIsFocused();

    const chatCntHandler = async () => {
        const formData = new FormData();
        formData.append('mid', userInfo.id);
        formData.append('method', 'member_chatCnt');

        const chat_cnt = await member_chatCnt(formData);

        console.log("chat_cnt::", chat_cnt);
    }

    useEffect(() => {
        if(isFocused){
            chatCntHandler();
        }
    }, [isFocused])

    const homeBannerApi = async () => {
        await setLoading(true);
        await Api.send('main_loginCount', {'id':userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('로그인 횟수 가져오기: ', resultItem, arrItems);
               setLoginCoung(arrItems);
            }else{
               console.log('로그인 횟수 가져오기 실패!', resultItem);
               
            }
        });
        await Api.send('banner_main', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('소비자 메인 배너 보기: ', resultItem, arrItems);
               setBannerList(arrItems);
            }else{
               console.log('소비자 메인 배너 실패!', resultItem);
               
            }
        });
        await Api.send('main_api', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('메인 api 보기: ', resultItem, arrItems);
               setMainApiData(arrItems);
            }else{
               console.log('메인 api 출력 실패!', resultItem);
               
            }
        });
        await Api.send('main_infoContent', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('앱 설명글 보기: ', arrItems);
               setAppInfoText(arrItems);
            }else{
               console.log('앱 설명글 출력 실패!', resultItem);
               setAppInfoText("");
            }
        });
        await Api.send('main_infoVideo', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('앱 동영상 설명 키값 보기: ', arrItems);
               setAppInfoVideoKey(arrItems);
            }else{
               console.log('앱 동영상 설명 키값 출력 실패!', resultItem);
               setAppInfoVideoKey("");
            }
        });
        await setLoading(false);

    }


    const AICameraHandler = () => {
        if(userInfo.phoneNumber == ""){
            ToastMessage("본인인증 및 회원정보 업데이트를 먼저 진행하세요.");
            // navigation.replace("TabNav", {
            //     screen: "Mypage"
            // })
            navigation.navigate("ProfileSetting");
            return false;
        }else{
            navigation.navigate('MoveType');
        }
    }

    useEffect(()=> {
        homeBannerApi();
    },[])

    useEffect(()=> {
        if(!appInfoVideoModal){
            setVideoPlay("pause");
        }
    }, [appInfoVideoModal])

    
    const videoCallbacks = {
        timeupdate: (data) => console.log('timeupdate: ', data),
        play: (data) => console.log('play: ', data),
        pause: (data) => console.log('pause: ', data),
        fullscreenchange: (data) => console.log('fullscreenchange: ', data),
        ended: (data) => console.log('ended: ', data),
        controlschange: (data) => console.log('controlschange: ', data),
      };


    return (
        <Box flex={1} backgroundColor='#fff' justifyContent={'space-between'}>

            {
                loading ? 
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <Box flex={1}  justifyContent={'space-between'}>
                    <ScrollView>
                    <Box>
                        {
                            (loginCount * 1) < 10 &&
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
                        }
                        {
                            bannerList != "" &&
                            bannerList.mainCate == "동영상" ?
                            <Box width={width} height={width} >
                                <Vimeo
                                    videoId={bannerList.vimdoKey}
                                    params={'api=1&autoplay=0'}
                                    handlers={videoCallbacks}
                                />
                            </Box>
                            :
                            <Box height={width}>
                                <Swiper
                                    width={width}
                                    height={width}
                                    dot={
                                        <Box
                                        style={{
                                            backgroundColor: 'transparent',
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
                                            backgroundColor: 'transparent',
                                            width: 7,
                                            height: 7,
                                            borderRadius: 7,
                                            marginLeft: 7,
                                            marginRight: 7
                                        }}
                                        />
                                    }
                                    autoplay={true}
                                    autoplayTimeout={100}
                                >
                                    {
                                        bannerList != "" &&
                                        bannerList.bannerImg.map((item, index) => {
                                            return(
                                                <Image 
                                                    source={{uri: BASE_URL + "/data/file/main_banners/" + item.f_file}} 
                                                    alt="전문가 등록 배너.." 
                                                    style={[{
                                                        width:width,
                                                        height:width,
                                                        resizeMode:'stretch'
                                                    }]}
                                                    key={index}
                                                />
                                            )
                                        })
                                    }
                                </Swiper>
                            </Box> 
                        }
                       
                        <HStack position={'absolute'} bottom={'25px'} zIndex={99} right='25px' justifyContent={'flex-end'} >
                            <TouchableOpacity
                                style={[
                                    styles.cameraButton
                                ]}
                                onPress={AICameraHandler}
                            >
                                <HStack
                                    alignItems={'center'}
                                    justifyContent='space-around'
                                >
                                    <Image 
                                        source={require('../images/cameraIcon.png')} 
                                        style={[
                                            {
                                                width:16,
                                                height:14,
                                                resizeMode:'contain',
                                            }
                                        ]}
                                    />
                                    <DefText 
                                        text='이사 견적' 
                                        style={[
                                            styles.cameraButtonText
                                        ]}
                                    />
                                </HStack>
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                  
        
                    
                    <Box pt='20px' backgroundColor='#fff' shadow={6} overflow='hidden'>
                        {
                            mainApiData.apiText != "" &&
                            <HStack alignItems={'flex-end'} px='25px' >
                                <DefText text={mainApiData.apiText} style={[styles.reviewTitle]} />
                                <DefText text={'(' + mainApiData.api.length + ( mainApiData.apiText == '이사전문가' ? '명)' : '건)')} style={[styles.reviewCountTitle]} />
                            </HStack>
                        }
                        <Box >
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                <HStack mt='20px' pb='25px' px='25px' >
                                    {
                                        mainApiData != "" &&
                                        mainApiData.api.map((item, index) => {
                                            return(
                                                <TouchableOpacity key={index} activeOpacity={0.8} style={[index != 0 ? {marginLeft:20} : {marginLeft:0}]}
                                                    onPress={()=>navigation.navigate("ReservationExpert", {"id":item.ex_id, "pay":"S"})}
                                                >
                                                    <Box px='15px' py='20px' justifyContent={'space-between'} backgroundColor='#FCFCFC' borderRadius={10} shadow={3} style={{width: (width-50) * 0.68}}>
                                                        <HStack alignItems={'center'} justifyContent='space-between'>
                                                            <VStack width={ (width - 50) * 0.4 } >
                                                                <HStack alignItems={'flex-end'}>
                                                                    <DefText text={item.ex_name} style={[styles.expertName]} />
                                                                    <DefText text='이사전문가' style={[styles.expertSubject]} />
                                                                </HStack>
                                                                <DefText text={ item.ex_service_status } style={[styles.expertCate]} />
                                                                {/* <DefText text={ numberFormat(230000) + '원' } style={[styles.expertPrice]} /> */}
                                                            </VStack>
                                                            {
                                                                item.expert_profile != "" ?
                                                                <Box width={ (width - 50) * 0.17 } borderRadius={'15px'} overflow='hidden'>
                                                                    <Image 
                                                                        source={{uri:BASE_URL + "/data/file/expert/" + item.expert_profile}}
                                                                        alt='홍길동'
                                                                        style={[
                                                                            {
                                                                                width: (width - 50) * 0.17,
                                                                                height: (width - 50) * 0.17,
                                                                                borderRadius: ((width - 50) * 0.17) / 2,
                                                                                resizeMode:'stretch'
                                                                            }
                                                                        ]}
                                                                    />
                                                                </Box>
                                                                :
                                                                <Box width={ (width - 50) * 0.17 } >
                                                                    <Box width={(width - 50) * 0.17 + 'px'} borderRadius={'15px'} overflow='hidden'>
                                                                        <Image 
                                                                            source={{uri:BASE_URL + "/images/appLogo.png"}}
                                                                            alt='홍길동'
                                                                            style={[
                                                                                {
                                                                                    width: (width - 50) * 0.17,
                                                                                    height: (width - 50) * 0.17,
                                                                                    resizeMode:'stretch'
                                                                                }
                                                                            ]}
                                                                        />
                                                                    </Box>
                                                                </Box>
                                                            }
                                                            
                                                        </HStack>
                                                        <Box>
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
                                                                <DefText text={item.star_avg} style={[styles.scoreText]} />
                                                            </HStack>
                                                            {
                                                                mainApiData.apiText == "이사전문가" ?
                                                                    item.ex_service_name != "" &&
                                                                    <DefText text={ textLengthOverCut(item.ex_service_name, 18, '...')} style={[styles.reviewContent]} />
                                                                :
                                                                <DefText text={ textLengthOverCut("감사합니다. 깔끔한 이사가 완료되었습니다.", 18, '...')} style={[styles.reviewContent]} />
                                                            }
                                                            
                                                        </Box>
                                                    </Box>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                   
                                    
                                </HStack>
                            </ScrollView>
                        </Box>
                    </Box>
                    </ScrollView>
                </Box>
            }
            
            

           {
                infoModal && 
                
                <Box backgroundColor='#fff' height={height - 70} alignItems='center' justifyContent='center' position={'absolute'} top='0' left='0' width={width}>
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
                        <TouchableOpacity onPress={()=>setAppInfoVideoModal(true)} style={[styles.button, colorSelect.sky]}>
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
                        <TouchableOpacity onPress={()=>setAppInfoTextModal(true)} style={[styles.button, colorSelect.black, {marginTop:15}]}>
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
           <Modal isOpen={appInfoTextModal} onClose={()=>setAppInfoTextModal(false)}>
                <Modal.Content width={width - 50} p='0'>
                    <Modal.Body p='0'>
                    {
                        appInfoText != "" ?
                        <WebRender html={appInfoText} />
                        :
                        <Box px='20px' py='40px' justifyContent={'center'} alignItems='center'>
                            <DefText text='입력된 설명이 없습니다.' style={{color:'#666'}} />
                        </Box>
                    }
                    </Modal.Body>
                </Modal.Content>
           </Modal>
           <Modal isOpen={appInfoVideoModal} onClose={()=>setAppInfoVideoModal(false)}>
                <Modal.Content width={width - 50} p='0'>
                    <Modal.Body p='0'>
                        {
                            appInfoVideoKey != "" ?
                            // <YoutubePlayer
                            //     height={191}
                            //     play={videoPlay}
                            //     videoId={appInfoVideoKey}
                            //     onChangeState={onStateChange}
                            // />
                            <Vimeo
                                videoId={appInfoVideoKey}
                                params={'api=1&autoplay=0'}
                                handlers={videoCallbacks}
                            />
                            :
                            <Box px='20px' py='40px' justifyContent={'center'} alignItems='center'>
                                <DefText text='영상 준비중입니다.' style={{color:'#666'}} />
                            </Box>
                        }
                        
                    </Modal.Body>
                </Modal.Content>
           </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    topButton: {
        width:width,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        //backgroundColor:'rgba(0,0,0,0.5)',
        ...colorSelect.sky,
        //marginBottom:10
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
        width:133,
        height:40,
        backgroundColor:'#6477FD',
        borderRadius:17,
        justifyContent:'center',
        alignItems:'center',
    },
    cameraButtonText: {
        ...fsize.fs14,
        ...fweight.b,
        color:'#fff',
        marginLeft:10
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
        member_chatCnt: (user) => dispatch(UserAction.member_chatCnt(user))
    })
)(Home);