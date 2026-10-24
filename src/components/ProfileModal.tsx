import React, { useState } from 'react';
import { AssistantProfile, StorageService } from '../services/storage';
import { Download, Upload, RotateCcw, X, Check, Database } from 'lucide-react';
import assistantAvatarImg from '../assets/images/assistant_director_avatar_1792843197718.jpg';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AssistantProfile;
  onSaveProfile: (profile: AssistantProfile) => void;
  onDataReload: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onDataReload,
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<AssistantProfile>({ ...profile });
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSave = () => {
    onSaveProfile(form);
    onClose();
  };

  const handleExport = () => {
    const dataStr = StorageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capgardens_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 3000);
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const ok = StorageService.importAllData(importJson);
    if (ok) {
      setImportStatus('تم استيراد واسترجاع البيانات بنجاح!');
      onDataReload();
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1500);
    } else {
      setImportStatus('فشل الاستيراد، تأكد من صحة ملف الـ JSON.');
    }
  };

  const handleLoadDemo = () => {
    if (confirm('هل ترغب في تحميل نماذج استرشادية لبيانات المشروعات والجولات والشكاوى؟')) {
      StorageService.loadDemoData();
      onDataReload();
      onClose();
    }
  };

  const handleResetToClean = () => {
    if (confirm('تأكيد مسح كافة البيانات والبدء بسجل فارغ ونظيف؟')) {
      StorageService.resetAll();
      onDataReload();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-lg max-w-xl w-full p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3">
            <img
              src={assistantAvatarImg}
              alt="صورة معاون رئيس الجهاز"
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-800"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{form.name || 'معاون رئيس الجهاز'}</h3>
              <p className="text-xs text-slate-500">{form.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Settings */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-800 text-xs">بيانات بطاقة المعاون التنفيذية:</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">اسم المعاون الكامل</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="أدخل اسمك الكريم..."
                className="w-full border border-slate-300 rounded p-1.5 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">المسمى الوظيفي</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-slate-300 rounded p-1.5 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">رقم الهاتف الرسمي</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="010xxxxxxxx"
                className="w-full border border-slate-300 rounded p-1.5 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">مقر المكتب بالجهاز</label>
              <input
                type="text"
                value={form.officeNo}
                onChange={(e) => setForm({ ...form, officeNo: e.target.value })}
                className="w-full border border-slate-300 rounded p-1.5 text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 rounded hover:bg-emerald-900 cursor-pointer shadow-xs"
            >
              حفظ التعديلات
            </button>
          </div>
        </div>

        {/* Data Backup & Restore */}
        <div className="border-t pt-4 space-y-3 text-xs">
          <h4 className="font-bold text-slate-800 text-xs">إدارة البيانات والنسخ الاحتياطي:</h4>
          <p className="text-[11px] text-slate-500">
            بياناتك محفوظة محلياً في جهازك. يمكنك تنزيل نسخة احتياطية أو مسح السجل والبدء من الصفر.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{copiedBackup ? 'تم تنزيل النسخة الاحتياطية ✓' : 'تنزيل نسخة احتياطية (JSON)'}</span>
            </button>
            <button
              onClick={handleResetToClean}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>مسح كافة البيانات (سجل فارغ)</span>
            </button>
            <button
              onClick={handleLoadDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-medium cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>تحميل بيانات تجريبية استرشادية</span>
            </button>
          </div>

          <div className="pt-2">
            <textarea
              rows={2}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="للاستيراد: الصق نص ملف الـ JSON هنا ثم اضغط استيراد..."
              className="w-full border border-slate-300 rounded p-1.5 text-[11px] font-mono"
            />
            {importStatus && (
              <p className="text-xs font-semibold text-emerald-700 mt-1">{importStatus}</p>
            )}
            {importJson.trim() && (
              <button
                onClick={handleImport}
                className="mt-1 px-3 py-1 text-xs bg-slate-800 text-white rounded font-bold cursor-pointer"
              >
                استيراد البيانات الآن
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
