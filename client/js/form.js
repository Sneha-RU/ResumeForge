export function showToast(message, type = 'success') {
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
export function getFormData() {
    const form = document.getElementById('resume-form');
    const formData = new FormData(form);
    const data = {
        personal: {
            name: formData.get('personal.name') || '',
            jobtitle: formData.get('personal.jobtitle') || '',
            email: formData.get('personal.email') || '',
            phone: formData.get('personal.phone') || '',
            linkedin: formData.get('personal.linkedin') || '',
            github: formData.get('personal.github') || '',
            location: formData.get('personal.location') || '',
        },
        summary: formData.get('summary') || '',
        experience: [],
        education: [],
        skills: Array.from(document.querySelectorAll('.skill-badge')).map(el => el.dataset.skill || ''),
        projects: [],
        certifications: []
    };
    const expItems = document.querySelectorAll('#experience-container .repeatable-item');
    expItems.forEach((item, index) => {
        var _a, _b, _c, _d, _e, _f;
        data.experience.push({
            jobtitle: ((_a = item.querySelector(`[name="job[${index}].jobtitle"]`)) === null || _a === void 0 ? void 0 : _a.value) || '',
            company: ((_b = item.querySelector(`[name="job[${index}].company"]`)) === null || _b === void 0 ? void 0 : _b.value) || '',
            startdate: ((_c = item.querySelector(`[name="job[${index}].startdate"]`)) === null || _c === void 0 ? void 0 : _c.value) || '',
            enddate: ((_d = item.querySelector(`[name="job[${index}].enddate"]`)) === null || _d === void 0 ? void 0 : _d.value) || '',
            current: ((_e = item.querySelector(`[name="job[${index}].current"]`)) === null || _e === void 0 ? void 0 : _e.checked) ? 'true' : undefined,
            description: ((_f = item.querySelector(`[name="job[${index}].description"]`)) === null || _f === void 0 ? void 0 : _f.value) || '',
        });
    });
    const eduItems = document.querySelectorAll('#education-container .repeatable-item');
    eduItems.forEach((item, index) => {
        var _a, _b, _c, _d;
        data.education.push({
            title: ((_a = item.querySelector(`[name="edu[${index}].title"]`)) === null || _a === void 0 ? void 0 : _a.value) || '',
            institution: ((_b = item.querySelector(`[name="edu[${index}].institution"]`)) === null || _b === void 0 ? void 0 : _b.value) || '',
            year: ((_c = item.querySelector(`[name="edu[${index}].year"]`)) === null || _c === void 0 ? void 0 : _c.value) || '',
            grade: ((_d = item.querySelector(`[name="edu[${index}].grade"]`)) === null || _d === void 0 ? void 0 : _d.value) || '',
        });
    });
    const projItems = document.querySelectorAll('#project-container .repeatable-item');
    projItems.forEach((item, index) => {
        var _a, _b, _c, _d;
        data.projects.push({
            name: ((_a = item.querySelector(`[name="proj[${index}].name"]`)) === null || _a === void 0 ? void 0 : _a.value) || '',
            techstack: ((_b = item.querySelector(`[name="proj[${index}].techstack"]`)) === null || _b === void 0 ? void 0 : _b.value) || '',
            description: ((_c = item.querySelector(`[name="proj[${index}].description"]`)) === null || _c === void 0 ? void 0 : _c.value) || '',
            url: ((_d = item.querySelector(`[name="proj[${index}].url"]`)) === null || _d === void 0 ? void 0 : _d.value) || '',
        });
    });
    const certItems = document.querySelectorAll('#cert-container .repeatable-item');
    certItems.forEach((item, index) => {
        var _a, _b, _c;
        data.certifications.push({
            name: ((_a = item.querySelector(`[name="cert[${index}].name"]`)) === null || _a === void 0 ? void 0 : _a.value) || '',
            issuer: ((_b = item.querySelector(`[name="cert[${index}].issuer"]`)) === null || _b === void 0 ? void 0 : _b.value) || '',
            year: ((_c = item.querySelector(`[name="cert[${index}].year"]`)) === null || _c === void 0 ? void 0 : _c.value) || '',
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
    if (!saved)
        return;
    try {
        const data = JSON.parse(saved);
        const form = document.getElementById('resume-form');
        form.querySelector('[name="personal.name"]').value = data.personal.name || '';
        form.querySelector('[name="personal.jobtitle"]').value = data.personal.jobtitle || '';
        form.querySelector('[name="personal.email"]').value = data.personal.email || '';
        form.querySelector('[name="personal.phone"]').value = data.personal.phone || '';
        form.querySelector('[name="personal.linkedin"]').value = data.personal.linkedin || '';
        form.querySelector('[name="personal.github"]').value = data.personal.github || '';
        form.querySelector('[name="personal.location"]').value = data.personal.location || '';
        form.querySelector('[name="summary"]').value = data.summary || '';
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
            latest.querySelector(`[name="job[${idx}].jobtitle"]`).value = expr.jobtitle || '';
            latest.querySelector(`[name="job[${idx}].company"]`).value = expr.company || '';
            latest.querySelector(`[name="job[${idx}].startdate"]`).value = expr.startdate || '';
            latest.querySelector(`[name="job[${idx}].enddate"]`).value = expr.enddate || '';
            latest.querySelector(`[name="job[${idx}].current"]`).checked = expr.current === 'true';
            latest.querySelector(`[name="job[${idx}].description"]`).value = expr.description || '';
        });
        data.education.forEach((edu) => {
            addEducationBlock();
            const items = document.querySelectorAll('#education-container .repeatable-item');
            const latest = items[items.length - 1];
            const idx = items.length - 1;
            latest.querySelector(`[name="edu[${idx}].title"]`).value = edu.title || '';
            latest.querySelector(`[name="edu[${idx}].institution"]`).value = edu.institution || '';
            latest.querySelector(`[name="edu[${idx}].year"]`).value = edu.year || '';
            latest.querySelector(`[name="edu[${idx}].grade"]`).value = edu.grade || '';
        });
        data.projects.forEach((proj) => {
            addProjectBlock();
            const items = document.querySelectorAll('#project-container .repeatable-item');
            const latest = items[items.length - 1];
            const idx = items.length - 1;
            latest.querySelector(`[name="proj[${idx}].name"]`).value = proj.name || '';
            latest.querySelector(`[name="proj[${idx}].techstack"]`).value = proj.techstack || '';
            latest.querySelector(`[name="proj[${idx}].description"]`).value = proj.description || '';
            latest.querySelector(`[name="proj[${idx}].url"]`).value = proj.url || '';
        });
        data.certifications.forEach((cert) => {
            addCertBlock();
            const items = document.querySelectorAll('#cert-container .repeatable-item');
            const latest = items[items.length - 1];
            const idx = items.length - 1;
            latest.querySelector(`[name="cert[${idx}].name"]`).value = cert.name || '';
            latest.querySelector(`[name="cert[${idx}].issuer"]`).value = cert.issuer || '';
            latest.querySelector(`[name="cert[${idx}].year"]`).value = cert.year || '';
        });
        setTimeout(() => { document.dispatchEvent(new CustomEvent('formUpdated', { detail: data })); }, 100);
    }
    catch (e) {
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
    if (!container)
        return;
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
    if (!container)
        return;
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
    if (!container)
        return;
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
    if (!container)
        return;
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
function addSkillBadge(skillText, container, inputModeNode) {
    var _a;
    const badge = document.createElement('span');
    badge.className = 'badge bg-primary skill-badge';
    badge.dataset.skill = skillText;
    badge.innerHTML = `${skillText} <i class="bi bi-x remove-skill"></i>`;
    (_a = badge.querySelector('.remove-skill')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        badge.remove();
        saveFormState();
    });
    container.insertBefore(badge, inputModeNode);
}
document.addEventListener('DOMContentLoaded', () => {
    var _a, _b, _c, _d, _e;
    const form = document.getElementById('resume-form');
    if (form) {
        form.addEventListener('input', () => {
            saveFormState();
        });
    }
    (_a = document.getElementById('clear-form-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', clearFormState);
    (_b = document.getElementById('add-experience-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => { addExperienceBlock(); saveFormState(); });
    (_c = document.getElementById('add-education-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => { addEducationBlock(); saveFormState(); });
    (_d = document.getElementById('add-project-btn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => { addProjectBlock(); saveFormState(); });
    (_e = document.getElementById('add-cert-btn')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => { addCertBlock(); saveFormState(); });
    const skillInput = document.getElementById('skill-input');
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
