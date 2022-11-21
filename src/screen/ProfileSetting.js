import React, { useEffect, useState } from 'react';
import { ScrollView, Dimensions, Platform, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput } from '../common/BOOTSTRAP';
import { fsize, fweight, colorSelect } from '../common/StyleCommon';
import { phoneFormat } from '../common/DataFunction';
import SubHeader from '../components/SubHeader';
import Postcode from '@actbase/react-daum-postcode';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import ToastMessage from '../components/ToastMessage';
import { BASE_URL } from '../Utils/APIConstant';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const {width, height} = Dimensions.get("window");

let t1;
let tcounter;
let temp;

const ProfileSetting = (props) => {

    const {navigation, userInfo, member_update, member_info} = props;

    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [addrModal, setAddrModal] = useState(false);
    const [addrZip, setAddrZip] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [profileImageAll, setProfileImageAll] = useState("");
    const [cameraModal, setCameraModal] = useState(false);
    const [certiNumber, setCertiNumber] = useState("");
    const [timeStamp, setTimeStamp] = useState("");
    const [phoneInterval, setPhoneInterval] = useState(false);
    const [certiText, setCertiText] = useState("인증하기");

    const nameChange = (text) => {
        setName(text);
    }

    const emailChange = (text) => {
        setEmail(text);
    }

    const phoneChange = (text) => {
        setPhoneNumber(phoneFormat(text));
    }

    const addrHandler = (zip, addr1, bname, buildingName, type) => {
        setAddrZip(zip);
        setAddress1(addr1);
    }   

    const infoAddrChange = (text) => {
        setAddress2(text);
    }

    const certiNumberChange = (num) => {
        setCertiNumber(num);
    }

    const imgSelected = () => {
        ImagePicker.openPicker({
            width: width,
            height: width,
            cropping: true,
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: width * 1.5,
            compressImageQuality: 0.7,
            multiple:false,
          }).then(image => {
            //console.log('이미지 선택....',image);

            const my_photo = {
                uri: image.path,
                type: image.mime,
                data: image.data,
                name: 'profile_img.jpg'
            }

            setProfileImage(my_photo.uri);
            setProfileImageAll(my_photo);
            setCameraModal(false);
            console.log('myPhoto', my_photo);

            
          }).catch(e => {
            console.log('error', e);
            setCameraModal(false);
            ToastMessage("갤러리 선택을 취소하셨습니다.");
          });
    }

    const cameraSelected = () => {
        ImagePicker.openCamera({
            wwidth: width,
            height: width,
            cropping: true,
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: width * 1.5,
            compressImageQuality: 0.7,
            multiple:false,
          }).then(image => {
            console.log(image);

            const my_photo = {
                uri: image.path,
                type: image.mime,
                data: image.data,
                name: 'profile_img.jpg'
            }

            setProfileImage(my_photo.uri);
            setProfileImageAll(my_photo);
            setCameraModal(false);

            console.log('myPhoto', my_photo);
            
          }).catch(e => {
            
            setCameraModal(false);
            if(e.message == "Cannot run camera on simulator"){
                ToastMessage("시뮬레이터에서는 카메라를 실행할 수 없습니다.");
            }else{
                ToastMessage("카메라 촬영을 취소하셨습니다.");
            }
            
          });
          
    }

    useEffect(()=> {
        if(userInfo != null || userInfo != ""){
            console.log(userInfo);

            
            setName(userInfo.name);
            setGender(userInfo.gender);
            setEmail(userInfo.email);
            setPhoneNumber(userInfo.phoneNumber);
            setAddrZip(userInfo.addrZip);
            setAddress1(userInfo.addr1);
            setAddress2(userInfo.addr2);

            if(userInfo.profileUrl != ""){
                setProfileImage(userInfo.profileUrl);
            }

            if(userInfo.certiStatus == "Y"){
                setCertiText("인증완료");
            }else{
                setCertiText("인증하기");
            }

        }
    }, [])


    //수정버튼
    const infoUpdateHandler = async () => {

        if(certiText != "인증완료"){
            ToastMessage("휴대폰번호 인증을 완료하세요.");
            return false;
        }

        if(profileImage == ""){
            ToastMessage("프로필 이미지를 추가하세요.");
            return false;
        }

        if(name == ""){
            ToastMessage("이름을 입력하세요.");
            return false;
        }

        if(gender == ""){
            ToastMessage("성별을 선택하세요.");
            return false;
        }

        if(email == ""){
            ToastMessage("이메일을 입력하세요.");
            return false;
        }

        if(phoneNumber == ""){
            ToastMessage("휴대폰번호를 입력하세요.");
            return false;
        }

        if(address1 == ""){
            ToastMessage("주소를 입력하세요.");
            return false;
        }

        const formData = new FormData();
        formData.append("method", 'member_update');
        formData.append("name", name);
        formData.append("gender", gender);
        formData.append("email", email);
        formData.append("phone", phoneNumber);
        formData.append("addrZip", addrZip);
        formData.append("addr1", address1);
        formData.append("addr2", address2);
        formData.append("id", userInfo.id);
        formData.append("midx", userInfo.midx);

        formData.append('files[]', profileImageAll);

        const update = await member_update(formData);
        console.log("update", update);
        if(update.result){
            console.log("update", update);
            ToastMessage(update.msg);
            member_info_handle();

            navigation.dispatch(
                StackActions.replace('TabNav', {
                    screen: 'Mypage',
                })
            );
        }else{
            ToastMessage(update.msg);
        }
        
    }


    const member_info_handle = async () => {

        const formData = new FormData();
        formData.append('method', 'member_info');
        formData.append('phone', userInfo.phoneNumber);
        if(userInfo.sns != ""){
            formData.append('sns', userInfo.sns);
            formData.append('email', userInfo.email);
        }
        const member_info_list = await member_info(formData);

        console.log('member_info_list:::::',member_info_list);
    }


    const timer_start = () => {
        tcounter = 30;
        t1 = setInterval(Timer, 1000);
        //Timer();
    }

    const Timer = () => {
        
        tcounter = tcounter - 1;

        temp = Math.floor(tcounter/60);

        if(Math.floor(tcounter/60) < 10) { 
            temp = '0'+temp;								
        }

        temp = temp + ":";

        if((tcounter % 60) < 10){ 
            temp = temp + '0';
        }

        temp = temp + (tcounter % 60);

        console.log("temp:::", temp);
        console.log("tcounter::", tcounter % 60);
        setTimeStamp(temp);

        if (tcounter <= 0) {
            //timer_stop();
            setPhoneInterval(false);
        }

    }

    const timer_stop = () => {
        // setPhoneInterval(true);
        //console.log(phoneIntervel);
        //console.log(t1);
        clearInterval(t1);
        setTimeStamp('');
       
    };

    useEffect(()=>{
        if(!phoneInterval) {timer_stop()}
        else                {timer_start()}
    },[phoneInterval]);


    useEffect(()=> {
        if(phoneNumber != userInfo.phoneNumber){
            setCertiText("인증하기");
        }else{
            setCertiText("인증완료");
        }
    }, [phoneNumber])


    const sendCertiNumber = () => {
        setPhoneInterval(true);
        setCertiText("인증하기");
    }


    //인증후 로그인
    const certiNumberCheck = async () => {
        if(!phoneInterval){
            ToastMessage("인증시간이 만료되었습니다\n인증번호를 다시 발송하세요.");
            return false;
        }
        if(!certiNumber){
            ToastMessage("인증번호를 입력하세요.");
            return false;
        }

        if(certiNumber != "111111"){
            ToastMessage("인증번호가 일치하지 않습니다.");
            return false;
        }

        setPhoneInterval(false);
        setCertiText("인증완료");
        ToastMessage("휴대폰 번호 인증이 완료되었습니다.");
        // navigation.replace('TabNav', {
        //     screen: 'Home',
        // });

    }


    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle="회원 정보" />
            <KeyboardAwareScrollView>
                <Box px='25px' py='20px'>
                    <Box alignItems={'center'}>
                        <TouchableOpacity style={[styles.profileBox]} onPress={()=>setCameraModal(true)}>
                            {
                                profileImage != "" ?
                                <Image source={{uri:profileImage}} alt='프로필' style={{width:100, height:100, resizeMode:'stretch', borderRadius:50}} />
                                :
                                <Image source={require("../images/noProfileImg.png")} alt='프로필' style={{width:27, height:31, resizeMode:'contain'}} />
                            }

                        </TouchableOpacity>
                    </Box>
                    <Box mt='20px'>
                        <DefText text="이름" style={[styles.profileLabel]} />
                        <DefInput 
                            placeholder={'이름을 입력하세요.'}
                            value={name}
                            onChangeText={nameChange}
                            inputStyle={{color:'#000000'}}
                        />
                    </Box>
                    <Box mt='20px'>
                        <DefText text="성별" style={[styles.profileLabel]} />
                        <HStack alignItems={'center'} justifyContent='space-between' mt='10px'>
                            <TouchableOpacity onPress={()=>setGender("M")} style={[styles.genderButton, gender == "M" && [colorSelect.sky, {borderColor:'#0195FF'}]]}>
                                <DefText text="남자" style={[styles.genderButtonText, gender == "M" && [fweight.m, {color:'#fff'}]]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setGender("W")} style={[styles.genderButton, gender == "W" && [colorSelect.sky, {borderColor:'#0195FF'}]]}>
                                <DefText text="여자" style={[styles.genderButtonText, gender == "W" && [fweight.m, {color:'#fff'}]]} />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                    <Box mt='20px'>
                        <DefText text="이메일" style={[styles.profileLabel]} />
                        <DefInput 
                            placeholder={'이메일을 입력하세요.'}
                            value={email}
                            onChangeText={emailChange}
                            inputStyle={{color:'#000000'}}
                        />
                    </Box>
                    <Box mt='20px'>
                        <DefText text="휴대폰 번호" style={[styles.profileLabel]} />
                        <DefInput 
                            placeholder={'휴대폰 번호를 입력하세요.(-를 빼고입력)'}
                            value={phoneNumber}
                            onChangeText={phoneChange}
                            inputStyle={{color:'#000000'}}
                            keyboardType='number-pad'
                            maxLengthInput={13}
                        />
                        {
                            (userInfo?.certiStatus != "Y" &&
                            phoneNumber.length == 13) ?
                            <Box position={'absolute'} right='0' bottom='0' height='50px' justifyContent={'center'}>
                                <TouchableOpacity onPress={sendCertiNumber}>
                                    <DefText text="인증번호발송" style={[styles.certiNumberSend, fsize.fs13]} />
                                </TouchableOpacity>
                            </Box>
                            :
                            (userInfo.certiStatus == "Y" &&
                            userInfo.phoneNumber != phoneNumber ) &&
                            <Box position={'absolute'} right='0' bottom='0' height='50px' justifyContent={'center'}>
                                <TouchableOpacity onPress={sendCertiNumber}>
                                    <DefText text="인증번호발송" style={[styles.certiNumberSend, fsize.fs13]} />
                                </TouchableOpacity>
                            </Box>
                        }
                    </Box>
                    {
                        (userInfo?.certiStatus != "Y" && 
                        phoneNumber.length == 13) ?
                        <>
                            <Box mt='20px'>
                                <DefText text="인증번호 입력" style={[styles.profileLabel]} />
                                <DefInput 
                                    placeholder={"인증번호를 입력하세요"}
                                    value={certiNumber}
                                    onChangeText={certiNumberChange}
                                    keyboardType='number-pad'
                                    maxLengthInput={6}
                                />
                                <Box position={'absolute'} right='0' bottom='0' height='50px' justifyContent={'center'} px='20px'>
                                    <DefText text={timeStamp} style={{color:'#666'}} />
                                </Box>
                            </Box>
                            <DefButton
                                disabled={ phoneInterval ? false : true }
                                text={certiText}
                                btnStyle={[styles.certiConfirmBtn, phoneInterval ? [colorSelect.sky] : [colorSelect.gray]]}
                                textStyle={[styles.certiConfirmText, phoneInterval ? {color:'#fff'} : {color:'#000'}]}
                                //onPress={HomeNavigate}
                                onPress={certiNumberCheck}
                            />
                        </>
                        :
                        (userInfo.certiStatus == "Y" &&
                            userInfo.phoneNumber != phoneNumber ) &&
                            <>
                            <Box mt='20px'>
                                <DefText text="인증번호 입력" style={[styles.profileLabel]} />
                                <DefInput 
                                    placeholder={"인증번호를 입력하세요"}
                                    value={certiNumber}
                                    onChangeText={certiNumberChange}
                                    keyboardType='number-pad'
                                    maxLengthInput={6}
                                />
                                <Box position={'absolute'} right='0' bottom='0' height='50px' justifyContent={'center'} px='20px'>
                                    <DefText text={timeStamp} style={{color:'#666'}} />
                                </Box>
                            </Box>
                            <DefButton
                                disabled={ phoneInterval ? false : true }
                                text={certiText}
                                btnStyle={[styles.certiConfirmBtn, phoneInterval ? [colorSelect.sky] : [colorSelect.gray]]}
                                textStyle={[styles.certiConfirmText, phoneInterval ? {color:'#fff'} : {color:'#000'}]}
                                //onPress={HomeNavigate}
                                onPress={certiNumberCheck}
                            />
                        </>
                    }
                    <Box mt='20px'>
                        <DefText text="주소" style={[styles.profileLabel]} />
                        {/* <DefInput 
                            placeholder={"우편번호"}
                            value={addrZip}
                        /> */}
                        <Box pl='10px' height={'50px'} borderBottomWidth={1} borderBottomColor='#BEBEBE' justifyContent={'center'}>
                            <Box>
                                {
                                    addrZip != "" ?
                                    <DefText text={addrZip} style={[fsize.fs13, {color:'#000'}]} />
                                    :
                                    <DefText text="우편번호" style={[fsize.fs13, {color:'#BEBEBE'}]}  />
                                }
                            </Box>
                            <Box position={'absolute'} right='0' bottom='0'> 
                                <TouchableOpacity onPress={()=>setAddrModal(true)} style={[styles.addrSchButton]}>
                                    <DefText text="주소찾기" style={[styles.addrSchButtonText]} />
                                </TouchableOpacity>
                            </Box>
                        </Box>
                    </Box>
                    <Box mt='10px'>
                        {/* <DefInput 
                            placeholder={'주소를 입력하세요.'}
                            value={address1}
                        /> */}
                        <Box pl='10px' height={'50px'} borderBottomWidth={1} borderBottomColor='#BEBEBE' justifyContent={'center'}>
                            {
                                address1 != "" ?
                                <DefText text={address1} style={[fsize.fs13, {color:'#000'}]} />
                                :
                                <DefText text="주소를 선택하세요." style={[fsize.fs13, {color:'#BEBEBE'}]} />
                            }

                        </Box>
                    </Box>
                    <Box mt='10px'>
                        <DefInput 
                            placeholder={'상세주소를 입력하세요.'}
                            value={address2}
                            onChangeText={infoAddrChange}
                        />
                    </Box>
                    
                </Box>
            </KeyboardAwareScrollView>
            <DefButton 
                text="수정"
                btnStyle={[styles.profileButton]}
                textStyle={[styles.profileButtonText]}
                onPress={infoUpdateHandler}
            />
            <Modal isOpen={addrModal} onClose={()=>setAddrModal(false)}>
                <SafeAreaView style={{flex:1, width:width}}>
                    <HStack justifyContent='space-between' height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3', backgroundColor:'#fff'}} px='20px'>
                        <DefText text='주소를 입력해주세요.' style={{fontSize:20, lineHeight:23}} />
                        <TouchableOpacity style={{paddingLeft:20}} onPress={()=>{setAddrModal(false)}}>
                            <Image source={require('../images/menuClose.png')} alt='닫기' style={{width: width / 19.5, height:  width / 19.5}} resizeMode='contain' />
                        </TouchableOpacity>
                    </HStack>
                    <Postcode
                        style={{ width: width, flex:1 }}
                        jsOptions={{ animation: true, hideMapBtn: true }}
                        onSelected={data => {
                            //console.log('주소선택완료',data);
                            addrHandler(data.zonecode, data.address, data.bname, data.buildingName, data.addressType);
                            setAddrModal(false);
                        }}
                        onError={e=>console.log(e)}
                    />
                </SafeAreaView>
            </Modal>
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
        </Box>
    );
};

const styles = StyleSheet.create({
    profileBox: {
        width:100,
        height:100,
        borderRadius:50,
        backgroundColor:'#EFEFEF',
        justifyContent:'center',
        alignItems:'center'
    },
    profileLabel: {
        ...fweight.b,
        ...fsize.fs15
    },
    genderButton: {
        width: (width-50) * 0.48,
        height: 36,
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:'#BEBEBE',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:3
    },
    genderButtonText: {
        ...fsize.fs13,
        color:'#BEBEBE'
    },
    addrSchButton: {
        paddingHorizontal:10,
        height:50,
        alignItems:'center',
        justifyContent:'center',
    },
    addrSchButtonText: {
        ...fsize.fs13,
        ...fweight.m,
        color:'#0195FF',
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
    certiNumberSend: {
        ...fsize.fs15,
        color: '#0195FF',
        ...fweight.m
    },
    certiConfirmBtn: {
        width: width - 50,
        height: 50,
        backgroundColor: '#DEDEDE',
        paddingVertical:0,
        marginTop:20
    },
    certiConfirmText: {
        ...fweight.m,
        ...fsize.fs13
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
)(ProfileSetting);