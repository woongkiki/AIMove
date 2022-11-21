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


const TwoRoomEnd = (props) => {

    const {navigation, route, userInfo} = props;
    const { params } = route;

    const [imageNumber, setImageNumber] = useState("0");
    const [imageLoading, setImageLoading] = useState(false);
    const [structure, setStructure] = useState(params.houseStructure)
    const [cameraModal, setCameraModal] = useState(false);
    const [aiImage, setAiImage] = useState([]);
    const [selectImageNumber, setSelectImageNumber] = useState("");

    console.log("params", params);

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
            //console.log('이미지 선택....',image);
            let imageDump = [...structure];
            
            image.map((item, index) => {
                return imageDump[selectImageNumber].images.push(item);
            })

            setStructure(imageDump);
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

            let imageDump = [...structure];

            console.log(imageDump[selectImageNumber].images);
            
            imageDump[selectImageNumber].images.push(image);
            // image.map((item, index) => {
            //     return imageDump[selectImageNumber].images.push(item);
            // })

            setStructure(imageDump);
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


    const imageAdd = (index, idx) => {
        //console.log("index, idx:::",index);
        setSelectImageNumber(index);
        setCameraModal(true);

    }


    const imageSelectDel = (index, img) => {
        const structureCopy = [...structure];

        console.log("전체",structureCopy[index].images);

        if(!structureCopy[index].images.includes(img)){

            ToastMessage("삭제할 이미지가 없습니다.");

        }else{

        
            const imageSelected = structureCopy[index].images.filter(item => img !== item);
            //console.log('imageSelected::::',imageSelected);
            structureCopy[index].images = imageSelected;

            setStructure(structureCopy);
        }

    }

    const tworoomEnd = async () => {
        console.log("이미지 전송 및 완료");


        //await setImageLoading(true);

        //await tworoomRequestApi();
        navigation.navigate("TwoRoomConfirmDe", {
            "houseSize":params.houseSize,
            "houseSizem2":params.houseSizem2,
            "houseStructure":structure,
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

    console.log("structure", structure);

    const tworoomRequestApi = async () => {
        
        const formData = new FormData();
        formData.append('method', 'tworoom_photo');


        let arr = JSON.stringify(params.bigSelectBox);

        formData.append("bigBox", arr);

        structure.map((item, index) => {

            item.images.map((img, idx) => {

                let tmpName = img.path;
                let fileLength = tmpName.length;
                let fileDot = tmpName.lastIndexOf('.');
                let fileExt = tmpName.substring(fileDot, fileLength).toLowerCase();
                let strtotime = new Date().valueOf();
                let fullName = strtotime + index + fileExt;

                return formData.append('files[]', {'uri' : img.path, 'name': fullName, 'size': img.size, 'type': img.mime});
              
            })
           
            
            // return formData.append('files[]', {'uri' : item.path, 'name': fullName, 'size': item.size, 'type': item.mime});
        })

        let arr2 = JSON.stringify(structure);
        formData.append("filedata", arr2);

        formData.append("mid", userInfo.id);
        formData.append("mname", userInfo.name);
        formData.append("mphone", userInfo.phoneNumber);
        formData.append("houseType", params.houseType);
        formData.append("houseSize", params.houseSize);
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
        formData.append("destinationAddress", params.destinationAddress);
        formData.append("destinationMoveTool", params.destinationMoveTool);
        formData.append("destinationFloor", params.destinationFloor);

        const upload = await Api.multipartRequest(formData);

        console.log("사진으로 가정집견적 요청", upload);
        if(upload.result){
            await setImageLoading(false);
            await navigationReservaton();
            ToastMessage(upload.msg);
        }
    }


    const navigationReservaton = () => {
        // navigation.reset({
        //     routes: [{ name: 'TabNav', screen: 'Reservation' }],
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

    //console.log("params", params.houseStructure[0].images);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='가정집이사 견적요청' />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text={"촬영한 이미지를 최종적으로 확인해 주세요."} style={[styles.infoText]} />
                    {
                        structure.map((item, index) => {
                            return(
                                <Box key={index} mt={index !=0 ? '25px' : 0}>
                                    <DefText text={item.title} style={[fsize.fs16,fweight.m]} />
                                    {
                                        item.images.length > 0 ?
                                        <HStack flexWrap={'wrap'}>
                                            {
                                                item.images.map((img, idx) => {
                                                    return(
                                                        <Box mt='15px' mr={ (idx + 1) % 2 == 0 ? 0 : (width - 50) * 0.038} key={idx}>
                                                            <TouchableOpacity style={[styles.imgButton]}>
                                                                <Image source={{uri:img.path}} style={[styles.imgSize]} />
                                                                
                                                            </TouchableOpacity>
                                                            <Box width='28px' height='28px' shadow={8} backgroundColor='#fff' borderRadius={28} position='absolute' top='-14px' right='0'>
                                                                <TouchableOpacity onPress={()=>imageSelectDel(index, img)} activeOpacity={0.9}>
                                                                    <Image source={require('../images/imgRemove.png')} alt='삭제' style={{width:28, height:28, resizeMode:'contain'}} />
                                                                </TouchableOpacity>
                                                            </Box>
                                                        </Box>
                                                    )
                                                })
                                            }
                                            <Box mt='15px'>
                                                <TouchableOpacity onPress={()=>imageAdd(index)} style={[styles.imgButtonEmpty]}>
                                                    <Box width='28px' height='28px' shadow={3} borderRadius={28}>
                                                        <Image source={require('../images/bluePlus.png')} style={{width:28, height:28, resizeMode:'contain'}} />
                                                    </Box>
                                                </TouchableOpacity>
                                            </Box>
                                        </HStack>
                                        :
                                        <HStack flexWrap={'wrap'} mt='20px' >
                                            <Box>
                                                <TouchableOpacity onPress={()=>setCameraModal(true)} style={[styles.imgButtonEmpty]}>
                                                    <Box width='28px' height='28px' shadow={3} borderRadius={28}>
                                                        <Image source={require('../images/bluePlus.png')} style={{width:28, height:28, resizeMode:'contain'}} />
                                                    </Box>
                                                </TouchableOpacity>
                                            </Box>
                                        </HStack>
                                    }
                                    
                                </Box>
                            )
                        })
                    }
                    {/* <DefButton text='전문가 찾기' btnStyle={[colorSelect.sky, {marginTop:30}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={tworoomEnd} /> */}

                    
                </Box>
            </ScrollView>
            <BottomButton 
                leftText='이전' 
                rightText='다음' 
                leftonPress={()=>navigation.goBack()} 
                rightonPress={tworoomEnd}
            />
            {
                imageLoading &&
                <Box flex={1} backgroundColor='rgba(0,0,0,0.8)' height={height} width={width} position='absolute' top='0' right='0' justifyContent={'center'} alignItems='center'>
                    <DefText text='전문가 찾기 준비 중입니다.' style={[styles.lodingText, {marginBottom:50}]} />
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
                                    <DefText text='갤러리 (앨범)' style={[fweight.m, fsize.fs14, {color:'#fff', marginLeft:7, lineHeight:19}]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={cameraSelected} style={[styles.modalButton, colorSelect.sky]}>
                                <HStack alignItems={'center'}>
                                    <Image source={require('../images/aiCameraIcon.png')} alt='갤러리' style={{width:22, height:19, resizeMode:'contain'}} />
                                    <DefText text='카메라' style={[fweight.m, fsize.fs14, {color:'#fff', marginLeft:10, lineHeight:19}]} />
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
        lineHeight:23,
        marginBottom:30
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
)(TwoRoomEnd);