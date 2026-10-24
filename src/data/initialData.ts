import { ProjectItem, FieldInspection, CitizenComplaint, CityViolation, ExecutiveDirective, OfficialMemoRecord } from '../types';

// Default empty arrays - Clean initial state as requested
export const INITIAL_PROJECTS: ProjectItem[] = [];
export const INITIAL_INSPECTIONS: FieldInspection[] = [];
export const INITIAL_COMPLAINTS: CitizenComplaint[] = [];
export const INITIAL_VIOLATIONS: CityViolation[] = [];
export const INITIAL_DIRECTIVES: ExecutiveDirective[] = [];
export const INITIAL_MEMOS: OfficialMemoRecord[] = [];

// Realistic Sectors Directory of Capital Gardens City (Reference knowledge for the city)
export const CAPITAL_GARDENS_SECTORS_INFO = [
  {
    id: 'sec-1',
    name: 'منطقة الـ 2350 فدان (سكن لكل المصريين)',
    areaAcres: 2350,
    housingUnits: 32000,
    features: 'المرحلة الأولى والثانية والثالثة لمبادرة سكن لكل المصريين، تشمل شبكة خدمات متكاملة (مدارس، حضانات، أسواق تجارية، ملاعب، مخبز آلي).',
    activeContractors: ['المقاولون العرب', 'النيل العامة', 'حسن علام', 'سياك'],
    engineerInCharge: 'م. أحمد شكري (مدير قطاع 2350 فدان)',
    completionRate: 86,
  },
  {
    id: 'sec-2',
    name: 'منطقة الإسكان الأخضر (Green Social Housing)',
    areaAcres: 1100,
    housingUnits: 12500,
    features: 'أول مشروع إسكان اجتماعي يحصل على شهادة الهرم الأخضر GPRS في مصر، يعتمد الطاقة الشمسية، دهانات عاكسة، تدوير مياه الصرف للزراعة، ومسارات مشاة ودراجات معزولة.',
    activeContractors: ['أوراسكوم', 'أبناء حسن علام', 'الرواد'],
    engineerInCharge: 'م. مينا فوزي (مدير العمارة الخضراء)',
    completionRate: 74,
  },
  {
    id: 'sec-3',
    name: 'المحور الخدمي ومحيط محطة LRT',
    areaAcres: 750,
    housingUnits: 0,
    features: 'شريان النقل والمواصلات السريع يربط حدائق العاصمة بالعاصمة الإدارية الجديدة ومحطة قطار LRT حدائق العاصمة، ويشمل مجمعات مواقف، مساحات استثمارية وتجارية.',
    activeContractors: ['النيل لإنشاء الطرق', 'مصر لأعمال الأسمنت المسلح'],
    engineerInCharge: 'م. وائل عبد الحميد (مدير قطاع الطرق والمحاور)',
    completionRate: 91,
  },
  {
    id: 'sec-4',
    name: 'منطقة الخدمات المركزية والبنوك',
    areaAcres: 600,
    housingUnits: 0,
    features: 'مبنى جهاز المدينة، مجمع المحاكم والنيابات، فروع البنوك الحكومية والخاصة، المستشفى المركزي الشامل، وسنترال الاتصالات الفايبر المركزي.',
    activeContractors: ['المقاولون العرب', 'إيجيكو'],
    engineerInCharge: 'م. سامح إبراهيم (مدير قطاع الخدمات)',
    completionRate: 68,
  },
  {
    id: 'sec-5',
    name: 'منطقة المرافق والرافع ومحطة المحولات',
    areaAcres: 450,
    housingUnits: 0,
    features: 'محطة محولات كهرباء حدائق العاصمة جهد 220 ك.ف، خزان ومحطة رافع مياه الشرب، محطة معالجة مياه الصرف الصحي الثلاثية المغذية للحدائق.',
    activeContractors: ['السويدي إلكتريك', 'القابضة للمياه والصرف'],
    engineerInCharge: 'م. محمود الشربيني (مدير عام المرافق والتشغيل)',
    completionRate: 84,
  },
  {
    id: 'sec-6',
    name: 'منطقة الـ 2940 فدان (امتداد المدينة)',
    areaAcres: 2940,
    housingUnits: 28000,
    features: 'الامتداد العمراني المستقبلي للمدينة المخصص لمشروعات الإسكان المتوسط والمتميز، والمنطقة اللوجستية، والمجمعات الصناعية النظيفة والصديقة للبيئة.',
    activeContractors: ['تحالف شركات قطاع الأعمال والقطاع الخاص'],
    engineerInCharge: 'م. هيثم كمال (مدير قطاع الامتداد)',
    completionRate: 48,
  },
];

// Optional Sample Demo Data (available only if manually loaded via settings)
export const SAMPLE_DEMO_DATA = {
  projects: [
    {
      id: 'demo-proj-1',
      name: 'مشروع سكن لكل المصريين - المرحلة الخامسة (منطقة الـ 2350 فدان)',
      sector: 'منطقة الـ 2350 فدان (سكن لكل المصريين)' as const,
      contractor: 'شركة المقاولون العرب (عثمان أحمد عثمان)',
      consultant: 'مكتب صبور للاستشارات الهندسية',
      unitsCount: 2400,
      buildingsCount: 100,
      plannedPercent: 78,
      actualPercent: 82,
      startDate: '2024-03-01',
      contractEndDate: '2025-06-30',
      status: 'متقدم عن المخطط' as const,
      budgetMillions: 960,
      notes: 'تم نهو أعمال الهيكل الخرساني بالكامل، وجاري أعمال التشطيبات الداخلية والواجهات وتنسيق الموقع.',
    },
    {
      id: 'demo-proj-2',
      name: 'مشروع الإسكان الأخضر الصديق للبيئة (Green Social Housing)',
      sector: 'منطقة الإسكان الأخضر (Green Social Housing)' as const,
      contractor: 'شركة أوراسكوم للإنشاءات بالشراكة مع حسن علام',
      consultant: 'مركز الاستشارات الهندسية - كلية الهندسة جامعة عين شمس',
      unitsCount: 1800,
      buildingsCount: 75,
      plannedPercent: 65,
      actualPercent: 64,
      startDate: '2024-06-15',
      contractEndDate: '2025-09-30',
      status: 'منتظم بالجدول' as const,
      budgetMillions: 820,
      notes: 'تنفيذ تقنيات العزل الحراري، الخلايا الشمسية على أسطح العمارات، ومسارات الدراجات وشبكات الري بالرش والتنقيط.',
    },
  ],
  inspections: [
    {
      id: 'demo-insp-1',
      date: '2026-10-23',
      time: '10:30 ص',
      projectName: 'مشروع سكن لكل المصريين - منطقة الـ 2350 فدان',
      sector: 'منطقة الـ 2350 فدان (سكن لكل المصريين)' as const,
      accompaniedBy: 'مدير إدارة المشروعات + استشاري الموقع + مدير تنفيذ المقاول',
      summary: 'تم المرور على قطاع العمارات من 40 إلى 56 ورصد معدلات البياض وأعمال السيراميك.',
      generalStatus: 'يحتاج تسريع وتكثيف' as const,
      observations: [
        {
          id: 'demo-obs-1',
          buildingNo: 'عمارة 44 و 45',
          description: 'تراكم رتش ومخلفات هدم تعيق تسوية اللاندسكيب.',
          severity: 'متوسط' as const,
          category: 'تشطيبات ولاندسكيب' as const,
          assignedTo: 'المقاول المنفذ',
          deadlineDate: '2026-10-28',
          isResolved: false,
        },
      ],
    },
  ],
  complaints: [
    {
      id: 'demo-comp-1',
      ticketNo: 'C-2026-0891',
      citizenName: 'محمد عبد الرحمن محمود',
      phone: '01091234567',
      sector: 'منطقة الـ 2350 فدان (سكن لكل المصريين)' as const,
      buildingNo: 'عمارة 32',
      flatNo: 'شقة 6',
      category: 'مياه شرب وصرف' as const,
      details: 'ضعف ضغط مياه الشرب بالأدوار العليا بالمساء.',
      receivedDate: '2026-10-24',
      status: 'قيد الفحص والنزول' as const,
      actionTaken: 'تم إخطار إدارة التشغيل والصيانة لضبط ضغوط المحابس.',
    },
  ],
  violations: [
    {
      id: 'demo-viol-1',
      caseNo: 'V-2026-112',
      sector: 'منطقة الـ 2350 فدان (سكن لكل المصريين)' as const,
      locationDetails: 'عمارة 14 - الدور الأرضي شقة 1',
      violationType: 'تغيير نشاط من سكني لتجاري' as const,
      violatorName: 'صاحب الشقة',
      detectionDate: '2026-10-23',
      status: 'تحرير محضر مخالفة' as const,
      policeCoordination: true,
      decisionMemoNo: 'مذكرة 204 لسنة 2026',
      notes: 'محاولة فتح واجهة الشقة لإنشاء محل بقالة. تم إيقاف الأعمال ومصادرة العدة.',
    },
  ],
  directives: [
    {
      id: 'demo-dir-1',
      directiveNo: 'تكليف رقم 14 / أ',
      from: 'السيد المهندس / رئيس جهاز تنمية مدينة حدائق العاصمة',
      title: 'تكثيف الجولات الميدانية الصباحية على قطاع الإسكان الأخضر ومسارات الـ LRT',
      details: 'المتابعة اليومية الدقيقة لنسب التنفيذ ومطابقة خامات التشطيب ونظافة المحاور.',
      assignedDept: 'مكتب معاون رئيس الجهاز + إدارة المشروعات',
      deadline: '2026-10-28',
      priority: 'عاجل جداً' as const,
      status: 'قيد التنفيذ' as const,
      progressPercent: 75,
    },
  ],
  memos: [],
  committees: [
    {
      id: 'demo-comm-1',
      code: 'محضر-ابتدائي-2026/041',
      type: 'استلام ابتدائي' as const,
      projectName: 'مشروع سكن لكل المصريين - المرحلة الخامسة',
      sector: 'منطقة الـ 2350 فدان (سكن لكل المصريين)' as const,
      targetScope: 'عمارات 25 إلى 38 (312 وحدة سكنية كاملة التشطيب)',
      committeeDate: '2026-10-24',
      headOfCommittee: 'معاون رئيس جهاز تنمية مدينة حدائق العاصمة',
      members: 'مندوب الهيئة + مدير إدارة المشروعات + استشاري الموقع + مندوب المقاول العام',
      decision: 'استلام بتحفظ وتلافي الملاحظات' as const,
      remarksList: [
        'استكمال اختبارات ضغط شبكة مياه الشرب بالمحابس العمومية',
        'ضبط تسوية بلاط الإنترلوك عند المداخل المخصصة لذوي الهمم',
        'رفع مخلفات التشوينات خلف عمارة 30'
      ],
      deadlineForRectification: '2026-11-08',
      notes: 'تم منح المقاول مهلة 15 يوماً للتلافي مع حجز نسبة الاستقطاعات التعاقدية.',
      isSigned: true,
    },
  ],
};
