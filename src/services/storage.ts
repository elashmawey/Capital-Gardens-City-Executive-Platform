import { 
  ProjectItem, 
  FieldInspection, 
  CitizenComplaint, 
  CityViolation, 
  ExecutiveDirective, 
  OfficialMemoRecord,
  HandoverCommittee,
  ExecutiveMeeting 
} from '../types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_INSPECTIONS, 
  INITIAL_COMPLAINTS, 
  INITIAL_VIOLATIONS, 
  INITIAL_DIRECTIVES, 
  INITIAL_MEMOS,
  SAMPLE_DEMO_DATA 
} from '../data/initialData';

const CURRENT_VERSION = 'v3_enhanced_clean';
const VERSION_KEY = 'capgardens_storage_version';

const STORAGE_KEYS = {
  PROJECTS: 'capgardens_projects',
  INSPECTIONS: 'capgardens_inspections',
  COMPLAINTS: 'capgardens_complaints',
  VIOLATIONS: 'capgardens_violations',
  DIRECTIVES: 'capgardens_directives',
  MEMOS: 'capgardens_memos',
  COMMITTEES: 'capgardens_committees',
  MEETINGS: 'capgardens_meetings',
  ASSISTANT_PROFILE: 'capgardens_profile',
};

export interface AssistantProfile {
  name: string;
  title: string;
  department: string;
  authority: string;
  phone: string;
  officeNo: string;
}

export const DEFAULT_PROFILE: AssistantProfile = {
  name: 'معاون رئيس الجهاز',
  title: 'معاون رئيس جهاز تنمية مدينة حدائق العاصمة',
  department: 'مكتب المعاون للمتابعة الميدانية والمشروعات',
  authority: 'جهاز تنمية مدينة حدائق العاصمة - هيئة المجتمعات العمرانية الجديدة',
  phone: '',
  officeNo: 'مقر جهاز تنمية مدينة حدائق العاصمة',
};

// Check version migration and clear previous mock data automatically
function ensureCleanDataOnStartup() {
  try {
    const existingVersion = localStorage.getItem(VERSION_KEY);
    if (existingVersion !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.INSPECTIONS);
      localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
      localStorage.removeItem(STORAGE_KEYS.VIOLATIONS);
      localStorage.removeItem(STORAGE_KEYS.DIRECTIVES);
      localStorage.removeItem(STORAGE_KEYS.MEMOS);
      localStorage.removeItem(STORAGE_KEYS.COMMITTEES);
      localStorage.removeItem(STORAGE_KEYS.MEETINGS);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }
  } catch (e) {
    console.error('Storage version check failed', e);
  }
}

ensureCleanDataOnStartup();

export const StorageService = {
  getProjects(): ProjectItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  },
  saveProjects(projects: ProjectItem[]): void {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  getInspections(): FieldInspection[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INSPECTIONS);
      return data ? JSON.parse(data) : INITIAL_INSPECTIONS;
    } catch {
      return INITIAL_INSPECTIONS;
    }
  },
  saveInspections(inspections: FieldInspection[]): void {
    localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(inspections));
  },

  getComplaints(): CitizenComplaint[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      return data ? JSON.parse(data) : INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  },
  saveComplaints(complaints: CitizenComplaint[]): void {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  },

  getViolations(): CityViolation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VIOLATIONS);
      return data ? JSON.parse(data) : INITIAL_VIOLATIONS;
    } catch {
      return INITIAL_VIOLATIONS;
    }
  },
  saveViolations(violations: CityViolation[]): void {
    localStorage.setItem(STORAGE_KEYS.VIOLATIONS, JSON.stringify(violations));
  },

  getDirectives(): ExecutiveDirective[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DIRECTIVES);
      return data ? JSON.parse(data) : INITIAL_DIRECTIVES;
    } catch {
      return INITIAL_DIRECTIVES;
    }
  },
  saveDirectives(directives: ExecutiveDirective[]): void {
    localStorage.setItem(STORAGE_KEYS.DIRECTIVES, JSON.stringify(directives));
  },

  getMemos(): OfficialMemoRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMOS);
      return data ? JSON.parse(data) : INITIAL_MEMOS;
    } catch {
      return INITIAL_MEMOS;
    }
  },
  saveMemos(memos: OfficialMemoRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.MEMOS, JSON.stringify(memos));
  },

  getCommittees(): HandoverCommittee[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMMITTEES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveCommittees(committees: HandoverCommittee[]): void {
    localStorage.setItem(STORAGE_KEYS.COMMITTEES, JSON.stringify(committees));
  },

  getMeetings(): ExecutiveMeeting[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEETINGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveMeetings(meetings: ExecutiveMeeting[]): void {
    localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetings));
  },

  getProfile(): AssistantProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSISTANT_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },
  saveProfile(profile: AssistantProfile): void {
    localStorage.setItem(STORAGE_KEYS.ASSISTANT_PROFILE, JSON.stringify(profile));
  },

  resetAll(): void {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.VIOLATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DIRECTIVES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.MEMOS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.COMMITTEES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify([]));
    localStorage.removeItem(STORAGE_KEYS.ASSISTANT_PROFILE);
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  },

  loadDemoData(): void {
    this.saveProjects(SAMPLE_DEMO_DATA.projects);
    this.saveInspections(SAMPLE_DEMO_DATA.inspections);
    this.saveComplaints(SAMPLE_DEMO_DATA.complaints);
    this.saveViolations(SAMPLE_DEMO_DATA.violations);
    this.saveDirectives(SAMPLE_DEMO_DATA.directives);
    this.saveMemos(SAMPLE_DEMO_DATA.memos);
    if (SAMPLE_DEMO_DATA.committees) this.saveCommittees(SAMPLE_DEMO_DATA.committees);
  },

  exportAllData(): string {
    const backup = {
      projects: this.getProjects(),
      inspections: this.getInspections(),
      complaints: this.getComplaints(),
      violations: this.getViolations(),
      directives: this.getDirectives(),
      memos: this.getMemos(),
      committees: this.getCommittees(),
      meetings: this.getMeetings(),
      profile: this.getProfile(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllData(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.projects) this.saveProjects(parsed.projects);
      if (parsed.inspections) this.saveInspections(parsed.inspections);
      if (parsed.complaints) this.saveComplaints(parsed.complaints);
      if (parsed.violations) this.saveViolations(parsed.violations);
      if (parsed.directives) this.saveDirectives(parsed.directives);
      if (parsed.memos) this.saveMemos(parsed.memos);
      if (parsed.committees) this.saveCommittees(parsed.committees);
      if (parsed.meetings) this.saveMeetings(parsed.meetings);
      if (parsed.profile) this.saveProfile(parsed.profile);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },
};
