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

const SmallMoveStartTool = (props) => {

    const {navigation, route} = props;
    const {params} = route;

    //console.log('params', params);

    const [startMoveTool, setStartMoveTool] = useState('');
    const [floorInfo, setFloorInfo] = useState("");
    const [rightDisalbe, setRightDisalbe] = useState(true);

    const startMoveToolHandler = (cate) => {
        setStartMoveTool(cate);
    }

    const floorTextChange = (text) => {
        setFloorInfo(text);
    }

    const nextNavigation = () => {
        //console.log('ㄱㄱ');
        navigation.navigate("SmallMoveStartAddress", {"item":params.item, "moveCategory":params.moveCategory, "pakageType":params.pakageType, "personStatus":params.personStatus, "keepStatus":params.keepStatus, "startMoveTool":startMoveTool, "startFloor":floorInfo});
    }

    useEffect(()=> {
        if(startMoveTool != ""){
            if(startMoveTool != "계단"){
                setRightDisalbe(false);
            }else{
                if(floorInfo != ""){
                    setRightDisalbe(false);
                }else{
                    setRightDisalbe(true);
                }
            }
        }
    }, [startMoveTool, floorInfo])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='소형이사 (원룸이사) 견적요청' />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text={"출발지의 이삿짐을 어떻게 옮길까요?"} style={[styles.pageTitle]} />
                    <DefButton 
                        onPress={()=>startMoveToolHandler('계단')}
                        text='계단'
                        btnStyle={[styles.buttonStyle, startMoveTool == '계단' ? colorSelect.sky : colorSelect.gray]}
                        textStyle={[styles.btnTextStyle, startMoveTool == '계단' ? {color:'#fff'} : {color:'#000'}]} 
                    />
                    {
                        startMoveTool == '계단' &&
                        <Box mt='20px'>
                            <DefText text='층수' style={[styles.labelText]} />
                            <Box>
                                <DefInput 
                                    placeholder={'층수를 입력하세요'}
                                    value={floorInfo}
                                    onChangeText={floorTextChange}
                                    keyboardType='number-pad'
                                />
                                <Box position='absolute' bottom='15px' right='0'>
                                    <DefText text='층' style={[styles.labelText]}  />
                                </Box>
                            </Box>
                        </Box>
                    }
                    <DefButton 
                        onPress={()=>startMoveToolHandler('엘리베이터')} 
                        text='엘리베이터' 
                        btnStyle={[styles.buttonStyle, startMoveTool == '엘리베이터' ? colorSelect.sky : colorSelect.gray]} 
                        textStyle={[styles.btnTextStyle, startMoveTool == '엘리베이터' ? {color:'#fff'} : {color:'#000'}]} 
                    />
                    {
                        startMoveTool == '사다리차' ?
                        <TouchableOpacity activeOpacity={1} onPress={()=>startMoveToolHandler('사다리차')} style={[styles.typeButtonOn, {marginTop:10}]}>
                            <Box>
                                <DefText text='사다리차' style={[styles.typeButtonText, styles.typeButtonOnText1]} />
                                <DefText text={'사다리차는 4층 이상 엘리베이터가 없거나, 엘리베이터로 운반이 어려운 짐이 있을 때 필요합니다'} style={[styles.typeButtonOnText2]} />
                            </Box>
                        </TouchableOpacity>
                        :
                        <DefButton 
                            onPress={()=>startMoveToolHandler('사다리차')} 
                            text='사다리차' 
                            btnStyle={[styles.buttonStyle, startMoveTool == '사다리차' ? colorSelect.sky : colorSelect.gray]} 
                            textStyle={[styles.btnTextStyle, startMoveTool == '사다리차' ? {color:'#fff'} : {color:'#000'}]} 
                        />
                    }
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
        marginBottom:10
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
})

export default SmallMoveStartTool;