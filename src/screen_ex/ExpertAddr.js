import React, { useEffect, useState } from 'react';
import {Box, HStack, VStack, Modal} from 'native-base';
import { BottomButton, DefButton, DefInput, DefText } from '../common/BOOTSTRAP';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import SubHeader from '../components/SubHeader';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import { BASE_URL } from '../Utils/APIConstant';
import Geolocation from 'react-native-geolocation-service';
import {WebView} from 'react-native-webview';
import Postcode from '@actbase/react-daum-postcode';

const {width, height} = Dimensions.get("window");

const ExpertAddr = (props) => {

    const {navigation, userInfo, member_info, member_update} = props;

    const [mapLoading, setMapLoading] = useState(true);
    const [startAddress, setStartAddress] = useState("");
    const [inputAddr, setInputAddr] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [mapUrl, setMapUrl] = useState(BASE_URL + '/mapAddr.php');
    const [rightDisalbe, setRightDisalbe] = useState(true);

    const [addrModal, setAddrModal] = useState(false);
    const [addrZip, setAddrZip] = useState("");
    const [address, setAddress] = useState(""); //주소
    const [address2, setAddress2] = useState("");

    const addrHandler = (zip, addr1, bname, buildingName, type) => {
        setAddrZip(zip);
        setAddress(addr1);
        setInputAddr(addr1);

        setLatitude("");
        setLongitude("");
    }

    const startAddressChange = (text) => {
        setStartAddress(text);
    }

    const geoPermission = async () => {
        await setMapLoading(true);
        await setStartAddress("");
        await setInputAddr("");

        if(Platform.OS === 'ios'){
            Geolocation.requestAuthorization("whenInUse");
            getGeoLocation();
        }else{
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: '위치정보 이용',
                    message: '고객님의 위치정보를 활용 해 주소를 확인합니다.',
                    buttonPositive: "확인"
                }
            )
            if(granted === PermissionsAndroid.RESULTS.GRANTED){
                getGeoLocation();
            }else{
                console.log("위치기반허용이 완료되지 못했습니다.");
            }
        }

        await setMapLoading(false);
    }

    const getGeoLocation = async () => {
        Geolocation.getCurrentPosition( (position) => 
            {
                console.log('geolocation:::', position.coords);
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            },
            (error) => {
                console.log("err::::", error)
            },
            {
                showLocationDialog: true,
                enableHighAccuracy: true,
                timeout: 1500,
                maximumAge: 10000
            }
        )
    }

    const addrSubmit = async () => {
        if(!startAddress){
            ToastMessage("주소를 입력하세요.");
            return false;
        }

        await setMapLoading(true);
        await setLatitude("");
        await setLongitude("");
        await setInputAddr(startAddress);
        await setMapLoading(false);
    }

    const mapLoadingHandler = async () => {
        await setMapLoading(true);
        await setMapLoading(false);
    }

    useEffect(()=> {
        mapLoadingHandler();
    }, []);

    useEffect(()=>{
        if(inputAddr != ""){
            setRightDisalbe(false);
        }else{
            setRightDisalbe(true);
        }
    }, [inputAddr]);

    //console.log('주소설정', userInfo);

    const expertUpdate = async () => {
        const formData = new FormData();
        formData.append("method", 'expert_update');
        formData.append("ex_move_status", userInfo.ex_move_status);
        formData.append("phone", userInfo.ex_phone);
        formData.append("id", userInfo.ex_id);
        formData.append("ex_service_status", userInfo.ex_service_status);
        formData.append("ex_start_date", userInfo.ex_start_date);
        formData.append("ex_service_name", userInfo.ex_service_name);
        formData.append("ex_advantages", userInfo.ex_advantages);
        formData.append("ex_select_reason", userInfo.ex_select_reason);
        formData.append("ex_worth", userInfo.ex_worth);
        formData.append("ex_refund", userInfo.ex_refund);
        formData.append("register_status", "Y");

        //추가
        formData.append("ex_addr", inputAddr);


        const update = await member_update(formData);

        if(update.result){
            
            expertInfo();

            navigation.navigate("ExpertArea");
           console.log(update);
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
        if(userInfo != null){
            console.log("주소::", userInfo.ex_addr);
            setInputAddr(userInfo.ex_addr);
            setStartAddress(userInfo.ex_addr);
        }
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="주소 설정" navigation={navigation} />
            <ScrollView>
                <Box px='25px' pt='20px'>
                    <DefText text="사무실 위치는 어디인가요?" style={[styles.pageTitle]} />
                    <Box mt='10px'>
                        {/* <DefInput 
                            placeholder={'주소를 입력해 주세요.'}
                            value={startAddress}
                            onChangeText={startAddressChange}
                            inputStyle={{
                                borderBottomWidth:0,
                                backgroundColor:'#F8F8F8',
                                paddingLeft:15,
                                borderRadius:5
                            }}
                            onSubmitEditing={addrSubmit}
                        />
                        <Box position='absolute' top='0' right='0'>
                            <TouchableOpacity style={[styles.schButton]} onPress={addrSubmit}>
                                <Image
                                    source={require('../images/addrSearchIcon.png')}
                                    alt='검색'
                                    style={{
                                        width:16,
                                        height:16,
                                        resizeMode:'contain'
                                    }}
                                />
                            </TouchableOpacity>
                        </Box> */}
                        <Box>
                            <Box style={[styles.addrBox]}>
                                {
                                    address != "" ?
                                    <DefText text={address} style={[fsize.fs13, {color:'#000'}]} />
                                    :
                                    <DefText text='주소를 입력하세요.' style={[fsize.fs13, {color:'#BEBEBE'}]} />
                                }
                            </Box>
                            <Box position={'absolute'} top='0' right='0'> 
                                <TouchableOpacity onPress={()=>setAddrModal(true)} style={[styles.addrSchButton]}>
                                    <DefText text="주소찾기" style={[styles.addrSchButtonText]} />
                                </TouchableOpacity>
                            </Box>
                        </Box>
                        <HStack justifyContent={'flex-end'}>
                            <TouchableOpacity onPress={geoPermission} style={[styles.nowSpotButton]}>
                                <DefText text="현재 위치로 지정" style={[styles.nowSpotButtonText]} />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                   
                   
                </Box>
                {
                    (inputAddr != "" || latitude != "") &&
                    <Box width={width} height='225px'>
                        <WebView
                            originWhitelist={['*']}
                            source={{uri:mapUrl + "?addr=" + inputAddr + "&lat=" + latitude + "&lon=" + longitude}}
                            onMessage={(e)=>{
                                console.log('e', JSON.parse(e.nativeEvent.data));
                                // setStartAddress(e.nativeEvent.data);
                                // setInputAddr(e.nativeEvent.data);
                                // setAddress(e.nativeEvent.data);

                                setStartAddress(JSON.parse(e.nativeEvent.data).addrText);
                                setInputAddr(JSON.parse(e.nativeEvent.data).addrText);
                                setAddress(JSON.parse(e.nativeEvent.data).addrText);
                                setLatitude(JSON.parse(e.nativeEvent.data).lat);
                                setLongitude(JSON.parse(e.nativeEvent.data).lon);
                            }}
                            style={{
                                opacity:0.99,
                                minHeight:1,
                            }}
                        />
                    </Box>
                }
                
                {/* {
                    inputAddr != "" &&
                    <Box px='25px' py='20px'>
                        <DefText text={"※ 주소 핀 이 제대로인지 확인해 주세요."} style={[styles.addrText1]} />
                        <HStack mt='20px'>
                            <Image source={require('../images/addrIcons.png')} alt='아이콘' style={{width:15, height:15, resizeMode:'contain', marginTop:2}} />
                            <VStack ml='10px'>
                                <DefText text='고객님 안심하세요' style={[styles.addrText2, {marginBottom:10}]} />
                                <DefText text={"이사전문가와 예약이 확정이 되어야 자세한\n주소가 노출됩니다."} style={[styles.addrText2]} />
                            </VStack>
                        </HStack>
                    </Box>
                } */}
                
            </ScrollView>
            <BottomButton 
                leftText='이전' 
                rightText='다음' 
                leftonPress={()=>navigation.goBack()} 
                rightDisable={ rightDisalbe } 
                rightBtnStyle={ !rightDisalbe ? colorSelect.sky : colorSelect.gray }  
                rightonPress={expertUpdate}
            />
            <Modal isOpen={addrModal} onClose={()=>setAddrModal(false)}>
                <SafeAreaView style={{flex:1, width:width}}>
                    <HStack justifyContent='space-between' height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3', backgroundColor:'#fff'}} px='20px'>
                        <DefText text='주소를 입력해주세요.' style={[fsize.fs15, fweight.b]} />
                        <TouchableOpacity style={{paddingLeft:20}} onPress={()=>{setAddrModal(false)}}>
                            <Image source={require('../images/menuClose.png')} alt='닫기' style={{width: width / 19.5, height:  width / 19.5}} resizeMode='contain' />
                        </TouchableOpacity>
                    </HStack>
                    <Postcode
                        style={{ width: width, flex:1 }}
                        jsOptions={{ animation: true, hideMapBtn: true }}
                        onSelected={data => {
                            console.log('주소선택완료',data);
                            let jibun;
                            if(data.jibunAddress == ""){
                                jibun = data.autoJibunAddress;
                            }else{
                                jibun = data.jibunAddress;
                            }
                            addrHandler(data.zonecode, jibun, data.bname, data.buildingName, data.addressType);
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
    pageTitle:{
        ...fsize.fs18,
        ...fweight.b,
        marginBottom:10
    },
    schButton: {
        justifyContent:'center',
        alignItems:'center',
        height:50,
        width:50,
    },
    nowSpotButton: {
        paddingVertical:10,
        paddingHorizontal:15,
        ...colorSelect.sky,
        borderRadius:5,
        marginVertical:15
    },
    nowSpotButtonText: {
        ...fsize.fs14,
        color:'#fff'
    },
    addrText1: {
        ...fweight.b,
        color:'#FF5050'
    },
    addrText2: {
        ...fweight.b
    },
    addrBox: {
        height:50,
        paddingLeft:15,
        borderRadius:5,
        backgroundColor:'#F8F8F8',
        justifyContent:'center'
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
)(ExpertAddr);