import React, { useState } from 'react';
import { CAPITAL_GARDENS_SECTORS_INFO } from '../data/initialData';
import greenHousingDistrictImg from '../assets/images/green_housing_district_1792843197511.jpg';
import capitalGardensOverviewImg from '../assets/images/capital_gardens_overview_1792843195963.jpg';
import { 
  MapPin, 
  PhoneCall, 
  Building2, 
  Trees, 
  Zap, 
  Droplet, 
  Train, 
  ShieldCheck, 
  Users, 
  ExternalLink 
} from 'lucide-react';

export const CityMapGuide: React.FC = () => {
  const [selectedSectorId, setSelectedSectorId] = useState(CAPITAL_GARDENS_SECTORS_INFO[0].id);

  const selectedSector = CAPITAL_GARDENS_SECTORS_INFO.find((s) => s.id === selectedSectorId) || CAPITAL_GARDENS_SECTORS_INFO[0];

  const emergencyContacts = [
    { title: 'غرفة العمليات المركزية بالجهاز', number: '0223108891 / 01029988771', role: 'على مدار 24 ساعة لكافة البلاغات' },
    { title: 'طوارئ مياه الشرب والكسور', number: '125 / 01156789012', role: 'رافع مياه حدائق العاصمة وشبكات التوزيع' },
    { title: 'طوارئ شبكات الكهرباء والإنارة', number: '121 / 01234567891', role: 'محطة المحولات وأعمدة الإنارة' },
    { title: 'قسم شرطة التعمير بالجهاز', number: '0223108899', role: 'تنفيذ قرارات الإزالة وضبط مخالفات البناء' },
    { title: 'نقطة الإسعاف والحماية المدنية', number: '123 / 180', role: 'المحور الخدمي المركزي' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">دليل ومخطط قطاعات مدينة حدائق العاصمة</h1>
        <p className="text-xs text-slate-500">
          المرجع الميداني للقطاعات الجغرافية، والشركات المنفذة، والمهندسين المسؤولين، وأرقام الطوارئ
        </p>
      </div>

      {/* Visual Sector Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {CAPITAL_GARDENS_SECTORS_INFO.map((sector) => (
          <button
            key={sector.id}
            onClick={() => setSelectedSectorId(sector.id)}
            className={`p-3 text-right rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
              selectedSectorId === sector.id
                ? 'bg-emerald-800 border-emerald-900 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <span className={`text-[10px] font-mono tabular-nums block ${selectedSectorId === sector.id ? 'text-emerald-200' : 'text-slate-400'}`}>
                {sector.areaAcres.toLocaleString('ar-EG')} فدان
              </span>
              <span className="text-xs font-bold leading-snug line-clamp-2 mt-0.5">{sector.name}</span>
            </div>
            <div className={`mt-2 text-[11px] font-mono font-bold tabular-nums ${selectedSectorId === sector.id ? 'text-emerald-100' : 'text-emerald-700'}`}>
              %{sector.completionRate} إنجاز
            </div>
          </button>
        ))}
      </div>

      {/* Selected Sector Details Box */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>قطاع تنفيذي معتمد</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{selectedSector.name}</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px]">المساحة الكلية</span>
              <strong className="text-slate-900 text-sm">{selectedSector.areaAcres} فدان</strong>
            </div>
            {selectedSector.housingUnits > 0 && (
              <div>
                <span className="text-slate-400 block text-[10px]">إجمالي الوحدات</span>
                <strong className="text-slate-900 text-sm">{selectedSector.housingUnits.toLocaleString('ar-EG')} وحدة</strong>
              </div>
            )}
            <div>
              <span className="text-slate-400 block text-[10px]">نسبة الإنجاز</span>
              <strong className="text-emerald-700 text-sm">%{selectedSector.completionRate}</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">أبرز المعالم والخصائص التخطيطية:</h3>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                {selectedSector.features}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-1">المهندس المشرف ومدير القطاع:</h3>
              <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-800" />
                <span className="font-semibold text-slate-800">{selectedSector.engineerInCharge}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">الشركات والتحالفات المنفذة بالقطاع:</h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedSector.activeContractors.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 text-slate-800 font-medium rounded text-xs"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Sector Visual */}
            <div className="relative rounded-lg overflow-hidden border border-slate-200 h-36">
              <img
                src={
                  selectedSector.name.includes('الأخضر')
                    ? greenHousingDistrictImg
                    : capitalGardensOverviewImg
                }
                alt={selectedSector.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-3">
                <span className="text-white text-xs font-semibold">{selectedSector.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Operations & Directory */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-emerald-800" />
          <h2 className="text-sm font-bold text-slate-900">دليل غرف العمليات والطوارئ الفورية بجهاز المدينة</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {emergencyContacts.map((contact, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">{contact.title}</span>
              <span className="font-mono font-bold text-emerald-800 tabular-nums block text-xs">
                {contact.number}
              </span>
              <p className="text-[11px] text-slate-500">{contact.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
