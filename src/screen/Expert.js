import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack } from 'native-base';
import { DefButton, DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import Api from '../Api';
import { useIsFocused } from '@react-navigation/native';

const {width, height} = Dimensions.get("window");

const Expert = (props) => {

    const {navigation} = props;

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
               //console.log('등록된 이사전문가 리스트: ', arrItems);
               setExpertList(arrItems);
              

            }else{
               console.log('등록된 이사전문가 리스트 실패!', resultItem);
              
            }
        });
        
        await setExpertLoading(false);
    }

    useEffect(()=> {
        if(isFocused){
            expertListApi();
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
                        expertList != "" ?
                        expertList.map((item, index) => {
                            return(
                                <Box mt='10px' px='25px' key={index}>
                                    <HStack justifyContent={'space-between'}  alignItems={'center'}>
                                        <Box>
                                            <HStack alignItems={'flex-end'}>
                                                <DefText text={item.ex_name} style={[fsize.fs15, fweight.b, {marginRight:5}]} />
                                                <DefText text="이사전문가" style={[fsize.fs13, fweight.b, {color:'#979797'}]} />
                                            </HStack>
                                            <DefText text={item.ex_service_name} style={[fsize.fs12, {marginVertical:10}]} />
                                            <DefText text={item.ex_move_status} style={[fsize.fs13, {color:'#6C6C6C'}]} />
                                            {
                                                item.star_avg != "0" && 
                                                <HStack mt='10px'>
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
                                            }
                                            
                                        </Box>
                                        <Box>
                                            <Image 
                                                source={require('../images/expertEx2.png')}
                                                alt='홍길동'
                                                style={[
                                                    {
                                                        width: (width - 50) * 0.26,
                                                        height: (width - 50) * 0.26,
                                                        borderRadius: 10,
                                                        resizeMode:'contain'
                                                    }
                                                ]}
                                            />
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
                                            <DefText text={ item.ex_service_status + ' 전문'} style={[styles.certiLabel]} />
                                            <HStack alignItems={'center'}>
                                                <DefText text='이사 건수 ' style={[styles.certiSmall]} />
                                                <DefText text={item.move_cnt} style={[styles.certiLabel, {borderBottomWidth:1}]}/>
                                                <DefText text=' 건' style={[styles.certiSmall]} />
                                            </HStack>
                                        </HStack>
                                        <HStack justifyContent={'space-between'} alignItems='center' mt='15px' >
                                            <DefText text={'경력 ' + item.career_gap} style={[styles.certiLabel]} />
                                            <HStack alignItems={'center'}>
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
                                        onPress={()=>navigation.navigate("ReservationExpert", {"idx":item.idx})}
                                    />
                                </Box>
                            )
                        })
                        :
                        <Box>
                            <DefText text="내집이사에 등록된 이사전문가가 없습니다." />
                        </Box>
                    }
                
                </ScrollView>
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
        ...fsize.fs14
    },
    certiInfoBtn: {
        width:width - 50,
        marginTop:30
    },
    certiInfoBtnText: {
        ...fweight.m
    }
})

export default Expert;