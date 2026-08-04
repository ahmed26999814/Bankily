import { useRef, useState, type ComponentProps } from 'react';
import {
  Alert,
  Image,
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
import { BANKILY_LOGO } from './src/logo';

const TURQUOISE = '#12B7C5';
const TURQUOISE_DARK = '#078E9F';
const YELLOW = '#FFC20A';
const GOLD = '#C9B135';
const INK = '#121212';
const MUTED = '#7D7B88';
const BORDER = '#C9C9C9';
const WHITE = '#FFFFFF';

type Screen = 'login' | 'home' | 'favorites' | 'notifications' | 'help';
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type Service = {
  id: string;
  title: string;
  icon?: IconName;
  accent: string;
  gimtel?: boolean;
};

const quickActions: Array<{ title: string; icon: IconName }> = [
  { title: 'تسديد مشتريات', icon: 'cash-multiple' },
  { title: 'تحويل الأموال', icon: 'cash-sync' },
  { title: 'حسابي', icon: 'account-details-outline' },
];

const services: Service[] = [
  { id: 'credit', title: 'تعبئة رصيد\nالهاتف', icon: 'cellphone-arrow-up', accent: TURQUOISE },
  { id: 'bills', title: 'تسديد الفواتير', icon: 'receipt-text-outline', accent: YELLOW },
  { id: 'cheques', title: 'طلب دفتر\nشيكات', icon: 'checkbook', accent: TURQUOISE },
  { id: 'cards', title: 'البطاقات البنكية', icon: 'credit-card-outline', accent: YELLOW },
  { id: 'cash', title: 'سحب النقود', icon: 'cash-fast', accent: TURQUOISE },
  { id: 'bpay', title: 'ب-باي', icon: 'cellphone-check', accent: YELLOW },
  { id: 'gimtel', title: 'جيمتل', accent: TURQUOISE, gimtel: true },
];

function PinInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const refs = useRef<Array<TextInput | null>>([]);
  const digits = Array.from({ length: 4 }, (_, index) => value[index] ?? '');

  const updateDigit = (index: number, text: string) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    onChange(next.join(''));
    if (digit && index < 3) refs.current[index + 1]?.focus();
  };

  return (
    <View style={styles.pinLine}>
      <Ionicons name="lock-closed-outline" size={35} color={INK} />
      <View style={styles.pinCells}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(input) => {
              refs.current[index] = input;
            }}
            value={digit}
            onChangeText={(text) => updateDigit(index, text)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                refs.current[index - 1]?.focus();
              }
            }}
            keyboardType="number-pad"
            maxLength={1}
            secureTextEntry
            style={styles.pinCell}
            accessibilityLabel={`رقم سري ${index + 1}`}
          />
        ))}
      </View>
    </View>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [phone, setPhone] = useState('37513164');
  const [pin, setPin] = useState('');

  const submit = () => {
    if (phone.trim().length < 6 || pin.length !== 4) {
      Alert.alert('بيانات غير مكتملة', 'أدخل رقم الهاتف ثم أربعة أرقام للرقم السري.');
      return;
    }
    onLogin();
  };

  return (
    <SafeAreaView style={styles.loginSafe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.loginBody}>
          <ScrollView
            contentContainerStyle={styles.loginScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={{ uri: BANKILY_LOGO }}
              resizeMode="contain"
              style={styles.loginLogo}
              accessibilityLabel="شعار Bankily"
            />

            <View style={styles.loginForm}>
              <Text style={styles.loginLabel}>اسم المستخدم أو رقم الهاتف</Text>
              <View style={styles.phoneRow}>
                <Ionicons name="person-circle-outline" size={42} color={INK} />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={styles.phoneInput}
                  selectionColor={TURQUOISE}
                />
              </View>

              <View style={styles.pinBlock}>
                <Text style={styles.loginLabel}>الرقم السري</Text>
                <PinInput value={pin} onChange={setPin} />
              </View>

              <Pressable
                style={styles.forgotWrap}
                onPress={() =>
                  Alert.alert('نسيت الرقم السري؟', 'سيتم ربط الاسترجاع بخدمة الرسائل لاحقًا.')
                }
              >
                <Text style={styles.underlinedText}>نسيت الرقم السري؟</Text>
              </Pressable>
            </View>

            <View style={styles.loginSpacer} />

            <Pressable
              onPress={() =>
                Alert.alert('مستخدم جديد', 'صفحة التسجيل ستُفعّل في المرحلة التالية.')
              }
            >
              <Text style={styles.registerText}>مستخدم جديد؟ سجل الآن!</Text>
            </Pressable>
          </ScrollView>

          <Pressable style={styles.loginButton} onPress={submit}>
            <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function QuickAction({
  title,
  icon,
}: {
  title: string;
  icon: IconName;
}) {
  return (
    <Pressable
      style={styles.quickAction}
      onPress={() => Alert.alert(title, 'هذه العملية تجريبية ولا تستخدم أموالًا حقيقية.')}
    >
      <View style={styles.quickCircle}>
        <MaterialCommunityIcons name={icon} size={37} color={WHITE} />
      </View>
      <Text style={styles.quickLabel}>{title}</Text>
    </Pressable>
  );
}

function DashboardHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <View style={styles.dashboardHeader}>
      <View style={styles.dashboardTitleRow}>
        <Pressable onPress={onMenu} style={styles.menuButton} hitSlop={12}>
          <Ionicons name="menu" size={39} color={WHITE} />
        </Pressable>
        <Text style={styles.dashboardTitle}>لوحة القيادة</Text>
      </View>
      <View style={styles.quickActions}>
        {quickActions.map((action) => (
          <QuickAction key={action.title} {...action} />
        ))}
      </View>
    </View>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.serviceCard, pressed && styles.servicePressed]}
      onPress={() =>
        Alert.alert(service.title.replace('\n', ' '), 'هذه الخدمة ستكون متصلة بالنظام لاحقًا.')
      }
    >
      {service.gimtel ? (
        <View style={styles.gimtelCircle}>
          <Text style={styles.gimtelLetter}>G</Text>
        </View>
      ) : (
        <MaterialCommunityIcons
          name={service.icon ?? 'circle-outline'}
          size={53}
          color={service.accent}
        />
      )}
      <Text style={styles.serviceText}>{service.title}</Text>
    </Pressable>
  );
}

function HomeScreen({ onMenu }: { onMenu: () => void }) {
  return (
    <View style={styles.mainScreen}>
      <DashboardHeader onMenu={onMenu} />
      <ScrollView
        style={styles.homeScroll}
        contentContainerStyle={styles.homeContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
          <View style={styles.emptyGridCell} />
          <View style={styles.emptyGridCell} />
        </View>
      </ScrollView>
    </View>
  );
}

function PlaceholderScreen({
  title,
  icon,
}: {
  title: string;
  icon: ComponentProps<typeof Ionicons>['name'];
}) {
  return (
    <View style={styles.placeholderScreen}>
      <View style={styles.placeholderHeader}>
        <Text style={styles.placeholderHeaderText}>{title}</Text>
      </View>
      <View style={styles.placeholderBody}>
        <Ionicons name={icon} size={74} color={TURQUOISE} />
        <Text style={styles.placeholderTitle}>{title}</Text>
        <Text style={styles.placeholderText}>سيتم تفعيل هذه الصفحة ضمن المرحلة التالية.</Text>
      </View>
    </View>
  );
}

function BottomNav({
  screen,
  onChange,
}: {
  screen: Screen;
  onChange: (screen: Screen) => void;
}) {
  const items: Array<{
    screen: Screen;
    title: string;
    outline: ComponentProps<typeof Ionicons>['name'];
    filled: ComponentProps<typeof Ionicons>['name'];
  }> = [
    { screen: 'home', title: 'الرئيسية', outline: 'home-outline', filled: 'home' },
    { screen: 'favorites', title: 'المفضلة', outline: 'star-outline', filled: 'star' },
    {
      screen: 'notifications',
      title: 'الإشعارات',
      outline: 'notifications-outline',
      filled: 'notifications',
    },
    { screen: 'help', title: 'المساعدة', outline: 'help-circle-outline', filled: 'help-circle' },
  ];

  return (
    <View style={styles.bottomNav}>
      {items.map((item) => {
        const active = screen === item.screen;
        return (
          <Pressable
            key={item.screen}
            style={styles.navItem}
            onPress={() => onChange(item.screen)}
          >
            <Ionicons
              name={active ? item.filled : item.outline}
              size={31}
              color={active ? TURQUOISE : MUTED}
            />
            <Text style={[styles.navText, active && styles.navTextActive]}>{item.title}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Drawer({
  visible,
  onClose,
  onLogout,
}: {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.drawerOverlay} onPress={onClose}>
        <Pressable style={styles.drawer} onPress={() => undefined}>
          <Text style={styles.drawerTitle}>Bankily</Text>
          {['حسابي', 'العمليات', 'الإعدادات', 'اتصل بنا'].map((item) => (
            <Pressable
              key={item}
              style={styles.drawerRow}
              onPress={() => Alert.alert(item, 'ستُفعّل هذه الصفحة لاحقًا.')}
            >
              <Text style={styles.drawerRowText}>{item}</Text>
              <Ionicons name="chevron-back" size={20} color={MUTED} />
            </Pressable>
          ))}
          <View style={styles.drawerSpacer} />
          <Pressable style={styles.logoutRow} onPress={onLogout}>
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
            <Ionicons name="log-out-outline" size={24} color="#C43C44" />
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const loggedIn = screen !== 'login';

  let content;
  if (screen === 'login') {
    content = <LoginScreen onLogin={() => setScreen('home')} />;
  } else if (screen === 'home') {
    content = <HomeScreen onMenu={() => setDrawerVisible(true)} />;
  } else if (screen === 'favorites') {
    content = <PlaceholderScreen title="المفضلة" icon="star-outline" />;
  } else if (screen === 'notifications') {
    content = <PlaceholderScreen title="الإشعارات" icon="notifications-outline" />;
  } else {
    content = <PlaceholderScreen title="المساعدة" icon="help-circle-outline" />;
  }

  return (
    <View style={styles.app}>
      <NativeStatusBar
        backgroundColor={screen === 'home' ? TURQUOISE : WHITE}
        barStyle={screen === 'home' ? 'light-content' : 'dark-content'}
      />
      {content}
      {loggedIn && <BottomNav screen={screen} onChange={setScreen} />}
      <Drawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onLogout={() => {
          setDrawerVisible(false);
          setScreen('login');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  app: { flex: 1, backgroundColor: WHITE },
  loginSafe: { flex: 1, backgroundColor: WHITE },
  loginBody: { flex: 1 },
  loginScroll: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 28,
    paddingBottom: 20,
  },
  loginLogo: {
    width: '84%',
    maxWidth: 380,
    height: 225,
    alignSelf: 'center',
  },
  loginForm: {
    width: '91%',
    alignSelf: 'center',
    marginTop: 25,
  },
  loginLabel: {
    color: INK,
    fontSize: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },
  phoneRow: {
    height: 58,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 13,
    borderBottomWidth: 1.8,
    borderBottomColor: INK,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    color: INK,
    fontSize: 22,
    textAlign: 'right',
    writingDirection: 'ltr',
    paddingHorizontal: 4,
  },
  pinBlock: {
    marginTop: 37,
  },
  pinLine: {
    minHeight: 60,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 20,
  },
  pinCells: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  pinCell: {
    width: 39,
    height: 50,
    borderBottomWidth: 2.5,
    borderBottomColor: INK,
    color: INK,
    fontSize: 28,
    textAlign: 'center',
    padding: 0,
  },
  forgotWrap: {
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  underlinedText: {
    color: INK,
    fontSize: 17,
    textDecorationLine: 'underline',
    writingDirection: 'rtl',
  },
  loginSpacer: {
    flex: 1,
    minHeight: 185,
  },
  registerText: {
    color: INK,
    fontSize: 18,
    textAlign: 'center',
    textDecorationLine: 'underline',
    writingDirection: 'rtl',
    marginBottom: 5,
  },
  loginButton: {
    height: 73,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: WHITE,
    fontSize: 28,
    fontWeight: '400',
    writingDirection: 'rtl',
  },
  mainScreen: {
    flex: 1,
    backgroundColor: WHITE,
    paddingBottom: 78,
  },
  dashboardHeader: {
    height: 258,
    backgroundColor: TURQUOISE,
    paddingHorizontal: 18,
    paddingTop: 13,
  },
  dashboardTitleRow: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    right: 0,
    top: 5,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardTitle: {
    color: WHITE,
    fontSize: 26,
    fontWeight: '400',
    writingDirection: 'rtl',
  },
  quickActions: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingBottom: 17,
  },
  quickAction: {
    width: '31%',
    alignItems: 'center',
  },
  quickCircle: {
    width: 81,
    height: 81,
    borderRadius: 41,
    borderWidth: 1.5,
    borderColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    color: WHITE,
    fontSize: 17,
    textAlign: 'center',
    marginTop: 9,
    writingDirection: 'rtl',
  },
  homeScroll: {
    flex: 1,
    backgroundColor: WHITE,
  },
  homeContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  servicesGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  serviceCard: {
    width: '33.333333%',
    aspectRatio: 1,
    borderWidth: 0.55,
    borderColor: BORDER,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  emptyGridCell: {
    width: '33.333333%',
    aspectRatio: 1,
    backgroundColor: WHITE,
  },
  servicePressed: {
    opacity: 0.68,
  },
  serviceText: {
    color: INK,
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 15,
    writingDirection: 'rtl',
  },
  gimtelCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: TURQUOISE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gimtelLetter: {
    color: WHITE,
    fontSize: 43,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'Arial', android: 'sans-serif', default: undefined }),
  },
  placeholderScreen: {
    flex: 1,
    backgroundColor: WHITE,
    paddingBottom: 78,
  },
  placeholderHeader: {
    height: 65,
    backgroundColor: TURQUOISE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderHeaderText: {
    color: WHITE,
    fontSize: 24,
    writingDirection: 'rtl',
  },
  placeholderBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  placeholderTitle: {
    color: INK,
    fontSize: 22,
    marginTop: 14,
    writingDirection: 'rtl',
  },
  placeholderText: {
    color: MUTED,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 7,
    writingDirection: 'rtl',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    backgroundColor: WHITE,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ECECEC',
    flexDirection: 'row-reverse',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navText: {
    color: MUTED,
    fontSize: 13,
    writingDirection: 'rtl',
  },
  navTextActive: {
    color: TURQUOISE,
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'flex-end',
  },
  drawer: {
    width: '79%',
    maxWidth: 350,
    height: '100%',
    backgroundColor: WHITE,
    paddingTop: Platform.OS === 'android' ? 42 : 60,
    paddingHorizontal: 21,
  },
  drawerTitle: {
    color: TURQUOISE_DARK,
    fontSize: 31,
    fontWeight: '700',
    marginBottom: 24,
  },
  drawerRow: {
    minHeight: 58,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E6E6',
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  drawerRowText: {
    flex: 1,
    color: INK,
    fontSize: 17,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  drawerSpacer: { flex: 1 },
  logoutRow: {
    minHeight: 62,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 9,
  },
  logoutText: {
    color: '#C43C44',
    fontSize: 17,
    writingDirection: 'rtl',
  },
});
