import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import { numberFormat } from '../common/DataFunction';
import { BASE_URL } from '../Utils/APIConstant';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get("window");

const Policy = (props) => {

    const {navigation} = props;

    const [content, setContent] = useState([])

    const policyApi = () => {
        Api.send('content_list', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('서비스 문의 실행 성공::::: ', arrItems);
                setContent(arrItems);
               
            }else{
                //console.log('서비스 문의 실행 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=> {
        policyApi();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="약관 및 정책" navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    {
                        content != "" &&
                        content.map((item, index) => {
                            return(
                                <TouchableOpacity key={index} onPress={()=>navigation.navigate("PolicyPrivacy", {'idx':item.idx})}
                                    style={[index != 0 ? {marginTop:20} : {marginTop:0}]}
                                >
                                    <HStack alignItems={'center'} justifyContent='space-between'>
                                        <DefText text={item.co_subject} style={[styles.policyText]} />
                                        <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:24, height:14, resizeMode:'contain'}} />
                                    </HStack>
                                    
                                </TouchableOpacity>
                            )
                        })
                    }
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