import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import { numberFormat } from '../common/DataFunction';
import { BASE_URL } from '../Utils/APIConstant';

const {width, height} = Dimensions.get("window");
const buttonWidth = (width - 90) * 0.48;

const MyReview = (props) => {

    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="내가 작성한 후기" navigation={navigation} />
            <ScrollView>
                <Box py='20px' px='25px'>
                    <Box style={[styles.reviewBox]}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <HStack alignItems={'center'}>
                                <DefText text="홍길동" style={[styles.expertName]} />
                                <DefText text=" 전문가" style={[styles.expertJob]} />
                            </HStack>
                            <DefText text="2022.06.01" style={[styles.reviewDate]} />
                        </HStack>
                        <Image
                            source={{uri:BASE_URL + "/images/reviewScore5.png",}}
                            alt='별점'
                            style={[
                                {
                                    width: 82,
                                    height: 13,
                                    resizeMode:'stretch',
                                    marginVertical:10
                                }
                            ]}
                        />
                        <DefText text={"뒷처리까지 깔끔히 해주셔서 다음번에도\n이용하고 싶어요"} style={[styles.reviewContent]} />
                        <HStack justifyContent={'space-between'} alignItems='center' mt='20px'>
                            <TouchableOpacity style={[styles.reviewBoxBtn, [colorSelect.gray]]}>
                                <DefText text="업체정보" style={[styles.reviewBoxBtnText]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.reviewBoxBtn, [colorSelect.sky]]}>
                                <DefText text="후기수정" style={[styles.reviewBoxBtnText, {color:'#fff'}]}  />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    reviewBox: {
        padding:20,
        borderRadius:16,
        borderWidth:1,
        borderColor:'#AEBFCF'
    },
    expertName: {
        ...fweight.b,
    },
    expertJob: {
        ...fweight.b,
        color:'#979797'
    },
    reviewDate: {
        ...fsize.fs12,
        color:'#979797'
    },
    reviewContent: {
        ...fsize.fs13,
    },
    reviewBoxBtn: {
        width: buttonWidth,
        height: 40,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
    },
    reviewBoxBtnText: {
        ...fsize.fs14,
        ...fweight.m
    }
})

export default MyReview;