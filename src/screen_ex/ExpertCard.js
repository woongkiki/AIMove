import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefButton, DefInput, DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import { BASE_URL } from '../Utils/APIConstant';
import SubHeader from '../components/SubHeader';
import ApiExpert from '../ApiExpert';
import { useIsFocused } from '@react-navigation/native';
import { numberFormat } from '../common/DataFunction';

const {width} = Dimensions.get("window");

const ExpertCard = (props) => {

    const {navigation, userInfo} = props;

    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [cardList, setCardList] = useState([]);

    const [delModal, setDelModal] = useState(false);
    const [delIdx, setDelIdx] = useState("");

    const expertCardList = async () => {
        await setLoading(true);
        await ApiExpert.send('card_list', {"ex_id":userInfo.ex_id, "ex_name":userInfo.ex_name}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('카드 리스트 성공: ', resultItem, arrItems);
               setCardList(arrItems);
            }else{
               console.log('카드 리스트 실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
        await setLoading(false);
    }

    const delModalHandler = (idx) => {
        setDelIdx(idx);
        setDelModal(true);
    }

    const expertCardRemove = () => {
       
        ApiExpert.send('card_delete', {"idx":delIdx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('카드 삭제 성공: ', resultItem, arrItems);
            //    setCardList(arrItems);
                setDelModal(false);
                setDelIdx("");
                expertCardList();

            }else{
               console.log('카드 삭제 실패!', resultItem);
               //ToastMessage(resultItem.message);
            }
        });
    }

    const expertCardRemoveCancle = () => {
        setDelModal(false);
        setDelIdx("");
    }

    useEffect(()=> {
        if(isFocused){
            expertCardList();
        }
    }, [isFocused])

    return (
        <Box flex={1} backgroundColor='#F8F9FA'>
            <SubHeader headerTitle="업체 카드 목록" navigation={navigation} />
            {
                loading ?
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size="large" color="#333" />
                </Box>
                :
                cardList != "" ?
                <ScrollView>
                    <Box>
                        {
                            cardList.map((item, index) => {
                                return(
                                    <TouchableOpacity key={index} style={[styles.payButton]} onPress={()=>navigation.navigate("ExpertCardForm", {"idx":item.idx})} onLongPress={()=>delModalHandler(item.idx)}>
                                        <HStack alignItems={'center'} justifyContent={'space-between'}>
                                            <DefText text="카드번호" style={[styles.payButtonLabel]} />
                                            <DefText text={item.card_number} style={[styles.payButtonText]} />
                                        </HStack>
                                        <HStack alignItems={'center'} justifyContent={'space-between'} mt='20px'>
                                            <DefText text="유효기간" style={[styles.payButtonLabel]} />
                                            <DefText text={item.card_year + " " + item.card_month} style={[styles.payButtonText]}  />
                                        </HStack>
                                        <HStack alignItems={'center'} justifyContent={'space-between'} mt='20px'>
                                            <DefText text="기본결제수단" style={[styles.payButtonLabel]} />
                                            <DefText text={item.card_check == "Y" ? "등록" : "미등록" } style={[styles.payButtonText]}  />
                                        </HStack>
                               
                                        <Box position={'absolute'} right='25px' top='50%' marginTop='18px'>
                                            <Image source={require("../images/mypageArr.png")} alt='화살표' style={{width:14, height:14, resizeMode:'contain'}} />
                                        </Box>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </Box>
                </ScrollView>
                :
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <DefText text="등록된 카드가 없습니다." />
                </Box>
            }
            
            <DefButton 
                btnStyle={[styles.button]}
                textStyle={[styles.buttonText]}
                text="업체 카드 등록"
                onPress={()=>navigation.navigate("ExpertCardForm", {"idx":""})}
            />

            <Modal isOpen={delModal} onClose={expertCardRemoveCancle}>
                <Modal.Content width={width-50}>
                    <Modal.Body px='20px' py='20px'>
                        <DefText text="카드삭제" style={[styles.myPageName]} />
                        <DefText text="해당 카드를 삭제하시겠습니까?" style={[styles.modalText]} />
                        <HStack justifyContent={'space-between'} mt='20px'>
                            <TouchableOpacity onPress={expertCardRemove} style={[styles.modalButton]}>
                                <DefText text="예" style={[styles.modalButtonText]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={expertCardRemoveCancle} style={[styles.modalButton, [colorSelect.gray]]}>
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
    payButton: {
        padding:25,
        paddingRight:50,
        backgroundColor:'#fff',
        marginTop:15,
    },
    payButtonLabel: {
        ...fsize.fs14,
        ...fweight.b
    },
    payButtonText: {
        ...fsize.fs14,
    },
    modalText: {
        marginTop:20,
        ...fsize.fs14
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
    },
    myPageName: {
        ...fweight.b
    },
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    })
)(ExpertCard);