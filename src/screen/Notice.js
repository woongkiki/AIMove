import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefButton, DefInput, DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import { BASE_URL } from '../Utils/APIConstant';
import SubHeader from '../components/SubHeader';
import { useIsFocused } from '@react-navigation/native';
import { numberFormat } from '../common/DataFunction';
import Api from '../Api';

const Notice = (props) => {

    const {navigation} = props;

    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [noticeList, setNoticeList] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const refreshHandler = () => {
        noticeApi();
    }

    const noticeApi = async () => {
        await setLoading(true);
        await Api.send('notice_list', {"type":"일반"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('공지사항 리스트: ', resultItem, arrItems);
               setNoticeList(arrItems);
            }else{
               console.log('공지사항 리스트 실패!', resultItem);
               
            }
        });
        await setLoading(false);
    }

    useEffect(()=> {
        if(isFocused){
            noticeApi();
        }
    }, [isFocused])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="공지사항" navigation={navigation} />
            {
                loading ?
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <ActivityIndicator size="large" color="#333"/>
                </Box>
                :
                noticeList != "" ?
                <ScrollView
                    refreshControl={<RefreshControl refreshing={refresh} onRefresh={refreshHandler} />}
                >
                    <Box px='25px' py='20px'>
                        {
                            noticeList.map((item, index) => {
                                return(
                                    <TouchableOpacity key={index} onPress={()=>navigation.navigate("ExpertNoticeView", {"idx":item.idx})} style={[ index !=0 && {marginTop:20}]}>
                                        <Box p='20px' backgroundColor={'#fff'} borderRadius='15px' shadow={4}>
                                            <DefText text={item.n_subject} style={[styles.noticeTitle]} />
                                            <HStack justifyContent={'flex-end'}>
                                                <DefText text={item.n_datetime.substring(0, 10)} style={[styles.noticeDate]} />
                                            </HStack>
                                        </Box>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </Box>
                </ScrollView>
                :
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <DefText text="등록된 공지사항이 없습니다." />
                </Box>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    noticeBox: {
        padding:20,
        paddingVertical:20,
        borderRadius:10,
        borderWidth:1,
        borderColor:'#D4D9DE'
    },
    noticeTitle: {
        ...fsize.fs16,
        ...fweight.b,
        marginBottom:15
    },
    noticeContent: {
        ...fsize.fs12
    },
    noticeDate: {
        ...fsize.fs14,
        color:'#999'
    }
})

export default Notice;