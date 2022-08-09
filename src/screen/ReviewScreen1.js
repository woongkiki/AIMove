import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Box, VStack, HStack, Select, Modal } from 'native-base';
import { BottomButton, BottomNextButton, DefButton, DefInput, DefText } from '../common/BOOTSTRAP';
import { fsize, fweight } from '../common/StyleCommon';
import { numberFormat } from '../common/DataFunction';
import SubHeader from '../components/SubHeader';
import { BASE_URL } from '../Utils/APIConstant';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get("window");

const startArr = [
    BASE_URL + "/images/reviewScore1.png",
    BASE_URL + "/images/reviewScore2.png",
    BASE_URL + "/images/reviewScore3.png",
    BASE_URL + "/images/reviewScore4.png",
    BASE_URL + "/images/reviewScore5.png",
]

const ReviewScreen1 = (props) => {

    const {navigation, userInfo} = props;

    const [reviewpage, setReviewPage] = useState("1");
    const [scoreIdx, setScoreIdx] = useState("");
    const [score1, setScore1] = useState("2");
    const [score2, setScore2] = useState("2");
    const [score3, setScore3] = useState("2");
    const [score4, setScore4] = useState("2");
    const [score5, setScore5] = useState("2");

    const [scoreModal, setScoreModal] = useState(false);
    const [scoreModal2, setScoreModal2] = useState(false);
    const [scoreModal3, setScoreModal3] = useState(false);
    const [scoreModal4, setScoreModal4] = useState(false);
    const [scoreModal5, setScoreModal5] = useState(false);

    const [memo1, setMemo1] = useState("");
    const [memo2, setMemo2] = useState("");


    const scoreModalHandler = (index) => {

       
        setScoreIdx(index);
        setScoreModal(true);
    }

    const scoreBox1Handler = (score) => {

        if(scoreIdx == "1"){
            setScore1(score);
        }

        if(scoreIdx == "2"){
            setScore2(score);
        }

        if(scoreIdx == "3"){
            setScore3(score);
        }

        if(scoreIdx == "4"){
            setScore4(score);
        }

        if(scoreIdx == "5"){
            setScore5(score);
        }


        setScoreModal(false);
    }


    const memoChange1 = (text) => {
        setMemo1(text);
    }

    const memoChange2 = (text) => {
        setMemo2(text);
    }


    const reviewWriteApi = () => {
        Api.send('review_insert', {'expert_id':'hmex1659949223', "reviewer":userInfo.id, "score1":score1, "score2":score2, "score3":score3, "score4":score4, "score5":score5, "review_private":memo1, "review_open":memo2}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('이사전문가 리뷰작성완료: ', resultItem);
               //setExpertView(arrItems);
               ToastMessage(resultItem.message);
               navigation.goBack();
            }else{
               console.log('리뷰작성실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='후기 작성' />
            <ScrollView>
            {
                reviewpage == "1" && 
                <Box px='25px' py='20px'>
                    <DefText text="홍길동 전문가님의 이사서비스가 어땠나요?" style={[styles.scoreTitle]} />
                    <Box>
                        <DefText text="이삿짐 분실 없음" style={[styles.scoreLabel]} />
                        <TouchableOpacity onPress={()=>scoreModalHandler("1")}>
                            <Image source={{uri:startArr[score1]}} style={{width:165, height:24, resizeMode:'contain'}} />
                        </TouchableOpacity>
        
                    </Box>
                    <Box mt='20px'>
                        <DefText text="이삿짐 훼손 없음" style={[styles.scoreLabel]} />
                        <TouchableOpacity onPress={()=>scoreModalHandler("2")}>
                            <Image source={{uri:startArr[score2]}} style={{width:165, height:24, resizeMode:'contain'}} />
                        </TouchableOpacity>
        
                    </Box>
                    <Box mt='20px'>
                        <DefText text="능숙한 일처리" style={[styles.scoreLabel]} />
                        <TouchableOpacity onPress={()=>scoreModalHandler("3")}>
                            <Image source={{uri:startArr[score3]}} style={{width:165, height:24, resizeMode:'contain'}} />
                        </TouchableOpacity>
        
                    </Box>
                    <Box mt='20px'>
                        <DefText text="바닥보호 양호" style={[styles.scoreLabel]} />
                        <TouchableOpacity onPress={()=>scoreModalHandler("4")}>
                            <Image source={{uri:startArr[score4]}} style={{width:165, height:24, resizeMode:'contain'}} />
                        </TouchableOpacity>
        
                    </Box>
                    <Box mt='20px'>
                        <DefText text="친절함" style={[styles.scoreLabel]} />
                        <TouchableOpacity onPress={()=>scoreModalHandler("5")}>
                            <Image source={{uri:startArr[score5]}} style={{width:165, height:24, resizeMode:'contain'}} />
                        </TouchableOpacity>
        
                    </Box>
                </Box>
            }
            {
                reviewpage == "2" && 
                <Box px='25px' py='20px'>
                    <Box>
                        <DefText text={"홍길동 전문가님께 비공개로\n메모를 남겨주세요."} style={[styles.scoreTitle, {lineHeight:24}]} />
                        <DefText text="응원메시지나 건의사항을 남겨보세요" style={[fsize.fs14]} />
                        <DefText text={"다른 고객은 볼 수 없고, 홍길동 전문가님만 볼 수\n있습니다."} style={[fsize.fs14, {marginTop:5}]} />
                        <DefInput 
                            value={memo1}
                            onChangeText={memoChange1}
                            placeholder={'메모 입력'}
                            multiline={true}
                            textAlignVertical='top'
                            inputStyle={[{
                                borderWidth:1,
                                borderColor:'#ccc',
                                borderRadius:5,
                                height:125,
                                paddingTop:10,
                                paddingLeft:15,
                                marginTop:20
                            }]}
                        />
                    </Box>
                    <Box mt='30px'>
                        <DefText text={"홍길동 전문가님에 대한\n공개 후기를 남겨주세요."} style={[styles.scoreTitle, {lineHeight:24}]} />
                        <DefText text="다른 고객들이 참고할 만한 사항을 알려주세요." style={[fsize.fs14]} />
                        <DefText text={"이사 완료 14일 후에 전문가 카드에 후기가 게시됩니다."} style={[fsize.fs14, {marginTop:5}]} />
                        <DefInput 
                            value={memo2}
                            onChangeText={memoChange2}
                            placeholder={'메모 입력'}
                            multiline={true}
                            textAlignVertical='top'
                            inputStyle={[{
                                borderWidth:1,
                                borderColor:'#ccc',
                                borderRadius:5,
                                height:125,
                                paddingTop:10,
                                paddingLeft:15,
                                marginTop:20
                            }]}
                        />
                    </Box>
                </Box>
            }
                
            </ScrollView>
            {
                reviewpage == "1" &&
                <BottomNextButton text="다음" onPress={()=>setReviewPage("2")} />
            }
            {
                reviewpage == "2" &&
                <BottomButton 
                    leftText='이전' 
                    rightText='완료' 
                    leftonPress={()=>setReviewPage("1")} 
                    rightonPress={reviewWriteApi}
                />
            }
           
            <Modal isOpen={scoreModal} onClose={()=>setScoreModal(false)}>
                <Modal.Content width={width - 50} p='0' borderRadius={0}>
                    <Modal.Body p='0' borderRadius={0}>
                        <Box px='20px' py='15px'>
                            {
                                scoreIdx == "1" && 
                                <DefText text="이삿짐 분실이 없었나요?" style={[fweight.b, fsize.fs14]} />
                            }
                            {
                                scoreIdx == "2" && 
                                <DefText text="이삿짐 훼손이 없었나요?" style={[fweight.b, fsize.fs14]} />
                            }
                            {
                                scoreIdx == "3" && 
                                <DefText text="일처리가 능숙했나요?" style={[fweight.b, fsize.fs14]} />
                            }
                            {
                                scoreIdx == "4" && 
                                <DefText text="바닥보호가 잘 되었나요?" style={[fweight.b, fsize.fs14]} />
                            }
                            {
                                scoreIdx == "5" && 
                                <DefText text="친절했나요?" style={[fweight.b, fsize.fs14]} />
                            }
                            
                        </Box>
                        {
                            startArr.map((item, index) => {
                                return(
                                    <TouchableOpacity onPress={()=>scoreBox1Handler(index)} key={index} style={[ styles.modalScoreButton ]}>
                                        <HStack alignItems={'center'}>
                                            <Box width='40%'>
                                                <Image 
                                                    source={{uri:item}}
                                                    alt="별점"
                                                    style={{
                                                        width: 100,
                                                        height:24,
                                                        resizeMode:'contain',
                                                        marginTop:-2
                                                    }}
                                                />
                                            </Box>
                                            <DefText text={(index + 1) + "점"} style={[fsize.fs14]} />
                                        </HStack>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </Modal.Body>
                </Modal.Content>
            </Modal>
           
        </Box>
    );
};


const styles = StyleSheet.create({
    scoreTitle: {
        ...fsize.fs18,
        ...fweight.b,
        marginBottom:20
    },
    modalScoreButton: {
        height:50,
        paddingHorizontal:20,
        justifyContent:'center',
        borderTopWidth:1, 
        borderTopColor:'#dfdfdf'
    },
    scoreLabel: {
        ...fsize.fs14,
        ...fweight.m,
        color:'#6C6C6C',
        marginBottom:10
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
)(ReviewScreen1);