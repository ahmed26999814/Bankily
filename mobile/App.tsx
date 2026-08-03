import { useMemo, useRef, useState, type ComponentProps } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from './src/theme';

type Screen = 'login' | 'home' | 'operations' | 'notifications' | 'account';
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type Service = {
  id: string;
  title: string;
  icon: IconName;
  accent: string;
  description: string;
};

const services: Service[] = [
  { id: 'bills', title: 'دفع الفواتير', icon: 'receipt-text-outline', accent: colors.turquoise, description: 'تسديد فواتير الخدمات من حسابك.' },
  { id: 'credit', title: 'شراء رصيد', icon: 'cellphone-arrow-down', accent: colors.yellow, description: 'شراء رصيد الهاتف بسرعة وأمان.' },
  { id: 'bank', title: 'تحويل بنكي', icon: 'bank-transfer', accent: colors.turquoise, description: 'تحويل تجريبي بين الحسابات البنكية.' },
  { id: 'merchant', title: 'دفع للتاجر', icon: 'storefront-outline', accent: colors.yellow, description: 'الدفع عبر رقم التاجر أو رمز العملية.' },
  { id: 'statement', title: 'كشف الحساب', icon: 'file-document-outline', accent: colors.turquoise, description: 'عرض آخر العمليات التجريبية.' },
  { id: 'gimtel', title: 'Gimtel', icon: 'alpha-g-circle-outline', accent: colors.yellow, description: 'خدمات Gimtel داخل التطبيق.' },
];

const operations = [
  { id: '1', title: 'شراء رصيد', detail: 'موريتل • 2,000 MRU', date: 'اليوم، 18:42', positive: false },
  { id: '2', title: 'استلام تحويل', detail: 'من حساب تجريبي', date: 'أمس، 14:05', positive: true },
  { id: '3', title: 'دفع فاتورة', detail: 'خدمة الكهرباء', date: '31 يوليو، 10:20', positive: false },
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.brandWrap, compact && styles.brandWrapCompact]} accessibilityLabel="Bankily بنكيلي">
      <View style={[styles.brandIcon, compact && styles.brandIconCompact]}>
        <View style={styles.cardBack} />
        <View style={styles.cardFront} />
        <View style={styles.phoneShape}>
          <Text style={styles.phoneBpm}>BPM</Text>
          <View style={styles.phoneLine} />
        </View>
      </View>
      <View>
        <Text style={[styles.brandLatin, compact && styles.brandLatinCompact]}>Bankily</Text>
        <Text style={[styles.brandArabic, compact && styles.brandArabicCompact]}>بنكيلي</Text>
      </View>
    </View>
  );
}

function PinInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const refs = useRef<Array<TextInput | null>>([]);
  const digits = Array.from({ length: 4 }, (_, index) => value[index] ?? '');

  const updateDigit = (index: number, digit: string) => {
    const sanitized = digit.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = sanitized;
    onChange(next.join(''));
    if (sanitized && index < 3) refs.current[index + 1]?.focus();
  };

  return (
    <View style={styles.pinContainer}>
      <Ionicons name="lock-closed-outline" size={34} color={colors.ink} />
      <View style={styles.pinRow}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(input) => { refs.current[index] = input; }}
            value={digit}
            onChangeText={(text) => updateDigit(index, text)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !digits[index] && index > 0) refs.current[index - 1]?.focus();
            }}
            keyboardType="number-pad"
            maxLength={1}
            secureTextEntry
            style={styles.pinCell}
            accessibilityLabel={`الرقم السري ${index + 1}`}
          />
        ))}
      </View>
    </View>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');

  const submit = () => {
    if (phone.trim().length < 6 || pin.length !== 4) {
      Alert.alert('بيانات غير مكتملة', 'أدخل رقم هاتف صحيحًا ورقمًا سريًا من 4 أرقام.');
      return;
    }
    onLogin();
  };

  return (
    <SafeAreaView style={styles.loginSafe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.loginContent} keyboardShouldPersistTaps="handled">
          <BrandMark />
          <View style={styles.formBlock}>
            <Text style={styles.label}>اسم المستخدم أو رقم الهاتف</Text>
            <View style={styles.underlinedInput}>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="مثال: 37513164"
                placeholderTextColor="#A7A7A7"
                style={styles.phoneInput}
              />
              <Ionicons name="person-circle-outline" size={39} color={colors.ink} />
            </View>
          </View>
          <View style={styles.formBlockSmall}>
            <Text style={styles.label}>الرقم السري</Text>
            <PinInput value={pin} onChange={setPin} />
          </View>
          <Pressable onPress={() => Alert.alert('استرجاع الرقم السري', 'هذه الوظيفة ستُربط لاحقًا بخدمة الرسائل.')}>
            <Text style={styles.linkText}>نسيت الرقم السري؟</Text>
          </Pressable>
          <View style={styles.loginSpacer} />
          <Pressable onPress={() => Alert.alert('التسجيل', 'واجهة التسجيل ستكون ضمن المرحلة التالية.')}>
            <Text style={styles.registerText}>مستخدم جديد؟ سجل الآن!</Text>
          </Pressable>
        </ScrollView>
        <Pressable style={styles.loginButton} onPress={submit}>
          <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Header({ onMenu }: { onMenu: () => void }) {
  const quickActions = [
    { title: 'إرسال', icon: 'send-outline' as IconName },
    { title: 'سحب', icon: 'cash-minus' as IconName },
    { title: 'إيداع', icon: 'cash-plus' as IconName },
  ];

  return (
    <View style={styles.dashboardHeader}>
      <View style={styles.headerTop}>
        <Pressable onPress={onMenu} hitSlop={12}><Ionicons name="menu" size={37} color={colors.white} /></Pressable>
        <BrandMark compact />
        <Pressable onPress={() => Alert.alert('الدعم', 'خدمة العملاء ستظهر هنا.')} hitSlop={12}>
          <Ionicons name="headset-outline" size={29} color={colors.white} />
        </Pressable>
      </View>
      <View style={styles.quickActions}>
        {quickActions.map((action) => (
          <Pressable key={action.title} style={styles.quickAction} onPress={() => Alert.alert(action.title, 'هذه عملية تجريبية فقط.')}>
            <View style={styles.quickCircle}>
              <MaterialCommunityIcons name={action.icon} size={39} color={colors.white} />
            </View>
            <Text style={styles.quickLabel}>{action.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ServiceCard({ service, onPress }: { service: Service; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.serviceCard, pressed && styles.pressed]} onPress={onPress}>
      <MaterialCommunityIcons name={service.icon} size={55} color={service.accent} />
      <Text style={styles.serviceTitle}>{service.title}</Text>
    </Pressable>
  );
}

function HomeScreen({ onMenu, onService }: { onMenu: () => void; onService: (service: Service) => void }) {
  return (
    <View style={styles.screen}>
      <Header onMenu={onMenu} />
      <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
        <View style={styles.balanceCard}>
          <View>
            <Text style={styles.balanceLabel}>الرصيد المتاح</Text>
            <Text style={styles.balanceValue}>•••••• MRU</Text>
          </View>
          <Pressable onPress={() => Alert.alert('الرصيد', 'تم إخفاء الرصيد حفاظًا على الخصوصية.')}>
            <Ionicons name="eye-off-outline" size={28} color={colors.turquoiseDark} />
          </Pressable>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>الخدمات</Text>
          <Text style={styles.demoBadge}>نسخة تجريبية</Text>
        </View>
        <View style={styles.serviceGrid}>
          {services.map((service) => <ServiceCard key={service.id} service={service} onPress={() => onService(service)} />)}
        </View>
      </ScrollView>
    </View>
  );
}

function OperationsScreen() {
  return (
    <SafeAreaView style={styles.secondarySafe}>
      <View style={styles.secondaryHeader}><Text style={styles.secondaryHeaderTitle}>العمليات</Text></View>
      <FlatList
        data={operations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.operationCard}>
            <View style={[styles.operationIcon, { backgroundColor: item.positive ? '#E6F8F3' : '#FFF7DE' }]}>
              <Ionicons name={item.positive ? 'arrow-down' : 'arrow-up'} size={23} color={item.positive ? colors.turquoiseDark : '#C89700'} />
            </View>
            <View style={styles.operationText}>
              <Text style={styles.operationTitle}>{item.title}</Text>
              <Text style={styles.operationDetail}>{item.detail}</Text>
            </View>
            <Text style={styles.operationDate}>{item.date}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.secondarySafe}>
      <View style={styles.secondaryHeader}><Text style={styles.secondaryHeaderTitle}>الإشعارات</Text></View>
      <View style={styles.emptyState}>
        <Ionicons name="notifications-outline" size={70} color={colors.turquoise} />
        <Text style={styles.emptyTitle}>لا توجد إشعارات جديدة</Text>
        <Text style={styles.emptyText}>ستظهر هنا تنبيهات العمليات والأمان.</Text>
      </View>
    </SafeAreaView>
  );
}

function AccountScreen({ onLogout }: { onLogout: () => void }) {
  const rows = [
    { title: 'المعلومات الشخصية', icon: 'person-outline' as const },
    { title: 'الأمان والرقم السري', icon: 'shield-checkmark-outline' as const },
    { title: 'اللغة', icon: 'language-outline' as const },
    { title: 'المساعدة', icon: 'help-circle-outline' as const },
  ];
  return (
    <SafeAreaView style={styles.secondarySafe}>
      <View style={styles.secondaryHeader}><Text style={styles.secondaryHeaderTitle}>حسابي</Text></View>
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Ionicons name="person" size={39} color={colors.white} /></View>
        <View><Text style={styles.profileName}>مستخدم تجريبي</Text><Text style={styles.profilePhone}>+222 •••• ••••</Text></View>
      </View>
      <View style={styles.settingsList}>
        {rows.map((row) => (
          <Pressable key={row.title} style={styles.settingsRow} onPress={() => Alert.alert(row.title, 'ستُفعّل هذه الصفحة في المرحلة التالية.')}>
            <Ionicons name={row.icon} size={25} color={colors.turquoiseDark} />
            <Text style={styles.settingsText}>{row.title}</Text>
            <Ionicons name="chevron-back" size={21} color={colors.muted} />
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.logoutButton} onPress={onLogout}><Text style={styles.logoutText}>تسجيل الخروج</Text></Pressable>
    </SafeAreaView>
  );
}

function BottomNav({ screen, onChange }: { screen: Screen; onChange: (screen: Screen) => void }) {
  const tabs = [
    { screen: 'home' as Screen, title: 'الرئيسية', icon: 'home-outline' as const, active: 'home' as const },
    { screen: 'operations' as Screen, title: 'العمليات', icon: 'swap-horizontal-outline' as const, active: 'swap-horizontal' as const },
    { screen: 'notifications' as Screen, title: 'الإشعارات', icon: 'notifications-outline' as const, active: 'notifications' as const },
    { screen: 'account' as Screen, title: 'حسابي', icon: 'person-outline' as const, active: 'person' as const },
  ];
  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const selected = tab.screen === screen;
        return (
          <Pressable key={tab.screen} style={styles.navButton} onPress={() => onChange(tab.screen)}>
            <Ionicons name={selected ? tab.active : tab.icon} size={26} color={selected ? colors.turquoise : colors.muted} />
            <Text style={[styles.navLabel, selected && styles.navLabelActive]}>{tab.title}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ServiceModal({ service, onClose }: { service: Service | null; onClose: () => void }) {
  const [value, setValue] = useState('');
  return (
    <Modal visible={Boolean(service)} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Pressable onPress={onClose}><Ionicons name="close" size={28} color={colors.ink} /></Pressable>
            <Text style={styles.modalTitle}>{service?.title}</Text>
            <View style={{ width: 28 }} />
          </View>
          <View style={styles.modalIcon}><MaterialCommunityIcons name={service?.icon ?? 'wallet-outline'} size={58} color={service?.accent ?? colors.turquoise} /></View>
          <Text style={styles.modalDescription}>{service?.description}</Text>
          <Text style={styles.modalLabel}>الرقم أو المرجع</Text>
          <TextInput value={value} onChangeText={setValue} keyboardType="number-pad" placeholder="أدخل البيانات" placeholderTextColor="#A4A4A4" style={styles.modalInput} />
          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              if (!value.trim()) {
                Alert.alert('معلومة مطلوبة', 'أدخل الرقم أو المرجع أولًا.');
                return;
              }
              Alert.alert('عملية تجريبية', 'تمت محاكاة العملية بنجاح دون استخدام أموال حقيقية.');
              setValue('');
              onClose();
            }}
          >
            <Text style={styles.primaryButtonText}>متابعة</Text>
          </Pressable>
          <Text style={styles.safetyNote}>لا يتم إرسال أو خصم أي أموال في هذه النسخة.</Text>
        </View>
      </View>
    </Modal>
  );
}

function Drawer({ visible, onClose, onLogout }: { visible: boolean; onClose: () => void; onLogout: () => void }) {
  const items = ['الملف الشخصي', 'حدود العمليات', 'الأسئلة الشائعة', 'اتصل بنا'];
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.drawerOverlay} onPress={onClose}>
        <Pressable style={styles.drawer} onPress={() => undefined}>
          <BrandMark compact />
          <Text style={styles.drawerCaption}>خدماتك المالية في مكان واحد</Text>
          {items.map((item) => (
            <Pressable key={item} style={styles.drawerRow} onPress={() => Alert.alert(item, 'ستُضاف هذه الصفحة لاحقًا.')}>
              <Text style={styles.drawerText}>{item}</Text><Ionicons name="chevron-back" size={20} color={colors.muted} />
            </Pressable>
          ))}
          <View style={styles.drawerSpacer} />
          <Pressable style={styles.drawerLogout} onPress={onLogout}><Ionicons name="log-out-outline" size={23} color={colors.danger} /><Text style={styles.drawerLogoutText}>تسجيل الخروج</Text></Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const loggedIn = screen !== 'login';

  const content = useMemo(() => {
    if (screen === 'home') return <HomeScreen onMenu={() => setDrawerOpen(true)} onService={setSelectedService} />;
    if (screen === 'operations') return <OperationsScreen />;
    if (screen === 'notifications') return <NotificationsScreen />;
    if (screen === 'account') return <AccountScreen onLogout={() => setScreen('login')} />;
    return <LoginScreen onLogin={() => setScreen('home')} />;
  }, [screen]);

  return (
    <View style={styles.app}>
      <NativeStatusBar backgroundColor={screen === 'home' ? colors.turquoise : colors.white} barStyle={screen === 'home' ? 'light-content' : 'dark-content'} />
      {content}
      {loggedIn && <BottomNav screen={screen} onChange={setScreen} />}
      <Drawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} onLogout={() => { setDrawerOpen(false); setScreen('login'); }} />
      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  app: { flex: 1, backgroundColor: colors.white },
  screen: { flex: 1, backgroundColor: colors.background, paddingBottom: 72 },
  loginSafe: { flex: 1, backgroundColor: colors.white },
  loginContent: { flexGrow: 1, paddingHorizontal: 30, paddingTop: 28, paddingBottom: 22 },
  brandWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 42 },
  brandWrapCompact: { marginBottom: 0, transform: [{ scale: 0.72 }] },
  brandIcon: { width: 108, height: 92, position: 'relative' },
  brandIconCompact: { width: 83, height: 69 },
  cardBack: { position: 'absolute', width: 62, height: 39, borderRadius: 5, backgroundColor: colors.turquoiseDark, top: 10, left: 0, transform: [{ rotate: '-12deg' }] },
  cardFront: { position: 'absolute', width: 67, height: 42, borderRadius: 5, backgroundColor: '#0A8192', top: 28, left: 4, transform: [{ rotate: '-8deg' }] },
  phoneShape: { position: 'absolute', width: 49, height: 84, borderRadius: 12, backgroundColor: colors.yellow, right: 2, top: 4, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 4 },
  phoneBpm: { fontSize: 11, color: '#555', fontWeight: '700', backgroundColor: colors.white, width: 35, height: 54, textAlign: 'center', textAlignVertical: 'center' },
  phoneLine: { width: 14, height: 3, borderRadius: 3, backgroundColor: colors.turquoiseDark, marginTop: 5 },
  brandLatin: { color: colors.turquoiseDark, fontSize: 40, fontWeight: '800', lineHeight: 43 },
  brandLatinCompact: { fontSize: 29, lineHeight: 31, color: colors.white },
  brandArabic: { color: colors.yellow, fontSize: 38, lineHeight: 41, fontWeight: '600', textAlign: 'right' },
  brandArabicCompact: { fontSize: 27, lineHeight: 29 },
  formBlock: { marginBottom: 29 },
  formBlockSmall: { marginBottom: 7 },
  label: { color: colors.ink, fontSize: 20, textAlign: 'right', marginBottom: 9 },
  underlinedInput: { height: 57, borderBottomWidth: 2, borderBottomColor: colors.ink, flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  phoneInput: { flex: 1, height: '100%', fontSize: 21, textAlign: 'right', color: colors.ink, writingDirection: 'ltr' },
  pinContainer: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  pinRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', marginRight: 10 },
  pinCell: { width: 42, height: 53, borderBottomWidth: 3, borderBottomColor: colors.ink, fontSize: 30, textAlign: 'center', color: colors.ink },
  linkText: { color: colors.ink, fontSize: 18, textDecorationLine: 'underline', textAlign: 'right', marginTop: 7 },
  loginSpacer: { flex: 1, minHeight: 70 },
  registerText: { color: colors.ink, fontSize: 19, textDecorationLine: 'underline', textAlign: 'center', marginBottom: 10 },
  loginButton: { height: 70, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  loginButtonText: { color: colors.white, fontSize: 27, fontWeight: '500' },
  dashboardHeader: { backgroundColor: colors.turquoise, paddingHorizontal: 18, paddingTop: Platform.OS === 'android' ? 12 : 7, paddingBottom: 19 },
  headerTop: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', minHeight: 60 },
  quickActions: { flexDirection: 'row-reverse', justifyContent: 'space-around', marginTop: 9 },
  quickAction: { alignItems: 'center', minWidth: 82 },
  quickCircle: { width: 72, height: 72, borderRadius: 36, borderWidth: 1.5, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { color: colors.white, fontSize: 18, marginTop: 7 },
  homeContent: { padding: 15, paddingBottom: 25 },
  balanceCard: { backgroundColor: colors.white, borderRadius: 17, padding: 18, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  balanceLabel: { color: colors.muted, fontSize: 15, textAlign: 'right' },
  balanceValue: { color: colors.ink, fontSize: 25, fontWeight: '700', marginTop: 5, textAlign: 'right', writingDirection: 'ltr' },
  sectionRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 11 },
  sectionTitle: { fontSize: 22, color: colors.ink, fontWeight: '700' },
  demoBadge: { color: colors.turquoiseDark, backgroundColor: '#DDF7FA', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, fontSize: 12 },
  serviceGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  serviceCard: { width: '31.8%', minHeight: 145, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 10, alignItems: 'center', justifyContent: 'center', padding: 8 },
  serviceTitle: { color: colors.ink, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 12 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 72, backgroundColor: colors.white, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, flexDirection: 'row-reverse', paddingBottom: Platform.OS === 'ios' ? 8 : 0 },
  navButton: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  navLabel: { color: colors.muted, fontSize: 12 },
  navLabelActive: { color: colors.turquoise, fontWeight: '700' },
  secondarySafe: { flex: 1, backgroundColor: colors.background, paddingBottom: 72 },
  secondaryHeader: { height: 65, backgroundColor: colors.turquoise, alignItems: 'center', justifyContent: 'center' },
  secondaryHeaderTitle: { color: colors.white, fontSize: 23, fontWeight: '600' },
  listContent: { padding: 15 },
  operationCard: { backgroundColor: colors.white, borderRadius: 13, padding: 14, marginBottom: 10, flexDirection: 'row-reverse', alignItems: 'center' },
  operationIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  operationText: { flex: 1, marginHorizontal: 11 },
  operationTitle: { textAlign: 'right', color: colors.ink, fontSize: 17, fontWeight: '600' },
  operationDetail: { textAlign: 'right', color: colors.muted, fontSize: 13, marginTop: 3 },
  operationDate: { color: colors.muted, fontSize: 11, maxWidth: 72, textAlign: 'left' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 35 },
  emptyTitle: { fontSize: 21, fontWeight: '700', color: colors.ink, marginTop: 17 },
  emptyText: { fontSize: 15, color: colors.muted, marginTop: 7, textAlign: 'center' },
  profileCard: { margin: 15, padding: 18, backgroundColor: colors.white, borderRadius: 15, flexDirection: 'row-reverse', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.turquoise, alignItems: 'center', justifyContent: 'center', marginLeft: 13 },
  profileName: { textAlign: 'right', fontSize: 19, color: colors.ink, fontWeight: '700' },
  profilePhone: { textAlign: 'right', color: colors.muted, fontSize: 14, marginTop: 4, writingDirection: 'ltr' },
  settingsList: { marginHorizontal: 15, backgroundColor: colors.white, borderRadius: 15, overflow: 'hidden' },
  settingsRow: { minHeight: 59, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  settingsText: { flex: 1, textAlign: 'right', color: colors.ink, fontSize: 16, marginHorizontal: 11 },
  logoutButton: { margin: 15, height: 53, borderRadius: 12, borderWidth: 1, borderColor: '#F1B7BA', backgroundColor: '#FFF4F4', alignItems: 'center', justifyContent: 'center' },
  logoutText: { color: colors.danger, fontSize: 17, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.34)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.white, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 22, paddingTop: 10, paddingBottom: 25 },
  modalHandle: { alignSelf: 'center', width: 45, height: 5, borderRadius: 5, backgroundColor: '#D4D4D4', marginBottom: 12 },
  modalHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { color: colors.ink, fontSize: 21, fontWeight: '700' },
  modalIcon: { alignSelf: 'center', width: 94, height: 94, borderRadius: 47, backgroundColor: '#F5FAFA', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  modalDescription: { color: colors.muted, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 13, marginBottom: 20 },
  modalLabel: { color: colors.ink, fontSize: 16, textAlign: 'right', marginBottom: 8 },
  modalInput: { height: 54, borderWidth: 1, borderColor: colors.border, borderRadius: 11, paddingHorizontal: 13, fontSize: 18, textAlign: 'right', color: colors.ink },
  primaryButton: { height: 55, borderRadius: 11, backgroundColor: colors.turquoise, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  primaryButtonText: { color: colors.white, fontSize: 19, fontWeight: '700' },
  safetyNote: { color: colors.muted, textAlign: 'center', fontSize: 12, marginTop: 11 },
  drawerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'flex-end' },
  drawer: { width: '82%', maxWidth: 360, height: '100%', backgroundColor: colors.white, paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 32 : 55 },
  drawerCaption: { color: colors.muted, textAlign: 'right', fontSize: 14, marginBottom: 22 },
  drawerRow: { minHeight: 57, flexDirection: 'row-reverse', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  drawerText: { flex: 1, textAlign: 'right', fontSize: 17, color: colors.ink },
  drawerSpacer: { flex: 1 },
  drawerLogout: { flexDirection: 'row-reverse', gap: 9, alignItems: 'center', paddingVertical: 18 },
  drawerLogoutText: { color: colors.danger, fontSize: 17 },
});
