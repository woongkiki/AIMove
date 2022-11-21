import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';
import Geolocation from 'react-native-geolocation-service';
import {WebView} from 'react-native-webview';
import { BASE_URL } from '../Utils/APIConstant';
import Postcode from '@actbase/react-daum-postcode';

const {width, height} = Dimensions.get("window");
const TwoRoomDesinationAddr = (props) => {

    const {navigation, route} = props;
    const {params} = route;

    console.log('params1111:::', params);
    const [mapLoading, setMapLoading] = useState(true);
    const [destinationAddr, setDestinationAddr] = useState("");
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
     

        // setLatitude("");
        // setLongitude("");
    }

    const destinationAddrHandler = (addr) => {
        setDestinationAddr(addr);
    }

    //서울특별시 은평구 녹번동
    //경기도 부천시 길주로 272
    const addrSubmit = async () => {

        if(!destinationAddr){
            ToastMessage("주소를 입력하세요.");
            return false;
        }

        // if(destinationAddr == params.startAddress){
        //     console.log("출발지와 도착지의 위치가 같습니다.");
        //     return false;
        // }

        mapEvent();
        await setInputAddr(destinationAddr);
    }


    const mapEvent = async () => {
        await setMapLoading(true);
        await setMapLoading(false);
    }

    useEffect(()=> {
        mapEvent();
    },[]);


    useEffect(()=>{
        if(inputAddr != ""){
            setRightDisalbe(false);
        }else{
            setRightDisalbe(true);
        }
    }, [inputAddr]);


    const nextNavigation = () => {
        //console.log('ㄱㄱ');
        navigation.navigate("TwoRoomDestinationTool", {
            "houseSize":params.houseSize,
            "houseSizem2":params.houseSizem2,
            "houseStructure":params.houseStructure,
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
            "startAddrLat":params.startAddrLat,
            "startAddrLon":params.startAddrLon,
            "destinationAddress":inputAddr,
            "destinationAddrLat":latitude,
            "destinationAddrLon":longitude
        })
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='가정집이사 견적요청' />
            {
                mapLoading ?
                <Box justifyContent={'center'} alignItems='center' flex={1}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box px='25px' pt='20px' pb='0'>
                        <DefText text="이사 도착 위치는 어디인가요?" style={[styles.pageTitle]} />
                        {/* <Box mt='15px'>
                            <DefInput 
                                placeholder={'주소를 입력해 주세요.'}
                                value={destinationAddr}
                                onChangeText={destinationAddrHandler}
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
                            </Box>
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
                        {/* {
                            longitude != "" && latitude != "" &&
                            <DefText text={"위도 : " + latitude + ", 경도 : " + longitude} />
                        } */}
                    </Box>
                    {
                         inputAddr != "" &&
                         <Box width={width} height='225px' mt='20px'>
                            <WebView
                                originWhitelist={['*']}
                                source={{uri:mapUrl + "?addr=" + inputAddr}}
                                // onMessage={(e)=>{
                                //     console.log('e', e.nativeEvent.data);
                                //     setStartAddress(e.nativeEvent.data);
                                //     setInputAddr(e.nativeEvent.data);
                                // }}
                                onMessage={(e)=>{
                                    console.log('e', JSON.parse(e.nativeEvent.data));
                                    setDestinationAddr(JSON.parse(e.nativeEvent.data).addrText);
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
                    
                    {
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
                    }
                </ScrollView>
            }
            <BottomButton 
                leftText='이전' 
                rightText='다음' 
                leftonPress={()=>navigation.goBack()} 
                rightDisable={ rightDisalbe } 
                rightBtnStyle={ !rightDisalbe ? colorSelect.sky : colorSelect.gray }  
                rightonPress={nextNavigation}
            />
            <Modal isOpen={addrModal} onClose={()=>setAddrModal(false)}>
                <SafeAreaView style={{flex:1, width:width}}>
                    <HStack justifyContent='space-between' height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3', backgroundColor:'#fff'}} px='20px'>
                        <DefText text='도착지 주소를 입력해주세요.' style={[fsize.fs15, fweight.b]} />
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

export default TwoRoomDesinationAddr;