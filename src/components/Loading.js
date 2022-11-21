import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Box} from 'native-base';

const Loading = (props) => {
    return (
        <Box flex={1} backgroundColor='#fff' justifyContent={'center'} alignItems='center'>
            <ActivityIndicator size='large' color='#333' />
        </Box>
    );
};

export default Loading;