import React, {Fragment, useEffect, useState} from 'react';
import { TouchableOpacity, Dimensions, Image } from 'react-native';
import { Box } from 'native-base';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { BASE_URL } from '../Utils/APIConstant';
import ImageViewer from 'react-native-image-zoom-viewer';
import Loading from '../components/Loading';

const {width, height} = Dimensions.get("window");

const CarAuctionImageView = (props) => {

    const {navigation, route, userInfo} = props;
    const {params} = route;

   //console.log("TwoRoomImageView::", params);

    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);

    const _setGalleryList = async () => {
        await setLoading(true);
        try{
            let newArray = [];
            let imageData = {};
           
            params.map((img) => {

                console.log("path::::", img.path);
                imageData = {'url' : BASE_URL + "/data/file/car/" + img.f_file };
                newArray.push(imageData);
            })
        
            await setImages(newArray);
        } catch(e) {
            console.log('error', e);
        }
        await setLoading(false);
    }

    useEffect(()=> {
        _setGalleryList();
    }, [])


    useState(() => {
        console.log('images::::',images);
    }, [images])

    return (
        <Box flex={1} backgroundColor='#000'>
            {
                loading ?
                <Loading />
                :
                <Box flex={1}>
                    <Box position={'absolute'} top='35px' left='25px' zIndex={99}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                            <Image 
                                source={require('../images/keepModalCloseW.png')}
                                style={{
                                    width:24,
                                    height:24,
                                    resizeMode:'stretch'
                                }}
                            />
                        </TouchableOpacity>
                    </Box>
                    <ImageViewer 
                        imageUrls={images}
                        loadingRender={()=><Loading />}
                    />
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
)(CarAuctionImageView);