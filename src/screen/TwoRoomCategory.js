import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get("window");

const TwoRoomCategory = (props) => {


    const {navigation, route } = props;
    const {params} = route;

    console.log("params", params);

    const [moveCategory, setMoveCategory] = useState("");
    const moveCategoryHandler = (category) => { //카테고리 선택
        setMoveCategory(category);
    }

    const nextNavigation = () => {
        console.log("123123");

        navigation.navigate("TwoRoomPackage", {
            "houseSize":params.houseSize,
            "houseSizem2":params.houseSizem2,
            "houseStructure":params.houseStructure,
            "houseType":params.houseType,
            "bigSelectBox":params.bigSelectBox,
            "moveCategory":moveCategory
        })
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='가정집 이사 견적요청'  />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text={"고객님께 맞는 이사업체를 추천드립니다!"} style={[styles.pageTitle]} />
                    <VStack>
                        <DefText text="어떤 이사업체를 찾으시나요?" />
                        <DefButton 
                            onPress={()=>moveCategoryHandler('이사 비용이 착한 업체')} 
                            text='이사 비용이 착한 업체' 
                            btnStyle={[styles.buttonStyle, moveCategory == '이사 비용이 착한 업체' ? colorSelect.sky : colorSelect.gray]} 
                            textStyle={[styles.btnTextStyle, moveCategory == '이사 비용이 착한 업체' ? {color:'#fff'} : {color:'#000'}]} 
                        />
                        <DefButton 
                            onPress={()=>moveCategoryHandler('가격은 적당, 서비스가 좋은 업체')}
                            text='가격은 적당, 서비스가 좋은 업체'
                            btnStyle={[styles.buttonStyle, moveCategory == '가격은 적당, 서비스가 좋은 업체' ? colorSelect.sky : colorSelect.gray]}
                            textStyle={[styles.btnTextStyle, moveCategory == '가격은 적당, 서비스가 좋은 업체' ? {color:'#fff'} : {color:'#000'}]} 
                        />
                        <DefButton 
                            onPress={()=>moveCategoryHandler('서비스가 좋은 업체')} 
                            text='서비스가 좋은 업체' 
                            btnStyle={[styles.buttonStyle, moveCategory == '서비스가 좋은 업체' ? colorSelect.sky : colorSelect.gray]} 
                            textStyle={[styles.btnTextStyle, moveCategory == '서비스가 좋은 업체' ? {color:'#fff'} : {color:'#000'}]} 
                        />
                    </VStack>
                </Box>
            </ScrollView>
            <BottomButton 
                leftText='이전' 
                rightText='다음' 
                leftonPress={()=>navigation.goBack()} 
                rightDisable={ moveCategory != "" ? false : true } 
                rightBtnStyle={ moveCategory != "" ? colorSelect.sky : colorSelect.gray }  
                rightonPress={nextNavigation}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    pageTitle:{
        ...fsize.fs18,
        ...fweight.b,
        marginBottom: 25
    },
    buttonStyle: {
        ...colorSelect.gray,
        marginTop:10
    },
    btnTextStyle: {
        ...fweight.m
    }
})

export default TwoRoomCategory;