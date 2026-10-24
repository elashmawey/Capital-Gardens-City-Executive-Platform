import React, { useState } from 'react';
import { ProjectItem, ProjectStatus, SectorName } from '../types';
import { 
  Building2, 
  Search, 
  Plus, 
  Edit3, 
  AlertTriangle,
  Trash2,
  Calendar,
  Building
} from 'lucide-react';

interface ProjectsTrackerProps {
  projects: ProjectItem[];
  onUpdateProject: (project: ProjectItem) => void;
  onAddProject: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
  onDraftWarningMemo: (project: ProjectItem) => void;
}

export const ProjectsTracker: React.FC<ProjectsTrackerProps> = ({
  projects,
  onUpdateProject,
  onAddProject,
  onDeleteProject,
  onDraftWarningMemo,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // New project state
  const [newProject, setNewProject] = useState<Partial<ProjectItem>>({
    name: '',
    sector: 'منطقة الـ 2350 فدان (سكن لكل المصريين)',
    contractor: '',
    consultant: '',
    unitsCount: 0,
    buildingsCount: 0,
    plannedPercent: 50,
    actualPercent: 50,
    startDate: new Date().toISOString().split('T')[0],
    contractEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'منتظم بالجدول',
    budgetMillions: 100,
    notes: '',
  });

  const handleSaveNew = () => {
    if (!newProject.name?.trim() || !newProject.contractor?.trim()) {
      alert('يرجى ملء اسم المشروع والشركة المنفذة.');
      return;
    }
    const created: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: newProject.name.trim(),
      sector: (newProject.sector as SectorName) || 'منطقة الـ 2350 فدان (سكن لكل المصريين)',
      contractor: newProject.contractor.trim(),
      consultant: newProject.consultant?.trim() || 'مكتب استشاري الجهاز',
      unitsCount: Number(newProject.unitsCount) || 0,
      buildingsCount: Number(newProject.buildingsCount) || 0,
      plannedPercent: Math.min(100, Math.max(0, Number(newProject.plannedPercent) || 0)),
      actualPercent: Math.min(100, Math.max(0, Number(newProject.actualPercent) || 0)),
      startDate: newProject.startDate || new Date().toISOString().split('T')[0],
      contractEndDate: newProject.contractEndDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: (newProject.status as ProjectStatus) || 'منتظم بالجدول',
      budgetMillions: Number(newProject.budgetMillions) || 0,
      notes: newProject.notes || '',
    };
    onAddProject(created);
    setIsAdding(false);
    // Reset
    setNewProject({
      name: '',
      sector: 'منطقة الـ 2350 فدان (سكن لكل المصريين)',
      contractor: '',
      consultant: '',
      unitsCount: 0,
      buildingsCount: 0,
      plannedPercent: 50,
      actualPercent: 50,
      startDate: new Date().toISOString().split('T')[0],
      contractEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'منتظم بالجدول',
      budgetMillions: 100,
      notes: '',
    });
  };

  const handleUpdate = () => {
    if (!editingProject) return;
    onUpdateProject(editingProject);
    setEditingProject(null);
  };

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.includes(searchTerm) ||
      p.contractor.includes(searchTerm) ||
      p.consultant.includes(searchTerm);
    const matchesSector = filterSector === 'all' || p.sector === filterSector;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesSector && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">سجل المشروعات القومية والتنفيذية بحدائق العاصمة</h1>
          <p className="text-xs text-slate-500">
            متابعة الشركات المنفذة والاستشاريين ونسب الإنجاز الفعلي مقارنة بالمخطط الزمني المعتمد
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إدراج مشروع جديد بالسجل</span>
        </button>
      </div>

      {/* Add Project Drawer/Form */}
      {isAdding && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="border-b pb-2">
            <h2 className="text-sm font-bold text-slate-900">إضافة مشروع جديد لمتابعة مكتب المعاون</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-medium mb-1">اسم المشروع *</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="مشروع سكن لكل المصريين - قطاع..."
                className="w-full border border-slate-300 rounded px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">القطاع</label>
              <select
                value={newProject.sector}
                onChange={(e) => setNewProject({ ...newProject, sector: e.target.value as SectorName })}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
              >
                <option value="منطقة الـ 2350 فدان (سكن لكل المصريين)">منطقة الـ 2350 فدان</option>
                <option value="منطقة الإسكان الأخضر (Green Social Housing)">منطقة الإسكان الأخضر</option>
                <option value="منطقة الـ 2940 فدان (امتداد المدينة)">منطقة الـ 2940 فدان</option>
                <option value="منطقة الخدمات المركزية والبنوك">منطقة الخدمات المركزية</option>
                <option value="المحور الخدمي ومحيط محطة LRT">المحور الخدمي والـ LRT</option>
                <option value="منطقة المرافق والرافع ومحطة المحولات">منطقة المرافق والرافع</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">الشركة المنفذة (المقاول) *</label>
              <input
                type="text"
                value={newProject.contractor}
                onChange={(e) => setNewProject({ ...newProject, contractor: e.target.value })}
                placeholder="اسم المقاول أو الشركة العامة"
                className="w-full border border-slate-300 rounded px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">المكتب الاستشاري المشرف</label>
              <input
                type="text"
                value={newProject.consultant}
                onChange={(e) => setNewProject({ ...newProject, consultant: e.target.value })}
                placeholder="اسم المكتب الاستشاري"
                className="w-full border border-slate-300 rounded px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">عدد الوحدات والعمارات</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="الوحدات"
                  value={newProject.unitsCount || ''}
                  onChange={(e) => setNewProject({ ...newProject, unitsCount: Number(e.target.value) })}
                  className="w-1/2 border border-slate-300 rounded px-2 py-1.5"
                />
                <input
                  type="number"
                  placeholder="العمارات"
                  value={newProject.buildingsCount || ''}
                  onChange={(e) => setNewProject({ ...newProject, buildingsCount: Number(e.target.value) })}
                  className="w-1/2 border border-slate-300 rounded px-2 py-1.5"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">نسبة الإنجاز المخططة (%)</label>
              <input
                type="number"
                value={newProject.plannedPercent}
                onChange={(e) => setNewProject({ ...newProject, plannedPercent: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">نسبة الإنجاز الفعلية (%)</label>
              <input
                type="number"
                value={newProject.actualPercent}
                onChange={(e) => setNewProject({ ...newProject, actualPercent: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">الموقف التعاقدي</label>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value as ProjectStatus })}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white"
              >
                <option value="منتظم بالجدول">منتظم بالجدول</option>
                <option value="متقدم عن المخطط">متقدم عن المخطط</option>
                <option value="متأخر - إنذار أول">متأخر - إنذار أول</option>
                <option value="متعثر - دراسة سحب">متعثر - دراسة سحب</option>
                <option value="جاهز للاستلام الابتدائي">جاهز للاستلام الابتدائي</option>
                <option value="تم الاستلام النهائي">تم الاستلام النهائي</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-slate-700 font-medium mb-1">ملاحظات المتابعة الميدانية</label>
              <input
                type="text"
                value={newProject.notes}
                onChange={(e) => setNewProject({ ...newProject, notes: e.target.value })}
                placeholder="أعمال الكهرباء، واجهات العمارات، مناسيب اللاندسكيب..."
                className="w-full border border-slate-300 rounded px-2.5 py-1.5"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded hover:bg-slate-200"
            >
              إلغاء
            </button>
            <button
              onClick={handleSaveNew}
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 rounded hover:bg-emerald-900"
            >
              حفظ المشروع
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                تعديل بيانات المشروع: {editingProject.name}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block text-slate-600 mb-1">اسم المشروع</label>
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">المقاول</label>
                <input
                  type="text"
                  value={editingProject.contractor}
                  onChange={(e) => setEditingProject({ ...editingProject, contractor: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">الاستشاري</label>
                <input
                  type="text"
                  value={editingProject.consultant}
                  onChange={(e) => setEditingProject({ ...editingProject, consultant: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">نسبة الإنجاز المخططة (%)</label>
                <input
                  type="number"
                  value={editingProject.plannedPercent}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, plannedPercent: Number(e.target.value) })
                  }
                  className="w-full border border-slate-300 rounded p-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">نسبة الإنجاز الفعلية (%)</label>
                <input
                  type="number"
                  value={editingProject.actualPercent}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, actualPercent: Number(e.target.value) })
                  }
                  className="w-full border border-slate-300 rounded p-2 font-bold text-emerald-800 font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-600 mb-1">الموقف التعاقدي</label>
                <select
                  value={editingProject.status}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, status: e.target.value as ProjectStatus })
                  }
                  className="w-full border border-slate-300 rounded p-2 bg-white"
                >
                  <option value="منتظم بالجدول">منتظم بالجدول</option>
                  <option value="متقدم عن المخطط">متقدم عن المخطط</option>
                  <option value="متأخر - إنذار أول">متأخر - إنذار أول</option>
                  <option value="متعثر - دراسة سحب">متعثر - دراسة سحب</option>
                  <option value="جاهز للاستلام الابتدائي">جاهز للاستلام الابتدائي</option>
                  <option value="تم الاستلام النهائي">تم الاستلام النهائي</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-slate-600 mb-1">الملاحظات الفنية للمرور</label>
                <textarea
                  rows={2}
                  value={editingProject.notes}
                  onChange={(e) => setEditingProject({ ...editingProject, notes: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2 text-xs"
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <button
                onClick={() => {
                  if (confirm(`هل أنت متأكد من حذف مشروع "${editingProject.name}"؟`)) {
                    onDeleteProject(editingProject.id);
                    setEditingProject(null);
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
              >
                حذف المشروع من السجل
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProject(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 rounded hover:bg-emerald-900"
                >
                  حفظ التعديلات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالمشروع، المقاول، الاستشاري..."
            className="w-full pr-9 pl-3 py-1.5 border border-slate-200 rounded text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="border border-slate-200 rounded px-2.5 py-1.5 bg-white text-slate-800"
          >
            <option value="all">كافة القطاعات</option>
            <option value="منطقة الـ 2350 فدان (سكن لكل المصريين)">منطقة الـ 2350 فدان</option>
            <option value="منطقة الإسكان الأخضر (Green Social Housing)">منطقة الإسكان الأخضر</option>
            <option value="منطقة الـ 2940 فدان (امتداد المدينة)">منطقة الـ 2940 فدان</option>
            <option value="منطقة الخدمات المركزية والبنوك">منطقة الخدمات المركزية</option>
            <option value="المحور الخدمي ومحيط محطة LRT">المحور الخدمي والـ LRT</option>
            <option value="منطقة المرافق والرافع ومحطة المحولات">منطقة المرافق والرافع</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded px-2.5 py-1.5 bg-white text-slate-800"
          >
            <option value="all">كافة الحالات التعاقدية</option>
            <option value="منتظم بالجدول">منتظم بالجدول</option>
            <option value="متقدم عن المخطط">متقدم عن المخطط</option>
            <option value="متأخر - إنذار أول">متأخر - إنذار أول</option>
            <option value="متعثر - دراسة سحب">متعثر - دراسة سحب</option>
            <option value="جاهز للاستلام الابتدائي">جاهز للاستلام الابتدائي</option>
          </select>
        </div>
      </div>

      {/* Projects Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">لا توجد مشروعات مسجلة بالسجل</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            ابدأ بإدراج مشروعات الإسكان الاجتماعي، محاور الطرق، أو شبكات المرافق لمتابعة نسب الإنجاز والمقاولين.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded cursor-pointer shadow-xs mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إدراج أول مشروع الآن</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((proj) => {
            const variance = proj.actualPercent - proj.plannedPercent;
            const isDelayed = variance < -5;

            return (
              <div
                key={proj.id}
                className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{proj.sector}</span>
                    <span
                      className={`font-semibold ${
                        proj.status.includes('متقدم')
                          ? 'text-emerald-700'
                          : isDelayed
                          ? 'text-rose-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{proj.name}</h3>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500">الشركة المنفذة: </span>
                      <strong className="text-slate-800 block truncate">{proj.contractor}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">الاستشاري المشرف: </span>
                      <span className="text-slate-700 block truncate">{proj.consultant}</span>
                    </div>
                    {proj.unitsCount > 0 && (
                      <div>
                        <span className="text-slate-500">حجم الأعمال: </span>
                        <span className="text-slate-800 font-mono tabular-nums">
                          {proj.unitsCount} وحدة ({proj.buildingsCount} عمارة)
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500">نهو التعاقد: </span>
                      <span className="text-slate-800 font-mono tabular-nums">{proj.contractEndDate}</span>
                    </div>
                  </div>

                  {/* Progress Comparison */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">نسبة الإنجاز الفعلي مقابل المخطط:</span>
                      <div className="flex items-center gap-2 font-mono text-xs tabular-nums">
                        <span className="text-slate-500">المخطط: %{proj.plannedPercent}</span>
                        <span className="font-bold text-slate-900">الفعلي: %{proj.actualPercent}</span>
                        <span
                          className={`text-[11px] font-bold flex items-center ${
                            variance >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {variance >= 0 ? `+${variance}%` : `${variance}%`}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div
                        className={`h-full ${isDelayed ? 'bg-rose-600' : 'bg-emerald-700'}`}
                        style={{ width: `${Math.min(100, proj.actualPercent)}%` }}
                      />
                    </div>
                  </div>

                  {proj.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 leading-relaxed">
                      {proj.notes}
                    </p>
                  )}
                </div>

                {/* Bottom Actions for Assistant */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingProject(proj)}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف مشروع "${proj.name}"؟`)) {
                          onDeleteProject(proj.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 cursor-pointer font-medium"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>

                  {isDelayed && (
                    <button
                      onClick={() => onDraftWarningMemo(proj)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded transition-colors cursor-pointer"
                      title="صياغة خطاب إنذار أو سحب أعمال رسمي للمقاول"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                      <span>صياغة إنذار رسمي للمقاول</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
