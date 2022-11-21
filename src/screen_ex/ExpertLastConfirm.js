import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Image, Platform, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, BottomButton, DefInput } from '../common/BOOTSTRAP';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import SubHeader from '../components/SubHeader';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import Swiper from 'react-native-swiper';
import { BASE_URL } from '../Utils/APIConstant';

const {width, height} = Dimensions.get("window");

const ExpertLastConfirm = (props) => {

    const {navigation, userInfo, member_info, member_update} = props;


    const [career, setCareer] = useState("");
    const [profileImage, setProfileImage] = useState([]);

    //console.log("최종 서비스 검토", userInfo);

    const dateSum = () => {
        Api.send('career_sum', {'career_date':userInfo.ex_start_date}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('경력일자 계산: ', resultItem, arrItems);
               setCareer(arrItems);
            }else{
               console.log('경력일자 실패!', resultItem);
               // ToastMessage(resultItem.message);
                // setServiceStartDate("");
            }
        });
    }


    const expertProfile = () => {
        Api.send('expert_profileImageSend', {'ex_id':userInfo.ex_id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('프로필 이미지 리스트: ', resultItem, arrItems);
               setProfileImage(arrItems);
            }else{
               console.log('프로필 이미지 실패!', resultItem);
               // ToastMessage(resultItem.message);
                // setServiceStartDate("");
            }
        });
    }


    const expertRegisterEnd = async () => {

        console.log("12321323");

        const formData = new FormData();
        formData.append("method", 'expert_update');
        formData.append("ex_move_status", userInfo.ex_move_status);
        formData.append("phone", userInfo.ex_phone);
        formData.append("id", userInfo.ex_id);
        formData.append("ex_service_status", userInfo.ex_service_status);
        formData.append("ex_start_date", userInfo.ex_start_date);
        formData.append("ex_addr", userInfo.ex_addr);
        formData.append("ex_service_name", userInfo.ex_service_name);
        formData.append("ex_advantages", userInfo.ex_advantages);
        formData.append("ex_select_reason", userInfo.ex_select_reason);
        formData.append("ex_worth", userInfo.ex_worth);
        formData.append("ex_refund", userInfo.ex_refund);

        //추가
        formData.append("register_status", "N");

        const update = await member_update(formData);

        if(update.result){
            
            expertInfo();

            //navigation.navigate("ExpertLastConfirm");
            // navigation.reset({
            //     routes: [{ name: 'ExpertNavi', screen:'PlayMove' }],
            // });    

            navigation.replace("ExpertNavi", {
                screen: "PlayMove",
                params:{
                    moveCate : "소형 이사" ,
                    homeCate: "",
                }
            })
           console.log(update);
        }
    }

    const expertInfo = async () => {

        const formData = new FormData();
        formData.append("method", "expert_myInfos");
        formData.append("id", userInfo.ex_id);

        const memberInfo = await member_info(formData);
    }

    // const expertInfo = async () => {
    //     const formData = new FormData();
    //     formData.append('method', 'expert_info');
    //     formData.append('id', userInfo.ex_id);
    //     const member_info_list = await member_info(formData);

    //     console.log('member_info_list:::::',member_info_list);
    // }


    useEffect(()=> {
        expertProfile();
        dateSum();

        console.log(userInfo);
    },[])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="최종 서비스 검토" navigation={navigation} />
            <ScrollView>
                {                    
                    profileImage != "" ?
                    <Swiper
                        loop={true}
                        height={227}
                        dot={
                            <Box
                            style={{
                                backgroundColor: 'rgba(0,0,0,.3)',
                                width: 7,
                                height: 7,
                                borderRadius: 7,
                                marginLeft: 7,
                                marginRight: 7
                            }}
                            />
                        }
                        activeDot={
                            <Box
                            style={{
                                backgroundColor: '#fff',
                                width: 7,
                                height: 7,
                                borderRadius: 7,
                                marginLeft: 7,
                                marginRight: 7
                            }}
                            />
                        }
                        paginationStyle={{
                            bottom: 20
                        }}
                    >
                        {
                            profileImage.map((item, index) => {
                                return(
                                    
                                    <Image 
                                        source={{uri:BASE_URL + "/data/file/expert/" + item.f_file}}
                                        alt="전문가 등록 배너.." 
                                        style={[{
                                            width:width,
                                            height:227,
                                            resizeMode:'stretch'
                                        }]}
                                        key={index}
                                    />
                                )
                            })
                        }
                    </Swiper>
                    :
                    <Box>
                        <Image 
                            source={{ uri: BASE_URL + '/images/bigThumb.png'}}
                            style={{
                                width: width,
                                height: width / 1.71,
                                resizeMode:'stretch'
                            }}                                
                        />
                    </Box>
                }
                <Box px='25px' py='20px'>
                    <DefText text={userInfo?.ex_service_name} />
                    <HStack>
                        {
                            userInfo.ex_advantages.split("^").map((item, index) => {
                                return(
                                    <Box key={index} style={[styles.categoryBox]}>
                                        <DefText text={item} style={[styles.categoryBoxText]} />
                                    </Box>
                                )
                            })
                        }
                    </HStack>
                </Box>
                <Box borderTopWidth={7} borderTopColor='#F3F4F5' px='25px' py='20px'>
                    <HStack>
                        {
                            profileImage != "" ?
                            <Image 
                                source={{uri:BASE_URL + "/data/file/expert/" + profileImage[0].f_file}}
                                alt={userInfo.ex_name}
                                style={[{
                                    width:120,
                                    height:121,
                                    resizeMode:'stretch',
                                    borderRadius: 20,
                                }]}
                            />
                            :
                            <Image 
                                source={{uri:BASE_URL + "/images/appLogo.png"}}
                                alt={userInfo.ex_name}
                                style={[{
                                    width:120,
                                    height:121,
                                    resizeMode:'stretch',
                                    borderRadius: 20,
                                }]}
                            />
                        }
                        <VStack justifyContent={'space-around'} py='20px' pl='15px' width={width-170}>
                            <HStack alignItems={'flex-end'} mb='10px'>
                                <DefText text={userInfo?.ex_name} style={[styles.expertTitle]} />
                                <DefText text={" 전문가님"} style={[styles.expertTitleGray]} />
                            </HStack>
                            <DefText text={userInfo?.ex_service_status} style={[styles.expertType]} />
                            {
                                career != "" &&
                                <DefText text={'경력 ' + career} style={[styles.expertType]}  />
                            }
                           
                        </VStack>
                    </HStack>
                </Box>
                <Box borderTopWidth={7} borderTopColor='#F3F4F5' px='25px' py='20px'>
                    <DefText text={"전문가님의 서비스를 선택해야하는\n이유가 무엇인가요?"} />
                    <HStack justifyContent={'space-between'} alignItems='center' mt='20px'>
                    {
                        profileImage != "" ?
                        <Image 
                            source={{uri:BASE_URL + "/data/file/expert/" + profileImage[0].f_file}}
                            alt={userInfo.ex_name}
                            style={[{
                                width:(width - 50) / 3,
                                height:(width - 50) / 3,
                                resizeMode:'stretch',
                                borderRadius: 20,
                            }]}
                        />
                        :
                        <Image 
                            source={{uri:BASE_URL + "/images/appLogo.png"}}
                            alt={userInfo.ex_name}
                            style={[{
                                width:(width - 50) / 3,
                                height:(width - 50) / 3,
                                resizeMode:'stretch',
                                borderRadius: 20,
                            }]}
                        />
                    }
                        <Box>
                            <Box>
                                <Box style={[styles.bubbleBoxTri]} />
                                <Box style={[styles.bubbleBoxSquare]} >
                                    <DefText text={userInfo?.ex_select_reason} style={[fsize.fs13]} />
                                </Box>
                            </Box>
                        </Box>
                    </HStack>
                    
                </Box>
                <Box borderTopWidth={7} borderTopColor='#F3F4F5' px='25px' py='20px'>
                    <DefText text="이사하면서 가장 보람을 느낄 때는 언제입니까?" />
                    <HStack justifyContent={'space-between'} alignItems='center' mt='20px'>
                        {
                            profileImage != "" ?
                            <Image 
                                source={{uri:BASE_URL + "/data/file/expert/" + profileImage[0].f_file}}
                                alt={userInfo.ex_name}
                                style={[{
                                    width:(width - 50) / 3,
                                    height:(width - 50) / 3,
                                    resizeMode:'stretch',
                                    borderRadius: 20,
                                }]}
                            />
                            :
                            <Image 
                                source={{uri:BASE_URL + "/images/appLogo.png"}}
                                alt={userInfo.ex_name}
                                style={[{
                                    width:(width - 50) / 3,
                                    height:(width - 50) / 3,
                                    resizeMode:'stretch',
                                    borderRadius: 20,
                                }]}
                            />
                        }
                        <Box>
                            <Box>
                                <Box style={[styles.bubbleBoxTri]} />
                                <Box style={[styles.bubbleBoxSquare]} >
                                    <DefText text={userInfo?.ex_worth} style={[fsize.fs13]} />
                                </Box>
                            </Box>
                        </Box>
                    </HStack>
                </Box>
            </ScrollView>
            <TouchableOpacity onPress={expertRegisterEnd} style={[styles.exCompleteButton]}>
                <DefText text="검토완료" style={[styles.exCompleteButtonText]} />
            </TouchableOpacity>
        </Box>
    );
};

const styles = StyleSheet.create({
    categoryBox: {
        height:26,
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:10,
        borderRadius:10,
        marginTop:10,
        marginRight:10,
        ...colorSelect.sky
    },
    categoryBoxText: {
        ...fsize.fs13,
        ...fweight.b,
        color:'#fff'
    },
    expertTitle: {
        ...fsize.fs17,
        ...fweight.b
    },
    expertTitleGray: {
        ...fsize.fs15,
        color:'#979797'
    },
    expertType: {
        ...fsize.fs13,   
    },
    bubbleBoxSquare: {
        width: (width - 65) - ((width - 20) / 3),
        padding:15,
        borderRadius:10,
        backgroundColor:'#EEEEEE',
        minHeight:65
    },
    bubbleBoxTri: {
        position: "absolute",
        left: -16,
        bottom: 0,
        width: 0,
        height: 0,
        borderTopColor: "transparent",
        borderTopWidth: 24,
        borderRightWidth: 24,
        borderRightColor: "#eee",
        borderBottomWidth: 0,
        borderBottomColor: "transparent",
    },
    exCompleteButton: {
        width: width,
        height: 50,
        alignItems:'center',
        justifyContent:'center',
        ...colorSelect.sky
    },
    exCompleteButtonText: {
        color:'#fff',
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
        member_update: (user) => dispatch(UserAction.member_update(user)), //회원정보 변경
    })
)(ExpertLastConfirm);