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

const {width} = Dimensions.get("window");

const bigBox = [
    {
        idx: 1,
        boxTitle: '침대 매트리스',
        boxTrash: false,
        boxcount: 1,
        boxValue: '침대 매트리스'
    },
    {
        idx: 2,
        boxTitle: '침대 프레임',
        boxTrash: false,
        boxcount: 1,
        boxValue: '침대 프레임'
    },
    {
        idx: 3,
        boxTitle: '쇼파',
        boxTrash: false,
        boxcount: 1,
        boxValue: '쇼파'
    },
    {
        idx: 4,
        boxTitle: '옷장',
        boxTrash: false,
        boxcount: 1,
        boxValue: '옷장'
    },
    {
        idx: 5,
        boxTitle: '세탁기',
        boxTrash: false,
        boxcount: 1,
        boxValue: '세탁기'
    },
    {
        idx: 6,
        boxTitle: '냉장고',
        boxTrash: false,
        boxcount: 1,
        boxValue: '냉장고'
    },
    {
        idx: 7,
        boxTitle: '김치냉장고',
        boxTrash: false,
        boxcount: 1,
        boxValue: '김치냉장고'
    },
    {
        idx: 8,
        boxTitle: '테이블',
        boxTrash: false,
        boxcount: 1,
        boxValue: '테이블'
    },
    {
        idx: 9,
        boxTitle: '화장대',
        boxTrash: false,
        boxcount: 1,
        boxValue: '화장대'
    },
    {
        idx: 10,
        boxTitle: '책상',
        boxTrash: false,
        boxcount: 1,
        boxValue: '책상'
    },
    {
        idx: 11,
        boxTitle: '책장',
        boxTrash: false,
        boxcount: 1,
        boxValue: '책장'
    },
    {
        idx: 12,
        boxTitle: '서랍장',
        boxTrash: false,
        boxcount: 1,
        boxValue: '서랍장'
    },
    {
        idx: 13,
        boxTitle: '수납장',
        boxTrash: false,
        boxcount: 1,
        boxValue: '수납장'
    },
    {
        idx: 14,
        boxTitle: 'TV_모니터',
        boxTrash: false,
        boxcount: 1,
        boxValue: 'TV_모니터'
    },
    {
        idx: 15,
        boxTitle: '에어컨',
        boxTrash: false,
        boxcount: 1,
        boxValue: '에어컨'
    },
];


const bigBoxVal = [
    {
        value: '침대 매트리스'
    },
    {
        value: '침대 프레임',
    },
    {
        value: '쇼파'
    },
    {
        value: '옷장'
    },
    {
        value: '세탁기'
    },
    {
        value: '냉장고'
    },
    {
        value: '김치냉장고'
    },
    {
        value: '테이블'
    },
    {
        value: '화장대'
    },
    {
        value: '책상'
    },
    {
        value: '책장'
    },
    {
        value: '서랍장'
    },
    {
        value: '수납장'
    },
    {
        value: 'TV_모니터'
    },
    {
        value: '에어컨'
    },
]

const TwoRoomSetting2 = (props) => {

    const {navigation, route} = props;
    const {params} = route;


    const [bigBoxData, setBigBoxData] = useState(bigBox);
    const [bigBoxAdd, setBigBoxAdd] = useState(bigBoxVal);

    const countAdd = (index) => {

        let newData = [...bigBoxData];
        newData[index].boxcount += 1;

        setBigBoxData(newData);

    }

    const countMinus = (index) => {

        let newData = [...bigBoxData];
        newData[index].boxcount -= 1;

        setBigBoxData(newData);

    }

    const trashSelect = (index) => {

        let newData = [...bigBoxData];
        newData[index].boxTrash = !newData[index].boxTrash;

        setBigBoxData(newData);

    }

    const bigBoxAddHandler = () => {

        let data = [...bigBoxData];
        data.push({"boxTitle": "기타", "boxTrash":false, "boxcount":1, "boxValue": ""});

        setBigBoxData(data);

        //인풋용 state값 추가
        let dataVal = [...bigBoxAdd];
        dataVal.push({"value":null});

        setBigBoxAdd(dataVal);

    }

    const bigBoxChange = (index, text) => {

        const value = [...bigBoxAdd];
        value[index].value = text;


        setBigBoxAdd(value);

        const boxVal = [...bigBoxData];
        boxVal[index].boxValue = text;

        setBigBoxData(boxVal);
    }

    const navigateMove = () => {

        let bigSelectBox = [];

        bigBoxData.map((item, index) => {
           
            if(item.boxcount > 0){

                let bigTitle = item.boxValue;
                let bigCount = item.boxcount;
                let bigTrash = item.boxTrash;

                return bigSelectBox.push({"bigTitle":bigTitle, "bigCount":bigCount, "bigTrash":bigTrash});

            }
           
        })


        navigation.navigate("TwoRoomCategory", {
            "houseSize":params.houseSize,
            "houseSizem2":params.houseSizem2,
            "houseStructure":params.houseStructure,
            "houseType":params.houseType,
            "bigSelectBox":bigSelectBox
        })

    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="가정집이사 견적요청" navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text="이사할 큰짐을 선택해 주세요." style={[styles.pageTitle]} />
                    {/* <DefText text="※ 큰 짐의 기준은 2명 이상이 같이 들어야 할 짐입니다." style={[styles.pageSubTitle, {marginTop:10}]} /> */}
                    <DefText text={"추가비용이 발생할 수 있습니다.\n꼼꼼히 선택해주세요."} style={[styles.pageSubTitle, {color:'#000', marginTop:20}]} />
                    <HStack justifyContent={'space-between'} alignItems='center' mt="30px">
                        <DefText text="주요 짐 목록" style={[styles.subTitle]} />
                        <TouchableOpacity onPress={bigBoxAddHandler} style={[styles.addButton]}>
                            <DefText text="추가" style={[fsize.fs14, {color:'#fff'}]} />
                        </TouchableOpacity>
                    </HStack>
                    {
                        bigBoxData.map((item, index) => {
                            return(
                                <VStack key={index} mt="20px">
                                    <HStack justifyContent={'space-between'} alignItems='center'>
                                        <Box width="50%">
                                            <DefText text={item.boxTitle} style={[fweight.m, item.boxcount == 0 && {color:'#DFDFDF'}]} />
                                            {
                                                item.boxTitle == "기타" && 
                                                <DefInput 
                                                    placeholder={"직접입력"}
                                                    inputHeight={40}
                                                    inputStyle={{width:131, borderWidth:1, borderColor:'#ccc', borderRadius:5, marginTop:10}}
                                                    value={bigBoxAdd.value}
                                                    onChangeText={(text)=> bigBoxChange(index, text)}
                                                />
                                            }
                                        </Box>
                                        <TouchableOpacity onPress={()=>trashSelect(index)} style={[styles.trashButton, item.boxTrash && colorSelect.sky]}>
                                            <DefText text={"버릴짐 (1/2 비용 발생)"} style={[styles.trashText, item.boxTrash && {color:'#fff'}]} />
                                        </TouchableOpacity>
                                    </HStack>
                                    <Box >
                                        <HStack justifyContent={ (item.boxTitle == '에어컨' && item.boxcount > 0 && !item.boxTrash) ? 'space-between' : 'flex-end'} alignItems='center' mt='15px' width='100%'>
                                            {
                                                (item.boxTitle == '에어컨' && item.boxcount > 0 && !item.boxTrash) &&
                                                <Box width='60%' >
                                                    <DefText text={"에어컨은 이전만 가능합니다.\n이전 설치를 원하시면 이삿짐 포함 후, 에어컨 설치 업체를 따로 부르시면 됩니다."} style={[styles.defText, {color:'#666'}]} />
                                                </Box>
                                            }
                                            <Box width='35%' alignItems={'flex-end'} justifyContent='flex-end' >
                                                <HStack alignItems={'center'} style={[styles.countBox]} >
                                                    <TouchableOpacity 
                                                        onPress={()=>countMinus(index)}
                                                        style={[styles.countInnerBox]}
                                                        disabled={item.boxcount == 0 ? true : false}
                                                    >
                                                        <Image source={require("../images/cntMinusIcon.png")} style={{width:12, height:3, resizeMode:'contain'}} />
                                                    </TouchableOpacity>
                                                    <Box style={[styles.countInnerBox]}>
                                                        <DefText text={item.boxcount} style={[styles.countInnerText]} />
                                                    </Box>
                                                    <TouchableOpacity 
                                                        onPress={()=>countAdd(index)}
                                                        style={[styles.countInnerBox]}
                                                    >
                                                        <Image source={require("../images/cntPlusIcon.png")} style={{width:12, height:12, resizeMode:'contain'}} />
                                                    </TouchableOpacity>
                                                </HStack>
                                            </Box>
                                        </HStack>
                                        
                                    </Box>
                                    
                                    {
                                        (item.boxTrash &&
                                        item.boxcount > 0) &&
                                        <DefText text={item.boxTitle + "을(를) 1층 바깥으로 이동해 드립니다."} style={[styles.defText, {marginTop:15}]} />
                                    }
                                </VStack>
                            )
                        })
                    }
                </Box>
                <BottomButton leftText='이전' rightText='다음' leftonPress={() => navigation.goBack()} rightonPress={navigateMove} />
            </ScrollView>
           
        </Box>
    );
};

const styles = StyleSheet.create({
    pageTitle: {
        ...fsize.fs18,
        ...fweight.b
    },
    pageSubTitle: {
        ...fsize.fs14,
        color:'#FF5050'
    },
    subTitle: {
        ...fsize.fs16,
        ...fweight.b
    },
    addButton: {
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        backgroundColor:'#0195ff'
    },
    countBox: {
        width:100,
        height:34,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#DFDFDF'
    },
    countInnerBox: {
        width: 100 / 3,
        height:34,
        justifyContent:'center',
        alignItems:'center'
    },
    countInnerText: {
        ...fweight.m
    },
    trashButton: {
        paddingHorizontal:10,
        height: 32,
        borderRadius:5,
        ...colorSelect.gray,
        alignItems:'center',
        justifyContent:'center'
    },
    trashText: {
        ...fsize.fs12,
        color:'#666'
    },
    defText: {
        ...fsize.fs14,
        color: '#aaa'
    },
})

export default TwoRoomSetting2;