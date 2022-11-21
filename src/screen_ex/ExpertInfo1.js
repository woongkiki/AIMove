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

const {width, height} = Dimensions.get("window");

const ExpertInfo1 = (props) => {

    const {navigation, member_info, member_update, userInfo} = props;

    //console.log("userInfo:::", userInfo);

    const [serviceName, setServiceName] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [categorySelectList, setCategorySelectList] = useState([]);
    const [rightDisable, setRightDisalbe] = useState(true);

    const serviceNameChange = (text) => {
        setServiceName(text);
    }


    const categorySelect = (category) => {

       
        if(!categorySelectList.includes(category)){

            if(categorySelectList.length == 2){
                ToastMessage("2개까지 선택할 수 있습니다.");
                return false;
            }

            setCategorySelectList([...categorySelectList, category]);

        }else{
            const categorySelectRe = categorySelectList.filter(item => category !== item);
            setCategorySelectList(categorySelectRe);
        }

      
        
    }


    const serviceAdvantage = () => {
        Api.send('service_category', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('장점 리스트: ', resultItem, arrItems);
               setCategoryList(arrItems);
            }else{
               console.log('장점 리스트 출력 실패!', resultItem);

            }
        });
    }

    useEffect(()=>{
        serviceAdvantage();

        if(userInfo != null){
            setServiceName(userInfo.ex_service_name);

            // if(userInfo.ex_advantages.length > 0){
                
            // }

        }

    }, []);

    useEffect(()=>{
        if(serviceName.length > 0 && categorySelectList.length > 0){
            
            setRightDisalbe(false);
        }
    }, [serviceName, categorySelectList]);


    const expertUpdate = async () => {

        let advantage = categorySelectList.join("^")

        const formData = new FormData();
        formData.append("method", 'expert_update');
        formData.append("ex_move_status", userInfo.ex_move_status);
        formData.append("phone", userInfo.ex_phone);
        formData.append("id", userInfo.ex_id);
        formData.append("ex_service_status", userInfo.ex_service_status);
        formData.append("ex_start_date", userInfo.ex_start_date);
        formData.append("ex_addr", userInfo.ex_addr);
        formData.append("ex_select_reason", userInfo.ex_select_reason);
        formData.append("ex_worth", userInfo.ex_worth);
        formData.append("ex_refund", userInfo.ex_refund);
        formData.append("ex_area", userInfo.ex_area);
        formData.append("register_status", "Y");

        //추가
        formData.append("ex_service_name", serviceName);
        formData.append("ex_advantages", advantage);


        const update = await member_update(formData);

        if(update.result){
            
            expertInfo();

            navigation.navigate("ExpertInfo2");
           //console.log(update);
        }
    }

    const expertInfo = async () => {
        const formData = new FormData();
        formData.append('method', 'expert_info');
        formData.append('id', userInfo.ex_id);
        const member_info_list = await member_info(formData);

        console.log('member_info_list:::::',member_info_list);
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="업체 정보 입력" navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <Box>
                        <HStack>
                            <Box style={[styles.pageBox]}>
                                <DefText text="1 / 3" style={[styles.pageNum]} />
                            </Box>
                        </HStack>
                        <Box style={[styles.gageBox]}>
                            <Box style={[styles.gageSky]} />
                        </Box>
                    </Box>
                    <Box mt='20px'>
                        <DefText text="서비스 이름을 만들어주세요." style={[styles.labelTitle]} />
                        <DefInput
                            placeholder={'한눈에 알 수 있는 서비스 이름을 적어주세요.'}
                            inputStyle={{width:width - 50, height:160, borderWidth:1, borderColor:'#CCCCCC', borderRadius:5, paddingTop:10}}
                            value={serviceName}
                            multiline={true}
                            onChangeText={serviceNameChange}
                            textAlignVertical='top'
                        />
                    </Box>
                    <Box mt='20px'>
                        <DefText text="서비스의 장점 최대 2개를 선택해 주세요." style={[styles.labelTitle, {marginBottom:0}]} />
                        {
                            categoryList != "" &&
                            <HStack flexWrap={'wrap'}>
                            {
                                categoryList.map((item, index) => {
                                    return(
                                        <TouchableOpacity onPress={()=>categorySelect(item.ca_name)} key={index} style={[styles.advanButton, (index + 1) % 3 == 0 ? {marginRight:0} : {marginRight: (width-50) * 0.02}, categorySelectList.includes(item.ca_name) && [colorSelect.sky]]}>
                                            <DefText text={item.ca_name} style={[styles.advanButtonText, categorySelectList.includes(item.ca_name) && [{color:'#fff'}]]} />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            </HStack>
                        }
                    </Box>
                </Box>
            </ScrollView>
            <BottomButton 
                leftText='이전'
                rightText={'다음'}
                leftonPress={()=>navigation.goBack()}
                rightDisable={ rightDisable }
                rightBtnStyle={ !rightDisable ? colorSelect.sky : colorSelect.gray }
                rightonPress={expertUpdate}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    pageNum: {
        ...fsize.fs12,
        ...fweight.m
    },
    pageBox: {
        paddingVertical:5,
        paddingHorizontal:10,
        backgroundColor:'#F8F8F8',
        borderRadius:15
    },
    gageBox: {
        width: width - 50,
        height:6,
        borderRadius:3,
        backgroundColor:'#F8F8F8',
        marginTop:20
    },
    gageSky: {
        width: (width-50) * 0.33,
        height:6,
        borderRadius:3,
        ...colorSelect.sky
    },
    labelTitle: {
        ...fsize.fs18,
        ...fweight.b,
        marginBottom:10
    },
    advanButton: {
        width: (width-50) * 0.32,
        height: 36,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        backgroundColor:'#DFDFDF',
        marginTop:10
    },
    advanButtonText: {
        ...fsize.fs14
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
)(ExpertInfo1);