import React, { useState } from 'react';
import { CitizenComplaint, CityViolation, ComplaintStatus, ViolationStatus, SectorName, ComplaintCategory } from '../types';
import { 
  MessageSquareWarning, 
  ShieldAlert, 
  Search, 
  Plus, 
  Trash2,
  Edit,
  FileText,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

interface ComplaintsDeskProps {
  complaints: CitizenComplaint[];
  violations: CityViolation[];
  onUpdateComplaint: (complaint: CitizenComplaint) => void;
  onAddComplaint: (complaint: CitizenComplaint) => void;
  onDeleteComplaint: (id: string) => void;
  onUpdateViolation: (violation: CityViolation) => void;
  onAddViolation: (violation: CityViolation) => void;
  onDeleteViolation: (id: string) => void;
  onDraftRemovalMemo: (violation: CityViolation) => void;
}

export const ComplaintsDesk: React.FC<ComplaintsDeskProps> = ({
  complaints,
  violations,
  onUpdateComplaint,
  onAddComplaint,
  onDeleteComplaint,
  onUpdateViolation,
  onAddViolation,
  onDeleteViolation,
  onDraftRemovalMemo,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'complaints' | 'violations'>('complaints');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddingComplaint, setIsAddingComplaint] = useState(false);
  const [isAddingViolation, setIsAddingViolation] = useState(false);

  // New Complaint State
  const [newComp, setNewComp] = useState<Partial<CitizenComplaint>>({
    citizenName: '',
    phone: '',
    sector: 'منطقة الـ 2350 فدان (سكن لكل المصريين)',
    buildingNo: '',
    flatNo: '',
    category: 'مياه شرب وصرف',
    details: '',
    status: 'جديدة',
  });

  // New Violation State
  const [newViol, setNewViol] = useState<Partial<CityViolation>>({
    sector: 'منطقة الـ 2350 فدان (سكن لكل المصريين)',
    locationDetails: '',
    violationType: 'تغيير نشاط من سكني لتجاري',
    violatorName: '',
    status: 'تحرير محضر مخالفة',
    policeCoordination: true,
    notes: '',
  });

  const handleSaveComplaint = () => {
    if (!newComp.citizenName?.trim() || !newComp.details?.trim() || !newComp.buildingNo?.trim()) {
      alert('يرجى ملء اسم المواطن، رقم العمارة، وتفاصيل الشكوى.');
      return;
    }
    const ticketNo = `C-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const created: CitizenComplaint = {
      id: `comp-${Date.now()}`,
      ticketNo,
      citizenName: newComp.citizenName.trim(),
      phone: newComp.phone?.trim() || '',
      sector: (newComp.sector as SectorName) || 'منطقة الـ 2350 فدان (سكن لكل المصريين)',
      buildingNo: newComp.buildingNo.trim(),
      flatNo: newComp.flatNo?.trim() || '',
      category: (newComp.category as ComplaintCategory) || 'مياه شرب وصرف',
      details: newComp.details.trim(),
      receivedDate: new Date().toISOString().split('T')[0],
      status: 'جديدة',
      actionTaken: 'تم تسجيل البلاغ وإحالته لإدارة التشغيل والصيانة للمعاينة الفورية.',
    };
    onAddComplaint(created);
    setIsAddingComplaint(false);
    setNewComp({
      citizenName: '',
      phone: '',
      sector: 'منطقة الـ 2350 فدان (سكن لكل المصريين)',
      buildingNo: '',
      flatNo: '',
      category: 'مياه شرب وصرف',
      details: '',
      status: 'جديدة',
    });
  };

  const handleSaveViolation = () => {
    if (!newViol.locationDetails?.trim() || !newViol.notes?.trim()) {
      alert('يرجى ملء بيانات الموقع والملاحظات.');
      return;
    }
    const caseNo = `V-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const created: CityViolation = {
      id: `viol-${Date.now()}`,
      caseNo,
      sector: (newViol.sector as SectorName) || 'منطقة الـ 2350 فدان (سكن لكل المصريين)',
      locationDetails: newViol.locationDetails.trim(),
      violationType: (newViol.violationType as any) || 'تغيير نشاط من سكني لتجاري',
      violatorName: newViol.violatorName?.trim() || 'صاحب المنشأة / المخالف',
      detectionDate: new Date().toISOString().split('T')[0],
      status: (newViol.status as ViolationStatus) || 'تحرير محضر مخالفة',
      policeCoordination: !!newViol.policeCoordination,
      notes: newViol.notes.trim(),
    };
    onAddViolation(created);
    setIsAddingViolation(false);
    setNewViol({
      sector: 'منطقة الـ 2350 فدان (سكن لكل المصريين)',
      locationDetails: '',
      violationType: 'تغيير نشاط من سكني لتجاري',
      violatorName: '',
      status: 'تحرير محضر مخالفة',
      policeCoordination: true,
      notes: '',
    });
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.ticketNo.includes(searchTerm) ||
      c.citizenName.includes(searchTerm) ||
      c.buildingNo.includes(searchTerm) ||
      c.details.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter violations
  const filteredViolations = violations.filter((v) => {
    const matchesSearch =
      v.caseNo.includes(searchTerm) ||
      v.locationDetails.includes(searchTerm) ||
      v.notes.includes(searchTerm) ||
      v.violatorName.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Sub-Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">غرفة شكاوى المواطنين والمخالفات والإشغالات</h1>
          <p className="text-xs text-slate-500">
            متابعة بلاغات الخدمات الحيوية، وتنسيق حملات الإزالة الفورية مع شرطة التعمير وإدارة الأمن
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveSubTab('complaints');
              setStatusFilter('all');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'complaints'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            شكاوى المواطنين ({complaints.length})
          </button>
          <button
            onClick={() => {
              setActiveSubTab('violations');
              setStatusFilter('all');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'violations'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            المخالفات وقرارات الإزالة ({violations.length})
          </button>
        </div>
      </div>

      {/* COMPLAINTS VIEW */}
      {activeSubTab === 'complaints' && (
        <div className="space-y-5">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="بحث برقم البلاغ، المواطن، العمارة..."
                  className="w-full pr-9 pl-3 py-1.5 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded px-2.5 py-1.5 bg-white text-slate-800"
              >
                <option value="all">كافة الحالات</option>
                <option value="جديدة">جديدة</option>
                <option value="قيد الفحص والنزول">قيد الفحص والنزول</option>
                <option value="تم التكليف بالصيانة">تم التكليف بالصيانة</option>
                <option value="تم الحل وإغلاق البلاغ">تم الحل وإغلاق البلاغ</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddingComplaint(!isAddingComplaint)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تسجيل بلاغ مواطن جديد</span>
            </button>
          </div>

          {/* Add Complaint Form */}
          {isAddingComplaint && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900">تسجيل بلاغ شكوى مواطن</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 mb-1">اسم المواطن الشاكي *</label>
                  <input
                    type="text"
                    value={newComp.citizenName}
                    onChange={(e) => setNewComp({ ...newComp, citizenName: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">رقم الهاتف للتواصل</label>
                  <input
                    type="tel"
                    value={newComp.phone}
                    onChange={(e) => setNewComp({ ...newComp, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">نوع الشكوى / المرفق</label>
                  <select
                    value={newComp.category}
                    onChange={(e) => setNewComp({ ...newComp, category: e.target.value as ComplaintCategory })}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white"
                  >
                    <option value="مياه شرب وصرف">مياه شرب وصرف</option>
                    <option value="إنارة وطاقة">إنارة وطاقة</option>
                    <option value="نظافة ومخلفات">نظافة ومخلفات</option>
                    <option value="تشغيل مصاعد">تشغيل مصاعد</option>
                    <option value="طرق ومحاور">طرق ومحاور</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">القطاع الجغرافي</label>
                  <select
                    value={newComp.sector}
                    onChange={(e) => setNewComp({ ...newComp, sector: e.target.value as SectorName })}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white"
                  >
                    <option value="منطقة الـ 2350 فدان (سكن لكل المصريين)">منطقة الـ 2350 فدان</option>
                    <option value="منطقة الإسكان الأخضر (Green Social Housing)">منطقة الإسكان الأخضر</option>
                    <option value="منطقة الـ 2940 فدان (امتداد المدينة)">منطقة الـ 2940 فدان</option>
                    <option value="منطقة الخدمات المركزية والبنوك">منطقة الخدمات المركزية</option>
                    <option value="المحور الخدمي ومحيط محطة LRT">المحور الخدمي والـ LRT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">رقم العمارة والموقع *</label>
                  <input
                    type="text"
                    value={newComp.buildingNo}
                    onChange={(e) => setNewComp({ ...newComp, buildingNo: e.target.value })}
                    placeholder="عمارة 24 أو الشارع..."
                    className="w-full border border-slate-300 rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">رقم الشقة (إن وجد)</label>
                  <input
                    type="text"
                    value={newComp.flatNo}
                    onChange={(e) => setNewComp({ ...newComp, flatNo: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-slate-700 mb-1">تفاصيل الشكوى بدقة *</label>
                  <textarea
                    rows={2}
                    value={newComp.details}
                    onChange={(e) => setNewComp({ ...newComp, details: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs"
                    placeholder="شرح المشكلة والملاحظة المرصودة من المواطن..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setIsAddingComplaint(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveComplaint}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 rounded hover:bg-emerald-900"
                >
                  حفظ البلاغ
                </button>
              </div>
            </div>
          )}

          {/* Complaints Table/Cards */}
          {filteredComplaints.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-10 text-center space-y-3">
              <MessageSquareWarning className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">لا توجد شكاوى مواطنين مسجلة</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                يمكنك تسجيل شكاوى المياه والإنارة والنظافة وتشغيل المصاعد ومتابعة إجراءات الصيانة وإغلاق البلاغات.
              </p>
              <button
                onClick={() => setIsAddingComplaint(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded cursor-pointer shadow-xs mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>تسجيل أول بلاغ شكوى</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComplaints.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-slate-900 tabular-nums">{comp.ticketNo}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-800 font-medium">{comp.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{comp.receivedDate}</span>
                    </div>

                    {/* Status Dropdown & Delete */}
                    <div className="flex items-center gap-2">
                      <select
                        value={comp.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as ComplaintStatus;
                          onUpdateComplaint({
                            ...comp,
                            status: newStatus,
                            resolvedDate: newStatus === 'تم الحل وإغلاق البلاغ' ? new Date().toISOString().split('T')[0] : comp.resolvedDate,
                          });
                        }}
                        className={`text-xs font-semibold px-2 py-1 rounded border cursor-pointer ${
                          comp.status === 'تم الحل وإغلاق البلاغ'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : comp.status === 'جديدة'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="جديدة">جديدة</option>
                        <option value="قيد الفحص والنزول">قيد الفحص والنزول</option>
                        <option value="تم التكليف بالصيانة">تم التكليف بالصيانة</option>
                        <option value="تم الحل وإغلاق البلاغ">تم الحل وإغلاق البلاغ</option>
                      </select>

                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف البلاغ رقم ${comp.ticketNo}؟`)) {
                            onDeleteComplaint(comp.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="حذف البلاغ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 bg-slate-50/60 p-2.5 rounded border border-slate-100">
                    <div>
                      <span className="text-slate-500">الشاكي: </span>
                      <strong className="text-slate-900">{comp.citizenName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">الهاتف: </span>
                      <span className="font-mono tabular-nums text-slate-900">{comp.phone || 'غير مسجل'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">الموقع: </span>
                      <span>{comp.sector} · {comp.buildingNo} {comp.flatNo ? `· شقة ${comp.flatNo}` : ''}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed">{comp.details}</p>

                  <div className="text-xs text-slate-600 bg-emerald-50/40 p-2 rounded border border-emerald-100 flex items-center justify-between">
                    <div>
                      <strong className="text-emerald-950 font-semibold">الإجراء التنفيذي المتخذ: </strong>
                      <span>{comp.actionTaken}</span>
                    </div>
                    <button
                      onClick={() => {
                        const note = prompt('تحديث الإجراء التنفيذي المتخذ:', comp.actionTaken || '');
                        if (note !== null) {
                          onUpdateComplaint({ ...comp, actionTaken: note });
                        }
                      }}
                      className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold underline shrink-0 mr-2"
                    >
                      تعديل الإجراء
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIOLATIONS & REMOVALS VIEW */}
      {activeSubTab === 'violations' && (
        <div className="space-y-5">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="بحث بالمخالفة، الموقع، الاسم..."
                  className="w-full pr-9 pl-3 py-1.5 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded px-2.5 py-1.5 bg-white text-slate-800"
              >
                <option value="all">كافة الحالات</option>
                <option value="رصد أولي">رصد أولي</option>
                <option value="تحرير محضر مخالفة">تحرير محضر مخالفة</option>
                <option value="صدور قرار إزالة">صدور قرار إزالة</option>
                <option value="تمت الإزالة الفورية">تمت الإزالة الفورية</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddingViolation(!isAddingViolation)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>رصد مخالفة جديدة / إشغال</span>
            </button>
          </div>

          {/* Add Violation Form */}
          {isAddingViolation && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900">رصد مخالفة بنائية أو إشغال تجاري</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 mb-1">نوع المخالفة *</label>
                  <select
                    value={newViol.violationType}
                    onChange={(e) => setNewViol({ ...newViol, violationType: e.target.value as any })}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white"
                  >
                    <option value="تغيير نشاط من سكني لتجاري">تغيير نشاط من سكني لتجاري</option>
                    <option value="غلق ردود أو مظلات غير مصرحة">غلق ردود أو مظلات غير مصرحة</option>
                    <option value="إشغال رصيف وطريق">إشغال رصيف وطريق</option>
                    <option value="تعديل إنشائي دون ترخيص">تعديل إنشائي دون ترخيص</option>
                    <option value="لافتات مخالفة">لافتات مخالفة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">القطاع الجغرافي</label>
                  <select
                    value={newViol.sector}
                    onChange={(e) => setNewViol({ ...newViol, sector: e.target.value as SectorName })}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white"
                  >
                    <option value="منطقة الـ 2350 فدان (سكن لكل المصريين)">منطقة الـ 2350 فدان</option>
                    <option value="منطقة الإسكان الأخضر (Green Social Housing)">منطقة الإسكان الأخضر</option>
                    <option value="منطقة الـ 2940 فدان (امتداد المدينة)">منطقة الـ 2940 فدان</option>
                    <option value="منطقة الخدمات المركزية والبنوك">منطقة الخدمات المركزية</option>
                    <option value="المحور الخدمي ومحيط محطة LRT">المحور الخدمي والـ LRT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">المخالف أو صاحب المنشأة</label>
                  <input
                    type="text"
                    value={newViol.violatorName}
                    onChange={(e) => setNewViol({ ...newViol, violatorName: e.target.value })}
                    placeholder="اسم المخالف أو المحل"
                    className="w-full border border-slate-300 rounded p-1.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 mb-1">تفاصيل وموقع المخالفة *</label>
                  <input
                    type="text"
                    value={newViol.locationDetails}
                    onChange={(e) => setNewViol({ ...newViol, locationDetails: e.target.value })}
                    placeholder="عمارة 14 الدور الأرضي شقة 1 واجهة خلفية..."
                    className="w-full border border-slate-300 rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">الحالة الإجرائية</label>
                  <select
                    value={newViol.status}
                    onChange={(e) => setNewViol({ ...newViol, status: e.target.value as ViolationStatus })}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white"
                  >
                    <option value="رصد أولي">رصد أولي</option>
                    <option value="تحرير محضر مخالفة">تحرير محضر مخالفة</option>
                    <option value="صدور قرار إزالة">صدور قرار إزالة</option>
                    <option value="تمت الإزالة الفورية">تمت الإزالة الفورية</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-slate-700 mb-1">ملاحظات الضبط وتنسيق شرطة التعمير *</label>
                  <textarea
                    rows={2}
                    value={newViol.notes}
                    onChange={(e) => setNewViol({ ...newViol, notes: e.target.value })}
                    placeholder="تحريز المعدات، التنسيق مع قوة قسم شرطة التعمير، تاريخ المعاينة..."
                    className="w-full border border-slate-300 rounded p-1.5 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setIsAddingViolation(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveViolation}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-700 rounded hover:bg-rose-800"
                >
                  حفظ وتسجيل المخالفة
                </button>
              </div>
            </div>
          )}

          {/* Violations List */}
          {filteredViolations.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-10 text-center space-y-3">
              <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">لا توجد مخالفات أو إشغالات مسجلة</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                رصد حالات تغيير النشاط من سكني لتجاري، غلق الردود، وتنسيق حملات الإزالة الفورية مع شرطة التعمير.
              </p>
              <button
                onClick={() => setIsAddingViolation(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded cursor-pointer shadow-xs mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>رصد أول مخالفة بنائية</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredViolations.map((viol) => (
                <div
                  key={viol.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-rose-800 tabular-nums">{viol.caseNo}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-900 font-bold">{viol.violationType}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{viol.detectionDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={viol.status}
                        onChange={(e) => {
                          onUpdateViolation({
                            ...viol,
                            status: e.target.value as ViolationStatus,
                          });
                        }}
                        className={`text-xs font-semibold px-2 py-1 rounded border cursor-pointer ${
                          viol.status === 'تمت الإزالة الفورية'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="رصد أولي">رصد أولي</option>
                        <option value="تحرير محضر مخالفة">تحرير محضر مخالفة</option>
                        <option value="صدور قرار إزالة">صدور قرار إزالة</option>
                        <option value="تمت الإزالة الفورية">تمت الإزالة الفورية</option>
                      </select>

                      <button
                        onClick={() => onDraftRemovalMemo(viol)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 cursor-pointer"
                        title="صياغة مذكرة قرار إزالة فورية لرئيس الجهاز"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>مذكرة إزالة</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف المخالفة رقم ${viol.caseNo}؟`)) {
                            onDeleteViolation(viol.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 bg-slate-50/60 p-2.5 rounded border border-slate-100">
                    <div>
                      <span className="text-slate-500">الموقع: </span>
                      <strong className="text-slate-900">{viol.locationDetails}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">المخالف: </span>
                      <span className="text-slate-900">{viol.violatorName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">القطاع: </span>
                      <span>{viol.sector}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed">{viol.notes}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>
                      التنسيق الأمني: {viol.policeCoordination ? 'مؤكد مع شرطة التعمير بالجهاز' : 'جاري التنسيق'}
                    </span>
                    {viol.decisionMemoNo && (
                      <span className="font-semibold text-slate-700">رقم السند الإداري: {viol.decisionMemoNo}</span>
                    )}
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
