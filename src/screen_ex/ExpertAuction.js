import React, {useState, useEffect, Fragment} from 'react';
import {ScrollView, Dimensions, StyleSheet, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import {Box, VStack, HStack, Modal} from 'native-base';
import { DefButton, DefInput, DefText } from '../common/BOOTSTRAP';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import SubHeader from '../components/SubHeader';
import ApiExpert from '../ApiExpert';
import { BASE_URL } from '../Utils/APIConstant';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import { numberFormat } from '../common/DataFunction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get("window");

const ExpertAuction = (props) => {

    const {navigation, userInfo, route} = props;
    const {params} = route;

    const [serviceCommission, setServiceCommission] = useState('');
    const [expertPrice, setExpertPrice] = useState("");
    const [carWeight, setCarWeight] = useState("");
    const [carCount, setCarCount] = useState("");
    const [personMan, setPersonMan] = useState("");
    const [personWoman, setPersonWoman] = useState("");
    const [cautionWord, setCautionWord] = useState("");


    const [commisionPer, setCommisionPer] = useState("");
    const [commisionPer2, setCommisionPer2] = useState("");

    const expertPriceChange = (price) => {
        setExpertPrice(price);

        //setCommisionPer(commisions);
    }

    useEffect(() => {
        console.log("serviceCommission", serviceCommission);
    }, [serviceCommission])

    useEffect(() => {
        if(expertPrice != ""){
            let expertp = parseInt(expertPrice);
            let commision = serviceCommission.app_commission;

            console.log("commision:::",commision)
            //let commisions = (Math.floor(expertp * commision / 100) / 10) * 10;
            let commisions = Math.floor(expertp * commision / 100);
            let commisions2 = Math.floor(commisions * 10 / 100);

            setCommisionPer(commisions);
            setCommisionPer2(commisions2);
        }
    }, [expertPrice])

    const carWeightChange = (weight) => {
        setCarWeight(weight);
    }

    const carCountChange = (count) => {
        setCarCount(count);
    }

    const personManChange = (man) => {
        setPersonMan(man);
    }

    const personWomanChange = (w) => {
        setPersonWoman(w);
    }

    const cautionChange = (c) => {
        setCautionWord(c);
    }

    const commissionApi = () => {
        Api.send('service_commission', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('서비스 수수료 결과 보기: ', arrItems);
               setServiceCommission(arrItems);
            }else{
               console.log('서비스 수수료 결과 보기 실패!', resultItem);
               
            }
        });
    }

    useEffect(()=>{
        commissionApi();

        if(userInfo != ""){
            if(userInfo.expertOneWord != ""){
                setCautionWord(userInfo.expertOneWord);
            }
            //console.log("userInfo",userInfo);
        }

    }, [])



    const expertSubmitApi = () => {

        if(expertPrice == ""){
            ToastMessage("입찰하실 금액을 입력하세요.");
            return false;
        }


        if(carWeight == ""){
            ToastMessage("차량의 무게를 입력하세요.\n차량이 없으면 0으로 입력하세요.");
            return false;
        }

        if(carCount == ""){
            ToastMessage("차량 대수를 입력하세요.\n차량이 없으면 0으로 입력하세요.");
            return false;
        }

        let carText = carWeight + "톤 " + carCount + "대";

        if(personMan == ""){
            ToastMessage("남성 인력 인원을 입력하세요.\n인원이 없으면 0으로 입력하세요.");
            return false;
        }

        if(personWoman == ""){
            ToastMessage("여성 인력 인원을 입력하세요.\n인원이 없으면 0으로 입력하세요.");
            return false;
        }

        let parame = {
            'ai_idx':params.params.idx,
            'mid':params.params.mid,
            'bidx':params.params.bidx,
            'expert_id':userInfo.ex_id,
            'expert_move_cnt':userInfo.move_cnt,
            'expert_certi':userInfo.business_certi,
            'expert_review_cnt':userInfo.review_cnt,
            'expert_car':carText,
            'expert_person_m':personMan,
            'expert_person_w':personWoman,
            'auction_price':expertPrice,
            'cautionWord':cautionWord
        }

        ApiExpert.send('auction_submit', parame, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('역경매 참여하기: ', resultItem);
               //setServiceCommission(arrItems);
               ToastMessage(resultItem.message);
             
                navigation.replace("ExpertNavi", {
                    screen: "PlayMove",
                    params:{
                        moveCate : "소형 이사" ,
                        homeCate: "",
                    }
                })

            }else{
               console.log('서비스 수수료 결과 보기 실패!', resultItem);
               
            }
        });
    }
    //console.log('123',params);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle='입찰 참여하기' navigation={navigation} />
            <ScrollView>
                {
                    expertPrice.length > 0 &&
                    <Box borderBottomWidth={7} borderBottomColor='#0195ff' py='20px' px='25px'>
                        {
                            expertPrice != "" &&
                            <Box>
                                {
                                    expertPrice != "" &&
                                    <HStack justifyContent={'space-between'} alignItems='center'>
                                        <DefText text='입찰 금액' style={[styles.certiLabel]} />
                                        <DefText text={ numberFormat(expertPrice) + '원' } style={[styles.certiSmall, {color:'#0195ff'}]} />
                                    </HStack>
                                }
                                {
                                    commisionPer != "" &&
                                    <HStack justifyContent={'space-between'} alignItems='center' mt='10px'>
                                        <DefText text='서비스 수수료' style={[styles.certiLabel]} />
                                        <DefText text={ numberFormat(commisionPer) + '원' } style={[styles.certiSmall]} />
                                    </HStack>
                                }
                                {
                                    commisionPer2 != "" &&
                                    <HStack justifyContent={'space-between'} alignItems='center' mt='10px'>
                                        <DefText text='세금' style={[styles.certiLabel]} />
                                        <DefText text={numberFormat(commisionPer2) + '원'} style={[styles.certiSmall]} />
                                    </HStack>
                                }
                                
                                {
                                    expertPrice != "" &&
                                    <HStack justifyContent={'space-between'} alignItems='center' mt='10px'>
                                        <DefText text='합계' style={[styles.certiLabel]} />
                                        <DefText text={ numberFormat(parseInt(expertPrice) + parseInt(commisionPer) + parseInt(commisionPer2)) + '원' } style={[styles.certiSmall, {color:'#0195ff'}]} />
                                    </HStack>
                                }
                            </Box>
                        }
                    </Box>
                }
                
                <Box px='25px' py='20px'>
                
                    <Box>
                        <DefText text={"입찰금액"} style={[fweight.b]} />
                        <DefInput 
                            placeholder={'입찰하실 금액을 입력하세요.'}
                            value={expertPrice}
                            onChangeText={expertPriceChange}
                            inputStyle={[{
                                borderWidth:1,
                                borderColor:'#CCCCCC',
                                borderRadius:5,
                                marginTop:15
                            }]}
                            keyboardType='number-pad'
                        />
                    </Box>
                    <Box mt='30px'>
                        <DefText text={"차량대수"} style={[fweight.b]} />
                        <HStack mt='15px'>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <DefInput 
                                    placeholder={''}
                                    value={carWeight}
                                    onChangeText={carWeightChange}
                                    inputStyle={[{
                                        borderWidth:1,
                                        borderColor:'#CCCCCC',
                                        borderRadius:5,
                                        width:(width-50) * 0.4,
                                        marginRight:10,
                                        paddingLeft:0,
                                        textAlign:'center'
                                    }]}
                                    keyboardType='number-pad'
                                />
                                <DefText text='톤' />
                            </HStack>
                            <HStack alignItems={'center'} ml='20px'>
                                <DefInput 
                                    placeholder={''}
                                    value={carCount}
                                    onChangeText={carCountChange}
                                    inputStyle={[{
                                        borderWidth:1,
                                        borderColor:'#CCCCCC',
                                        borderRadius:5,
                                        width:(width-50) * 0.4,
                                        marginRight:10,
                                        paddingLeft:0,
                                        textAlign:'center'
                                    }]}
                                    keyboardType='number-pad'
                                />
                                <DefText text='대' />
                            </HStack>
                        </HStack>
                    </Box>
                    <Box mt='30px'>
                        <DefText text={"참여인력"} style={[fweight.b]} />
                        <HStack justifyContent={'space-between'} mt='15px'>
                            <HStack alignItems={'center'} justifyContent='space-between' width='47%' >
                                <DefText text="남성" />
                                <HStack alignItems={'center'}>
                                    <DefInput 
                                        placeholder={''}
                                        value={personMan}
                                        onChangeText={personManChange}
                                        inputStyle={[{
                                            borderWidth:1,
                                            borderColor:'#CCCCCC',
                                            borderRadius:5,
                                            width: (width - 50) * 0.27,
                                            marginRight:10,
                                            paddingLeft:0,
                                            textAlign:'center'
                                        }]}
                                        keyboardType='number-pad'
                                    />
                                    <DefText text='명' />
                                </HStack>
                            </HStack>
                            <HStack alignItems={'center'} justifyContent='space-between' width='47%' >
                                <DefText text="여성" />
                                <HStack alignItems={'center'}>
                                    <DefInput 
                                        placeholder={''}
                                        value={personWoman}
                                        onChangeText={personWomanChange}
                                        inputStyle={[{
                                            borderWidth:1,
                                            borderColor:'#CCCCCC',
                                            borderRadius:5,
                                            width: (width - 50) * 0.27,
                                            marginRight:10,
                                            paddingLeft:0,
                                            textAlign:'center'
                                        }]}
                                        keyboardType='number-pad'
                                    />
                                    <DefText text='명' />
                                </HStack>
                            </HStack>
                        </HStack>
                    </Box>
                    <Box mt='30px'>
                        <DefText text='고객님 미리 알고 계셔야 해요.' style={[fweight.b]} />
                        <DefText text='(마이페이지에서 미리 등록하시면 편합니다.)' style={[fsize.fs13, {color:'#777', marginTop:5}]} />
                        <DefInput 
                            placeholder={'고객이 주의해야할 사항을 입력하세요'}
                            value={cautionWord}
                            onChangeText={cautionChange}
                            inputStyle={[{
                                borderWidth:1,
                                borderColor:'#CCCCCC',
                                borderRadius:5,
                                width: (width - 50),
                                height: 150,
                                marginTop:15,
                                paddingTop:15,
                                paddingLeft:15
                            }]}
                            multiline={true}
                            textAlignVertical='top'
                        />
                    </Box>
                    
                    
                </Box>
                
            </ScrollView>
            <DefButton 
                text="참여하기"
                btnStyle={[styles.qaButton]}
                textStyle={[styles.qaButtonText]}
                onPress={expertSubmitApi}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    certiLabel : {
        ...fsize.fs14,
        ...fweight.b
    },
    certiSmall: {
        ...fsize.fs14
    },
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
        
    })
)(ExpertAuction);