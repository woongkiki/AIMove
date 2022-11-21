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

const houseType = ["주택", "연립 / 빌라", "오피스텔", "아파트", "기타"];
const defaultType = [
    {
        idx:1,
        title:'방',
        count:1,
        value: "방",
        stat:""
    },
    {
        idx:2,
        title:'거실',
        count:1,
        value: "거실",
        stat:""
    },
    {
        idx:3,
        title:'욕실',
        count:1,
        value: "욕실",
        stat:""
    },
    {
        idx:4,
        title:'주방',
        count:1,
        value: "주방",
        stat:""
    },
    {
        idx:5,
        title:'발코니',
        count:1,
        value: "발코니",
        stat:""
    }
]
const {width} = Dimensions.get("window");



const TwoRoomSetting = (props) => {

    const {navigation, userInfo} = props;

    const [houseTypeSelect, setHouseTypeSelect] = useState("");
    const [houseInfo, setHouseInfo] = useState(defaultType);
    const [selectHouseInfo, setSelectHouseInfo] = useState([]);
    const [houseInfoInput, setHouseInfoInput] = useState([{value:'방'},{value:'거실'},{value:'욕실'},{value:'주방'},{value:'발코니'}]); 

    const [houseSize, setHouseSize] = useState("");
    const [houseSizem2, setHouseSizem2] = useState("");


    const houseSizeChange = (text) => {
        setHouseSize(text);

        if(text != ""){
            let size = parseInt(text);
            size = size * 3.305785;
            size = size.toFixed(5);
    
            setHouseSizem2(size.toString());
        }else{
            setHouseSizem2("");
        }

    }

    const houseM2SizeChange = (text) => {
        setHouseSizem2(text);

        if(text != ""){
            let size = parseInt(text);
            size = size / 3.305785;
            size = Math.round(size);

            setHouseSize(size.toString());
            //console.log(size);
        }else{
            setHouseSize("");
        }

    }

    const houseInputAdd = () => {


        let houseInfoCopy = [...houseInfo];
        houseInfoCopy.push({"title":"기타", "count":1, "value":""});
        setHouseInfo(houseInfoCopy);


        const values = [...houseInfoInput];
        values.push({value:null});
        setHouseInfoInput(values);

    }

    const houseInputChange = (idx, text, item) => {

      
        //houseInfoInput[idx].value = text;

        console.log("item", item);
        console.log("houseInfo", houseInfo);

        let idxOf = houseInfo.indexOf(item);

        console.log("idxOf::", idxOf);
         const values = [...houseInfo];
         console.log("values", values[idxOf]);
         
         values[idxOf].value = text;

        // console.log("houseInfoInput",houseInfoInput);

        // //기타 바꾸기
        // const houseInfoTitle = [...houseInfo];
        // houseInfo[idx].value = text;

         setHouseInfo(values);
    }

    const countPlus = (idx, item) => {

        let newProduct = {...houseInfo[idx]};
        newProduct.count += 1;

        let orPrduct = [...houseInfo];
        orPrduct[idx] = newProduct;

        

        let idxOf = houseInfo.indexOf(item);
        let adds = idxOf + 1;

        // console.log(orPrduct);
        orPrduct.splice(idxOf + item.count, 0, {"title":item.value + (item.count + 1), "count":1, "value":item.value + (item.count + 1), "stat":"N"})

        console.log("orPrduct", orPrduct);

         setHouseInfo(orPrduct);
    }

    useEffect(() => {
        console.log(houseInfo);
    }, [houseInfo])


    const countMinus = (idx) => {

        let newProduct = {...houseInfo[idx]};
        newProduct.count -= 1;

        let orPrduct = [...houseInfo];
        orPrduct[idx] = newProduct;

        setHouseInfo(orPrduct);

    }


    const navigateMove = () => {
        if(houseTypeSelect == ""){
            ToastMessage("집 형태를 선택하세요.");
            return false;
        }

        if(houseSize == ""){
            ToastMessage("집 평수를 입력하세요.");
            return false;
        }

        console.log("structure::", houseInfo);

        let houseInfoArr = [];

        houseInfo.map((item, index) => {

            if(item.count > 0){
                let st_title = item.value;
                let st_count = item.count;

                return houseInfoArr.push({"title":st_title, "count":st_count, "images":[]});

            }
            
        })
        setSelectHouseInfo(houseInfoArr);

        navigation.navigate("TwoRoomSetting2", {"houseType":houseTypeSelect, "houseStructure":houseInfoArr, "houseSize":houseSize, "houseSizem2":houseSizem2});
    }


    useEffect(()=> {
        console.log("selectHouseInfo",selectHouseInfo);
    }, [selectHouseInfo])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="가정집이사 견적요청" navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text="이사할 건물의 유형 및 특징을 각각 선택해주세요." style={[styles.pageTitle]} />
                    <Box mt="20px">
                        <DefText text="집 형태" style={[styles.subTitle]} />
                        {
                            houseType != "" && 
                            <HStack flexWrap={'wrap'}>
                            {
                                houseType.map((item, index) => {
                                    return(
                                        <TouchableOpacity 
                                            key={index} 
                                            style={[
                                                styles.houseTypeButton, 
                                                (index + 1) % 3 != 0 ? {marginRight:(width-50) * 0.02} : {marginRight:0},
                                                houseTypeSelect == item && {backgroundColor:"#0195ff"}
                                            ]}
                                            onPress={()=>setHouseTypeSelect(item)}
                                        >
                                            <DefText text={item} style={[styles.houseTypeButtonText, houseTypeSelect == item && {color:"#fff"}]} />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                           
                            </HStack>
                        }
                    </Box>
                    <Box mt="30px">
                        <HStack justifyContent={'space-between'} alignItems='center'>
                            <DefText text="내집 구조" style={[styles.subTitle]} />
                            <TouchableOpacity onPress={houseInputAdd} style={[styles.addButton]}>
                                <DefText text="추가" style={[fsize.fs14, {color:'#fff'}]} />
                            </TouchableOpacity>
                        </HStack>
                        {
                            houseInfo.map((item, index) => {

                                if(item.stat != "N"){
                                    return(
                                        <Box key={index} mt="10px">
                                            <HStack alignItems={'center'} justifyContent='space-between'>
                                                <VStack>
                                                    <DefText text={item.title} style={[styles.houseInfoTitle, item.count == 0 && {color:'#DFDFDF'}]} />
                                                    {
                                                        item.title == "기타" &&
                                                        <DefInput 
                                                            placeholder={"직접입력"}
                                                            inputHeight={40}
                                                            inputStyle={{width:131, borderWidth:1, borderColor:'#ccc', borderRadius:5, marginTop:10}}
                                                            value={item.value != "" ? item.value : houseInfoInput.value}
                                                            onChangeText={(text)=> houseInputChange(index, text, item)}
                                                    />
                                                    }
                                                </VStack>
                                                <HStack alignItems={'center'} style={[styles.countBox]}>
                                                    <TouchableOpacity 
                                                        onPress={()=>countMinus(index)} 
                                                        style={[styles.countInnerBox]}
                                                        disabled={item.count == 0 ? true : false}
                                                    >
                                                        <Image source={require("../images/cntMinusIcon.png")} style={{width:12, height:3, resizeMode:'contain'}} />
                                                    </TouchableOpacity>
                                                    <Box style={[styles.countInnerBox]}>
                                                        <DefText text={item.count} style={[styles.countInnerText]} />
                                                    </Box>
                                                    <TouchableOpacity 
                                                        onPress={()=>countPlus(index, item)} 
                                                        style={[styles.countInnerBox]}
                                                    >
                                                        <Image source={require("../images/cntPlusIcon.png")} style={{width:12, height:12, resizeMode:'contain'}} />
                                                    </TouchableOpacity>
                                                </HStack>
                                            </HStack>
                                        </Box>
                                    )
                                }
                            })
                        }
                    </Box>
                    <Box mt="30px">
                        <DefText text="평수" style={[styles.subTitle]} />
                        <HStack justifyContent={'space-between'}>
                            <Box width={(width - 50) * 0.47}>
                                <DefInput 
                                    placeholder={"평수를 입력하세요."}
                                    value={houseSize}
                                    onChangeText={houseSizeChange}
                                    keyboardType='number-pad'
                                />
                                <Box position={'absolute'} top='0' right='0' height='50px' alignItems={'center'} justifyContent='center'>
                                    <DefText text={"평"} style={[fsize.fs14]} />
                                </Box>
                            </Box>
                            <Box width={(width - 50) * 0.47}>
                                <DefInput 
                                    placeholder={"평수를 입력하세요."}
                                    value={houseSizem2}
                                    onChangeText={houseM2SizeChange}
                                    keyboardType='number-pad'
                                />
                                <Box position={'absolute'} top='0' right='0' height='50px' alignItems={'center'} justifyContent='center'>
                                    <DefText text={"㎡"} style={[fsize.fs14]} />
                                </Box>
                            </Box>
                        </HStack>
                        
                    </Box>
                </Box>
            </ScrollView>
            <BottomButton leftText='이전' rightText='다음' leftonPress={ () => navigation.goBack()} rightonPress={navigateMove} />
        </Box>
    );
};

const styles = StyleSheet.create({
    addButton: {
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:10,
        backgroundColor:'#0195ff'
    },
    pageTitle: {
        ...fsize.fs18,
        ...fweight.b
    },
    subTitle: {
        ...fsize.fs16,
        ...fweight.b
    },
    houseTypeButton: {
        width: (width-50) * 0.32,
        height: 36,
        borderRadius:10,
        backgroundColor:'#DFDFDF',
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
    },
    houseTypeButtonText: {
        ...fsize.fs14
    },
    houseInfoTitle: {
        ...fweight.m
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

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    })
)(TwoRoomSetting);