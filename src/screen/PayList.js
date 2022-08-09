import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import { numberFormat } from '../common/DataFunction';

const {width, height} = Dimensions.get("window");

const PayList = (props) => {

    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#F8F9FA'>
            <SubHeader headerTitle="결제 내역" navigation={navigation} />
            <ScrollView>
                <Box>
                    <TouchableOpacity style={[styles.payButton]}>
                        <HStack alignItems={'center'} justifyContent={'space-between'}>
                            <DefText text="결제번호" style={[styles.payButtonLabel]} />
                            <DefText text="202206021155" style={[styles.payButtonText]} />
                        </HStack>
                        <HStack alignItems={'center'} justifyContent={'space-between'} mt='20px'>
                            <DefText text="이사전문가" style={[styles.payButtonLabel]} />
                            <DefText text="홍길동 전문가" style={[styles.payButtonText]}  />
                        </HStack>
                        <HStack alignItems={'center'} justifyContent={'space-between'} mt='20px'>
                            <DefText text="총 결제 금액" style={[styles.payButtonLabel]} />
                            <HStack>
                                <DefText text={numberFormat(240000)} style={[styles.payButtonLabel, {color:'#0195FF'}]}  />
                                <DefText text=" 원" style={[styles.payButtonLabel]} />
                            </HStack>
                        </HStack>
                        <Box position={'absolute'} right='25px' top='50%' marginTop='18px'>
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:14, height:14, resizeMode:'contain'}} />
                        </Box>
                    </TouchableOpacity>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    payButton: {
        padding:25,
        paddingRight:50,
        backgroundColor:'#fff',
        marginTop:15,
    },
    payButtonLabel: {
        ...fsize.fs14,
        ...fweight.b
    },
    payButtonText: {
        ...fsize.fs14,
    }
})

export default PayList;