import React, { useEffect, useState } from 'react';
import { ScrollView, Dimensions, Platform, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput } from '../common/BOOTSTRAP';
import { fsize, fweight, colorSelect } from '../common/StyleCommon';
import { phoneFormat } from '../common/DataFunction';
import SubHeader from '../components/SubHeader';
import Postcode from '@actbase/react-daum-postcode';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import ImagePicker from 'react-native-image-crop-picker';
import { BASE_URL } from '../Utils/APIConstant';

const {width, height} = Dimensions.get("window");

const ExpertProfileSetting = (props) => {

    const {navigation, userInfo, member_update, member_info} = props;

    const [loading, setLoading] = useState(true);
    const [expertImage, setExpertImage] = useState([]);
    const [serviceName, setServiceName] = useState("");
    const [serviceCategory, setServiceCategory] = useState([]);
    const [selectService, setSelectService] = useState([]);
    const [serviceReason, setServiceReason] = useState("");
    const [seriviceWorth, setServiceWorth] = useState("");
    const [refundList, setRefundList] = useState([]);
    const [selectRefund, setSelectRefund] = useState("");
    const [expertOneWord, setExpertOneWord] = useState("");
    const [cameraModal, setCameraModal] = useState(false);
    const [profileImageList, setProfileImageList] = useState("");
    const [backgroundImageList, setBackgroundImageList] = useState([]);
    const [selectArea, setSelectArea] = useState("");

    

    //이사 서비스 추가
    const [moveService, setMoveService] = useState("");

    //서비스 이름
    const servieNameChange = (text) => {
        setServiceName(text);
    }

    const serviceReasonChange = (text) => {
        setServiceReason(text);
    }

    const serviceWorthChange = (text) => {
        setServiceWorth(text);
    }

    const expertOneWordChange = (text) => {
        setExpertOneWord(text);
    }

    //이사 서비스 선택
    const serviceSelect = (service) => {

        if(!moveService.includes(service)){

            setMoveService([...moveService, service]);

        }else{

            const serviceSelectRe = moveService.filter(item => service !== item);
            setMoveService(serviceSelectRe);

        }

    }

    const categorySelect = (category) => {
       
        if(!selectService.includes(category)){

            if(selectService.length == 2){
                ToastMessage("2개까지 선택할 수 있습니다.");
                return false;
            }

            setSelectService([...selectService, category]);

        }else{
            const categorySelectRe = selectService.filter(item => category !== item);
            setSelectService(categorySelectRe);
        }
        
    }


    const [cameraNewModal, setCameraNewModal] = useState(false);
    const [profileImageMy, setProfileImageMy] = useState("");
    const [profileImageMyAll, setProfileMyAll] = useState("");

    const imgProfileSelect = () => {
        ImagePicker.openPicker({
            width: width,
            height: width,
            cropping: true,
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: width * 1.5,
            compressImageQuality: 0.7,
          }).then(image => {
            console.log('이미지 선택....',image);

            const my_photo = {
                uri: image.path,
                type: image.mime,
                data: image.data,
                name: 'profile_img.jpg'
            }

            setProfileImageMy(my_photo.uri);
            setProfileMyAll(my_photo);

            setCameraNewModal(false);
            
          }).catch(e => {
            console.log('error', e);
            setCameraNewModal(false);
            ToastMessage("갤러리 선택을 취소하셨습니다.");
          });
    }

    const imgProfileCameraSelect = () => {
        ImagePicker.openCamera({
            width: width,
            height: width,
            cropping: true,
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: width * 1.5,
            compressImageQuality: 0.7,
          }).then(image => {
            console.log(image);

            const my_photo = {
                uri: image.path,
                type: image.mime,
                data: image.data,
                name: 'profile_img.jpg'
            }

            setProfileImageMy(my_photo.uri);
            setProfileMyAll(my_photo);

            setCameraNewModal(false);
            
          }).catch(e => {
            
            setCameraNewModal(false);
            if(e.message == "Cannot run camera on simulator"){
                ToastMessage("시뮬레이터에서는 카메라를 실행할 수 없습니다.");
            }else{
                ToastMessage("카메라 촬영을 취소하셨습니다.");
            }
            
          });
    }
   

    const [bgImgIdx, setBgImgIdx] = useState("");
    const backgroundImageSelect = async (idx) => {
        console.log(idx);
        await setBgImgIdx(idx);
        await setCameraModal(true);
    }

    const backgroundAddSelect = async () => {
        await setBgImgIdx("");
        await setCameraModal(true);
    }

    useEffect(()=> {
        console.log('bgImgIdx:::',bgImgIdx)
    }, [bgImgIdx])

    const imgSelected = () => {
        ImagePicker.openPicker({
            width: width,
            height: width,
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: width * 1.5,
            compressImageQuality: 0.7,
            multiple: bgImgIdx != "" ? false : true,
          }).then(image => {
            console.log('이미지 선택....',image);

            const my_photo = {
                uri: image.path,
                type: image.mime,
                data: image.data,
                name: 'profile_img_one.jpg'
            }

            let aiAdd = [...profileImageList];

            console.log("이미지 bgImgIdx",bgImgIdx);

            if(bgImgIdx != ""){
                console.log('aiAdd:::',aiAdd[bgImgIdx]);
                aiAdd[bgImgIdx] = image;

                setProfileImageList(aiAdd);
            }else{
                

                image.map((item, index) => {
                    return aiAdd.push(item);
                })
    
                setProfileImageList(aiAdd);
            }
           
            setCameraModal(false);

            
          }).catch(e => {
            console.log('error', e);
            setCameraModal(false);
            ToastMessage("갤러리 선택을 취소하셨습니다.");
          });
    }

    const cameraSelected = () => {
        ImagePicker.openCamera({
            width: width,
            height: width,
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: width * 1.5,
            compressImageQuality: 0.7,
            cropping: true,
          }).then(image => {
            console.log(image);

            let aiAdd = [...profileImageList];

            console.log("이미지 bgImgIdx",bgImgIdx);

            if(bgImgIdx != ""){
                console.log('aiAdd:::',aiAdd[bgImgIdx]);
                aiAdd[bgImgIdx] = image;

                setProfileImageList(aiAdd);
            }else{
                

                aiAdd.push(image);
            
                setProfileImageList(aiAdd);
            }
           
            setCameraModal(false);
            
          }).catch(e => {
            
            setCameraModal(false);
            if(e.message == "Cannot run camera on simulator"){
                ToastMessage("시뮬레이터에서는 카메라를 실행할 수 없습니다.");
            }else{
                ToastMessage("카메라 촬영을 취소하셨습니다.");
            }
            
          });
          
    }

    const servieCategoryApi = async () => {
        await setLoading(true);
        await Api.send('service_category', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('장점 리스트: ', resultItem, arrItems);
               setServiceCategory(arrItems);
            }else{
               console.log('장점 리스트 출력 실패!', resultItem);

            }
        });
        await Api.send('refund_list', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
              // console.log('환불정책 리스트: ', resultItem, arrItems);
               setRefundList(arrItems);
            }else{
               console.log('환불정책 리스트 출력 실패!', resultItem);

            }
        });
        await setLoading(false);
    }


    const expertUpdate = async () => {

        console.log(selectService)

        console.log(moveService.join(",")); 

        let advantage = selectService.join("^");
        let moveServiceVal = moveService.join(",");

        const formData = new FormData();
        formData.append("method", 'expert_expertUpdate');
        formData.append("ex_service_name", serviceName);
        formData.append("ex_advantages", advantage);
        formData.append("id", userInfo.ex_id);
        formData.append("midx", userInfo.idx);
        formData.append("ex_select_reason", serviceReason);
        formData.append("ex_worth", seriviceWorth);
        formData.append("ex_refund", selectRefund);
        formData.append("expertOneWord", expertOneWord);
        formData.append("ex_move_status", moveServiceVal);

        formData.append('profile[]', profileImageMyAll);


        console.log('profileImageList::::',profileImageList.length);
        if(profileImageList.length > 0){
            profileImageList.map((item, index) => {
                let tmpName = item.path;
                let fileLength = tmpName.length;
                let fileDot = tmpName.lastIndexOf('.');
                let fileExt = tmpName.substring(fileDot, fileLength).toLowerCase();
                let strtotime = new Date().valueOf();
                let fullName = strtotime + index + fileExt;
    
                return formData.append('files[]', {'uri' : item.path, 'name': fullName, 'size': item.size, 'type': item.mime});
            })
        }
        
        //변경없음
        //formData.append("phone", userInfo.ex_phone);
        //formData.append("ex_move_status", userInfo.ex_move_status);
        // formData.append("ex_service_status", userInfo.ex_service_status);
        // formData.append("ex_start_date", userInfo.ex_start_date);
        // formData.append("ex_addr", userInfo.ex_addr);
        // formData.append("ex_date", userInfo.ex_date);
        //formData.append("register_status", userInfo.register_status);

      
        setLoading(true);
        //const update = await Api.multipartRequest(formData);

        const update = await member_update(formData);

        console.log("update.result", update);

        if(update.result){
            //console.log(update.result);
          expertInfo();
          
          ToastMessage(update.msg);
            navigation.goBack();
           console.log("업데이트:::",update);


        }else{
            ToastMessage(update.msg);
        }
    }

    const expertInfo = async () => {
        const formData = new FormData();
        formData.append('method', 'expert_info');
        formData.append('id', userInfo.ex_id);
        const member_info_list = await member_info(formData);

        console.log('member_info_list:::::',member_info_list);
    }


    useEffect(()=> {
        servieCategoryApi();

        //console.log("userInfo1", userInfo);

        if(userInfo != null || userInfo != ""){
            setServiceName(userInfo?.ex_service_name);
            setServiceReason(userInfo?.ex_select_reason);
            setServiceWorth(userInfo?.ex_worth);
            setExpertOneWord(userInfo?.expertOneWord);
            setSelectRefund(userInfo?.ex_refund);

            setMoveService(userInfo?.ex_move_status.split(","));

            if(userInfo.ex_advantages != ""){
                setSelectService(userInfo?.ex_advantages.split("^"));
            }

            if(userInfo?.profileUrlBg != ""){
                setProfileImageList(userInfo?.profileUrlBg);
            }
            if(userInfo?.profileUrl != ""){
                setProfileImageMy(userInfo.profileUrl);
            }

            if(userInfo?.ex_area != ""){
                setSelectArea(userInfo.ex_area);
            }
        }
    }, [])

    useEffect(() => {
        //console.log("moverService", moveService);
    }, [moveService])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle="업체 정보 수정" />
            {
                loading ? 
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size="large" color="#333" />
                </Box>
                :
                <ScrollView>
                    <Box px='25px' py='20px'>
                        <Box alignItems={'center'}>
                            {/* <DefText text="업체 프로필 이미지" style={[styles.profileLabel]} /> */}
                            <TouchableOpacity onPress={()=>setCameraNewModal(true)} style={[styles.profilseBox]}>
                                {
                                    profileImageMy != "" ?
                                    <Box borderRadius={'100'} overflow='hidden'>
                                        <Image source={{uri:profileImageMy}} alt='프로필' style={{width:100, height:100, resizeMode:'stretch', borderRadius:50}} />
                                    </Box>
                                    :
                                    <Image source={require("../images/noProfileImg.png")} alt='프로필' style={{width:27, height:31, resizeMode:'contain'}} />
                                }
                            </TouchableOpacity>
                        </Box>
                        <Box mt='30px'>
                            <DefText text="업체 배경 이미지" style={[styles.profileLabel]} />
                            <HStack mt='15px'>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {
                                        profileImageList != "" &&
                                        profileImageList.map((item, index) => {
                                            return(
                                                <TouchableOpacity 
                                                    key={index} 
                                                    onPress={()=>backgroundImageSelect(index)}
                                                    style={[
                                                        {marginRight:15}
                                                    ]}
                                                >
                                                    <Box style={[styles.profileBox, {borderWidth:0, overflow:'hidden'}]}>
                                                        <Box>
                                                            <Image 
                                                                source={{uri:item.path}}
                                                                style={{
                                                                    width:84,
                                                                    height:84,
                                                                    resizeMode:'stretch',
                                                                    borderRadius:10,
                                                                    overflow: 'hidden'
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                    <TouchableOpacity onPress={()=>backgroundAddSelect()} style={{marginRight:15}}>
                                        <Box style={[styles.profileBox]}>
                                            <Box width='28px' height='28px' shadow={3} borderRadius={28}>
                                                <Image source={require('../images/bluePlus.png')} style={{width:28, height:28, resizeMode:'contain'}} />
                                            </Box>
                                        </Box>
                                    </TouchableOpacity>
                                </ScrollView>
                            </HStack>
                        </Box>
                        <Box mt='30px'>
                            <DefText text="이사 서비스 선택" style={[styles.profileLabel]} />
                            <HStack flexWrap={'wrap'} justifyContent='space-between'>
                                <TouchableOpacity 
                                    style={[
                                        styles.categoryBtn,
                                        moveService.includes('소형 이사') && colorSelect.sky
                                    ]}
                                    onPress={()=>serviceSelect("소형 이사")}
                                >
                                    <DefText text={"소형 이사"} 
                                        style={[
                                            fsize.fs14,
                                            moveService.includes('소형 이사') && {color:'#fff'}
                                        ]} 
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.categoryBtn,
                                        moveService.includes('가정집 이사') && colorSelect.sky
                                    ]}
                                    onPress={()=>serviceSelect("가정집 이사")}
                                >
                                    <DefText 
                                        text={"가정집 이사"}
                                        style={[
                                            fsize.fs14,
                                            moveService.includes('가정집 이사') && {color:'#fff'}
                                        ]} 
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.categoryBtn,
                                        moveService.includes('차량만 대여') && colorSelect.sky
                                    ]} 
                                    onPress={()=>serviceSelect("차량만 대여")}
                                >
                                    <DefText
                                        text={"차량만 대여"}
                                        style={[
                                            fsize.fs14,
                                            moveService.includes('차량만 대여') && {color:'#fff'}
                                        ]} 
                                    />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                        <Box mt='30px'>
                            <DefText text="서비스 이름" style={[styles.profileLabel]} />
                            <DefInput 
                                placeholder={'한눈에 알 수 있는 서비스 이름을 적어주세요.\n( ex. OOO 전문가의 깔끔한 이사 서비스 )'}
                                value={serviceName}
                                onChangeText={servieNameChange}
                                inputHeight={100}
                                inputStyle={{borderWidth:1, borderColor:'#CCCCCC', borderRadius:5, marginTop:15, paddingTop:10}}
                                textAlignVertical='top'
                                multiline={true}
                            />
                        </Box>
                        {
                            serviceCategory != "" && 
                            <Box mt='30px'>
                                <DefText text="서비스 장점 (최대 2개)" style={[styles.profileLabel]} />
                                <HStack flexWrap={'wrap'}>
                                {
                                    serviceCategory.map((item, index) => {
                                        return(
                                            <TouchableOpacity 
                                                key={index} 
                                                style={[styles.categoryBtn, (index + 1) % 3 == 0 ? {marginRight:0} : {marginRight: (width - 50) * 0.02}, selectService.includes(item.ca_name) && colorSelect.sky]}
                                                onPress={()=>categorySelect(item.ca_name)}
                                            >
                                                <DefText text={item.ca_name} style={[fsize.fs14, selectService.includes(item.ca_name) && {color:'#fff'}]} />
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                                </HStack>
                            </Box>
                        }
                        <Box mt='30px'>
                            <DefText text={"고객님이 전문가님의 서비스를 선택해야 하는 이유가\n무엇인가요?"} style={[styles.profileLabel]} />
                            <DefInput 
                                placeholder={'충실하게 작성할 수록 고객이 선택할 확률이 높습니다.'}
                                value={serviceReason}
                                onChangeText={serviceReasonChange}
                                inputHeight={100}
                                inputStyle={{borderWidth:1, borderColor:'#CCCCCC', borderRadius:5, marginTop:15, paddingTop:10}}
                                textAlignVertical='top'
                                multiline={true}
                            />
                        </Box>
                        <Box mt='30px'>
                            <DefText text={"이사하면서 가장 보람 있을 때가 언제인가요?"} style={[styles.profileLabel]} />
                            <DefInput 
                                placeholder={'내용을 입력해 주세요.'}
                                value={seriviceWorth}
                                onChangeText={serviceWorthChange}
                                inputHeight={100}
                                inputStyle={{borderWidth:1, borderColor:'#CCCCCC', borderRadius:5, marginTop:15, paddingTop:10}}
                                textAlignVertical='top'
                                multiline={true}
                            />
                        </Box>
                        {
                            refundList != "" &&
                            <Box mt="30px">
                                <DefText text={"환불정책"} style={[styles.profileLabel]} />
                                {
                                    refundList.map((item, index) => {
                                        return(
                                            <Box key={index}>
                                                <TouchableOpacity onPress={()=>setSelectRefund(item.re_title)} style={[styles.refundBtn, item.re_title == selectRefund && colorSelect.sky]}>
                                                    <DefText text={item.re_title} style={[styles.refundText, item.re_title == selectRefund && {color:'#fff'}]} />
                                                </TouchableOpacity>
                                                {
                                                    item.re_title == selectRefund &&
                                                    <DefText text={item.re_content} style={[styles.refundContent]} />
                                                }
                                            </Box>
                                        )
                                    })
                                }
                            </Box>
                        }
                        <Box mt='30px'>
                            <DefText text={"고객님 알고 계셔야 해요"} style={[styles.profileLabel]} />
                            <DefInput 
                                placeholder={'고객이 주의해야 할 사항을 입력하세요\n미리 입력해두시면 입찰 참여시 자동으로\n입력되어 나옵니다.'}
                                value={expertOneWord}
                                onChangeText={expertOneWordChange}
                                inputHeight={100}
                                inputStyle={{borderWidth:1, borderColor:'#CCCCCC', borderRadius:5, marginTop:15, paddingTop:10}}
                                textAlignVertical='top'
                                multiline={true}
                            />
                        </Box>
                    </Box>
                </ScrollView>
            }
            <DefButton 
                text="수정"
                btnStyle={[styles.profileButton]}
                textStyle={[styles.profileButtonText]}
                onPress={expertUpdate}
            />
            <Modal isOpen={cameraModal} onClose={()=>setCameraModal(false)}>
                <Modal.Content width={width - 50}>
                    <Modal.Body py='25px' px='20px'>
                        {/* <DefText text={"카메라에 이삿짐이 최대한 담긴\n사진을 올려주세요."} style={[styles.modalText]}/> */}
                        <HStack justifyContent={'space-between'}>
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

            <Modal isOpen={cameraNewModal} onClose={()=>setCameraNewModal(false)}>
                <Modal.Content width={width - 50}>
                    <Modal.Body py='25px' px='20px'>
                        {/* <DefText text={"카메라에 이삿짐이 최대한 담긴\n사진을 올려주세요."} style={[styles.modalText]}/> */}
                        <HStack justifyContent={'space-between'}>
                            <TouchableOpacity onPress={imgProfileSelect} style={[styles.modalButton, colorSelect.black]}>
                                <HStack alignItems={'center'}>
                                    <Image source={require('../images/aiGallIcon.png')} alt='갤러리' style={{width:22, height:19, resizeMode:'contain'}} />
                                    <DefText text='갤러리 (앨범)' style={[fweight.m, {color:'#fff', marginLeft:7, lineHeight:19}]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={imgProfileCameraSelect} style={[styles.modalButton, colorSelect.sky]}>
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
    profilseBox: {
        width:100,
        height:100,
        borderRadius:50,
        backgroundColor:'#EFEFEF',
        justifyContent:'center',
        alignItems:'center'
    },
    profileLabel: {
        ...fweight.b,
        ...fsize.fs16
    },
    profileBox: {
        width:84,
        height:84,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        borderStyle:'dashed',
        borderWidth:1,
        borderColor:'#CDCDCD'
    },
    categoryBtn: {
        width: (width-50) * 0.32,
        height:36,
        borderRadius:10,
        backgroundColor:'#DFDFDF',
        justifyContent:'center',
        alignItems:'center',
        marginTop:15
    },
    refundBtn: {
        width: width - 50,
        height:50,
        backgroundColor:'#DFDFDF',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop:15
    },
    refundText: {
        ...fsize.fs16,
        ...fweight.m
    },
    refundContent: {
        marginTop:15,
        ...fsize.fs14,
        color:'#949494'
    },
    profileButton: {
        width:width,
        paddingTop:0,
        paddingBottom:0,
        ...colorSelect.sky,
        height:50,
        borderRadius:0,
    },
    profileButtonText: {
        ...fweight.m,
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
    },
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_update: (user) => dispatch(UserAction.member_update(user)), //회원정보 변경
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(ExpertProfileSetting);