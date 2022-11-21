import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefButton, DefInput, DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import { BASE_URL } from '../Utils/APIConstant';
import SubHeader from '../components/SubHeader';
import { useIsFocused } from '@react-navigation/native';
import { numberFormat } from '../common/DataFunction';
import Api from '../Api';
import RenderHtml from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';

const {width} = Dimensions.get("window");

const WebRender = React.memo(function WebRender({html}) {
    return(
        <RenderHtml
            source={{html:html}}
            ignoredStyles={[ 'width', 'height', 'margin', 'padding']}
            ignoredTags={['head', 'script', 'src', 'br']}
            imagesMaxWidth={width - 40}
            contentWidth={width - 40}
            tagsStyles={StyleHtml}
        /> 
    )
})

const ExpertNoticeView = (props) => {

    const {navigation, route} = props;
    const {params} = route;

    const [loading, setLoading] = useState(true);
    const [noticeView, setNoticeView] = useState("");

    const expertViewApi = async () => {
        await setLoading(true);
        await Api.send('notice_view', {"idx":params.idx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('공지사항 상세 성공: ', resultItem, arrItems);
               setNoticeView(arrItems);
            }else{
               console.log('공지사항 상세 실패!', resultItem);
               
            }
        });
        await setLoading(false)
    }

    useEffect(()=> {
        expertViewApi();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="공지사항" navigation={navigation} />
            {
                loading ?
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <ActivityIndicator size="large" color="#333"/>
                </Box>
                :
                <ScrollView>
                    <Box px='25px' py='20px'>
                        <Box pb="20px" borderBottomWidth={1} borderBottomColor='#999'>
                            <Box>
                                <DefText text={noticeView.n_subject} style={[fsize.fs20, fweight.b]}/>
                            </Box>
                            <Box alignItems={'flex-end'} mt='10px'>
                                <DefText text={noticeView.n_datetime.substring(0, 10)} style={[styles.service_date]} />
                            </Box>
                        </Box>
                        {
                            noticeView.n_content != "" && 
                            <Box py='30px' minHeight={'200px'}>
                                <WebRender html={noticeView.n_content} />
                            </Box>
                        }
                    </Box>
                </ScrollView>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    service_date: {
        ...fsize.fs14,
        color:'#999'
    },
    serviceContent: {
        ...fsize.fs14
    },
    commentTitle: {
        ...fsize.fs14,
    },
    commentDate: {
        ...fsize.fs14,
        color:'#999'
    },
    commentTitle: {
        ...fsize.fs14
    }
})

export default ExpertNoticeView;