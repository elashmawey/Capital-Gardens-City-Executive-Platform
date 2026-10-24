import React, { useState, useEffect } from 'react';
import { OfficialMemoRecord, PriorityLevel } from '../types';
import { OfficialPrintHeader } from './OfficialPrintHeader';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Trash2, 
  Archive, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface OfficialMemoDrafterProps {
  memos: OfficialMemoRecord[];
  onSaveMemo: (memo: OfficialMemoRecord) => void;
  onDeleteMemo: (id: string) => void;
  prefillData?: {
    memoType?: string;
    topic?: string;
    details?: string;
  } | null;
}

interface MemoTemplate {
  title: string;
  type: string;
  recipient: string;
  topic: string;
  legalBasis: string;
  details: string;
  recommendations: string[];
}

const PRESET_TEMPLATES: MemoTemplate[] = [
  {
    title: 'مذكرة عرض على رئيس الجهاز بشأن جولة ميدانية',
    type: 'مذكرة عرض على رئيس الجهاز',
    recipient: 'السيد المهندس / رئيس جهاز تنمية مدينة حدائق العاصمة',
    topic: 'بشأن نتائج المرور الميداني الدوري على مشروعات سكن لكل المصريين ومحاور المرافق',
    legalBasis: 'توجيهات رئاسة الجهاز وكراسة الشروط والمواصفات الفنية المعتمدة للمشروع',
    details: 'أثناء المرور الميداني اليوم على مواقع العمل والإنشاءات، تلاحظ وجود بطء في وتيرة تشطيب الواجهات لبعض العمارات، وتراكم مخلفات هدم تعيق أعمال تمهيد الطرق، مع نقص في عدد العمالة الفنية المتخصصة.',
    recommendations: [
      'توجيه إنذار مشدد للشركة المنفذة بمهلة 48 ساعة لتكثيف التواجد بالموقع.',
      'إلزام الاستشاري المشرف بتقديم تقرير مطابقة جودة أسبوعي قبل صرف المستخلص الجاري.',
      'رفع مخلفات التشوين على نفقة المقاول الخاصة في حال عدم الالتزام الفوري.',
    ],
  },
  {
    title: 'إنذار رسمي لمقاول متقاعس بسحب الأعمال ومصادرة الضمان',
    type: 'خطاب إنذار رسمي وسحب أعمال',
    recipient: 'السيد المهندس / رئيس مجلس إدارة الشركة المنفذة للمشروع',
    topic: 'إنذار قانوني نهائي لتجاوز البرنامج الزمني المعتمد لنهو الأعمال التعاقدية',
    legalBasis: 'المادتان 79 و 80 من قانون تنظيم التعاقدات العامة رقم 182 لسنة 2018 ولائحته التنفيذية',
    details: 'بالإشارة إلى العقد المبرم معكم وإلى المعاينات الميدانية وتقارير الاستشاري المشرف، تبين انخفاض نسبة الإنجاز الفعلي عن المخطط بفارق جسيم، وعدم التزامكم بتوفير المعدات والعمالة المنصوص عليها بالعقد.',
    recommendations: [
      'نخطركم رسمياً بمنحكم مهلة نهائية أقصاها (خمسة عشر يوماً) لتدارك التأخير ورفع معدلات التنفيذ.',
      'في حال انقضاء المهلة دون تحقيق المستهدف، سيتم سحب الأعمال فوراً والتنفيذ على حسابكم ومصادرة خطاب الضمان النهائي.',
      'تطبيق غرامات التأخير المقررة قانوناً بنسبة تصل إلى 10% دون الحاجة إلى إنذار قضائي إضافي.',
    ],
  },
  {
    title: 'مذكرة استصدار قرار إزالة فورية بالتنسيق مع شرطة التعمير',
    type: 'مذكرة استصدار قرار إزالة ومحضر مخالفة',
    recipient: 'السيد المهندس / رئيس جهاز تنمية مدينة حدائق العاصمة',
    topic: 'استصدار قرار إزالة فورية لمخالفة بناء وتعدي وغلق ردود بدون ترخيص',
    legalBasis: 'أحكام قانون البناء الموحد رقم 119 لسنة 2008 وتعديلاته واللائحة العقارية لهيئة المجتمعات العمرانية الجديدة',
    details: 'بناءً على البلاغات والمعاينة الميدانية لإدارة التنمية ورئاسة الحي، تم ضبط أعمال بناء مخالفة بدون ترخيص متمثلة في صب قواعد وغلق ردود في أحد القطاعات بالمخالفة للاشتراطات التخطيطية للمدينة.',
    recommendations: [
      'التفضل بالموافقة على استصدار قرار إزالة فورية في المهد للمخالفة المذكورة.',
      'إحالة القرار لشرطة التعمير والإدارة المختصة بالجهاز لتنفيذ الإزالة بالقوة الجبرية وضبط الأدوات.',
      'تحميل المخالف كافة مصاريف الإزالة واتخاذ الإجراءات القانونية اللازمة.',
    ],
  },
  {
    title: 'تقرير إفادة ومتابعة موجه لهيئة المجتمعات العمرانية الجديدة',
    type: 'خطاب إفادة ومتابعة للهيئة',
    recipient: 'السيد المهندس / نائب رئيس الهيئة لقطاع التنمية وتطوير المدن',
    topic: 'الموقف التنفيذي لمشروعات الإسكان الأخضر والمبادرات الرئاسية بالمدينة',
    legalBasis: 'الخطة الاستثمارية السنوية لهيئة المجتمعات العمرانية الجديدة',
    details: 'نتشرف بإحاطة سيادتكم علماً بالموقف التنفيذي للمرحلة الجارية، حيث اكتملت أعمال الهيكل الخرساني بنسبة 100%، وتجري أعمال الشبكات الداخلية والمحطات السطحية تمهيداً لبدء لجان الاستلام الابتدائي.',
    recommendations: [
      'التنسيق مع قطاع المرافق بالهيئة لسرعة ربط محطة الصرف الصحي الرئيسية.',
      'تحديد موعد لزيارة وفد الهيئة لتفقد جاهزية العمارات للتسليم.',
    ],
  },
  {
    title: 'مذكرة تشكيل لجنة استلام فني (ابتدائي / نهائي)',
    type: 'مذكرة تشكيل لجنة استلام',
    recipient: 'السيد المهندس / رئيس جهاز تنمية مدينة حدائق العاصمة',
    topic: 'طلب تشكيل لجنة المعاينة والاستلام الابتدائي لعدد من العمارات والمرافق',
    legalBasis: 'أحكام كراسة الشروط والمادة 81 من اللائحة التنفيذية لقانون 182 لسنة 2018',
    details: 'أفادت الشركة المنفذة بخطابها بانتهاء الأعمال التعاقدية للمشروع، وأكد المهندس الاستشاري المشرف جاهزية الموقع للفحص الفني وإجراء تجارب التشغيل وضغوط الشبكات.',
    recommendations: [
      'التفضل بالموافقة على تشكيل لجنة الاستلام الابتدائي برئاسة معاون رئيس الجهاز وعضوية الإدارات المعنية.',
      'تحديد موعد بدء أعمال اللجنة وتحرير المحضر الرسمي للعرض على سيادتكم للاعتماد.',
    ],
  },
];

export const AiMemoDrafter: React.FC<OfficialMemoDrafterProps> = ({
  memos,
  onSaveMemo,
  onDeleteMemo,
  prefillData,
}) => {
  const [activeTab, setActiveTab] = useState<'draft' | 'archive'>('draft');
  const [memoType, setMemoType] = useState('مذكرة عرض على رئيس الجهاز');
  const [recipient, setRecipient] = useState('السيد المهندس / رئيس جهاز تنمية مدينة حدائق العاصمة');
  const [projectOrTopic, setProjectOrTopic] = useState('');
  const [legalBasis, setLegalBasis] = useState('قانون تنظيم التعاقدات رقم 182 لسنة 2018 وكراسة الشروط والمواصفات');
  const [details, setDetails] = useState('');
  const [keyPoints, setKeyPoints] = useState('الالتزام بالجداول الزمنية، تطبيق الجزاءات، التنسيق مع الإدارات المعنية');
  const [urgency, setUrgency] = useState<PriorityLevel>('عالي');

  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync prefillData if triggered from outside
  useEffect(() => {
    if (prefillData) {
      if (prefillData.memoType) setMemoType(prefillData.memoType);
      if (prefillData.topic) setProjectOrTopic(prefillData.topic);
      if (prefillData.details) setDetails(prefillData.details);
      setActiveTab('draft');
    }
  }, [prefillData]);

  // Apply template
  const applyTemplate = (tpl: MemoTemplate) => {
    setMemoType(tpl.type);
    setRecipient(tpl.recipient);
    setProjectOrTopic(tpl.topic);
    setLegalBasis(tpl.legalBasis);
    setDetails(tpl.details);
    setKeyPoints(tpl.recommendations.join('\n'));
  };

  // Generate memo deterministically
  const handleGenerate = () => {
    if (!projectOrTopic.trim() || !details.trim()) {
      alert('يرجى كتابة الموضوع والوقائع أو اختيار أحد النماذج الجاهزة أولاً.');
      return;
    }

    setSavedSuccess(false);

    const todayDate = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const parsedRecommendations = keyPoints
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item, idx) => `${idx + 1}. ${item}`)
      .join('\n');

    const formattedOutput = `جمهورية مصر العربية
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

نتشرف بالإحاطة بأنه تنفيذاً لتوجيهات سيادتكم الكريمة بالمتابعة الميدانية الدورية والمستمرة لمشروعات وأعمال التطوير بمدينة حدائق العاصمة:

أولاً: الوقائع والملاحظات الفنية المرصودة:
${details}

ثانياً: السند الفني واللائحي:
• الاستناد إلى: ${legalBasis}
• كراسة الشروط والمواصفات وأحكام البرنامج الزمني الحرج المعتمد.
• الالتزام بمعايير الجودة المعتمدة بالهيئة دون أي إخلال بحقوق الجهاز.

ثالثاً: التوصيات والإجراءات التنفيذية المعروضة للمصادقة:
${parsedRecommendations || '1. التنبيه المشدد على الجهات المعنية بالالتزام الفوري.\n2. تطبيق الغرامات والجزاءات المقررة قانوناً.'}

والأمر معروض على سيادتكم للتفضل بالنظر والتوجيه بما ترونه سيادتكم مناسباً،،،

وتفضلوا بقبول فائق الاحترام والتقدير والاعتزاز،،،

معاون رئيس جهاز تنمية مدينة حدائق العاصمة
( التوقيع: ........................................ )

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تأشيرة السيد المهندس / رئيس جهاز تنمية مدينة حدائق العاصمة:
[  ] يُعتمد ويُحال فوراً للإدارات المعنية والشؤون القانونية للتنفيذ.
[  ] تشكيل لجنة معاينة برئاسة معاون رئيس الجهاز وموافاتنا بتقرير خلال 48 ساعة.
[  ] توجيه إنذار رسمي مسجل بعلم الوصول وتطبيق الغرامات التعاقدية.

توقيع رئيس الجهاز: ........................................`;

    setGeneratedText(formattedOutput);
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Print memo
  const handlePrint = () => {
    window.print();
  };

  // Save to archive
  const handleSaveToArchive = () => {
    if (!generatedText.trim()) return;

    const newRecord: OfficialMemoRecord = {
      id: `memo-${Date.now()}`,
      memoNo: `م-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      type: memoType,
      subject: projectOrTopic || 'مذكرة رسمية بدون عنوان',
      recipient,
      content: generatedText,
      urgency,
    };

    onSaveMemo(newRecord);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-white border border-slate-200 p-5 rounded-none shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-50 text-emerald-800">
                <FileText className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">صائغ المذكرات والمكاتبات الحكومية الرسمية</h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              صياغة فورية ومنضبطة لمذكرات العرض، خطابات الإنذار، وتقارير الإزالة طبقاً للوائح هيئة المجتمعات العمرانية الجديدة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'draft'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              محرر المذكرات الجديد
            </button>
            <button
              onClick={() => setActiveTab('archive')}
              className={`px-4 py-2 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'archive'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Archive className="w-4 h-4" />
              أرشيف المذكرات ({memos.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'draft' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form & Preset Templates Column */}
          <div className="lg:col-span-5 space-y-5 no-print">
            {/* Quick Templates Drawer */}
            <div className="bg-white border border-slate-200 p-4 rounded-none shadow-xs">
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
                <BookOpen className="w-4 h-4 text-emerald-800" />
                <h3 className="text-xs font-bold text-slate-900">قوالب الصياغة الحكومية الجاهزة</h3>
              </div>
              <div className="space-y-2">
                {PRESET_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(tpl)}
                    className="w-full text-right p-2.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 text-xs text-slate-800 transition-all cursor-pointer block"
                  >
                    <div className="font-semibold text-emerald-900">{tpl.title}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{tpl.topic}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Editor Input Fields */}
            <div className="bg-white border border-slate-200 p-5 rounded-none shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
                بيانات وعناصر المذكرة
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">نوع المحرر الحكومي</label>
                <select
                  value={memoType}
                  onChange={(e) => setMemoType(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 focus:outline-emerald-600 bg-white"
                >
                  <option value="مذكرة عرض على رئيس الجهاز">مذكرة عرض على رئيس الجهاز</option>
                  <option value="خطاب إنذار رسمي وسحب أعمال">خطاب إنذار رسمي وسحب أعمال</option>
                  <option value="مذكرة استصدار قرار إزالة ومحضر مخالفة">مذكرة استصدار قرار إزالة ومحضر مخالفة</option>
                  <option value="خطاب إفادة ومتابعة للهيئة">خطاب إفادة ومتابعة للهيئة (NUCA)</option>
                  <option value="مذكرة تشكيل لجنة استلام">مذكرة تشكيل لجنة استلام فني</option>
                  <option value="محضر تنسيق تنفيذي وأمني">محضر تنسيق تنفيذي وأمني مع شرطة التعمير</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الموجه إليه</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="مثال: السيد المهندس / رئيس جهاز تنمية مدينة حدائق العاصمة"
                  className="w-full text-xs p-2.5 border border-slate-300 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">موضوع المذكرة / المشروع</label>
                <input
                  type="text"
                  value={projectOrTopic}
                  onChange={(e) => setProjectOrTopic(e.target.value)}
                  placeholder="مثال: نتائج المرور على عمارات الإسكان الاجتماعي واللاندسكيب"
                  className="w-full text-xs p-2.5 border border-slate-300 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">السند القانوني واللائحي</label>
                <input
                  type="text"
                  value={legalBasis}
                  onChange={(e) => setLegalBasis(e.target.value)}
                  placeholder="مثال: قانون رقم 182 لسنة 2018 وقانون البناء 119 لسنة 2008"
                  className="w-full text-xs p-2.5 border border-slate-300 focus:outline-emerald-600 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الوقائع والملاحظات الفنية المرصودة</label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="اكتب تفاصيل المعاينة والملاحظات ومواقع القصور بدقة..."
                  className="w-full text-xs p-2.5 border border-slate-300 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  التوصيات والإجراءات المقترحة (سطر لكل توصية)
                </label>
                <textarea
                  rows={3}
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  placeholder="1. توجيه إنذار رسمي للمقاول&#10;2. تطبيق غرامة التأخير&#10;3. التنسيق مع الإدارة العقارية"
                  className="w-full text-xs p-2.5 border border-slate-300 focus:outline-emerald-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">درجة الأهمية</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as PriorityLevel)}
                  className="w-full text-xs p-2.5 border border-slate-300 focus:outline-emerald-600 bg-white"
                >
                  <option value="عاجل جداً">عاجل جداً</option>
                  <option value="عاجل وهام">عاجل وهام</option>
                  <option value="عادي">عادي</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4" />
                توليد وصياغة المذكرة الرسمية فوراً
              </button>
            </div>
          </div>

          {/* Generated Memo Preview Column */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 p-6 rounded-none shadow-xs min-h-[580px] flex flex-col justify-between">
              <div>
                {/* Print and Actions Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200 no-print">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-700"></span>
                    <h3 className="text-xs font-bold text-slate-900">المعاينة النهائية للصياغة الرسمية</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      disabled={!generatedText}
                      className="px-3 py-1.5 text-xs font-semibold border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'تم النسخ' : 'نسخ النص'}
                    </button>
                    <button
                      onClick={handlePrint}
                      disabled={!generatedText}
                      className="px-3 py-1.5 text-xs font-semibold border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      طباعة فورية A4
                    </button>
                    <button
                      onClick={handleSaveToArchive}
                      disabled={!generatedText}
                      className="px-4 py-1.5 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      حفظ بالأرشيف
                    </button>
                  </div>
                </div>

                {savedSuccess && (
                  <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700" />
                    تم حفظ المذكرة بنجاح في أرشيف مكاتبات معاون رئيس الجهاز.
                  </div>
                )}

                {/* Printable Official Header (renders for print and preview) */}
                <OfficialPrintHeader
                  documentTitle={`${memoType} - موضوع: ${projectOrTopic || 'متابعة مشروعات حدائق العاصمة'}`}
                  serialNumber={`MEMO-${Date.now().toString().slice(-6)}`}
                />

                {/* Text Content / Editor Area */}
                {generatedText ? (
                  <div className="mt-4">
                    <textarea
                      value={generatedText}
                      onChange={(e) => setGeneratedText(e.target.value)}
                      rows={19}
                      className="w-full text-xs font-mono p-4 bg-slate-50/70 border border-slate-200 text-slate-900 leading-relaxed focus:bg-white focus:outline-emerald-600 resize-y"
                    />
                    <div className="text-[11px] text-slate-400 mt-1 text-left no-print">
                      * يمكنك تعديل أي نص مباشرة داخل المربع أعلاه قبل الحفظ أو الطباعة.
                    </div>
                  </div>
                ) : (
                  <div className="py-24 text-center text-slate-400 border border-dashed border-slate-200 mt-4">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-medium text-slate-600">لم يتم توليد المذكرة بعد</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                      اختر نموذجاً جاهزاً من القائمة أو املأ عناصر المذكرة واضغط على زر الصياغة الفورية لتظهر المذكرة بالصيغة الحكومية المعتمدة هنا.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Archive Tab */
        <div className="bg-white border border-slate-200 p-6 rounded-none shadow-xs no-print">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">سجل وأرشيف المذكرات الرسمية الصادرة</h3>
            <span className="text-xs text-slate-500 font-mono">العدد: {memos.length}</span>
          </div>

          {memos.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Archive className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-medium text-slate-600">الأرشيف فارغ حالياً</p>
              <p className="text-[11px] text-slate-400 mt-1">
                أي مذكرات يتم صياغتها وحفظها ستظهر هنا للرجوع إليها وإعادة طباعتها في أي وقت.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {memos.map((item) => (
                <div key={item.id} className="p-4 border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-900">
                        {item.type}
                      </span>
                      <span className="text-xs font-mono text-slate-500">{item.date}</span>
                      <span className="text-xs text-slate-400">|</span>
                      <span className="text-xs font-mono text-slate-700">{item.memoNo}</span>
                      <span className="text-xs text-slate-400">|</span>
                      <span className="text-xs text-slate-600">{item.recipient}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{item.subject}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl font-mono text-[11px]">
                      {item.content.slice(0, 160)}...
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setGeneratedText(item.content);
                        setProjectOrTopic(item.subject);
                        setRecipient(item.recipient);
                        setMemoType(item.type);
                        setUrgency(item.urgency);
                        setActiveTab('draft');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 cursor-pointer flex items-center gap-1"
                    >
                      فتح بالمحرر
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMemo(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      title="حذف من الأرشيف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
