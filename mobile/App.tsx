import { useRef, useState, type ComponentProps } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BANKILY_LOGO } from './src/logo';

const FULL_LOGO = require('./assets/bankily-full.jpg');
const C = {
  teal: '#11B7C4',
  yellow: '#FFC20A',
  gold: '#BEB53D',
  black: '#101010',
  gray: '#7E7C88',
  border: '#C6C6C6',
  white: '#FFFFFF',
};
type Screen = 'login' | 'home' | 'favorites' | 'notifications' | 'help';
type IonName = ComponentProps<typeof Ionicons>['name'];
type ServiceId = 'credit' | 'bills' | 'cheques' | 'cards' | 'cash' | 'bpay' | 'gimtel';
const SERVICES: Array<{ id: ServiceId; title: string; color: string }> = [
  { id: 'credit', title: 'تعبئة رصيد\nالهاتف', color: C.teal },
  { id: 'bills', title: 'تسديد الفواتير', color: C.yellow },
  { id: 'cheques', title: 'طلب دفتر\nشيكات', color: C.teal },
  { id: 'cards', title: 'البطاقات البنكية', color: C.yellow },
  { id: 'cash', title: 'سحب النقود', color: C.teal },
  { id: 'bpay', title: 'ب-باي', color: C.yellow },
  { id: 'gimtel', title: 'جيمتل', color: C.teal },
];

function Pin({
  value,
  setValue,
  width,
}: {
  value: string;
  setValue: (v: string) => void;
  width: number;
}) {
  const refs = useRef<Array<TextInput | null>>([]);
  const digits = Array.from({ length: 4 }, (_, i) => value[i] ?? '');
  return (
    <View style={s.pinRow}>
      <View style={s.pinCells}>
        {digits.map((digit, i) => (
          <TextInput
            key={i}
            ref={(node) => {
              refs.current[i] = node;
            }}
            value={digit}
            onChangeText={(text) => {
              const next = [...digits];
              next[i] = text.replace(/\D/g, '').slice(-1);
              setValue(next.join(''));
              if (next[i] && i < 3) refs.current[i + 1]?.focus();
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !digit && i > 0) refs.current[i - 1]?.focus();
            }}
            maxLength={1}
            keyboardType="number-pad"
            secureTextEntry
            style={[s.pinCell, { width }]}
          />
        ))}
      </View>
      <Ionicons name="lock-closed-outline" size={41} color={C.black} />
    </View>
  );
}

function Login({ enter }: { enter: () => void }) {
  const { width, height } = useWindowDimensions();
  const [phone, setPhone] = useState('37513164');
  const [pin, setPin] = useState('');
  const formWidth = Math.min(width * 0.82, 570);
  const logoWidth = Math.min(width * 0.79, 545);
  const logoHeight = logoWidth * (504 / 820);
  const navInset = Platform.OS === 'android' ? 48 : 0;
  const buttonHeight = height < 720 ? 66 : 82;
  const formTop = height < 720 ? 210 : Math.max(275, height * 0.285);

  return (
    <KeyboardAvoidingView style={s.login} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="dark" backgroundColor={C.white} />
      <Image
        source={FULL_LOGO}
        resizeMode="contain"
        style={{
          position: 'absolute',
          top: height < 720 ? 15 : Math.max(28, height * 0.035),
          left: (width - logoWidth) / 2,
          width: logoWidth,
          height: logoHeight,
        }}
      />
      <View style={[s.form, { top: formTop, left: (width - formWidth) / 2, width: formWidth }]}>
        <Text style={s.label}>اسم المستخدم أو رقم الهاتف</Text>
        <View style={s.phoneRow}>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            selectionColor={C.teal}
            style={s.phoneInput}
          />
          <Ionicons name="person-circle-outline" size={48} color={C.black} />
        </View>
        <View style={{ marginTop: 42 }}>
          <Text style={s.label}>الرقم السري</Text>
          <Pin value={pin} setValue={setPin} width={Math.min(52, (formWidth - 100) / 4)} />
        </View>
        <Pressable
          style={s.forgot}
          onPress={() => Alert.alert('نسيت الرقم السري؟', 'سيتم تفعيل الاسترجاع لاحقًا.')}
        >
          <Text style={s.link}>نسيت الرقم السري؟</Text>
        </Pressable>
      </View>
      <Pressable
        style={[s.register, { bottom: navInset + buttonHeight + 33 }]}
        onPress={() => Alert.alert('مستخدم جديد', 'سيتم تفعيل التسجيل لاحقًا.')}
      >
        <Text style={s.registerText}>مستخدم جديد؟ سجل الآن!</Text>
      </Pressable>
      <Pressable
        style={[s.loginButton, { bottom: navInset, height: buttonHeight }]}
        onPress={() => {
          if (phone.trim().length < 6 || pin.length !== 4) {
            Alert.alert('بيانات غير مكتملة', 'أدخل رقم الهاتف وأربعة أرقام للرقم السري.');
            return;
          }
          enter();
        }}
      >
        <Text style={s.loginButtonText}>تسجيل الدخول</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

function QuickIcon({ kind }: { kind: 'purchase' | 'transfer' | 'account' }) {
  if (kind === 'purchase') return <Ionicons name="receipt-outline" size={47} color={C.white} />;
  if (kind === 'account') return <Ionicons name="documents-outline" size={46} color={C.white} />;
  return (
    <View style={{ alignItems: 'center' }}>
      <MaterialCommunityIcons name="cash" size={43} color={C.white} />
      <View style={{ flexDirection: 'row', marginTop: -5 }}>
        <Ionicons name="arrow-back" size={18} color={C.white} />
        <Ionicons name="arrow-forward" size={18} color={C.white} />
      </View>
    </View>
  );
}

function Header({ menu }: { menu: () => void }) {
  const { width } = useWindowDimensions();
  const circle = Math.min(118, width * 0.185);
  const actions = [
    { title: 'تسديد مشتريات', kind: 'purchase' as const },
    { title: 'تحويل الأموال', kind: 'transfer' as const },
    { title: 'حسابي', kind: 'account' as const },
  ];
  return (
    <View style={s.header}>
      <View style={s.headerTitleRow}>
        <Text style={s.headerTitle}>لوحة القيادة</Text>
        <Pressable style={s.menu} onPress={menu}>
          <Ionicons name="menu" size={45} color={C.white} />
        </Pressable>
      </View>
      <View style={s.quickRow}>
        {actions.map((a) => (
          <Pressable
            key={a.title}
            style={s.quick}
            onPress={() => Alert.alert(a.title, 'هذه الخدمة تجريبية حاليًا.')}
          >
            <View style={[s.circle, { width: circle, height: circle, borderRadius: circle / 2 }]}>
              <QuickIcon kind={a.kind} />
            </View>
            <Text style={s.quickText}>{a.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ServiceIcon({ id, color }: { id: ServiceId; color: string }) {
  if (id === 'gimtel') {
    return (
      <View style={s.gimtel}>
        <Text style={s.gimtelG}>G</Text>
      </View>
    );
  }
  if (id === 'bills') return <Ionicons name="receipt-outline" size={62} color={color} />;
  if (id === 'cards') return <Ionicons name="card-outline" size={62} color={color} />;
  if (id === 'cheques') return <Ionicons name="albums-outline" size={62} color={color} />;
  return (
    <View style={s.iconBox}>
      {id === 'cash' ? (
        <MaterialCommunityIcons name="cash" size={57} color={color} />
      ) : (
        <Ionicons name="phone-portrait-outline" size={58} color={color} />
      )}
      <Ionicons
        name={id === 'cash' ? 'arrow-down' : id === 'bpay' ? 'checkmark' : 'arrow-up'}
        size={id === 'bpay' ? 28 : 27}
        color={color}
        style={id === 'cash' ? s.cashArrow : id === 'bpay' ? s.check : s.phoneArrow}
      />
    </View>
  );
}

function Home({ menu }: { menu: () => void }) {
  const { width } = useWindowDimensions();
  const margin = 20;
  const cell = (width - margin * 2) / 3;
  return (
    <View style={s.home}>
      <StatusBar style="light" backgroundColor={C.teal} />
      <Header menu={menu} />
      <View style={[s.grid, { marginHorizontal: margin }]}>
        {SERVICES.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [s.service, { width: cell, height: cell }, pressed && { opacity: 0.65 }]}
            onPress={() => Alert.alert(item.title.replace('\n', ' '), 'سيتم ربط الخدمة لاحقًا.')}
          >
            <ServiceIcon id={item.id} color={item.color} />
            <Text style={s.serviceText}>{item.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Placeholder({ title, icon }: { title: string; icon: IonName }) {
  return (
    <View style={s.placeholder}>
      <StatusBar style="light" backgroundColor={C.teal} />
      <View style={s.placeholderHead}>
        <Text style={s.placeholderHeadText}>{title}</Text>
      </View>
      <View style={s.placeholderBody}>
        <Ionicons name={icon} size={75} color={C.teal} />
        <Text style={s.placeholderTitle}>{title}</Text>
      </View>
    </View>
  );
}

function Nav({ screen, setScreen }: { screen: Screen; setScreen: (v: Screen) => void }) {
  const items: Array<[Exclude<Screen, 'login'>, string, IonName, IonName]> = [
    ['home', 'الرئيسية', 'home-outline', 'home'],
    ['favorites', 'المفضلة', 'star-outline', 'star'],
    ['notifications', 'الإشعارات', 'notifications-outline', 'notifications'],
    ['help', 'المساعدة', 'help-circle-outline', 'help-circle'],
  ];
  return (
    <View style={s.nav}>
      {items.map(([key, title, outline, filled]) => {
        const active = screen === key;
        return (
          <Pressable key={key} style={s.navItem} onPress={() => setScreen(key)}>
            <Ionicons name={active ? filled : outline} size={33} color={active ? C.teal : C.gray} />
            <Text style={[s.navText, active && { color: C.teal }]}>{title}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Drawer({
  visible,
  close,
  logout,
}: {
  visible: boolean;
  close: () => void;
  logout: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={s.overlay} onPress={close}>
        <Pressable style={s.drawer} onPress={() => undefined}>
          <Image source={{ uri: BANKILY_LOGO }} resizeMode="contain" style={s.drawerLogo} />
          {['حسابي', 'العمليات', 'الإعدادات', 'اتصل بنا'].map((item) => (
            <Pressable key={item} style={s.drawerRow}>
              <Text style={s.drawerText}>{item}</Text>
              <Ionicons name="chevron-back" size={20} color={C.gray} />
            </Pressable>
          ))}
          <View style={{ flex: 1 }} />
          <Pressable style={s.logout} onPress={logout}>
            <Text style={s.logoutText}>تسجيل الخروج</Text>
            <Ionicons name="log-out-outline" size={24} color="#C43C44" />
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [drawer, setDrawer] = useState(false);
  const logged = screen !== 'login';
  let body;
  if (screen === 'login') body = <Login enter={() => setScreen('home')} />;
  else if (screen === 'home') body = <Home menu={() => setDrawer(true)} />;
  else if (screen === 'favorites') body = <Placeholder title="المفضلة" icon="star-outline" />;
  else if (screen === 'notifications') body = <Placeholder title="الإشعارات" icon="notifications-outline" />;
  else body = <Placeholder title="المساعدة" icon="help-circle-outline" />;

  return (
    <View style={s.app}>
      <NativeStatusBar
        translucent={false}
        backgroundColor={screen === 'home' ? C.teal : C.white}
        barStyle={screen === 'home' ? 'light-content' : 'dark-content'}
      />
      {body}
      {logged && <Nav screen={screen} setScreen={setScreen} />}
      <Drawer
        visible={drawer}
        close={() => setDrawer(false)}
        logout={() => {
          setDrawer(false);
          setScreen('login');
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.white },
  login: { flex: 1, backgroundColor: C.white },
  form: { position: 'absolute' },
  label: { color: C.black, fontSize: 22, lineHeight: 33, textAlign: 'right', writingDirection: 'rtl', marginBottom: 6 },
  phoneRow: { height: 65, borderBottomWidth: 2, borderBottomColor: C.black, flexDirection: 'row', alignItems: 'center', gap: 13 },
  phoneInput: { flex: 1, height: '100%', color: C.black, fontSize: 28, textAlign: 'right', writingDirection: 'ltr', paddingHorizontal: 2 },
  pinRow: { minHeight: 65, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 22 },
  pinCells: { flexDirection: 'row', gap: 17 },
  pinCell: { height: 52, borderBottomWidth: 3, borderBottomColor: C.black, color: C.black, fontSize: 28, textAlign: 'center', padding: 0 },
  forgot: { alignSelf: 'flex-start', marginTop: 24 },
  link: { color: C.black, fontSize: 18, lineHeight: 28, textDecorationLine: 'underline', writingDirection: 'rtl' },
  register: { position: 'absolute', alignSelf: 'center' },
  registerText: { color: C.black, fontSize: 19, lineHeight: 30, textAlign: 'center', textDecorationLine: 'underline', writingDirection: 'rtl' },
  loginButton: { position: 'absolute', left: 0, right: 0, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  loginButtonText: { color: C.white, fontSize: 29, writingDirection: 'rtl' },
  home: { flex: 1, backgroundColor: C.white, paddingBottom: 142 },
  header: { height: 397, backgroundColor: C.teal, paddingHorizontal: 20, paddingTop: 9 },
  headerTitleRow: { height: 75, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  headerTitle: { color: C.white, fontSize: 30, writingDirection: 'rtl' },
  menu: { position: 'absolute', right: 0, top: 8, width: 55, height: 55, alignItems: 'center', justifyContent: 'center' },
  quickRow: { flex: 1, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 28 },
  quick: { width: '31.5%', alignItems: 'center' },
  circle: { borderWidth: 1.5, borderColor: C.gold, alignItems: 'center', justifyContent: 'center' },
  quickText: { color: C.white, fontSize: 20, lineHeight: 31, textAlign: 'center', marginTop: 17, writingDirection: 'rtl' },
  grid: { marginTop: 26, flexDirection: 'row-reverse', flexWrap: 'wrap' },
  service: { borderWidth: 0.65, borderColor: C.border, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', padding: 9 },
  serviceText: { color: C.black, fontSize: 18, lineHeight: 28, textAlign: 'center', marginTop: 17, writingDirection: 'rtl' },
  iconBox: { width: 76, height: 68, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  phoneArrow: { position: 'absolute', top: 18, left: 25 },
  cashArrow: { position: 'absolute', bottom: 0, left: 25 },
  check: { position: 'absolute', bottom: 0, right: 5, backgroundColor: C.white },
  gimtel: { width: 90, height: 90, borderRadius: 45, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' },
  gimtelG: { color: C.white, fontSize: 54, fontWeight: '700' },
  nav: { position: 'absolute', left: 0, right: 0, bottom: Platform.OS === 'android' ? 48 : 0, height: 94, paddingVertical: 7, backgroundColor: C.white, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E4E4E4', flexDirection: 'row-reverse' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  navText: { color: C.gray, fontSize: 14, lineHeight: 22, writingDirection: 'rtl' },
  placeholder: { flex: 1, backgroundColor: C.white, paddingBottom: 142 },
  placeholderHead: { height: 75, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' },
  placeholderHeadText: { color: C.white, fontSize: 25, writingDirection: 'rtl' },
  placeholderBody: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderTitle: { color: C.black, fontSize: 23, marginTop: 14, writingDirection: 'rtl' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.28)', alignItems: 'flex-end' },
  drawer: { width: '80%', maxWidth: 360, height: '100%', backgroundColor: C.white, paddingTop: Platform.OS === 'android' ? 38 : 55, paddingHorizontal: 22 },
  drawerLogo: { width: '100%', height: 170, marginBottom: 8 },
  drawerRow: { minHeight: 58, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E6E6E6', flexDirection: 'row-reverse', alignItems: 'center' },
  drawerText: { flex: 1, color: C.black, fontSize: 17, textAlign: 'right', writingDirection: 'rtl' },
  logout: { minHeight: 64, flexDirection: 'row-reverse', alignItems: 'center', gap: 9 },
  logoutText: { color: '#C43C44', fontSize: 17, writingDirection: 'rtl' },
});
