# 내집이사
내집이사

## node module 수정본

node 모듈을 새로 다운할 때 마다 원래 코드로 초기화 됨으로<br>
초기화시 아래 경로에 다음 코드를 입력

## 채팅 커스텀

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
        marginTop:5,
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

### react-native-gifted-chat ⇒ lib⇒ Avatar.js

### (gift-chat 아바타 이미지 크기 수정)

```JS
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View, } from 'react-native';
import GiftedAvatar from './GiftedAvatar';
import { StylePropType, isSameUser, isSameDay } from './utils';
const styles = {
    left: StyleSheet.create({
        container: {
            marginRight: 0,
        },
        onTop: {
            alignSelf: 'flex-start',
        },
        onBottom: {},
        image: {
            height: 36,
            width: 36,
            borderRadius: 36,
        },
    }),
    right: StyleSheet.create({
        container: {
            marginLeft: 8,
        },
        onTop: {
            alignSelf: 'flex-start',
        },
        onBottom: {},
        image: {
            height: 36,
            width: 36,
            borderRadius: 18,
        },
    }),
};
export function Avatar(props) {
    const { renderAvatarOnTop, showAvatarForEveryMessage, containerStyle, position, currentMessage, renderAvatar, previousMessage, nextMessage, imageStyle, } = props;
    const messageToCompare = renderAvatarOnTop ? previousMessage : nextMessage;
    const computedStyle = renderAvatarOnTop ? 'onTop' : 'onBottom';
    if (renderAvatar === null) {
        return null;
    }
    if (!showAvatarForEveryMessage &&
        currentMessage &&
        messageToCompare &&
        isSameUser(currentMessage, messageToCompare) &&
        isSameDay(currentMessage, messageToCompare)) {
        return (<View style={[
                styles[position].container,
                containerStyle && containerStyle[position],
            ]}>
        <GiftedAvatar avatarStyle={[
                styles[position].image,
                imageStyle && imageStyle[position],
            ]}/>
      </View>);
    }
    const renderAvatarComponent = () => {
        if (props.renderAvatar) {
            const { renderAvatar, ...avatarProps } = props;
            return props.renderAvatar(avatarProps);
        }
        if (props.currentMessage) {
            return (<GiftedAvatar avatarStyle={[
                    styles[props.position].image,
                    props.imageStyle && props.imageStyle[props.position],
                ]} user={props.currentMessage.user} onPress={() => { var _a; return (_a = props.onPressAvatar) === null || _a === void 0 ? void 0 : _a.call(props, props.currentMessage.user); }} onLongPress={() => { var _a; return (_a = props.onLongPressAvatar) === null || _a === void 0 ? void 0 : _a.call(props, props.currentMessage.user); }}/>);
        }
        return null;
    };
    return (<View style={[
            styles[position].container,
            styles[position][computedStyle],
            containerStyle && containerStyle[position],
        ]}>
      {renderAvatarComponent()}
    </View>);
}
Avatar.defaultProps = {
    renderAvatarOnTop: false,
    showAvatarForEveryMessage: false,
    position: 'left',
    currentMessage: {
        user: null,
    },
    previousMessage: {},
    nextMessage: {},
    containerStyle: {},
    imageStyle: {},
    onPressAvatar: () => { },
    onLongPressAvatar: () => { },
};
Avatar.propTypes = {
    renderAvatarOnTop: PropTypes.bool,
    showAvatarForEveryMessage: PropTypes.bool,
    position: PropTypes.oneOf(['left', 'right']),
    currentMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    onPressAvatar: PropTypes.func,
    onLongPressAvatar: PropTypes.func,
    renderAvatar: PropTypes.func,
    containerStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    imageStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
};
//# sourceMappingURL=Avatar.js.map
```

### react-native-gifted-chat ⇒ lib ⇒ Bubble.js

### (gift-chat 말풍선 수정)

```JS
import PropTypes from 'prop-types';
import React from 'react';
import { Text, Clipboard, StyleSheet, TouchableWithoutFeedback, View, } from 'react-native';
import { GiftedChatContext } from './GiftedChatContext';
import { QuickReplies } from './QuickReplies';
import { MessageText } from './MessageText';
import { MessageImage } from './MessageImage';
import { MessageVideo } from './MessageVideo';
import { MessageAudio } from './MessageAudio';
import { Time } from './Time';
import Color from './Color';
import { StylePropType, isSameUser, isSameDay } from './utils';
import { Box } from 'native-base';
const styles = {
    left: StyleSheet.create({
      container: {
        flex: 1,
        marginRight: 100, // move from wrapper
        alignItems: "flex-start",
        marginBottom: 0,
      },
  
      wrapper: {
        borderRadius: 15,
        backgroundColor: "#f0f0f0",
        // marginRight: 60, remove
        marginRight: -3,
        minHeight: 20,
        justifyContent: "flex-end",
      },
      containerToNext: {
        borderBottomLeftRadius: 0,
      },
      containerToPrevious: {
        borderTopLeftRadius: 0,
      },
      positions: {
        marginLeft: 0,
      },
    }),
  
    right: StyleSheet.create({
      container: {
        flex: 1,
        alignItems: "flex-end",
        marginLeft: 90, // move from wrapper
        
      },
      wrapper: {
        borderRadius: 15,
        backgroundColor: "#0084ff",
        marginLeft: -3, //remove
        minHeight: 20,
        justifyContent: "flex-end",
      },
      containerToNext: {
        borderBottomRightRadius: 0,
      },
      containerToPrevious: {
        borderTopRightRadius: 0,
      },
      positions: {
        marginRight: 0,
      },
    }),
    bottom: {
      // before:
      // flexDirection: 'row',
      // justifyContent: 'flex-end',
      alignItems: "flex-end",
    },
    tick: {
      fontSize: 10,
      backgroundColor: "transparent",
      color: "white",
    },
    tickView: {
      flexDirection: "row",
      marginRight: 10,
    },
  };
const DEFAULT_OPTION_TITLES = ['Copy Text', 'Cancel'];
export default class Bubble extends React.Component {
    constructor() {
        super(...arguments);
        this.onPress = () => {
            if (this.props.onPress) {
                this.props.onPress(this.context, this.props.currentMessage);
            }
        };
        this.onLongPress = () => {
            const { currentMessage } = this.props;
            if (this.props.onLongPress) {
                this.props.onLongPress(this.context, this.props.currentMessage);
            }
            else if (currentMessage && currentMessage.text) {
                const { optionTitles } = this.props;
                const options = optionTitles && optionTitles.length > 0
                    ? optionTitles.slice(0, 2)
                    : DEFAULT_OPTION_TITLES;
                const cancelButtonIndex = options.length - 1;
                this.context.actionSheet().showActionSheetWithOptions({
                    options,
                    cancelButtonIndex,
                }, (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            Clipboard.setString(currentMessage.text);
                            break;
                        default:
                            break;
                    }
                });
            }
        };
    }
    styledBubbleToNext() {
        const { currentMessage, nextMessage, position, containerToNextStyle, } = this.props;
        if (currentMessage &&
            nextMessage &&
            position &&
            isSameUser(currentMessage, nextMessage) &&
            isSameDay(currentMessage, nextMessage)) {
            return [
                styles[position].containerToNext,
                containerToNextStyle && containerToNextStyle[position],
            ];
        }
        return null;
    }
    styledBubbleToPrevious() {
        const { currentMessage, previousMessage, position, containerToPreviousStyle, } = this.props;
        if (currentMessage &&
            previousMessage &&
            position &&
            isSameUser(currentMessage, previousMessage) &&
            isSameDay(currentMessage, previousMessage)) {
            return [
                styles[position].containerToPrevious,
                containerToPreviousStyle && containerToPreviousStyle[position],
            ];
        }
        return null;
    }
    renderQuickReplies() {
        const { currentMessage, onQuickReply, nextMessage, renderQuickReplySend, quickReplyStyle, quickReplyTextStyle, } = this.props;
        if (currentMessage && currentMessage.quickReplies) {
            const { containerStyle, wrapperStyle, ...quickReplyProps } = this.props;
            if (this.props.renderQuickReplies) {
                return this.props.renderQuickReplies(quickReplyProps);
            }
            return (<QuickReplies currentMessage={currentMessage} onQuickReply={onQuickReply} renderQuickReplySend={renderQuickReplySend} quickReplyStyle={quickReplyStyle} quickReplyTextStyle={quickReplyTextStyle} nextMessage={nextMessage}/>);
        }
        return null;
    }
    renderMessageText() {
        if (this.props.currentMessage && this.props.currentMessage.text) {
            const { containerStyle, wrapperStyle, optionTitles, ...messageTextProps } = this.props;
            if (this.props.renderMessageText) {
                return this.props.renderMessageText(messageTextProps);
            }
            return <MessageText {...messageTextProps}/>;
        }
        return null;
    }
    renderMessageImage() {
        if (this.props.currentMessage && this.props.currentMessage.image) {
            const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
            if (this.props.renderMessageImage) {
                return this.props.renderMessageImage(messageImageProps);
            }
            return <MessageImage {...messageImageProps}/>;
        }
        return null;
    }
    renderMessageVideo() {
        if (this.props.currentMessage && this.props.currentMessage.video) {
            const { containerStyle, wrapperStyle, ...messageVideoProps } = this.props;
            if (this.props.renderMessageVideo) {
                return this.props.renderMessageVideo(messageVideoProps);
            }
            return <MessageVideo {...messageVideoProps}/>;
        }
        return null;
    }
    renderMessageAudio() {
        if (this.props.currentMessage && this.props.currentMessage.audio) {
            const { containerStyle, wrapperStyle, ...messageAudioProps } = this.props;
            if (this.props.renderMessageAudio) {
                return this.props.renderMessageAudio(messageAudioProps);
            }
            return <MessageAudio {...messageAudioProps}/>;
        }
        return null;
    }
    renderTicks() {
        const { currentMessage, renderTicks, user } = this.props;
        if (renderTicks && currentMessage) {
            return renderTicks(currentMessage);
        }
        if (currentMessage &&
            user &&
            currentMessage.user &&
            currentMessage.user._id !== user._id) {
            return null;
        }
        if (currentMessage &&
            (currentMessage.sent || currentMessage.received || currentMessage.pending)) {
            return (<View style={styles.content.tickView}>
          {!!currentMessage.sent && (<Text style={[styles.content.tick, this.props.tickStyle]}>✓</Text>)}
          {!!currentMessage.received && (<Text style={[styles.content.tick, this.props.tickStyle]}>✓</Text>)}
          {!!currentMessage.pending && (<Text style={[styles.content.tick, this.props.tickStyle]}>🕓</Text>)}
        </View>);
        }
        return null;
    }
    renderTime() {
        if (this.props.currentMessage && this.props.currentMessage.createdAt) {
            const { containerStyle, wrapperStyle, textStyle, ...timeProps } = this.props;
            if (this.props.renderTime) {
                return this.props.renderTime(timeProps);
            }
            return <Time {...timeProps}/>;
        }
        return null;
    }
    renderUsername() {
        const { currentMessage, user } = this.props;
        if (this.props.renderUsernameOnMessage && currentMessage) {
            if (user && currentMessage.user._id === user._id) {
                return null;
            }
            return (<View style={styles.content.usernameView}>
          <Text style={[styles.content.username, this.props.usernameStyle]}>
            ~ {currentMessage.user.name}
          </Text>
        </View>);
        }
        return null;
    }
    renderCustomView() {
        if (this.props.renderCustomView) {
            return this.props.renderCustomView(this.props);
        }
        return null;
    }
    renderBubbleContent() {
        return this.props.isCustomViewBottom ? (<View>
        {this.renderMessageImage()}
        {this.renderMessageVideo()}
        {this.renderMessageAudio()}
        {this.renderMessageText()}
        {this.renderCustomView()}
      </View>) : (<View>
        {this.renderCustomView()}
        {this.renderMessageImage()}
        {this.renderMessageVideo()}
        {this.renderMessageAudio()}
        {this.renderMessageText()}
      </View>);
    }
    render() {
        const { position, containerStyle, wrapperStyle, bottomContainerStyle, } = this.props;

        let status = (
            <View
                style={[
                    {alignItems:"flex-end"},
                    styles[position].positions,
                    bottomContainerStyle[position]
                ]}
            >
                {this.renderTime()}
                {this.renderTicks()}
            </View>
        )
        return (
        <View style={[
            styles[position].container,
            containerStyle && containerStyle[position],
        ]}>
            {this.renderUsername()}
            <View
                style={[{
                    flexDirection:"row",
                    alignItems:'flex-end'
                }]}
            >
                {position == 'left' ? null : status}
                <Box
                    style={[
                        styles[position].wrapper,
                        this.styledBubbleToNext(),
                        this.styledBubbleToPrevious(),
                        wrapperStyle && wrapperStyle[position],
                    ]}
                >
                    <TouchableWithoutFeedback
                        onLongPress={this.onLongPress}
                        accessibilityTraits="text"
                    >
                        <View>
                            {this.renderCustomView()}
                            {this.renderMessageImage()}
                            {this.renderMessageText()}
                        </View>
                    </TouchableWithoutFeedback>
                </Box>
                {position == "right" ? null : status}
            </View>
      </View>);
    }
}
Bubble.contextType = GiftedChatContext;
Bubble.defaultProps = {
    touchableProps: {},
    onPress: null,
    onLongPress: null,
    renderMessageImage: null,
    renderMessageVideo: null,
    renderMessageAudio: null,
    renderMessageText: null,
    renderCustomView: null,
    renderUsername: null,
    renderTicks: null,
    renderTime: null,
    renderQuickReplies: null,
    onQuickReply: null,
    position: 'left',
    optionTitles: DEFAULT_OPTION_TITLES,
    currentMessage: {
        text: null,
        createdAt: null,
        image: null,
    },
    nextMessage: {},
    previousMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    bottomContainerStyle: {},
    tickStyle: {},
    usernameStyle: {},
    containerToNextStyle: {},
    containerToPreviousStyle: {},
};
Bubble.propTypes = {
    user: PropTypes.object.isRequired,
    touchableProps: PropTypes.object,
    onLongPress: PropTypes.func,
    renderMessageImage: PropTypes.func,
    renderMessageVideo: PropTypes.func,
    renderMessageAudio: PropTypes.func,
    renderMessageText: PropTypes.func,
    renderCustomView: PropTypes.func,
    isCustomViewBottom: PropTypes.bool,
    renderUsernameOnMessage: PropTypes.bool,
    renderUsername: PropTypes.func,
    renderTime: PropTypes.func,
    renderTicks: PropTypes.func,
    renderQuickReplies: PropTypes.func,
    onQuickReply: PropTypes.func,
    position: PropTypes.oneOf(['left', 'right']),
    optionTitles: PropTypes.arrayOf(PropTypes.string),
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    wrapperStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    bottomContainerStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    tickStyle: StylePropType,
    usernameStyle: StylePropType,
    containerToNextStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    containerToPreviousStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
};
//# sourceMappingURL=Bubble.js.map
```

### react-native-gifted-chat ⇒ lib ⇒ Message.js

### (gift-chat 메시지 박스 수정)

```JS
import PropTypes from 'prop-types';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import Bubble from './Bubble';
import { SystemMessage } from './SystemMessage';
import { Day } from './Day';
import { StylePropType, isSameUser } from './utils';
const styles = {
    left: StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginRight: 0,
            marginLeft:20,
        },
    }),
    right: StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            marginLeft: 0,
            marginRight: 20,
        },
    }),
};
export default class Message extends React.Component {
    shouldComponentUpdate(nextProps) {
        const next = nextProps.currentMessage;
        const current = this.props.currentMessage;
        const { previousMessage, nextMessage } = this.props;
        const nextPropsMessage = nextProps.nextMessage;
        const nextPropsPreviousMessage = nextProps.previousMessage;
        const shouldUpdate = (this.props.shouldUpdateMessage &&
            this.props.shouldUpdateMessage(this.props, nextProps)) ||
            false;
        return (next.sent !== current.sent ||
            next.received !== current.received ||
            next.pending !== current.pending ||
            next.createdAt !== current.createdAt ||
            next.text !== current.text ||
            next.image !== current.image ||
            next.video !== current.video ||
            next.audio !== current.audio ||
            previousMessage !== nextPropsPreviousMessage ||
            nextMessage !== nextPropsMessage ||
            shouldUpdate);
    }
    renderDay() {
        if (this.props.currentMessage && this.props.currentMessage.createdAt) {
            const { containerStyle, onMessageLayout, ...props } = this.props;
            if (this.props.renderDay) {
                return this.props.renderDay(props);
            }
            return <Day {...props}/>;
        }
        return null;
    }
    renderBubble() {
        const { containerStyle, onMessageLayout, ...props } = this.props;
        if (this.props.renderBubble) {
            return this.props.renderBubble(props);
        }
        // @ts-ignore
        return <Bubble {...props}/>;
    }
    renderSystemMessage() {
        const { containerStyle, onMessageLayout, ...props } = this.props;
        if (this.props.renderSystemMessage) {
            return this.props.renderSystemMessage(props);
        }
        return <SystemMessage {...props}/>;
    }
    renderAvatar() {
        const { user, currentMessage, showUserAvatar } = this.props;
        if (user &&
            user._id &&
            currentMessage &&
            currentMessage.user &&
            user._id === currentMessage.user._id &&
            !showUserAvatar) {
            return null;
        }
        if (currentMessage &&
            currentMessage.user &&
            currentMessage.user.avatar === null) {
            return null;
        }
        const { containerStyle, onMessageLayout, ...props } = this.props;
        return <Avatar {...props}/>;
    }
    render() {
        const { currentMessage, onMessageLayout, nextMessage, position, containerStyle, } = this.props;
        if (currentMessage) {
            const sameUser = isSameUser(currentMessage, nextMessage);
            return (<View onLayout={onMessageLayout}>
          {this.renderDay()}
          {currentMessage.system ? (this.renderSystemMessage()) : (<View style={[
                        styles[position].container,
                        { marginBottom: sameUser ? 2 : 10 },
                        !this.props.inverted && { marginBottom: 2 },
                        containerStyle && containerStyle[position],
                    ]}>
              {this.props.position === 'left' ? this.renderAvatar() : null}
              {this.renderBubble()}
              {this.props.position === 'right' ? this.renderAvatar() : null}
            </View>)}
        </View>);
        }
        return null;
    }
}
Message.defaultProps = {
    renderAvatar: undefined,
    renderBubble: null,
    renderDay: null,
    renderSystemMessage: null,
    position: 'left',
    currentMessage: {},
    nextMessage: {},
    previousMessage: {},
    user: {},
    containerStyle: {},
    showUserAvatar: false,
    inverted: true,
    shouldUpdateMessage: undefined,
    onMessageLayout: undefined,
};
Message.propTypes = {
    renderAvatar: PropTypes.func,
    showUserAvatar: PropTypes.bool,
    renderBubble: PropTypes.func,
    renderDay: PropTypes.func,
    renderSystemMessage: PropTypes.func,
    position: PropTypes.oneOf(['left', 'right']),
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    user: PropTypes.object,
    inverted: PropTypes.bool,
    containerStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    shouldUpdateMessage: PropTypes.func,
    onMessageLayout: PropTypes.func,
};
//# sourceMappingURL=Message.js.map
```

### react-native-gifted-chat ⇒ lib⇒ MessageImage.js

### (gift-chat 이미지파일 다운로드 위하여 props에 이미지 url 넣어줌)

```JS
import PropTypes from 'prop-types';
import React from 'react';
import { Image, StyleSheet, View, } from 'react-native';
// TODO: support web
import Lightbox from 'react-native-lightbox-v2';
import { StylePropType } from './utils';
const styles = StyleSheet.create({
    container: {},
    image: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
        resizeMode: 'cover',
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
    },
});
export function MessageImage({ containerStyle, lightboxProps = {}, imageProps = {}, imageStyle, currentMessage, }) {
    if (currentMessage == null) {
        return null;
    }
    return (<View style={[styles.container, containerStyle]}>
      <Lightbox activeProps={{
            style: styles.imageActive,
        }} {...lightboxProps}
        urls = { currentMessage.image } //이미지 url prop 추가
        >
        <Image {...imageProps} style={[styles.image, imageStyle]} source={{ uri: currentMessage.image }}/>
      </Lightbox>
    </View>);
}
MessageImage.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: StylePropType,
    imageStyle: StylePropType,
    imageProps: PropTypes.object,
    lightboxProps: PropTypes.object,
};
//# sourceMappingURL=MessageImage.js.map
```

### react-native-gifted-chat ⇒ lib ⇒ MessageText.js

### (gift-chat 메시지 박스 수정)

```JS
import PropTypes from 'prop-types';
import React from 'react';
import { Linking, StyleSheet, TouchableOpacity, View, } from 'react-native';
// @ts-ignore
import ParsedText from 'react-native-parsed-text';
import { StylePropType } from './utils';
import { useChatContext } from './GiftedChatContext';
import { error } from './logging';
import Font from '../../../src/common/Font';
import { DefText } from '../../../src/common/BOOTSTRAP';
import { Box } from 'native-base';
const WWW_URL_PATTERN = /^www\./i;
const { textStyle } = StyleSheet.create({
    textStyle: {
        fontSize: 16,
        lineHeight: 20,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
    },
});
const styles = {
    left: StyleSheet.create({
        container: {},
        text: {
            color: 'black',
            ...textStyle,
        },
        link: {
            color: 'black',
            textDecorationLine: 'underline',
        },
    }),
    right: StyleSheet.create({
        container: {},
        text: {
            color: 'white',
            ...textStyle,
        },
        link: {
            color: 'white',
            textDecorationLine: 'underline',
        },
    }),
};
const DEFAULT_OPTION_TITLES = ['Call', 'Text', 'Cancel'];
export function MessageText({ currentMessage = {}, optionTitles = DEFAULT_OPTION_TITLES, position = 'left', containerStyle, textStyle, linkStyle: linkStyleProp, customTextStyle, parsePatterns = () => [], textProps, }) {
    const { actionSheet } = useChatContext();
    // TODO: React.memo
    // const shouldComponentUpdate = (nextProps: MessageTextProps<TMessage>) => {
    //   return (
    //     !!currentMessage &&
    //     !!nextProps.currentMessage &&
    //     currentMessage.text !== nextProps.currentMessage.text
    //   )
    // }
    const onUrlPress = (url) => {
        // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
        // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
        if (WWW_URL_PATTERN.test(url)) {
            onUrlPress(`https://${url}`);
        }
        else {
            Linking.openURL(url).catch(e => {
                error(e, 'No handler for URL:', url);
            });
        }
    };
    const onPhonePress = (phone) => {
        const options = optionTitles && optionTitles.length > 0
            ? optionTitles.slice(0, 3)
            : DEFAULT_OPTION_TITLES;
        const cancelButtonIndex = options.length - 1;
        actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex,
        }, (buttonIndex) => {
            switch (buttonIndex) {
                case 0:
                    Linking.openURL(`tel:${phone}`).catch(e => {
                        error(e, 'No handler for telephone');
                    });
                    break;
                case 1:
                    Linking.openURL(`sms:${phone}`).catch(e => {
                        error(e, 'No handler for text');
                    });
                    break;
                default:
                    break;
            }
        });
    };
    const onEmailPress = (email) => Linking.openURL(`mailto:${email}`).catch(e => error(e, 'No handler for mailto'));
    const linkStyle = [
        styles[position].link,
        linkStyleProp && linkStyleProp[position],
    ];
    return (<View style={[
            styles[position].container,
            containerStyle && containerStyle[position],
        ]}>
      <ParsedText style={[
            styles[position].text,
            textStyle && textStyle[position],
            customTextStyle,
        ]} parse={[
            ...parsePatterns(linkStyle),
            { type: 'url', style: linkStyle, onPress: onUrlPress },
            { type: 'phone', style: linkStyle, onPress: onPhonePress },
            { type: 'email', style: linkStyle, onPress: onEmailPress },
        ]} childrenProps={{ ...textProps }}>
        {
            currentMessage.text.substring(0,4) == 'http' ?
            <TouchableOpacity onPress={()=>Linking.openURL(currentMessage.text)}>
                <Box borderBottomWidth={1} borderBottomColor='#fff'>
                    <DefText text={currentMessage.upfile_name} style={[ position == 'right' ? {color:'#fff'} : {color:'black'}, {fontFamily:Font.SCoreDreamR, fontSize:16, lineHeight: 20, marginTop: 5, marginBottom: 0, marginLeft: 4, marginRight: 4,}]} />  
                </Box>
            </TouchableOpacity>
            :
            currentMessage.text
        }
      </ParsedText>
    </View>);
}
MessageText.propTypes = {
    position: PropTypes.oneOf(['left', 'right']),
    optionTitles: PropTypes.arrayOf(PropTypes.string),
    currentMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    textStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    linkStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    parsePatterns: PropTypes.func,
    textProps: PropTypes.object,
    customTextStyle: StylePropType,
};
//# sourceMappingURL=MessageText.js.map
```
### react-native-lightbox-v2 => LightBox.js ( gifted-chat 버전에따라 상이)

### (gift-chat 이미지파일 다운로드 위하여 props에 이미지 url 넣어줌)

```JS
import React, { useRef, useState, cloneElement, Children, isValidElement, } from "react";
import { Animated, TouchableHighlight, View, } from "react-native";
import LightboxOverlay from "./LightboxOverlay";
import { useNextTick } from "./hooks";
const noop = () => { };
const Lightbox = ({ activeProps, swipeToDismiss = true, useNativeDriver = false, disabled = false, renderContent, renderHeader, didOpen = noop, onOpen = noop, willClose = noop, onClose = noop, onLongPress = noop, onLayout = noop, springConfig = { tension: 30, friction: 7 }, backgroundColor = "black", underlayColor, style, dragDismissThreshold = 150, children, modalProps = {}, urls, ...rest }) => {

    //파라미터 부분에 urls 추가

    const layoutOpacity = useRef(new Animated.Value(1));
    const _root = useRef(null);
    const closeNextTick = useNextTick(onClose);
    const openNextTick = useNextTick(() => {
        _root.current && layoutOpacity.current.setValue(0);
    });
    const [{ isOpen, origin }, setState] = useState({
        isOpen: false,
        origin: { x: 0, y: 0, width: 0, height: 0 },
    });
    const getContent = () => {
        if (renderContent)
            return renderContent();
        else if (activeProps && isValidElement(children))
            return cloneElement(Children.only(children), activeProps);
        return children;
    };
    const handleOnClose = () => {
        layoutOpacity.current.setValue(1);
        setState((s) => ({ ...s, isOpen: false }));
        closeNextTick();
    };
    const wrapMeasureWithCallback = (callback) => {
        _root.current.measure((ox, oy, width, height, px, py) => {
            callback({ width, height, x: px, y: py });
        });
    };
    const open = () => {
        if (!_root.current)
            return;
        onOpen();
        wrapMeasureWithCallback((newOrigin) => {
            setState((s) => ({
                ...s,
                isOpen: true,
                origin: { ...newOrigin },
            }));
            openNextTick();
        });
    };
    const getOverlayProps = () => ({
        isOpen,
        origin,
        renderHeader,
        swipeToDismiss,
        springConfig,
        backgroundColor,
        children: getContent(),
        didOpen,
        willClose,
        onClose: handleOnClose,
        useNativeDriver,
        dragDismissThreshold,
        modalProps,
        urls, // 추가한 파라미터
        ...rest,
    });
    return (<View ref={_root} style={style} onLayout={onLayout}>
      <Animated.View style={{ opacity: layoutOpacity.current }}>
        <TouchableHighlight underlayColor={underlayColor} onPress={open} onLongPress={onLongPress} disabled={disabled}>
          {children}
        </TouchableHighlight>
      </Animated.View>
      {disabled ? null : <LightboxOverlay {...getOverlayProps()}/>}
    </View>);
};
export default Lightbox;
```

### react-native-lightbox-v2 => LightBoxOverlay.js ( gifted-chat 버전에따라 상이)

### (gift-chat 이미지파일 다운로드 버튼 및 다운로드 이벤트 추가)

```JS
import React, { useRef, useEffect, useState } from "react";
import { Animated, Dimensions, PanResponder, Platform, StyleSheet, StatusBar, TouchableOpacity, Text, Modal, SafeAreaView, PermissionsAndroid, Alert, } from "react-native";
import { DefText } from "../../../src/common/BOOTSTRAP";
import { useGesture, useNextTick } from "./hooks";
var RNFetchBlob = require('rn-fetch-blob').default

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";
const getDefaultTarget = () => ({ x: 0, y: 0, opacity: 1 });
const styles = StyleSheet.create({
    background: {
        position: "absolute",
        top: 0,
        left: 0,
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
    },
    open: {
        position: "absolute",
        flex: 1,
        justifyContent: "center",
        // Android pan handlers crash without this declaration:
        backgroundColor: "transparent",
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        width: WINDOW_WIDTH,
        backgroundColor: "transparent",
    },
    closeButton: {
        fontSize: 35,
        color: "white",
        lineHeight: 60,
        width: 70,
        textAlign: "center",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 1.5,
        shadowColor: "black",
        shadowOpacity: 0.8,
    },
});
const LightboxOverlay = ({ useNativeDriver, dragDismissThreshold, springConfig, isOpen, onClose, willClose, didOpen, swipeToDismiss, origin, backgroundColor, renderHeader, modalProps, children, doubleTapZoomEnabled, doubleTapGapTimer, doubleTapCallback, doubleTapZoomToCenter, doubleTapMaxZoom, doubleTapZoomStep, doubleTapInitialScale, doubleTapAnimationDuration, longPressGapTimer, longPressCallback, urls }) => {


    const _panResponder = useRef();
    const pan = useRef(new Animated.Value(0));
    const openVal = useRef(new Animated.Value(0));
    const handlers = useRef();
    const [gesture, animations] = useGesture({
        useNativeDriver,
        doubleTapZoomEnabled,
        doubleTapGapTimer,
        doubleTapCallback,
        doubleTapZoomToCenter,
        doubleTapMaxZoom,
        doubleTapZoomStep,
        doubleTapInitialScale,
        doubleTapAnimationDuration,
        longPressGapTimer,
        longPressCallback
    });
    const [{ isAnimating, isPanning, target }, setState] = useState({
        isAnimating: false,
        isPanning: false,
        target: getDefaultTarget(),
    });
    const handleCloseNextTick = useNextTick(onClose);
    const close = () => {
        willClose();
        if (isIOS) {
            StatusBar.setHidden(false, "fade");
        }
        gesture.reset();
        setState((s) => ({
            ...s,
            isAnimating: true,
        }));
        Animated.spring(openVal.current, {
            toValue: 0,
            ...springConfig,
            useNativeDriver,
        }).start(({ finished }) => {
            if (finished) {
                setState((s) => ({ ...s, isAnimating: false }));
                handleCloseNextTick();
            }
        });
    };
    const open = () => {
        if (isIOS) {
            StatusBar.setHidden(true, "fade");
        }
        pan.current.setValue(0);
        setState((s) => ({
            ...s,
            isAnimating: true,
            target: getDefaultTarget(),
        }));
        Animated.spring(openVal.current, {
            toValue: 1,
            ...springConfig,
            useNativeDriver,
        }).start(({ finished }) => {
            if (finished) {
                setState((s) => ({ ...s, isAnimating: false }));
                didOpen();
            }
        });
    };
    const initPanResponder = () => {
        _panResponder.current = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: () => !isAnimating,
            onStartShouldSetPanResponderCapture: () => !isAnimating,
            onMoveShouldSetPanResponder: () => !isAnimating,
            onMoveShouldSetPanResponderCapture: () => !isAnimating,
            onPanResponderGrant: (e, gestureState) => {
                gesture.init();
                pan.current.setValue(0);
                setState((s) => ({ ...s, isPanning: true }));
                gesture.onLongPress(e, gestureState);
                gesture.onDoubleTap(e, gestureState);
            },
            onPanResponderMove: Animated.event([null, { dy: pan.current }], {
                useNativeDriver,
            }),
            onPanResponderTerminationRequest: () => true,
            onPanResponderRelease: (evt, gestureState) => {
                gesture.release();
                if (gesture.isDoubleTaped)
                    return;
                if (gesture.isLongPressed)
                    return;
                if (Math.abs(gestureState.dy) > dragDismissThreshold) {
                    setState((s) => ({
                        ...s,
                        isPanning: false,
                        target: {
                            y: gestureState.dy,
                            x: gestureState.dx,
                            opacity: 1 - Math.abs(gestureState.dy / WINDOW_HEIGHT),
                        },
                    }));
                    close();
                }
                else {
                    Animated.spring(pan.current, {
                        toValue: 0,
                        ...springConfig,
                        useNativeDriver,
                    }).start(({ finished }) => {
                        finished && setState((s) => ({ ...s, isPanning: false }));
                    });
                }
            },
        });
    };
    useEffect(() => {
        initPanResponder();
    }, [useNativeDriver, isAnimating]);
    useEffect(() => {
        isOpen && open();
    }, [isOpen]);
    useEffect(() => {
        if (_panResponder.current && swipeToDismiss) {
            handlers.current = _panResponder.current.panHandlers;
        }
    }, [swipeToDismiss, _panResponder.current]);
    const lightboxOpacityStyle = {
        opacity: openVal.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, target.opacity],
        }),
    };
    let dragStyle;
    if (isPanning) {
        dragStyle = {
            top: pan.current,
        };
        lightboxOpacityStyle.opacity = pan.current.interpolate({
            inputRange: [-WINDOW_HEIGHT, 0, WINDOW_HEIGHT],
            outputRange: [0, 1, 0],
        });
    }
    const openStyle = [
        styles.open,
        {
            left: openVal.current.interpolate({
                inputRange: [0, 1],
                outputRange: [origin.x, target.x],
            }),
            top: openVal.current.interpolate({
                inputRange: [0, 1],
                outputRange: [origin.y, target.y],
            }),
            width: openVal.current.interpolate({
                inputRange: [0, 1],
                outputRange: [origin.width, WINDOW_WIDTH],
            }),
            height: openVal.current.interpolate({
                inputRange: [0, 1],
                outputRange: [origin.height, WINDOW_HEIGHT],
            }),
        },
    ];
    const background = (<Animated.View style={[styles.background, { backgroundColor }, lightboxOpacityStyle]}></Animated.View>);
    const header = (<Animated.View style={[styles.header, lightboxOpacityStyle]}>
      {renderHeader ? (renderHeader(close)) : (<TouchableOpacity onPress={close}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>)}
    </Animated.View>);
    const content = (<Animated.View style={[openStyle, dragStyle, animations]} {...handlers.current}>
      {children}
    </Animated.View>);


    const checkPermission = async (files) => {
        let fileUrl = files;

        console.log('files', fileUrl);

        if(Platform.OS === "ios"){
            downloadFile(fileUrl);
        }else{
            try{
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: "파일 사용 권한 필요",
                        message:
                            '파일을 다운로드하기 위하여 접근을 허용해주세요.'
                    }
                );
                if(granted == PermissionsAndroid.RESULTS.GRANTED){
                    console.log("안드로이드 파일 사용 권한이 승인되었습니다.");
                    downloadFile(fileUrl);
                }else{
                    Alert.alert("오류", "파일을 다운로드하기 위한 권한이 부여되지 않았습니다.");
                }
            }catch(err){
                console.log("++++",err);
            }
        }

    }

    const getFileExtention = (fileUrl) => {
        return /[.]/.exec(fileUrl) ?
             /[^.]+$/.exec(fileUrl) : undefined;
    }

    const downloadFile = (fileUrl) => {
        let date = new Date();
        let years = date.getFullYear();
        let month = date.getMonth();
        if(month > 10){
            month = "0" + month;
        }else{
            month = month;
        }
        let days = date.getDate();

        let dateTimes = years + '' + month + '' + days;

        // File URL which we want to download
        let FILE_URL = fileUrl;    
        // Function to get extention of the file url
        let file_ext = getFileExtention(FILE_URL);

        console.log('file_ext::::::::',file_ext)
    
        file_ext = '.' + file_ext[0];

        const { config, fs } = RNFetchBlob;
        let RootDir = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.PictureDir;
        let options = {
        fileCache: true,
        addAndroidDownloads: {
            path:
            RootDir+
            '/' + dateTimes +
            file_ext,
            description: 'downloading file...',
            notification: true,
            // useDownloadManager works with Android only
            useDownloadManager: true,   
        },
        };
        config(options)
        .fetch('GET', FILE_URL)
        .then(res => {
            // Alert after successful downloading
            console.log('res -> ', JSON.stringify(res));
            Alert.alert('이미지 다운로드가 완료되었습니다.');
            console.log('저장된 디렉토리..', fs.dirs.DocumentDir);
        });
    }

    return (<Modal visible={isOpen} transparent={true} onRequestClose={close} {...modalProps}>
      {background}
      {content}
      <SafeAreaView style={{flex:1, justifyContent:'flex-end'}}>
        {header}
        <TouchableOpacity
            onPress={ () => checkPermission(urls)} 
            style={{backgroundColor:'rgba(255,255,255,0.3)', height:40, justifyContent:'center', alignItems:'center'}}
        >
            <DefText text="저장" style={{color:'#fff'}} />
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>);
};
export default LightboxOverlay;
```
