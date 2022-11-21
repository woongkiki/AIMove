import React, {Fragment, useEffect, useState} from 'react';
import { TouchableOpacity, Dimensions, Image } from 'react-native';
import { Box } from 'native-base';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { BASE_URL } from '../Utils/APIConstant';
import ImageViewer from 'react-native-image-zoom-viewer';
import Loading from '../components/Loading';

const {width, height} = Dimensions.get("window");

const AIMoveImageView = (props) => {

    const {navigation, route, userInfo} = props;
    const {params} = route;

    useEffect(() => {
        console.log(params);
        _setGalleryList();
    }, [])

    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);


    const _setGalleryList = async () => {
        await setLoading(true);
        try{
            let newArray = [];
            let imageData = {};
           
            params.map((img) => {
                imageData = {'url' : BASE_URL + "/data/file/ai/" + userInfo.id + "/" + img.f_file };
                newArray.push(imageData);
            })
        
            await setImages(newArray);
        } catch(e) {
            console.log('error', e);
        }
        await setLoading(false);
    }

    return (
        <Box flex={1}>
            {
                loading ?
                <Loading />
                :
                <Box>
                </Box>
            }
        </Box>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
    })
)(AIMoveImageView);