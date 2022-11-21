import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Postcode from '@actbase/react-daum-postcode';

const {width, height} = Dimensions.get('window');

const btnHalf = (width - 50) * 0.48;

const now = new Date();
const date = moment(now); // Thursday Feb 2015
const dow = date.format('YYYY-MM-DD HH:mm:ss');


//console.log("year", new Date("2022-5-20 10:30:20"));
//console.log("year", new Date( year + "-" +month + "-" + dates + "08:00:00"));

const MoveType = (props) => {

    const {navigation, userInfo} = props;

    const [type, setType] = useState(""); //이사유형 선택
    const [homeType, setHomeType] = useState(""); //가정집 이사 선택시 사진, 방문 선택
    const [addrZip, setAddrZip] = useState("");
    const [address, setAddress] = useState(""); //주소
    const [address2, setAddress2] = useState("");
    const [moveDate, setMoveDate] = useState(""); //이사 날짜
    const [addrModal, setAddrModal] = useState(false);
    const [dateModal, setDateModal] = useState(false);


    const addrHandler = (zip, addr1, bname, buildingName, type) => {
        setAddrZip(zip);
        setAddress(addr1);
    }

    const addrText2Handler = (text) => {
        setAddress2(text);
    }

    const timeHandler = (time) => {

        console.log('moment::::',moment(time).format("YYYY-MM-DD"));
        setMoveDate(moment(time).format("YYYY-MM-DD"));
        hideDatePicker();
        //console.log(time.format("HH:mm"));
    }

    const hideDatePicker = () => {
        setDateModal(false);
    }

    //유형 선택하기
    const typeHandler = (typeText) => {
        if(type == typeText){
            setType("");
        }else{
            setType(typeText);
        }
    }

    //가정집이사 유형선택하기
    const homeTypeHandler = (htText) => {
        if(homeType == htText){
            setHomeType("");
        }else{
            setHomeType(htText);
        }
    }


    //이사날짜 입력
    const moveDateHandler = (move) => {
        setMoveDate(move);
    }


    const nextNavigation = () => {

        if(!type){
            ToastMessage('이사 유형을 선택하세요.');
            return false;
        }


        Api.send('move_ing', {"type":type, "mid":userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('이미 진행중인 경매내역 없으면 성공!', resultItem);
                navigation.navigate("CameraSmallHome");
            }else{
               console.log('이미 진행중인 경매내역 있으면 die!', resultItem);
               //setAppInfoVideoKey("");
               ToastMessage(resultItem.message);
               return false;
            }
        });
       
    }


    //가정집이사 사진으로 이사
    const twoRoomNavigation = () => {
        navigation.navigate("TwoRoomSetting");
    }

    useEffect(()=> {
        console.log(userInfo);
    }, [])

    //방문견적요청
    const visitAcution = () => {

        //house_visit

        Api.send('house_visit', {"mid":userInfo.id, "mname":userInfo.name, "vaddr":address, "vaddr2":address2, "vdate":moveDate,  "moveStatus":"방문"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
            console.log('방문견적요청: ', resultItem);
            ToastMessage(resultItem.message);
            navigation.navigate('TabNav', {
                screen: 'Reservation',
                params:{
                    moveCate : "가정집 이사" ,
                    tabCategory: "찾는중",
                    twoCate:"방문"
                }
            });
            }else{
            console.log('방문견적요청 실패!', resultItem);
            ToastMessage(resultItem.message);
            }
        });

        // Api.send('visit_pay', {"mid":userInfo.id, "mname":userInfo.name, "vaddr":address, "vaddr2":address2, "vdate":moveDate, "ex_id":"", "ex_name":"", "moveStatus":"방문"}, (args)=>{

        //     let resultItem = args.resultItem;
        //     let arrItems = args.arrItems;
    
        //     if(resultItem.result === 'Y' && arrItems) {
        //        console.log('방문견적요청 금액: ', resultItem, arrItems);
        //        navigation.navigate("VisitAuctionPayModule", {"app_commission":arrItems.app_commission, "commission":arrItems.commission, "def_visit_auction": arrItems.def_visit_auction, "sumsum":arrItems.sumsum, "vat":arrItems.vat, "address":address, "address2":address2, "moveDate":moveDate});
        //     }else{
        //        console.log('방문견적요청 금액 실패!', resultItem);
        //        ToastMessage(resultItem.message);
        //     }
        // });

        

        
    }


    const ReservationNavigate = () => {
        navigation.navigate('TabNav', {
            screen: 'Reservation',
            params:{
                moveCate : "가정집 이사" ,
                tabCategory: "찾는중",
                twoCate:"방문"
            }
        });
    }


    const carNavigation = () => {
        navigation.navigate("CarStartAddr");
    }


    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='이사 유형 선택' />
            <ScrollView>
                <Box px='25px' py='20px'>
                    {
                        type == '소형이사' ?
                        <TouchableOpacity activeOpacity={1} onPress={()=>typeHandler('소형이사')} style={[styles.typeButtonOn]}>
                            <HStack justifyContent={'space-between'} alignItems='center'>
                                <Box width='65%'>
                                    <DefText text='소형 이사' style={[styles.typeButtonText, styles.typeButtonOnText1]} />
                                    <DefText text={'원룸, 1.5룸 이하 고객님께\n추천드립니다. AI 이사견적\n서비스를 제공합니다.'} style={[styles.typeButtonOnText2]} />
                                </Box>
                                <Image source={require('../images/smallMoveIcon.png')} alt='소형이사' style={[{width:98, height:76, resizeMode:'contain'}]}/>
                            </HStack>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity activeOpacity={1} onPress={()=>typeHandler('소형이사')} style={[styles.typeButton]}>
                            <DefText text='소형 이사' style={[styles.typeButtonText]} />
                        </TouchableOpacity>
                    }
                    {
                        type == '가정집이사' ?
                        <Box mt='10px'>
                            <TouchableOpacity activeOpacity={1} onPress={()=>typeHandler('가정집이사')} style={[styles.typeButtonOn]}>
                                <HStack justifyContent={'space-between'} alignItems='center'>
                                    <Box width='65%'>
                                        <DefText text='가정집 이사 (투룸 이상)' style={[styles.typeButtonText, styles.typeButtonOnText1]} />
                                        <DefText text={'투룸 이상의 가정집 이사 고객님께 추천드립니다.\n투룸 이상은 AI 견적 제공 없이 진행됩니다.'} style={[styles.typeButtonOnText2]} />
                                    </Box>
                                    <Image source={require('../images/houseMoveIcon.png')} alt='소형이사' style={[{width:90, height:76, resizeMode:'contain'}]}/>
                                </HStack>
                            </TouchableOpacity>
                            <HStack mt='10px' alignItems={'center'} justifyContent='space-between'>
                                <TouchableOpacity onPress={()=>homeTypeHandler('사진')} style={[styles.typeButton, {width:btnHalf}, homeType == '사진' && colorSelect.sky]}>
                                    <DefText text='사진으로 이사' style={[styles.typeButtonText, homeType == '사진' && {color:'#fff'}]}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>homeTypeHandler('방문')} style={[styles.typeButton, {width:btnHalf}, homeType == '방문' && colorSelect.sky]}>
                                    <DefText text='방문 견적 요청' style={[styles.typeButtonText, homeType == '방문' && {color:'#fff'}]}/>
                                </TouchableOpacity>
                            </HStack>
                            {
                                homeType == '방문' &&
                                <Box>
                                    <Box mt='25px'>
                                        <DefText text='주소' style={[styles.labelText]} />
                                        <DefInput 
                                            placeholder={'주소를 입력해 주세요.'}
                                            value={address}
                                            onChangeText={addrHandler}
                                        />
                                        <Box position={'absolute'} right='0' bottom='0'> 
                                            <TouchableOpacity onPress={()=>setAddrModal(true)} style={[styles.addrSchButton]}>
                                                <DefText text="주소찾기" style={[styles.addrSchButtonText]} />
                                            </TouchableOpacity>
                                        </Box>
                                    </Box>
                                    <Box >
                                        <DefInput 
                                            placeholder={'상세주소'}
                                            value={address2}
                                            onChangeText={addrText2Handler}
                                        />
                                        <DefText text='전문가와 거래가 되어야 상세주소가 노출되니 안심하세요.' style={[fsize.fs14, {marginTop:15}]} />
                                    </Box>
                                    <Box mt='25px'>
                                        <DefText text='이사 날짜' style={[styles.labelText]} />
                                        <TouchableOpacity onPress={()=>setDateModal(true)} style={[{height:50, borderBottomWidth:1, borderBottomColor:'#BEBEBE', paddingLeft:10, justifyContent:'center'}]}>
                                            {
                                                moveDate != "" ?
                                                <DefText text={moveDate} style={[fsize.fs13, {color:'#000'}]} />
                                                :
                                                <DefText text="이사 날짜를 입력해 주세요." style={[fsize.fs13, {color:'#bebebe'}]} />
                                            }
                                        </TouchableOpacity>
                                        {/* <DefInput 
                                            placeholder={'이사 날짜를 입력해 주세요.'}
                                            value={moveDate}
                                            onChangeText={moveDateHandler}
                                        /> */}
                                    </Box>
                                </Box>
                            }
                        </Box>
                        :
                        <TouchableOpacity activeOpacity={1} onPress={()=>typeHandler('가정집이사')} style={[styles.typeButton, {marginTop:10}]}>
                            <DefText text='가정집 이사' style={[styles.typeButtonText]} />
                        </TouchableOpacity>
                    }
                    {
                        type == '차량' ?
                        <TouchableOpacity activeOpacity={1} onPress={()=>typeHandler('차량')} style={[styles.typeButtonOn, {marginTop:10}]}>
                            <HStack justifyContent={'space-between'} alignItems='center'>
                                <Box width='65%'>
                                    <DefText text='차량만 대여' style={[styles.typeButtonText, styles.typeButtonOnText1]} />
                                    <DefText text={'짐을 옮겨주는 서비스가\n아닌 차량만 대여해주는\n서비스입니다.\n이사 차량만 필요한 고객에게 추천드립니다.'} style={[styles.typeButtonOnText2]} />
                                </Box>
                                <Image source={require('../images/moveCar.png')} alt='차량' style={[{width:110, height:76, resizeMode:'contain'}]}/>
                            </HStack>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity activeOpacity={1} onPress={()=>typeHandler('차량')} style={[styles.typeButton, {marginTop:10}]}>
                            <DefText text='차량만 대여' style={[styles.typeButtonText]} />
                        </TouchableOpacity>
                    }
                </Box>
            </ScrollView>
            {
                type == '소형이사' && 
                <BottomButton leftText='이전' rightText='다음' leftonPress={()=>navigation.goBack()} rightonPress={nextNavigation} />
            }
            {
               ( type == '가정집이사' && homeType == '방문') &&
                <BottomButton leftText='이전' rightText='방문견적요청' leftonPress={()=>navigation.goBack()}  rightonPress={visitAcution}  />
            }
            {
               ( type == '가정집이사' && homeType == '사진') &&
                <BottomButton leftText='이전' rightText='다음' leftonPress={()=>navigation.goBack()}  rightonPress={twoRoomNavigation}  />
            }
            {
                type == '차량' &&
                <BottomButton leftText='이전' rightText='다음' leftonPress={()=>navigation.goBack()}  rightonPress={carNavigation}  />
            }

            <DateTimePickerModal
                isVisible={dateModal}
                mode="date"
                onConfirm={timeHandler}
                onCancel={hideDatePicker}
                minimumDate={new Date()}
            />
            <Modal isOpen={addrModal} onClose={()=>setAddrModal(false)}>
                <SafeAreaView style={{flex:1, width:width}}>
                    <HStack justifyContent='space-between' height='50px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3', backgroundColor:'#fff'}} px='20px'>
                        <DefText text='방문견적을 위해 주소를 입력해주세요' style={[fsize.fs15, fweight.b]} />
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
    typeButton: {
        width: width - 50,
        height:53,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        ...colorSelect.gray
    },
    typeButtonText: {
        ...fsize.fs18,
        ...fweight.m,
    },
    typeButtonOn: {
        width: width - 50,
        padding:20,
        borderRadius:10,
        ...colorSelect.sky
    },
    typeButtonOnText1:{
        color:'#fff'
    },
    typeButtonOnText2: {
        color:'#fff',
        marginTop:10,
        lineHeight:21
    },
    labelText: {
        ...fsize.fs14,
        ...fweight.b
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
    })
)(MoveType);