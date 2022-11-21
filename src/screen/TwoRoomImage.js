import React, {useCallback, useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';
import RenderHtml from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import YoutubePlayer from "react-native-youtube-iframe";
import { Vimeo } from 'react-native-vimeo-iframe';

const {width, height} = Dimensions.get("window");

const systemFonts = [...Font.SCoreDreamR, 'S-CoreDream-4Regular'];
const WebRender = React.memo(function WebRender({html}) {
    return(
        <RenderHtml
            source={{html:html}}
            ignoredStyles={[ 'width', 'height', 'margin', 'padding']}
            ignoredTags={['head', 'script', 'src']}
            imagesMaxWidth={width - 40}
            contentWidth={width}
            tagsStyles={StyleHtml}
            systemFonts={systemFonts}
        /> 
    )
})

const TwoRoomImage = (props) => {

    const {navigation, route} = props;
    const {params} = route;


    const [tutoriaImage, setTutorialImage] = useState("");

    const [appTutorial, setAppTutorial] = useState("");
    const [appText, setAppText] = useState("");
    const [videoPlay, setVideoPlay] = useState("pause");

    const onStateChange = useCallback((state) => {
        if(state === "ended"){
            setVideoPlay("pause");
        }
    })

    const tutorialBannerApi = async () => {
       
        await Api.send('banner_tutorial', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('소비자 메인 배너 보기: ', resultItem, arrItems);
               setTutorialImage(arrItems);
               //setBannerList(arrItems);
            }else{
               console.log('소비자 메인 배너 실패!', resultItem);
               
            }
        });
        
    }

    const pageTextApi = () => {
        Api.send('text_tworoomImage', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('페이지 문구 보기: ', arrItems);
               setAppText(arrItems);
            }else{
               console.log('페이지 문구 출력 실패!', resultItem);
               //setAppInfoVideoKey("");
            }
        });
    }


    const navigationMove = () => {
        navigation.navigate("TwoRoomImageChoise", {
            "houseSize":params.houseSize,
            "houseSizem2":params.houseSizem2,
            "houseStructure":params.houseStructure,
            "houseType":params.houseType,
            "bigSelectBox":params.bigSelectBox,
            "moveCategory":params.moveCategory,
            "pakageType":params.pakageType,
            "personStatus":params.personStatus,
            "keepStatus":params.keepStatus, 
            'moveDateKeep':params.moveDateKeep, 
            'moveInKeep':params.moveInKeep,
            'startAddress':params.startAddress,
            "startMoveTool":params.startMoveTool, 
            "startFloor":params.startFloor,
            "startAddrLat": params.startAddrLat,
            "startAddrLon": params.startAddrLon,
            "destinationAddress":params.destinationAddress,
            "destinationMoveTool":params.destinationMoveTool,
            "destinationFloor":params.destinationFloor,
            "destinationAddrLat": params.destinationAddrLat, 
            "destinationAddrLon": params.destinationAddrLon,
            "moveDate":params.moveDate,
            "moveDatetime":params.moveDatetime
        })
    }

    useEffect(()=> {
        tutorialBannerApi();
        pageTextApi();
    }, [])

    const videoCallbacks = {
        timeupdate: (data) => console.log('timeupdate: ', data),
        play: (data) => console.log('play: ', data),
        pause: (data) => console.log('pause: ', data),
        fullscreenchange: (data) => console.log('fullscreenchange: ', data),
        ended: (data) => console.log('ended: ', data),
        controlschange: (data) => console.log('controlschange: ', data),
      };
      
    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="가정집이사 견적요청" navigation={navigation} />
            <ScrollView>
                {/* {
                    tutoriaImage != "" ?
                    <Box>
                        <Image source={{uri:tutoriaImage}} alt='소형이사 배너' style={[{width:width, height:width}]} />
                    </Box>
                    :
                    <Box>
                        <Image source={require('../images/smallBanner.png')} alt='소형이사 배너' style={[{width:width, height:width}]} />
                    </Box>
                }    */}
                {
                    appText != "" &&
                    appText.tworoomTutorialCate == "이미지" ?
                    <Box>
                        <WebRender html={appText.tworoomTutorial} />
                    </Box>
                    :
                    // <YoutubePlayer
                    //     width={width}
                    //     height={height}
                    //     play={videoPlay}
                    //     videoId={appText.tworoomTutorialVideo}
                    //     onChangeState={onStateChange}
                    // />
                    <Vimeo
                        videoId={appText.tworoomTutorialVideo}
                        params={'api=1&autoplay=0'}
                        handlers={videoCallbacks}
                    />
                }
            </ScrollView>
            <Box pt='25px' pb='25px' backgroundColor='#fff' borderTopLeftRadius={30} borderTopRightRadius={30} shadow={6}>
                <Box px='25px'>
                    {
                        appText != "" && 
                        <VStack>
                            <WebRender html={appText.tworoomImage} />
                        </VStack>
                    }
                    <DefButton text='사진촬영 시작하기' btnStyle={[colorSelect.sky, {marginTop:30}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={navigationMove} />
                </Box>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    infoTitle: {
        ...fweight.b,
        ...fsize.fs18
    },
    infoText: {
        ...fsize.fs14,
        color:'#aaa',
    },
    infoAddText: {
        ...fsize.fs14,
        ...fweight.b,
        color:'#FF5050',
        marginTop:30
    },
    modalText: {
        ...fweight.b,
        textAlign:'center'
    },
    modalButton: {
        width: (width - 90) * 0.48,
        height: 50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10
    }
})

export default TwoRoomImage;