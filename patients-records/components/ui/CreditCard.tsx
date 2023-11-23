import CreditCardImages from '../../constants/credit-card-images';
import { Colors } from '../../constants/styles';

import { ImageBackground, StyleSheet, Text, View } from 'react-native';

type Props = {
  cvc: string | undefined;
  name: string | undefined;
  expiry: string | undefined;
  lastFourNumbers: string | undefined;
  type: string | undefined;
};

const CreditCard: React.FC<Props> = ({ cvc, name, expiry, lastFourNumbers, type }) => {
  const image = {
    uri: CreditCardImages.DISCOVER
  };
  switch (type) {
    case 'visa':
      image.uri = CreditCardImages.VISA;
      break;
    case 'amex':
      image.uri = CreditCardImages.AMEX;
      break;
    case 'mastercard':
      image.uri = CreditCardImages.MASTERCARD;
      break;
    case 'discover':
      image.uri = CreditCardImages.DISCOVER;
      break;
    default:
      image.uri = CreditCardImages.MASTERCARD;
      break;
  }
  return (
    <View style={styles.containerCreditCard}>
      <View style={styles.creditCardImageContainer}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
            marginTop: 20,
            marginHorizontal: 20
          }}
        >
          <Text style={{ fontSize: 20, color: 'white' }}>{cvc}</Text>
          <ImageBackground source={image} style={styles.creditCardTypeImage}></ImageBackground>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 30, color: 'white' }}>**** **** **** {lastFourNumbers}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20
          }}
        >
          <Text style={{ fontSize: 20, color: 'white' }}>{name}</Text>
          <Text style={{ fontSize: 20, color: 'white' }}>{expiry}</Text>
        </View>
      </View>
    </View>
  );
};

export default CreditCard;

const styles = StyleSheet.create({
  containerCreditCard: {
    flex: 1,
    paddingHorizontal: 20
  },
  creditCardImageContainer: {
    backgroundColor: Colors.primary800,
    height: 200,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 18
    },
    shadowOpacity: 0.25,
    shadowRadius: 20.0,
    elevation: 24
  },
  creditCardTypeImage: {
    flex: 1,
    //justifyContent: 'center',
    maxHeight: 30,
    maxWidth: 50
    //alignSelf: 'flex-end'
  },
  textImage: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  buttons: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 30,
    marginTop: 15,
    marginRight: 20
  },
  buttonPressable: {
    flex: 1,
    marginHorizontal: 3,
    minHeight: 40
  },
  buttonTextStyles: { fontSize: 20 }
});
