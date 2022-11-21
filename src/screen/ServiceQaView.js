import React, { useEffect, useState } from 'react';
import { ScrollView, Dimensions, Platform, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput } from '../common/BOOTSTRAP';
import { fsize, fweight, colorSelect } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import Api from '../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import { textLengthOverCut } from '../common/DataFunction';

const {width, height} = Dimensions.get("window");

const ServiceQaView = (props) => {

    const {navigation, route, userInfo} = props;
    const {params} = route;

    const [loading, setLoading] = useState(true);
    const [serviceQa, setServiceQa] = useState("");
    const [serviceComment, setServiceComment] = useState([]);

    const serviceViewApi = async () => {
        await setLoading(true);
        await Api.send('service_view', {"idx":params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('서비스 문의 상세 성공::::: ', arrItems);
                setServiceQa(arrItems);
            }else{
                console.log('서비스 문의 상세 실패!', resultItem);
                
            }
        });
        await Api.send('service_commentList', {"idx":params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('서비스 답변 리스트::::: ', arrItems);
                setServiceComment(arrItems);
            }else{
                console.log('서비스 답변 상세 실패!', resultItem);
                
            }
        });
        await setLoading(false);
    }


    useEffect(()=> {
        serviceViewApi()
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle='문의 상세' navigation={navigation} />
            {
                loading ?
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box px='25px' py='20px'>
                        <Box pb="20px" borderBottomWidth={1} borderBottomColor='#999'>
                            <Box>
                                <DefText text={serviceQa.qa_subject} style={[fsize.fs20, fweight.b]}/>
                            </Box>
                            <Box alignItems={'flex-end'} mt='10px'>
                                <DefText text={serviceQa.qa_date.substring(0, 10)} style={[styles.service_date]} />
                            </Box>
                        </Box>
                        <Box py='30px' minHeight={'200px'}>
                            <DefText text={serviceQa.qa_content} style={[styles.serviceContent]} />
                        </Box>
                        <Box>
                            <HStack pb='15px' borderBottomWidth={2} borderBottomColor='#999'>
                                <DefText text="답변 " style={[styles.commentTitle]} />
                                <DefText text={serviceComment.length} style={[styles.commentTitle, {color:'#0195ff'}]} />
                            </HStack>
                            {
                                serviceComment != "" ?
                                serviceComment.map((item, index) => {
                                    return(
                                        <Box p='20px' key={index} borderBottomWidth={1} borderBottomColor='#f1f1f1'>
                                            <HStack justifyContent={'space-between'} alignItems='center'>
                                                <DefText text={item.mname} style={[styles.commentTitle, fweight.m]} />
                                                <DefText text={item.qa_date.substring(0, 10)} style={[styles.commentDate]} />
                                            </HStack>
                                            <Box mt='10px'>
                                                <DefText text={item.qa_content} style={[styles.commentTitle]} />
                                            </Box>
                                        </Box>
                                    )
                                })
                                :
                                <Box height="100px" alignItems={'center'} justifyContent='center'>
                                    <DefText text="등록된 답변이 없습니다." style={[fsize.fs14, {color:'#666'}]} />
                                </Box>
                            }
                        </Box>
                    </Box>
                </ScrollView>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    service_date: {
        ...fsize.fs14,
        color:'#999'
    },
    serviceContent: {
        ...fsize.fs14
    },
    commentTitle: {
        ...fsize.fs14,
    },
    commentDate: {
        ...fsize.fs14,
        color:'#999'
    },
    commentTitle: {
        ...fsize.fs14
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    })
)(ServiceQaView);