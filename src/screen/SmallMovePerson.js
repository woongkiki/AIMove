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

const SmallMovePerson = (props) => {

    const {navigation, route} = props;
    const {params} = route;

    console.log('params2',params);
    const [personStatus, setPersonStatus] = useState("");

    const personCategoryHandler = (cate) => {
        setPersonStatus(cate);
    }

    const nextNavigation = () => {
        //console.log("다음으로....")
        navigation.navigate("SmallMoveKeep", {
            "bidx":params.bidx,
            "moveCategory":params.moveCategory,
            "pakageType":params.pakageType,
            "personStatus":personStatus
        })
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle='소형이사 (원룸이사) 견적요청' navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text={"주방과 욕실 포장과 정리 인력이 필요하신가요?"} style={[styles.pageTitle]} />
                    <VStack>
                        <DefButton 
                            onPress={()=>personCategoryHandler('예')} 
                            text='예 필요합니다.' 
                            btnStyle={[styles.buttonStyle, personStatus == '예' ? colorSelect.sky : colorSelect.gray]} 
                            textStyle={[styles.btnTextStyle, personStatus == '예' ? {color:'#fff'} : {color:'#000'}]} 
                        />
                        <DefButton 
                            onPress={()=>personCategoryHandler('아니요')}
                            text='아니요 필요없습니다.'
                            btnStyle={[styles.buttonStyle, personStatus == '아니요' ? colorSelect.sky : colorSelect.gray]}
                            textStyle={[styles.btnTextStyle, personStatus == '아니요' ? {color:'#fff'} : {color:'#000'}]} 
                        />
                    </VStack>
                </Box>
            </ScrollView>
            <BottomButton 
                leftText='이전' 
                rightText='다음' 
                leftonPress={()=>navigation.goBack()} 
                rightDisable={ personStatus != "" ? false : true } 
                rightBtnStyle={ personStatus != "" ? colorSelect.sky : colorSelect.gray }  
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

export default SmallMovePerson;