import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

/*데이트 피커용*/
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

let today = new Date();
let todayText = today.format("yyyy-MM-dd");

const {width, height} = Dimensions.get("window");

const SmallMoveKeep = (props) => {

    const {navigation, route} = props;
    const {params} = route;


    console.log('params3', params);


    const [keepStatus, setKeepStatus] = useState("");
    const [moveDate, setMoveDate] = useState("");
    const [moveDateModal, setMoveDateModal] = useState(false);
    const [inDate, setInDate] = useState("");
    const [inDateModal, setInDateModal] = useState(false);
    const [rightDisalbe, setRightDisalbe] = useState(true);
    const [keepInfoModal, setKeepInfoModal] = useState(false);

    //이사보관서비스 필요여부
    const keepCategoryHandler = (cate) => {
        setKeepStatus(cate);

    }

    //이사날짜 데이트피커 오픈
    const moveDateOpen = () => {
        setMoveDateModal(true);
    }

    //이사날짜 데이트피커 닫기
    const moveDateHide = () => {
        setMoveDateModal(false);
    }

    //이사날짜 날짜 선택 이벤트
    const moveDateConfirm = (date) => {

        let dateToday = new Date();
        let selectDate = new Date(date);

        if(dateToday > selectDate){
            moveDateHide();
            setMoveDate("");
            ToastMessage("오늘 이전의 날짜는 선택할 수 없습니다.");
            return false;
        }

        setMoveDate(date.format("yyyy-MM-dd"));
        moveDateHide();
    }

    //입주예정일 데이트피커 오픈
    const inDateOpen = () => {
        setInDateModal(true);
    }

    //입주예정일 데이트피커 클로즈
    const inDateHide = () => {
        setInDateModal(false);
    }

    //입주예정일 날짜 선택 이벤트
    const inDateConfirm = (date) => {

        let dateToday = new Date();
        let selectDate = new Date(date);

        if(dateToday > selectDate){
            inDateHide();
            setInDate("");
            ToastMessage("오늘 이전의 날짜는 선택할 수 없습니다.");
            return false;
        }

        setInDate(date.format("yyyy-MM-dd"));
        inDateHide();
    }


    const nextNavigation = () => {
        navigation.navigate("SmallMoveStartTool", {"bidx":params.bidx, "moveCategory":params.moveCategory, "pakageType":params.pakageType, "personStatus":params.personStatus, "keepStatus":keepStatus, 'moveDateKeep':moveDate, 'moveInKeep':inDate})
    }
    

    useEffect(()=>{
        if(keepStatus != ""){
            if(keepStatus == '아니요'){
                setRightDisalbe(false);
            }else if(keepStatus == '예'){ //이사보관서비스 예 선택시 이사날짜와 입주예정일까지 입력해야 버튼 활성화
                setRightDisalbe(true);
                if(moveDate != "" && inDate != ""){
                    setRightDisalbe(false);
                }
            }
        }
    }, [keepStatus, moveDate, inDate])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle='소형이사 (원룸이사) 견적요청' navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <HStack alignItems={'center'} justifyContent='space-between' mb='15px'>
                        <DefText text={"이사 보관 서비스가 필요하신가요?"} style={[styles.pageTitle]} />
                        <TouchableOpacity onPress={()=>setKeepInfoModal(true)}>
                            <Image 
                                source={require("../images/keepIcon.png")}
                                alt='이사보관서비스란?'
                                style={{
                                    width:21,
                                    height:21,
                                    resizeMode:'contain'
                                }}
                            />
                        </TouchableOpacity>
                    </HStack>
                    <VStack>
                        <DefButton 
                            onPress={()=>keepCategoryHandler('아니요')}
                            text='아니요 필요없습니다.'
                            btnStyle={[styles.buttonStyle, keepStatus == '아니요' ? colorSelect.sky : colorSelect.gray]}
                            textStyle={[styles.btnTextStyle, keepStatus == '아니요' ? {color:'#fff'} : {color:'#000'}]} 
                        />
                        <DefButton 
                            onPress={()=>keepCategoryHandler('예')} 
                            text='예 필요합니다.' 
                            btnStyle={[styles.buttonStyle, keepStatus == '예' ? colorSelect.sky : colorSelect.gray]} 
                            textStyle={[styles.btnTextStyle, keepStatus == '예' ? {color:'#fff'} : {color:'#000'}]} 
                        />
                        {
                            keepStatus == '예' &&
                            <VStack>
                                <Box mt='20px'>
                                    <DefText text={"지금 계신 곳의 이사 날짜를 선택해 주세요."} style={[styles.labelText]} />
                                    <TouchableOpacity onPress={moveDateOpen} style={[styles.dateButton]}>
                                        <DefText text={ moveDate != "" ? moveDate : '이사 날짜를 선택해 주세요.'} style={[styles.dateButtonText, moveDate != "" && {color:'#000'}]} />
                                    </TouchableOpacity>
                                </Box>
                                <Box mt='20px'>
                                    <DefText text={"새로운 곳의 입주 날짜를 선택해 주세요."} style={[styles.labelText]} />
                                    <TouchableOpacity onPress={inDateOpen} style={[styles.dateButton]}>
                                        <DefText text={ inDate != "" ? inDate : '입주 예정일을 입력해 주세요.'} style={[styles.dateButtonText, inDate != "" && {color:'#000'}]} />
                                    </TouchableOpacity>
                                </Box>
                                <Box mt='20px'>
                                    <DefText text={"이사보관료는 이사견적에 포함되지 않습니다.\n이사전문가에게 문의하세요."} style={[fsize.fs14, {lineHeight:20, color:'#f00'}]} />
                                </Box>
                            </VStack>
                        }
                    </VStack>
                </Box>
            </ScrollView>
            <BottomButton 
                leftText='이전' 
                rightText='다음' 
                leftonPress={()=>navigation.goBack()} 
                rightDisable={ rightDisalbe } 
                rightBtnStyle={ !rightDisalbe ? colorSelect.sky : colorSelect.gray }  
                rightonPress={nextNavigation}
            />
            <DateTimePickerModal
                isVisible={moveDateModal}
                mode="date"
                onConfirm={moveDateConfirm}
                onCancel={moveDateHide}
                minimumDate={new Date()}
                display={'spinner'}
            />
            <DateTimePickerModal
                isVisible={inDateModal}
                mode="date"
                onConfirm={inDateConfirm}
                onCancel={inDateHide}
                minimumDate={moveDate != "" && new Date()}
                display={'spinner'}
            />
            <Modal isOpen={keepInfoModal} onClose={()=>setKeepInfoModal(false)}>
                <Modal.Content p='0' width={width - 50}>
                    <Modal.Body p='0' height={height - 300}>
                        <ScrollView>
                            <Box p='20px' width={width - 50} borderBottomWidth={1} borderBottomColor='#F3F4F5'>
                                <HStack justifyContent={'space-between'} alignItems='center'>
                                    <DefText text='보관이사 알아두기' style={[styles.modatTitle]} />
                                    <TouchableOpacity onPress={()=>setKeepInfoModal(false)}>
                                        <Image
                                            source={require('../images/keepModalClose.png')}
                                            alt ='팝업닫기'
                                            style={{
                                                width:12,
                                                height:12,
                                                resizeMode:'contain'
                                            }}
                                        />
                                    </TouchableOpacity>
                                </HStack>
                               
                            </Box>
                            <Box p='20px'>
                                <DefText text='보관이사란 원하는 날짜와 장소에 이삿짐을 입고 및 출고를 해드리는 서비스 입니다.' style={[styles.modalText]} />
                                <Box mt='20px'>
                                    <DefText text='주의사항' style={[styles.modalText, styles.modalMidText]} />
                                </Box>
                                <HStack style={[styles.modalMargin]}>
                                    <DefText text='1. ' style={[styles.modalText]}  />
                                    <DefText text={"냉장고는 음식물을 비워두고 깨끗이 닦아\n건조시킨 후 마른 신문지 등을 넣어두면\n냄새 곰팡이의 기생을 예방할 수 있습니다"} style={[styles.modalText]}  />
                                </HStack>
                                <HStack style={[styles.modalMargin]}>
                                    <DefText text='2. ' style={[styles.modalText]}  />
                                    <DefText text={"세탁기는 드럼통과 호스에 괴어있는 물기를\n완전 제거하고 건조시켜 보관합니다.\n고가의 의류, 밍크코트, 가죽 의류 등은 장기간\n보관시 곰팡이가 생길 수 있으니 습기제거제\n(예:물먹는 하마)와 습기를 잘 흡수할 수 있는\n종이류로 겹겹이 포장하는 것이 좋습니다."} style={[styles.modalText]}  />
                                </HStack>
                                <HStack style={[styles.modalMargin]}>
                                    <DefText text='3. ' style={[styles.modalText]}  />
                                    <DefText text={"가전제품, 컴퓨터 등은 습기에 약하며 오랜시간\n노출시에는 부품에 녹이 슬거나 고장이 생기는\n원인이 되오니 습기제거제 등을\n적절히 배치하여 보관하시길 바랍니다."} style={[styles.modalText]}  />
                                </HStack>
                                <HStack style={[styles.modalMargin]}>
                                    <DefText text='4. ' style={[styles.modalText]}  />
                                    <DefText text={"그릇류, 유리류 등 쉽게 파손될 수 있는 것은\n에어 캡, 신문지 등으로 튼튼하게 포장하여\n마른 박스에 넣어 포장합니다."} style={[styles.modalText]}  />
                                </HStack>
                                <HStack style={[styles.modalMargin]}>
                                    <DefText text='5. ' style={[styles.modalText]}  />
                                    <DefText text={"음식물 등을 모르게 숨기고 보관하게 되면\n음식물 (예:김치국물, 과일속의 액즙)의 물기로\n인하여 습기를 만들어 내고\n그것이 곰팡이가 만들어지는 원인이 됩니다."} style={[styles.modalText]}  />
                                </HStack>
                                <HStack style={[styles.modalMargin]}>
                                    <DefText text='6. ' style={[styles.modalText]}  />
                                    <DefText text={"직접 셀수가 없는 것(볼트, 수저, 젓가락 등)들은 별도로 상담 후 계약합니다."} style={[styles.modalText]}  />
                                </HStack>
                                <HStack style={[styles.modalMargin]}>
                                    <DefText text='7. ' style={[styles.modalText]}  />
                                    <DefText text={"쌀 등은 장기간 보관시 벌레가 생길 수 있으니\n주의가 필요합니다."} style={[styles.modalText]}  />
                                </HStack>
                                <HStack style={[styles.modalMargin]}>
                                    <DefText text='8. ' style={[styles.modalText]}  />
                                    <DefText text={"행주, 걸레 등은 말린 후 보관합니다."} style={[styles.modalText]}  />
                                </HStack>
                                <HStack style={[styles.modalMargin]}>
                                    <DefText text='9. ' style={[styles.modalText]}  />
                                    <DefText text={"귀금속,골동품, 폭발 휘발성 위험 물질, 생물\n및 잔반 등은 보관하지 않습니다."} style={[styles.modalText]}  />
                                </HStack>
                            </Box>
                        </ScrollView>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    pageTitle:{
        ...fsize.fs18,
        ...fweight.b,
    },
    buttonStyle: {
        ...colorSelect.gray,
        marginTop:10
    },
    btnTextStyle: {
        ...fweight.m
    },
    labelText: {
        ...fsize.fs15,
        ...fweight.b
    },
    dateButton: {
        height:50,
        borderBottomWidth:1,
        borderBottomColor:'#BEBEBE',
        paddingLeft:10,
        justifyContent:'center'
    },
    dateButtonText: {
        ...fweight.r,
        ...fsize.fs13,
        color:'#BEBEBE'
    },
    modatTitle: {
        ...fweight.b,
    },
    modalText: {
        ...fsize.fs14
    },
    modalMidText: {
        ...fweight.b,
        color:'#FF5050',
        textAlign:'center'
    },
    modalMargin: {
        marginTop:15
    }
})

export default SmallMoveKeep;