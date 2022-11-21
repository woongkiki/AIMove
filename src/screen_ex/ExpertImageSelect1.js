import React, {useState, useEffect, useCallback} from 'react';
import { TouchableOpacity, Image, StyleSheet, Platform, Dimensions, ScrollView, Button } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefInput, DefButton } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import { phoneFormat } from '../common/DataFunction';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ImagePicker from 'react-native-image-crop-picker';
import HeaderHome from '../components/HeaderHome';
import ApiExpert from '../ApiExpert';
import RenderHtml from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import YoutubePlayer from "react-native-youtube-iframe";
import Font from '../common/Font';
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

const ExpertImageSelect1 = (props) => {

    const {navigation, userInfo, member_info, member_update} = props;

    const [infoModal, setInfoModal] = useState(false);
    const [cameraModal, setCameraModal] = useState(false);

    const [appLoading, setAppLoading] = useState(true);
    const [appText, setAppText] = useState("");
    const [videoPlay, setVideoPlay] = useState("pause");

    const onStateChange = useCallback((state) => {
        if(state === "ended"){
            setVideoPlay("pause");
        }
    })

    const appTextApi = async () => {
        await setAppLoading(true);
        await ApiExpert.send('start_app', {'id':userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('앱 시작시 튜토리얼 확인하기 보기: ', arrItems);
               //setAiPrice(arrItems);
               setAppText(arrItems);
            }else{
               console.log('앱 시작시 튜토리얼 실패!', resultItem);
               
            }
        });
        await setAppLoading(false);
    }

    useEffect(()=> {
        appTextApi();
    }, [])

    const nextNavigation = () => {

        navigation.navigate("ExpertImageConfirm", {"profileImage":profileImage});
        
    }


    const [profileImage, setProfileImage] = useState([]);
    const imgSelected = () => {
        ImagePicker.openPicker({
            width: width,
            height: width,
            cropping: false,
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: width * 1.5,
            compressImageQuality: 0.7,
            multiple:true
          }).then(image => {
            console.log('이미지 선택....',image);
            setProfileImage(image);
          }).catch(e => {
            setCameraModal(false);
            ToastMessage("갤러리 선택을 취소하셨습니다.");
          });
    }

    const cameraSelected = () => {
        ImagePicker.openCamera({
            width: width,
            height: width,
            cropping: true,
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: width * 1.5,
            compressImageQuality: 0.7,
            multiple:false
          }).then(image => {
            console.log(image);
            setProfileImage(image);
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

    useEffect(()=> {
        if(profileImage != ""){
            //addImageSubmit()
            nextNavigation();
            setCameraModal(false);
            //console.log('이미지 확인,,', aiImage);
        }
    }, [profileImage])

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
            {/* <HeaderHome /> */}
            <ScrollView>
                {
                    appText != "" &&
                    appText.expertImgCate == "이미지" ?
                    <WebRender html={appText.expertImgTuto} />
                    :
                    // <YoutubePlayer
                    //     height={400}
                    //     play={videoPlay}
                    //     videoId={appText.expertImgTutoVideo}
                    //     onChangeState={onStateChange}
                    // />
                    <Vimeo
                        videoId={appText.expertImgTutoVideo}
                        params={'api=1&autoplay=0'}
                        handlers={videoCallbacks}
                    />
                }
            </ScrollView>
            <Box px='25px' py='20px' backgroundColor={'#fff'} borderTopLeftRadius={20} borderTopRightRadius={20} shadow={9}>
                {
                    (appText != "" &&
                    appText.expertImgInfo != "") &&
                    <WebRender html={appText.expertImgInfo} />
                }
                <TouchableOpacity onPress={()=>setCameraModal(true)}  style={[styles.startButton]}>
                    <DefText text="시작하기" style={[styles.startButtonText]} />
                </TouchableOpacity>
             </Box>
             <Modal isOpen={infoModal} onClose={()=>setInfoModal(false)}>
                <Modal.Content p='0' width={width-50}>
                    <Modal.Body p='0'>
                        <Box>
                            <Box p='20px' borderBottomWidth={2} borderBottomColor='#F3F4F5'>
                                <HStack alignItems={'center'} justifyContent='space-between'>
                                    <DefText text="서비스가 돋보이는 사진 촬영 방법" style={[styles.modalTitle]} />
                                    <TouchableOpacity onPress={()=>setInfoModal(false)}>
                                        <Image
                                            source={require("../images/keepModalClose.png")}
                                            alt="팝업 닫기"
                                            style={[{
                                                width:12,
                                                height: 12,
                                                resizeMode:'contain'
                                            }]}
                                        />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                            <Box p='20px'>
                                <DefText text={'사진을 효과적으로 촬영하고 정렬하면 전문가님이 가진 매력을 더욱 돋보이게 할 수 있습니다.'} style={[styles.modalText]} />
                                <Image
                                    source={require("../images/relImage.png")}
                                    alt="관련이미지"
                                    style={[{
                                        width:width - 90,
                                        height:120,
                                        resizeMode:'contain',
                                        marginTop:20,
                                        marginBottom:20
                                    }]}
                                />
                                <DefText text={'대부분의 고객은 사진을 통해 이사 서비스를 한눈에 파악하고 싶어 하므로, 이사 서비스가 완성된 사진이나 고객에게 알리고 싶은 부분을 표현하면 좋습니다.'} style={[styles.modalText]} />
                                <Box mt='40px'>
                                    <DefText text="대표사진" style={[styles.modalTitle, {marginBottom:10}]} />
                                    <DefText text="가장 마음에 드는 고화질 사진을 첫번째로 선택하세요." style={[styles.modalText]} />
                                </Box>
                                <Box mt='40px'>
                                    <DefText text="프로필 사진" style={[styles.modalTitle, {marginBottom:10}]} />
                                    <DefText text="배경이 없고, 웃고 있는 모습인 경우 고객이 호감을 느낍니다." style={[styles.modalText]} />
                                </Box>
                                <Box mt='40px'>
                                    <DefText text="다음에 표시될 사진" style={[styles.modalTitle, {marginBottom:10}]} />
                                    <DefText text="이사 서비스의 특별함을 더하는 요소를 강조하고, 전문가님의 개성도 사진에 담아 보세요." style={[styles.modalText]} />
                                </Box>
                            </Box>
                        </Box>
                    </Modal.Body>
                </Modal.Content>
             </Modal>

             <Modal isOpen={cameraModal} onClose={()=>setCameraModal(false)}>
                <Modal.Content width={width - 50}>
                    <Modal.Body py='25px' px='20px'>
                        <DefText text={"프로필 이미지 및 업체와 관련된\n이미지를 등록합니다."} style={[styles.cameraTitle]}/>
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
    titleText: {
        ...fsize.fs18,
        ...fweight.b
    },
    contentText: {
        ...fsize.fs14,
        color:'#aaa'
    },
    startButton: {
        width:width - 50,
        height:50,
        borderRadius:10,
        ...colorSelect.sky,
        alignItems:'center',
        justifyContent:'center',
        marginTop:30
    },
    startButtonText: {
        color:'#fff',
        ...fweight.m,
        
    },
    modalTitle: {
        ...fweight.b,
    },
    modalText: {
        ...fsize.fs15,
    },
    modalButton: {
        width: (width - 90) * 0.48,
        height: 50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10
    },
    cameraTitle: {
        ...fweight.b,
        textAlign:'center'
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_update: (user) => dispatch(UserAction.member_update(user)), //회원정보 변경
    })
)(ExpertImageSelect1);