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
import { useIsFocused } from '@react-navigation/native';

const {width, height} = Dimensions.get("window");
const emptyHeight = height - 100;

const ServiceQaList = (props) => {

    const {navigation, userInfo, route} = props;
    const {params} = route;

    const isFocused = useIsFocused();

    console.log(userInfo);

    const [loading, setLoading] = useState(true);
    const [serviceList, setServiceList] = useState([]);
    const [delModal, setDelModal] = useState(false);
    const [delIdx, setDelIdx] = useState("");

    const serviceListApi = async () => {
        await setLoading(true);
        await Api.send('service_list', {"id": params.m_type == "de" ? userInfo.id : userInfo.ex_id }, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('서비스 문의 리스트 성공::::: ', arrItems, resultItem);
                setServiceList(arrItems);
            }else{
                console.log('서비스 문의 실행 실패!', resultItem);
                
            }
        });
        await setLoading(false);
    }

    //문의삭제
    const serviceDelApi = () => {

        if(delIdx == ""){
            ToastMessage("삭제할 문의가 제대로 선택이 안되었습니다.");
            return false;
        }

        Api.send('service_listDel', {"idx":delIdx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('서비스 문의 삭제 성공::::: ', arrItems);
                setDelModal(false);
                serviceListApi();
                ToastMessage(resultItem.message);
            }else{
                console.log('서비스 문의 삭제 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }
    
    const serviceDel = (idx) => {
        setDelModal(true);
        setDelIdx(idx);
    }

    useEffect(()=> {
        if(isFocused){
            serviceListApi();
        }
    }, [isFocused])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle='서비스 문의' navigation={navigation} />
            {
                loading ? 
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size='large' color="#333" />
                </Box>
                :
                <Box flex={1}>
                {
                    serviceList != "" ?
                    <ScrollView>
                        <Box px='25px' py='20px'>
                            {
                                serviceList != "" &&
                                serviceList.map((item, index) => {
                                    return(
                                        <TouchableOpacity key={index} onPress={()=>navigation.navigate("ServiceQaView", {"idx":item.idx})} onLongPress={()=>serviceDel(item.idx)} style={[index != 0 ? {marginTop:20} : {marginTop:0}]}>
                                            <Box p='20px' backgroundColor={'#fff'} borderRadius='15px' shadow={4}>
                                                <HStack justifyContent={'space-between'} alignItems='center'>
                                                    <Box width={ (width - 90) * 0.6 } >
                                                        <DefText text={ textLengthOverCut(item.qa_subject, 15, '...')} style={[styles.serviceTitle]} />
                                                    </Box>
                                                    <Box width={ (width - 90) * 0.3 }  alignItems={'flex-end'}>
                                                        <DefText text={ item.comment_cnt > 0 ? '답변완료' : '답변대기'} style={[styles.answerText, item.comment_cnt > 0 ? {color:'#999'} : {color:'#0195FF'}]} />
                                                    </Box>
                                                </HStack>
                                                <HStack justifyContent={'flex-end'}>
                                                    <DefText text={item.qa_date.substring(0, 10)} style={[styles.serviceContent]} />
                                                </HStack>
                                            </Box>
                                        </TouchableOpacity>
                                    )
                                })                               
                            }
                        </Box>
                    </ScrollView>
                    :
                    <Box flex={1} alignItems={'center'} justifyContent='center'>
                        <DefText text="문의내역이 없습니다." />
                    </Box>
                }
                </Box>
            }
            <TouchableOpacity onPress={()=>navigation.navigate("ServiceQa", {"m_type":userInfo.m_type})} style={[styles.serviceButton]}>
                <DefText text="문의 작성" style={[fsize.fs16, fweight.m, {color:'#fff'}]} />
            </TouchableOpacity>
            <Modal isOpen={delModal} onClose={()=>setDelModal(false)}>
                <Modal.Content width={width-50}>
                    <Modal.Body >
                        <DefText text={"문의내역을 삭제하시겠습니까?\n답변내역도 함께 삭제됩니다."} style={[styles.modalText]} />
                        <HStack justifyContent={'space-between'} mt='20px'>
                            <TouchableOpacity onPress={serviceDelApi} style={[styles.modalButton]}>
                                <DefText text="예" style={[styles.modalButtonText]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setDelModal(false)} style={[styles.modalButton, [colorSelect.gray]]}>
                                <DefText text="아니오" style={[styles.modalButtonText, {color:'#000'}]} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    serviceTitle: {
        ...fsize.fs16,
        ...fweight.b
    },
    serviceContent: {
        ...fsize.fs14,
        marginTop:15,
        color:'#999'
    },
    answerText: {
        ...fsize.fs14
    },
    serviceButton: {
        width:width,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        ...colorSelect.sky
    },
    modalText: {
        ...fsize.fs14,
        textAlign:'center',
        lineHeight:22
    },
    modalButton: {
        width: (width - 90) * 0.48,
        height:40,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        ...colorSelect.sky
    },
    modalButtonText: {
        color:'#fff',
        ...fsize.fs14,
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
)(ServiceQaList);