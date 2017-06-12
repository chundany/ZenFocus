import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Slider } from '@blueprintjs/core';
import { Phases } from '../../../containers/enums';
import { getMinsSecs, twoDigits } from '../../../utils/countdown-timer.util';

const Option = ({ isLength, max, min, stepSize, title, value, unit, onChange }) => {
  const { minutes, seconds } = getMinsSecs(value);
  return (
    <div className="d-flex mb-3 align-items-center">
      <div className="d-inline-block w-exact-150 em-0-9">{title} </div>
      <div className="w-exact-100">
        <span className="font-weight-bold">
          {isLength ? `${minutes}:${twoDigits(seconds)}` : value } {unit}
        </span>
      </div>
      <Slider
        labelStepSize={max}
        min={min}
        max={max}
        value={value}
        renderLabel={false}
        stepSize={stepSize}
        onChange={val => onChange(val)}
        className="w-exact-300"
      />
    </div>
  );
};

Option.propTypes = {
  isLength: PropTypes.bool,
  max: PropTypes.number.isRequired,
  min: PropTypes.number,
  stepSize: PropTypes.number,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

class TimerPanel extends Component {
  // NOTE: Slider on re-render renders the slider fill position to 0
  // even though value is correct. This is a manual check of prop change
  // to update only if any prop values updated (which means client must be on
  // the Timer Panel to trigger own updates)
  shouldComponentUpdate(nextProps) {
    const {
      focusLength,
      longBreakInterval,
      longBreakLength,
      shortBreakLength,
      totalRounds
    } = nextProps;

    if (
      focusLength !== this.props.focusLength ||
      longBreakInterval !== this.props.longBreakInterval ||
      longBreakLength !== this.props.longBreakLength ||
      shortBreakLength !== this.props.shortBreakLength ||
      totalRounds !== this.props.totalRounds
    ) {
      return true;
    }

    return false;
  }

  setNewTime(val, phase) {
    const { currentPhase, setMinutes, setSeconds } = this.props;
    const { minutes, seconds } = getMinsSecs(val);
    if (currentPhase === phase) {
      setMinutes(minutes);
      setSeconds(seconds);
    }
  }

  render() {
    const MAX_TIME = 5400;
    const {
      focusLength,
      longBreakInterval,
      longBreakLength,
      shortBreakLength,
      totalRounds,
      onSettingsChange,
      setFocusLength,
      setLongBreakInterval,
      setLongBreakLength,
      setShortBreakLength,
      setTotalRounds
    } = this.props;

    return (
      <div className="mt-1">
        <Option
          isLength
          title="Focus Length"
          min={30}
          max={MAX_TIME}
          stepSize={30}
          value={focusLength}
          onChange={val =>
            onSettingsChange(
              'rounds.focusLength',
              val,
              setFocusLength,
              this.setNewTime(val, Phases.FOCUS)
            )}
        />
        <Option
          isLength
          title="Short Break Length"
          max={MAX_TIME}
          stepSize={30}
          value={shortBreakLength}
          onChange={val =>
            onSettingsChange(
              'rounds.shortBreakLength',
              val,
              setShortBreakLength,
              this.setNewTime(val, Phases.SHORT_BREAK)
            )}
        />
        <Option
          isLength
          stepSize={30}
          title="Long Break Length"
          max={MAX_TIME}
          value={longBreakLength}
          onChange={val =>
            onSettingsChange(
              'rounds.longBreakLength',
              val,
              setLongBreakLength,
              this.setNewTime(val, Phases.LONG_BREAK)
            )}
        />
        <Option
          title="Long Break Interval"
          max={totalRounds}
          unit="rounds"
          value={
            longBreakInterval > totalRounds ? totalRounds : longBreakInterval
          }
          onChange={val =>
            onSettingsChange(
              'rounds.longBreakInterval',
              val,
              setLongBreakInterval
            )}
        />
        <Option
          title="Rounds"
          min={1}
          max={100}
          unit="rounds"
          value={totalRounds}
          onChange={val =>
            onSettingsChange('rounds.totalRounds', val, setTotalRounds)}
        />
      </div>
    );
  }
}

TimerPanel.propTypes = {
  currentPhase: PropTypes.number.isRequired,
  focusLength: PropTypes.number.isRequired,
  longBreakLength: PropTypes.number.isRequired,
  longBreakInterval: PropTypes.number.isRequired,
  shortBreakLength: PropTypes.number.isRequired,
  totalRounds: PropTypes.number.isRequired,
  onSettingsChange: PropTypes.func.isRequired,
  setFocusLength: PropTypes.func.isRequired,
  setLongBreakInterval: PropTypes.func.isRequired,
  setLongBreakLength: PropTypes.func.isRequired,
  setShortBreakLength: PropTypes.func.isRequired,
  setTotalRounds: PropTypes.func.isRequired,
  setMinutes: PropTypes.func.isRequired,
  setSeconds: PropTypes.func.isRequired
};

export default TimerPanel;
