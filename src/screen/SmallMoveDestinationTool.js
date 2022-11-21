import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal, Select } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get("window");

const SmallMoveDestinationTool = (props) => {

    const {navigation, route} = props;
    const {params} = route;

    console.log("도착지 이삿짐 옮김", params);

    const [destinationMoveTool, setDestinationMoveTool] = useState('');
    const [floorInfo, setFloorInfo] = useState("");
    const [floorStatus, setFloorStatus] = useState("");
    const [rightDisalbe, setRightDisalbe] = useState(true);

    //이삿짐 옮길 때 어디로??
    const destinationMoveToolHandler = (cate) => {
        setDestinationMoveTool(cate);
    }

    //계단선택시 층
    const floorTextChange = (text) => {
        setFloorInfo(text);
    }

    useEffect(()=> {
        if(destinationMoveTool != ""){
            if(destinationMoveTool != "계단"){
                setRightDisalbe(false);
            }else{
                if(floorInfo != ""){
                    setRightDisalbe(false);
                }else{
                    setRightDisalbe(true);
                }
            }
        }
    }, [destinationMoveTool, floorInfo]);

    const nextNavigation = () => {
        //console.log('ㄱㄱ');
        navigation.navigate("SmallMoveDestinationAddress", {"bidx":params.bidx, "moveCategory":params.moveCategory, "pakageType":params.pakageType, "personStatus":params.personStatus, "keepStatus":params.keepStatus, "startMoveTool":params.startMoveTool, "startFloor":params.startFloor, "startFloorStatus":params.startFloorStatus, "startAddress": params.startAddress, "startLat": params.startLat, "startLon":params.startLon, "destinationMoveTool":destinationMoveTool, "destinationFloor":floorInfo, 'destinationFloorStatus':floorStatus, 'moveDateKeep':params.moveDateKeep, 'moveInKeep':params.moveInKeep});
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='소형이사 (원룸이사) 견적요청' />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text={"도착지의 이삿짐을 어떻게 옮길까요?"} style={[styles.pageTitle]} />
                    <DefButton 
                        onPress={()=>destinationMoveToolHandler('계단')}
                        text='계단'
                        btnStyle={[styles.buttonStyle, destinationMoveTool == '계단' ? colorSelect.sky : colorSelect.gray]}
                        textStyle={[styles.btnTextStyle, destinationMoveTool == '계단' ? {color:'#fff'} : {color:'#000'}]} 
                    />
                    {
                        destinationMoveTool == '계단' &&
                        <Box mt='20px'>
                            <DefText text='층수' style={[styles.labelText]} />
                            <Box>
                                <HStack width={width-50} justifyContent={'space-between'}>
                                    <Select
                                        selectedValue={floorStatus}
                                        width={ (width - 50) * 0.3 }
                                        height='50px'
                                        fontSize={14}
                                        borderWidth={0}
                                        backgroundColor={'#fff'}
                                        borderBottomWidth={1}
                                        borderBottomColor='#BEBEBE'
                                        onValueChange={(val) => setFloorStatus(val)}
                                        placeholder='선택'
                                    >
                                        <Select.Item label='지상' value='지상' />
                                        <Select.Item label='지하' value='지하' />
                                    </Select>
                                    <Box width={(width - 50) * 0.65}>
                                        <DefInput 
                                            placeholder={'층수를 입력하세요'}
                                            value={floorInfo}
                                            onChangeText={floorTextChange}
                                            keyboardType='number-pad'
                                            disabled={ floorStatus != "" ? true : false}
                                        />
                                    </Box>
                                </HStack>
                                <Box position='absolute' bottom='15px' right='0'>
                                    <DefText text='층' style={[styles.labelText]}  />
                                </Box>
                            </Box>
                        </Box>
                    }
                    <DefButton 
                        onPress={()=>destinationMoveToolHandler('엘리베이터')} 
                        text='엘리베이터' 
                        btnStyle={[styles.buttonStyle, destinationMoveTool == '엘리베이터' ? colorSelect.sky : colorSelect.gray]} 
                        textStyle={[styles.btnTextStyle, destinationMoveTool == '엘리베이터' ? {color:'#fff'} : {color:'#000'}]} 
                    />
                    {
                        destinationMoveTool == '사다리차' ?
                        <TouchableOpacity activeOpacity={1} onPress={()=>startMoveToolHandler('사다리차')} style={[styles.typeButtonOn, {marginTop:10}]}>
                            <Box>
                                <DefText text='사다리차' style={[styles.typeButtonText, styles.typeButtonOnText1]} />
                                <DefText text={'사다리차는 4층 이상 엘리베이터가 없거나, 엘리베이터로 운반이 어려운 짐이 있을 때 필요합니다'} style={[styles.typeButtonOnText2]} />
                            </Box>
                        </TouchableOpacity>
                        :
                        <DefButton 
                            onPress={()=>destinationMoveToolHandler('사다리차')} 
                            text='사다리차' 
                            btnStyle={[styles.buttonStyle, destinationMoveTool == '사다리차' ? colorSelect.sky : colorSelect.gray]} 
                            textStyle={[styles.btnTextStyle, destinationMoveTool == '사다리차' ? {color:'#fff'} : {color:'#000'}]} 
                        />
                    }
                    {
                        destinationMoveTool == '사다리차' &&
                        <DefText text={"사다리차 비용은 이사 견적에 포함되지 않으며\n현장에서 결제하시면 됩니다."} style={[{marginTop:20, color:'#666'}, fsize.fs14]} />
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

export default SmallMoveDestinationTool;