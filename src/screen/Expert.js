import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack } from 'native-base';
import { DefButton, DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import Api from '../Api';
import { useIsFocused } from '@react-navigation/native';
import { BASE_URL } from '../Utils/APIConstant';
import { textLengthOverCut } from '../common/DataFunction';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const {width, height} = Dimensions.get("window");

const Expert = (props) => {

    const {navigation, member_chatCnt, userInfo} = props;

    const isFocused = useIsFocused(); //focus 되었는지 아닌지 true, false 값 반환

    const [expertLoading, setExpertLoading] = useState(true);
    const [expertCategory, setExpertCategory] = useState("별점순");
    const [expertList, setExpertList] = useState([]);

    const expertListApi = async () => {
        await setExpertLoading(true);
        await Api.send('expert_list', {'category':expertCategory}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('등록된 이사전문가 리스트: ', arrItems, resultItem);
               setExpertList(arrItems);
              

            }else{
               console.log('등록된 이사전문가 리스트 실패!', resultItem);
              
            }
        });
        
        await setExpertLoading(false);
    }

    const chatCntHandler = async () => {
        const formData = new FormData();
        formData.append('mid', userInfo.id);
        formData.append('method', 'member_chatCnt');

        const chat_cnt = await member_chatCnt(formData);

        console.log("chat_cnt Expert Screen::", chat_cnt);
    }


    useEffect(()=> {
        if(isFocused){
            expertListApi();
            chatCntHandler(); //채팅카운트
        }
    }, [expertCategory, isFocused])

    return (
        <Box flex={1} backgroundColor='#fff'>
            {
                expertLoading ?
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size={'large'} color='#333' />
                </Box>
                :
           
                    expertList != "" ?
                    <ScrollView>
                        <Box px='25px' py='20px'>
                            <HStack>
                                <TouchableOpacity onPress={()=>setExpertCategory("별점순")} style={[{marginRight:25}]}>
                                    <DefText text="별점순" style={[styles.chatCateText, expertCategory == "별점순" && [fweight.b, {color:'#000000'}]]} />
                                    <Box style={[styles.chatCateOnBox, expertCategory == "별점순" && [colorSelect.sky]]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>setExpertCategory("후기순")} >
                                    <DefText text="후기순" style={[styles.chatCateText, expertCategory == "후기순" && [fweight.b, {color:'#000000'}]]} />
                                    <Box style={[styles.chatCateOnBox, expertCategory == "후기순" && [colorSelect.sky]]} />
                                </TouchableOpacity>
                            </HStack>
                            
                        </Box>
                        {
                            expertList != "" &&
                            expertList.map((item, index) => {
                                return(
                                    <Box mt={0} px='25px' py='25px' key={index} borderTopWidth={ index != 0 ? 7 : 0} borderTopColor='#F3F4F5'>
                                        <HStack justifyContent={'space-between'}  alignItems={'center'}>
                                            <Box width='70%'>
                                                <HStack alignItems={'flex-end'}>
                                                    <DefText text={item.ex_name} style={[fsize.fs15, fweight.b, {marginRight:5}]} />
                                                    <DefText text="이사전문가" style={[fsize.fs13, fweight.b, {color:'#979797'}]} />
                                                </HStack>
                                                <DefText text={textLengthOverCut(item.ex_service_name, 37, '...')} style={[fsize.fs12, {marginVertical:10}]} />
                                                <DefText text={item.ex_move_status} style={[fsize.fs13, {color:'#6C6C6C'}]} />
                                                
                                                <HStack alignItems={'center'} mt='10px'>
                                                    <HStack >
                                                        <Image
                                                            source={require('../images/starIcon.png')}
                                                            alt='별점'
                                                            style={[
                                                                {
                                                                    width: (width - 50) * 0.04,
                                                                    height: (width - 50) * 0.038,
                                                                    resizeMode:'contain'
                                                                }
                                                            ]}
                                                        />
                                                        <DefText text={item.star_avg} style={[fsize.fs12, fweight.b, {color:'#6C6C6C', marginLeft:5}]} />
                                                    </HStack>
                                                
                                                    <HStack alignItems={'center'} justifyContent={'flex-end'} ml='10px'>
                                                        <DefText text='이사 건수 ' style={[styles.certiSmall]} />
                                                        <DefText text={item.move_cnt} style={[styles.certiLabel, {borderBottomWidth:1}]}/>
                                                        <DefText text=' 건' style={[styles.certiSmall]} />
                                                    </HStack>
                                                
                                                    <HStack justifyContent={'space-between'} alignItems='center'  ml='10px'>
                                                        <HStack alignItems={'center'}  justifyContent={'flex-end'}>
                                                            <DefText text='후기 ' style={[styles.certiSmall]} />
                                                            <DefText text={item.review_cnt} style={[styles.certiLabel, {borderBottomWidth:1}]}/>
                                                            <DefText text=' 개' style={[styles.certiSmall]} />
                                                        </HStack>
                                                    </HStack>
                                                </HStack>
                                                
                                            </Box>
                                            <Box>
                                            {
                                                item.expert_profile != "" ?
                                                <Box width={(width - 50) * 0.26} height={(width - 50) * 0.26} borderRadius={(width - 50) * 0.26} overflow='hidden'>
                                                    <Image 
                                                        source={{uri:BASE_URL + '/data/file/expert/' + item.expert_profile}}
                                                        alt='홍길동'
                                                        style={[
                                                            {
                                                                width: (width - 50) * 0.26,
                                                                height: (width - 50) * 0.26,
                                                                resizeMode:'stretch'
                                                            }
                                                        ]}
                                                    />
                                                </Box>
                                                :
                                                <Box width={(width - 50) * 0.26} height={(width - 50) * 0.26} borderRadius={(width - 50) * 0.26} overflow='hidden'>
                                                    <Image 
                                                        source={{uri:BASE_URL + "/images/appLogo.png"}}
                                                        alt='홍길동'
                                                        style={[
                                                            {
                                                                width: (width - 50) * 0.26,
                                                                height: (width - 50) * 0.26,
                                                                resizeMode:'stretch'
                                                            }
                                                        ]}
                                                    />
                                                </Box>
                                            }
                                            </Box>
                                        </HStack>
                                        <HStack mt='20px' pb='20px'>
                                            <HStack alignItems={'center'} mr='10px'> 
                                                <Image 
                                                    source={require("../images/certiCheckIcon.png")}
                                                    style={{
                                                        width:16,
                                                        height:16,
                                                        resizeMode:'contain'
                                                    }}
                                                />
                                                <DefText text="본인인증완료" style={[styles.checkIcons, {color:'#65D97C'}]} />
                                            </HStack>
                                            {
                                                item.business_certi != "" && 
                                                <HStack alignItems={'center'}>
                                                    <Image 
                                                        source={require("../images/companyCheckIcon.png")}
                                                        style={{
                                                            width:16,
                                                            height:16,
                                                            resizeMode:'contain'
                                                        }}
                                                    />
                                                    <DefText text="사업자인증완료" style={[styles.checkIcons, {color:'#0E57FF'}]} />
                                                </HStack>
                                            }
                                        
                                        </HStack>
                                        <Box borderTopWidth={1} borderTopColor='#F3F4F5' pt='20px'>
                                            <HStack justifyContent={'space-between'} alignItems='center'>
                                                <Box width='70%'>
                                                    <DefText text={ item.ex_service_status + ' 전문'} style={[styles.certiLabel]} />
                                                </Box>
                                                <HStack alignItems={'center'} width='30%' justifyContent={'flex-end'}>
                                                    <DefText text='이사 건수 ' style={[styles.certiSmall]} />
                                                    <DefText text={item.move_cnt} style={[styles.certiLabel, {borderBottomWidth:1}]}/>
                                                    <DefText text=' 건' style={[styles.certiSmall]} />
                                                </HStack>
                                            </HStack>
                                            <HStack justifyContent={'space-between'} alignItems='center' mt='15px' >
                                                <Box width='70%'>
                                                    <DefText text={'경력 ' + item.career_gap} style={[styles.certiLabel]} />
                                                </Box>
                                                <HStack alignItems={'center'} width='30%' justifyContent={'flex-end'}>
                                                    <DefText text='후기 ' style={[styles.certiSmall]} />
                                                    <DefText text={item.review_cnt} style={[styles.certiLabel, {borderBottomWidth:1}]}/>
                                                    <DefText text=' 개' style={[styles.certiSmall]} />
                                                </HStack>
                                            </HStack>
                                        </Box>
                                        <DefButton 
                                            text="업체정보" 
                                            btnStyle={[styles.certiInfoBtn, {backgroundColor:'#DFDFDF'}]}
                                            textStyle={[styles.certiInfoBtnText]}
                                            onPress={()=>navigation.navigate("ReservationExpert", {"id":item.ex_id, "pay":"S"})}
                                        />
                                    </Box>
                                )
                            })
                          
                        }
                    
                    </ScrollView>
                    :
                    <Box justifyContent={'center'} alignItems='center' flex={1}>
                        <DefText text="내집이사에 등록된 이사전문가가 없습니다." />
                    </Box>
            }
            
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
    checkIcons: {
        ...fsize.fs12,
        marginLeft:5
    },
    certiLabel : {
        ...fsize.fs14,
        ...fweight.b
    },
    certiSmall: {
        ...fsize.fs12
    },
    certiInfoBtn: {
        width:width - 50,
        marginTop:30
    },
    certiInfoBtnText: {
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
        member_chatCnt: (user) => dispatch(UserAction.member_chatCnt(user))
    })
)(Expert);