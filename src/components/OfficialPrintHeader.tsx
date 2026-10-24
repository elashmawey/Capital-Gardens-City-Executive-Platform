import React from 'react';

interface OfficialPrintHeaderProps {
  documentTitle: string;
  serialNumber?: string;
  dateStr?: string;
}

export const OfficialPrintHeader: React.FC<OfficialPrintHeaderProps> = ({
  documentTitle,
  serialNumber = 'م-2026/084',
  dateStr = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
}) => {
  return (
    <div className="border-b-2 border-slate-900 pb-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Right side: Official Entity Details in Arabic */}
        <div className="text-right space-y-0.5 text-xs text-slate-800 leading-tight">
          <p className="font-bold text-sm text-slate-950">جمهورية مصر العربية</p>
          <p>وزارة الإسكان والمرافق والمجتمعات العمرانية</p>
          <p className="font-semibold text-slate-900">هيئة المجتمعات العمرانية الجديدة</p>
          <p className="font-bold text-emerald-800">جهاز تنمية مدينة حدائق العاصمة</p>
          <p className="text-slate-600 font-medium">مكتب معاون رئيس الجهاز للمتابعة الميدانية</p>
        </div>

        {/* Center: Emblem / Coat of arms symbol */}
        <div className="text-center px-4">
          <div className="w-14 h-14 mx-auto border border-amber-600/40 rounded-full flex items-center justify-center bg-amber-50/50 mb-1">
            <span className="text-amber-800 font-bold text-xs">نماء وتعمير</span>
          </div>
          <p className="text-[11px] font-bold text-slate-700 tracking-wider">حدائق العاصمة</p>
        </div>

        {/* Left side: Document Metadata */}
        <div className="text-left space-y-1 text-xs text-slate-700">
          <div>
            <span className="text-slate-500">رقم القيد: </span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">{serialNumber}</span>
          </div>
          <div>
            <span className="text-slate-500">التاريخ: </span>
            <span className="font-medium text-slate-900 tabular-nums">{dateStr}</span>
          </div>
          <div>
            <span className="text-slate-500">درجة السرية: </span>
            <span className="text-emerald-700 font-semibold">مكاتبة رسمية</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-300 text-center">
        <h2 className="text-base font-bold text-slate-900 tracking-wide">{documentTitle}</h2>
      </div>
    </div>
  );
};
