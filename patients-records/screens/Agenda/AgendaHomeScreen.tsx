import { Colors } from '../../constants/styles';

import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { Card } from 'react-native-paper';

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

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const AgendaHomeScreen = ({ route, navigation }) => {
  const [items, setItems] = useState({});

  const loadItems = (day) => {
    //setTimeout(() => {
    for (let i = -15; i < 15; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = timeToString(time);

      if (!items[strTime]) {
        items[strTime] = [];

        const numItems = Math.floor(Math.random() * 3 + 1);
        for (let j = 0; j < numItems; j++) {
          items[strTime].push({
            //name: 'Paciente: ' + strTime + ' #' + j,
            name: 'Teste da Silva',
            time: '09:00',
            profissionalName: 'Ana Maria',
            serviceType: 'Botox',
            height: Math.max(10, Math.floor(Math.random() * 150)),
            day: strTime
          });
        }
      }
    }
    const newItems = {};
    Object.keys(items).forEach((key) => {
      newItems[key] = items[key];
    });
    setItems(newItems);
    //}, 1000);
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity style={styles.item}>
        <Card style={{ backgroundColor: Colors.primary100 }}>
          <Card.Content>
            <View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold', color: Colors.primary500 }}>Paciente: </Text>
                <Text style={{ color: Colors.primary500 }}>{item.name}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold', color: Colors.primary500 }}>Horário: </Text>
                <Text style={{ color: Colors.primary500 }}>{item.time}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold', color: Colors.primary500 }}>Procedimento: </Text>
                <Text style={{ color: Colors.primary500 }}>{item.serviceType}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold', color: Colors.primary500 }}>Profissional: </Text>
                <Text style={{ color: Colors.primary500 }}>{item.profissionalName}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={'2022-10-07'}
        //refreshControl={null}
        hideExtraDays={false}
        showsHorizontalScrollIndicator={true}
        showWeekNumbers={true}
        showScrollIndicator={true}
        hideKnob={false}
        showClosingKnob={true}
        refreshing={true}
        renderItem={renderItem}
        theme={{
          // 'stylesheet.agenda.main': {
          //   reservations: {
          //     backgroundColor: Colors.primary100
          //   }
          // },
          agendaTodayColor: Colors.secondary500,
          backgroundColor: Colors.primary500,
          agendaDayTextColor: Colors.primary500,
          agendaDayNumColor: Colors.primary500,
          agendaKnobColor: Colors.secondary500,
          todayDotColor: Colors.secondary500,
          todayBackgroundColor: Colors.primary500,
          calendarBackground: Colors.primary500,
          monthTextColor: 'white',
          dayTextColor: 'white'
        }}
      />
    </View>
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
  }
});
