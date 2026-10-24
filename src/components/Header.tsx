import React from 'react';
import { PlusCircle, Printer } from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'inspections' 
  | 'projects' 
  | 'committees'
  | 'complaints' 
  | 'memos' 
  | 'toolkit'
  | 'sectors';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQuickTour: () => void;
  onPrintDailyReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickTour,
  onPrintDailyReport,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text element Brand wordmark */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 text-right hover:text-emerald-800 transition-colors cursor-pointer"
          >
            حدائق العاصمة · مكتب معاون رئيس الجهاز
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'border-emerald-700 text-emerald-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => onSelectTab('inspections')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 cursor-pointer ${
                activeTab === 'inspections'
                  ? 'border-emerald-700 text-emerald-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              الجولات الميدانية
            </button>
            <button
              onClick={() => onSelectTab('projects')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 cursor-pointer ${
                activeTab === 'projects'
                  ? 'border-emerald-700 text-emerald-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              متابعة المشروعات
            </button>
            <button
              onClick={() => onSelectTab('committees')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 cursor-pointer ${
                activeTab === 'committees'
                  ? 'border-emerald-700 text-emerald-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              لجان الاستلام
            </button>
            <button
              onClick={() => onSelectTab('complaints')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 cursor-pointer ${
                activeTab === 'complaints'
                  ? 'border-emerald-700 text-emerald-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              الشكاوى والمخالفات
            </button>
            <button
              onClick={() => onSelectTab('memos')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 cursor-pointer ${
                activeTab === 'memos'
                  ? 'border-emerald-700 text-emerald-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              المذكرات الرسمية
            </button>
            <button
              onClick={() => onSelectTab('toolkit')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 cursor-pointer ${
                activeTab === 'toolkit'
                  ? 'border-emerald-700 text-emerald-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              الأدوات واللوائح التنفيذية
            </button>
            <button
              onClick={() => onSelectTab('sectors')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 cursor-pointer ${
                activeTab === 'sectors'
                  ? 'border-emerald-700 text-emerald-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              دليل القطاعات
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onPrintDailyReport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="طباعة التقرير التنفيذي اليومي الموحد"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>طباعة التقرير</span>
            </button>
            <button
              onClick={onOpenQuickTour}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>تسجيل جولة ميدانية</span>
            </button>
          </div>
        </div>

        {/* Medium/Mobile Navigation bar */}
        <div className="flex lg:hidden items-center gap-3 py-2 border-t border-slate-100 overflow-x-auto text-xs font-medium scrollbar-none">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'dashboard' ? 'text-emerald-800 font-bold border-b border-emerald-800' : 'text-slate-600'}`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => onSelectTab('inspections')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'inspections' ? 'text-emerald-800 font-bold border-b border-emerald-800' : 'text-slate-600'}`}
          >
            الجولات
          </button>
          <button
            onClick={() => onSelectTab('projects')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'projects' ? 'text-emerald-800 font-bold border-b border-emerald-800' : 'text-slate-600'}`}
          >
            المشروعات
          </button>
          <button
            onClick={() => onSelectTab('committees')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'committees' ? 'text-emerald-800 font-bold border-b border-emerald-800' : 'text-slate-600'}`}
          >
            لجان الاستلام
          </button>
          <button
            onClick={() => onSelectTab('complaints')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'complaints' ? 'text-emerald-800 font-bold border-b border-emerald-800' : 'text-slate-600'}`}
          >
            الشكاوى
          </button>
          <button
            onClick={() => onSelectTab('memos')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'memos' ? 'text-emerald-800 font-bold border-b border-emerald-800' : 'text-slate-600'}`}
          >
            المذكرات
          </button>
          <button
            onClick={() => onSelectTab('toolkit')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'toolkit' ? 'text-emerald-800 font-bold border-b border-emerald-800' : 'text-slate-600'}`}
          >
            الحقيبة واللوائح
          </button>
          <button
            onClick={() => onSelectTab('sectors')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'sectors' ? 'text-emerald-800 font-bold border-b border-emerald-800' : 'text-slate-600'}`}
          >
            القطاعات
          </button>
        </div>
      </div>
    </header>
  );
};
