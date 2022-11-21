import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get("window");

const TwoRoomPackage = (props) => {

    const {navigation, route} = props;
    const {params} = route;

    console.log("params1", params);
    const [pakageType, setPakageType] = useState("");

    const pakageChange = (type) => {
        setPakageType(type);
    }

    const nextNavigation = () => {
        console.log("다음");
        navigation.navigate("TwoRoomPerson", {
            "houseSize":params.houseSize,
            "houseSizem2":params.houseSizem2,
            "houseStructure":params.houseStructure,
            "houseType":params.houseType,
            "bigSelectBox":params.bigSelectBox,
            "moveCategory":params.moveCategory,
            "pakageType":pakageType
        })
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle='가정집 이사 견적요청' navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    {
                        pakageType == '포장 이사' ?
                        <TouchableOpacity activeOpacity={1} onPress={()=>pakageChange('')}  style={[styles.btnOn]}>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <VStack width='70%'>
                                    <DefText text='포장이사' style={[styles.btnOnTitle]} />
                                    <DefText text={"짐을 직접 포장해주고, 이사 후 위치만 정해주면 짐을 원 상태로 풀어서 배치해주는 서비스. 귀중품은 직접 챙기세요."} style={[styles.btnOnTitle2, {marginTop:10, lineHeight:22}]} />
                                </VStack>
                                <Image 
                                    source={require("../images/packageMove.png")}
                                    alt='포장 이사'
                                    style={{
                                        width:49,
                                        height:76,
                                        resizeMode:'contain'
                                    }}
                                />
                            </HStack>
                        </TouchableOpacity>
                        :
                        <DefButton 
                            text='포장 이사'
                            onPress={()=>pakageChange('포장 이사')} 
                            btnStyle={[styles.buttonStyle]} 
                            textStyle={[styles.btnTextStyle]} 
                        />
                    }
                    {
                        pakageType == '반포장 이사' ?
                        <TouchableOpacity activeOpacity={1} onPress={()=>pakageChange('')}  style={[styles.btnOn, {marginTop:10}]}>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <VStack width='70%'>
                                    <DefText text='반포장 이사' style={[styles.btnOnTitle]} />
                                    <DefText text={"짐을 이사 업체에서 큰 가구만 포장 해주고 자리배치나 포장 푸는 것은 고객이 하는 서비스. 욕실과 주방도 직접 포장하셔야 합니다."} style={[styles.btnOnTitle2, {marginTop:10, lineHeight:22}]} />
                                </VStack>
                                <Image 
                                    source={require("../images/halfPakageMove.png")}
                                    alt='반포장 이사'
                                    style={{
                                        width:59,
                                        height:76,
                                        resizeMode:'contain'
                                    }}
                                />
                            </HStack>
                        </TouchableOpacity>
                        :
                        <DefButton 
                            text='반포장 이사'
                            onPress={()=>pakageChange('반포장 이사')} 
                            btnStyle={[styles.buttonStyle]} 
                            textStyle={[styles.btnTextStyle]} 
                        />
                    }
                    {
                        pakageType == '일반 이사' ?
                        <TouchableOpacity activeOpacity={1} onPress={()=>pakageChange('')}  style={[styles.btnOn, {marginTop:10}]}>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <VStack width='65%'>
                                    <DefText text='일반 이사' style={[styles.btnOnTitle]} />
                                    <DefText text={"짐 포장과 푸는 것은 고객이 알아서 처리하고 이사 업체는 짐만 옮겨주는 서비스.\n비닐이나 쇼핑백은 트럭에 쌓기 어렵습니다.\n짐이 박스로 완벽히 포장이 안되어 있으면 추가 비용이 발생할 수 있어요."} style={[styles.btnOnTitle2, {marginTop:10, lineHeight:22}]} />
                                </VStack>
                                <Image 
                                    source={require("../images/defaultMove.png")}
                                    alt='일반 이사'
                                    style={{
                                        width:104,
                                        height:76,
                                        resizeMode:'contain'
                                    }}
                                />
                            </HStack>
                        </TouchableOpacity>
                        :
                        <DefButton 
                            text='일반 이사'
                            onPress={()=>pakageChange('일반 이사')} 
                            btnStyle={[styles.buttonStyle]} 
                            textStyle={[styles.btnTextStyle]} 
                        />
                    }
                    
                </Box>
            </ScrollView>
            <BottomButton 
                leftText='이전' 
                rightText='다음' 
                leftonPress={()=>navigation.goBack()} 
                rightDisable={ pakageType != "" ? false : true } 
                rightBtnStyle={ pakageType != "" ? colorSelect.sky : colorSelect.gray }  
                rightonPress={nextNavigation}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
   
    buttonStyle: {
        ...colorSelect.gray,
        marginTop:10
    },
    btnTextStyle: {
        ...fweight.m
    },
    btnOn: {
        width:width - 50,
        padding:20,
        borderRadius:10,
        ...colorSelect.sky
    },
    btnOnTitle: {
        ...fsize.fs18,
        ...fweight.m,
        color:'#fff'
    },
    btnOnTitle2: {
        color:'#fff'
    }
})

export default TwoRoomPackage;