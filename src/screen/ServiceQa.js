import React, { useState } from 'react';
import { ScrollView, Dimensions, Platform, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput } from '../common/BOOTSTRAP';
import { fsize, fweight, colorSelect } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import Api from '../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get("window");

const ServiceQa = (props) => {
    
    const {navigation, userInfo, route} = props;
    const {params} = route;

    const [qaTitle, setQaTitle] = useState("");
    const [qaContent, setQaContent] = useState("");

    const qaTitleChange = (text) => {
        setQaTitle(text);
    }

    const qaContentChange = (text) => {
        setQaContent(text);
    }

    const serviceQaHandler = () => {
        Api.send('service_action', {'qaTitle':qaTitle, 'qaContent':qaContent, 'id':params.m_type === '일반' ? userInfo.id : userInfo.ex_id, 'mname': params.m_type === '일반' ? userInfo.name : userInfo.ex_name, 'se_category':userInfo.m_type}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('서비스 문의 실행 성공::::: ', resultItem);
                ToastMessage(resultItem.message);
                navigation.goBack();
                setQaTitle("");
                setQaContent("");
            }else{
                //console.log('서비스 문의 실행 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle='서비스 문의' navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text={"앱 이용 시 불편했던 점이나 문의 내용을\n적어주세요."} style={[fweight.b]} />
                    <Box mt='20px'>
                        <DefInput 
                            placeholder={'문의 제목을 입력하세요.'}
                            value={qaTitle}
                            onChangeText={qaTitleChange}
                            inputStyle={[{
                                borderWidth:1,
                                borderColor:'#CCCCCC',
                                borderRadius:5
                            }]}
                        />
                    </Box>
                    <Box mt='10px'>
                        <DefInput 
                            placeholder={'문의 내용을 입력해 주세요.'}
                            value={qaContent}
                            onChangeText={qaContentChange}
                            inputStyle={[{
                                borderWidth:1,
                                borderColor:'#CCCCCC',
                                borderRadius:5,
                                height:210,
                                paddingTop:15
                            }]}
                            multiline={true}
                            textAlignVertical='top'
                        />
                    </Box>
                </Box>
            </ScrollView>
            <DefButton 
                text="문의하기"
                btnStyle={[styles.qaButton]}
                textStyle={[styles.qaButtonText]}
                onPress={serviceQaHandler}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    qaButton: {
        width:width,
        height:50,
        paddingTop:0,
        paddingBottom:0,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:0,
        ...colorSelect.sky
    },
    qaButtonText: {
        ...fsize.fs15,
        ...fweight.m,
        color:'#fff'
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
        member_out: (user) => dispatch(UserAction.member_out(user)), //로그아웃
    })
)(ServiceQa);