import React, { useEffect, useState } from 'react';
import {Box, HStack, VStack, Modal} from 'native-base';
import { BottomButton, DefButton, DefInput, DefText } from '../common/BOOTSTRAP';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import SubHeader from '../components/SubHeader';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import { BASE_URL } from '../Utils/APIConstant';
import ApiExpert from '../ApiExpert';

const {width} = Dimensions.get("window");

const ExpertAreaInsert = (props) => {

    const {navigation, member_info, member_update, userInfo} = props;

    const [loading, setLoading] = useState(true);
    const [areaData, setAreaData] = useState([]);
    const [areaData2, setAreaData2] = useState([]);
    const [selectArea1, setSelectArea1] = useState("");
    const [selectArea2, setSelectArea2] = useState([]);

    const [selectAreaAll, setSelectAreaAll] = useState([]);

    const areaDataApi = async () => {
        await setLoading(true);
        await ApiExpert.send('start_area', {'id':userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('전체 지역 확인하기...: ', arrItems, resultItem);
               setAreaData(arrItems);
            }else{
               console.log('전체 지역 확인하기 실패...', resultItem);
               
            }
        });
        await setLoading(false);
    }

    const selectArea1Handler = (area) => {
        setSelectArea1(area);
        area2DataApi(area);
    }

    const selectArea2Handler = (area) => {

        let areaName = area.substring(0, 2);
        let allName = area.slice(-2);

        console.log(area);

        if(allName == "전체"){

            const selectArea2Val = [...selectArea2];
            console.log(selectArea2Val);

            if(selectArea2.includes(area)){

                console.log("area", area);
                const selectAreas = selectArea2.filter(item => area.substring(0,2) !== item.substring(0,2));
                setSelectArea2(selectAreas);

            }else{
                console.log("area no", area);

                 areaData2.map(item=> {
                   
                    selectArea2Val.push(item.alias + " " + item.wr_2);
                  
                     return setSelectArea2(selectArea2Val);
                })
            }
            
        }else{
             if(selectArea2.includes(area)){

                const selectAreas = selectArea2.filter(item => area !== item);
                setSelectArea2(selectAreas);
            }else{
                
                const selectAreas = [...selectArea2];
                selectAreas.push(area);
                setSelectArea2(selectAreas);

            }
        }

       
    }

    const areaDel = (area) => {
        
        if(selectArea2.includes(area)){
            const selectAreas = selectArea2.filter(item => area !== item);
            setSelectArea2(selectAreas);
        }

    }

    const area2DataApi = (area) => {
        ApiExpert.send('start_area2', {'area1':area}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('선택한 지역의 구 확인하기...: ', arrItems, resultItem);
               setAreaData2(arrItems);
            }else{
               console.log('선택한 지역의 구 확인하기 실패...', resultItem);
               
            }
        });
    }

    const expertUpdate = async () => {
        const formData = new FormData();
        formData.append("method", 'expert_update');
        formData.append("ex_move_status", userInfo.ex_move_status);
        formData.append("phone", userInfo.ex_phone);
        formData.append("id", userInfo.ex_id);
        formData.append("ex_service_status", userInfo.ex_service_status);
        formData.append("ex_start_date", userInfo.ex_start_date);
        formData.append("ex_service_name", userInfo.ex_service_name);
        formData.append("ex_advantages", userInfo.ex_advantages);
        formData.append("ex_select_reason", userInfo.ex_select_reason);
        formData.append("ex_worth", userInfo.ex_worth);
        formData.append("ex_refund", userInfo.ex_refund);
        formData.append("ex_addr", userInfo.ex_addr);
        formData.append("expertOneWord", userInfo.expertOneWord);

        formData.append("ex_area", selectArea2.join(",")); //이사 가능지역 업데이트
        formData.append("register_status", "N");


        const update = await member_update(formData);

        if(update.result){
            
            expertInfo();

            navigation.goBack();
           console.log(update);
        }
    }

    const expertInfo = async () => {
        const formData = new FormData();
        formData.append('method', 'expert_info');
        formData.append('id', userInfo.ex_id);
        const member_info_list = await member_info(formData);

        console.log('member_info_list:::::',member_info_list);
    }

    useEffect(()=> {
        areaDataApi();
    }, []);

    useEffect(()=> {
        console.log("selectAreas", selectArea2)
    }, [selectArea2]);

    useEffect(()=> {
        if(userInfo != ""){
            if(userInfo.ex_area != ""){
                setSelectArea2(userInfo.ex_area.split(","));
            }
        }
    }, [userInfo])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="이사가능지역 수정" navigation={navigation} />
            {
                loading ?
                <Box flex={1} justifyContent='center' alignItems='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box px='25px' pb='20px' pt={ selectArea2.length > 0 ? '0' : '20px'}>
                        {/* {
                            selectArea2.length != "" && 
                            <HStack flexWrap='wrap' mb='20px'>
                                {
                                    selectArea2.map((item, index) => {
                                        return(
                                            <Box key={index} style={[styles.selectAreaButton, (index + 1) != selectArea2.length ? {marginRight:10} : {marginRight:0}]}>
                                                <HStack alignItems={'center'}>
                                                    <DefText text={item} style={[fsize.fs14, {color:'#fff'}]}/>
                                                    <TouchableOpacity onPress={()=>areaDel(item)}>
                                                        <Image 
                                                            source={require("../images/areaClose.png")}
                                                            style={{
                                                                width:14,
                                                                height:14,
                                                                resizeMode:'stretch',
                                                                marginLeft:10
                                                            }}
                                                        />
                                                    </TouchableOpacity>
                                                </HStack>
                                            </Box>
                                        )
                                    })
                                }
                            </HStack>
                        } */}
                        <DefText text={"시, 도를 선택하세요."} style={[fweight.b]} />
                        {
                            areaData != "" &&
                            <HStack flexWrap={'wrap'}>
                                {
                                    areaData.map((item, index) => {
                                        return(
                                            <TouchableOpacity 
                                                key={index}
                                                onPress={()=>selectArea1Handler(item.alias)}
                                                style={[styles.areaButton, (index + 1) % 4 == 0 ? {marginRight:0} : {marginRight:(width - 50) * 0.038}, selectArea1 == item.alias && {backgroundColor:'#0195ff', borderColor:'#0195ff'}]}
                                            >
                                                <DefText text={item.alias} style={[styles.areaButtonText, selectArea1 == item.alias && {color:'#fff'}]} />
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </HStack>
                        }
                        {
                            selectArea1 != "" && 
                            <Box mt='30px'>
                                <DefText text={"구, 시를 선택하세요."} style={[fweight.b]} />
                                {
                                    areaData2 != "" && 
                                    <HStack flexWrap={'wrap'}>
                                       
                                        {
                                            areaData2.map((item, index) => {
                                                return(
                                                    <TouchableOpacity 
                                                        key={index}
                                                        onPress={()=>selectArea2Handler(item.alias + " " + item.wr_2)}
                                                        style={[
                                                            styles.areaButton2, 
                                                            (index + 1) % 3 == 0 ? {marginRight:0} : {marginRight:(width - 50) * 0.034}, 
                                                            selectArea2.includes(item.alias + " " + item.wr_2) && {backgroundColor:'#0195ff', borderColor:'#0195ff'}]}
                                                    >
                                                        <DefText 
                                                            text={item.wr_2} 
                                                            style={[
                                                                styles.areaButtonText, 
                                                                selectArea2.includes(item.alias + " " + item.wr_2) &&
                                                                {color:'#fff'}]} 
                                                        />
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </HStack>
                                }
                            </Box>
                        }
                    </Box>
                </ScrollView>
            }
            <DefButton text={'수정하기'} btnStyle={{width:width, borderRadius:0, backgroundColor:'#0195ff'}} textStyle={{color:'#fff'}} onPress={expertUpdate} />
            
        </Box>
    );
};

const styles = StyleSheet.create({
    areaButton: {
        width: (width-50) * 0.22,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        borderWidth:1,
        borderColor:'#999',
        paddingVertical:10,
        marginTop:10
    },
    areaButtonText: {
        ...fsize.fs14,
        color:'#666'
    },
    areaButton2: {
        width: (width-50) * 0.31,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        borderWidth:1,
        borderColor:'#999',
        paddingVertical:10,
        marginTop:10
    },
    selectAreaButton: {
        paddingVertical:10,
        paddingHorizontal:7,
        backgroundColor:"#0195ff",
        borderRadius:5,
        marginTop:10,
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_update: (user) => dispatch(UserAction.member_update(user)), //회원정보 변경
    })
)(ExpertAreaInsert);