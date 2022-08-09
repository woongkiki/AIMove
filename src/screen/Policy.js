import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import { numberFormat } from '../common/DataFunction';
import { BASE_URL } from '../Utils/APIConstant';

const {width, height} = Dimensions.get("window");

const Policy = (props) => {

    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="약관 및 정책" navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <TouchableOpacity onPress={()=>navigation.navigate("PolicyPrivacy")}>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <DefText text="개인정보처리방침" style={[styles.policyText]} />
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                        
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("PolicyTermuse")}>
                        <HStack alignItems={'center'} justifyContent='space-between' mt='20px'>
                            <DefText text="서비스 이용약관" style={[styles.policyText]} />
                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                        </HStack>
                    </TouchableOpacity>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    policyText: {
        ...fsize.fs14
    }
})

export default Policy;