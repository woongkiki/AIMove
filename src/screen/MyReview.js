import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import { numberFormat } from '../common/DataFunction';
import { BASE_URL } from '../Utils/APIConstant';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import { useIsFocused } from '@react-navigation/native';

const {width, height} = Dimensions.get("window");
const buttonWidth = (width - 90) * 0.48;

const MyReview = (props) => {

    const {navigation, userInfo} = props;

    const isFocused = useIsFocused(); //focus 되었는지 아닌지 true, false 값 반환

    const [reviewList, setReivewList] = useState([]);

    const reviewApi = () => {
        Api.send('review_myList', {'ex_id':userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('내가 쓴 후기 보기: ', resultItem, arrItems);
               setReivewList(arrItems);
               //setCareer(arrItems);
            }else{
               console.log('내가 쓴 후기 리스트 실패!', resultItem);
               // ToastMessage(resultItem.message);
                // setServiceStartDate("");
            }
        });
    }

    useEffect(()=> {
        if(isFocused){
            reviewApi();
        }
    }, [isFocused])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="내가 작성한 후기" navigation={navigation} />
            <ScrollView>
                <Box py='20px' px='25px'>
                    {
                        reviewList != "" ?
                        reviewList.map((item, index)=> {
                            return(
                                <Box style={[styles.reviewBox]} key={index} mt={index == 0 ? '0' : '20px'}>
                                    <HStack alignItems={'center'} justifyContent='space-between'>
                                        <HStack alignItems={'center'}>
                                            <DefText text={item.ex_names} style={[styles.expertName]} />
                                            <DefText text=" 전문가" style={[styles.expertJob]} />
                                        </HStack>
                                        <DefText text={item.review_date.substr(0,10)} style={[styles.reviewDate]} />
                                    </HStack>
                                    {
                                        item.scoreAvg == "1" &&
                                        <Image
                                            source={{uri:BASE_URL + "/images/reviewScore1.png",}}
                                            alt='별점'
                                            style={[
                                                {
                                                    width: 82,
                                                    height: 13,
                                                    resizeMode:'stretch',
                                                    marginVertical:10
                                                }
                                            ]}
                                        />
                                    }
                                    {
                                        item.scoreAvg == "2" &&
                                        <Image
                                            source={{uri:BASE_URL + "/images/reviewScore2.png",}}
                                            alt='별점'
                                            style={[
                                                {
                                                    width: 82,
                                                    height: 13,
                                                    resizeMode:'stretch',
                                                    marginVertical:10
                                                }
                                            ]}
                                        />
                                    }
                                    {
                                        item.scoreAvg == "3" &&
                                        <Image
                                            source={{uri:BASE_URL + "/images/reviewScore3.png",}}
                                            alt='별점'
                                            style={[
                                                {
                                                    width: 82,
                                                    height: 13,
                                                    resizeMode:'stretch',
                                                    marginVertical:10
                                                }
                                            ]}
                                        />
                                    }
                                    {
                                        item.scoreAvg == "4" &&
                                        <Image
                                            source={{uri:BASE_URL + "/images/reviewScore4.png",}}
                                            alt='별점'
                                            style={[
                                                {
                                                    width: 82,
                                                    height: 13,
                                                    resizeMode:'stretch',
                                                    marginVertical:10
                                                }
                                            ]}
                                        />
                                    }
                                    {
                                        item.scoreAvg == "5" &&
                                        <Image
                                            source={{uri:BASE_URL + "/images/reviewScore5.png",}}
                                            alt='별점'
                                            style={[
                                                {
                                                    width: 82,
                                                    height: 13,
                                                    resizeMode:'stretch',
                                                    marginVertical:10
                                                }
                                            ]}
                                        />
                                    }
                                   
                                    <DefText text={item.review_open} style={[styles.reviewContent]} />
                                    <HStack justifyContent={'space-between'} alignItems='center' mt='20px'>
                                        <TouchableOpacity onPress={()=>navigation.navigate("ReservationExpert", {"id":item.expert_id, "pay":"S"})} style={[styles.reviewBoxBtn, [colorSelect.gray]]}>
                                            <DefText text="업체정보" style={[styles.reviewBoxBtnText]} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>navigation.navigate("ReviewScreen2", {"idx":item.idx})} disabled={ item.review_ins == "Y" ? false : true } style={[styles.reviewBoxBtn, item.review_ins == "Y" ? [colorSelect.sky] : [colorSelect.gray]]}>
                                            <DefText text={ item.review_ins == "Y" ? "후기수정" : "수정불가"} style={[styles.reviewBoxBtnText, {color:'#fff'}]}  />
                                        </TouchableOpacity>
                                    </HStack>
                                </Box>
                            )
                        })
                        
                        :
                        <Box py='40px' justifyContent={'center'} alignItems='center'>
                            <DefText text="등록된 후기가 없습니다." />
                        </Box>
                    }
                    
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    reviewBox: {
        padding:20,
        borderRadius:16,
        borderWidth:1,
        borderColor:'#AEBFCF'
    },
    expertName: {
        ...fweight.b,
    },
    expertJob: {
        ...fweight.b,
        color:'#979797'
    },
    reviewDate: {
        ...fsize.fs12,
        color:'#979797'
    },
    reviewContent: {
        ...fsize.fs13,
    },
    reviewBoxBtn: {
        width: buttonWidth,
        height: 40,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
    },
    reviewBoxBtnText: {
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
    })
)(MyReview);