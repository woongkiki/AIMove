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


const CarImageConfirm = (props) => {
    const {navigation, route, userInfo} = props;
    const { params } = route;


    console.log("params", params);

   


    const [imageNumber, setImageNumber] = useState("0");
    const [imageLoading, setImageLoading] = useState(false);
    const [cameraModal, setCameraModal] = useState(false);

    const [aiImage, setAiImage] = useState([]);

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

            let aiAdd = [...aiImage];

            image.map((item, index) => {
                return aiAdd.push(item);
            })

            //console.log('aiAdd:::::',aiAdd);
            setAiImage(aiAdd);
            setCameraModal(false);

            //setAiImage({...aiImage, image});
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
            setAiImage([...aiImage, image]);
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
        
        if(imageLoading){

            let count = 0;
            let countInterval = setInterval(()=> {
                setImageNumber((count++) % 5)
                console.log('count', count);

                if(count == 20){
                    clearInterval(countInterval);
                    navigation.navigate("MoveConfirm");
                    //navigation.goBack();
                }

            }, 1500)
        
            
            return() => {
                clearInterval(countInterval);
            }

        }
    }, [imageLoading]);


    const imageSelectDel = (items) => {
        

        if(!aiImage.includes(items)){

            ToastMessage("삭제할 이미지가 없습니다.");

        }else{

            const imageSelected = aiImage.filter(item => items !== item);
            setAiImage(imageSelected);
        }

    }
 

    const imageLoadingGo = async () => {
        //setImageLoading(true);

        if(aiImage.length == 0){
            ToastMessage("AI 견적을 위하여 이미지는 최소 1장이상 업로드해주세요.");
            return false
        }


        await  setImageLoading(true);

        const formData = new FormData();
        formData.append('method', 'car_request');
        //console.log('imageArr',params.aiImage);

        aiImage.map((item, index) => {
            let tmpName = item.path;
            let fileLength = tmpName.length;
            let fileDot = tmpName.lastIndexOf('.');
            let fileExt = tmpName.substring(fileDot, fileLength).toLowerCase();
            let strtotime = new Date().valueOf();
            let fullName = strtotime + index + fileExt;
            
            return formData.append('files[]', {'uri' : item.path, 'name': fullName, 'size': item.size, 'type': item.mime});
        })
        formData.append('mid', userInfo.id);
        formData.append("mname", userInfo.name);
        formData.append("mphone", userInfo.phoneNumber);
        formData.append("startAddress", params.startAddress);
        formData.append("startLat", params.startLat);
        formData.append("startLon", params.startLon);
        formData.append("destinationAddress", params.destinationAddress);
        formData.append("destinationLat", params.destinationLat);
        formData.append("destinationLon", params.destinationLon);
        formData.append("moveDate", params.moveDate);
        formData.append("moveDatetime", params.moveDatetime);
       

        const upload = await Api.multipartRequest(formData);
        
        console.log("upload", upload);
       
        if(upload.result){
            await setImageLoading(false);
            await navigateMoveConfirm(upload.data);
            await ToastMessage(upload.msg);
        }

        // if(upload.result){
        //     setImageLoading(false);
        // }else{
        //     setImageLoading(true)
        // }

         console.log("ai_upload::::", upload);
        
        //navigation.navigate("MoveConfirm");
    }


    const navigateMoveConfirm = () => {
        //navigation.navigate("MoveConfirm", {"bidx":bidx});
        // navigation.reset({
        //     routes: [{ name: 'TabNav', screen: 'Reservation' }],
        // });
        navigation.navigate('TabNav', {
            screen: 'Reservation',
            params:{
                moveCate : "차량제공" ,
                tabCategory: "찾는중",
                twoCate:""
            }
        });

    }

    useEffect(()=> {
        if(params.carImage != ""){
            setAiImage(params.carImage);
        }
    }, [])

    useEffect(()=> {
        console.log("aiImage", aiImage);
    }, [aiImage])


    return (
        <Box flex={1} backgroundColor='#fff'>
            {/* <SubHeader navigation={navigation} headerTitle='차량만 대여' /> */}
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text={"촬영한 이미지를 최종적으로 확인해 주세요."} style={[styles.infoText]} />
                    <HStack flexWrap={'wrap'} mt='20px' >
                        {
                            aiImage != "" &&
                            aiImage.map((item, index) => {
                                return(
                                    <Box mt='25px' mr={ (index + 1) % 2 == 0 ? 0 : (width - 50) * 0.038} key={index}>
                                        <TouchableOpacity style={[styles.imgButton]}>
                                            <Image source={{uri:item.path}} style={[styles.imgSize]} />
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
            <BottomButton leftText='이전' rightText='차량대여요청' leftonPress={()=>navigation.goBack()} rightonPress={imageLoadingGo} />
            {
                imageLoading &&
                <Box flex={1} backgroundColor='rgba(0,0,0,0.8)' height={height} width={width} position='absolute' top='0' right='0' justifyContent={'center'} alignItems='center'>
                    <DefText text='차량제공 견적 요청중입니다.' style={[styles.lodingText, {marginBottom:50}]} />
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
        borderRadius:10
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
)(CarImageConfirm);