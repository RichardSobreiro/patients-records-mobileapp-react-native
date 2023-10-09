import { Colors } from '../../constants/styles';
import { getServicesAgenda } from '../../http/ServicesApi';
import { GetServicesAgendaResponse } from '../../models/customers/services/GetServicesAgendaResponse';
import { AuthContext } from '../../store/auth-context';
import AgendaItem from './mocks/AgendaItem';
import { agendaItems, getMarkedDates } from './mocks/agendaItems';
import { getTheme } from './mocks/theme';
import { getDate, timelineEvents } from './mocks/timelineEvents';

import groupBy from 'lodash/groupBy';
import { useCallback, useContext, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AgendaList,
  CalendarProvider,
  CalendarUtils,
  ExpandableCalendar,
  LocaleConfig,
  Timeline,
  TimelineEventProps,
  TimelineList,
  TimelineProps
} from 'react-native-calendars';
import { FAB, Portal, SegmentedButtons } from 'react-native-paper';

const ITEMS: any[] = agendaItems;
const INITIAL_TIME = { hour: 9, minutes: 0 };

LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  monthNamesShort: [
    'Jan.',
    'Fev.',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul.',
    'Ago',
    'Set.',
    'Out.',
    'Nov.',
    'Dez.'
  ],
  dayNames: [
    'Domingo',
    'Segunda-Feira',
    'Terça-Feira',
    'Quarta-Feira',
    'Quinta-Feira',
    'Sexta-Feira',
    'Sábado'
  ],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'],
  today: 'Hoje'
};

LocaleConfig.defaultLocale = 'pt';

const EVENTS: TimelineEventProps[] = timelineEvents;

const AgendaHomeScreen = ({ route, navigation }) => {
  const authCtx = useContext(AuthContext);

  const [services, setServices] = useState<
    | {
        year: string;
        month: string;
        servicesList: GetServicesAgendaResponse[];
      }[]
    | undefined
  >(undefined);

  const [fabOpen, setFabOpen] = useState<boolean>(false);
  const [calendarMode, setCalendarMode] = useState<string>('daily');
  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: Colors.primary500
  });
  const [state, setState] = useState({
    currentDate: getDate(),
    events: EVENTS,
    eventsByDate: groupBy(EVENTS, (e) => CalendarUtils.getCalendarDateString(e.start)) as {
      [key: string]: TimelineEventProps[];
    }
  });

  const getServicesAgendaAsync = useCallback(async (year: string, month: string) => {
    const startDate = new Date(+year, +month, 1, 0, 0, 0);
    const endDate = new Date(
      +year,
      +month,
      new Date(+month === 11 ? +year + 1 : +year, +month + 1, 0).getDate(),
      23,
      59,
      0
    );

    const response = await getServicesAgenda('', startDate, endDate);
  }, []);

  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />;
  }, []);

  const renderItemTimeline = (timelineProps, info) => {
    return (
      <Timeline
        {...timelineProps}
        renderEvent={(item) => {
          return (
            <View>
              <Text style={{ color: Colors.primary500, fontSize: 17 }}>{item.title}</Text>
              <Text style={{ color: Colors.primary500, fontSize: 14 }}>{item.summary}</Text>
            </View>
          );
        }}
      />
    );
  };

  const onDateChanged = (date: string, source: string) => {
    console.log('TimelineCalendarScreen onDateChanged: ', date, source);
    setState((prevState) => {
      return { ...prevState, currentDate: date };
    });
  };

  const onMonthChange = (month: any, updateSource: any) => {
    console.log('TimelineCalendarScreen onMonthChange: ', month, updateSource);
  };

  const timelineProps: Partial<TimelineProps> = {
    format24h: true,
    // scrollToFirst: true,
    // start: 0,
    // end: 24,
    unavailableHours: [
      { start: 0, end: 6 },
      { start: 22, end: 24 }
    ],
    overlapEventsSpacing: 8,
    rightEdgeSpacing: 24,
    theme: {
      timeLabel: {
        color: Colors.primary500,
        fontSize: 20
      }
    }
  };

  return (
    <CalendarProvider
      date={ITEMS[1]?.title}
      onDateChanged={onDateChanged}
      onMonthChange={onMonthChange}
      showTodayButton
      theme={{
        ...todayBtnTheme.current
      }}
    >
      <Portal>
        <FAB.Group
          open={fabOpen}
          visible
          icon={fabOpen ? 'minus' : 'plus'}
          actions={[
            { icon: 'minus', onPress: () => console.log('Pressed add') },
            {
              icon: 'email',
              label: 'Enviar Mensagem',
              onPress: () => console.log('Pressed email'),
              labelTextColor: 'white'
            },
            {
              icon: 'bell',
              label: 'Novo Agendamento',
              onPress: () => {
                navigation.push('CreateService', { customerId: '' });
              },
              labelTextColor: 'white'
            }
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
          onPress={() => {
            if (fabOpen) {
              // do something if the speed dial is open
            }
          }}
          backdropColor={'rgba(25, 25, 25, 0.8)'}
          rippleColor={Colors.primary100}
          style={[styles.fabGroupStyle]}
          fabStyle={styles.fabStyle}
          color={Colors.primary100}
        />
      </Portal>
      <SegmentedButtons
        style={{ marginTop: 10 }}
        theme={{ colors: { secondaryContainer: Colors.primary100 } }}
        value={calendarMode}
        onValueChange={setCalendarMode}
        buttons={[
          {
            value: 'daily',
            label: 'Dia',
            showSelectedCheck: true
          },
          {
            value: 'list',
            label: 'Lista',
            showSelectedCheck: true
          }
        ]}
      />
      <ExpandableCalendar
        theme={{
          ...theme.current
        }}
        // disableAllTouchEventsForDisabledDays
        firstDay={1}
        markedDates={marked.current}
      />
      {calendarMode === 'list' && (
        <AgendaList sections={ITEMS} renderItem={renderItem} sectionStyle={styles.section} />
      )}
      {calendarMode === 'daily' && (
        <TimelineList
          events={state.eventsByDate}
          timelineProps={timelineProps}
          showNowIndicator
          scrollToNow
          scrollToFirst
          initialTime={INITIAL_TIME}
          renderItem={renderItemTimeline}
        />
      )}
    </CalendarProvider>
  );
};

export default AgendaHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary100
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  section: {
    backgroundColor: Colors.primary100,
    color: Colors.primary500,
    textTransform: 'capitalize'
  },
  fabGroupStyle: {
    bottom: 0,
    right: 0
  },
  fabStyle: {
    backgroundColor: Colors.primary800
  }
});
