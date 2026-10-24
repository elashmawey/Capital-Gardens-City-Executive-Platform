import React, { useState } from 'react';
import { HandoverCommittee, HandoverDecision, HandoverType, SectorName, ProjectItem } from '../types';
import { OfficialPrintHeader } from './OfficialPrintHeader';
import { 
  CheckSquare, 
  Plus, 
  Printer, 
  Trash2, 
  Search, 
  Building2, 
  Calendar, 
  Users, 
  FileCheck, 
  AlertCircle,
  Check,
  ShieldCheck
} from 'lucide-react';

interface HandoverCommitteesProps {
  committees: HandoverCommittee[];
  projects: ProjectItem[];
  onSaveCommittee: (committee: HandoverCommittee) => void;
  onDeleteCommittee: (id: string) => void;
}

export const HandoverCommittees: React.FC<HandoverCommitteesProps> = ({
  committees,
  projects,
  onSaveCommittee,
  onDeleteCommittee,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [printingCommittee, setPrintingCommittee] = useState<HandoverCommittee | null>(null);

  // Form State
  const [type, setType] = useState<HandoverType>('استلام ابتدائي');
  const [projectName, setProjectName] = useState(projects[0]?.name || '');
  const [sector, setSector] = useState<SectorName>(projects[0]?.sector || 'منطقة الـ 2350 فدان (سكن لكل المصريين)');
  const [targetScope, setTargetScope] = useState('');
  const [committeeDate, setCommitteeDate] = useState(new Date().toISOString().split('T')[0]);
  const [headOfCommittee, setHeadOfCommittee] = useState('معاون رئيس جهاز تنمية مدينة حدائق العاصمة');
  const [members, setMembers] = useState(
    'مندوب قطاع التنمية بالهيئة + مدير إدارة المشروعات بالجهاز + مهندس الاستشاري المشرف + ممثل المقاول العام'
  );
  const [decision, setDecision] = useState<HandoverDecision>('استلام بتحفظ وتلافي الملاحظات');
  const [deadlineForRectification, setDeadlineForRectification] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [remarksList, setRemarksList] = useState<string[]>([
    'استكمال دهان بعض الواجهات الخلفية وتثبيت أغطية غرف التفتيش',
    'إجراء تجارب ضغط المياه للمحابس الفرعية للعمارات',
    'استكمال بلاط الإنترلوك حول المداخل لذوي الهمم',
  ]);
  const [newRemarkInput, setNewRemarkInput] = useState('');

  React.useEffect(() => {
    if (projects.length > 0 && !projectName) {
      setProjectName(projects[0].name);
      setSector(projects[0].sector);
    }
  }, [projects]);

  const handleAddRemark = () => {
    if (!newRemarkInput.trim()) return;
    setRemarksList([...remarksList, newRemarkInput.trim()]);
    setNewRemarkInput('');
  };

  const handleRemoveRemark = (index: number) => {
    setRemarksList(remarksList.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!projectName.trim() || !targetScope.trim()) {
      alert('يرجى تحديد المشروع وبيان نطاق الاستلام (العمارات أو الوحدات).');
      return;
    }

    const code = `محضر-${type === 'استلام ابتدائي' ? 'ابتدائي' : 'نهائي'}-${new Date().getFullYear()}/${Math.floor(
      10 + Math.random() * 90
    )}`;

    const newCommittee: HandoverCommittee = {
      id: `comm-${Date.now()}`,
      code,
      type,
      projectName: projectName.trim(),
      sector,
      targetScope: targetScope.trim(),
      committeeDate,
      headOfCommittee,
      members,
      decision,
      remarksList: remarksList.filter((r) => r.trim() !== ''),
      deadlineForRectification: decision === 'استلام بتحفظ وتلافي الملاحظات' ? deadlineForRectification : undefined,
      notes: notes.trim(),
      isSigned: true,
    };

    onSaveCommittee(newCommittee);
    setIsAdding(false);

    // Reset Form
    setTargetScope('');
    setNotes('');
    setRemarksList([]);
  };

  const filtered = committees.filter((c) => {
    const matchesSearch =
      c.projectName.includes(searchTerm) ||
      c.targetScope.includes(searchTerm) ||
      c.code.includes(searchTerm);
    const matchesType = filterType === 'all' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">سجل لجان ومحاضر الاستلام الابتدائي والنهائي</h1>
          <p className="text-xs text-slate-500">
            توثيق أعمال لجان فحص المشروعات والعمارات الجاهزة للتسليم للحاجزين واعتماد المحاضر الرسمية
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>تشكيل لجنة استلام جديدة</span>
        </button>
      </div>

      {/* PRINTABLE OFFICIAL HANDOVER MINUTES MODAL */}
      {printingCommittee && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 no-print">
              <span className="font-bold text-sm text-slate-800">
                معاينة محضر الاستلام الرسمي للطباعة والاعتماد
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 rounded hover:bg-emerald-900 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة المحضر</span>
                </button>
                <button
                  onClick={() => setPrintingCommittee(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded hover:bg-slate-200 cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

            {/* Official Report Document */}
            <div className="p-3 bg-white text-slate-900 space-y-5 text-xs leading-relaxed">
              <OfficialPrintHeader
                documentTitle={`محضر ${printingCommittee.type} · ${printingCommittee.targetScope}`}
                serialNumber={printingCommittee.code}
                dateStr={printingCommittee.committeeDate}
              />

              <div className="p-3 bg-slate-50 border border-slate-200 rounded grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500">المشروع / الموقع: </span>
                  <strong className="text-slate-900">{printingCommittee.projectName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">القطاع التابع له: </span>
                  <span className="text-slate-800">{printingCommittee.sector}</span>
                </div>
                <div>
                  <span className="text-slate-500">نطاق الاستلام: </span>
                  <strong className="text-slate-900">{printingCommittee.targetScope}</strong>
                </div>
                <div>
                  <span className="text-slate-500">تاريخ المعاينة: </span>
                  <span className="font-mono tabular-nums">{printingCommittee.committeeDate}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">تشكيل اللجنة: </span>
                  <span className="text-slate-800">{printingCommittee.headOfCommittee} (رئيساً) بمشاركة: {printingCommittee.members}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">قرار وتوصية اللجنة:</h4>
                <div
                  className={`p-3 rounded border font-semibold text-xs ${
                    printingCommittee.decision === 'قبول واستلام بالكامل'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : printingCommittee.decision === 'استلام بتحفظ وتلافي الملاحظات'
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-rose-50 text-rose-900 border-rose-300'
                  }`}
                >
                  {printingCommittee.decision}
                  {printingCommittee.deadlineForRectification && (
                    <span className="block mt-1 font-normal font-mono tabular-nums">
                      المهلة الزمنية المحددة للشركة المنفذة لتلافي الملاحظات: حتى {printingCommittee.deadlineForRectification}
                    </span>
                  )}
                </div>
              </div>

              {printingCommittee.remarksList.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">
                    الملاحظات الفنية المحصورة بمحضر المعاينة الميدانية:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 bg-slate-50/70 p-3 rounded border border-slate-200">
                    {printingCommittee.remarksList.map((r, i) => (
                      <li key={i} className="text-slate-800">
                        {r}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {printingCommittee.notes && (
                <div>
                  <h4 className="font-bold text-xs text-slate-800 mb-0.5">ملاحظات ختامية:</h4>
                  <p className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                    {printingCommittee.notes}
                  </p>
                </div>
              )}

              {/* 5-Party Sign-off Matrix */}
              <div className="pt-8 border-t border-slate-300 grid grid-cols-4 gap-4 text-center text-xs">
                <div>
                  <p className="font-semibold text-slate-800">مندوب الشركة المنفذة (المقاول)</p>
                  <div className="h-12 border-b border-dashed border-slate-400 mt-2"></div>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">المهندس الاستشاري المشرف</p>
                  <div className="h-12 border-b border-dashed border-slate-400 mt-2"></div>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">مدير إدارة المشروعات بالجهاز</p>
                  <div className="h-12 border-b border-dashed border-slate-400 mt-2"></div>
                </div>
                <div>
                  <p className="font-bold text-slate-900">معاون رئيس الجهاز (رئيس اللجنة)</p>
                  <div className="h-12 border-b border-dashed border-slate-400 mt-2 flex items-center justify-center">
                    <span className="text-[10px] text-slate-400">توقيع واعتماد</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD COMMITTEE FORM */}
      {isAdding && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-5 shadow-xs text-xs">
          <div className="border-b pb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">تشكيل لجنة استلام ابتدائي / نهائي جديدة</h2>
            <button
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">نوع الاستلام *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as HandoverType)}
                className="w-full border border-slate-300 rounded p-1.5 bg-white font-medium"
              >
                <option value="استلام ابتدائي">استلام ابتدائي (تسليم مشروعات/عمارات)</option>
                <option value="استلام نهائي">استلام نهائي (بعد انقضاء فترة الضمان سنة)</option>
                <option value="معاينة تمهيدية ولجنة فرعية">معاينة تمهيدية ولجنة فرعية</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">المشروع المستهدف *</label>
              {projects.length > 0 ? (
                <select
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    const p = projects.find((x) => x.name === e.target.value);
                    if (p) setSector(p.sector);
                  }}
                  className="w-full border border-slate-300 rounded p-1.5 bg-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="اسم المشروع..."
                  className="w-full border border-slate-300 rounded p-1.5"
                />
              )}
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">القطاع التابع له</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as SectorName)}
                className="w-full border border-slate-300 rounded p-1.5 bg-white"
              >
                <option value="منطقة الـ 2350 فدان (سكن لكل المصريين)">منطقة الـ 2350 فدان</option>
                <option value="منطقة الإسكان الأخضر (Green Social Housing)">منطقة الإسكان الأخضر</option>
                <option value="منطقة الـ 2940 فدان (امتداد المدينة)">منطقة الـ 2940 فدان</option>
                <option value="منطقة الخدمات المركزية والبنوك">منطقة الخدمات المركزية</option>
                <option value="المحور الخدمي ومحيط محطة LRT">المحور الخدمي والـ LRT</option>
                <option value="منطقة المرافق والرافع ومحطة المحولات">منطقة المرافق والرافع</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-medium mb-1">نطاق الاستلام وبيان العمارات / المرافق *</label>
              <input
                type="text"
                value={targetScope}
                onChange={(e) => setTargetScope(e.target.value)}
                placeholder="مثال: عمارات من 12 إلى 24 (عدد 288 وحدة سكنية مع شبكات الري واللاندسكيب)"
                className="w-full border border-slate-300 rounded p-1.5 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">تاريخ انعقاد اللجنة</label>
              <input
                type="date"
                value={committeeDate}
                onChange={(e) => setCommitteeDate(e.target.value)}
                className="w-full border border-slate-300 rounded p-1.5 font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-700 font-medium mb-1">أعضاء وتشكيل اللجنة</label>
              <input
                type="text"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                className="w-full border border-slate-300 rounded p-1.5"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">قرار وتوصية اللجنة</label>
              <select
                value={decision}
                onChange={(e) => setDecision(e.target.value as HandoverDecision)}
                className="w-full border border-slate-300 rounded p-1.5 bg-white font-bold text-slate-900"
              >
                <option value="قبول واستلام بالكامل">قبول واستلام بالكامل (مطابق)</option>
                <option value="استلام بتحفظ وتلافي الملاحظات">استلام بتحفظ وتلافي الملاحظات</option>
                <option value="رفض الاستلام لعدم الجاهزية">رفض الاستلام لعدم الجاهزية الفنية</option>
              </select>
            </div>

            {decision === 'استلام بتحفظ وتلافي الملاحظات' && (
              <div>
                <label className="block text-slate-700 font-medium mb-1">مهلة تلافي الملاحظات</label>
                <input
                  type="date"
                  value={deadlineForRectification}
                  onChange={(e) => setDeadlineForRectification(e.target.value)}
                  className="w-full border border-slate-300 rounded p-1.5 font-mono"
                />
              </div>
            )}

            <div className="sm:col-span-3">
              <label className="block text-slate-700 font-medium mb-1">الملاحظات الفنية المحصورة بالمعاينة</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newRemarkInput}
                  onChange={(e) => setNewRemarkInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRemark();
                    }
                  }}
                  placeholder="أدخل ملاحظة واضغط إضافة (مثل: ضبط مناسيب أغطية الصرف، استكمال عزل البدروم...)"
                  className="w-full border border-slate-300 rounded p-1.5"
                />
                <button
                  type="button"
                  onClick={handleAddRemark}
                  className="px-3 py-1 bg-slate-800 text-white rounded font-bold shrink-0 cursor-pointer"
                >
                  إضافة
                </button>
              </div>

              {remarksList.length > 0 && (
                <ul className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
                  {remarksList.map((r, i) => (
                    <li key={i} className="flex items-center justify-between text-xs text-slate-700">
                      <span>• {r}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRemark(i)}
                        className="text-slate-400 hover:text-rose-600 text-xs px-1"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-slate-600 bg-slate-100 rounded hover:bg-slate-200 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-white bg-emerald-800 rounded font-bold hover:bg-emerald-900 cursor-pointer shadow-xs"
            >
              اعتماد وحفظ محضر اللجنة
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالكود، المشروع، نطاق الاستلام..."
            className="w-full pr-9 pl-3 py-1.5 border border-slate-200 rounded text-slate-900"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-slate-200 rounded px-2.5 py-1.5 bg-white text-slate-800"
        >
          <option value="all">كافة أنواع المحاضر</option>
          <option value="استلام ابتدائي">استلام ابتدائي</option>
          <option value="استلام نهائي">استلام نهائي</option>
          <option value="معاينة تمهيدية ولجنة فرعية">معاينات تمهيدية</option>
        </select>
      </div>

      {/* COMMITTEES LIST */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center space-y-3">
          <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">لا توجد محاضر لجان استلام مسجلة</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            قم بتشكيل لجان الاستلام الابتدائي والنهائي للعمارات والمنشآت الخدمية وتوثيق المحاضر الرسمية مع هيئة المجتمعات العمرانية.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded cursor-pointer shadow-xs mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>تشكيل أول لجنة استلام</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((comm) => (
            <div
              key={comm.id}
              className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-bold text-slate-900 tabular-nums">{comm.code}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-800 font-bold">{comm.type}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{comm.committeeDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                      comm.decision === 'قبول واستلام بالكامل'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : comm.decision === 'استلام بتحفظ وتلافي الملاحظات'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}
                  >
                    {comm.decision}
                  </span>

                  <button
                    onClick={() => setPrintingCommittee(comm)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 cursor-pointer"
                    title="طباعة محضر الاستلام الرسمي"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>طباعة المحضر</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف محضر الاستلام كود ${comm.code}؟`)) {
                        onDeleteCommittee(comm.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50/70 p-2.5 rounded border border-slate-100">
                <div>
                  <span className="text-slate-500">المشروع: </span>
                  <strong className="text-slate-900">{comm.projectName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">نطاق الاستلام: </span>
                  <span className="text-slate-900">{comm.targetScope}</span>
                </div>
                <div>
                  <span className="text-slate-500">القطاع: </span>
                  <span>{comm.sector}</span>
                </div>
              </div>

              {comm.remarksList.length > 0 && (
                <div className="text-xs text-slate-700 space-y-1">
                  <span className="font-semibold text-slate-800">
                    ملاحظات وتكليفات تلافي اللجنة ({comm.remarksList.length}):
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 pr-1">
                    {comm.remarksList.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
