import React, { useState } from 'react';
import { ProjectItem, FieldInspection, CitizenComplaint, CityViolation, ExecutiveDirective, PriorityLevel } from '../types';
import { NavTab } from './Header';
import capitalGardensOverviewImg from '../assets/images/capital_gardens_overview_1792843195963.jpg';
import { 
  Building2, 
  ClipboardCheck, 
  AlertTriangle, 
  MessageSquareWarning, 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  FileText,
  MapPin,
  Plus,
  Trash2,
  Check
} from 'lucide-react';

interface DashboardOverviewProps {
  projects: ProjectItem[];
  inspections: FieldInspection[];
  complaints: CitizenComplaint[];
  violations: CityViolation[];
  directives: ExecutiveDirective[];
  onNavigate: (tab: NavTab) => void;
  onOpenNewInspection: () => void;
  onAddDirective: (directive: ExecutiveDirective) => void;
  onUpdateDirective: (directive: ExecutiveDirective) => void;
  onDeleteDirective: (id: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  projects,
  inspections,
  complaints,
  violations,
  directives,
  onNavigate,
  onOpenNewInspection,
  onAddDirective,
  onUpdateDirective,
  onDeleteDirective,
}) => {
  const [isAddingDirective, setIsAddingDirective] = useState(false);
  const [newDirTitle, setNewDirTitle] = useState('');
  const [newDirDetails, setNewDirDetails] = useState('');
  const [newDirDept, setNewDirDept] = useState('مكتب معاون رئيس الجهاز + إدارة المشروعات');
  const [newDirDeadline, setNewDirDeadline] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [newDirPriority, setNewDirPriority] = useState<PriorityLevel>('عاجل جداً');

  // Calculations
  const totalUnits = projects.reduce((acc, p) => acc + p.unitsCount, 0);
  const avgCompletion = projects.length === 0
    ? 0
    : Math.round(projects.reduce((acc, p) => acc + p.actualPercent, 0) / projects.length);
  const openComplaintsCount = complaints.filter(
    (c) => c.status === 'جديدة' || c.status === 'قيد الفحص والنزول' || c.status === 'تم التكليف بالصيانة'
  ).length;
  const pendingViolationsCount = violations.filter((v) => v.status !== 'تمت الإزالة الفورية').length;
  const delayedProjectsCount = projects.filter((p) => p.status.includes('متأخر') || p.status.includes('متعثر')).length;

  const handleSaveDirective = () => {
    if (!newDirTitle.trim()) {
      alert('يرجى إدخال عنوان التكليف الصادر من رئيس الجهاز.');
      return;
    }
    const directiveNo = `تكليف رقم ${directives.length + 1} / ${new Date().getFullYear()}`;
    const item: ExecutiveDirective = {
      id: `dir-${Date.now()}`,
      directiveNo,
      from: 'السيد المهندس / رئيس جهاز تنمية مدينة حدائق العاصمة',
      title: newDirTitle.trim(),
      details: newDirDetails.trim() || 'متابعة دورية وتنفيذ التوجيهات الفورية.',
      assignedDept: newDirDept.trim(),
      deadline: newDirDeadline,
      priority: newDirPriority,
      status: 'قيد التنفيذ',
      progressPercent: 20,
    };
    onAddDirective(item);
    setIsAddingDirective(false);
    setNewDirTitle('');
    setNewDirDetails('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section: Executive Banner */}
      <section className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-emerald-800 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>مدينة حدائق العاصمة · هيئة المجتمعات العمرانية الجديدة</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
                منظومة المتابعة الميدانية والقرارات التنفيذية
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                منصة عمل متكاملة لمكتب معاون رئيس الجهاز لإحكام الرقابة اليومية على نسب إنجاز مشروعات "سكن لكل المصريين"، والإسكان الأخضر، ومحاور الطرق والمرافق، وسرعة حسم شكاوى المواطنين وإزالة الإشغالات وصياغة المذكرات الرسمية المعتمدة.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenNewInspection}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors cursor-pointer shadow-xs"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>تسجيل جولة تفقدية للموقع</span>
              </button>
              <button
                onClick={() => onNavigate('memos')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>صياغة مذكرة عرض لرئيس الجهاز</span>
              </button>
              <button
                onClick={() => onNavigate('projects')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <span>سجل المشروعات</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-[300px]">
            <img
              src={capitalGardensOverviewImg}
              alt="بانوراما مدينة حدائق العاصمة"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent flex items-end p-4">
              <div className="text-white text-xs">
                <p className="font-semibold text-sm">مخطط حدائق العاصمة العام</p>
                <p className="text-slate-300">امتداد 29.4 ألف فدان مجاورة للعاصمة الإدارية وطريق السويس</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Numerical Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">الوحدات السكنية الجارية</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalUnits.toLocaleString('ar-EG')}
          </div>
          <p className="text-xs text-slate-500 mt-1">سكن لكل المصريين والإسكان الأخضر</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">متوسط نسبة التنفيذ العام</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            %{avgCompletion}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {delayedProjectsCount > 0
              ? `${delayedProjectsCount} مشروع بحاجة لتكثيف معدلات`
              : projects.length > 0
              ? 'كافة العمليات منتظمة'
              : 'في انتظار تسجيل المشروعات'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">شكاوى المواطنين المفتوحة</span>
            <MessageSquareWarning className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {openComplaintsCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">مياه، إنارة، نظافة، وتشغيل مصاعد</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">المخالفات وقرارات الإزالة</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 font-mono tabular-nums">
            {pendingViolationsCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">بالتنسيق مع شرطة التعمير بالجهاز</p>
        </div>
      </section>

      {/* Two Column Grid: Executive Directives & Latest Field Inspections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Directives from the Head of the Authority */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">توجيهات وتكليفات السيد المهندس رئيس الجهاز</h2>
              <p className="text-xs text-slate-500">المهام المباشرة الصادرة لمكتب المعاون والإدارات المعنية</p>
            </div>
            <button
              onClick={() => setIsAddingDirective(!isAddingDirective)}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة تكليف</span>
            </button>
          </div>

          {/* Add Directive Form */}
          {isAddingDirective && (
            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 text-xs shadow-xs">
              <h3 className="font-bold text-slate-900">تسجيل تكليف تنفيذي صادر من رئيس الجهاز</h3>
              <div>
                <label className="block text-slate-600 mb-1">موضوع التكليف *</label>
                <input
                  type="text"
                  value={newDirTitle}
                  onChange={(e) => setNewDirTitle(e.target.value)}
                  placeholder="مثال: تشكيل لجنة للمرور على محطة الرافع ومطابقة اختبارات الضغط..."
                  className="w-full border border-slate-300 rounded p-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">الإدارة المعنية بالتنفيذ</label>
                  <input
                    type="text"
                    value={newDirDept}
                    onChange={(e) => setNewDirDept(e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">المهلة المحددة</label>
                  <input
                    type="date"
                    value={newDirDeadline}
                    onChange={(e) => setNewDirDeadline(e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 mb-1">التفاصيل والتوجيهات الإضافية</label>
                <textarea
                  rows={2}
                  value={newDirDetails}
                  onChange={(e) => setNewDirDetails(e.target.value)}
                  placeholder="تعليمات رئيس الجهاز واشتراطات التنفيذ..."
                  className="w-full border border-slate-300 rounded p-1.5"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setIsAddingDirective(false)}
                  className="px-3 py-1 text-slate-600 bg-slate-100 rounded"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveDirective}
                  className="px-4 py-1 text-white bg-emerald-800 rounded font-bold hover:bg-emerald-900"
                >
                  حفظ التكليف
                </button>
              </div>
            </div>
          )}

          {/* Directives List */}
          {directives.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-6 text-center space-y-2">
              <p className="text-xs font-semibold text-slate-700">لا توجد تكليفات مسجلة حالياً</p>
              <p className="text-[11px] text-slate-400">
                اضغط على "إضافة تكليف" لتسجيل أي توجيه أو قرار مباشر للعرض والمتابعة اليومية.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-xs">
              {directives.map((dir) => (
                <div key={dir.id} className="p-4 transition-colors hover:bg-slate-50/70">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-800">{dir.directiveNo}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-800 font-medium">{dir.priority}</span>
                        <span aria-hidden="true">·</span>
                        <span>المهلة: {dir.deadline}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{dir.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{dir.details}</p>
                      <p className="text-[11px] text-slate-500">
                        <span className="font-medium text-slate-700">جهة التنفيذ: </span>
                        {dir.assignedDept}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="font-mono text-xs font-bold tabular-nums text-slate-800">
                        %{dir.progressPercent}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            const newP = prompt('أدخل نسبة الإنجاز الجديدة (0-100):', String(dir.progressPercent));
                            if (newP !== null) {
                              const val = Math.min(100, Math.max(0, Number(newP)));
                              onUpdateDirective({
                                ...dir,
                                progressPercent: val,
                                status: val === 100 ? 'تمت المتابعة والإنجاز' : 'قيد التنفيذ',
                              });
                            }
                          }}
                          className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold underline"
                        >
                          تحديث %
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('حذف هذا التكليف؟')) {
                              onDeleteDirective(dir.id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        dir.progressPercent === 100 ? 'bg-emerald-600' : 'bg-emerald-800'
                      }`}
                      style={{ width: `${dir.progressPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Latest Field Inspections & Quick Sites */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">آخر تقارير الجولات الميدانية</h2>
              <p className="text-xs text-slate-500">محاضر المعاينة وتلافي الملاحظات</p>
            </div>
            <button
              onClick={() => onNavigate('inspections')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              كافة الجولات
            </button>
          </div>

          <div className="space-y-3">
            {inspections.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-6 text-center space-y-2">
                <ClipboardCheck className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">لم يتم تسجيل جولات اليوم</p>
                <p className="text-[11px] text-slate-400">
                  سجل تفاصيل جولتك التفتيشية بالموقع واطبع محضر المرور الرسمي.
                </p>
                <button
                  onClick={onOpenNewInspection}
                  className="inline-flex items-center gap-1 text-xs font-bold text-white bg-emerald-800 px-3 py-1.5 rounded hover:bg-emerald-900 cursor-pointer shadow-xs mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>تسجيل أول جولة</span>
                </button>
              </div>
            ) : (
              inspections.slice(0, 2).map((insp) => (
                <div key={insp.id} className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{insp.projectName}</span>
                    <span className="tabular-nums font-mono">{insp.date}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">{insp.summary}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">
                      الملاحظات: <strong className="text-slate-900 tabular-nums">{insp.observations.length}</strong>
                    </span>
                    <span
                      className={`font-semibold ${
                        insp.generalStatus === 'مقبول ومطابق'
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {insp.generalStatus}
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* Visual Showcase Card */}
            <div className="bg-slate-900 text-white rounded-lg p-4 overflow-hidden relative shadow-xs">
              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-semibold text-emerald-400">مشروع الإسكان الأخضر GPRS</span>
                <h4 className="text-sm font-bold leading-tight">
                  النموذج البيئي المستدام الأول بمدن الجيل الرابع
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  متابعة تشغيل الخلايا الشمسية لإنارة المداخل والسلالم، وتجهيز مسارات المشاة، وشبكات الري بالرش بالاعتماد على المياه المعالجة ثلاثياً.
                </p>
                <button
                  onClick={() => onNavigate('sectors')}
                  className="mt-1 text-xs font-semibold text-emerald-300 hover:text-white underline cursor-pointer"
                >
                  استعراض قطاع الإسكان الأخضر على المخطط &larr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Major Projects Snapshot Table */}
      <section className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">الموقف التنفيذي للمشروعات الاستراتيجية بالمدينة</h2>
            <p className="text-xs text-slate-500">مقارنة نسب الإنجاز الفعلية والمخططة للشركات المنفذة</p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors shrink-0"
          >
            عرض جدول المقاولين والاستشاريين &larr;
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">لا توجد مشروعات مسجلة حتى الآن</p>
            <p className="text-[11px] text-slate-400">
              قم بإدراج المشروعات الاستراتيجية لمتابعة نسب الإنجاز والمقاولين.
            </p>
            <button
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline mt-1"
            >
              + الانتقال لإضافة المشروعات
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">اسم المشروع</th>
                  <th className="py-3 px-4">القطاع</th>
                  <th className="py-3 px-4">الشركة المنفذة (المقاول)</th>
                  <th className="py-3 px-4 text-center">المخطط</th>
                  <th className="py-3 px-4 text-center">الفعلي</th>
                  <th className="py-3 px-4">الموقف التنفيذي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {projects.slice(0, 5).map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {project.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{project.sector}</td>
                    <td className="py-3 px-4 text-slate-700">{project.contractor}</td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-600">
                      %{project.plannedPercent}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold tabular-nums text-slate-900">
                      %{project.actualPercent}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      <span
                        className={
                          project.status.includes('متقدم')
                            ? 'text-emerald-700'
                            : project.status.includes('متأخر')
                            ? 'text-rose-700'
                            : 'text-slate-700'
                        }
                      >
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
