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

const {width, height} = Dimensions.get("window");

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

        }
    }, [])


    //수정버튼
    const infoUpdateHandler = async () => {

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

        const update = await member_update(formData);

        if(update.result){
            console.log("update", update);
            member_info_handle();

            navigation.dispatch(
                StackActions.replace('TabNav', {
                    screen: 'Mypage',
                })
            );
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

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle="회원 정보 수정" />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <Box alignItems={'center'}>
                        <TouchableOpacity style={[styles.profileBox]}>
                            <Image source={require("../images/noProfileImg.png")} alt='프로필' style={{width:27, height:31, resizeMode:'contain'}} />
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
                    </Box>
                    <Box mt='20px'>
                        <DefText text="주소" style={[styles.profileLabel]} />
                        <DefInput 
                            placeholder={"우편번호"}
                            value={addrZip}
                        />
                        <Box position={'absolute'} right='0' bottom='0'> 
                            <TouchableOpacity onPress={()=>setAddrModal(true)} style={[styles.addrSchButton]}>
                                <DefText text="주소찾기" style={[styles.addrSchButtonText]} />
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    <Box mt='10px'>
                        <DefInput 
                            placeholder={'주소를 입력하세요.'}
                            value={address1}
                        />
                    </Box>
                    <Box mt='10px'>
                        <DefInput 
                            placeholder={'상세주소를 입력하세요.'}
                            value={address2}
                            onChangeText={infoAddrChange}
                        />
                    </Box>
                    
                </Box>
            </ScrollView>
            <DefButton 
                text="수정"
                btnStyle={[styles.profileButton]}
                textStyle={[styles.profileButtonText]}
                onPress={infoUpdateHandler}
            />
            <Modal isOpen={addrModal} onClose={()=>setAddrModal(false)}>
                <SafeAreaView style={{flex:1, width:width}}>
                    <HStack justifyContent='space-between' height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3', backgroundColor:'#fff'}} px='20px'>
                        <DefText text='다음주소찾기' style={{fontSize:20, lineHeight:23}} />
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
    }
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