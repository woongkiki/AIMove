import React, {useEffect, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ImagePicker from 'react-native-image-crop-picker';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const {width, height} = Dimensions.get("window");


//임시
const animationImages = [
    'https://mymoving.cafe24.com/images/loginImg1.png',
    'https://mymoving.cafe24.com/images/loginImg2.png',
    'https://mymoving.cafe24.com/images/loginImg3.png',
    'https://mymoving.cafe24.com/images/loginImg4.png',
    'https://mymoving.cafe24.com/images/loginImg5.png',
]


const ExpertImageConfirm = (props) => {

    const {navigation, route, userInfo} = props;
    const {params} = route;

    const [cameraModal, setCameraModal] = useState(false);
    const [profileImage, setProfileImage] = useState([]);

    const navigationGo = () => {
        navigation.navigate("ExpertInfo1");
    }

    useEffect(()=> {
        if(profileImage != ""){
          console.log('profileImage:::',profileImage)
        }
    }, [profileImage]);


    const imageSelectDel = (items) => {

        if(!profileImage.includes(items)){

            ToastMessage("삭제할 이미지가 없습니다.");

        }else{

            const imageSelected = profileImage.filter(item => items !== item);
            setProfileImage(imageSelected);
        }

    }

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

            let aiAdd = [...profileImage];

            image.map((item, index) => {
                return aiAdd.push(item);
            })

            //console.log('aiAdd:::::',aiAdd);
            setProfileImage(aiAdd);
            setCameraModal(false);

            //setAiImage({...aiImage, image});
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
            setProfileImage([...profileImage, image]);
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

    const imageUpload = async () => {
        if(profileImage.length == 0){
            ToastMessage("프로필 이미지는 최소 1장 이상 업로드해주세요.");
            return false;
        }

        const formData = new FormData();
        formData.append('method', 'expert_profileUpload');
        profileImage.map((item, index) => {
            let tmpName = item.path;
            let fileLength = tmpName.length;
            let fileDot = tmpName.lastIndexOf('.');
            let fileExt = tmpName.substring(fileDot, fileLength).toLowerCase();
            let strtotime = new Date().valueOf();
            let fullName = strtotime + index + fileExt;
            
            return formData.append('files[]', {'uri' : item.path, 'name': fullName, 'size': item.size, 'type': item.mime});
        })
        formData.append('ex_id', userInfo.ex_id);

        const upload = await Api.multipartRequest(formData);
        
        console.log("upload", upload);
       
        if(upload.result){
            await navigationGo(upload.data);
        }
    }

    useEffect(() => {
        if(params != ""){
            setProfileImage(params.profileImage);
        }
    }, [])

    return (
        <Box flex={1} backgroundColor="#fff">
            <SubHeader navigation={navigation} headerTitle='전문가 이미지 등록' />
            <ScrollView>
                <Box px='25px' pb='20px'>
                    <HStack flexWrap={'wrap'}>
                        {
                            profileImage != "" &&
                            profileImage.map((item, index) => {
                                return(
                                    <Box mt='25px' mr={ (index + 1) % 2 == 0 ? 0 : (width - 50) * 0.038}>
                                        <TouchableOpacity style={[styles.imgButton]}>
                                            <Image 
                                                source={{uri:item.path}} 
                                                style={[styles.imgSize]} 
                                            />
                                        </TouchableOpacity>
                                        <Box width='28px' height='28px' shadow={8} backgroundColor='#fff' borderRadius={28} position='absolute' top='-14px' right='0'>
                                            <TouchableOpacity onPress={()=>imageSelectDel(item)} activeOpacity={0.9}>
                                                <Image source={require('../images/imgRemove.png')} alt='삭제' style={{width:28, height:28, resizeMode:'contain'}} />
                                            </TouchableOpacity>
                                        </Box>
                                    </Box>
                                )
                            })
                        }
                        <Box mt='25px'>
                            <TouchableOpacity onPress={()=>setCameraModal(true)} style={[styles.imgButtonEmpty]}>
                                <Box width='28px' height='28px' shadow={3} borderRadius={28}>
                                    <Image source={require('../images/bluePlus.png')} style={{width:28, height:28, resizeMode:'contain'}} />
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </HStack>
                </Box>
            </ScrollView>
            <BottomButton 
                leftText='이전' 
                rightText='다음' 
                leftonPress={()=>navigation.goBack()} 
                rightDisable={ false } 
                rightBtnStyle={ colorSelect.sky }  
                //rightonPress={expertUpdate}
                rightonPress={imageUpload}
            />
            <Modal isOpen={cameraModal} onClose={()=>setCameraModal(false)}>
                <Modal.Content width={width - 50}>
                    <Modal.Body py='25px' px='20px'>
                        <DefText text={"프로필 이미지 및 업체와 관련된\n이미지를 등록합니다."} style={[styles.modalText]}/>
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
    infoText: {
        ...fsize.fs18,
        ...fweight.b,
        lineHeight:23
    },
    imgButton: {
        width: (width - 50) * 0.48,
        height:120,
        borderRadius:10
    },
    imgSize: {
        width:'100%',
        height: '100%',
        resizeMode:'stretch',
        borderRadius:10,
    },
    imgButtonEmpty: {
        width: (width - 50) * 0.48,
        height:120,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        borderStyle:'dashed',
        borderWidth:1,
        borderColor:'#CDCDCD'
    },
    lodingText: {
        ...fsize.fs24,
        ...fweight.b,
        color:'#fff'
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
)(ExpertImageConfirm);