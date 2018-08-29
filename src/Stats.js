import PropTypes from 'prop-types';
import React, { Component } from 'react';

const graphHeight = 29;
const graphWidth = 70;

let style = {
  zIndex: 999999,
  position: 'fixed',
  height: '46px',
  width: (graphWidth + 6) + 'px',
  padding: '3px',
  backgroundColor: '#000',
  color: '#00ffff',
  fontSize: '9px',
  lineHeight: '10px',
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 'bold',
  MozBoxSizing: 'border-box',
  boxSizing: 'border-box',
  pointerEvents: 'none',
  top: '2vh',
  right: '10vw',
  bottom: 'auto',
  left: 'auto'
};

const graphStyle = {
  position: 'absolute',
  left: '3px',
  right: '3px',
  bottom: '3px',
  height: graphHeight + 'px',
  backgroundColor: '#282844',
  MozBoxSizing: 'border-box',
  boxSizing: 'border-box'
};

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

      window.requestAnimationFrame(onRequestAnimationFrame);
    };

    window.requestAnimationFrame(onRequestAnimationFrame);
  }

  calcFPS() {
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
      let height = (graphHeight * fps) / maxFps;

      let graphItemStyle = {
        position: 'absolute',
        bottom: '0',
        right: (this.state.fps.length -1 - i) + 'px',
        height: height + 'px',
        width: '1px',
        backgroundColor: '#00ffff',
        MozBoxSizing: 'border-box',
        boxSizing: 'border-box'
      };

      return (<div key={'fps-' + i} style={graphItemStyle} />)
    });

    return (
      <div style={style} >
        {this.state.fps[this.state.fps.length - 1] + ' FPS'}

        <div style={graphStyle} >
          {graphItems}
        </div>
      </div>
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
