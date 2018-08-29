/**
 * @author mrdoob / http://mrdoob.com/
 */

 import PropTypes from 'prop-types';
 import React, { Component } from 'react';
 import {
   View,
   Text,
   StyleSheet,
   Platform
 } from 'react-native';

 const graphHeight = 35;
 const graphWidth = 90;

 const styles = StyleSheet.create({
   main: {
     zIndex: 999999,
     position: 'absolute',
     height: 60,
     width: (graphWidth + 6),
     padding: 3,
     backgroundColor: '#000a12',
     color: '#cfd8dc',
     fontSize: 9,
     lineHeight: 10,
     top: 10,
     right: 10,
   },
   graphStyle: {
     position: 'absolute',
     left: 3,
     right: 3,
     bottom: 3,
     height: graphHeight,
     backgroundColor: '#263238',
   },
   textFps: {
     fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'sans-serif',
     fontWeight: 'bold',
     color: '#cfd8dc',
     fontSize: 12,
   }
 });

 class FPSStats extends Component {
   constructor(props) {
     super(props);
     const currentTime = +new Date();

     this.state = {
       frames: 0,
       startTime: currentTime,
       prevTime: currentTime,
       fps: []
     };
   }

   shouldComponentUpdate(nextProps, nextState) {
     return this.state.fps !== nextState.fps;
   }

   componentDidMount() {
     if (!this.props.isActive) {
       return;
     }

     const onRequestAnimationFrame = () => {
       this.calcFPS();

       requestAnimationFrame(onRequestAnimationFrame);
     };

     requestAnimationFrame(onRequestAnimationFrame);
   }

   calcFPS = () => {
     let currentTime = +new Date();

     this.setState({
       frames: this.state.frames + 1
     });

     if (currentTime > this.state.prevTime + 1000) {
       let fps = Math.round(
         (this.state.frames * 1000) / (currentTime - this.state.prevTime)
       );

       fps = this.state.fps.concat(fps);
       let sliceStart = fps.length - graphWidth;

       if (sliceStart < 0) {
         sliceStart = 0;
       }

       fps = fps.slice(sliceStart, fps.length);

       this.setState({
         fps: fps,
         frames: 0,
         prevTime: currentTime
       });
     }
   };

   render() {
     if (!this.props.isActive) {
       return null;
     }

     const maxFps = Math.max.apply(Math.max, this.state.fps);

     const graphItems = this.state.fps.map((fps, i) => {
       const height = (graphHeight * fps) / maxFps;

       const graphItemStyle = StyleSheet.create({
         graphItemStyle: {
           position: 'absolute',
           bottom: 0,
           right: (this.state.fps.length -1 - i),
           height: height,
           width: 1,
           backgroundColor: '#cfd8dc',
         }
       });

       return (<View key={'fps-' + i} style={graphItemStyle.graphItemStyle} />)
     });

     return (
       <View style={styles.main} >
         <Text style={styles.textFps}>
           {this.state.fps[this.state.fps.length - 1] + ' FPS'}
         </Text>
         <View style={styles.graphStyle} >
           {graphItems}
         </View>
       </View>
     )
   }
 }

 FPSStats.propTypes = {
   isActive: PropTypes.bool,
 };

 FPSStats.defaultProps = {
   isActive: true,
 };

 export default FPSStats;
