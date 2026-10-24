import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const router = express.Router();

// Generate Official NUCA Government Memo (Deterministic & Rule-Based)
router.post(['/memo/generate', '/ai/draft-memo'], (req: Request, res: Response) => {
  try {
    const { 
      memoType = 'مذكرة عرض على رئيس الجهاز',
      projectOrTopic = 'مشروعات سكن لكل المصريين',
      recipient = 'السيد المهندس / رئيس جهاز تنمية مدينة حدائق العاصمة',
      details = 'ملاحظات المرور الميداني الدوري',
      keyPoints = 'الالتزام بالجدول الزمني، تطبيق الغرامات، التنسيق الأمني',
      urgency = 'عاجل وهام',
      legalBasis = 'قانون تنظيم التعاقدات الحكومية رقم 182 لسنة 2018 وكراسة الشروط والمواصفات'
    } = req.body;

    const todayDate = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedMemo = `جمهورية مصر العربية
وزارة الإسكان والمرافق والمجتمعات العمرانية
هيئة المجتمعات العمرانية الجديدة
جهاز تنمية مدينة حدائق العاصمة
مكتب معاون رئيس الجهاز

التاريخ: ${todayDate}
درجة الأهمية: [ ${urgency} ]
نوع المحرر: ${memoType}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${recipient}
تحية طيبة وبعد،،،

الموضوع: ${projectOrTopic}

نتشرف بالإحاطة بأنه تنفيذاً لتوجيهات سيادتكم الكريمة بالمتابعة الميدانية الدورية والمستمرة لكافة المشروعات ومعدلات الأداء بمدينة حدائق العاصمة:

أولاً: الوقائع والملاحظات الفنية المرصودة:
${details}

ثانياً: السند الفني واللائحي:
- الاستناد إلى: ${legalBasis}.
- أحكام كراسة الشروط والمواصفات الفنية المعتمدة للمشروع.
- البرنامج الزمني الحرج المعتمد لتسليم الوحدات والمرافق للمواطنين دون تأخير.

ثالثاً: التوصيات والإجراءات التنفيذية المقترحة:
1. التنبيه المشدد على الشركة المنفذة واستشاري المشروع بتلافي كافة الملاحظات المبينة بعاليه فورياً.
2. ${keyPoints}.
3. في حال عدم الالتزام خلال المهلة المحددة، يُفعّل تطبيق الجزاءات المنصوص عليها بالقانون وسحب الأعمال على حساب الشركة مع مصادرة التأمين النهائي.

والأمر معروض على سيادتكم للتفضل بالنظر والتوجيه بما ترونه سيادتكم مناسباً،،،

وتفضلوا بقبول فائق الاحترام والتقدير والاعتزاز،،،

معاون رئيس جهاز تنمية مدينة حدائق العاصمة
( التوقيع: ........................................ )

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تأشيرة السيد المهندس / رئيس الجهاز:
[  ] يُعتمد ويُحال للإدارة الهندسية والشؤون القانونية فوراً للتنفيذ.
[  ] تشكيل لجنة معاينة عاجلة برئاسة معاون رئيس الجهاز لتقديم تقرير خلال 48 ساعة.
[  ] توجيه إنذار رسمي مسجل بعلم الوصول وتطبيق الغرامات المقررة.

توقيع رئيس الجهاز: ........................................`;

    res.json({
      success: true,
      result: formattedMemo,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'حدث خطأ أثناء إعداد المذكرة الرسمية',
    });
  }
});

// Technical Evaluation of Field Inspection (Deterministic Engineering Calculations)
router.post(['/inspection/evaluate', '/ai/analyze-inspection'], (req: Request, res: Response) => {
  try {
    const { 
      siteName = 'الموقع العام', 
      contractor = 'الشركة المنفذة', 
      plannedPercent = 75, 
      actualPercent = 70, 
      observations = '', 
      delaysReason = '' 
    } = req.body;

    const planned = Number(plannedPercent) || 0;
    const actual = Number(actualPercent) || 0;
    const gap = planned - actual;

    let evaluation = '';
    let severityLevel = 'منخفض';
    let suggestedDirective = '';

    if (gap > 15) {
      severityLevel = 'حرج جداً (فجوة زمنية جسيمة)';
      suggestedDirective = 'توجيه إنذار رسمي أول للمقاول طبقاً للمادة 79 من قانون 182/2018 لسحب الأعمال، مع وقف صرف المستخلص الجاري وإلزام الشركة بتقديم برنامج زمني مضغوط خلال 72 ساعة.';
    } else if (gap > 5) {
      severityLevel = 'متوسط إلى مرتفع (تأخير يتطلب التدخل)';
      suggestedDirective = 'إلزام المقاول بالعمل بنظام الورديات الإضافية (Double Shift) وتكثيف التوريدات تحت إشراف الاستشاري مع توجيه لفت نظر رسمي.';
    } else if (gap >= 0) {
      severityLevel = 'طبيعي ومقبول هندسياً';
      suggestedDirective = 'مواصلة المتابعة اليومية مع التأكيد على جودة بنود التشطيبات واختبارات ضغط شبكات المرافق قبل الردم.';
    } else {
      severityLevel = 'متقدم عن الجدول الزمني';
      suggestedDirective = 'تسجيل إشادة بمعدل الإنجاز والتنسيق مع لجان الاستلام الابتدائي للبدء في إجراءات الفحص الدوري.';
    }

    const report = `📊 التقييم الفني والهندسي للموقع: [ ${siteName} ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• الشركة المنفذة: ${contractor}
• نسبة الإنجاز المخططة: ${planned}% | الفعلية: ${actual}% (الفارق الزمني: ${gap > 0 ? '-' + gap + '%' : '+' + Math.abs(gap) + '%'})
• مستوى المخاطر التعاقدية: ${severityLevel}

🔍 تحليل الأسباب والملاحظات المرصودة:
- الملاحظات الميدانية: ${observations || 'لا توجد ملاحظات حرجة'}
- مبررات التأخير المقدمة: ${delaysReason || 'ملاحظات جودة اعتيادية وتنسيق توريدات'}

📌 القرار الإداري والتوجيه الفوري لمعاون رئيس الجهاز:
1. ${suggestedDirective}
2. إلزام استشاري الموقع بتقديم تقرير مطابقة أسبوعي موقع ومختوم.
3. التفتيش على معايير السلامة والصحة المهنية وتأمين مسار المعدات والعمال بالموقع.`;

    res.json({
      success: true,
      analysis: report,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'فشل في تقييم الجولة الميدانية',
    });
  }
});

// Legal & Engineering Knowledgebase Navigator
router.post(['/legal/query', '/ai/legal-advisor'], (req: Request, res: Response) => {
  try {
    const { question = '', topicCategory = 'عام' } = req.body;

    const answer = `السند القانوني المعتمد وفقاً لقوانين هيئة المجتمعات العمرانية الجديدة:
• قانون تنظيم التعاقدات العامة رقم 182 لسنة 2018 (المواد 48 و 53 و 79).
• قانون البناء رقم 119 لسنة 2008 وتعديلاته ولائحته التنفيذية.
• اللائحة العقارية لهيئة المجتمعات العمرانية الجديدة وضوابط حظر تغيير النشاط.

الإجراء التنفيذي المطلوب من معاون رئيس الجهاز:
1. إعداد محضر إثبات حالة فني بمشاركة الإدارة الهندسية واستشاري الموقع.
2. توجيه إخطار رسمي للمخالف أو المقاول بمهلة قانونية محددة.
3. العرض بمذكرة رسمية على السيد المهندس رئيس الجهاز للمصادقة على القرار الإداري الحاسم (إيقاف أعمال، إزالة فورية بالتنسيق مع شرطة التعمير، أو فرض غرامات التأخير).

الموضوع: ${topicCategory}
الاستفسار: ${question}`;

    res.json({
      success: true,
      answer,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'حدث خطأ أثناء استرجاع السند القانوني',
    });
  }
});

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    authority: 'جهاز تنمية مدينة حدائق العاصمة',
    role: 'مكتب معاون رئيس الجهاز',
    mode: 'deterministic-offline-ready',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', router);
app.use('/', router);

export default app;
