import React, { useState, useEffect } from 'react';
import { FieldInspection, InspectionObservation, SectorName, ProjectItem } from '../types';
import { 
  ClipboardCheck, 
  Plus, 
  Printer, 
  Trash2, 
  Search,
  Check,
  CheckCircle2,
  Building,
  Edit,
  ArrowRight
} from 'lucide-react';
import { OfficialPrintHeader } from './OfficialPrintHeader';
import fieldInspectionSiteImg from '../assets/images/field_inspection_site_1792843196692.jpg';

interface InspectionManagerProps {
  inspections: FieldInspection[];
  projects: ProjectItem[];
  onSaveInspection: (inspection: FieldInspection) => void;
  onDeleteInspection: (id: string) => void;
  initialOpenNew?: boolean;
  onResetOpenNew?: () => void;
}

export const InspectionManager: React.FC<InspectionManagerProps> = ({
  inspections,
  projects,
  onSaveInspection,
  onDeleteInspection,
  initialOpenNew,
  onResetOpenNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [printingInspection, setPrintingInspection] = useState<FieldInspection | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);

  // New Inspection Form State
  const [selectedProject, setSelectedProject] = useState(projects[0]?.name || '');
  const [customProjectName, setCustomProjectName] = useState('');
  const [isCustomProject, setIsCustomProject] = useState(projects.length === 0);
  const [sector, setSector] = useState<SectorName>(projects[0]?.sector || 'منطقة الـ 2350 فدان (سكن لكل المصريين)');
  const [accompaniedBy, setAccompaniedBy] = useState('مدير إدارة المشروعات + استشاري الموقع + مدير تنفيذ المقاول');
  const [summary, setSummary] = useState('');
  const [generalStatus, setGeneralStatus] = useState<FieldInspection['generalStatus']>('يحتاج تسريع وتكثيف');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [observations, setObservations] = useState<InspectionObservation[]>([
    {
      id: 'obs-init-1',
      buildingNo: 'عمارة ',
      description: '',
      severity: 'متوسط',
      category: 'تشطيبات ولاندسكيب',
      assignedTo: 'الشركة المنفذة للمشروع',
      deadlineDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isResolved: false,
    },
  ]);

  // Sync if projects load or change
  useEffect(() => {
    if (projects.length === 0) {
      setIsCustomProject(true);
    } else if (!selectedProject) {
      setSelectedProject(projects[0].name);
      setSector(projects[0].sector);
    }
  }, [projects]);

  useEffect(() => {
    if (initialOpenNew) {
      setIsAddingNew(true);
      onResetOpenNew?.();
    }
  }, [initialOpenNew, onResetOpenNew]);

  // Add observation row
  const addObservationRow = () => {
    setObservations([
      ...observations,
      {
        id: `obs-${Date.now()}-${Math.random()}`,
        buildingNo: '',
        description: '',
        severity: 'متوسط',
        category: 'جودة خرسانات وبناء',
        assignedTo: 'المقاول المنفذ',
        deadlineDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isResolved: false,
      },
    ]);
  };

  const updateObservation = (index: number, key: keyof InspectionObservation, value: any) => {
    const updated = [...observations];
    updated[index] = { ...updated[index], [key]: value };
    setObservations(updated);
  };

  const removeObservation = (index: number) => {
    if (observations.length <= 1) return;
    setObservations(observations.filter((_, i) => i !== index));
  };

  // Run Engineering Technical Evaluation (Deterministic & Instant)
  const handleRunAiAnalysis = () => {
    const targetName = isCustomProject ? customProjectName.trim() : selectedProject.trim();
    if (!summary && observations.every((o) => !o.description)) {
      alert('يرجى كتابة ملخص للجولة أو إدخال ملاحظات أولاً للتقييم.');
      return;
    }

    const proj = projects.find((p) => p.name === targetName);
    const planned = proj?.plannedPercent ?? 75;
    const actual = proj?.actualPercent ?? 70;
    const gap = planned - actual;

    const criticalCount = observations.filter((o) => o.severity === 'حرج').length;
    const mediumCount = observations.filter((o) => o.severity === 'متوسط').length;

    let riskLevel = 'منخفض ومستقر';
    let executiveDecision = '';

    if (gap > 15 || criticalCount >= 2) {
      riskLevel = 'حرج جداً (تأخير جسيم يمس مواعيد التسليم)';
      executiveDecision = 'توجيه إنذار رسمي أول للمقاول طبقاً للمادة 79 من قانون 182 لسنة 2018، وقف صرف المستخلص الجاري لحين اعتماد تلافي الملاحظات، وإلزام الشركة بتقديم جدول زمني مضغوط خلال 72 ساعة.';
    } else if (gap > 5 || mediumCount >= 3) {
      riskLevel = 'متوسط إلى مرتفع (ملاحظات جودة وتأخر نسبي)';
      executiveDecision = 'إلزام المقاول بالعمل بنظام ورديتين لمضاعفة معدلات الإنجاز وتكثيف توريد الخامات مع لفت نظر رسمي للاستشاري المشرف.';
    } else {
      riskLevel = 'طبيعي ومطابق للبرنامج الزمني';
      executiveDecision = 'متابعة الأعمال الاعتيادية مع توثيق نسب الفحص قبل التجهيز للجان الاستلام الابتدائي.';
    }

    const evaluationResult = `📊 التقييم الفني للموقع: [ ${targetName || 'الموقع العام بحدائق العاصمة'} ]
• الشركة المنفذة: ${proj?.contractor || 'الشركة المسند إليها الموقع'}
• نسبة الإنجاز: المخطط ${planned}% | الفعلي ${actual}% (الفارق: ${gap > 0 ? '-' + gap + '%' : '+' + Math.abs(gap) + '%'})
• مستوى المخاطر الهندسية: ${riskLevel}
• رصد الملاحظات: عدد (${criticalCount}) حرجة، عدد (${mediumCount}) متوسطة.

📌 القرار الإداري والتوجيه الميداني المقترح لمعاون رئيس الجهاز:
1. ${executiveDecision}
2. إلزام استشاري الموقع بتقديم تقرير مطابقة أسبوعي موقع ومختوم.
3. التفتيش على معايير السلامة والصحة المهنية وتأمين مسار المعدات والعمال بالموقع.`;

    setAiAnalysis(evaluationResult);
  };

  // Save new inspection
  const handleSave = () => {
    const targetProjectName = isCustomProject ? customProjectName.trim() : selectedProject.trim();
    if (!targetProjectName) {
      alert('يرجى تحديد أو إدخال اسم المشروع / الموقع المستهدف.');
      return;
    }
    if (!summary.trim()) {
      alert('يرجى كتابة ملخص للجولة الميدانية.');
      return;
    }

    const newInspection: FieldInspection = {
      id: `insp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      projectName: targetProjectName,
      sector,
      accompaniedBy,
      summary,
      generalStatus,
      observations: observations.filter((o) => o.description.trim() !== ''),
      aiAnalysis: aiAnalysis || undefined,
    };

    onSaveInspection(newInspection);
    setIsAddingNew(false);

    // Reset Form
    setSummary('');
    setCustomProjectName('');
    setAiAnalysis('');
    setObservations([
      {
        id: `obs-${Date.now()}`,
        buildingNo: 'عمارة ',
        description: '',
        severity: 'متوسط',
        category: 'تشطيبات ولاندسكيب',
        assignedTo: 'الشركة المنفذة للمشروع',
        deadlineDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isResolved: false,
      },
    ]);
  };

  // Toggle observation resolved in existing inspection
  const toggleObservationStatus = (inspectionId: string, obsId: string) => {
    const target = inspections.find((i) => i.id === inspectionId);
    if (!target) return;
    const updatedObs = target.observations.map((o) =>
      o.id === obsId ? { ...o, isResolved: !o.isResolved } : o
    );
    onSaveInspection({ ...target, observations: updatedObs });
  };

  // Filtered list
  const filtered = inspections.filter((i) => {
    const matchesSearch =
      i.projectName.includes(searchTerm) ||
      i.summary.includes(searchTerm) ||
      i.accompaniedBy.includes(searchTerm);
    const matchesSector = filterSector === 'all' || i.sector === filterSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">سجل الجولات الميدانية والمرور اليومي</h1>
          <p className="text-xs text-slate-500">
            متابعة مواقع العمل، ورصد الملاحظات الإنشائية والتنفيذية، ومطابقة المواصفات
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isAddingNew ? (
            <button
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل محضر مرور ميداني جديد</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          )}
        </div>
      </div>

      {/* Printable Modal for single Inspection */}
      {printingInspection && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 no-print">
              <span className="font-bold text-sm text-slate-800">معاينة محضر المرور الميداني للطباعة</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 rounded hover:bg-emerald-900 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة الآن</span>
                </button>
                <button
                  onClick={() => setPrintingInspection(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded hover:bg-slate-200 cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

            {/* Official Report Content */}
            <div className="p-2 bg-white text-slate-900">
              <OfficialPrintHeader
                documentTitle={`تقرير مرور ميداني ومعاينة فنية · ${printingInspection.projectName}`}
                serialNumber={`مرور-${printingInspection.id.slice(-4)}`}
                dateStr={printingInspection.date}
              />

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500">الموقع / المشروع: </span>
                    <strong className="text-slate-900">{printingInspection.projectName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">القطاع الجغرافي: </span>
                    <span className="text-slate-800">{printingInspection.sector}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">تاريخ وساعة المرور: </span>
                    <span className="font-mono tabular-nums">{printingInspection.date} - {printingInspection.time}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">التقييم العام للموقع: </span>
                    <strong className="text-slate-900">{printingInspection.generalStatus}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">المرافقون بالجولة: </span>
                    <span className="text-slate-800">{printingInspection.accompaniedBy}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">ملخص الجولة والملاحظات العامة:</h4>
                  <p className="text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded border border-slate-200">
                    {printingInspection.summary}
                  </p>
                </div>

                {printingInspection.observations.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 mb-2">جدول الملاحظات الفنية المكلف بها المقاول:</h4>
                    <table className="w-full text-right border border-slate-300 text-xs">
                      <thead className="bg-slate-100 font-semibold text-slate-800">
                        <tr>
                          <th className="p-2 border border-slate-300">م</th>
                          <th className="p-2 border border-slate-300">الموقع / العمارة</th>
                          <th className="p-2 border border-slate-300">بيان الملاحظة</th>
                          <th className="p-2 border border-slate-300">التصنيف</th>
                          <th className="p-2 border border-slate-300">المكلف بالتنفيذ</th>
                          <th className="p-2 border border-slate-300">مهلة التلافي</th>
                        </tr>
                      </thead>
                      <tbody>
                        {printingInspection.observations.map((obs, idx) => (
                          <tr key={obs.id}>
                            <td className="p-2 border border-slate-300 font-mono tabular-nums">{idx + 1}</td>
                            <td className="p-2 border border-slate-300 font-medium">{obs.buildingNo || 'عام'}</td>
                            <td className="p-2 border border-slate-300">{obs.description}</td>
                            <td className="p-2 border border-slate-300">{obs.category}</td>
                            <td className="p-2 border border-slate-300">{obs.assignedTo}</td>
                            <td className="p-2 border border-slate-300 font-mono tabular-nums">{obs.deadlineDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {printingInspection.aiAnalysis && (
                  <div className="border border-emerald-200 bg-emerald-50/50 p-3 rounded">
                    <h4 className="font-bold text-xs text-emerald-950 mb-1">التوصية الفنية والإدارية المقترحة:</h4>
                    <p className="text-emerald-900 leading-relaxed text-xs whitespace-pre-line">
                      {printingInspection.aiAnalysis}
                    </p>
                  </div>
                )}

                {/* Signature block */}
                <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">مهندس الموقع / الاستشاري</p>
                    <div className="h-12 border-b border-dashed border-slate-300 mt-2"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">مدير إدارة المشروعات</p>
                    <div className="h-12 border-b border-dashed border-slate-300 mt-2"></div>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">معاون رئيس جهاز المدينة</p>
                    <div className="h-12 border-b border-dashed border-slate-400 mt-2 flex items-center justify-center">
                      <span className="text-[11px] text-slate-400">توقيع واعتماد</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW INSPECTION FORM */}
      {isAddingNew && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">نموذج محضر مرور وتفتيش ميداني جديد</h2>
              <p className="text-xs text-slate-500">سجل بيانات الزيارة الفنية، وشارك الملاحظات مع المقاولين والاستشاري</p>
            </div>
            {projects.length > 0 && (
              <button
                type="button"
                onClick={() => setIsCustomProject(!isCustomProject)}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                {isCustomProject ? 'اختيار من قائمة المشروعات المسجلة' : 'إدخال اسم موقع يدويًا'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">المشروع أو الموقع المستهدف بالمرور *</label>
              {isCustomProject || projects.length === 0 ? (
                <input
                  type="text"
                  value={customProjectName}
                  onChange={(e) => setCustomProjectName(e.target.value)}
                  placeholder="مثال: مشروع سكن لكل المصريين عمارات 40-60 أو رافع المياه..."
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-emerald-700"
                />
              ) : (
                <select
                  value={selectedProject}
                  onChange={(e) => {
                    setSelectedProject(e.target.value);
                    const p = projects.find((x) => x.name === e.target.value);
                    if (p) setSector(p.sector);
                  }}
                  className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-900 focus:outline-emerald-700"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">القطاع الجغرافي بالمدينة *</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as SectorName)}
                className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-900 focus:outline-emerald-700"
              >
                <option value="منطقة الـ 2350 فدان (سكن لكل المصريين)">منطقة الـ 2350 فدان (سكن لكل المصريين)</option>
                <option value="منطقة الإسكان الأخضر (Green Social Housing)">منطقة الإسكان الأخضر (Green Social Housing)</option>
                <option value="منطقة الـ 2940 فدان (امتداد المدينة)">منطقة الـ 2940 فدان (امتداد المدينة)</option>
                <option value="منطقة الخدمات المركزية والبنوك">منطقة الخدمات المركزية والبنوك</option>
                <option value="المحور الخدمي ومحيط محطة LRT">المحور الخدمي ومحيط محطة LRT</option>
                <option value="منطقة المرافق والرافع ومحطة المحولات">منطقة المرافق والرافع ومحطة المحولات</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">المرافقون بالجولة الميدانية</label>
              <input
                type="text"
                value={accompaniedBy}
                onChange={(e) => setAccompaniedBy(e.target.value)}
                placeholder="أدخل أسماء ومناصب المهندسين المرافقين (مدير المشروعات، مهندس الاستشاري، ممثل المقاول)"
                className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-emerald-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">ملخص الجولة وسير العمل بالموقع *</label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="صف مجريات المرور، قطاعات العمارات المفحوصة، والتواجد البشري للعمالة والمعدات..."
                className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-emerald-700 leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">التقييم العام للموقع</label>
              <select
                value={generalStatus}
                onChange={(e) => setGeneralStatus(e.target.value as any)}
                className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-900 focus:outline-emerald-700"
              >
                <option value="مقبول ومطابق">مقبول ومطابق للمواصفات</option>
                <option value="يحتاج تسريع وتكثيف">يحتاج تسريع وتكثيف معدلات العمل</option>
                <option value="ملاحظات جوهرية تستوجب إنذار">ملاحظات جوهرية تستوجب إنذار رسمي</option>
              </select>
            </div>
          </div>

          {/* Observations Builder */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">الملاحظات الفنية التفصيلية المرصودة بالموقع</h3>
                <p className="text-[11px] text-slate-500">حدد العمارة أو البند المطلوب تلافيه من المقاول</p>
              </div>
              <button
                type="button"
                onClick={addObservationRow}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة بند ملاحظة</span>
              </button>
            </div>

            <div className="space-y-3">
              {observations.map((obs, idx) => (
                <div key={obs.id} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] text-slate-600 mb-0.5">العمارة / المكان</label>
                      <input
                        type="text"
                        value={obs.buildingNo}
                        onChange={(e) => updateObservation(idx, 'buildingNo', e.target.value)}
                        placeholder="عمارة 44 / الموقع العام"
                        className="w-full border border-slate-300 bg-white rounded px-2 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] text-slate-600 mb-0.5">التصنيف</label>
                      <select
                        value={obs.category}
                        onChange={(e) => updateObservation(idx, 'category', e.target.value)}
                        className="w-full border border-slate-300 bg-white rounded px-2 py-1.5 text-xs text-slate-900"
                      >
                        <option value="تشطيبات ولاندسكيب">تشطيبات ولاندسكيب</option>
                        <option value="جودة خرسانات وبناء">جودة خرسانات وبناء</option>
                        <option value="شبكات مرافق">شبكات مرافق</option>
                        <option value="سلامة وصحة مهنية">سلامة وصحة مهنية</option>
                        <option value="عمالة وتوريدات">عمالة وتوريدات</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-600 mb-0.5">درجة الأهمية</label>
                      <select
                        value={obs.severity}
                        onChange={(e) => updateObservation(idx, 'severity', e.target.value)}
                        className="w-full border border-slate-300 bg-white rounded px-2 py-1.5 text-xs text-slate-900"
                      >
                        <option value="حرج">حرج</option>
                        <option value="متوسط">متوسط</option>
                        <option value="بسيط">بسيط</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-600 mb-0.5">مهلة التلافي</label>
                      <input
                        type="date"
                        value={obs.deadlineDate}
                        onChange={(e) => updateObservation(idx, 'deadlineDate', e.target.value)}
                        className="w-full border border-slate-300 bg-white rounded px-2 py-1.5 text-xs font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-end justify-between">
                      <div className="w-full">
                        <label className="block text-[11px] text-slate-600 mb-0.5">المسؤول</label>
                        <input
                          type="text"
                          value={obs.assignedTo}
                          onChange={(e) => updateObservation(idx, 'assignedTo', e.target.value)}
                          className="w-full border border-slate-300 bg-white rounded px-2 py-1.5 text-xs"
                        />
                      </div>
                      {observations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeObservation(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 mr-1 cursor-pointer"
                          title="حذف البند"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={obs.description}
                      onChange={(e) => updateObservation(idx, 'description', e.target.value)}
                      placeholder="بيان الملاحظة الفنية بدقة (مثال: عدم استكمال طبقة العزل، سوء تسوية بلاط الإنترلوك...)"
                      className="w-full border border-slate-300 bg-white rounded px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Analysis helper */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>التقييم الفني والتوصيات الهندسية المقترحة لرئيس الجهاز</span>
              </span>
              <button
                type="button"
                onClick={handleRunAiAnalysis}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
              >
                توليد التقييم الهندسي الفوري &larr;
              </button>
            </div>
            {aiAnalysis && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-950 leading-relaxed whitespace-pre-line">
                {aiAnalysis}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded cursor-pointer shadow-xs"
            >
              حفظ واعتماد محضر الجولة الميدانية
            </button>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH STRIP */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالمشروع، الملاحظات، أو المرافقين..."
            className="w-full pr-9 pl-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 shrink-0">تصفية حسب القطاع:</span>
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 rounded px-2.5 py-1.5 bg-white text-slate-800 focus:outline-emerald-700"
          >
            <option value="all">كافة قطاعات حدائق العاصمة</option>
            <option value="منطقة الـ 2350 فدان (سكن لكل المصريين)">منطقة الـ 2350 فدان</option>
            <option value="منطقة الإسكان الأخضر (Green Social Housing)">منطقة الإسكان الأخضر</option>
            <option value="منطقة الـ 2940 فدان (امتداد المدينة)">منطقة الـ 2940 فدان</option>
            <option value="منطقة الخدمات المركزية والبنوك">منطقة الخدمات المركزية</option>
            <option value="المحور الخدمي ومحيط محطة LRT">المحور الخدمي والـ LRT</option>
            <option value="منطقة المرافق والرافع ومحطة المحولات">منطقة المرافق والرافع</option>
          </select>
        </div>
      </div>

      {/* INSPECTIONS LIST */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-8 sm:p-10 text-center space-y-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden border-2 border-emerald-800/40 shadow-xs">
              <img
                src={fieldInspectionSiteImg}
                alt="المعاينة الميدانية"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">لا توجد جولات ميدانية مسجلة حتى الآن</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                سجل تفاصيل جولتك التفتيشية اليومية بالموقع، ورصد الملاحظات الإنشائية وتكليف المقاولين بمهل تلافيها واستخراج التقارير الرسمية المعتمدة فوراً.
              </p>
            </div>
            <button
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded cursor-pointer shadow-xs mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تسجيل أول جولة ميدانية للموقع</span>
            </button>
          </div>
        ) : (
          filtered.map((insp) => (
            <div key={insp.id} className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-900">{insp.sector}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{insp.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{insp.time}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{insp.projectName}</h3>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-700">المرافقون بالجولة: </strong>
                    {insp.accompaniedBy}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      insp.generalStatus === 'مقبول ومطابق'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {insp.generalStatus}
                  </span>
                  <button
                    onClick={() => setPrintingInspection(insp)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer"
                    title="طباعة محضر المرور الرسمي"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('هل أنت متأكد من حذف تقرير هذه الجولة؟')) {
                        onDeleteInspection(insp.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-50/70 p-3 rounded text-xs text-slate-700 leading-relaxed border border-slate-100">
                <strong className="text-slate-900 block mb-0.5">تقرير المرور الميداني:</strong>
                {insp.summary}
              </div>

              {/* Observations Checklist */}
              {insp.observations.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>قائمة الملاحظات الفنية المكلف بها المقاول ({insp.observations.length}):</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      اضغط على الملاحظة عند تلافيها بالموقع
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {insp.observations.map((obs) => (
                      <div
                        key={obs.id}
                        onClick={() => toggleObservationStatus(insp.id, obs.id)}
                        className={`p-2.5 rounded border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                          obs.isResolved
                            ? 'bg-slate-50 border-slate-200 text-slate-400'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-600'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                            obs.isResolved
                              ? 'bg-emerald-700 border-emerald-700 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {obs.isResolved && <Check className="w-3 h-3" />}
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold ${obs.isResolved ? 'line-through' : 'text-slate-900'}`}>
                              {obs.buildingNo || 'الموقع العام'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                              المهلة: {obs.deadlineDate}
                            </span>
                          </div>
                          <p className={`line-clamp-2 ${obs.isResolved ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            {obs.description}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
                            <span>{obs.category}</span>
                            <span>·</span>
                            <span>{obs.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Analysis recommendation if saved */}
              {insp.aiAnalysis && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded text-xs text-emerald-950">
                  <span className="font-bold block mb-1">التوصية الهندسية والإدارية المرفوعة:</span>
                  <p className="whitespace-pre-line leading-relaxed text-[11px]">{insp.aiAnalysis}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
