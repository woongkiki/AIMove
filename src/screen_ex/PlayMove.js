import React from 'react';
import {Box} from 'native-base';
import { DefText } from '../common/BOOTSTRAP';

const PlayMove = (props) => {

    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff'>
            <DefText text="참여" />
        </Box>
    );
};

export default PlayMove;