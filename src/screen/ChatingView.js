import React, {useState, useEffect, useCallback} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import {textLengthOverCut} from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import ChatHeader from '../components/ChatHeader';
import { GiftedChat, Composer, Send, Bubble } from 'react-native-gifted-chat';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Message from 'react-native-gifted-chat/lib/Message';
import { renderBubble } from '../components/Chat';
import Api from '../Api';
import messaging from '@react-native-firebase/messaging';
import ImagePicker from 'react-native-image-crop-picker';
import ToastMessage from '../components/ToastMessage';
import DocumentPicker from 'react-native-document-picker';

const {width, height} = Dimensions.get("window");

const ChatingView = (props) => {

    const {navigation, userInfo, route} = props;
    const {params} = route;

    console.log("params", params);

    const [messages, setMessage] = useState([]);
    const [fileModal, setFileModal] = useState(false);

    useEffect(()=> {
        //console.log('???????');
        Api.send('member_chatRefresh', {'mid':userInfo.id, 'cidx':params.idx}, (args)=>{
           // console.log(":::::::::::::::::::::",args);
        });
    },[messages])

    const onSend = useCallback((messages = []) => {
        //console.log("messages", messages);
        //setMessage(messages);

        
        Api.send('chat_chatInsert', {"idx":params.idx, "aidx":params.aidx, "atype":params.atype,"id":userInfo.id, "content":messages[0].text, 'mname':userInfo.name}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('채팅 글쓰기 보기: ', resultItem);
              // setChatList(arrItems);
              //setMessage(arrItems)
              setMessage(arrItems)
            }else{
               console.log('채팅리스트 실패!', resultItem);
               //setExpertList([]);
            }
        });

    })


    const chatListApi = () => {
        Api.send('chat_chatList', {"idx":params.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
              // console.log('채팅리스트리스트 보기: ', arrItems);
              // setChatList(arrItems);
              setMessage(arrItems)

            }else{
               console.log('채팅리스트 실패!', resultItem);
               //setExpertList([]);
            }
        });
    }


    useEffect(()=> {
        chatListApi();
    }, [])


    const imgSelected = () => {
        ImagePicker.openPicker({
            width: width,
            height: width,
            cropping: true,
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: width * 1.5,
            compressImageQuality: 0.7,
            multiple:false
          }).then(image => {

            console.log('이미지 선택....',image);

            const my_photo = {
                idx:1,
                uri:image.path,
                type:image.mime,
                data:image.data,
                name:"chatImage.jpg"
            }

            _imgSendButton(my_photo);

            setFileModal(false);

          }).catch(e => {
            setFileModal(false);
            ToastMessage("갤러리 선택을 취소하셨습니다.");
          });
    }


    const _imgSendButton = (photo) => {


        console.log('photo::', photo)
        Api.send('chat_chatInsert', {"idx":params.idx, "aidx":params.aidx, "atype":params.atype,"id":userInfo.id,  'mname':userInfo.name, 'upfile':photo}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('채팅 글쓰기 보기123: ', arrItems);
              // setChatList(arrItems);
              //setMessage(arrItems)
              setMessage(arrItems)
            }else{
               console.log('채팅리스트 실패!', resultItem);
               //setExpertList([]);
            }
        });
    }

    const cameraSelected = () => {
        ImagePicker.openCamera({
            width: width,
            height: width,
            cropping: true,
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: width * 1.5,
            compressImageQuality: 0.7,
            multiple:false
          }).then(image => {
            console.log(image);

            const my_photo = {
                idx:1,
                uri:image.path,
                type:image.mime,
                data:image.data,
                name:"chatImage.jpg"
            }

            _imgSendButton(my_photo);

            setFileModal(false);
            
          }).catch(e => {
            console.log(Platform.OS, e.message);
            setFileModal(false);
            if(e.message == "Cannot run camera on simulator"){
                ToastMessage("카메라를 실행할 수 없습니다.");
            }else{
                ToastMessage("카메라 촬영을 취소하셨습니다.");
            }
            
          });
          
    }

    //파일첨부
    const _fileSend = async () => {
        try{
            const res = await DocumentPicker.pick({
                type:DocumentPicker.types.allFiles
            })
            fileSendApi(res[0]);
            setFileModal(false);
        }catch(err){
            console.log("파일첨부 에러",err);
            if(DocumentPicker.isCancel(err)){
                Alert.alert("파일첨부를 취소하셨습니다.");
                setFileModal(false);
            }else{
                Alert.alert("Unknown Error:" + JSON.stringify(err));
                setFileModal(false);
                throw err;
            }
        }
    }

    const fileSendApi = (file) => {
        console.log("file", file);

        Api.send('chat_chatInsert', {"idx":params.idx, "aidx":params.aidx, "atype":params.atype,"id":userInfo.id, 'mname':userInfo.name, 'upfile':file}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('채팅 파일첨부 보기: ', arrItems, resultItem);
              // setChatList(arrItems);
              //setMessage(arrItems)
              setMessage(arrItems)
            }else{
               console.log('채팅 파일첨부 실패!', resultItem);
               //setExpertList([]);
            }
        });
    }

    const renderComposer = (props) => {
        return(
            <HStack alignItems={'center'} px='20px'  backgroundColor={'#fff'} justifyContent='space-between'>
                <TouchableOpacity onPress={()=>setFileModal(true)}>
                    <Image source={require('../images/chatPlusButton.png')} style={{width:23, height:23, resizeMode:'contain'}} alt='이미지 선택'/>
                </TouchableOpacity>
                <Composer 
                    {...props}
                />
                <Send 
                    {...props}
                />
            </HStack>
        )
    }

    const renderComposerSystem = (props) => {
        return(
            <Box height={'30px'} width={width} alignItems='center' backgroundColor={'#0195ff'} position='absolute' top='0'>
                <DefText text="내집이사 고객만족센터(발신전용)" style={{color:'#fff'}} />
            </Box>
        )
    }


    useEffect(()=>{
        messaging().onMessage((remoteMessage) => { 
            console.log('채팅apiapi....remoteMessage', remoteMessage);
            chatListApi();
        });
    },[])

    return (
        <Box flex={1} >
            <ChatHeader navigation={navigation} headerTitle={ params.chatName != null ? params.chatName + "님" : '내집이사 고객만족센터 (발신전용)'} phoneNumbers={params.chatPhone} phone={params.chatName != null ? '' : '시스템'  } />
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                label='전송'
                
                user={{
                    _id: userInfo.id,
                }}
                
                placeholder="메세지를 입력하세요"
                alignTop
                alwaysShowSend={ params.chatName != null ? true : false}
                scrollToBottom
                autoCapitalize="none"
                locale={'ko'}
                timeFormat={'LT'}
                color={'#333333'}
            
                // renderAvatarOnTop
                // renderDay={renderDay}
                // renderTime={ChatTime}
                // renderMessage={renderMessage}
                
                // renderLoading={renderLoading}
               
                 messagesContainerStyle={{ backgroundColor: '#F3F4F5', paddingHorizontal:0}}
                 textInputProps={{ autoCapitalize: 'none' }}
                 showUserAvatar={false}
                 wrapInSafeArea={false}
                 renderBubble={renderBubble}
                 renderComposer={ params.chatName != null ? renderComposer : renderComposerSystem}
                 renderAvatarOnTop={true}
                 //renderAvatar={(props)=>console.log(props)}
            />
            <Modal isOpen={fileModal} onClose={()=>setFileModal(false)}>
                    <Modal.Content width={width - 50}>
                        <Modal.Body py='25px' px='20px'>
                            <DefText text={"전송할 파일유형을 선택하세요."} style={[styles.modalText]}/>
                            <HStack justifyContent={'space-between'} mt='25px'>
                                <TouchableOpacity onPress={imgSelected} style={[styles.modalButton, colorSelect.black]}>
                                    <HStack alignItems={'center'}>
                                        
                                        <DefText text='갤러리' style={[fweight.m, {color:'#fff',  lineHeight:19}]} />
                                    </HStack>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={cameraSelected} style={[styles.modalButton, colorSelect.sky]}>
                                    <HStack alignItems={'center'}>
                                        <DefText text='카메라' style={[fweight.m, {color:'#fff',  lineHeight:19}]} />
                                    </HStack>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={_fileSend} style={[styles.modalButton, colorSelect.gray]}>
                                    <HStack alignItems={'center'}>
                                        <DefText text='파일' style={[fweight.m, {color:'#fff',  lineHeight:19}]} />
                                    </HStack>
                                </TouchableOpacity>
                            </HStack>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    modalText: {
        ...fweight.b,
        textAlign:'center'
    },
    modalButton: {
        width: (width - 90) * 0.31,
        height: 50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    })
)(ChatingView);