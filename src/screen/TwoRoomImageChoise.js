import React, {useEffect, useRef, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';
import ImagePicker from 'react-native-image-crop-picker';
import RenderHtml from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';

const {width, height} = Dimensions.get("window");
const systemFonts = [...Font.SCoreDreamR, 'S-CoreDream-4Regular'];
const WebRender = React.memo(function WebRender({html}) {
    return(
        <RenderHtml
            source={{html:html}}
            ignoredStyles={[ 'width', 'height', 'margin', 'padding']}
            ignoredTags={['head', 'script', 'src']}
            imagesMaxWidth={width - 40}
            contentWidth={width}
            tagsStyles={StyleHtml}
            systemFonts={systemFonts}
        /> 
    )
})

const TwoRoomImageChoise = (props) => {

    const {navigation, route} = props;
    const {params} = route;

    //console.log("params", params);

    const [structure, setStructure] = useState(params.houseStructure);
    const [appText, setAppText] = useState(""); // 앱 문구
    const [cameraModal, setCameraModal] = useState(false); // 카메라 실행 모달
    const [cameraReModal, setCameraReModal] = useState(false);
    const [pageNumber, setPageNumber] = useState(params.houseStructure.length);
    const [page, setPage] = useState("1");

    const pageTextApi = () => {
        Api.send('text_tworoomCamera', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
             //  console.log('페이지 문구 보기: ', arrItems);
               setAppText(arrItems);
            }else{
               console.log('페이지 문구 출력 실패!', resultItem);
               //setAppInfoVideoKey("");
            }
        });
    }

    //갤러리 실행하기
    const imgSelected = () => {
        ImagePicker.openPicker({
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: 450,
            compressImageQuality: 0.7,
            multiple:true
          }).then(image => {
            console.log('이미지 선택....',image);
            
            let imageArr = [image];
      
            
            let structures =  [...structure];
            structures[page-1].images = image;

            setStructure(structures);
            setCameraModal(false);

          }).catch(e => {
            setCameraModal(false);
            ToastMessage("갤러리 선택을 취소하셨습니다.");
          });
    }

    useEffect(()=> {
        console.log("rr", structure[page-1].images);
    }, [structure])

    //카메라 실행하기
    const cameraSelected = () => {
        ImagePicker.openCamera({
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: 450,
            compressImageQuality: 0.7,
            //width: 400,
            //height: 400,
            //multiple : true,
          }).then(image => {
            console.log("camara:::", image);

            let imageArr = [];
            imageArr.push(image);

            //console.log(imageArr);
            
            let structures =  [...structure];
            //console.log(structures[page-1].images)
            structures[page-1].images.push(image);
            
            setStructure(structures);

            setCameraModal(false);
            setCameraReModal(true);

          }).catch(e => {
            console.log(Platform.OS, e.message);
            setCameraModal(false);
            if(e.message == "Cannot run camera on simulator"){
                ToastMessage("카메라를 실행할 수 없습니다.");
            }else{
                ToastMessage("카메라 촬영을 취소하셨습니다.");
            }
            
          });
          
    }

    //카메라 재실행 예 누르면 실행
    const carmeraHandler = () => {
        setCameraReModal(false);
        cameraSelected();
    }

    //이전 방으로
    const prevPage = () => {
        let pageNum = page;
        pageNum--;

        setPage(pageNum);
    }

    //다음 방 사진 찍기
    const nextPage = () => {
        let pageNum = page;
        pageNum++;

        setPage(pageNum);
    }

    const navigateMove = () => {
        navigation.navigate("TwoRoomEnd", {
            "houseSize":params.houseSize,
            "houseSizem2":params.houseSizem2,
            "houseStructure":structure,
            "houseType":params.houseType,
            "bigSelectBox":params.bigSelectBox,
            "moveCategory":params.moveCategory,
            "pakageType":params.pakageType,
            "personStatus":params.personStatus,
            "keepStatus":params.keepStatus, 
            'moveDateKeep':params.moveDateKeep, 
            'moveInKeep':params.moveInKeep,
            'startAddress':params.startAddress,
            "startMoveTool":params.startMoveTool, 
            "startFloor":params.startFloor,
            "startAddrLat": params.startAddrLat,
            "startAddrLon": params.startAddrLon,
            "destinationAddress":params.destinationAddress,
            "destinationMoveTool":params.destinationMoveTool,
            "destinationFloor":params.destinationFloor,
            "destinationAddrLat": params.destinationAddrLat, 
            "destinationAddrLon": params.destinationAddrLon,
            "moveDate":params.moveDate,
            "moveDatetime":params.moveDatetime
        })
    }

    //앱 문구 불러오기
    useEffect(() => {
        pageTextApi();
    },[])

    return (
        <Box flex={1} backgroundColor="#fff" justifyContent={'space-between'}>
            <ScrollView>
                
                {
                    structure[page-1].images != "" ?
                    structure[page-1].images.map((item, index) => {
                        return(
                            <Box>
                                {
                                    Platform.OS === 'ios' ?
                                    <Image 
                                        key={index}
                                        source={{ uri:item.path }}
                                        style={{
                                            width:width,
                                            height:width
                                        }}
                                    />
                                    :
                                    <Image 
                                        key={index}
                                        source={{ uri:item.path }}
                                        style={{
                                            width:width,
                                            height:width
                                        }}
                                    />
                                }
                            </Box>
                        )
                    })
                   
                    :
                    <Box width={width} height={width} alignItems={'center'} justifyContent='center' >
                        {
                            structure[page-1].count > 1 ?
                            <DefText text={ structure[page-1].title + "1을(를) \n촬영해주세요"} style={[fsize.fs32, fweight.b, {textAlign:'center', lineHeight:36}]}/>
                            :
                            <DefText text={ structure[page-1].title + "을(를) \n촬영해주세요"} style={[fsize.fs32, fweight.b, {textAlign:'center', lineHeight:36}]}/>
                        }
                        
                    </Box>
                }
            </ScrollView>
             <Box pt='20px' pb='20px' backgroundColor='#fff' borderTopLeftRadius={30} borderTopRightRadius={30} overflow='hidden' shadow={6}>
                <Box px='25px'>
                    {
                        appText != "" && 
                        <VStack>
                            <WebRender html={appText.tworoomcameraText} />
                        </VStack>
                    }
                    {
                        page < pageNumber ?
                            structure[page-1].images != "" ?
                                page > 1 ?
                                <VStack>
                                     <DefButton text='다시 촬영하기' btnStyle={[colorSelect.sky, {marginTop:15}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)}    />
                                    <HStack justifyContent={'space-between'} mt='15px'>
                                        <DefButton text='이전' btnStyle={[colorSelect.w, { width:(width - 50) * 0.48, backgroundColor:'#fff', borderWidth:2, borderColor:'#0195ff'}]} textStyle={[{color:'#0195ff'}, fweight.m]} onPress={prevPage}  />
                                        <DefButton text='다음' btnStyle={[colorSelect.sky, { width:(width - 50) * 0.48}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={nextPage}  />
                                    </HStack>
                                </VStack>
                                :
                                <HStack mt='30px' justifyContent={'space-between'}>
                                    <DefButton text='다시 촬영하기' btnStyle={[colorSelect.sky, { width:(width - 50) * 0.48}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)}  />
                                    <DefButton text='다음' btnStyle={[colorSelect.sky, {width:(width - 50) * 0.48}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={nextPage} />
                                </HStack>
                            :
                            page > 1 ?
                            <HStack mt='30px' justifyContent={'space-between'}>
                                <DefButton text='이전' btnStyle={[colorSelect.sky, {width:(width - 50) * 0.48}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={prevPage}  />
                                <DefButton text='촬영하기' btnStyle={[colorSelect.sky, { width:(width - 50) * 0.48}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)}  />
                            </HStack>
                            :
                            <DefButton text='사진촬영 시작하기' btnStyle={[colorSelect.sky, {marginTop:30}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)} />
                        :
                        structure[page-1].images != "" ?
                        <VStack>
                            <HStack mt='30px' justifyContent={'space-between'}>
                                <DefButton text='이전' btnStyle={[colorSelect.w, { width:(width - 50) * 0.48, backgroundColor:'#fff', borderWidth:2, borderColor:'#0195ff'}]} textStyle={[{color:'#0195ff'}, fweight.m]} onPress={prevPage}  />
                                <DefButton text='다시 촬영하기' btnStyle={[colorSelect.sky, { width:(width - 50) * 0.48}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)}  />
                                
                            </HStack>
                            <DefButton text='완료' btnStyle={[colorSelect.sky, {marginTop:15}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={navigateMove} />
                        </VStack>
                        :
                        <HStack mt='30px' justifyContent={'space-between'}>
                            <DefButton text='이전' btnStyle={[colorSelect.sky, {width:(width - 50) * 0.48}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={prevPage}  />
                            <DefButton text='촬영하기' btnStyle={[colorSelect.sky, { width:(width - 50) * 0.48}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)}  />
                        </HStack>
                    }
                </Box>
             </Box>
             <Modal isOpen={cameraModal} onClose={()=>setCameraModal(false)}>
                <Modal.Content width={width - 50}>
                    <Modal.Body py='25px' px='20px'>
                        <DefText text={"카메라에 이삿짐이 최대한 담긴\n사진을 올려주세요."} style={[styles.modalText]}/>
                        <HStack justifyContent={'space-between'} mt='25px'>
                            <TouchableOpacity onPress={imgSelected} style={[styles.modalButton, colorSelect.black]}>
                                <HStack alignItems={'center'}>
                                    <Image source={require('../images/aiGallIcon.png')} alt='갤러리' style={{width:22, height:19, resizeMode:'contain'}} />
                                    <DefText text='갤러리 (앨범)' style={[fweight.m, fsize.fs14, {color:'#fff', marginLeft:7, lineHeight:19}]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={cameraSelected} style={[styles.modalButton, colorSelect.sky]}>
                                <HStack alignItems={'center'}>
                                    <Image source={require('../images/aiCameraIcon.png')} alt='갤러리' style={{width:22, height:19, resizeMode:'contain'}} />
                                    <DefText text='카메라' style={[fweight.m, fsize.fs14, {color:'#fff', marginLeft:10, lineHeight:19}]} />
                                </HStack>
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={cameraReModal} onClose={()=>setCameraReModal(false)}>
                <Modal.Content width={width - 50}>
                    <Modal.Body py='25px' px='20px'>
                        <DefText text={"추가로 촬영하시겠습니까?"} style={[styles.modalText]}/>
                        <HStack justifyContent={'space-between'} mt='25px'>
                            <TouchableOpacity onPress={carmeraHandler} style={[styles.modalButton, colorSelect.sky]}>
                                <DefText text={'예'} style={[fweight.m, fsize.fs14, {color:'#fff'}]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setCameraReModal(false)} style={[styles.modalButton, {backgroundColor:'#dedede'}]}>
                                <DefText text={'아니오'} style={[fweight.m, fsize.fs14, {color:'#000'}]} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    infoTitle: {
        ...fweight.b,
        ...fsize.fs18
    },
    infoText: {
        ...fsize.fs14,
        color:'#aaa',
    },
    infoAddText: {
        ...fsize.fs14,
        ...fweight.b,
        color:'#FF5050',
        marginTop:30
    },
    modalText: {
        ...fweight.b,
        textAlign:'center'
    },
    modalButton: {
        width: (width - 90) * 0.48,
        height: 50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10
    }
})

export default TwoRoomImageChoise;