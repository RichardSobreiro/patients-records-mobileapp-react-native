import { Colors } from '../../../constants/styles';

import { Platform } from 'react-native';

export function getTheme() {
  const disabledColor = 'grey';

  return {
    // arrows
    arrowColor: Colors.primary500,
    arrowStyle: { padding: 0 },
    // knob
    expandableKnobColor: Colors.primary500,
    // month
    monthTextColor: Colors.primary500,
    textMonthFontSize: 16,
    //textMonthFontFamily: 'HelveticaNeue',
    textMonthFontWeight: 'bold' as const,
    // day names
    textSectionTitleColor: 'black',
    textDayHeaderFontSize: 12,
    //textDayHeaderFontFamily: 'HelveticaNeue',
    textDayHeaderFontWeight: 'normal' as const,
    // dates
    dayTextColor: Colors.primary500,
    todayTextColor: Colors.primary500,
    todayButtonFontSize: 20,
    todayBackgroundColor: Colors.primary100,
    textDayFontSize: 18,
    //textDayFontFamily: 'HelveticaNeue',
    textDayFontWeight: '500' as const,
    textDayStyle: { marginTop: Platform.OS === 'android' ? 2 : 4 },

    // selected date
    selectedDayBackgroundColor: Colors.primary500,
    selectedDayTextColor: 'white',
    // disabled date
    textDisabledColor: disabledColor,
    // dot (marked date)
    dotColor: Colors.primary500,
    selectedDotColor: Colors.primary500,
    disabledDotColor: disabledColor,
    dotStyle: { marginTop: -2 }
  };
}
