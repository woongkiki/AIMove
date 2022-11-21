import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get("window");

const SmallMoveHelp = (props) => {

    const {navigation, route} = props;
    const {params} = route;

    const [selectCate, setSelectCate] = useState('');
    const [rightDisalbe, setRightDisalbe] = useState(true);

    const selectCateHandler = (cate) => {
        setSelectCate(cate);
    }
    console.log('도와줄인력::',params);

    useEffect(()=> {
        if(selectCate != ""){
            setRightDisalbe(false);
        }
    }, [selectCate]);

    const nextNavigation = () => {
        navigation.navigate("SmallMoveConfirm", {"bidx":params.bidx, "moveCategory":params.moveCategory, "pakageType":params.pakageType, "personStatus":params.personStatus, "keepStatus":params.keepStatus, "startMoveTool":params.startMoveTool, "startFloor":params.startFloor, "startFloorStatus":params.startFloorStatus, "startAddress": params.startAddress, "startLat": params.startLat, "startLon": params.startLon, "destinationMoveTool":params.destinationMoveTool, "destinationFloor":params.destinationFloor, "destinationAddress":params.destinationAddress, 'destinationFloorStatus':params.destinationFloorStatus, "destinationLat": params.destinationLat, "destinationLon": params.destinationLon, "moveDate":params.moveDate, "moveDatetime":params.moveDatetime, 'moveHelp':selectCate, 'moveDateKeep':params.moveDateKeep, 'moveInKeep':params.moveInKeep });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='소형이사 (원룸이사) 견적요청' />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text={"이사할 때 짐을 옮겨 줄 사람이 있나요?"} style={[styles.pageTitle]} />
                    <HStack mt='20px' mb='20px'>
                        <DefText text={"※ "} style={[styles.pageSubTitle]} />
                        <DefText text={"이 질문은 이삿짐 비용과 관련이 있으므로\n중요합니다."} style={[styles.pageSubTitle]} />
                    </HStack>
                    <DefButton 
                        text='예, 있습니다.'
                        btnStyle={[styles.buttonStyle, selectCate == '예' && colorSelect.sky]}
                        textStyle={[styles.btnTextStyle, selectCate == '예' && {color:'#fff'} ]}
                        onPress={()=>selectCateHandler('예')}
                    />
                    <DefButton 
                        text='아니오, 없습니다.'
                        btnStyle={[styles.buttonStyle, selectCate == '아니오' && colorSelect.sky]}
                        textStyle={[styles.btnTextStyle, selectCate == '아니오' && {color:'#fff'}]}
                        onPress={()=>selectCateHandler('아니오')}
                    />
                </Box>
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
    },
    pageSubTitle: {
        ...fweight.b,
        color:'#FF5050'
    },
    buttonStyle: {
        ...colorSelect.gray,
        marginTop:10
    },
    btnTextStyle: {
        ...fweight.m
    },
    labelText: {
        ...fsize.fs15,
        ...fweight.b
    },
})

export default SmallMoveHelp;