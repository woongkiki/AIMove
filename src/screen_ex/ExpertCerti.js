import React, { useEffect, useState } from 'react';
import { ScrollView, Dimensions, Platform, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Modal } from 'native-base';
import { DefText, DefButton, DefInput } from '../common/BOOTSTRAP';
import { fsize, fweight, colorSelect } from '../common/StyleCommon';
import SubHeader from '../components/SubHeader';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import { BASE_URL } from '../Utils/APIConstant';
import DocumentPicker from 'react-native-document-picker';

const {width} = Dimensions.get("window");

const ExpertCerti = (props) => {

    const {navigation, userInfo} = props;

    const [company, setCompanyName] = useState("");
    const [ceo, setCeo] = useState("");
    const [singleFile, setSingleFile] = useState(''); //파일첨부용
    const [fileNames, setFileNames] = useState(''); //파일 이름

    const companyChange = (text) => {
        setCompanyName(text)
    }

    const ceoChange = (text) => {
        setCeo(text);
    }

    //파일첨부 이벤트
    const selectOneFile = async () => {
        //Opening Document Picker for selection of one file
        try {
          const res = await DocumentPicker.pick({
            type: DocumentPicker.types.allFiles,
            //There can me more options as well
            // DocumentPicker.types.allFiles
            // DocumentPicker.types.images
            // DocumentPicker.types.plainText
            // DocumentPicker.types.audio
            // DocumentPicker.types.pdf
          });
          //Printing the log realted to the file
          console.log('res : ' + JSON.stringify(res));
          console.log('URI : ' + res[0].uri);
          console.log('Type : ' + res[0].type);
          console.log('File Name : ' + res[0].name);
          console.log('File Size : ' + res[0].size);
          //Setting the state to show single file attributes
          setSingleFile(res);
          setFileNames(res[0].name);
        } catch (err) {
          //Handling any exception (If any)
          if (DocumentPicker.isCancel(err)) {
            //If user canceled the document selection
            ToastMessage('파일첨부를 취소하셨습니다.');
          } else {
            //For Unknown Error
            console.log('Unknown Error: ' + JSON.stringify(err));
            throw err;
          }
        }
      };


    const CertiRequest = async () => {

        if(singleFile == ""){
            ToastMessage("사업자 등록증을 첨부해주세요.");
            return false;
        }

        console.log("singleFile::", singleFile);

        const formData = new FormData();
        formData.append("method", 'expert_certiReqeust');
        formData.append("ex_id", userInfo.ex_id);
        formData.append("ex_company", company);
        formData.append("ex_ceo", ceo);

        singleFile.map((item, index) => {
            let tmpName = item.uri;
            let fileLength = tmpName.length;
            let fileDot = tmpName.lastIndexOf('.');
            let fileExt = tmpName.substring(fileDot, fileLength).toLowerCase();
            let strtotime = new Date().valueOf();
            let fullName = strtotime + index + fileExt;

            console.log('uri::', item.uri, 'name::', fullName, 'size::', item.size, 'type::', item.type)
            
            return formData.append('files[]', {'uri' : item.uri, 'name': fullName, 'size': item.size, 'type': item.type});
        })


        const upload = await Api.multipartRequest(formData);
        
       
        if(upload.result){
            console.log("upload::", upload);
            ToastMessage(upload.msg);
            navigation.goBack();
        }else{
            console.log("error", upload);
            ToastMessage("요청 실패");
        }

    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <SubHeader headerTitle="전문가 인증하기" navigation={navigation} />
            <ScrollView>
                <Box px='25px' py='20px'>
                    <Box>
                        <DefText text="회사명" style={[styles.profileLabel]} />
                        <DefInput 
                            placeholder={"회사명을 입력하세요."}
                            value={company}
                            onChangeText={companyChange}
                        />
                    </Box>
                    <Box mt="30px">
                        <DefText text="대표자" style={[styles.profileLabel]} />
                        <DefInput 
                            placeholder={"대표자명을 입력하세요."}
                            value={ceo}
                            onChangeText={ceoChange}
                        />
                    </Box>
                    <Box mt="30px">
                        <DefText text="사업자 등록증" style={[styles.profileLabel]} />
                        <TouchableOpacity style={[styles.fileBtn]} onPress={selectOneFile}>
                            {
                                fileNames != "" ?
                                <DefText text={fileNames} style={[styles.fileText, {color:'#000'}]} />
                                :
                                <DefText text="파일 첨부 +" style={[styles.fileText]} />
                            }
                        </TouchableOpacity>
                    </Box>
                </Box>
            </ScrollView>
            <DefButton
                btnStyle={[styles.certiButton]}
                textStyle={[styles.certiButtonText]}
                text="사업자 인증요청"
                onPress={CertiRequest}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    profileLabel: {
        ...fweight.b,
        ...fsize.fs16
    },
    fileBtn: {
        paddingVertical:15,
        borderBottomWidth:1,
        borderBottomColor:'#BEBEBE',
        paddingLeft:10
    },
    fileText: {
        ...fsize.fs13,
        color:'#BEBEBE'
    },
    certiButton: {
        width:width,
        paddingTop:0,
        paddingBottom:0,
        ...colorSelect.sky,
        height:50,
        borderRadius:0,
    },
    certiButtonText: {
        ...fweight.m,
        color:'#fff'
    },
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_update: (user) => dispatch(UserAction.member_update(user)), //회원정보 변경
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(ExpertCerti);