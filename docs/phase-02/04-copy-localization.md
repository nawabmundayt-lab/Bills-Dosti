# 🌐 Copy & Localization Guide (en / ur / hi)

> **Phase 2 deliverable · v1.0** — key strings for MVP + RTL rules. Full string table lives in `messages/*.json` from Phase 3.

## RTL / script rules

1. **Urdu UI = RTL** (`dir="rtl"`). Hindi/English = LTR.
2. **Numbers & currency always LTR** — `unicode-bidi: plaintext` on amount strings: `Rs 1,500` renders correctly inside Urdu sentences.
3. Urdu **body text ≥ 16px** (Nastaliq is unreadable smaller); headings can use Nastaliq, UI labels use Naskh.
4. **Icons that imply direction** (chevrons, arrows) flip in RTL. Money, phone, camera icons do not.
5. Never mix Urdu & Hindi in one string; gender-neutral Urdu phrasing (आप/آپ forms) to avoid masculine-default.

## Key strings

| Key | English | اردو | हिंदी |
|---|---|---|---|
| app.tagline | Split bills with friends — without the awkwardness | دوستوں کے ساتھ حساب، بنا جھنجھٹ | दोस्तों के साथ हिसाब, बिना झंझट |
| auth.loginTitle | Enter your phone number | اپنا فون نمبر درج کریں | अपना फ़ोन नंबर डालें |
| auth.otpSent | We sent a 4-digit code to | ہم نے ۴ عددی کوڈ بھیجا ہے | हमने 4 अंकों का कोड भेजा है |
| auth.resend | Resend in {s}s | دوبارہ بھیجیں {s}س | {s} में फिर भेजें |
| home.greeting | Assalam-o-Alaikum, {name} 👋 | السلام علیکم، {name} 👋 | नमस्ते, {name} 👋 |
| home.youOwe | You owe | آپ نے ادا کرنا ہے | आपको देना है |
| home.youAreOwed | You're owed | آپ کو ملنا ہے | आपको मिलना है |
| home.settleUp | Settle up | تصفیہ کریں | सेटल करें |
| expense.add | Add expense | خرچہ شامل کریں | खर्चा जोड़ें |
| expense.equal | Split equally | برابر تقسیم | बराबर बाँटें |
| expense.percent | By percent | فیصد کے مطابق | प्रतिशत से |
| expense.shares | By shares | حصوں کے مطابق | हिस्सों से |
| expense.exact | Exact amounts | طے شدہ رقم | तय राशि |
| expense.paidBy | Paid by | ادا کیا | भुगतान किया |
| group.invite | Invite friends | دوستوں کو شامل کریں | दोस्तों को जोड़ें |
| group.joined | {name} joined via link 🎉 | {name} لنک سے شامل ہوئے 🎉 | {name} लिंक से जुड़े 🎉 |
| settle.title | Settle with {name} | {name} سے تصفیہ | {name} से सेटल करें |
| settle.youOweX | You owe {name} {amount} | آپ {name} کو {amount} دیتے ہیں | आप {name} को {amount} दें |
| settle.payNow | Pay Now 💚 | ابھی ادا کریں 💚 | अभी भुगतान करें 💚 |
| settle.safeNote | Money goes bank-to-bank. We never touch it. | رقم بینک سے بینک جاتی ہے۔ ہم اسے ہاتھ نہیں لگاتے | पैसा बैंक-से-बैंक जाता है। हम उसे नहीं छूते |
| settle.paidWaiting | Payment sent! Waiting for {name} to confirm | ادائیگی ہو گئی! {name} کی تصدیق کا انتظار | भुगतान भेज दिया! {name} की पुष्टि का इंतज़ार |
| settle.confirmReceived | {name} paid you {amount} — confirm? | {name} نے {amount} ادا کیا — تصدیق کریں؟ | {name} ने {amount} दिया — पुष्टि करें? |
| status.settled | Settled ✓ | تصفیہ شدہ ✓ | सेटल ✓ |
| notif.newExpense | {name} added "{title}" | {name} نے "{title}" شامل کیا | {name} ने "{title}" जोड़ा |
| notif.paymentConfirmed | {name} confirmed your payment | {name} نے آپ کی ادائیگی تصدیق کی | {name} ने आपका भुगतान पुष्ट किया |
| pwa.install | Install BillSplit Dost — works offline | انسٹال کریں — آف لائن بھی چلے گا | इंस्टॉल करें — ऑफ़लाइन भी चलेगा |
| pwa.update | New version ready — tap to refresh | نیا ورژن تیار ہے — ریفریش کریں | नया वर्शन तैयार — रिफ़्रेश करें |
| pwa.offline | You're offline — new expenses will sync later | آپ آف لائن ہیں — خرچے بعد میں سنک ہوں گے | आप ऑफ़लाइन हैं — खर्चे बाद में सिंक होंगे |
| pro.title | BillSplit Dost Pro | بل سپلٹ دوست پرو | बिलस्प्लिट दोस्त प्रो |
| pro.price | Rs 299/month · ₹299/month | ۲۹۹ روپے ماہانہ | ₹299 प्रति माह |

## Tone rules

- Friendly, not transactional: "Chai pe hisaab karo ☕" as empty-state flair.
- Never guilt-trip debtors ("you still owe…" → neutral "You owe").
- Settlement language reassures safety ("bank-to-bank", "we never touch it") — this is our trust wedge.
- Keep buttons ≤ 3 words. Use actions, not nouns ("Add expense", not "Expense creation").
