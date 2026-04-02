declare var bootstrap: any;

export interface PersonalData {
  name: string;
  jobtitle: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  location?: string;
}

export interface JobData {
  jobtitle: string;
  company: string;
  startdate: string;
  enddate: string;
  current?: string;
  description: string;
}

export interface DegreeData {
  title: string;
  institution: string;
  year: string;
  grade?: string;
}

export interface ProjectData {
  name: string;
  techstack: string;
  description: string;
  url?: string;
}

export interface CertData {
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeData {
  personal: PersonalData;
  summary: string;
  experience: JobData[];
  education: DegreeData[];
  skills: string[];
  projects: ProjectData[];
  certifications: CertData[];
}

export function showToast(message: string, type: 'success' | 'danger' | 'warning' = 'success') {
  const toastEl = document.getElementById('system-toast');
  const toastMsg = document.getElementById('toast-msg');
  if (toastEl && toastMsg) {
    toastEl.className = `toast text-white bg-${type} border-0`;
    toastMsg.textContent = message;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}

const STORAGE_KEY = 'resumeforge_data';

export function getFormData(): ResumeData {
  const form = document.getElementById('resume-form') as HTMLFormElement;
  const formData = new FormData(form);

  const data: ResumeData = {
    personal: {
      name: (formData.get('personal.name') as string) || '',
      jobtitle: (formData.get('personal.jobtitle') as string) || '',
      email: (formData.get('personal.email') as string) || '',
      phone: (formData.get('personal.phone') as string) || '',
      linkedin: (formData.get('personal.linkedin') as string) || '',
      github: (formData.get('personal.github') as string) || '',
      location: (formData.get('personal.location') as string) || '',
    },
    summary: (formData.get('summary') as string) || '',
    experience: [],
    education: [],
    skills: Array.from(document.querySelectorAll('.skill-badge')).map(el => (el as HTMLElement).dataset.skill || ''),
    projects: [],
    certifications: []
  };

  const expItems = document.querySelectorAll('#experience-container .repeatable-item');
  expItems.forEach((item, index) => {
    data.experience.push({
      jobtitle: (item.querySelector(`[name="job[${index}].jobtitle"]`) as HTMLInputElement)?.value || '',
      company: (item.querySelector(`[name="job[${index}].company"]`) as HTMLInputElement)?.value || '',
      startdate: (item.querySelector(`[name="job[${index}].startdate"]`) as HTMLInputElement)?.value || '',
      enddate: (item.querySelector(`[name="job[${index}].enddate"]`) as HTMLInputElement)?.value || '',
      current: (item.querySelector(`[name="job[${index}].current"]`) as HTMLInputElement)?.checked ? 'true' : undefined,
      description: (item.querySelector(`[name="job[${index}].description"]`) as HTMLTextAreaElement)?.value || '',
    });
  });

  const eduItems = document.querySelectorAll('#education-container .repeatable-item');
  eduItems.forEach((item, index) => {
    data.education.push({
      title: (item.querySelector(`[name="edu[${index}].title"]`) as HTMLInputElement)?.value || '',
      institution: (item.querySelector(`[name="edu[${index}].institution"]`) as HTMLInputElement)?.value || '',
      year: (item.querySelector(`[name="edu[${index}].year"]`) as HTMLInputElement)?.value || '',
      grade: (item.querySelector(`[name="edu[${index}].grade"]`) as HTMLInputElement)?.value || '',
    });
  });

  const projItems = document.querySelectorAll('#project-container .repeatable-item');
  projItems.forEach((item, index) => {
    data.projects.push({
      name: (item.querySelector(`[name="proj[${index}].name"]`) as HTMLInputElement)?.value || '',
      techstack: (item.querySelector(`[name="proj[${index}].techstack"]`) as HTMLInputElement)?.value || '',
      description: (item.querySelector(`[name="proj[${index}].description"]`) as HTMLTextAreaElement)?.value || '',
      url: (item.querySelector(`[name="proj[${index}].url"]`) as HTMLInputElement)?.value || '',
    });
  });

  const certItems = document.querySelectorAll('#cert-container .repeatable-item');
  certItems.forEach((item, index) => {
    data.certifications.push({
      name: (item.querySelector(`[name="cert[${index}].name"]`) as HTMLInputElement)?.value || '',
      issuer: (item.querySelector(`[name="cert[${index}].issuer"]`) as HTMLInputElement)?.value || '',
      year: (item.querySelector(`[name="cert[${index}].year"]`) as HTMLInputElement)?.value || '',
    });
  });

  return data;
}

export function saveFormState() {
  const data = getFormData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  document.dispatchEvent(new CustomEvent('formUpdated', { detail: data }));
}

function restoreFormState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const data: ResumeData = JSON.parse(saved);
    const form = document.getElementById('resume-form') as HTMLFormElement;

    (form.querySelector('[name="personal.name"]') as HTMLInputElement).value = data.personal.name || '';
    (form.querySelector('[name="personal.jobtitle"]') as HTMLInputElement).value = data.personal.jobtitle || '';
    (form.querySelector('[name="personal.email"]') as HTMLInputElement).value = data.personal.email || '';
    (form.querySelector('[name="personal.phone"]') as HTMLInputElement).value = data.personal.phone || '';
    (form.querySelector('[name="personal.linkedin"]') as HTMLInputElement).value = data.personal.linkedin || '';
    (form.querySelector('[name="personal.github"]') as HTMLInputElement).value = data.personal.github || '';
    (form.querySelector('[name="personal.location"]') as HTMLInputElement).value = data.personal.location || '';
    (form.querySelector('[name="summary"]') as HTMLTextAreaElement).value = data.summary || '';

    const skillContainer = document.getElementById('skill-container');
    const input = document.getElementById('skill-input');
    if (skillContainer && input) {
       data.skills.forEach(skill => addSkillBadge(skill, skillContainer, input));
    }

    data.experience.forEach((expr) => {
      addExperienceBlock();
      const items = document.querySelectorAll('#experience-container .repeatable-item');
      const latest = items[items.length - 1];
      const idx = items.length - 1;
      (latest.querySelector(`[name="job[${idx}].jobtitle"]`) as HTMLInputElement).value = expr.jobtitle || '';
      (latest.querySelector(`[name="job[${idx}].company"]`) as HTMLInputElement).value = expr.company || '';
      (latest.querySelector(`[name="job[${idx}].startdate"]`) as HTMLInputElement).value = expr.startdate || '';
      (latest.querySelector(`[name="job[${idx}].enddate"]`) as HTMLInputElement).value = expr.enddate || '';
      (latest.querySelector(`[name="job[${idx}].current"]`) as HTMLInputElement).checked = expr.current === 'true';
      (latest.querySelector(`[name="job[${idx}].description"]`) as HTMLTextAreaElement).value = expr.description || '';
    });

    data.education.forEach((edu) => {
      addEducationBlock();
      const items = document.querySelectorAll('#education-container .repeatable-item');
      const latest = items[items.length - 1];
      const idx = items.length - 1;
      (latest.querySelector(`[name="edu[${idx}].title"]`) as HTMLInputElement).value = edu.title || '';
      (latest.querySelector(`[name="edu[${idx}].institution"]`) as HTMLInputElement).value = edu.institution || '';
      (latest.querySelector(`[name="edu[${idx}].year"]`) as HTMLInputElement).value = edu.year || '';
      (latest.querySelector(`[name="edu[${idx}].grade"]`) as HTMLInputElement).value = edu.grade || '';
    });

    data.projects.forEach((proj) => {
      addProjectBlock();
      const items = document.querySelectorAll('#project-container .repeatable-item');
      const latest = items[items.length - 1];
      const idx = items.length - 1;
      (latest.querySelector(`[name="proj[${idx}].name"]`) as HTMLInputElement).value = proj.name || '';
      (latest.querySelector(`[name="proj[${idx}].techstack"]`) as HTMLInputElement).value = proj.techstack || '';
      (latest.querySelector(`[name="proj[${idx}].description"]`) as HTMLTextAreaElement).value = proj.description || '';
      (latest.querySelector(`[name="proj[${idx}].url"]`) as HTMLInputElement).value = proj.url || '';
    });

    data.certifications.forEach((cert) => {
      addCertBlock();
      const items = document.querySelectorAll('#cert-container .repeatable-item');
      const latest = items[items.length - 1];
      const idx = items.length - 1;
      (latest.querySelector(`[name="cert[${idx}].name"]`) as HTMLInputElement).value = cert.name || '';
      (latest.querySelector(`[name="cert[${idx}].issuer"]`) as HTMLInputElement).value = cert.issuer || '';
      (latest.querySelector(`[name="cert[${idx}].year"]`) as HTMLInputElement).value = cert.year || '';
    });
    
    setTimeout(() => { document.dispatchEvent(new CustomEvent('formUpdated', { detail: data })); }, 100);

  } catch (e) {
    console.error('Failed to restore form state', e);
  }
}

function clearFormState() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

let expCount = 0;
function addExperienceBlock() {
  const container = document.getElementById('experience-container');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'repeatable-item mb-3';
  div.innerHTML = `
    <button type="button" class="btn btn-sm btn-outline-danger remove-btn" onclick="this.parentElement.remove(); saveFormState();"><i class="bi bi-x"></i></button>
    <div class="row g-2">
      <div class="col-md-6">
        <label class="form-label small">Job Title *</label>
        <input type="text" class="form-control form-control-sm" name="job[${expCount}].jobtitle" required>
      </div>
      <div class="col-md-6">
        <label class="form-label small">Company *</label>
        <input type="text" class="form-control form-control-sm" name="job[${expCount}].company" required>
      </div>
      <div class="col-md-4">
        <label class="form-label small">Start Date *</label>
        <input type="month" class="form-control form-control-sm" name="job[${expCount}].startdate" required>
      </div>
      <div class="col-md-4">
        <label class="form-label small">End Date</label>
        <input type="month" class="form-control form-control-sm" name="job[${expCount}].enddate">
      </div>
      <div class="col-md-4 d-flex align-items-end">
        <div class="form-check pb-1">
          <input class="form-check-input" type="checkbox" name="job[${expCount}].current" value="true">
          <label class="form-check-label small">Current</label>
        </div>
      </div>
      <div class="col-12 mt-2">
        <label class="form-label small">Description (Bullet points) *</label>
        <textarea class="form-control form-control-sm" name="job[${expCount}].description" rows="3" placeholder="- Led a team of..." required></textarea>
      </div>
    </div>
  `;
  container.appendChild(div);
  expCount++;
}

let eduCount = 0;
function addEducationBlock() {
  const container = document.getElementById('education-container');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'repeatable-item mb-3';
  div.innerHTML = `
    <button type="button" class="btn btn-sm btn-outline-danger remove-btn" onclick="this.parentElement.remove(); saveFormState();"><i class="bi bi-x"></i></button>
    <div class="row g-2">
      <div class="col-md-6">
        <label class="form-label small">Degree *</label>
        <input type="text" class="form-control form-control-sm" name="edu[${eduCount}].title" placeholder="B.S. Computer Science" required>
      </div>
      <div class="col-md-6">
        <label class="form-label small">Institution *</label>
        <input type="text" class="form-control form-control-sm" name="edu[${eduCount}].institution" required>
      </div>
      <div class="col-md-6">
        <label class="form-label small">Graduation Year *</label>
        <input type="number" class="form-control form-control-sm" name="edu[${eduCount}].year" min="1900" max="2100" required>
      </div>
      <div class="col-md-6">
        <label class="form-label small">CGPA / Grade</label>
        <input type="text" class="form-control form-control-sm" name="edu[${eduCount}].grade">
      </div>
    </div>
  `;
  container.appendChild(div);
  eduCount++;
}

let proCount = 0;
function addProjectBlock() {
  const container = document.getElementById('project-container');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'repeatable-item mb-3';
  div.innerHTML = `
    <button type="button" class="btn btn-sm btn-outline-danger remove-btn" onclick="this.parentElement.remove(); saveFormState();"><i class="bi bi-x"></i></button>
    <div class="row g-2">
      <div class="col-md-6">
        <label class="form-label small">Project Name *</label>
        <input type="text" class="form-control form-control-sm" name="proj[${proCount}].name" required>
      </div>
      <div class="col-md-6">
        <label class="form-label small">Live URL</label>
        <input type="url" class="form-control form-control-sm" name="proj[${proCount}].url">
      </div>
      <div class="col-12">
        <label class="form-label small">Tech Stack *</label>
        <input type="text" class="form-control form-control-sm" name="proj[${proCount}].techstack" placeholder="React, Node.js, MongoDB" required>
      </div>
      <div class="col-12 mt-2">
        <label class="form-label small">Description *</label>
        <textarea class="form-control form-control-sm" name="proj[${proCount}].description" rows="2" required></textarea>
      </div>
    </div>
  `;
  container.appendChild(div);
  proCount++;
}

let certCount = 0;
function addCertBlock() {
  const container = document.getElementById('cert-container');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'repeatable-item mb-3';
  div.innerHTML = `
    <button type="button" class="btn btn-sm btn-outline-danger remove-btn" onclick="this.parentElement.remove(); saveFormState();"><i class="bi bi-x"></i></button>
    <div class="row g-2">
      <div class="col-md-6">
        <label class="form-label small">Certificate Name *</label>
        <input type="text" class="form-control form-control-sm" name="cert[${certCount}].name" required>
      </div>
      <div class="col-md-4">
        <label class="form-label small">Issuer *</label>
        <input type="text" class="form-control form-control-sm" name="cert[${certCount}].issuer" required>
      </div>
      <div class="col-md-2">
        <label class="form-label small">Year *</label>
        <input type="number" class="form-control form-control-sm" name="cert[${certCount}].year" required>
      </div>
    </div>
  `;
  container.appendChild(div);
  certCount++;
}

function addSkillBadge(skillText: string, container: HTMLElement, inputModeNode: HTMLElement) {
  const badge = document.createElement('span');
  badge.className = 'badge bg-primary skill-badge';
  badge.dataset.skill = skillText;
  badge.innerHTML = `${skillText} <i class="bi bi-x remove-skill"></i>`;
  badge.querySelector('.remove-skill')?.addEventListener('click', () => {
    badge.remove();
    saveFormState();
  });
  container.insertBefore(badge, inputModeNode);
}


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resume-form');
  if (form) {
    form.addEventListener('input', () => {
      saveFormState();
    });
  }

  document.getElementById('clear-form-btn')?.addEventListener('click', clearFormState);

  document.getElementById('add-experience-btn')?.addEventListener('click', () => { addExperienceBlock(); saveFormState(); });
  document.getElementById('add-education-btn')?.addEventListener('click', () => { addEducationBlock(); saveFormState(); });
  document.getElementById('add-project-btn')?.addEventListener('click', () => { addProjectBlock(); saveFormState(); });
  document.getElementById('add-cert-btn')?.addEventListener('click', () => { addCertBlock(); saveFormState(); });

  const skillInput = document.getElementById('skill-input') as HTMLInputElement;
  const skillContainer = document.getElementById('skill-container');
  if (skillInput && skillContainer) {
    skillInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = skillInput.value.trim().replace(/,$/, '');
        if (val) {
          addSkillBadge(val, skillContainer, skillInput);
          skillInput.value = '';
          saveFormState();
        }
      }
    });
  }

  restoreFormState();
});
