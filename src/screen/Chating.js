import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import {textLengthOverCut} from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';

const {width} = Dimensions.get("window");

const Chating = (props) => {

    const {navigation} = props;

    const [chatCategory, setChatCategory] = useState("메세지");

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
                        <TouchableOpacity>
                            <Box px='25px' py='15px' borderBottomWidth={1} borderBottomColor="#F3F4F5">
                                <HStack alignItems={'center'} justifyContent='space-between'>
                                    <Image 
                                        source={require('../images/expertEx2.png')}
                                        alt='홍길동'
                                        style={[
                                            {
                                                width: 60,
                                                height: 60,
                                                borderRadius: 10,
                                                resizeMode:'contain'
                                            }
                                        ]}
                                    />
                                    <Box width={(width - 50) - 80}>
                                        <HStack mb='10px'>
                                            <DefText text="홍길동" style={[styles.chatPerson]}/>
                                            <DefText text=" 전문가" style={[styles.chatPerson, {color:'#979797'}]} />
                                        </HStack>
                                        <DefText text={textLengthOverCut("안녕하세요...이사 업체인데요 언제쯤 이사", 15, '...')} style={[styles.chatInfo]} />
                                        <Box position={'absolute'} top='0' right='0'>
                                            <DefText text="22.06.30" style={[styles.chatdate]} />
                                        </Box>
                                    </Box>
                                </HStack>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                }
                {
                    chatCategory == "알림" &&
                    <Box px='25px' py='20px'>
                        <Box style={[styles.pushBox]}>
                            <DefText text="[앱 푸시 메세지]" style={[styles.pushTitle]} />
                            <DefText text="2022.06.01에 요청한 역경매 시간이 30분 남았어요!" style={[styles.pushContent]} />
                            <HStack justifyContent={'flex-end'} mt='20px'>
                                <DefText text="2022.06.01" style={[styles.pushDate]} />
                            </HStack>
                        </Box>
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

export default Chating;