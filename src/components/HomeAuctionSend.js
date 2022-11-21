import React, {useState, useEffect} from 'react';
import {Box, HStack, Modal, Toast, VStack} from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { ActivityIndicator, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { useIsFocused } from '@react-navigation/native';
import ApiExpert from '../ApiExpert';
import { BASE_URL } from '../Utils/APIConstant';
import { numberFormat } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import CountDown from '@ilterugur/react-native-countdown-component';
import Api from '../Api';
import ToastMessage from './ToastMessage';
import Font from '../common/Font';

const {width} = Dimensions.get("window");

const HomeAuctionSend = (props) => {

    const {navigation, userInfo} = props;

    const isFocused = useIsFocused();

    const [visitLoading, setVisitLoading] = useState(true);
    const [visitList, setVisitList] = useState([]);
    const [myVisitList, setMyVisitList] = useState([]);
    const [visitModal, setVisitModal] = useState(false);
    const [visitIdx, setVisitIdx] = useState("");
    const [visitName, setVisitName] = useState("");
    const [visitId, setVisitId] = useState("");

    const homeAuctionApi = async () => {
        await setVisitLoading(true);
        await Api.send('house_visitAuction', {'mid':userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                
                console.log('방문견적 리스트 불러오기 성공!', arrItems);
                setVisitList(arrItems);

            }else{

               console.log('방문견적 리스트 실패!', resultItem);
               setVisitList([]);
               
            }
        });
        await Api.send('house_myVisitAuction', {'expert_id':userInfo.ex_id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                
                //console.log('내가 신청한 방문견적 리스트 불러오기 성공!', arrItems);
                setMyVisitList(arrItems);

            }else{

               console.log('내가 신청한 방문견적 리스트 실패!', resultItem);
               
               
            }
        });
        await setVisitLoading(false);
    }

    const visitAuctionPlay = (idx, name, id, cnt) => {
        
        console.log(idx);

        if(cnt == 3){
            ToastMessage("방문견적을 신청할 수 있는 인원이 완료되었습니다.");
        }else{
            if(myVisitList.includes(idx)){
                ToastMessage("이미 방문신청이 완료된 견적입니다.\n고객님의 선택을 기다리고 있어요");
                return false;
            }else{
                setVisitIdx(idx);
                setVisitName(name);
                setVisitId(id);
                setVisitModal(true);
            }
        }

        
    }

    const visitAuctionSubmit = () => {

        Api.send('visit_pay', {'auc_idx':visitIdx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('방문견적요청 금액: ', resultItem, arrItems);

               navigation.navigate("VisitAuctionPayModule", {"app_commission":arrItems.app_commission, "commission":arrItems.commission, "def_visit_auction": arrItems.def_visit_auction, "sumsum":arrItems.sumsum, "vat":arrItems.vat, 'auc_idx':visitIdx, 'mid':visitId, 'mname':visitName});
               
               setVisitModal(false);

            }else{
               console.log('방문견적요청 금액 실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=> {
        if(isFocused){
            homeAuctionApi();
        }

        return() => {
            setVisitList("");
        }
    }, [isFocused])

    return (
        <Box flex={1} backgroundColor='#fff'>
            {
                visitLoading ?
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size="large" color="#333" />
                </Box>
                :
                <>
                {
                    visitList != "" ?
                    <ScrollView>
                        <Box px='25px' py='25px'>
                            {
                                visitList.map((item, index) => {
                                    return(
                                        <Box key={index} backgroundColor={'#fff'} borderRadius='10px' shadow={9} mt={ index != 0 ? "20px" : 0}>
                                            <TouchableOpacity onPress={()=>visitAuctionPlay(item.idx, item.mname, item.mid, item.auction_cnt)} style={[styles.moveButton]}>
                                                
                                                <VStack borderBottomWidth={1} borderBottomColor='#F3F4F5' >
                                                    <HStack justifyContent={'space-between'} alignItems='center'>
                                                        <Box width="70%">
                                                            <DefText text={'가정집이사 (' + item.move_status + '견적)'} style={[styles.moveTitle]} />
                                                        </Box>
                                                        {
                                                            myVisitList.includes(item.idx) &&
                                                            <DefText text={'신청완료'} style={[styles.moveTitle, {color:'#0195ff'}]}  />
                                                        }
                                                    </HStack>
                                                    <DefText text={'이사날짜 : ' + item.v_date.substring(0, 10)} style={[styles.moveDate]} />
                                                </VStack>

                                                <HStack style={[styles.labelBox]}>
                                                    <DefText text="남은시간" style={[styles.labelLeft]} />
                                                    <CountDown 
                                                        until={item.times}
                                                        timeToShow={['H', 'M', 'S']}
                                                        timeLabels={{m: null, s: null}}
                                                        size={14}
                                                        digitStyle={{width:20, height:'auto', marginTop:4}}
                                                        digitTxtStyle={{fontSize:16, fontFamily:Font.SCoreDreamM, color:'#000'}}
                                                        showSeparator
                                                        style={{marginTop:-4, alignItems:'flex-start'}}
                                                    />
                                                </HStack>
                                                <HStack style={[styles.labelBox]} alignItems='center'>
                                                    <DefText text="신청자" style={[styles.labelLeft]} />
                                                    <Box width="70%" alignItems='flex-end'>
                                                        <DefText text={item.mname} style={[styles.labelRight]} />
                                                    </Box>
                                                </HStack>
                                                <HStack style={[styles.labelBox]} alignItems='center'>
                                                    <DefText text="방문주소" style={[styles.labelLeft]} />
                                                    <Box width="70%" alignItems='flex-end'>
                                                        <DefText text={item.v_addr} style={[styles.labelRight]} />
                                                        <DefText text={item.v_addr2} style={[styles.labelRight]} />
                                                    </Box>
                                                </HStack>
                                            
                                            </TouchableOpacity>
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                    </ScrollView>
                    :
                    <Box flex={1} alignItems='center' justifyContent={'center'}>
                        <DefText text='참여가능한 가정집이사 목록이 없습니다.' />
                    </Box>
                }
                </>
            }
            
            <Modal isOpen={visitModal} onClose={()=>setVisitModal(false)}>
                <Modal.Content width={width-50}>
                    <Modal.Body px='20px' py='20px'>
                        <DefText
                            text={"방문견적 서비스는 내집이사에 비용을 지급하시고, 소비자와 직접 거래하는 서비스 입니다."}
                            style={[styles.modalText, {marginBottom:10, lineHeight:20}]}
                        />
                        <DefText text={ visitName + "님의 방문 견적에 참여하시겠습니까?"} style={[styles.modalText]} />
                        <HStack justifyContent={'space-between'} mt='20px'>
                            <TouchableOpacity onPress={visitAuctionSubmit} style={[styles.modalButton]}>
                                <DefText text="예" style={[styles.modalButtonText]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setVisitModal(false)} style={[styles.modalButton, [colorSelect.gray]]}>
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
    moveButton: {
        paddingHorizontal:15,
        paddingVertical:20,
    },
    moveTitle: {
        ...fsize.fs19,
        ...fweight.b,
        
    },
    moveDate: {
        color:'#777',
        ...fsize.fs13,
        marginTop:10,
        marginBottom:10
    },
    labelBox: {
        justifyContent:'space-between',
        marginTop:15
    },
    labelLeft: {
        ...fsize.fs15,
        ...fweight.b
    },
    labelRight: {
        color:'#747474',
        ...fsize.fs15,
    },
    modalText: {
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
)(HomeAuctionSend);