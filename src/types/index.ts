export type PriorityLevel = 'عاجل جداً' | 'عالي' | 'متوسط' | 'عادي';

export type ProjectStatus = 'منتظم بالجدول' | 'متقدم عن المخطط' | 'متأخر - إنذار أول' | 'متعثر - دراسة سحب' | 'جاهز للاستلام الابتدائي' | 'تم الاستلام النهائي';

export type SectorName = 
  | 'منطقة الـ 2350 فدان (سكن لكل المصريين)'
  | 'منطقة الإسكان الأخضر (Green Social Housing)'
  | 'منطقة الـ 2940 فدان (امتداد المدينة)'
  | 'منطقة الخدمات المركزية والبنوك'
  | 'المحور الخدمي ومحيط محطة LRT'
  | 'منطقة المرافق والرافع ومحطة المحولات';

export interface ProjectItem {
  id: string;
  name: string;
  sector: SectorName;
  contractor: string;
  consultant: string;
  unitsCount: number;
  buildingsCount: number;
  plannedPercent: number;
  actualPercent: number;
  startDate: string;
  contractEndDate: string;
  status: ProjectStatus;
  budgetMillions: number;
  notes: string;
}

export interface InspectionObservation {
  id: string;
  buildingNo?: string;
  description: string;
  severity: 'حرج' | 'متوسط' | 'بسيط';
  category: 'جودة خرسانات وبناء' | 'تشطيبات ولاندسكيب' | 'شبكات مرافق' | 'سلامة وصحة مهنية' | 'عمالة وتوريدات';
  assignedTo: string;
  deadlineDate: string;
  isResolved: boolean;
}

export interface FieldInspection {
  id: string;
  date: string;
  time: string;
  projectName: string;
  sector: SectorName;
  accompaniedBy: string; // المرافقون بالجولة (مثل: مدير إدارة المشروعات، مهندس الموقع، استشاري المشروع)
  summary: string;
  observations: InspectionObservation[];
  generalStatus: 'مقبول ومطابق' | 'يحتاج تسريع وتكثيف' | 'ملاحظات جوهرية تستوجب إنذار';
  aiAnalysis?: string;
  photos?: string[]; // روابط أو Base64 للصور الميدانية المرفقة
}

export type ComplaintCategory = 'مياه شرب وصرف' | 'إنارة وطاقة' | 'نظافة ومخلفات' | 'تشغيل مصاعد' | 'طرق ومحاور' | 'أخرى';
export type ComplaintStatus = 'جديدة' | 'قيد الفحص والنزول' | 'تم التكليف بالصيانة' | 'تم الحل وإغلاق البلاغ';

export interface CitizenComplaint {
  id: string;
  ticketNo: string;
  citizenName: string;
  phone: string;
  sector: SectorName;
  buildingNo: string;
  flatNo?: string;
  category: ComplaintCategory;
  details: string;
  receivedDate: string;
  status: ComplaintStatus;
  actionTaken?: string;
  resolvedDate?: string;
}

export type ViolationType = 'تغيير نشاط من سكني لتجاري' | 'غلق ردود أو مظلات غير مصرحة' | 'إشغال رصيف وطريق' | 'تعديل إنشائي دون ترخيص' | 'لافتات مخالفة';
export type ViolationStatus = 'رصد أولي' | 'تحرير محضر مخالفة' | 'صدور قرار إزالة' | 'تمت الإزالة الفورية';

export interface CityViolation {
  id: string;
  caseNo: string;
  sector: SectorName;
  locationDetails: string;
  violationType: ViolationType;
  violatorName: string;
  detectionDate: string;
  status: ViolationStatus;
  policeCoordination: boolean; // التنسيق مع شرطة التعمير
  decisionMemoNo?: string;
  notes: string;
}

export interface ExecutiveDirective {
  id: string;
  directiveNo: string;
  from: string; // e.g. "السيد المهندس / رئيس الجهاز"
  title: string;
  details: string;
  assignedDept: string; // الإدارة المعنية
  deadline: string;
  priority: PriorityLevel;
  status: 'قيد التنفيذ' | 'تمت المتابعة والإنجاز' | 'معلق لانتظار إفادة';
  progressPercent: number;
}

export interface OfficialMemoRecord {
  id: string;
  memoNo: string;
  date: string;
  type: string;
  subject: string;
  recipient: string;
  content: string;
  urgency: PriorityLevel;
}

export type HandoverType = 'استلام ابتدائي' | 'استلام نهائي' | 'معاينة تمهيدية ولجنة فرعية';
export type HandoverDecision = 'قبول واستلام بالكامل' | 'استلام بتحفظ وتلافي الملاحظات' | 'رفض الاستلام لعدم الجاهزية';

export interface HandoverCommittee {
  id: string;
  code: string;
  type: HandoverType;
  projectName: string;
  sector: SectorName;
  targetScope: string; // e.g. "عمارات 10 إلى 25 (360 وحدة سكنية)"
  committeeDate: string;
  headOfCommittee: string; // رئيس اللجنة (مثل: معاون رئيس الجهاز)
  members: string; // أعضاء اللجنة من الهيئة والجهاز والاستشاري والمقاول
  decision: HandoverDecision;
  remarksList: string[]; // قائمة الملاحظات المسجلة بمحضر الاستلام
  deadlineForRectification?: string;
  notes: string;
  isSigned: boolean;
}

export interface ExecutiveMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: string;
  agenda: string;
  status: 'مجدول' | 'منعقد وتم تدوين التوصيات' | 'مؤجل';
  recommendations?: string;
}
