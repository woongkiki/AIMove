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

const TwoRoomImageSelect = (props) => {

    const {navigation, route} = props;
    const {params} = route;
    

    const [structure, setStructure] = useState(params.houseStructure);

    const [pageNumber, setPageNumber] = useState(params.houseStructure.length);
    const [page, setPage] = useState("1");

    const [countPage, setCountPage] = useState(structure[page-1].count);
    const [countPageMinus, setCountPageMinus] = useState(structure[page-1].count);

    const [cameraModal, setCameraModal] = useState(false);
    const [appText, setAppText] = useState("");
    const [aiImage, setAiImage] = useState([]);

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


    const imgSelected = () => {
        ImagePicker.openPicker({
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: 450,
            compressImageQuality: 0.7,
            multiple:true
          }).then(image => {
            console.log('이미지 선택....',image);
            setAiImage(image);

            let structures =  [...structure];
            structure[page-1].images = image;

            setStructure(structures);

            if(page < pageNumber){

                // let pageNum = page;
                // pageNum++;

                // setPage(pageNum);
                setCameraModal(false);

            }else{
                // navigation.navigate("TwoRoomEnd", {
                //     "houseSize":params.houseSize,
                //     "houseStructure":structure,
                //     "houseType":params.houseType,
                //     "bigSelectBox":params.bigSelectBox,
                //     "moveCategory":params.moveCategory,
                //     "pakageType":params.pakageType,
                //     "personStatus":params.personStatus,
                //     "keepStatus":params.keepStatus, 
                //     'moveDateKeep':params.moveDateKeep, 
                //     'moveInKeep':params.moveInKeep,
                //     'startAddress':params.startAddress,
                //     "startMoveTool":params.startMoveTool, 
                //     "startFloor":params.startFloor,
                //     "destinationAddress":params.destinationAddress,
                //     "destinationMoveTool":params.destinationMoveTool,
                //     "destinationFloor":params.destinationFloor,
                //     "moveDate":params.moveDate,
                //     "moveDatetime":params.moveDatetime
                // })

                setCameraModal(false);
            }

          }).catch(e => {
            setCameraModal(false);
            ToastMessage("갤러리 선택을 취소하셨습니다.");
          });
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

    useEffect(()=> {
        console.log("structure:::",structure);
        console.log("pageNumber:::",pageNumber);
        console.log("page:::",page);
        console.log("page:::",structure[0].images);
    }, [structure, pageNumber, page]);


    const prevPage = () => {
        let pageNum = page;
        pageNum--;

        setPage(pageNum);
    }
    const nextPage = () => {
        let pageNum = page;
        pageNum++;

        setPage(pageNum);
    }

    const cameraSelected = () => {
        ImagePicker.openCamera({
            width: width,
            height: width,
            compressImageMaxWidth: width * 1.5,
            compressImageMaxHeight: 450,
            compressImageQuality: 0.7,
            multiple:false,
            cropping:true,
          }).then(image => {
            console.log(image);
            
            let imageArr = [];

            imageArr.push(image);

            setAiImage(imageArr);

            let structures =  [...structure];
            structure[page-1].images = imageArr;

            setStructure(structures);

            if(page < pageNumber){

                // let pageNum = page;
                // pageNum++;

                // setPage(pageNum);
                setCameraModal(false);

            }else{
                // navigation.navigate("TwoRoomEnd", {
                //     "houseSize":params.houseSize,
                //     "houseStructure":structure,
                //     "houseType":params.houseType,
                //     "bigSelectBox":params.bigSelectBox,
                //     "moveCategory":params.moveCategory,
                //     "pakageType":params.pakageType,
                //     "personStatus":params.personStatus,
                //     "keepStatus":params.keepStatus, 
                //     'moveDateKeep':params.moveDateKeep, 
                //     'moveInKeep':params.moveInKeep,
                //     'startAddress':params.startAddress,
                //     "startMoveTool":params.startMoveTool, 
                //     "startFloor":params.startFloor,
                //     "destinationAddress":params.destinationAddress,
                //     "destinationMoveTool":params.destinationMoveTool,
                //     "destinationFloor":params.destinationFloor,
                //     "moveDate":params.moveDate,
                //     "moveDatetime":params.moveDatetime
                // })

                setCameraModal(false);
            }



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

    //console.log("params::", params.houseStructure);

    useEffect(()=> {
        pageTextApi();
    }, [])


    const countPagePlusHandler = () => {
        let pageNum = countPageMinus;
        pageNum++;

        setCountPageMinus(pageNum);
    }

    const countPageMinusHandler = () => {
        let pageNum = countPageMinus;
        pageNum--;

        setCountPageMinus(pageNum);
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                {
                    params.houseStructure[page-1].images != "" ?
                    params.houseStructure[page-1].images.map((item, index) => {
                        return(
                            <Image 
                                key={index}
                                source={{uri:item.path}}
                                style={{
                                    width:width,
                                    height:width
                                }}
                            />
                        )
                    })
                    :
                    <Box width={width} height={width} alignItems={'center'} justifyContent='center'>
                        <DefText text={params.houseStructure[page-1].title + ' ' + params.houseStructure[page-1].count + "개를" + "\n촬영해주세요"} style={[fsize.fs32, fweight.b, {textAlign:'center'}]}/>
                    </Box>
                }
            </ScrollView>
            <Box pt='30px' pb='20px' backgroundColor='#fff' borderTopLeftRadius={30} borderTopRightRadius={30} shadow={6}>
                <Box px='25px'>
                    {/* <DefText text='카메라 안에 최대한 많은 짐이 닮기게 촬영해 주세요.' style={[styles.infoTitle]} />
                    <VStack mt='20px'>
                        <HStack alignItems={'flex-start'}>
                            <DefText text="1. " style={[styles.infoText]} />
                            <DefText text={"사진을 너무 세세하게 찍을 필요는 없고,\n카메라에 최대한 담기게 촬영하시면 됩니다."} style={[styles.infoText]}  />
                        </HStack>
                        <HStack alignItems={'flex-start'} mt='15px'>
                            <DefText text="2. " style={[styles.infoText]} />
                            <DefText text={"카메라에 이삿짐이 다 담기지 않으면\n따로 촬영해주시면 됩니다."} style={[styles.infoText]}  />
                        </HStack>
                    </VStack> */}
                    {
                        appText != "" && 
                        <VStack>
                            <WebRender html={appText.tworoomcameraText} />
                        </VStack>
                    }
                    {
                        page < pageNumber ?
                            params.houseStructure[page-1].images != "" ?
                                page != 1 ?
                                <VStack mt='30px'>
                                    <DefButton text='다시 촬영하기' btnStyle={[colorSelect.sky]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)}  />
                                    <HStack mt='20px' justifyContent={'space-between'}>
                                        <DefButton text='이전' btnStyle={[colorSelect.w, { width:(width - 50) * 0.48, backgroundColor:'#fff', borderWidth:2, borderColor:'#0195ff'}]} textStyle={[{color:'#0195ff'}, fweight.m]}  onPress={prevPage}  />
                                        <DefButton text='다음' btnStyle={[colorSelect.sky, {width:(width - 50) * 0.48}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={nextPage}  />
                                    </HStack>
                                </VStack>
                                :
                                <HStack mt='30px' justifyContent={'space-between'}>
                                    <DefButton text='다시 촬영하기' btnStyle={[colorSelect.sky, { width:(width - 50) * 0.48}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)}  />
                                    <DefButton text='다음' btnStyle={[colorSelect.sky, {width:(width - 50) * 0.48}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={nextPage}  />
                                </HStack>
                            :
                            <DefButton text='사진촬영 시작하기' btnStyle={[colorSelect.sky, {marginTop:30}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)} />
                        :
                            params.houseStructure[page-1].images != "" ?
                            <VStack>
                                <HStack mt='30px' justifyContent={'space-between'}>
                                    <DefButton text='이전' btnStyle={[colorSelect.w, { width:(width - 50) * 0.48, backgroundColor:'#fff', borderWidth:2, borderColor:'#0195ff'}]} textStyle={[{color:'#0195ff'}, fweight.m]} onPress={prevPage}  />
                                    <DefButton text='재촬영' btnStyle={[colorSelect.sky, { width:(width - 50) * 0.48}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)}  />
                                    
                                </HStack>
                                <DefButton text='완료' btnStyle={[colorSelect.sky, {marginTop:20}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={navigateMove}  />
                            </VStack>
                            :
                            
                            <VStack>
                                <HStack mt='30px' justifyContent={'space-between'}>
                                    <DefButton text='이전' btnStyle={[colorSelect.w, { width:(width - 50) * 0.48, backgroundColor:'#fff', borderWidth:2, borderColor:'#0195ff'}]} textStyle={[{color:'#0195ff'}, fweight.m]} onPress={prevPage}  />
                                    <DefButton text='촬영하기' btnStyle={[colorSelect.sky, { width:(width - 50) * 0.48}]} textStyle={[{color:'#fff'}, fweight.m]} onPress={()=>setCameraModal(true)} />
                                </HStack>
                            </VStack>
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
                                    <DefText text='갤러리 (앨범)' style={[fweight.m, {color:'#fff', marginLeft:7, lineHeight:19}]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={cameraSelected} style={[styles.modalButton, colorSelect.sky]}>
                                <HStack alignItems={'center'}>
                                    <Image source={require('../images/aiCameraIcon.png')} alt='갤러리' style={{width:22, height:19, resizeMode:'contain'}} />
                                    <DefText text='카메라' style={[fweight.m, {color:'#fff', marginLeft:10, lineHeight:19}]} />
                                </HStack>
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

export default TwoRoomImageSelect;