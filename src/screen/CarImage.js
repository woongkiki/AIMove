import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';
import ImagePicker from 'react-native-image-crop-picker';
import RenderHtml from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import { Vimeo } from 'react-native-vimeo-iframe';

const {width} = Dimensions.get("window");

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

const CarImage = (props) => {
    const {navigation, route} = props;
    const {params} = route;

    console.log(params);

    const [cameraModal, setCameraModal] = useState(false);
    const [tutoriaImage, setTutorialImage] = useState("");

    const [imageData, setImageData] = useState([]);

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

    const imgSelected = () => {
        ImagePicker.openPicker({
            //width: 400,
            //height: 400,
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: 450,
            compressImageQuality: 0.7,
            //cropping: true,
            multiple:true
          }).then(image => {
            console.log('이미지 선택....',image);

            setImageData(image);
            navigation.navigate("CarImageConfirm", {
                "startAddress":params.startAddress,
                "startLat":params.startLat, 
                "startLon":params.startLon,
                "destinationAddress":params.destinationAddress,
                "destinationLat":params.destinationLat, 
                "destinationLon":params.destinationLon,
                "moveDate":params.moveDate,
                "moveDatetime":params.moveDatetime,
                "carImage":image
            })
            setCameraModal(false);

          }).catch(e => {
            setCameraModal(false);
            ToastMessage("갤러리 선택을 취소하셨습니다.");
          });
    }

    const cameraSelected = () => {
        ImagePicker.openCamera({
            //width: 400,
            //height: 400,
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: 450,
            compressImageQuality: 0.7,
            cropping: false,
          }).then(image => {
            console.log(image);
           
            let imageArr = [];

            imageArr.push(image);

            setImageData(imageArr);
            navigation.navigate("CarImageConfirm", {
                "startAddress":params.startAddress,
                "startLat":params.startLat, 
                "startLon":params.startLon,
                "destinationAddress":params.destinationAddress,
                "destinationLat":params.destinationLat, 
                "destinationLon":params.destinationLon,
                "moveDate":params.moveDate,
                "moveDatetime":params.moveDatetime,
                "carImage":imageArr
            })
            setCameraModal(false);

          }).catch(e => {
            console.log(Platform.OS, e.message);
            setCameraModal(false);
            if(e.message == "Cannot run camera on simulator"){
                ToastMessage("카메라를 실행할 수 없습니다.");
            }else{
                ToastMessage("카메라 촬영을 취소하셨습니다.");
            }
            
          });
          
    }

    const [appText, setAppText] = useState("");
    const pageTextApi = () => {
        Api.send('car_appText', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('페이지 문구 보기: ', arrItems);
               setAppText(arrItems);
            }else{
               console.log('페이지 문구 출력 실패!', resultItem);
               //setAppInfoVideoKey("");
            }
        });
    }
    
    useEffect(()=> {
        tutorialBannerApi();
        pageTextApi();
    }, []);

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
            <SubHeader headerTitle="차량만 대여" navigation={navigation} />
            <ScrollView>
                {
                    appText != "" &&
                    appText.carTutorialCate == "이미지" ?
                    <Box>
                        <WebRender html={appText.carTutorial} />
                    </Box>
                    :
                    <Vimeo
                        videoId={appText.carTutorialVideo}
                        params={'api=1&autoplay=0'}
                        handlers={videoCallbacks}
                    />
                }
            </ScrollView>
            <Box pt='30px' pb='20px' backgroundColor='#fff' borderTopLeftRadius={30} borderTopRightRadius={30} shadow={6}>
                <Box px='25px'>
                    {
                        appText != "" && 
                        <VStack>
                            <WebRender html={appText.carTutorialText} />
                        </VStack>
                    }
                    <DefButton text='사진촬영 시작하기' btnStyle={[colorSelect.sky, {marginTop:30}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)} />
                </Box>
            </Box>
            <Modal isOpen={cameraModal} onClose={()=>setCameraModal(false)}>
                <Modal.Content width={width - 50}>
                    <Modal.Body py='25px' px='20px'>
                        <DefText text={"카메라에 이삿짐이 최대한 담긴\n사진을 올려주세요."} style={[styles.modalText]}/>
                        <HStack justifyContent={'space-between'} mt='25px'>
                            <TouchableOpacity onPress={imgSelected} style={[styles.modalButton, colorSelect.black]}>
                                <HStack alignItems={'center'}>
                                    <Image source={require('../images/aiGallIcon.png')} alt='갤러리' style={{width:22, height:19, resizeMode:'contain'}} />
                                    <DefText text='갤러리 (앨범)' style={[fweight.m, {color:'#fff', marginLeft:7, lineHeight:19}]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={cameraSelected} style={[styles.modalButton, colorSelect.sky]}>
                                <HStack alignItems={'center'}>
                                    <Image source={require('../images/aiCameraIcon.png')} alt='갤러리' style={{width:22, height:19, resizeMode:'contain'}} />
                                    <DefText text='카메라' style={[fweight.m, {color:'#fff', marginLeft:10, lineHeight:19}]} />
                                </HStack>
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
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

export default CarImage;