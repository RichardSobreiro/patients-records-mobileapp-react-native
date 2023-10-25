import { TouchableOpacity } from 'react-native-gesture-handler';

import { Colors } from '../../constants/styles';
import { getServicesAgenda } from '../../http/ServicesApi';
import { GetServicesAgendaResponse } from '../../models/customers/services/GetServicesAgendaResponse';
import { AuthContext } from '../../store/auth-context';
import { NotificationContext } from '../../store/notification-context';
import { formatDateTimeUTCFormat } from '../../util/date-helpers';
import AgendaItem from './mocks/AgendaItem';
import { agendaItems } from './mocks/agendaItems';
import { getTheme } from './mocks/theme';
import { getDate } from './mocks/timelineEvents';

import { useIsFocused } from '@react-navigation/native';
import groupBy from 'lodash/groupBy';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
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

import { PackedEvent } from 'react-native-calendars/src/timeline/EventBlock';
import { MarkedDates } from 'react-native-calendars/src/types';

const ITEMS: any[] = agendaItems;
const INITIAL_TIME = { hour: 9, minutes: 0 };

interface CustomEvent extends PackedEvent {
  customerId: string;
  serviceId: string;
  confirmed: boolean;
}

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

type Props = {
  route: any;
  navigation: any;
};

const AgendaHomeScreen: React.FC<Props> = ({ route, navigation }) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const [events, setEvents] = useState<TimelineEventProps[]>();

  const [fabOpen, setFabOpen] = useState<boolean>(false);
  const [calendarMode, setCalendarMode] = useState<string>('daily');
  // const marked = useRef(getMarkedDates());
  const marked = useRef<MarkedDates>();
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: Colors.primary500
  });
  const [state, setState] = useState<{
    currentDate: any;
    events: any;
    eventsByDate: any;
  }>({
    currentDate: getDate(),
    events,
    eventsByDate: groupBy(events, (e) => CalendarUtils.getCalendarDateString(e.start)) as {
      [key: string]: TimelineEventProps[];
    }
  });

  const getServicesAgendaAsync = useCallback(
    async (year: number, month: number) => {
      setIsLoading(true);
      const startDate = new Date(year, month, 1, 0, 0, 0);
      const endDate = new Date(
        year,
        month,
        new Date(month === 11 ? year + 1 : year, month + 1, 0).getDate(),
        23,
        59,
        0
      );

      const response = await getServicesAgenda(authCtx.token?.access_token!, startDate, endDate);

      if (response.ok) {
        const servicesAgendaResponse = response.body as GetServicesAgendaResponse;
        const newMarkedDates: MarkedDates = {};
        const newEvents = servicesAgendaResponse.servicesList?.map((s) => {
          s.date = new Date(s.date);
          const start = new Date(s.date);
          s.date.setHours(s.date.getHours() + 1);
          const end = new Date(s.date);
          const confirmed = Math.random() < 0.5;
          newMarkedDates[start.toISOString().split('T')[0]] = { marked: true };

          return {
            start: `${formatDateTimeUTCFormat(start)}`,
            end: `${formatDateTimeUTCFormat(end)}`,
            title: s.customerName,
            summary: s.serviceTypes.map((st) => st.serviceTypeDescription).join(' - '),
            serviceId: s.serviceId,
            customerId: s.customerId,
            confirmed,
            color: confirmed ? Colors.secondary100 : Colors.primary100
          };
        });
        marked.current = newMarkedDates;
        setEvents((curEvents) => {
          setState({
            currentDate: getDate(),
            events: newEvents,
            eventsByDate: groupBy(newEvents, (e) =>
              CalendarUtils.getCalendarDateString(e.start)
            ) as {
              [key: string]: TimelineEventProps[];
            }
          });
          return newEvents;
        });
      } else {
        notificationCtx.showNotification({
          title: 'Ops...',
          message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
        });
      }
      setIsLoading(false);
    },
    [authCtx.token?.access_token, notificationCtx]
  );

  useEffect(() => {
    if (isFocused) {
      getServicesAgendaAsync(2023, 9);
    }
  }, [getServicesAgendaAsync, isFocused]);

  const timelineEventPressHandler = (event: any) => {
    navigation.push('EditService', {
      customerId: event.customerId,
      serviceId: event.serviceId
    });
  };

  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />;
  }, []);

  const renderItemTimeline = (timelineProps, info) => {
    return (
      <Timeline
        {...timelineProps}
        renderEvent={(item) => {
          return (
            <TouchableOpacity style={{ flex: 1, justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: Colors.primary500, fontSize: 17 }}>{item.title}</Text>
                <Text style={{ color: Colors.primary500, fontSize: 14 }}>{item.summary}</Text>
              </View>
              <View style={{ marginBottom: 5 }}>
                <Text
                  style={{
                    color: (item as CustomEvent).confirmed
                      ? Colors.secondary800
                      : Colors.tertiary800,
                    fontSize: 12
                  }}
                >
                  {(item as CustomEvent).confirmed ? `Confirmado` : `Não confirmado`}
                </Text>
              </View>
            </TouchableOpacity>
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
    getServicesAgendaAsync(2023, 9);
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
        fontSize: 16
      }
    },
    onEventPress: timelineEventPressHandler
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
      {isLoading && (
        <ActivityIndicator
          color={Colors.primary800}
          size={120}
          style={{
            flex: 1,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.tertiary900Op12,
            zIndex: 2000
          }}
        />
      )}
      <Portal>
        <FAB.Group
          open={fabOpen}
          visible={isFocused}
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
                navigation.push('PatientsList');
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
