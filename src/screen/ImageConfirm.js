import React, {useEffect, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';

const {width, height} = Dimensions.get("window");


//임시
const animationImages = [
    'https://cnj01.cafe24.com/images/loginImg1.png',
    'https://cnj01.cafe24.com/images/loginImg2.png',
    'https://cnj01.cafe24.com/images/loginImg3.png',
    'https://cnj01.cafe24.com/images/loginImg4.png',
    'https://cnj01.cafe24.com/images/loginImg5.png',
]

const ImageConfirm = (props) => {

    const {navigation} = props;

    const [imageNumber, setImageNumber] = useState("0");
    const [imageLoading, setImageLoading] = useState(false);
    
    useEffect(()=> {
        
        if(imageLoading){

            let count = 0;
            let countInterval = setInterval(()=> {
                setImageNumber((count++) % 5)
                console.log('count', count);

                if(count == 20){
                    clearInterval(countInterval);
                    navigation.navigate("MoveConfirm");
                    //navigation.goBack();
                }

            }, 1500)
        
            
            return() => {
                clearInterval(countInterval);
            }

        }
    }, [imageLoading])
 

    const imageLoadingGo = () => {
        //setImageLoading(true);
        navigation.navigate("MoveConfirm");
    }


    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle='소형이사 (원룸이사) 견적요청' />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <DefText text={"옷장, 냉장고와 같이 문이 있는 이삿짐은\n문을 열고 촬영해 주세요."} style={[styles.infoText]} />
                    <HStack flexWrap={'wrap'} mt='20px'>
                        <Box mt='25px' mr={(width - 50) * 0.039}>
                            <TouchableOpacity style={[styles.imgButton]}>
                                <Image source={require('../images/sample1.png')} style={[styles.imgSize]} />
                            </TouchableOpacity>
                            <Box width='28px' height='28px' shadow={8} backgroundColor='#fff' borderRadius={28} position='absolute' top='-14px' right='0'>
                                <TouchableOpacity activeOpacity={0.9}>
                                    <Image source={require('../images/imgRemove.png')} alt='삭제' style={{width:28, height:28, resizeMode:'contain'}} />
                                </TouchableOpacity>
                            </Box>
                        </Box>
                        <Box mt='25px'>
                            <TouchableOpacity style={[styles.imgButton]}>
                                <Image source={require('../images/sample2.png')} style={[styles.imgSize]} />
                            </TouchableOpacity>
                            <Box width='28px' height='28px' shadow={8} backgroundColor='#fff' borderRadius={28} position='absolute' top='-14px' right='0'>
                                <TouchableOpacity activeOpacity={0.9}>
                                    <Image source={require('../images/imgRemove.png')} alt='삭제' style={{width:28, height:28, resizeMode:'contain'}} />
                                </TouchableOpacity>
                            </Box>
                        </Box>
                        <Box mt='25px' mr={(width - 50) * 0.039}>
                            <TouchableOpacity style={[styles.imgButton]}>
                                <Image source={require('../images/sample3.png')} style={[styles.imgSize]} />
                            </TouchableOpacity>
                            <Box width='28px' height='28px' shadow={8} backgroundColor='#fff' borderRadius={28} position='absolute' top='-14px' right='0'>
                                <TouchableOpacity activeOpacity={0.9}>
                                    <Image source={require('../images/imgRemove.png')} alt='삭제' style={{width:28, height:28, resizeMode:'contain'}} />
                                </TouchableOpacity>
                            </Box>
                        </Box>
                        <Box mt='25px'>
                            <TouchableOpacity style={[styles.imgButton]}>
                                <Image source={require('../images/sample1.png')} style={[styles.imgSize]} />
                            </TouchableOpacity>
                            <Box width='28px' height='28px' shadow={8} backgroundColor='#fff' borderRadius={28} position='absolute' top='-14px' right='0'>
                                <TouchableOpacity activeOpacity={0.9}>
                                    <Image source={require('../images/imgRemove.png')} alt='삭제' style={{width:28, height:28, resizeMode:'contain'}} />
                                </TouchableOpacity>
                            </Box>
                        </Box>
                        <Box mt='25px'>
                            <TouchableOpacity style={[styles.imgButtonEmpty]}>
                                <Box width='28px' height='28px' shadow={3} borderRadius={28}>
                                    <Image source={require('../images/bluePlus.png')} style={{width:28, height:28, resizeMode:'contain'}} />
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </HStack>
                </Box>
            </ScrollView>
            <BottomButton leftText='이전' rightText='업로드 및 AI 분석' leftonPress={()=>navigation.goBack()} rightonPress={imageLoadingGo} />
            {
                imageLoading &&
                <Box flex={1} backgroundColor='rgba(0,0,0,0.8)' height={height} width={width} position='absolute' top='0' right='0' justifyContent={'center'} alignItems='center'>
                    <DefText text='AI 분석 중입니다.' style={[styles.lodingText, {marginBottom:50}]} />
                    <Image
                        source={{uri:animationImages[imageNumber]}}
                        style={{
                            width:68,
                            height:68,
                            resizeMode:'contain'
                        }}
                    />
                </Box>
            }
            
        </Box>
    );
};

const styles = StyleSheet.create({
    infoText: {
        ...fsize.fs18,
        ...fweight.b,
        lineHeight:23
    },
    imgButton: {
        width: (width - 50) * 0.48,
        height:120,
        borderRadius:10
    },
    imgSize: {
        width:'100%',
        height: '100%',
        resizeMode:'stretch'
    },
    imgButtonEmpty: {
        width: (width - 50) * 0.48,
        height:120,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        borderStyle:'dashed',
        borderWidth:1,
        borderColor:'#CDCDCD'
    },
    lodingText: {
        ...fsize.fs24,
        ...fweight.b,
        color:'#fff'
    }
})

export default ImageConfirm;