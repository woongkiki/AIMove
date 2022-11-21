import React from 'react';
import { View, Text, Dimensions, Image, Alert, TouchableOpacity } from 'react-native';
import {HStack} from 'native-base';
import {
  Avatar,
  SystemMessage,
  Message,
  MessageText,
  BubbleProps,
  Composer,
  Time,
  Day,
  Bubble,
  Send,
} from 'react-native-gifted-chat';
import Font from '../common/Font';
import moment from 'moment';

export const renderBubble = (props) => (
    <View
        style={{
        // Try to align it better with the avatar on Android.
        flexDirection: 'row',
        alignItems: 'baseline',
        }}
    >
        <Bubble
            {...props}
            style={{ flexDirection: 'row' }}
            containerStyle={{
                left: { backgroundColor: 'transparent' },
                right: { backgroundColor: 'transparent' },
              }}
            wrapperStyle={{

                left: {
                    backgroundColor: '#fff',
                    borderRadius: 15,
                    marginTop: 5,
                    marginLeft:10,
                    
                },
                right: {
                    backgroundColor: '#0195FF',
                    borderRadius: 15,
                    marginTop: 5,
                    
                    marginLeft:0,
                },

            }}
        />
    </View>
)

//파일첨부...
export const renderComposer = (props) => (
  
    <HStack alignItems={'center'} px='20px'  backgroundColor={'#fff'} justifyContent='space-between'>
        <TouchableOpacity >
            <Image source={require('../images/chatPlusButton.png')} style={{width:23, height:23, resizeMode:'contain'}} alt='이미지 선택'/>
        </TouchableOpacity>
        <Composer 
            {...props}
        />
        <Send 
            {...props}
        />
    </HStack>
   
)