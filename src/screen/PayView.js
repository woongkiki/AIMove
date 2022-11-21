import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import { numberFormat } from '../common/DataFunction';
import Api from '../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import Swiper from 'react-native-swiper';
import { BASE_URL } from '../Utils/APIConstant';
import ToastMessage from '../components/ToastMessage';

const {width, height} = Dimensions.get("window");

const PayView = (props) => {

    const {navigation, userInfo, route} = props;
    const {params} = route;


    const [loading, setLoading] = useState(true);
    const [payView, setPayView] = useState("");
    const [payResultImage, setPayResultImage] = useState([]);
    const [payResultBox, setPayResultBox] = useState([]);
    const [imageIndex, setImageIndex] = useState("0");
    const [refundInfo, setRefundInfo] = useState(false);
    const [refundModal, setRefundModel] = useState(false);
    const [refundData, setRefundData] = useState("");

    const payResultApi = async () => {
        await setLoading(true);
        await Api.send('payinfo_view', {"id":userInfo.id, "bidx":params.bidx, "auction_status":params.auction_status}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               
                console.log("내 결제상세내역:::", arrItems, resultItem);
                setPayView(arrItems);
                if(arrItems != ""){
                    payResultImageApi(arrItems.bidx);
                    payResultBoxApi(arrItems.bidx);
                    payRefundApi();
                }

            }else{
               console.log('내 결제상세내역 실패!', resultItem);
               
            }
        });
        await setLoading(false);
    }

    const payResultImageApi = (bidx) => {
        Api.send('payinfo_viewAuction', {"bidx":bidx, "id":userInfo.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               
                //console.log("내 결제내역 이사 이미지:::", arrItems[0], resultItem);
                setPayResultImage(arrItems);
            }else{
               console.log('내 결제내역 이사 이미지 실패!', resultItem);
               
            }
        });
    }

    const payResultBoxApi = (bidx) => {
        Api.send('payinfo_viewBox', {"bidx":bidx, "id":userInfo.id, "imageIndex":imageIndex}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               
                //console.log("내 결제내역 박스 리스트:::", arrItems, resultItem);
                setPayResultBox(arrItems);
            }else{
               console.log('내 결제내역 박스 리스트 실패!', resultItem);
               
            }
        });
    }

    const payRefundApi = () => {
        Api.send('payinfo_refund', {"ex_id":params.ex_id, "bidx":params.bidx, "id":userInfo.id, "moveDate":payView.moveDate, 'price':params.price}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               
                console.log("내 환불정책 정보:::", arrItems, resultItem);
                setRefundData(arrItems);
               
            }else{
               console.log('내 환불정책 정보 실패!', resultItem);
               
            }
        });
    }

    const payCancleApi = () => {
        Api.send('payinfo_cancle', {"idx":params.idx, "ridx":refundData.idx, "moveDate":payView.moveDate, "mid":userInfo.id, "mname":params.mname, "ex_id":params.ex_id, "ex_name":params.ex_name, "bidx":params.bidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               
                console.log("내 결제 취소:::", arrItems, resultItem);
                ToastMessage(resultItem.message);
                payResultApi();
                setRefundModel(false);
                
            }else{
               console.log('내 결제 취소 실패!', resultItem);
               
            }
        });
    }

    const imageSelect = async (index) => {
        //console.log("이미지번호", index);
       
        await setImageIndex(index);
     
    }

    useEffect(()=> {
        payResultApi();
    }, [imageIndex])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle='결제 상세 내역' navigation={navigation} />
            {
                loading ?
                <Box flex={1} alignItems='center' justifyContent='center'>
                    <ActivityIndicator size="large" color="#333" />
                </Box>
                :
                <ScrollView>
                    <Box p='20px' px='25px'>
                        <DefText text={"주문번호 : " + payView.pay_code} style={[fweight.b]} />
                    </Box>
                    {/* {
                        payResultImage != "" &&
                        <Box>
                            <Image 
                                source={{uri:BASE_URL + "/data/file/ai/" + userInfo.id + "/" + payResultImage[imageIndex].f_file}}
                                style={{
                                    width:width,
                                    height: 286,
                                    resizeMode:'stretch'
                                }}
                            />
                            {
                                    payResultBox != "" &&
                                    payResultBox.map((box, index) => {

                                        let boxWidth = box.x2 - box.x1;
                                        let boxHeight = box.y2 - box.y1;
                                        let boxLeft = box.x1;
                                        let boxBottom = box.y1;

                                        let boxWidthPercent = boxWidth / box.img_width;
                                        let boxWidthPercent2 = width * boxWidthPercent;

                                        let boxHeightPercent = boxHeight / box.img_height;
                                        let boxHeightPercent2 = 286 * boxHeightPercent;

                                        let leftPercent = boxLeft / box.img_width;
                                        let leftPercent2 = width * leftPercent;
                                        
                                        let bottomPercent = boxBottom / box.img_height;
                                        let bottomPercent2 = 286 * bottomPercent;

                                        return(
                                            <Box 
                                                key={index}
                                                width={ boxWidthPercent2 + 'px' }
                                                height={ boxHeightPercent2 + 'px' }
                                                backgroundColor='rgba(0,0,0,0.3)'
                                                borderWidth={ box.size >= 3 ? 2 : 1}
                                                borderColor={ box.size >= 3 ? '#0195ff' : '#ff0'}
                                                position={'absolute'}
                                                
                                                top={  bottomPercent2 + 'px' }
                                                left={ leftPercent2 + 'px' }
                                                justifyContent='center'
                                                alignItems={'center'}
                                                
                                                zIndex={ box.size >= 3 ? 10 : 1}
                                            >
                                                {
                                                    box.size >= 3 &&
                                                    <DefText text={box.product} style={[fweight.b, {color:'#fff'}]} />
                                                }
                                            </Box>
                                        )
                                    })
                                }
                        </Box>
                    }
                    {
                        payResultImage.length > 1 &&
                        <Box px='25px' py='15px'  borderBottomWidth={1} borderBottomColor='#dfdfdf'>
                            {
                                payResultImage != "" &&
                                <HStack>
                                    {
                                        payResultImage.map((item, index) => {

                                            //console.log('item::::::' + index, item);
                                            return(
                                                <Box key={index}>
                                                    {
                                                        index != imageIndex ?
                                                        <TouchableOpacity onPress={()=>imageSelect(index)} style={ (index + 1) % 3 == 0 ? {marginRight:0} : {marginRight:(width - 50) * 0.05}}>
                                                            <Box>
                                                                <Image
                                                                    source={{uri:BASE_URL + "/data/file/ai/" + userInfo.id + "/" + item.f_file}}
                                                                    alt='샘플'
                                                                    style={{
                                                                        width:  (width - 50) * 0.3,
                                                                        height: 80,
                                                                        resizeMode:'stretch',
                                                                        borderRadius:10
                                                                    }}
                                                                />
                                                            </Box>
                                                        </TouchableOpacity>
                                                        :
                                                        <Box />
                                                    }
                                                </Box>
                                            )
                                        })
                                    }
                                </HStack>
                            }
                        </Box>
                    } */}
                    <Box  px='25px'>
                        <HStack justifyContent={'space-between'}>
                            <DefText text={"결제유형"}  style={[styles.label]} />
                            <TouchableOpacity onPress={()=>navigation.navigate("ReservationExpert", {"id":payView.ex_id})}>
                                <DefText text={payView.auction_status == "" && "소형이사 예약"} style={[styles.labelRight, {color:'#000'}]} />
                            </TouchableOpacity>
                        </HStack>
                        {
                            payView.auction_status != "방문견적 요청" &&
                            <HStack justifyContent={'space-between'} mt='10px'>
                                <DefText text={"이사전문가"}  style={[styles.label]} />
                                <TouchableOpacity onPress={()=>navigation.navigate("ReservationExpert", {"id":payView.ex_id})}>
                                    <DefText text={payView.ex_name + " 전문가"} style={[styles.labelRight, {color:'#000'}]} />
                                </TouchableOpacity>
                            </HStack>
                        }
                        
                        {/* <HStack justifyContent={'space-between'} mt='10px'>
                            <DefText text={"이사날짜 및 시간"}  style={[styles.label]} />
                            <TouchableOpacity onPress={()=>navigation.navigate("ReservationExpert", {"id":payView.ex_id})}>
                                <DefText text={payView.moveDate} style={[styles.labelRight, {color:'#000'}]} />
                            </TouchableOpacity>
                        </HStack> */}
                        <HStack justifyContent={'space-between'} mt='10px'>
                            <DefText text={"결제상태"}  style={[styles.label]} />
                            <TouchableOpacity onPress={()=>navigation.navigate("ReservationExpert", {"id":payView.ex_id})}>
                                <DefText text={payView.pay_status} style={[styles.labelRight, fweight.b, payView.pay_status == "취소" ? {color:'#f00'} : {color:'#0195ff'}]} />
                            </TouchableOpacity>
                        </HStack>
                        <HStack justifyContent={'space-between'} mt='10px'>
                            <DefText text={"기본 금액"}  style={[styles.label]} />
                            <DefText text={numberFormat(payView.or_price) + ' 원'} style={[styles.labelRight]} />
                        </HStack>
                        {/* {
                            params.cprice != "0" &&
                            <HStack justifyContent={'space-between'} mt='10px'>
                                <DefText text={"환불 금액"}  style={[styles.label]} />
                                <DefText text={numberFormat( parseInt(params.cprice)) + ' 원'} style={[styles.labelRight, {color:'#f00'}]} />
                            </HStack>
                        } */}
                        <HStack justifyContent={'space-between'} mt='10px'>
                            <DefText text={"서비스 수수료"}  style={[styles.label]} />
                            <DefText text={numberFormat(parseInt(payView.comprice)) + ' 원'} style={[styles.labelRight, {color:'#000'}]} />
                        </HStack>
                        <HStack justifyContent={'space-between'} mt='10px'>
                            <DefText text={"세금"}  style={[styles.label]} />
                            <DefText text={numberFormat(parseInt(payView.vat)) + ' 원'} style={[styles.labelRight, {color:'#000'}]} />
                        </HStack>
                        <HStack justifyContent={'space-between'} mt='10px'>
                            <DefText text={"총 결제금액"}  style={[styles.label]} />
                            <DefText text={numberFormat(payView.price) + ' 원'} style={[styles.labelRight, {color:'#000'}]} />
                        </HStack>

                        {
                            payView.auction_status != "방문견적 요청" &&
                            <Box mt='10px'>
                                <DefText text={"환불정책"} style={[styles.label]} />
                                <HStack alignItems={'center'} justifyContent='space-between' mt='10px'>
                                    <DefText text={refundData.re_title} style={[fsize.fs14]} />
                                    <TouchableOpacity onPress={()=>setRefundInfo(true)}>
                                        <Box borderBottomWidth={1} borderBottomColor='#0195ff' pb='5px'>
                                            <DefText text={"자세히 보기"} style={[fsize.fs12, {color:'#0195ff'}]}  />
                                        </Box>
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                        }
                        
                    </Box>
                </ScrollView>
            }
            <Box px='25px' py='15px' borderTopWidth={1} borderTopColor='#ccc'>
                <TouchableOpacity disabled={payView.pay_status == "취소" ? true : false} onPress={()=>setRefundModel(true)} style={[styles.payCancleButton, payView.pay_status == "취소" ? {backgroundColor:'#dfdfdf'} : {backgroundColor:'#f00'}]}>
                    <DefText text={ payView.pay_status == "취소" ? "취소 완료" : "결제 취소"} style={[styles.payCancleButtonText, payView.pay_status == "취소" ? {color:'#000'} : {color:'#fff'}]} />
                </TouchableOpacity>
            </Box>
            <Modal isOpen={refundInfo} onClose={()=>setRefundInfo(false)}>
                <Modal.Content px='20px' py='20px' width={width-50}>
                    <Modal.Body p='0'>
                        <DefText text={refundData.re_title} style={[fweight.b]} />
                        <Box mt='10px'>
                            <DefText text={refundData.re_content} style={[fsize.fs14, { lineHeight:20}]} />
                        </Box>
                        <Box mt='20px'>
                            <DefText text={"예상 환불금액 (" + refundData.refund_per + "%)"} style={[fweight.b]}/>
                            <DefText text={numberFormat(parseInt(refundData.refund_price)) + "원"} style={[fsize.fs14, {marginTop:10}]} />
                        </Box>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={refundModal} onClose={()=>setRefundModel(false)}>
                <Modal.Content px='20px' py='20px' width={width-50}>
                    <Modal.Body p='0'>
                        <DefText text={"결제내역 취소"} style={[fweight.b, fsize.fs18]} />
                        <Box mt='10px'>
                            {
                                payView.auction_status == '방문견적 요청' ?
                                <DefText text={"결제를 취소하시겠습니까?\n진행중인 방문견적 요청도 취소됩니다."} style={{ fontSize:14, lineHeight:24}} />
                                :
                                <DefText text={"환불정책 확인은 완료하셨나요?\n정말 결제를 취소하시겠습니까?"} style={{ fontSize:14, lineHeight:24}} />
                            }
                        </Box>
                        <HStack justifyContent={'space-between'} alignItems='center' mt='15px'>
                            <TouchableOpacity onPress={payCancleApi} style={[styles.modalButton, {backgroundColor:'#f00'}]}>
                                <DefText text={"예"} style={{color:'#fff'}} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setRefundModel(false)} style={[styles.modalButton, {backgroundColor:'#dfdfdf'}]}>
                                <DefText text={"아니요"} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};


const styles = StyleSheet.create({
    label : {
        ...fsize.fs14,
        ...fweight.b
    },
    labelRight: {
        ...fsize.fs14,
        color:'#0195ff'
    },
    payCancleButton: {
        width:width - 50,
        height:40,
        backgroundColor:'#f00',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        
    },
    payCancleButtonText: {
        color:'#fff',
        ...fsize.fs14,
        ...fweight.b
    },
    modalButton: {
        width: (width - 90) * 0.47,
        height:40,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center'
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
)(PayView);