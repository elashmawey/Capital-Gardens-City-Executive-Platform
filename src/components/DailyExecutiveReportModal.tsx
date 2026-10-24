import React from 'react';
import { ProjectItem, FieldInspection, CitizenComplaint, CityViolation, ExecutiveDirective } from '../types';
import { OfficialPrintHeader } from './OfficialPrintHeader';
import { Printer, X } from 'lucide-react';

interface DailyExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  inspections: FieldInspection[];
  complaints: CitizenComplaint[];
  violations: CityViolation[];
  directives: ExecutiveDirective[];
}

export const DailyExecutiveReportModal: React.FC<DailyExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  projects,
  inspections,
  complaints,
  violations,
  directives,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const resolvedComplaints = complaints.filter((c) => c.status === 'تم الحل وإغلاق البلاغ').length;
  const criticalObs = inspections.flatMap((i) => i.observations).filter((o) => o.severity === 'حرج' && !o.isResolved);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b pb-3 no-print">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">معاينة التقرير التنفيذي اليومي الموحد للعرض على رئيس الجهاز</h3>
            <p className="text-xs text-slate-500">جاهز للطباعة الفورية على ورق A4 بترويسة جهاز تنمية مدينة حدائق العاصمة</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 rounded hover:bg-emerald-900 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة التقرير</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT */}
        <div className="bg-white text-slate-900 space-y-6 text-xs leading-relaxed p-2">
          <OfficialPrintHeader
            documentTitle="التقرير اليومي الموحد للمتابعة الميدانية والمشروعات"
            serialNumber={`تق-يومي-${new Date().getFullYear()}/${new Date().getMonth() + 1}-${new Date().getDate()}`}
            dateStr={todayStr}
          />

          {/* Section 1: Executive KPI Summary Box */}
          <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-center font-mono tabular-nums">
            <div>
              <span className="text-[11px] text-slate-500 block font-sans">الجولات الميدانية</span>
              <strong className="text-slate-900 text-sm">{inspections.length} جولات</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block font-sans">الملاحظات الحرجة الجارية</span>
              <strong className="text-rose-700 text-sm">{criticalObs.length} ملاحظة</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block font-sans">شكاوى تم حسمها</span>
              <strong className="text-emerald-700 text-sm">{resolvedComplaints} بلاغ</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block font-sans">المخالفات وقرارات الإزالة</span>
              <strong className="text-slate-900 text-sm">{violations.length} حالة</strong>
            </div>
          </div>

          {/* Section 2: Summary of Field Tours */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm border-b pb-1">
              أولاً: الجولات الميدانية والمرور التفصيلي على المواقع
            </h4>
            {inspections.length === 0 ? (
              <p className="text-slate-500 italic p-3 bg-slate-50 rounded border border-slate-200">
                لم يتم تسجيل أي جولات ميدانية لهذا اليوم حتى ساعة إعداد التقرير.
              </p>
            ) : (
              <table className="w-full text-right border border-slate-300 text-xs">
                <thead className="bg-slate-100 font-semibold text-slate-800">
                  <tr>
                    <th className="p-2 border border-slate-300">الموقع / المشروع</th>
                    <th className="p-2 border border-slate-300">القطاع</th>
                    <th className="p-2 border border-slate-300">الملاحظات وأعمال المعاينة</th>
                    <th className="p-2 border border-slate-300">التقييم</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map((insp) => (
                    <tr key={insp.id}>
                      <td className="p-2 border border-slate-300 font-bold text-slate-900">{insp.projectName}</td>
                      <td className="p-2 border border-slate-300 text-slate-600">{insp.sector}</td>
                      <td className="p-2 border border-slate-300 text-slate-700">{insp.summary}</td>
                      <td className="p-2 border border-slate-300 font-semibold">{insp.generalStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Section 3: Critical Observations Requiring Contractor Action */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm border-b pb-1">
              ثانياً: الملاحظات والتنبيهات الموجهة للشركات المنفذة والاستشاريين
            </h4>
            {inspections.flatMap((i) => i.observations).length === 0 ? (
              <p className="text-slate-500 italic p-3 bg-slate-50 rounded border border-slate-200">
                لا توجد ملاحظات إنشائية أو تعاقدية معلقة.
              </p>
            ) : (
              <div className="space-y-1.5">
                {inspections.flatMap((i) => i.observations).slice(0, 5).map((obs) => (
                  <div key={obs.id} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="font-semibold text-slate-900">
                      {obs.buildingNo || 'الموقع العام'}: {obs.description}
                    </span>
                    <div className="flex items-center gap-3 text-slate-600 font-mono tabular-nums text-[11px]">
                      <span>المكلف: {obs.assignedTo}</span>
                      <span>المهلة: {obs.deadlineDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Citizen Complaints & Municipal Violations */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm border-b pb-1">
              ثالثاً: متابعة شكاوى المواطنين وإجراءات الضبط والإزالة
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50/50">
                <span className="font-bold text-slate-800 block mb-1">شكاوى تم التعامل معها:</span>
                {complaints.length === 0 ? (
                  <p className="text-slate-400 italic">لا توجد بلاغات مسجلة حالياً.</p>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {complaints.slice(0, 4).map((c) => (
                      <li key={c.id}>
                        {c.ticketNo} - {c.category} ({c.buildingNo}): {c.status}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border border-slate-200 rounded p-2.5 bg-slate-50/50">
                <span className="font-bold text-slate-800 block mb-1">المخالفات وقرارات الإزالة الفورية:</span>
                {violations.length === 0 ? (
                  <p className="text-slate-400 italic">لا توجد مخالفات مسجلة حالياً.</p>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {violations.slice(0, 4).map((v) => (
                      <li key={v.id}>
                        {v.caseNo} - {v.violationType} ({v.locationDetails}): {v.status}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Official Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p className="font-bold text-slate-900">معاون رئيس جهاز المدينة للمتابعة الميدانية</p>
              <p className="text-[11px] text-slate-500 mt-0.5">معد التقرير</p>
              <div className="h-12 border-b border-dashed border-slate-400 mt-2 flex items-center justify-center">
                <span className="text-[10px] text-slate-400">توقيع المعاون</span>
              </div>
            </div>
            <div>
              <p className="font-bold text-slate-900">السيد المهندس / رئيس جهاز تنمية مدينة حدائق العاصمة</p>
              <p className="text-[11px] text-slate-500 mt-0.5">يعتمد ويؤشر بالتوجيهات</p>
              <div className="h-12 border-b border-dashed border-slate-400 mt-2 flex items-center justify-center">
                <span className="text-[10px] text-slate-400">تأشيرة رئيس الجهاز</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
