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

const now = new Date();
let year = now.getFullYear();
let month = now.getMonth();
let dates = now.getDate();

if(month < 10){
    month =  "0" + month;
}else{
    month = month;
}

let date_1 = new Date(year, month, dates, 8, 0, 0, 0);

const CarDate = (props) => {
    const {navigation, route} = props;
    const {params} = route;


    console.log("params13413414", params);

    LocaleConfig.locales['ko'] = {
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
        dayNames: ['일요일','월요일', '화요일','수요일','목요일','금요일','토요일'],
        dayNamesShort: ['일','월','화','수','목','금','토'],
        today: '오늘'
    }
    LocaleConfig.defaultLocale  =  'ko' ;


    const [sdates, setsdates] = useState('');
    const [selectDates, setSelectDates] = useState("");
    const [noHandDateData, setNoHandDateData] = useState("");
    const [moveTime, setMoveTime] = useState("");
    const [moveTimeModal, setMoveTimeModal] = useState(false);
    const [rightDisalbe, setRightDisalbe] = useState(true);

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

    //손없는 날 가져오기
    const noHandDate = () => {
        Api.send('calendar_lunadates', {'start_date':todayText, 'end_date':oneAfter}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('손 없는날 결과123213: ', resultItem, arrItems);
               setNoHandDateData(arrItems);
            }else{
               console.log('손 없는날 결과 출력 실패!', resultItem);

            }
        });
    }


    //타임피커 띄우기
    const showTimePicker = () => {
        setMoveTimeModal(true);
    }

    //타임피커 닫기
    const hideTimePicker = () => {
        setMoveTimeModal(false);
    }

    const timeHandler = (time) => {

        setMoveTime(time.format("HH:mm"));
        hideTimePicker();
        console.log(time.format("HH:mm"));
    }

    const nextNavigation = () => {
        //console.log('ㄱㄱ');
        navigation.navigate("CarImage", {
            "startAddress":params.startAddress,
            "startLat":params.startLat, 
            "startLon":params.startLon,
            "destinationAddress":params.destinationAddress,
            "destinationLat":params.destinationLat, 
            "destinationLon":params.destinationLon,
            "moveDate":sdates,
            "moveDatetime":moveTime
        })
    }

    useEffect(()=>{
        noHandDate();
    }, []);

    useEffect(()=> {
        if(moveTime != "" && sdates != ""){
            setRightDisalbe(false);
        }
    }, [sdates, moveTime])

    console.log('이사날짜', params);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='차량만 대여' />
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
                    <Box mt='20px'>
                        <DefText text='이사 날짜와 시간을 선택해 주세요.' style={[styles.dateText]} />
                        <Box mt='25px'>
                            <DefText text='날짜' style={[styles.labelText]}/>
                            <Box style={[styles.dateBox]}>
                                {
                                    selectDates != "" ?
                                    <DefText text={sdates} style={[styles.dateOffText, {color:'#000'}]} />
                                    :
                                    <DefText text='이사 날짜를 선택해주세요.' style={[styles.dateOffText]} />
                                }
                            </Box>
                        </Box>
                        <Box mt='25px'>
                            <DefText text='시간' style={[styles.labelText]}/>
                            <TouchableOpacity onPress={showTimePicker} style={[styles.dateBox]}>
                               {
                                    moveTime != "" ?
                                    <DefText text={moveTime} style={[styles.dateOffText, {color:'#000'}]} />
                                    :
                                    <DefText text='이사 시간을 선택해주세요.' style={[styles.dateOffText]} />

                               }           
                            </TouchableOpacity>
                        </Box>
                    </Box>
                </Box>
            </ScrollView>
            <DateTimePickerModal
                isVisible={moveTimeModal}
                mode="time"
                onConfirm={timeHandler}
                onCancel={hideTimePicker}
                display={'spinner'}
                date={date_1}
            />
            <BottomButton 
                leftText='이전' 
                rightText='다음' 
                leftonPress={()=>navigation.goBack()} 
                rightDisable={ rightDisalbe } 
                rightBtnStyle={ !rightDisalbe ? colorSelect.sky : colorSelect.gray }  
                rightonPress={nextNavigation}
            />
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
    }
})


export default CarDate;