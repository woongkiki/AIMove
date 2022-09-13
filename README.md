# AIMove
AIMove




## node module 수정본

gift-chat 커스텀 부분이 node 모듈을 새로 다운할 때 마다 원래 코드로 초기화 됨으로<br>
초기화시 아래 경로에 다음 코드를 입력

### react-native-gifted-chat ⇒ lib⇒ Day.js

### (gift-chat 채팅 날짜 형식 및 디자인 변경)

```JS
import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, } from 'react-native';
import dayjs from 'dayjs';
import Color from './Color';
import { StylePropType, isSameDay } from './utils';
import { DATE_FORMAT } from './Constant';
import { useChatContext } from './GiftedChatContext';
import { fsize } from '../../../src/common/StyleCommon';

import moment from 'moment';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    text: {
        backgroundColor: Color.backgroundTransparent,
        color: Color.defaultColor,
        ...fsize.fs12,
        color:'#fff'
    },
    wrapper: {
        backgroundColor:'#DBDBDB',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        padding:2,
        paddingHorizontal:10
    }
});
export function Day({ dateFormat = DATE_FORMAT, currentMessage, previousMessage, containerStyle, wrapperStyle, textStyle, }) {
    const { getLocale } = useChatContext();
    if (currentMessage == null || isSameDay(currentMessage, previousMessage)) {
        return null;
    }

    const date = moment(currentMessage.createdAt);
    const dow = date.day();

    return (<View style={[styles.container, containerStyle]}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.text, textStyle]}>
            {date.format('YYYY년 M월 D일 ')}
            {dow === 1
                ? '월요일'
                : dow === 2
                ? '화요일'
                : dow === 3
                ? '수요일'
                : dow === 4
                ? '목요일'
                : dow === 5
                ? '금요일'
                : dow === 6
                ? '토요일'
                : dow === 7 && '일요일'}
        </Text>
      </View>
    </View>);
}
Day.propTypes = {
    currentMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    inverted: PropTypes.bool,
    containerStyle: StylePropType,
    wrapperStyle: StylePropType,
    textStyle: StylePropType,
    dateFormat: PropTypes.string,
};
//# sourceMappingURL=Day.js.map
```


### react-native-gifted-chat ⇒ lib⇒ Time.js

### (gift-chat 채팅 날짜 형식 및 디자인 변경)

```JS
import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import Color from './Color';
import { TIME_FORMAT } from './Constant';
import { StylePropType } from './utils';
import { useChatContext } from './GiftedChatContext';

import moment from 'moment';

const { containerStyle } = StyleSheet.create({
    containerStyle: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
    },
});
const { textStyle } = StyleSheet.create({
    textStyle: {
        fontSize: 11,
        color:'#919191',
        backgroundColor: 'transparent',
        textAlign: 'right',
    },
});
const styles = {
    left: StyleSheet.create({
        container: {
            ...containerStyle,
        },
        text: {
            color: Color.timeTextColor,
            ...textStyle,
        },
    }),
    right: StyleSheet.create({
        container: {
            ...containerStyle,
        },
        text: {
            color: Color.white,
            ...textStyle,
        },
    }),
};
export function Time({ position = 'left', containerStyle, currentMessage, timeFormat = TIME_FORMAT, timeTextStyle, }) {
    const { getLocale } = useChatContext();

    const date = moment(currentMessage.createdAt);
    let times = date.hour();
    let min = date.minute();
  
    if(times > 12){
        times = times - 12;
    }else{
        times = times;
    }

    if(min > 10){
        min = min;
    }else{
        min = "0" + min;
    }

    if (currentMessage == null) {
        return null;
    }
    return (<View style={[
            styles[position].container,
            containerStyle && containerStyle[position],
        ]}>
      <Text style={[
            styles[position].text,
            timeTextStyle && timeTextStyle[position],
        ]}>
        {/* {dayjs(currentMessage.createdAt).locale(getLocale()).format(timeFormat)} */}
        {times < 12 ? "오후 " : "오전 "}
        {times + ":" + min}
      </Text>
    </View>);
}
Time.propTypes = {
    position: PropTypes.oneOf(['left', 'right']),
    currentMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    timeFormat: PropTypes.string,
    timeTextStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
};
//# sourceMappingURL=Time.js.map
```
