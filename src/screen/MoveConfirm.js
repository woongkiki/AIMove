import React, {useEffect, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal, CheckIcon } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get("window");

const dummy = [
    {
        "idx":1,
        "icon":"https://cnj01.cafe24.com/images/bigBoxIcon.png",
        "product":"에어컨",
        "count":2,
        "trash":false,
        "itemCheck":true
    },
    {
        "idx":2,
        "icon":"https://cnj01.cafe24.com/images/bigBoxIcon.png",
        "product":"냉장고",
        "count":1,
        "trash":false,
        "itemCheck":true
    }
];

const dummyCheck = [1,2];

const MoveConfirm = (props) => {

    const {navigation} = props;

    const [dummyData, setDummyData] = useState(dummy);
    const [selectItem, setSelectItem] = useState(""); //선택
    const [trashItem, setTrashItem] = useState("");

    const productSelectHandler = (index) => {
        console.log("선택한 상품", index);
        
        let newCheck = {...dummyData[index]};
        newCheck.itemCheck = !newCheck.itemCheck;

        let orCheck = [...dummyData];
        orCheck[index] = newCheck;

        setDummyData(orCheck);
    }

    //버릴짐으로 선택..
    const trashSelect = (index) => {

        let newDummy = {...dummyData[index]}; //선택한 이삿짐 object
        newDummy.trash = !newDummy.trash; //선택한 이삿짐의 버림상태를 변경
        
        let orDummy = [...dummyData]; //원래 이삿짐 배열 복사
        orDummy[index] = newDummy; //복사한 배열의 선택한 인덱스 값의 object를 위 수정사항적용하여 변경

        setDummyData(orDummy); //state값 변경
    }

    //카운트 증가
    const productPlus = (index) => {

        let newProduct = {...dummyData[index]};
        newProduct.count += 1;

        let orPrduct = [...dummyData];
        orPrduct[index] = newProduct;

        setDummyData(orPrduct);
    }

    //카운트 감소
    const productMinus = (index) => {

        let newProduct = {...dummyData[index]};
        
        if(newProduct.count == 1){
            ToastMessage( newProduct.product + '의 최소수량은 1개 입니다.');
            return false;
        }else{
            newProduct.count -= 1;
        }

        let orPrduct = [...dummyData];
        orPrduct[index] = newProduct;

        setDummyData(orPrduct);

    }

    //다음화면
    const nextNavigation = () => {
        const arrayInfo = dummyData.filter((e)=>e.itemCheck ===! false);

        if(arrayInfo.length == 0){
            ToastMessage("이삿짐으로 선택된 상품이 업습니다\n다시 확인하고 진행하세요.");
            return false;
        }

        navigation.navigate("SmallMoveCategory", {"item":arrayInfo});
    }

    useEffect(()=> {
        console.log("dummyData:::", dummyData);
    }, [dummyData])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='소형이사 (원룸이사) 견적요청' />
            <ScrollView>
                <Box>
                    <Image
                        source={require("../images/ImageAiSample.png")}
                        alt='샘플'
                        style={{
                            width:width,
                            height: width * 1.36,
                            resizeMode:'stretch'
                        }}
                    />
                </Box>
                <Box p='25px'>
                    <DefText 
                        text={"사진에 인식된 이삿짐 목록을 확인해 주세요."}
                        style={[styles.defText]}
                    />
                    <DefText 
                        text={"AI가 이삿짐을 네모 박스로 정확히 지정을 못해도,\n이사 견적과는 상관 없으니 신경 안 쓰셔도 됩니다."}
                        style={[styles.defText, {marginTop:10}]}
                    />
                    <DefText 
                        text={"중복된 물품은 없는지, 놓친 이삿짐은 없는지 아래 목록을 통해 수량을 다시 확인해 주세요."}
                        style={[styles.defText, {marginTop:10}]}
                    />

                    <Box>
                        {
                            dummyData.map((item, index) => {
                                return(
                                    <Box key={index}>
                                        <HStack alignItems='flex-start' justifyContent={'space-between'} mt={'40px'}>
                                            <TouchableOpacity onPress={()=>productSelectHandler(index)} style={{paddingTop:5}}>
                                                <HStack>
                                                    <Box style={[styles.checkBox, item.itemCheck ? [colorSelect.sky, {borderWidth:0}] : {backgroundColor:'#fff', borderWidth:1} ]}>
                                                        {
                                                            item.itemCheck &&
                                                            <Image source={require("../images/checkIcon.png")} style={{width:10, height:7}} />
                                                        }
                                                    </Box>
                                                    <HStack ml='15px' alignItems={'center'}>
                                                        <Image source={{uri:item.icon}} alt={item.product} style={{width:22, height:23, resizeMode:'contain'}} />
                                                        <DefText text={item.product} style={[styles.productText, item.itemCheck ? {color:'#000'} : {color:'#aaa'}]} />
                                                    </HStack>
                                                </HStack>
                                            </TouchableOpacity>
                                            <VStack alignItems={'flex-end'}>
                                                <TouchableOpacity disabled={ item.itemCheck ? false : true } onPress={()=>trashSelect(index)} style={[styles.trashButton, item.trash ? colorSelect.sky : {backgroundColor:'#DFDFDF'}, !item.itemCheck && {backgroundColor:'#dfdfdf'} ]}>
                                                    <DefText text='버릴짐 (1/2 비용발생)' style={[styles.trashButtonText]} />
                                                </TouchableOpacity>
                                                <HStack alignItems='center' style={[styles.countBox]} mt='10px' backgroundColor={ !item.itemCheck ? '#eee' : '#fff' }>
                                                    <TouchableOpacity disabled={ item.itemCheck ? false : true } onPress={()=>productMinus(index)} style={[styles.countInnerBox]}>
                                                        <Image source={require("../images/cntMinusIcon.png")} style={{width:12, height:3, resizeMode:'contain'}} />
                                                    </TouchableOpacity>
                                                    <Box style={[styles.countInnerBox]}>
                                                        <DefText text={item.count} style={[styles.countInnerText]} />
                                                    </Box>
                                                    <TouchableOpacity disabled={ item.itemCheck ? false : true } onPress={()=>productPlus(index)} style={[styles.countInnerBox]}>
                                                        <Image source={require("../images/cntPlusIcon.png")} style={{width:12, height:12, resizeMode:'contain'}} />
                                                    </TouchableOpacity>
                                                </HStack>
                                            </VStack>
                                        </HStack>
                                        {
                                            item.trash &&
                                            item.itemCheck &&
                                            <DefText text={"선택한 이삿짐 (" + item.product + ")을 버릴수 있게 1층으로\n옮겨드립니다."} style={[styles.defText, {marginTop:15}]} />
                                        }
                                    </Box>
                                )
                            })
                        }
                    </Box>
                    
                </Box>
                <BottomButton leftText='이전' rightText='다음' leftonPress={()=>navigation.goBack()} rightonPress={nextNavigation} boxStyle={{marginTop:50}} />
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    defText: {
        ...fsize.fs14,
        color: '#aaa'
    },
    checkBox: {
        width:20,
        height:20,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#DFDFDF',
        backgroundColor:"#fff"
    },
    productText: {
        ...fweight.m,
        marginLeft:10,
    },
    trashButton: {
        height:32,
        paddingHorizontal:15,
        backgroundColor:'#DFDFDF',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    },
    trashButtonText: {
        ...fsize.fs12,
        color:'#FFFFFF'
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
    }
})

export default MoveConfirm;