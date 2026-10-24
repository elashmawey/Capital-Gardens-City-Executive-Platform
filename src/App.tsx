import React, { useState, useEffect } from 'react';
import { 
  ProjectItem, 
  FieldInspection, 
  CitizenComplaint, 
  CityViolation, 
  ExecutiveDirective, 
  OfficialMemoRecord,
  HandoverCommittee
} from './types';
import { StorageService, AssistantProfile, DEFAULT_PROFILE } from './services/storage';
import { Header, NavTab } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { InspectionManager } from './components/InspectionManager';
import { ProjectsTracker } from './components/ProjectsTracker';
import { HandoverCommittees } from './components/HandoverCommittees';
import { ComplaintsDesk } from './components/ComplaintsDesk';
import { AiMemoDrafter } from './components/AiMemoDrafter';
import { ExecutiveToolkit } from './components/ExecutiveToolkit';
import { CityMapGuide } from './components/CityMapGuide';
import { DailyExecutiveReportModal } from './components/DailyExecutiveReportModal';
import { ProfileModal } from './components/ProfileModal';
import assistantAvatarImg from './assets/images/assistant_director_avatar_1792843197718.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [inspections, setInspections] = useState<FieldInspection[]>([]);
  const [complaints, setComplaints] = useState<CitizenComplaint[]>([]);
  const [violations, setViolations] = useState<CityViolation[]>([]);
  const [directives, setDirectives] = useState<ExecutiveDirective[]>([]);
  const [memos, setMemos] = useState<OfficialMemoRecord[]>([]);
  const [committees, setCommittees] = useState<HandoverCommittee[]>([]);
  const [profile, setProfile] = useState<AssistantProfile>(DEFAULT_PROFILE);

  // Modals
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOpeningNewInspection, setIsOpeningNewInspection] = useState(false);
  const [memoPrefill, setMemoPrefill] = useState<{
    memoType?: string;
    topic?: string;
    details?: string;
  } | null>(null);

  // Load from Storage
  const loadData = () => {
    setProjects(StorageService.getProjects());
    setInspections(StorageService.getInspections());
    setComplaints(StorageService.getComplaints());
    setViolations(StorageService.getViolations());
    setDirectives(StorageService.getDirectives());
    setMemos(StorageService.getMemos());
    setCommittees(StorageService.getCommittees());
    setProfile(StorageService.getProfile());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Projects
  const handleUpdateProject = (updated: ProjectItem) => {
    const list = projects.map((p) => (p.id === updated.id ? updated : p));
    setProjects(list);
    StorageService.saveProjects(list);
  };

  const handleAddProject = (newProj: ProjectItem) => {
    const list = [newProj, ...projects];
    setProjects(list);
    StorageService.saveProjects(list);
  };

  const handleDeleteProject = (id: string) => {
    const list = projects.filter((p) => p.id !== id);
    setProjects(list);
    StorageService.saveProjects(list);
  };

  // Handlers for Inspections
  const handleSaveInspection = (inspection: FieldInspection) => {
    const exists = inspections.find((i) => i.id === inspection.id);
    let updatedList: FieldInspection[];
    if (exists) {
      updatedList = inspections.map((i) => (i.id === inspection.id ? inspection : i));
    } else {
      updatedList = [inspection, ...inspections];
    }
    setInspections(updatedList);
    StorageService.saveInspections(updatedList);
  };

  const handleDeleteInspection = (id: string) => {
    const list = inspections.filter((i) => i.id !== id);
    setInspections(list);
    StorageService.saveInspections(list);
  };

  // Handlers for Committees
  const handleSaveCommittee = (committee: HandoverCommittee) => {
    const exists = committees.find((c) => c.id === committee.id);
    let list: HandoverCommittee[];
    if (exists) {
      list = committees.map((c) => (c.id === committee.id ? committee : c));
    } else {
      list = [committee, ...committees];
    }
    setCommittees(list);
    StorageService.saveCommittees(list);
  };

  const handleDeleteCommittee = (id: string) => {
    const list = committees.filter((c) => c.id !== id);
    setCommittees(list);
    StorageService.saveCommittees(list);
  };

  // Handlers for Complaints & Violations
  const handleUpdateComplaint = (complaint: CitizenComplaint) => {
    const list = complaints.map((c) => (c.id === complaint.id ? complaint : c));
    setComplaints(list);
    StorageService.saveComplaints(list);
  };

  const handleAddComplaint = (complaint: CitizenComplaint) => {
    const list = [complaint, ...complaints];
    setComplaints(list);
    StorageService.saveComplaints(list);
  };

  const handleDeleteComplaint = (id: string) => {
    const list = complaints.filter((c) => c.id !== id);
    setComplaints(list);
    StorageService.saveComplaints(list);
  };

  const handleUpdateViolation = (violation: CityViolation) => {
    const list = violations.map((v) => (v.id === violation.id ? violation : v));
    setViolations(list);
    StorageService.saveViolations(list);
  };

  const handleAddViolation = (violation: CityViolation) => {
    const list = [violation, ...violations];
    setViolations(list);
    StorageService.saveViolations(list);
  };

  const handleDeleteViolation = (id: string) => {
    const list = violations.filter((v) => v.id !== id);
    setViolations(list);
    StorageService.saveViolations(list);
  };

  // Handlers for Directives
  const handleAddDirective = (directive: ExecutiveDirective) => {
    const list = [directive, ...directives];
    setDirectives(list);
    StorageService.saveDirectives(list);
  };

  const handleUpdateDirective = (directive: ExecutiveDirective) => {
    const list = directives.map((d) => (d.id === directive.id ? directive : d));
    setDirectives(list);
    StorageService.saveDirectives(list);
  };

  const handleDeleteDirective = (id: string) => {
    const list = directives.filter((d) => d.id !== id);
    setDirectives(list);
    StorageService.saveDirectives(list);
  };

  // Handlers for Memos
  const handleSaveMemo = (memo: OfficialMemoRecord) => {
    const list = [memo, ...memos];
    setMemos(list);
    StorageService.saveMemos(list);
  };

  const handleDeleteMemo = (id: string) => {
    const list = memos.filter((m) => m.id !== id);
    setMemos(list);
    StorageService.saveMemos(list);
  };

  // Handler for Profile
  const handleSaveProfile = (newProfile: AssistantProfile) => {
    setProfile(newProfile);
    StorageService.saveProfile(newProfile);
  };

  // Pre-fill action to memo from project
  const handleDraftWarningMemo = (project: ProjectItem) => {
    setMemoPrefill({
      memoType: 'خطاب إنذار وسحب أعمال',
      topic: `إنذار رسمي للشركة المنفذة (${project.contractor}) بشأن تأخر مشروع ${project.name}`,
      details: `تبين بالمرور الميداني والمطابقة الزمنية أن نسبة الإنجاز الفعلي ${project.actualPercent}% مقارنة بالمخطط ${project.plannedPercent}% بفارق زمني (${project.plannedPercent - project.actualPercent}%)، ووجود بطء في توفير مستلزمات التشطيب والعمالة بالموقع.`,
    });
    setActiveTab('memos');
  };

  // Pre-fill action to memo from violation
  const handleDraftRemovalMemo = (violation: CityViolation) => {
    setMemoPrefill({
      memoType: 'مذكرة استصدار قرار إزالة فورية',
      topic: `استصدار قرار إزالة فورية للمخالفة (${violation.violationType}) في ${violation.locationDetails}`,
      details: `المعاينة الميدانية تفيد قيام المخالف (${violation.violatorName}) بارتكاب مخالفة بناء وتغيير نشاط بالمنطقة بالمخالفة لأحكام قانون البناء رقم 119 لسنة 2008 وتعديلاته واللائحة العقارية لهيئة المجتمعات العمرانية.`,
    });
    setActiveTab('memos');
  };

  const handleCustomDraftMemo = (prefill: { memoType: string; topic: string; details: string }) => {
    setMemoPrefill(prefill);
    setActiveTab('memos');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-700 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQuickTour={() => {
          setActiveTab('inspections');
          setIsOpeningNewInspection(true);
        }}
        onPrintDailyReport={() => setIsDailyReportOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            projects={projects}
            inspections={inspections}
            complaints={complaints}
            violations={violations}
            directives={directives}
            onNavigate={setActiveTab}
            onOpenNewInspection={() => {
              setActiveTab('inspections');
              setIsOpeningNewInspection(true);
            }}
            onAddDirective={handleAddDirective}
            onUpdateDirective={handleUpdateDirective}
            onDeleteDirective={handleDeleteDirective}
          />
        )}

        {activeTab === 'inspections' && (
          <InspectionManager
            inspections={inspections}
            projects={projects}
            onSaveInspection={handleSaveInspection}
            onDeleteInspection={handleDeleteInspection}
            initialOpenNew={isOpeningNewInspection}
            onResetOpenNew={() => setIsOpeningNewInspection(false)}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsTracker
            projects={projects}
            onUpdateProject={handleUpdateProject}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onDraftWarningMemo={handleDraftWarningMemo}
          />
        )}

        {activeTab === 'committees' && (
          <HandoverCommittees
            committees={committees}
            projects={projects}
            onSaveCommittee={handleSaveCommittee}
            onDeleteCommittee={handleDeleteCommittee}
          />
        )}

        {activeTab === 'complaints' && (
          <ComplaintsDesk
            complaints={complaints}
            violations={violations}
            onUpdateComplaint={handleUpdateComplaint}
            onAddComplaint={handleAddComplaint}
            onDeleteComplaint={handleDeleteComplaint}
            onUpdateViolation={handleUpdateViolation}
            onAddViolation={handleAddViolation}
            onDeleteViolation={handleDeleteViolation}
            onDraftRemovalMemo={handleDraftRemovalMemo}
          />
        )}

        {activeTab === 'memos' && (
          <AiMemoDrafter
            memos={memos}
            onSaveMemo={handleSaveMemo}
            onDeleteMemo={handleDeleteMemo}
            prefillData={memoPrefill}
          />
        )}

        {activeTab === 'toolkit' && (
          <ExecutiveToolkit
            projects={projects}
            complaints={complaints}
            inspections={inspections}
            onDraftMemo={handleCustomDraftMemo}
          />
        )}

        {activeTab === 'sectors' && <CityMapGuide />}
      </main>

      {/* Footer (No-print) */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 hover:text-slate-900 transition-colors text-right cursor-pointer"
            >
              <img
                src={assistantAvatarImg}
                alt="المعاون"
                className="w-7 h-7 rounded-full object-cover border border-emerald-700"
              />
              <span className="font-semibold text-slate-800">{profile.name || 'معاون رئيس الجهاز'}</span>
              <span>· {profile.title}</span>
            </button>
          </div>

          <div className="text-center sm:text-left text-[11px] text-slate-400">
            جمهورية مصر العربية · وزارة الإسكان والمرافق والمجتمعات العمرانية · جهاز تنمية مدينة حدائق العاصمة
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DailyExecutiveReportModal
        isOpen={isDailyReportOpen}
        onClose={() => setIsDailyReportOpen(false)}
        projects={projects}
        inspections={inspections}
        complaints={complaints}
        violations={violations}
        directives={directives}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onDataReload={loadData}
      />
    </div>
  );
}
