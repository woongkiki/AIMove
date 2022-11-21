import React, {useState, useEffect} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';
import RenderHtml from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';

const {width, height} = Dimensions.get("window");

const WebRender = React.memo(function WebRender({html}) {
    return(
        <RenderHtml
            source={{html:html}}
            ignoredStyles={[ 'width', 'height', 'margin', 'padding']}
            ignoredTags={['head', 'script', 'src']}
            imagesMaxWidth={width - 40}
            contentWidth={width - 40}
            tagsStyles={StyleHtml}
        /> 
    )
})

const PolicyPrivacy = (props) => {

    const { navigation, route } = props;
    const { params } = route;

    const [contentLoading, setContentLoading] = useState(true);
    const [content, setContent] = useState('');

    const policyApi = async () => {
        await setContentLoading(true);
        await Api.send('content_view', {'idx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('서비스 문의 실행 성공::::: ', arrItems, resultItem);
                setContent(arrItems);
               
            }else{
                //console.log('서비스 문의 실행 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
        await setContentLoading(false);
    }

    useEffect(()=> {
        policyApi();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle={content != "" && content.co_subject} navigation={navigation} />
            {
                contentLoading ?
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size="large" color="#333" />
                </Box>
                :
                <ScrollView>
                    <Box px='25px' py='20px'>
                    {
                        content.co_content != "" ?
                        <WebRender html={content.co_content} />
                        :
                        <DefText text='회원가입 약관을 확인할 수 없습니다.' />
                    }
                    </Box>
                </ScrollView>
            }
        </Box>
    );
};

export default PolicyPrivacy;