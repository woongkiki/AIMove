import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import {textLengthOverCut} from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import APiExpert from '../ApiExpert';
import { BASE_URL } from '../Utils/APIConstant';
import { useIsFocused } from '@react-navigation/native';
import Api from '../Api';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

const {width} = Dimensions.get("window");

const ExpertMessage = (props) => {

    const {navigation, userInfo, member_chatCnt} = props;

    const isFocused = useIsFocused();

    const [chatCategory, setChatCategory] = useState("메세지");

    const [chatList, setChatList] = useState([]);
    const [pushList, setPushList] = useState([]);

    const chatListApi = () => {
        APiExpert.send('chat_list', {"ex_id":userInfo.ex_id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('전문가용 채팅리스트리스트 보기123123: ', arrItems, resultItem);
               setChatList(arrItems);
            }else{
               console.log('전문가용 채팅리스트 실패!', resultItem);
               //setExpertList([]);
            }
        });
        Api.send('push_list', {"id":userInfo.ex_id, "mtype":"일반"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('푸쉬알림리스트 보기: ', arrItems, resultItem);
               setPushList(arrItems);
            }else{
               console.log('푸쉬알림리스트 실패!', resultItem);
               //setExpertList([]);
            }
        });
    }

    const chatCntHandler = async () => {
        const formData = new FormData();
        formData.append('ex_id', userInfo.ex_id);
        formData.append('type', "expert");
        formData.append('method', 'member_exchatCnt');

        const chat_cnt = await member_chatCnt(formData);

        console.log("chat_cnt ExpertMessage Screen::", chat_cnt);
    }

    useEffect(()=> {

        messaging().onMessage((remoteMessage) => {

            if(remoteMessage.data?.intent != ""){
                Toast.show({
                    type: 'info', //success | error | info
                    position: 'top',
                    text1: remoteMessage.notification.title,
                    text2: remoteMessage.notification.body,
                    visibilityTime: 3000,
                   // autoHide: remoteMessage.data.intent === 'SellerReg' ? false : true,    // true | false
                    topOffset: Platform.OS === 'ios' ? 66 + getStatusBarHeight() : 10,
                    style: { backgroundColor: 'red' },
                    bottomOffset: 100,
                    onShow: () => {},
                    onHide: () => {},
                    onPress: () => {
      
                      //console.log('12312312313::::', remoteMessage.data)
                      if (remoteMessage.data?.intent != null && remoteMessage.data?.intent != '') {
                 
                      }
                    },
                  });
            }
            
          
            console.log('실행중 메시지 Chating Screen:::',remoteMessage);
            chatListApi();
          });

        if(isFocused){
            chatListApi();
            chatCntHandler();
        }
    }, [isFocused])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                <Box px='25px' py='20px'>
                    <HStack>
                        <TouchableOpacity onPress={()=>setChatCategory("메세지")} style={[{marginRight:25}]}>
                            <DefText text="메세지" style={[styles.chatCateText, chatCategory == "메세지" && [fweight.b, {color:'#000000'}]]} />
                            <Box style={[styles.chatCateOnBox, chatCategory == "메세지" && [colorSelect.sky]]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setChatCategory("알림")} >
                            <DefText text="알림" style={[styles.chatCateText, chatCategory == "알림" && [fweight.b, {color:'#000000'}]]} />
                            <Box style={[styles.chatCateOnBox, chatCategory == "알림" && [colorSelect.sky]]} />
                        </TouchableOpacity>
                    </HStack>
                </Box>
                {
                    chatCategory == "메세지" && 
                    <Box>
                        {
                            chatList != "" ?
                            chatList.map((item, index) => {
                                return(
                                    <TouchableOpacity key={index} onPress={()=>navigation.navigate("ExpertMessageView", {"idx":item.idx, "aidx":item.auction_idx, "atype":item.auction_type,  "chatName":item.mb_name, "chatPhone":item.mb_phone})}>
                                        <Box px='25px' py='15px' borderBottomWidth={1} borderBottomColor="#F3F4F5">
                                            <HStack alignItems={'center'} justifyContent='space-between'>
                                                {
                                                    item.profileUrl != "" ?
                                                    <Box width='60px' height='60px' borderRadius={'10px'} overflow='hidden'>
                                                        <Image 
                                                            source={{uri:BASE_URL + "/data/file/member/" + item.profileUrl}}
                                                            alt='홍길동'
                                                            style={[
                                                                {
                                                                    width: 60,
                                                                    height: 60,
                                                                    borderRadius: 10,
                                                                    resizeMode:'stretch'
                                                                }
                                                            ]}
                                                        />
                                                    </Box>
                                                    :
                                                    <Box width='60px' height='60px' borderRadius={'10px'} overflow='hidden'>
                                                        <Image 
                                                            source={{uri:BASE_URL + "/images/appLogo.png"}}
                                                            alt={userInfo?.ex_name}
                                                            style={[
                                                                {
                                                                    width: 60,
                                                                    height: 60,
                                                                    borderRadius: 10,
                                                                    resizeMode:'stretch'
                                                                }
                                                            ]}
                                                        />
                                                    </Box>
                                                }
                                                
                                                <Box width={(width - 50) - 80}>
                                                    {/* <HStack mb='10px'>
                                                        <DefText text={item.mb_name} style={[styles.chatPerson]}/>
                                                        <DefText text="님" style={[styles.chatPerson]} />
                                                    </HStack> */}
                                                    {
                                                        item.auction_type == "시스템 메시지" ?
                                                        <HStack mb='10px'>
                                                            <DefText text={"내집이사 고객만족센터"} style={[styles.chatPerson]} />
                                                        </HStack>
                                                        :
                                                        <HStack mb='10px'>
                                                            <DefText text={item.mb_name} style={[styles.chatPerson]}/>
                                                            <DefText text=" 님" style={[styles.chatPerson, {color:'#979797'}]} />
                                                        </HStack>
                                                    }
                                                    <DefText text={textLengthOverCut(item.one, 20, '...')} style={[styles.chatInfo]} />
                                                    <Box position={'absolute'} top='0' right='0'>
                                                        <DefText text={item.date.substring(0,10)} style={[styles.chatdate]} />
                                                    </Box>
                                                </Box>
                                                
                                            </HStack>
                                            {
                                                item.chat_cnt != "0" &&
                                                <Box position={'absolute'} bottom='15px' right='25px' width='25px' height='25px' borderRadius={'20px'} backgroundColor='#f00' justifyContent={'center'} alignItems='center'>
                                                    <DefText text={item.chat_cnt} style={[fsize.fs12, {color:'#fff'}]} />
                                                </Box>
                                            }
                                        </Box>
                                    </TouchableOpacity>
                                )
                            })
                            :
                            <Box alignItems={'center'} justifyContent='center' py='40px'>
                                <DefText text="채팅내역이 없습니다." />
                            </Box>
                        }
                    </Box>
                }
                {
                    chatCategory == "알림" &&
                    <Box px='25px' py='20px'>
                        {
                            pushList != "" ?
                            pushList.map((item, index) => {
                                return(
                                    <Box style={[styles.pushBox]} key={index} mt='20px'>
                                        <DefText text={"["+ item.push_type +"]"} style={[styles.pushTitle]} />
                                        <DefText text={item.p_title} style={[styles.pushContent]} />
                                        <HStack justifyContent={'flex-end'} mt='20px'>
                                            <DefText text={item.p_datetime.substring(0, 10)} style={[styles.pushDate]} />
                                        </HStack>
                                    </Box>
                                )
                            })
                            :
                            <Box py='40px' alignItems={'center'} justifyContent='center'>
                                <DefText text="푸쉬 메세지 내역이 없습니다." />
                            </Box>
                        }
                    </Box> 
                }
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    chatCateText: {
        ...fweight.m,
        color:'#CDCDCD',
        paddingBottom:15
    },
    chatCateOnBox: {
        width:'100%',
        height:3,
        backgroundColor:'#fff',
        position: 'absolute',
        bottom:0,
        left:0
    },
    chatPerson: {
        ...fweight.b
    },
    chatInfo: {
        ...fsize.fs12
    },
    chatdate: {
        ...fsize.fs12
    },
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
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_chatCnt: (user) => dispatch(UserAction.member_chatCnt(user))
    })
)(ExpertMessage);