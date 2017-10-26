'use strict';

import React, { Component } from 'react';
import {
    Dimensions,
    Animated,
    View,
    ScrollView,
    Keyboard,
    Platform,
    } from 'react-native';
var {width, height} = Dimensions.get('window');
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'



class CoreKeyboardAwareView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: new Animated.Value(0)
    }
    this.debug = false;
  }

  componentDidMount() {
    Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow.bind(this))
    Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide.bind(this))
  }

  componentWillUnmount() {
  }


  debugLog() {
    if (this.debug) {
      console.log.apply(this, arguments);
    }
  }


  onKeyboardWillShow(e) {
    var endY = e.endCoordinates.screenY
    var startY = e.startCoordinates.screenY
    this.debugLog(e);

    requestAnimationFrame(() => {
      if (this.outerView == null) return;
      this.outerView.measure((ox, oy, width, height, px, py) => {
        this.debugLog(ox, oy, px, py);
        // target scrollView height should be :
        //   remaining height OR outerView height
        // = screen height - keyboard height OR outerView height
        var remainScreenMaxHeight = endY - py;
        var outerViewMaxHeight = height;
        var maxHeight = remainScreenMaxHeight;
        if (maxHeight > outerViewMaxHeight) {
          maxHeight = outerViewMaxHeight;
        }

        Animated.timing(
            this.state.height,
            {
              toValue: maxHeight,
              duration: this.props.animated ? 200 : 0,
            }
        ).start();


        this.debugLog("InnerView height should be ..." + maxHeight, remainScreenMaxHeight, outerViewMaxHeight);
        //requestAnimationFrame(() => {
        //  this.innerView.measure((ox, oy, width, height, px, py) => {
        //    this.debugLog("And it is... " + height);
        //  })
        //})
      });
    })
  }
  onKeyboardWillHide(e) {
    var endY = e.endCoordinates.screenY
    var startY = e.startCoordinates.screenY
    this.debugLog(e);

    requestAnimationFrame(() => {
      if (this.outerView == null) return;
      this.outerView.measure((ox, oy, width, height, px, py) => {
        this.debugLog(ox, oy, px, py);
        // target scrollView height should be :
        //   remaining height OR outerView height
        // = screen height - keyboard height OR outerView height
        var remainScreenMaxHeight = endY;
        var outerViewMaxHeight = height;
        var maxHeight = remainScreenMaxHeight;
        if (maxHeight > outerViewMaxHeight) {
          maxHeight = outerViewMaxHeight;
        }

        Animated.timing(
            this.state.height,
            {
              toValue: maxHeight,
              duration: this.props.animated ? 200 : 0,
            }
        ).start();


        this.debugLog("ScrollView height should be ..." + maxHeight);
      });
    })
  }

  render() {
    return (
        <View
            ref={(ref) => {this.outerView = ref;}}
            style={[{flex: 1}, this.props.style]}
            onLayout={(e) => {
              var {x, y, width, height} = e.nativeEvent.layout;
              Animated.timing(
                this.state.height,
                {
                  toValue: height,
                  duration: 0,
                }
              ).start();

              if (Platform.OS === 'ios')
              {
                  if (this.props.doNotForceDismissKeyboardWhenLayoutChanges === false) {
                    dismissKeyboard();
                  }
              }
            }}>
          <Animated.View
              ref={(ref) => {this.innerView = ref;}}
              style={[{height: this.state.height}, this.props.innerViewStyle]}
              onLayout={(e) => { var {x, y, width, height} = e.nativeEvent.layout; } }>
            {this.props.children}
          </Animated.View>
        </View>
    )
  }
}


module.exports = CoreKeyboardAwareView;
