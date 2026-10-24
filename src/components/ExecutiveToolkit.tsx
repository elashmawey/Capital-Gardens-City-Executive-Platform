import React, { useState } from 'react';
import { ProjectItem, CitizenComplaint, FieldInspection } from '../types';
import { 
  Calculator, 
  Scale, 
  FileSpreadsheet, 
  AlertTriangle, 
  Download, 
  HelpCircle, 
  Search,
  BookOpen,
  Copy,
  Check
} from 'lucide-react';

interface ExecutiveToolkitProps {
  projects: ProjectItem[];
  complaints: CitizenComplaint[];
  inspections: FieldInspection[];
  onDraftMemo: (prefill: { memoType: string; topic: string; details: string }) => void;
}

interface LegalReference {
  id: string;
  category: string;
  title: string;
  lawReference: string;
  summary: string;
  procedures: string[];
  recommendedDecisionText: string;
}

const LEGAL_KNOWLEDGEBASE: LegalReference[] = [
  {
    id: 'contract-withdrawal',
    category: 'إجراءات سحب الأعمال وغرامات التأخير',
    title: 'الإجراءات القانونية لسحب الأعمال من مقاول متقاعس ومصادرة خطاب الضمان',
    lawReference: 'المادتان 79 و 80 من قانون تنظيم التعاقدات الحكومية رقم 182 لسنة 2018 ولائحته التنفيذية',
    summary: 'يحق لجهاز تنمية مدينة حدائق العاصمة فسخ العقد أو سحب الأعمال والتنفيذ على حساب المقاول عند التأخر الجسيم في البرنامج الزمني أو الإخلال باشتراطات الكراسة.',
    procedures: [
      'إعداد مذكرة فنية مشتركة من المهندس الاستشاري المشرف ومعاون رئيس الجهاز توضح الفارق الزمني ومظاهر التقاعس بالموقع.',
      'توجيه إنذار رسمي مسجل بعلم الوصول للشركة المنفذة بمنحها مهلة قانونية مدتها (15 يوماً) لتدارك التأخير ورفع معدلات الإنجاز.',
      'في حال انقضاء المهلة دون تحقيق المستهدف، تُرفع مذكرة عاجلة لرئيس الجهاز لإصدار قرار سحب الأعمال.',
      'تسييل خطاب الضمان النهائي (التأمين النهائي) فوراً ومصادرته لصالح جهاز المدينة دون الحاجة لحكم قضائي.',
      'إجراء حصر وجرد ميداني لكافة الأعمال المنفذة والتشوينات بحضور مندوب المقاول أو إثبات امتناعه بمحضر رسمي.',
      'إسناد استكمال المشروع لشركة أخرى على حساب المقاول المقصر مع تحميله فروق الأسعار و 10% مصاريف إدارية.',
    ],
    recommendedDecisionText: 'بناءً على التقرير الميداني والإنذار الموجه للمقاول، يُقرر سحب الأعمال فوراً من الشركة، ومصادرة خطاب الضمان البنكي النهائي، وتكليف لجنة الجرد برئاسة معاون رئيس الجهاز لإتمام إجراءات الحصر.',
  },
  {
    id: 'delay-penalties',
    category: 'إجراءات سحب الأعمال وغرامات التأخير',
    title: 'قواعد احتساب وتطبيق غرامات التأخير التعاقدية وسقف الخصم القانوني',
    lawReference: 'المادة 48 من قانون تنظيم التعاقدات العامة رقم 182 لسنة 2018',
    summary: 'تُطبق غرامة التأخير فور انقضاء الموعد التعاقدي للمشروع بحكم القانون وبدون الحاجة لإنذار قضائي أو إثبات وقوع ضرر مباشر على الجهاز.',
    procedures: [
      'تُحتسب الغرامة بواقع 1% عن كل أسبوع تأخير أو جزء من الأسبوع عن الفترة التي يتأخر فيها المقاول.',
      'يكون الحد الأقصى لمجموع الغرامة 10% من القيمة الإجمالية للعقد في عقود المقاولات والأشغال العامة، و 3% في عقود التوريدات.',
      'تُخصم الغرامة مباشرة من أي مستحقات للمقاول لدى جهاز المدينة، سواء من المستخلصات الجارية أو التأمين النهائي.',
      'لا يعفي المقاول من الغرامة إلا إذا كان التأخير ناشئاً عن أسباب تعود لجهاز المدينة أو لظروف قهرية معتمدة من السلطة المختصة.',
    ],
    recommendedDecisionText: 'خصم غرامة تأخير تعاقدية من المستخلص الجاري للمقاول بنسبة القانون، وإخطار الإدارة المالية والعقارية بالجهاز لإنفاذ الخصم الفوري.',
  },
  {
    id: 'building-violations',
    category: 'قرارات الإزالة الفورية وضبط تغيير النشاط',
    title: 'ضوابط إيقاف الأعمال والإزالة الفورية لمخالفات البناء وغلق الردود في المهد',
    lawReference: 'المادتان 59 و 60 من قانون البناء رقم 119 لسنة 2008 واللائحة العقارية لهيئة المجتمعات العمرانية',
    summary: 'إلزام أجهزة المدن الجديدة بإزالة التعديات ومخالفات البناء وتغيير النشاط في المهد دون انتظار صدور أحكام قضائية، حمايةً للمظهر الحضاري والتخطيطي.',
    procedures: [
      'رصد المخالفة فوراً بالمعاينة الميدانية وتحرير محضر إثبات حالة بمعرفة مهندسي الحي والتنمية ومكتب معاون رئيس الجهاز.',
      'إصدار قرار إيقاف أعمال وتحريز وضبط الأدوات والمهمات المستخدمة في المخالفة بمخازن الجهاز.',
      'عرض مذكرة عاجلة على السيد المهندس رئيس الجهاز لاستصدار قرار الإزالة الفورية.',
      'التنسيق الفوري مع مدير أمن الجهاز وشرطة التعمير لتنفيذ قرار الإزالة بالقوة الجبرية وهدم المخالفة.',
      'إلزام المخالف بسداد تكاليف ومصاريف الإزالة، مع إخطار إدارة المرافق لقطع المياه والكهرباء عن العقار المخالف.',
    ],
    recommendedDecisionText: 'يُعتمد قرار الإزالة الفورية للمخالفة الموصوفة بالأوراق، وتكلف شرطة التعمير والإدارات المعنية بتنفيذ الهدم فوراً وإعادة الشيء لأصله.',
  },
  {
    id: 'handover-rules',
    category: 'اشتراطات لجان الاستلام الابتدائي والنهائي',
    title: 'إجراءات تشكيل لجان الاستلام الابتدائي ومحاضر التحفظات والاستقطاعات الفنية',
    lawReference: 'المادتان 81 و 82 من اللائحة التنفيذية لقانون 182 لسنة 2018 ودليل إجراءات الهيئة',
    summary: 'تنظيم الاستلام الابتدائي للمشروعات السكنية والمرافق وضمان حجز الاستقطاعات وتأمين الضمان العشري وسلامة التشغيل.',
    procedures: [
      'تقديم المقاول إخطاراً رسمياً بإنهاء كافة الأعمال واستعداد الموقع للمعاينة.',
      'إصدار رئيس الجهاز قراراً بتشكيل لجنة الاستلام برئاسة معاون رئيس الجهاز وعضوية ممثلين عن الإدارة الهندسية والتشغيل والشؤون العقارية.',
      'إجراء الفحص الميداني والاختبارات التشغيلية وضغوط الشبكات والمحطات ومطابقة المواصفات.',
      'تحرير محضر الاستلام الابتدائي الرسمي موضحاً به قائمة الملاحظات غير الجوهرية ومنح مهلة 30 يوماً لتلافيها.',
      'حجز نسبة الاستقطاعات الفنية وتأمين الصيانة لمدة سنة كاملة لحين موعد انعقاد لجنة الاستلام النهائي.',
    ],
    recommendedDecisionText: 'تُعتمد توصيات لجنة الاستلام الابتدائي وتكلف الشركة بتلافي الملاحظات المدونة بالمحضر خلال المهلة المقررة، مع استمرار فترة الضمان التعاقدية.',
  },
  {
    id: 'green-housing',
    category: 'معايير الإسكان الأخضر المصري GPRS',
    title: 'اشتراطات ومعايير الهرم الأخضر المصري بمشروعات سكن لكل المصريين الأخضر',
    lawReference: 'دليل تقييم المباني الخضراء الصادر عن المركز القومي لبحوث الإسكان والبناء وبروتوكول الهيئة',
    summary: 'معايير بيئية وهندسية صارمة لتحقيق الاستدامة، ترشيد الطاقة بنسبة 30%، وتدوير المياه في قطاعات حدائق العاصمة.',
    procedures: [
      'التأكد من مطابقة أعمال عزل الأسطح والحوائط المزدوجة حرارياً لتقليل الأحمال الحرارية داخل الوحدات السكنية.',
      'مراجعة تركيب مصابيح الإنارة الموفرة LED في كافة المرافق ومسارات الحدائق، واستخدام أعمدة إنارة بالطاقة الشمسية.',
      'التفتيش على شبكات الري الحديث (بالتنقيط) واستخدام مياه الصرف المعالجة ثلاثياً في ري المسطحات الخضراء.',
      'التأكد من تنفيذ مسارات مشاة ودراجات معزولة لتشجيع وسائل التنقل النظيف والصديق للبيئة داخل المدينة.',
    ],
    recommendedDecisionText: 'إلزام استشاري ومقاولي المرحلة بتقديم شهادات مطابقة خامات العزل ونظم الطاقة الشمسية للمواصفات الخضراء المعتمدة قبل اعتماد مستخلصات التشطيب.',
  },
];

export const ExecutiveToolkit: React.FC<ExecutiveToolkitProps> = ({
  projects,
  complaints,
  inspections,
  onDraftMemo,
}) => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'advisor' | 'export'>('calculator');

  // Calculator State
  const [contractValue, setContractValue] = useState<number>(50000000);
  const [delayWeeks, setDelayWeeks] = useState<number>(4);
  const [maxCapPercent, setMaxCapPercent] = useState<number>(10);
  const [selectedProjectForCalc, setSelectedProjectForCalc] = useState<string>('');

  // Legal Navigator State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [activeReference, setActiveReference] = useState<LegalReference>(LEGAL_KNOWLEDGEBASE[0]);
  const [copiedDecision, setCopiedDecision] = useState(false);

  // Calculation Logic under Egyptian Law 182 / 2018
  const penaltyPerWeekPercent = 1;
  const rawPenaltyPercent = delayWeeks * penaltyPerWeekPercent;
  const effectivePenaltyPercent = Math.min(rawPenaltyPercent, maxCapPercent);
  const penaltyAmount = (contractValue * effectivePenaltyPercent) / 100;

  // Filtered Legal References
  const categories = ['الكل', ...Array.from(new Set(LEGAL_KNOWLEDGEBASE.map((item) => item.category)))];

  const filteredReferences = LEGAL_KNOWLEDGEBASE.filter((ref) => {
    const matchesCategory = selectedCategory === 'الكل' || ref.category === selectedCategory;
    const matchesQuery = 
      ref.title.includes(searchQuery) || 
      ref.lawReference.includes(searchQuery) || 
      ref.summary.includes(searchQuery);
    return matchesCategory && matchesQuery;
  });

  const handleCopyDecision = () => {
    navigator.clipboard.writeText(activeReference.recommendedDecisionText);
    setCopiedDecision(true);
    setTimeout(() => setCopiedDecision(false), 2000);
  };

  // Export to CSV Helpers
  const exportProjectsCsv = () => {
    const headers = ['اسم المشروع', 'القطاع', 'المقاول', 'الاستشاري', 'الوحدات', 'المخطط %', 'الفعلي %', 'الحالة', 'تاريخ النهو'];
    const rows = projects.map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.sector}"`,
      `"${p.contractor}"`,
      `"${p.consultant}"`,
      p.unitsCount,
      p.plannedPercent,
      p.actualPercent,
      `"${p.status}"`,
      p.contractEndDate,
    ]);
    downloadCsv([headers, ...rows], 'سجل_مشروعات_حدائق_العاصمة');
  };

  const exportComplaintsCsv = () => {
    const headers = ['رقم البلاغ', 'المواطن', 'الهاتف', 'القطاع', 'العمارة', 'نوع الشكوى', 'الحالة', 'تاريخ الاستلام', 'الإجراء المتخذ'];
    const rows = complaints.map((c) => [
      c.ticketNo,
      `"${c.citizenName}"`,
      c.phone,
      `"${c.sector}"`,
      `"${c.buildingNo}"`,
      `"${c.category}"`,
      `"${c.status}"`,
      c.receivedDate,
      `"${(c.actionTaken || '').replace(/"/g, '""')}"`,
    ]);
    downloadCsv([headers, ...rows], 'سجل_شكاوى_المواطنين_حدائق_العاصمة');
  };

  const exportInspectionsCsv = () => {
    const headers = ['تاريخ المرور', 'المشروع', 'القطاع', 'المرافقون', 'التقييم العام', 'الملاحظات المرصودة'];
    const rows = inspections.map((i) => [
      i.date,
      `"${i.projectName}"`,
      `"${i.sector}"`,
      `"${i.accompaniedBy}"`,
      `"${i.generalStatus}"`,
      i.observations.length,
    ]);
    downloadCsv([headers, ...rows], 'سجل_الجولات_الميدانية_حدائق_العاصمة');
  };

  const downloadCsv = (data: (string | number)[][], fileName: string) => {
    const csvContent = '\uFEFF' + data.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs Navigation */}
      <div className="bg-white border border-slate-200 p-1.5 rounded-none shadow-xs flex flex-wrap gap-2 text-xs no-print">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-1.5 px-4 py-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-emerald-800 text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>حاسبة غرامات التأخير (قانون 182 لسنة 2018)</span>
        </button>

        <button
          onClick={() => setActiveTab('advisor')}
          className={`flex items-center gap-1.5 px-4 py-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'advisor'
              ? 'bg-emerald-800 text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>دليل اللوائح والقوانين التنفيذية</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-1.5 px-4 py-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'export'
              ? 'bg-emerald-800 text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>تصدير البيانات الميدانية (Excel / CSV)</span>
        </button>
      </div>

      {/* TAB 1: DELAY PENALTY CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs text-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-800" />
                <span>حساب غرامة التأخير التعاقدية للمقاولين</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">
                وفقاً للمادة (48) من قانون تنظيم التعاقدات الحكومية رقم 182 لسنة 2018: تُفرض غرامة بنسبة 1% لكل أسبوع تأخير أو جزء منه بحد أقصى 10% من قيمة العقد.
              </p>
            </div>

            {/* Autofill from existing projects */}
            {projects.length > 0 && (
              <div className="p-3 bg-slate-50 border border-slate-200">
                <label className="block font-semibold text-slate-700 mb-1">
                  استيراد بيانات من مشروع مسجل حالياً:
                </label>
                <select
                  value={selectedProjectForCalc}
                  onChange={(e) => {
                    setSelectedProjectForCalc(e.target.value);
                    const proj = projects.find((p) => p.name === e.target.value);
                    if (proj) {
                      setContractValue((proj.budgetMillions || 50) * 1000000);
                      const gap = proj.plannedPercent - proj.actualPercent;
                      if (gap > 0) {
                        setDelayWeeks(Math.max(1, Math.round(gap / 2.5)));
                      }
                    }
                  }}
                  className="w-full border border-slate-300 bg-white p-2 text-xs"
                >
                  <option value="">-- اختر مشروعاً لحساب غراماته --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} - المقاول: {p.contractor}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  قيمة العقد الإجمالية (جنيه مصري)
                </label>
                <input
                  type="number"
                  value={contractValue}
                  onChange={(e) => setContractValue(Number(e.target.value))}
                  step="500000"
                  className="w-full border border-slate-300 p-2 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    فترة التأخير عن البرنامج المعتمد (بالأسابيع)
                  </label>
                  <input
                    type="number"
                    value={delayWeeks}
                    onChange={(e) => setDelayWeeks(Math.max(0, Number(e.target.value)))}
                    min="1"
                    className="w-full border border-slate-300 p-2 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    الحد الأقصى للغرامة (سقف القانون)
                  </label>
                  <select
                    value={maxCapPercent}
                    onChange={(e) => setMaxCapPercent(Number(e.target.value))}
                    className="w-full border border-slate-300 p-2 text-xs bg-white"
                  >
                    <option value={10}>10% (عقود المقاولات والأشغال العامة)</option>
                    <option value={3}>3% (عقود التوريدات والخدمات)</option>
                    <option value={5}>5% (عقود الاستشارات الهندسية)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <span className="font-bold block mb-1">تنبيه قانوني وتنفيذي:</span>
              تُخصم الغرامة مباشرة من مستحقات المقاول الجارية أو من خطاب الضمان دون الحاجة إلى توجيه إنذار قضائي، وفي حال بلوغ الغرامة الحد الأقصى (10%) يجوز لجهاز المدينة البدء فوراً في إجراءات سحب الأعمال.
            </div>
          </div>

          {/* Calculator Results Box */}
          <div className="lg:col-span-5 bg-white border border-slate-200 p-5 sm:p-6 space-y-5 shadow-xs text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2">
              النتيجة الحسابية وقيمة الخصم المستحق
            </h3>

            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-sans">قيمة العقد:</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {contractValue.toLocaleString('ar-EG')} ج.م
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-sans">نسبة الغرامة المحتسبة:</span>
                <span className="font-bold text-amber-800 tabular-nums">
                  %{effectivePenaltyPercent} {rawPenaltyPercent > maxCapPercent ? '(تم تطبيق الحد الأقصى)' : ''}
                </span>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 text-center">
                <span className="text-slate-600 block text-xs font-sans mb-1">
                  إجمالي قيمة الغرامة الواجب خصمها:
                </span>
                <div className="text-2xl font-extrabold text-rose-700 tabular-nums">
                  {penaltyAmount.toLocaleString('ar-EG')} جنيه
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onDraftMemo({
                  memoType: 'خطاب إنذار رسمي وسحب أعمال',
                  topic: `خصم غرامة تأخير تعاقدية بقيمة ${penaltyAmount.toLocaleString('ar-EG')} ج.م طبقاً للمادة 48 من قانون 182 لسنة 2018`,
                  details: `بالمعاينة الميدانية ومراجعة البرنامج الزمني المعتمد، تبين تأخر الشركة المنفذة بمقدار (${delayWeeks} أسابيع) عن مواعيد النهو المقررة لعقد بقيمة إجمالية (${contractValue.toLocaleString('ar-EG')} ج.م). وبإعمال أحكام القانون، بلغت الغرامة المستحقة نسبة ${effectivePenaltyPercent}% بإجمالي قدره (${penaltyAmount.toLocaleString('ar-EG')} جنيه مصري) واجبة الخصم الفوري من المستخلص الجاري والتأمين النهائي.`,
                });
              }}
              className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>إرسال البيانات لصائغ المذكرات الرسمية &larr;</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: LEGAL & REGULATORY KNOWLEDGEBASE */}
      {activeTab === 'advisor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List of references */}
          <div className="lg:col-span-5 bg-white border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-800" />
                <span>دليل القواعد واللوائح التنفيذية بحدائق العاصمة</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">
                مرجع قانوني وفني فوري منضبط بقوانين هيئة المجتمعات العمرانية والتعاقدات الحكومية والبناء.
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المواد، الإجراءات، سحب الأعمال، الإزالات..."
                className="w-full pl-3 pr-8 py-2 border border-slate-300 text-xs focus:outline-emerald-600 bg-white"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] font-semibold cursor-pointer transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Reference Items */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto">
              {filteredReferences.map((ref) => (
                <button
                  key={ref.id}
                  onClick={() => setActiveReference(ref)}
                  className={`w-full text-right p-3 border text-xs transition-all cursor-pointer block ${
                    activeReference.id === ref.id
                      ? 'border-emerald-700 bg-emerald-50/70'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                  }`}
                >
                  <div className="font-bold text-slate-900">{ref.title}</div>
                  <div className="text-[11px] font-mono text-emerald-800 mt-1">{ref.lawReference}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Reference Content & Actionable Procedures */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-6 space-y-5 shadow-xs text-xs">
            <div className="border-b border-slate-200 pb-3">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-900">
                {activeReference.category}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">{activeReference.title}</h3>
              <p className="text-xs font-mono text-slate-600 mt-1">{activeReference.lawReference}</p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-800" />
                  <span>المضمون والسند القانوني:</span>
                </h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 border border-slate-200">
                  {activeReference.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">
                  خطوات وإجراءات معاون رئيس الجهاز خطوة بخطوة:
                </h4>
                <div className="space-y-2">
                  {activeReference.procedures.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700">
                      <span className="w-5 h-5 bg-emerald-800 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Decree / Decision Drafting */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-slate-900">الصيغة المقترحة للتوجيه أو القرار الإداري:</h4>
                  <button
                    onClick={handleCopyDecision}
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedDecision ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedDecision ? 'تم نسخ الصيغة' : 'نسخ الصيغة'}
                  </button>
                </div>
                <div className="p-3 bg-emerald-50/50 border border-emerald-200 font-mono text-[11px] text-slate-800 leading-relaxed">
                  {activeReference.recommendedDecisionText}
                </div>
              </div>

              <button
                onClick={() => {
                  onDraftMemo({
                    memoType: 'مذكرة عرض على رئيس الجهاز',
                    topic: activeReference.title,
                    details: `${activeReference.summary}\n\nالإجراءات المتخذة:\n${activeReference.procedures.join('\n')}`,
                  });
                }}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors mt-2"
              >
                <span>صياغة مذكرة عرض رسمية بهذا الموضوع &larr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CSV & DATA EXPORT */}
      {activeTab === 'export' && (
        <div className="bg-white border border-slate-200 p-6 space-y-6 shadow-xs text-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-800" />
              <span>تصدير البيانات الميدانية والتقارير التنفيذية</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-1">
              تصدير فوري لكافة السجلات إلى جداول Excel بصيغة (CSV) متوافقة تماماً مع اللغة العربية (UTF-8 with BOM).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-900 block mb-1">سجل مشروعات المدينة</span>
                <p className="text-[11px] text-slate-500 mb-4">
                  بيانات المشروعات ونسب الإنجاز المخططة والفعلية والشركات المنفذة وتواريخ النهو.
                </p>
              </div>
              <button
                onClick={exportProjectsCsv}
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير المشروعات ({projects.length})</span>
              </button>
            </div>

            <div className="p-4 border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-900 block mb-1">سجل الجولات الميدانية</span>
                <p className="text-[11px] text-slate-500 mb-4">
                  تواريخ وأوقات المرور الميداني، المواقع، التقييم العام، والملاحظات الهندسية المرصودة.
                </p>
              </div>
              <button
                onClick={exportInspectionsCsv}
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير الجولات ({inspections.length})</span>
              </button>
            </div>

            <div className="p-4 border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-900 block mb-1">سجل شكاوى ومخالفات المواطنين</span>
                <p className="text-[11px] text-slate-500 mb-4">
                  أرقام البلاغات، بيانات المواطنين، القطاعات، الحالات، والإجراءات المتخذة حيالها.
                </p>
              </div>
              <button
                onClick={exportComplaintsCsv}
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير الشكاوى ({complaints.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
