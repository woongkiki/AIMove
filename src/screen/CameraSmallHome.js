import React, {useCallback, useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import Api from '../Api';
import ImagePicker from 'react-native-image-crop-picker';
import ToastMessage from '../components/ToastMessage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import RenderHtml from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import YoutubePlayer from "react-native-youtube-iframe";
import HeaderHome from '../components/HeaderHome';
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

const CameraSmallHome = (props) => {

    const {navigation, userInfo} = props;

    const [loading, setLoading] = useState(true);
    const [cameraModal, setCameraModal] = useState(false);
    const [tutoriaImage, setTutorialImage] = useState("");

    const [tutorialCate, setTutorialCate] = useState("");
    const [tutorialImages, setTutorialImages] = useState("");
    const [tutorialVideo, setTutorialVideo] = useState("");
    const [tutorialText, setTutorialText] = useState("");

    const [videoPlay, setVideoPlay] = useState("pause");

    const onStateChange = useCallback((state) => {
        if(state === "ended"){
            setVideoPlay("pause");
        }
    })

    const tutorialBannerApi = async () => {
        await setLoading(true);
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

        await Api.send('text_app', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('소형이사 사진 방법: ', resultItem, arrItems);
               setTutorialCate(arrItems.aiTutorialCate);
               setTutorialImages(arrItems.aiCameraInfoTutorial);
               setTutorialVideo(arrItems.aiCameraInfoTutorialVideo);
               setTutorialText(arrItems.aicameraInfoText);
               //setTutorialImage(arrItems);
               //setBannerList(arrItems);
            }else{
               console.log('소형이사 사진 방법', resultItem);
               
            }
        });

        await setLoading(false);
    }

    const [aiImage, setAiImage] = useState([]);
    const imgSelected = () => {
        ImagePicker.openPicker({
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: 450,
            compressImageQuality: 0.7,
            cropping: true,
            multiple:true
          }).then(image => {
            console.log('이미지 선택....',image);
            setAiImage(image);
          }).catch(e => {
            setCameraModal(false);
            ToastMessage("갤러리 선택을 취소하셨습니다.");
          });
    }

    const cameraSelected = () => {
        ImagePicker.openCamera({
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: 450,
            compressImageQuality: 0.7,
            cropping: false,
          }).then(image => {
            console.log(image);
            
            let imageArr = [];

            imageArr.push(image);

            setAiImage(imageArr);
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



    const addImageSubmit = async() => {
       
        const formData = new FormData();
        formData.append('method', 'ai_upload');
        console.log('imageArr',aiImage);

        aiImage.map((item, index) => {
            let tmpName = item.path;
            let fileLength = tmpName.length;
            let fileDot = tmpName.lastIndexOf('.');
            let fileExt = tmpName.substring(fileDot, fileLength).toLowerCase();
            let strtotime = new Date().valueOf();
            let fullName = strtotime + index + fileExt;
            
            return formData.append('files[]', {'uri' : item.path, 'name': fullName, 'size': item.size, 'type': item.mime});
        })
        formData.append('id', userInfo.id);

        const upload = await Api.multipartRequest(formData);
        
        console.log("ai_upload::::", upload);
       
    }

    const ImageConfirmMove = () => {
        

        navigation.navigate("ImageConfirm", {"aiImage":aiImage});

    }


    useEffect(()=> {
        if(aiImage != ""){
            //addImageSubmit()
            ImageConfirmMove();
            setCameraModal(false);
            //console.log('이미지 확인,,', aiImage);
        }
    }, [aiImage])

    const nextNavigation = () => {
        navigation.navigate("ImageConfirm");
        setCameraModal(false);
    }

    useEffect(()=> {
        tutorialBannerApi();
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
          
            {
                loading ?
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <ActivityIndicator size='large' color="#333" />
                </Box>
                :
                <Box flex={1}>
                    <ScrollView>
                        {
                            tutorialCate != "" && 
                            tutorialCate == "이미지" ?
                            <WebRender html={tutorialImages} />
                            :
                            // <YoutubePlayer
                            //     height={400}
                            //     play={videoPlay}
                            //     videoId={tutorialVideo}
                            //     onChangeState={onStateChange}
                            // />
                            <Vimeo
                                videoId={tutorialVideo}
                                params={'api=1&autoplay=0'}
                                handlers={videoCallbacks}
                            />
                        }
                    </ScrollView>
                    <Box pt='30px' pb='20px' backgroundColor='#fff' borderTopLeftRadius={30} borderTopRightRadius={30} shadow={6}>
                        <Box px='25px'>
                            {
                                tutorialText != "" &&
                                <WebRender html={tutorialText} />
                            }
                            <DefButton text='AI 견적 시작하기' btnStyle={[colorSelect.sky, {marginTop:30}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)} />
                        </Box>
                    </Box>
                </Box>
            }
            
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

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    })
)(CameraSmallHome);