import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
import XDate from 'xdate';
import Api from '../Api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ApiExpert from '../ApiExpert';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { useIsFocused } from '@react-navigation/native';
import { BASE_URL } from '../Utils/APIConstant';

const {width, height} = Dimensions.get("window");

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
let todayText = today.format('yyyy-MM-dd');
let times = today.format('HH:mm');
let oneYearLater = new Date(today.setFullYear(today.getFullYear() + 1));
let twoYearBefore = new Date(today.setFullYear(today.getFullYear() - 2));
let oneAfter = oneYearLater.format('yyyy-MM-dd');
let twoBefore = twoYearBefore.format('yyyy-MM-dd');

const ExpertService = (props) => {

    const {navigation, userInfo, member_chatCnt} = props;


    LocaleConfig.locales['ko'] = {
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
        dayNames: ['일요일','월요일', '화요일','수요일','목요일','금요일','토요일'],
        dayNamesShort: ['일','월','화','수','목','금','토'],
        today: '오늘'
    }
    LocaleConfig.defaultLocale  =  'ko' ;

    const [loading, setLoading] = useState(true);
    const [sdates, setsdates] = useState(todayText);
    const [selectDates, setSelectDates] = useState("");
    const [noHandDateData, setNoHandDateData] = useState("");
    const [schduleData, setScheduleData] = useState([]);
    const [scheduleRequest, setScheduleRequest] = useState([]);
    const [scheduleDate, setScheduleDate] = useState([]);

    //손없는 날 가져오기
    const noHandDate = async () => {
        await setLoading(true);
        await Api.send('calendar_lunadates', {'start_date':todayText, 'end_date':oneAfter}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('손 없는날 결과123213: ', resultItem, arrItems);
               setNoHandDateData(arrItems);
            }else{
               console.log('손 없는날 결과 출력 실패!', resultItem);

            }
        });
        await setLoading(false);
    }

    const schduleApiRec = async () => {
        await ApiExpert.send('schedule_list', {'date':sdates, "ex_id":userInfo.ex_id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('내 스케줄 정보 보기: ', arrItems, resultItem);
               setScheduleData(arrItems);
            }else{
               console.log('내 스케줄 정보 실패!', resultItem);
              
            }
        });

        await ApiExpert.send('schedule_date', {"ex_id":userInfo.ex_id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('내 스케줄 날짜 정보 보기: ', arrItems, resultItem);
               //setScheduleData(arrItems);
               setScheduleDate(arrItems);
            }else{
               console.log('내 스케줄 날짜 정보 실패!', resultItem);
              
            }
        });

        await ApiExpert.send('schedule_request', {'date':sdates, "ex_id":userInfo.ex_id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('내 신청 정보 보기: ', arrItems, resultItem);
               setScheduleRequest(arrItems);
            }else{
               console.log('내 신청 정보 실패!', resultItem);
              
            }
        });
    }

    //달력 날짜 선택
    const selectDate = (date) => {
        const dates = {};
        const sDate = new XDate(date);

        //console.log(sDate.toString('yyyy-MM-dd'));
        dates[sDate.toString('yyyy-MM-dd')] = {
            selected: true,
            selectedColor: '#0195ff'
        }

        setsdates(date); //날짜에 표시용
        setSelectDates(dates); //달력에 날짜 선택함 표시

    }


    //차량만제공 상세 이동
    const navigations = (type, idx) => {


        if(type == "차량만제공"){
            navigation.navigate("CarAuctionView", {"idx":idx, "type":"N"});
        }
    }


    const isFocused = useIsFocused();

    const chatCntHandler = async () => {
        const formData = new FormData();
        formData.append('ex_id', userInfo.ex_id);
        formData.append('method', 'member_exchatCnt');

        const chat_cnt = await member_chatCnt(formData);

        //console.log("chat_cnt ExpertServices Screen::", chat_cnt);
    }

    useEffect(() => {
        if(isFocused){
            chatCntHandler();
        }
    }, [isFocused])


    useEffect(()=>{
        noHandDate();
    },[])

    useEffect(()=> {
        schduleApiRec();
    },[sdates])

    return (
        <Box flex={1} backgroundColor='#fff'>
            {
                loading ?
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <ActivityIndicator size="large" color="#333" />
                </Box>
                :
                <ScrollView>
                    <Box px='25px' py='20px'>
                        <HStack alignItems={'center'} justifyContent='flex-end'>
                            <Box width='13px' height='13px' borderRadius={13} style={[{borderWidth:1, borderColor:'#000'}]}  />
                            <DefText text='손없는날' style={[fsize.fs12, {marginLeft:10}]} />
                        </HStack>
                        <Calendar 
                            current={todayText}
                            minDate={todayText}
                            maxDate={oneAfter}
                            onDayPress={ (day) => selectDate(day.dateString) }
                            markingType={'custom'}
                            markedDates={{
                                ...noHandDateData,
                                ...scheduleDate,
                                ...selectDates
                            }}
                            hideExtraDays={true}
                            monthFormat={'yyyy년 MMMM'}
                            theme = {{
                                selectedDayBackgroundColor : '#4473B8' , 
                                selectedDayTextColor : '#fff',
                                arrowColor: '#000',
                                dayTextColor: '#000',
                                textSectionTitleColor:'#191919',
                                textSectionTitleDisabledColor:'#000',
                                todayTextColor: '#000',
                                // textDayFontFamily : Font.SCoreDreamR,
                                // textMonthFontFamily: Font.SCoreDreamR,
                                // textDayHeaderFontFamily : Font.SCoreDreamR , 
                                textDayFontWeight : '400',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight : 'bold' , 
                                textDayFontSize : 14 , 
                                textMonthFontSize : 14 , 
                                textDayHeaderFontSize : 14,
                                'stylesheet.calendar.header': {
                                    week: {
                                    marginTop: 30,
                                    marginHorizontal: 12,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                    }
                                }
                            }}
                        />
                         <Box mt='30px'>
                            <DefText text={sdates} style={[fweight.m]} />
                            {
                                schduleData != "" ?
                                schduleData.map((item, index) => {
                                    return(
                                        <TouchableOpacity 
                                            key={index}
                                            onPress={()=>navigations(item.move_type, item.move_idx)}
                                        >
                                            <Box p='20px' borderRadius={10} shadow={8} backgroundColor='#fff' mt='20px'>
                                                <Box pb='15px' borderBottomWidth={1} borderBottomColor='#F3F4F5' mb='15px'>
                                                    <DefText text={item.move_type} style={[styles.schTitle]} />
                                                </Box>
                                                {
                                                    item.move_type == '방문견적요청' ?
                                                    <Box>
                                                        <HStack justifyContent={'space-between'}>
                                                            <DefText text="방문 주소" style={[styles.schAddrTitle]} />
                                                            <DefText text={item.startAddress} style={[styles.schAddrCont]} />
                                                        </HStack>
                                                        
                                                    </Box>
                                                    :
                                                    <Box>
                                                        <HStack justifyContent={'space-between'}>
                                                            <DefText text="출발지" style={[styles.schAddrTitle]} />
                                                            <DefText text={item.startAddress} style={[styles.schAddrCont]} />
                                                        </HStack>
                                                        <HStack justifyContent={'space-between'} mt='15px'>
                                                            <DefText text="도착지" style={[styles.schAddrTitle]} />
                                                            <DefText text={item.destinationAddress} style={[styles.schAddrCont]} />
                                                        </HStack>
                                                    </Box>
                                                }
                                               
                                            </Box>
                                        </TouchableOpacity>
                                    )
                                })
                                :
                                    scheduleRequest != "" &&
                                    scheduleRequest.ai_auc != "" ?
                                    scheduleRequest.ai_auc.map((item, index) => {
                                    return(
                                        <Box key={index} backgroundColor={'#fff'} borderRadius='10px' shadow={9} mt={"20px"} p='20px' py='0' pb='15px'>
                                            <TouchableOpacity key={index}  onPress={()=>navigation.navigate("ExpertAuctionView", item)}>
                                            <Box mt='15px'>
                                                <HStack justifyContent={'space-between'} pb='15px' borderBottomWidth={1} borderBottomColor='#ccc' flexWrap={'wrap'} alignItems='center'>
                                                    <VStack width='60%' >
                                                        <DefText text={item.moveType} style={[styles.moveTitle]} />
                                                        <DefText text={'이사날짜 : ' + item.moveDate.substring(0,10)} style={[styles.moveDate]} />
                                                    </VStack>
                                                    <Box width='40%'>
                                                        <Box width='100%' height={'100px'} borderRadius='5px' overflow={'hidden'}>
                                                        <Image 
                                                            source={{uri: BASE_URL + "/data/file/ai/" + item.mid + "/" + item.imgName}}
                                                            style={{
                                                                width:'100%',
                                                                height:100,
                                                                resizeMode:'stretch',
                                                            }}
                                                        />
                                                        </Box>
                                                    </Box>
                                                </HStack>
                                            </Box>
                                            <HStack style={[styles.labelBox]}>
                                                <Box width='30%' >
                                                    <DefText text="입찰 금액" style={[styles.labelLeft]} />
                                                </Box>
                                                <Box width='70%' alignItems='flex-end'>
                                                    {
                                                        item.auction_price != "" ?
                                                        <DefText text={ numberFormat(item.auction_price) + '원'} style={[styles.labelRight]} />
                                                        :
                                                        <DefText text={ '-'} style={[styles.labelRight]} />
                                                    }
                                                </Box>
                                            </HStack>
                                            <HStack style={[styles.labelBox]}>
                                                <Box width='30%' >
                                                    <DefText text="AI 추천견적" style={[styles.labelLeft]} />
                                                </Box>
                                                <Box width='70%' alignItems='flex-end'>
                                                    <DefText text={ numberFormat(item.lowPrice) + '원 ~ ' + numberFormat(item.highPrice) + '원'} style={[styles.labelRight]} />
                                                </Box>
                                            </HStack>
                                            <HStack style={[styles.labelBox]}>
                                                <Box width='30%' >
                                                    <DefText text="출발지" style={[styles.labelLeft]} />
                                                </Box>
                                                <Box width='70%' alignItems='flex-end'>
                                                    <DefText text={item.startAddress} style={[styles.labelRight]} />
                                                </Box>
                                            </HStack>
                                            <HStack style={[styles.labelBox]}>
                                                <Box width='30%' >
                                                    <DefText text="도착지" style={[styles.labelLeft]} />
                                                </Box>
                                                <Box width='70%' alignItems='flex-end'>
                                                    <DefText text={item.destinationAddress} style={[styles.labelRight]} />
                                                </Box>
                                            </HStack>
                                            </TouchableOpacity>
                                        </Box>
                                    )
                                })
                                :
                                <Box py='40px' alignItems={'center'} justifyContent='center'>
                                    <DefText text="등록된 스케줄이 없습니다." />
                                </Box>
                         
                            }
                        </Box>
                    </Box>
                </ScrollView>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    dateText: {
        ...fsize.fs16,
        ...fweight.m
    },
    labelText: {
        ...fsize.fs15,
        ...fweight.b
    },
    dateBox: {
        height:50,
        justifyContent:'center',
        borderBottomWidth:1,
        borderBottomColor:'#BEBEBE',
        paddingLeft:10
    },
    dateOffText: {
        ...fsize.fs13,
        ...fweight.r,
        color:'#BEBEBE'
    },
    schTitle: {
        ...fsize.fs19,
        ...fweight.b
    },
    schAddrTitle: {
        ...fsize.fs15,
        ...fweight.b
    },
    schAddrCont: {
        ...fsize.fs15,
    },
    moveButton: {
        paddingHorizontal:15,
        paddingVertical:20,
    },
    moveTitle: {
        ...fsize.fs18,
        ...fweight.b,
        
    },
    moveDate: {
        color:'#777',
        ...fsize.fs12,
        marginTop:10,
    },
    labelBox: {
        justifyContent:'space-between',
        marginTop:15,
        alignItems:'center'
    },
    labelLeft: {
        ...fsize.fs15,
        ...fweight.b
    },
    labelRight: {
        color:'#747474',
        ...fsize.fs15,
        textAlign:'right'
    },
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_chatCnt: (user) => dispatch(UserAction.member_chatCnt(user))
    })
)(ExpertService);