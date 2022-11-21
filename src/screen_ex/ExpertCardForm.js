import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack, Modal, Switch } from 'native-base';
import { DefButton, DefInput, DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import { BASE_URL } from '../Utils/APIConstant';
import SubHeader from '../components/SubHeader';
import ApiExpert from '../ApiExpert';

const {width} = Dimensions.get("window");

const ExpertCardForm = (props) => {

    const {navigation, userInfo, route} = props;
    const {params} = route;

    

    const [cardNumber1, setCardNumber1] = useState("");
    const [cardNumber2, setCardNumber2] = useState("");
    const [cardNumber3, setCardNumber3] = useState("");
    const [cardNumber4, setCardNumber4] = useState("");
    const [cardYear, setCardYear] = useState("");
    const [cardMonth, setCardMonth] = useState("");
    const [cardBirth, setCardBirth] = useState("");
    const [password, setPassword] = useState("");
    const [defaultCard, setDefaultCard] = useState(false);

    const cardNumberChange1 = (card) => {
        setCardNumber1(card)
    }

    const cardNumberChange2 = (card) => {
        setCardNumber2(card)
    }

    const cardNumberChange3 = (card) => {
        setCardNumber3(card)
    }

    const cardNumberChange4 = (card) => {
        setCardNumber4(card)
    }

    const cardYearChange = (year) => {
        setCardYear(year);
    }

    const cardMonthChange = (month) => {
        setCardMonth(month);
    }

    const cardBirthChange = (birth) => {
        setCardBirth(birth);
    }

    const passwordChange = (pwd) => {
        setPassword(pwd);
    }


    const cardInsert = () => {
        ApiExpert.send('card_insert', {"ex_id":userInfo.ex_id, "ex_name":userInfo.ex_name, "card1":cardNumber1, "card2":cardNumber2, "card3":cardNumber3, "card4":cardNumber4, "card_year":cardYear, "card_month":cardMonth, "card_birth":cardBirth, "card_password":password, "card_check":defaultCard}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('카드 등록하기 성공: ', resultItem, arrItems);
               // setAiImageData(arrItems);
               ToastMessage(resultItem.message);
               navigation.goBack();
            }else{
               console.log('카드 등록하기 실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
    }

    const cardUpdate = () => {
        ApiExpert.send('card_update', {"ex_id":userInfo.ex_id, "card1":cardNumber1, "card2":cardNumber2, "card3":cardNumber3, "card4":cardNumber4, "card_year":cardYear, "card_month":cardMonth, "card_birth":cardBirth, "card_password":password, "card_check":defaultCard, "idx":params.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('카드 등록하기 성공: ', resultItem, arrItems);
               // setAiImageData(arrItems);
               ToastMessage(resultItem.message);
               navigation.goBack();
            }else{
               console.log('카드 등록하기 실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
    }


    const cardInfo = () => {
        ApiExpert.send('card_detail', {"ex_id":userInfo.ex_id, "idx":params.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('카드 정보 성공: ', resultItem, arrItems);
               // setAiImageData(arrItems);

               let cardNumber = arrItems.card_number.split("-");
               setCardNumber1(cardNumber[0]);
               setCardNumber2(cardNumber[1]);
               setCardNumber3(cardNumber[2]);
               setCardNumber4(cardNumber[3]);
               setCardYear(arrItems.card_year);
               setCardMonth(arrItems.card_month);
               setCardBirth(arrItems.card_birth);
               setPassword(arrItems.card_password);

               let cardCheck = arrItems.card_check;
               if(cardCheck == "Y"){
                    setDefaultCard(true);
               }else{
                    setDefaultCard(false);
               }
              // ToastMessage(resultItem.message);
      
            }else{
               console.log('카드 정보 실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
    }


    useEffect(() => {
        if(params.idx != ""){
            //console.log("params", params);
            cardInfo();
        }
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="업체 카드 등록" navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <Box>
                        <DefText text="카드 번호" style={[styles.labelTitle]} />
                        <HStack justifyContent={'space-between'}>
                            <DefInput
                                placeholder={"카드번호"}
                                value={cardNumber1}
                                inputStyle={{width:(width - 50) * 0.23, paddingLeft:0, textAlign:'center'}}
                                onChangeText={cardNumberChange1}
                                maxLengthInput={4}
                                keyboardType='number-pad'
                            />
                            <DefInput
                                placeholder={"카드번호"}
                                value={cardNumber2}
                                inputStyle={{width:(width - 50) * 0.23, paddingLeft:0, textAlign:'center'}}
                                onChangeText={cardNumberChange2}
                                maxLengthInput={4}
                            />
                            <DefInput
                                placeholder={"카드번호"}
                                value={cardNumber3}
                                inputStyle={{width:(width - 50) * 0.23, paddingLeft:0, textAlign:'center'}}
                                onChangeText={cardNumberChange3}
                                maxLengthInput={4}
                            />
                            <DefInput
                                placeholder={"카드번호"}
                                value={cardNumber4}
                                inputStyle={{width:(width - 50) * 0.23, paddingLeft:0, textAlign:'center'}}
                                onChangeText={cardNumberChange4}
                                maxLengthInput={4}
                            />
                        </HStack>
                    </Box>
                    <Box mt="30px">
                        <DefText text="카드 유효기간" style={[styles.labelTitle]} />
                        <HStack>
                            <DefInput
                                placeholder={"YYYY"}
                                value={cardYear}
                                inputStyle={{width:(width - 50) * 0.23, paddingLeft:0, textAlign:'center', marginRight:10}}
                                onChangeText={cardYearChange}
                                maxLengthInput={4}
                            />
                            <DefInput
                                placeholder={"MM"}
                                value={cardMonth}
                                inputStyle={{width:(width - 50) * 0.15, paddingLeft:0, textAlign:'center'}}
                                onChangeText={cardMonthChange}
                                maxLengthInput={2}
                            />
                        </HStack>
                    </Box>
                    <Box mt="30px">
                        <HStack justifyContent={'space-between'}>
                            <Box>
                                <DefText text="생년월일" style={[styles.labelTitle]} />
                                <DefInput
                                    placeholder={"YYMMDD"}
                                    value={cardBirth}
                                    inputStyle={{width:(width - 50) * 0.46, marginRight:10}}
                                    onChangeText={cardBirthChange}
                                    maxLengthInput={6}
                                />
                            </Box>
                            <Box>
                                <DefText text="카드 비밀번호 앞 두자리" style={[styles.labelTitle]} />
                                <DefInput
                                    placeholder={"비밀번호 앞 두자리"}
                                    value={password}
                                    inputStyle={{width:(width - 50) * 0.46, marginRight:10}}
                                    onChangeText={passwordChange}
                                    maxLengthInput={2}
                                    secureTextEntry={true}
                                />
                            </Box>
                        </HStack>
                    </Box>
                    <Box mt="30px">
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <DefText text="기본 결제 수단으로 지정" style={[styles.labelTitle]} />
                            <Switch isChecked={defaultCard} size='sm' onTrackColor={'#0195FF'} onToggle={()=>setDefaultCard(!defaultCard)} />
                        </HStack>
                    </Box>
                </Box>
            </ScrollView>
            {
                params.idx != "" ?
                <DefButton 
                    btnStyle={[styles.button]}
                    textStyle={[styles.buttonText]}
                    text="업체 카드 수정"
                    onPress={cardUpdate}
                />
                :
                <DefButton 
                    btnStyle={[styles.button]}
                    textStyle={[styles.buttonText]}
                    text="업체 카드 등록"
                    onPress={cardInsert}
                />
            }
            
        </Box>
    );
};

const styles = StyleSheet.create({
    button: {
        width:width,
        paddingTop:0,
        paddingBottom:0,
        ...colorSelect.sky,
        height:50,
        borderRadius:0,
    },
    buttonText: {
        ...fweight.m,
        color:'#fff'
    },
    labelTitle: {
        ...fsize.fs15,
        ...fweight.b
    },
    cardNumberInput: {
        width: (width - 50) * 0.23
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    })
)(ExpertCardForm);