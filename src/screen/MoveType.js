import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';

import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get('window');

const btnHalf = (width - 50) * 0.48;

const MoveType = (props) => {

    const {navigation} = props;

    const [type, setType] = useState(""); //이사유형 선택
    const [homeType, setHomeType] = useState(""); //가정집 이사 선택시 사진, 방문 선택
    const [address, setAddress] = useState(""); //주소
    const [moveDate, setMoveDate] = useState(""); //이사 날짜

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

    //주소입력
    const addrHandler = (addr) => {
        setAddress(addr);
    }
    //이사날짜 입력
    const moveDateHandler = (move) => {
        setMoveDate(move);
    }


    const nextNavigation = () => {

        let nextParams;

        if(!type){
            ToastMessage('이사 유형을 선택하세요.');
            return false;
        }

        if(type == '가정집이사'){
            if(homeType == ""){
                ToastMessage("가정집 이사를 선택하신경우\n사진으로 이사, 방문 견적 요청 중 하나를 선택하세요.");
                return false;
            }

            if(homeType == "방문"){
                if(!address){
                    ToastMessage('주소를 입력하세요.');
                    return false;
                }
    
                if(!moveDate){
                    ToastMessage('이사 날짜를 입력하세요.');
                    return false;
                }
            }
        }

        nextParams = {'type':type, 'homeType':homeType, 'address':address, 'moveDate':moveDate};

        if(type == '소형이사'){
            navigation.navigate("CameraSmallHome");
        }
        console.log(nextParams);
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
                                            placeholder={'주소를 입력해 주세요. (읍면동까지)'}
                                            value={address}
                                            onChangeText={addrHandler}
                                        />
                                    </Box>
                                    <Box mt='25px'>
                                        <DefText text='이사 날짜' style={[styles.labelText]} />
                                        <DefInput 
                                            placeholder={'이사 날짜를 입력해 주세요.'}
                                            value={moveDate}
                                            onChangeText={moveDateHandler}
                                        />
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
            <BottomButton leftText='이전' rightText='다음' rightonPress={nextNavigation} />
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
    }
})

export default MoveType;