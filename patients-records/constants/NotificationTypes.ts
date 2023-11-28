class NotificationTypes {
  static readonly PAYMENTERROR = new NotificationTypes(
    'PAYMENTERROR',
    'Existe um problema com o seu pagamento.'
  );

  private constructor(private readonly key: string, public readonly value: any) {}

  toString() {
    return this.key;
  }
}

export default NotificationTypes;
