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

const {width, height} = Dimensions.get("window");

const SmallMoveStartAddress = (props) => {

    const {navigation, route} = props;
    const {params} = route;


    console.log('출발지', params);

    const [mapLoading, setMapLoading] = useState(true);
    const [startAddress, setStartAddress] = useState("");
    const [inputAddr, setInputAddr] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [mapUrl, setMapUrl] = useState(BASE_URL + '/mapAddr.php');
    const [rightDisalbe, setRightDisalbe] = useState(true);

    const startAddressChange = (addr) => {
        setStartAddress(addr);
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
                //console.log('geolocation:::', position.coords);
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

    //대전광역시
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

    const nextNavigation = () => {
        navigation.navigate("SmallMoveDestinationTool", {"item":params.item, "moveCategory":params.moveCategory, "pakageType":params.pakageType, "personStatus":params.personStatus, "keepStatus":params.keepStatus, "startMoveTool":params.startMoveTool, "startFloor":params.startFloor, "startAddress":inputAddr});
    }
    //console.log(params);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='소형이사 (원룸이사) 견적요청' />
            <ScrollView>
                <Box px='25px' pt='20px' pb='0'>
                    <DefText text="이사 출발 위치는 어디인가요?" style={[styles.pageTitle]} />
                    <Box mt='15px'>
                        <DefInput 
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
                        </Box>
                    </Box>
                    <HStack justifyContent={'flex-end'}>
                        <TouchableOpacity onPress={geoPermission} style={[styles.nowSpotButton]}>
                            <DefText text="현재 위치로 지정" style={[styles.nowSpotButtonText]} />
                        </TouchableOpacity>
                    </HStack>
                    {/* {
                        longitude != "" && latitude != "" &&
                        <DefText text={"위도 : " + latitude + ", 경도 : " + longitude} />
                    } */}
                </Box>
                <Box width={width} height='225px'>
                    {
                        mapLoading ?
                        <Box justifyContent={'center'} alignItems='center' height={'225px'}>
                            <ActivityIndicator size='large' color='#333' />
                        </Box>
                        :
                        <WebView
                            originWhitelist={['*']}
                            source={{uri:mapUrl + "?addr=" + inputAddr + "&lat=" + latitude + "&lon=" + longitude}}
                            onMessage={(e)=>{
                                console.log('e', e.nativeEvent.data);
                                setStartAddress(e.nativeEvent.data);
                                setInputAddr(e.nativeEvent.data);
                            }}
                            style={{
                                opacity:0.99,
                                minHeight:1,
                            }}
                        />
                    }
                   
                </Box>
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
            <BottomButton 
                leftText='이전' 
                rightText='다음' 
                leftonPress={()=>navigation.goBack()} 
                rightDisable={ rightDisalbe } 
                rightBtnStyle={ !rightDisalbe ? colorSelect.sky : colorSelect.gray }  
                rightonPress={nextNavigation}
            />
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
    }
})

export default SmallMoveStartAddress;