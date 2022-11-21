import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Switch } from 'native-base';
import { DefButton, DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import Api from '../Api';
import { useIsFocused } from '@react-navigation/native';
import { BASE_URL } from '../Utils/APIConstant';
import SubHeader from '../components/SubHeader';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get("window");

const AppNotice = (props) => {

    const {navigation, userInfo, route, member_info} = props;
    const {params} = route;

    const [loading, setLoading] = useState(true);
    const [pushList, setPushList] = useState([]);
    const [pushCheck, setPushCheck] = useState(true);

    const pushApi = async () => {


        let parameter;
        if(userInfo.m_type == "일반"){
             parameter = {'id':userInfo.id, 'mtype':params.m_type}
        }else{
             parameter = {'id':userInfo.ex_id, 'mtype':params.m_type}
        }
        

        await setLoading(true);
        await Api.send('push_list', parameter, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('푸쉬 리스트 보기: ', resultItem, arrItems);
               setPushList(arrItems);
            }else{
               console.log('푸쉬 리스트 실패!', resultItem);
               
            }
        });
        await setLoading(false);
    }

    const pushCheckChange = () => {

        let parameter;
        if(userInfo.m_type == "일반"){
             parameter = {'id':userInfo.id, "pushStatus":pushCheck, "m_type":userInfo.m_type}
        }else{
             parameter = {'id':userInfo.ex_id, "pushStatus":pushCheck, "m_type":userInfo.m_type}
        }

        Api.send('push_change', parameter, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('푸쉬 리스트 보기: ', resultItem, arrItems);
               //setPushList(arrItems);

               navigation.goBack();
               member_info_handle();
               ToastMessage(resultItem.message);

            }else{
               console.log('푸쉬 리스트 실패!', resultItem);
               
            }
        });
    }


    const member_info_handle = async () => {

        const formData = new FormData();
        formData.append('method', 'member_infoApp');
        formData.append("m_type", userInfo.m_type);
        if(userInfo.m_type == "일반"){
            formData.append('id', userInfo.id);
        }else{
            formData.append('id', userInfo.ex_id);
        }

        const member_info_list = await member_info(formData);
    }

    useEffect(()=> {
        pushApi();

        if(userInfo.pushStatus == "Y"){
            setPushCheck(true);
        }else{
            setPushCheck(false);
        }

    }, [])

    // useEffect(()=>{
    //     pushCheckChange();
    // }, [pushCheck])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle="알림 설정 및 확인" />
            {
                loading ? 
                <Box flex={1} justifyContent={'center'} alignItems={'center'}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <Box flex={1}>
                    <ScrollView>
                        <Box px='25px' py='20px'>
                            <HStack alignItems={'center'} justifyContent='space-between' mb="20px">
                                <DefText text="푸쉬알림 받기" style={[fweight.b]} />
                                <Switch isChecked={pushCheck} size='sm' onTrackColor={'#0195FF'} onToggle={()=>setPushCheck(!pushCheck)} />
                            </HStack>
                            {
                                pushList != "" ?
                                pushList.map((item, index) => {
                                    return(
                                        <Box key={index} style={[styles.pushBox]} mt={ index != 0 ? '20px' : 0}>
                                            <DefText text={"[" + item.p_title + "]"} style={[styles.pushTitle]} />
                                            <DefText text={item.p_content} style={[styles.pushContent]} />
                                            <HStack justifyContent={'flex-end'} mt='20px'>
                                                <DefText text={item.p_datetime} style={[styles.pushDate]} />
                                            </HStack>
                                        </Box>
                                    )
                                })
                                :
                                <Box flex={1} justifyContent={'center'} alignItems={'center'} py='40px'>
                                    <DefText text="푸쉬내역이 없습니다." />
                                </Box>
                            }
                        </Box>
                    </ScrollView>
                </Box>
            }
            <DefButton 
                text="알림상태변경"
                btnStyle={[styles.pushButton]}
                textStyle={[styles.pushButtonText]}
                onPress={pushCheckChange}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    pushBox: {
        padding:20,
        paddingVertical:15,
        borderRadius:10,
        borderWidth:1,
        borderColor:'#D4D9DE'
    },
    pushTitle: {
        ...fsize.fs14,
        ...fweight.b,
        marginBottom:15
    },
    pushContent: {
        ...fsize.fs12
    },
    pushDate: {
        ...fsize.fs12,
        color:'#0195FF'
    },
    pushButton: {
        width:width,
        height:50,
        paddingTop:0,
        paddingBottom:0,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:0,
        ...colorSelect.sky
    },
    pushButtonText: {
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
        member_update: (user) => dispatch(UserAction.member_update(user)), //회원정보 변경
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
    })
)(AppNotice);