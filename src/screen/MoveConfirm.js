import React, {Fragment, useEffect, useState} from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Platform, SafeAreaView, Animated, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal, CheckIcon } from 'native-base';
import { DefText, DefButton, DefInput, BottomButton } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import { numberFormat, textLengthOverCut } from '../common/DataFunction';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import ToastMessage from '../components/ToastMessage';
import Api from '../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { BASE_URL } from '../Utils/APIConstant';
import {WebView} from 'react-native-webview';
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

const dummy = [
    {
        "idx":1,
        "icon":"https://mymoving.cafe24.com/images/bigBoxIcon.png",
        "product":"에어컨",
        "count":2,
        "trash":false,
        "itemCheck":true
    },
    {
        "idx":2,
        "icon":"https://mymoving.cafe24.com/images/bigBoxIcon.png",
        "product":"냉장고",
        "count":1,
        "trash":false,
        "itemCheck":true
    }
];

const dummyCheck = [1,2];

const MoveConfirm = (props) => {

    const {navigation, userInfo, route} = props;
    const { params } = route;


    const [aiImageLoading, setAiImageLoading] = useState(false);
    const [dummyData, setDummyData] = useState(dummy);
    const [selectItem, setSelectItem] = useState(""); //선택
    const [trashItem, setTrashItem] = useState("");
    const [imageIndex, setImageIndex] = useState("0");

    const [nowAiImage, setNowAiImage] = useState([]); // 인식한 이미지
    const [aiBoxList, setAiBoxList] = useState([]); //인식한 박스

    const [aiImageData, setAiImageData] = useState([]);
    const [aiImageList, setAiImageList] = useState([]);

    const [appText, setAppText] = useState("");

    const productSelectHanlder2 = (idx, product, index, label) => {


        //목록 수정
        let ImageProductNewData = {...aiImageList[index]}; // 주요 이삿짐 목록 중 선택한 목록
        if(ImageProductNewData.itemCheck == 0){
            ImageProductNewData.itemCheck = 1;
        }else{
            ImageProductNewData.itemCheck = 0;
        }

        let changeProductData = [...aiImageList];
        changeProductData[index] = ImageProductNewData;

        setAiImageList(changeProductData);

        //이미지 위 박스 수정
        aiBoxList.forEach(function(item) {

            if(item.idx == ImageProductNewData.idx){
                
                let boxidx = aiBoxList.indexOf(item);

                let boxData = {...aiBoxList[boxidx]};

                if(boxData.itemCheck == 0){
                    boxData.itemCheck = 1;
                }else{
                    boxData.itemCheck = 0;
                }

                let changeBoxList = [...aiBoxList];
                changeBoxList[boxidx] = boxData;

                setAiBoxList(changeBoxList);
                
            }
        })


        Api.send('ai_dataChange', {"bidx":params.bidx, "product":product, "label":label, "idx":idx, "imageIndex":imageIndex}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('박스 값 수정::: ', resultItem);
               //setAppInfoVideoKey(arrItems);
            }else{
               console.log('박스 값 수정 실패:::', resultItem);
               //setAppInfoVideoKey("");
            }
        });

    }


    const trashSelect2 = (index) => {

        let productTrashNew = {...aiImageList[index]};

        console.log(productTrashNew)
      
        if(productTrashNew.trash == 0){
            productTrashNew.trash = 1;
        }else{
            productTrashNew.trash = 0;
        }

        console.log(productTrashNew)

        let changeProductTrash = [...aiImageList];
        changeProductTrash[index] = productTrashNew;

        console.log("원본", changeProductTrash[index])
        //changeProductTrash[index] = productTrashNew;
        setAiImageList(changeProductTrash);

        
        Api.send('ai_trashChange', {"bidx":params.bidx, "idx":productTrashNew.idx, "imageIndex":imageIndex, "trash":changeProductTrash[index].trash}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('상품 버릴짐 상태 값 수정::: ', resultItem);
            }else{
               console.log('상품 버릴짐 상태값 실패:::', resultItem);
            }
        });
    }
    

    const productPlusHandler = (index) => {

        let productCountNew = {...aiImageList[index]};
        productCountNew.productCount = parseInt(productCountNew.productCount);

        productCountNew.productCount += 1;

        let changeProductCount = [...aiImageList];
        changeProductCount[index] = productCountNew;

        setAiImageList(changeProductCount);

        Api.send('ai_countChange', {"bidx":params.bidx, "idx":productCountNew.idx, "imageIndex":imageIndex, "count":changeProductCount[index].productCount}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('상품 카운트 값 수정::: ', resultItem);
            }else{
               console.log('상품 카운트 값 실패:::', resultItem);
            }
        });
       
    }

    const productMinusHandler = (index) => {

        let productCountNew = {...aiImageList[index]};
        productCountNew.productCount = parseInt(productCountNew.productCount);

        if(productCountNew.productCount == 1){
            ToastMessage("최소수량은 1개입니다.");
            return false;
        }else{
            productCountNew.productCount -= 1;
        }

        let changeProduct = [...aiImageList];
        changeProduct[index] = productCountNew;

        setAiImageList(changeProduct);

        Api.send('ai_countChange', {"bidx":params.bidx, "idx":productCountNew.idx, "imageIndex":imageIndex, "count":changeProduct[index].productCount}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('상품 카운트 값 수정::: ', resultItem);
            }else{
               console.log('상품 카운트 값 실패:::', resultItem);
            }
        });
    }

 

    //다음화면
    const nextNavigation = async () => {
        

        // console.log('aiImageData:::::',aiImageData);

        // const formData = new FormData();
        // formData.append('method', 'ai_aiImageInsert');


        // let arr = JSON.stringify(aiImageData);

        // formData.append('arr', arr);
        // formData.append('id', userInfo.id);

        // const upload = await Api.multipartRequest(formData);

        // console.log("upload:::", upload);
        // if(upload.result){
        //     navigation.navigate("SmallMoveCategory", {"bidx":params.bidx});
        // }
        if(params.w == 'u'){
            navigation.push("SmallMoveConfirm", {"bidx":params.bidx, "moveCategory":params.moveCategory, "pakageType":params.pakageType, "personStatus":params.personStatus, "keepStatus":params.keepStatus, "startMoveTool":params.startMoveTool, "startFloor":params.startFloor, "startAddress": params.startAddress, "destinationMoveTool":params.destinationMoveTool, "destinationFloor":params.destinationFloor, "destinationAddress":params.destinationAddress, "moveDate":params.moveDate, "moveDatetime":params.moveDatetime, 'moveHelp':params.moveHelp, 'moveDateKeep':params.moveDateKeep, 'moveInKeep':params.moveInKeep });
        }else{  
            navigation.navigate("SmallMoveCategory", {"bidx":params.bidx});
        }
    }


    const aiImageApi = () => {
        Api.send('ai_aiImage', {'id':userInfo.id, 'bidx':params.bidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('ai 분석 결과 보기: ', arrItems[imageIndex]);

               setAiImageData(arrItems);

            }else{
               console.log('ai 분석 결과 보기 실패!', resultItem);
               
            }
        });
    }

    const aiImageArrayApi = () => {
        Api.send('ai_nowImages', {'id':userInfo.id, 'bidx':params.bidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('ai 요청 이미지 보기: ', resultItem);
               setNowAiImage(arrItems);

            }else{
               console.log('ai 요청 이미지 보기 실패!', resultItem);
               
            }
        });
    }

    const aiImageProductList = () => {
        Api.send('ai_aiImageProduct', {'id':userInfo.id, 'bidx':params.bidx, 'imageIndex':imageIndex}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
              // console.log('ai 주요 이삿짐 상품 박스 보기: ', resultItem, arrItems);

               //setAiImageList(arrItems);
               setAiBoxList(arrItems);

            }else{
               console.log('ai 주요 이삿짐 상품 박스 실패!', resultItem);
               
            }
        });
    }

    const aiImageListApi = () => {
        Api.send('ai_aiImageList', {'id':userInfo.id, 'bidx':params.bidx, 'imageIndex':imageIndex}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               // console.log('ai 주요 이삿짐 목록 결과 보기: ', resultItem, arrItems);

               setAiImageList(arrItems);

            }else{
               console.log('ai 주요 이삿짐 목록 실패!', resultItem);
               
            }
        });
    }

    const pageTextApi = () => {
        Api.send('text_moveConfirmText', {}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('페이지 문구 보기: ', arrItems);
               setAppText(arrItems.smallImageConfirmText);
            }else{
               console.log('페이지 문구 출력 실패!', resultItem);
               //setAppInfoVideoKey("");
            }
        });
    }

    useEffect(()=> {

        //aiImageApi();
        aiImageArrayApi(); // 요청이미지
        aiImageProductList(); //  인식된 박스
        aiImageListApi(); // 주요 이삿짐 리스트 x3이상
     

        //console.log("dummyData:::", dummyData);
    }, [dummyData]);


    useEffect(()=> {
        //console.log("변화::", aiImageData);

        aiImageProductList();
        aiImageListApi();

    }, [imageIndex])

    useEffect(() => {
        pageTextApi();
    }, [])


    const imageSelect = async (index) => {
        //console.log("이미지번호", index);
        await setAiImageLoading(true);
        await setImageIndex(index);
        await setAiImageLoading(false);
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader navigation={navigation} headerTitle={ params.w == 'u' ? '소형이사 (원룸이사) 요청 수정' : '소형이사 (원룸이사) 견적요청'} />
           
                {
                    aiImageLoading ? 
                    <Box height='286px' width={width} justifyContent='center' alignItems={'center'}>
                        <ActivityIndicator size='large' color='#333' />
                    </Box>
                    :
                    <Box>
                        {
                            nowAiImage != "" &&
                            <Box>
                                <TouchableOpacity activeOpacity={1} onPress={()=>navigation.navigate("ImageView", nowAiImage)}>
                                    <Image 
                                        source={{uri:BASE_URL + "/data/file/ai/" + userInfo.id + "/" + nowAiImage[imageIndex].f_file + '?date' + new Date()}}
                                        style={{
                                            width:width,
                                            height:300,
                                            resizeMode:'stretch'
                                        }}
                                    />
                                </TouchableOpacity>
                                {
                                    aiBoxList != "" &&
                                    aiBoxList.map((box, index) => {

                                        let boxWidth = box.x2 - box.x1;
                                        let boxHeight = box.y2 - box.y1;
                                        let boxLeft = box.x1;
                                        let boxBottom = box.y1;

                                        let boxWidthPercent = boxWidth / box.img_width;
                                        let boxWidthPercent2 = width * boxWidthPercent;

                                        let boxHeightPercent = boxHeight / box.img_height;
                                        let boxHeightPercent2 = 300 * boxHeightPercent;

                                        let leftPercent = boxLeft / box.img_width;
                                        let leftPercent2 = width * leftPercent;
                                        
                                        let bottomPercent = boxBottom / box.img_height;
                                        let bottomPercent2 = 300 * bottomPercent;

                                        if( box.itemCheck == 1){
                                            return(
                                                <Box 
                                                    key={index}
                                                    width={ boxWidthPercent2 + 'px' }
                                                    height={ boxHeightPercent2 + 'px' }
                                                    backgroundColor='rgba(0,0,0,0.3)'
                                                    borderWidth={ box.size >= 3 ? 2 : 1}
                                                    borderColor={ box.size >= 3 ? '#ff0' : '#0195ff'}
                                                    position={'absolute'}
                                                    //bottom={ Platform.OS == 'ios' ? 'auto' : bottomPercent2 + 'px'}
                                                    top={  bottomPercent2 + 'px'}
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
                                        }
                                    })
                                }
                            </Box>
                        }
                    </Box>
                }
             <ScrollView>
                {
                    nowAiImage != "" && 
                    <HStack px='25px' mt='10px' flexWrap={'wrap'}>
                        {
                            nowAiImage.map((item, index) => {
                                return(
                                    <Box key={index} style={ [ {borderWidth:3, borderRadius:13, width:  (width - 50) * 0.3, marginTop:10},(index + 1) % 3 == 0 ? {marginRight:0} : {marginRight:(width - 50) * 0.05} , index == imageIndex ?{borderColor:'#0195ff'} : {borderColor:'#fff'} ]}>
                                        <TouchableOpacity onPress={()=>imageSelect(index)} style={{borderRadius:10, overflow:'hidden'}}>
                                            <Image 
                                                source={{uri:BASE_URL + "/data/file/ai/" + userInfo.id + "/" + item.f_file + '?date' + new Date()}}
                                                alt='샘플'
                                                style={{
                                                    width:  '100%',
                                                    height: 80,
                                                    resizeMode:'stretch',
                                                    borderRadius:10
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </Box>
                                )
                            })
                        }
                    </HStack>
                }
                {
                    aiImageData != "" &&
                    <HStack px='25px' mt='20px'>
                        {
                            aiImageData.map((item, index) => {

                                //console.log('item::::::' + index, item);
                                return(
                                    <Box key={index}>
                                        {
                                            index != imageIndex ?
                                            <TouchableOpacity onPress={()=>imageSelect(index)} style={ (index + 1) % 3 == 0 ? {marginRight:0} : {marginRight:(width - 50) * 0.05}}>
                                                <Box>
                                                    <Image
                                                        source={{uri:BASE_URL + "/data/file/ai/" + userInfo.id + "/" + item.imgName}}
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
                
                <Box p='25px'>
                    {
                        appText != "" &&
                        <WebRender html={appText} />
                    }
                    {/* <DefText 
                        text={"사진에 인식된 이삿짐 목록을 확인해 주세요."}
                        style={[styles.defText]}
                    />
                    <DefText 
                        text={"AI가 이삿짐을 네모 박스로 정확히 지정을 못해도,\n이사 견적과는 상관 없으니 신경 안 쓰셔도 됩니다."}
                        style={[styles.defText, {marginTop:10}]}
                    />
                    <DefText 
                        text={"중복된 물품은 없는지, 놓친 이삿짐은 없는지 아래 목록을 통해 수량을 다시 확인해 주세요."}
                        style={[styles.defText, {marginTop:10}]}
                    /> */}
                    {
                        aiImageList != "" &&
                        <Box mt='20px'>
                            <DefText text="주요 이삿짐 목록" style={[fweight.b, {marginBottom:20}]} />
                            {
                                aiImageList.map((item, index) => {
                                    return(
                                        <Box key={index}>
                                            <HStack alignItems='flex-start' justifyContent={'space-between'} mt={ index != 0 ? '40px' : 0}>
                                                <TouchableOpacity onPress={()=>productSelectHanlder2(item.idx, item.product, index, item.label)} style={{paddingTop:5}}>
                                                    <HStack>
                                                        <Box style={[styles.checkBox, item.itemCheck == 1 ? [colorSelect.sky, {borderWidth:0}] : {backgroundColor:'#fff', borderWidth:1} ]}>
                                                            {
                                                                item.itemCheck == 1 &&
                                                                <Image source={require("../images/checkIcon.png")} style={{width:10, height:7}} />
                                                            }
                                                        </Box>
                                                        <HStack ml='15px' alignItems={'center'}>
                                                            <Image source={{uri:'https://mymoving.cafe24.com/images/bigBoxIcon.png'}} alt={item.product} style={{width:22, height:23, resizeMode:'contain'}} />
                                                            <DefText text={item.product} style={[styles.productText, item.itemCheck == 1 ? {color:'#000'} : {color:'#aaa'}]} />
                                                        </HStack>
                                                    </HStack>
                                                </TouchableOpacity>
                                                <VStack alignItems={'flex-end'} >
                                                    
                                                    <TouchableOpacity disabled={ item.itemCheck == 1 ? false : true } style={[styles.trashButton, item.trash == 1 ? {backgroundColor:'#0195ff'} : {backgroundColor:'#DFDFDF'}, item.itemCheck == 0 && {backgroundColor:'#dfdfdf'} ]} onPress={()=>trashSelect2(index)}>
                                                        <DefText text='버릴짐 (1/2 비용발생)' style={[styles.trashButtonText, item.trash == 1 && {color:'#fff'}]} />
                                                    </TouchableOpacity>

                                                    <HStack alignItems='center' style={[styles.countBox]} mt='10px' backgroundColor={ item.itemCheck == 0 ? '#eee' : '#fff' }>
                                                        <TouchableOpacity disabled={ item.itemCheck == 1 ? false : true } onPress={()=>productMinusHandler(index)} style={[styles.countInnerBox]}>
                                                            <Image source={require("../images/cntMinusIcon.png")} style={{width:12, height:3, resizeMode:'contain'}} />
                                                        </TouchableOpacity>
                                                        <Box style={[styles.countInnerBox]}>
                                                            <DefText text={item.productCount} style={[styles.countInnerText]} />
                                                        </Box>
                                                        <TouchableOpacity disabled={ item.itemCheck == 1 ? false : true } onPress={()=>productPlusHandler(index)} style={[styles.countInnerBox]}>
                                                            <Image source={require("../images/cntPlusIcon.png")} style={{width:12, height:12, resizeMode:'contain'}} />
                                                        </TouchableOpacity>
                                                    </HStack>
                                                </VStack>
                                            </HStack>
                                            {
                                                item.trash == 1 &&
                                                item.itemCheck == 1 &&
                                                <DefText text={"선택한 이삿짐(" + item.product + ")을 버릴수 있게 1층으로\n옮겨드립니다."} style={[styles.defText, {marginTop:15}]} />
                                            }
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                    }
                    <Box>
                    {/* {
                        aiImageData != "" &&
                        aiImageData[imageIndex].boxdata.map((item, index) => {
                            return(
                                <>
                                    {
                                        item.product != '상자' &&
                                        <Box key={index}>
                                            <HStack alignItems='flex-start' justifyContent={'space-between'} mt={'40px'}>
                                                <TouchableOpacity onPress={()=>productSelectHanlder2(index)} style={{paddingTop:5}}>
                                                    <HStack>
                                                        <Box style={[styles.checkBox, item.itemCheck ? [colorSelect.sky, {borderWidth:0}] : {backgroundColor:'#fff', borderWidth:1} ]}>
                                                            {
                                                                item.itemCheck == 1 &&
                                                                <Image source={require("../images/checkIcon.png")} style={{width:10, height:7}} />
                                                            }
                                                        </Box>
                                                        <HStack ml='15px' alignItems={'center'}>
                                                            <Image source={{uri:'https://mymoving.cafe24.com/images/bigBoxIcon.png'}} alt={item.product} style={{width:22, height:23, resizeMode:'contain'}} />
                                                            <DefText text={item.product} style={[styles.productText, item.itemCheck ? {color:'#000'} : {color:'#aaa'}]} />
                                                        </HStack>
                                                    </HStack>
                                                </TouchableOpacity>
                                                <VStack alignItems={'flex-end'} >
                                                    <TouchableOpacity disabled={ item.itemCheck == 1 ? false : true } style={[styles.trashButton, item.trash == 1 ? colorSelect.sky : {backgroundColor:'#DFDFDF'}, !item.itemCheck && {backgroundColor:'#dfdfdf'} ]} onPress={()=>trashSelect2(index)}>
                                                        <DefText text='버릴짐 (1/2 비용발생)' style={[styles.trashButtonText]} />
                                                    </TouchableOpacity>

                                                    <HStack alignItems='center' style={[styles.countBox]} mt='10px' backgroundColor={ !item.itemCheck == 1 ? '#eee' : '#fff' }>
                                                        <TouchableOpacity disabled={ item.itemCheck == 1 ? false : true } onPress={()=>productMinusHandler(index)} style={[styles.countInnerBox]}>
                                                            <Image source={require("../images/cntMinusIcon.png")} style={{width:12, height:3, resizeMode:'contain'}} />
                                                        </TouchableOpacity>
                                                        <Box style={[styles.countInnerBox]}>
                                                            <DefText text={item.productCount} style={[styles.countInnerText]} />
                                                        </Box>
                                                        <TouchableOpacity disabled={ item.itemCheck == 1 ? false : true } onPress={()=>productPlusHandler(index)} style={[styles.countInnerBox]}>
                                                            <Image source={require("../images/cntPlusIcon.png")} style={{width:12, height:12, resizeMode:'contain'}} />
                                                        </TouchableOpacity>
                                                    </HStack>
                                                </VStack>
                                            </HStack>
                                            {
                                                item.trash == 1 &&
                                                item.itemCheck == 1 &&
                                                <DefText text={"선택한 이삿짐(" + item.product + ")을 버릴수 있게 1층으로\n옮겨드립니다."} style={[styles.defText, {marginTop:15}]} />
                                            }
                                        </Box>
                                    }
                                </>
                            )
                        })
                    } */}
                    </Box>
                </Box>
               
            </ScrollView>
            <BottomButton leftText='이전' rightText='다음' leftonPress={()=>navigation.goBack()} rightonPress={nextNavigation}/>
        </Box>
    );
};

const styles = StyleSheet.create({
    defText: {
        ...fsize.fs14,
        color: '#aaa'
    },
    checkBox: {
        width:20,
        height:20,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#DFDFDF',
        backgroundColor:"#fff"
    },
    productText: {
        ...fweight.m,
        marginLeft:10,
    },
    trashButton: {
        height:32,
        paddingHorizontal:15,
        backgroundColor:'#DFDFDF',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    },
    trashButtonText: {
        ...fsize.fs12,
        ...fweight.m,
        color:'#666'
    },
    countBox: {
        width:100,
        height:34,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#DFDFDF'
    },
    countInnerBox: {
        width: 100 / 3,
        height:34,
        justifyContent:'center',
        alignItems:'center'
    },
    countInnerText: {
        ...fweight.m
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    })
)(MoveConfirm);