import { ResumeData, getFormData } from './form.js';
declare var bootstrap: any;
export interface Rule {
  name: string;
  passed: boolean;
  tip: string;
}

export interface ATSResult {
  score: number;
  passed: Rule[];
  failed: Rule[];
  warnings: Rule[];
}

export function scoreResume(data: ResumeData): ATSResult {
  let score = 0;
  const passed: Rule[] = [];
  const failed: Rule[] = [];

  if (data.summary && data.summary.trim().length > 50) {
    score += 10;
    passed.push({ name: "Professional Summary", passed: true, tip: "Summary is adequately detailed." });
  } else {
    failed.push({ name: "Professional Summary", passed: false, tip: "Add a professional summary of at least 2–3 sentences" });
  }

  if (data.skills && data.skills.length >= 6) {
    score += 15;
    passed.push({ name: "Skills Count", passed: true, tip: "Good amount of skills listed." });
  } else {
    failed.push({ name: "Skills Count", passed: false, tip: "Add more relevant skills — aim for at least 6" });
  }

  const hasQuantified = data.experience.some(job => 
    job.description && /[%0-9]/.test(job.description) || 
    /increased|reduced|led|saved/i.test(job.description)
  );
  if (hasQuantified) {
    score += 20;
    passed.push({ name: "Quantified Achievements", passed: true, tip: "You have quantified your achievements." });
  } else {
    failed.push({ name: "Quantified Achievements", passed: false, tip: "Quantify your achievements (e.g. 'Increased performance by 30%')" });
  }

  if (data.personal.email && data.personal.phone) {
    score += 10;
    passed.push({ name: "Contact Info", passed: true, tip: "Contact information is complete." });
  } else {
    failed.push({ name: "Contact Info", passed: false, tip: "Add your email and phone number" });
  }

  if (data.projects && data.projects.length >= 1 && data.projects[0].name !== "") {
    score += 10;
    passed.push({ name: "Projects", passed: true, tip: "Practical projects listed." });
  } else {
    failed.push({ name: "Projects", passed: false, tip: "Add at least one project to show practical skills" });
  }

  const eduComplete = data.education.some(edu => edu.institution && edu.year);
  if (eduComplete) {
    score += 10;
    passed.push({ name: "Education", passed: true, tip: "Education details are complete." });
  } else {
    failed.push({ name: "Education", passed: false, tip: "Complete your education section" });
  }

  if (data.personal.linkedin && data.personal.linkedin.trim() !== '') {
    score += 10;
    passed.push({ name: "LinkedIn URL", passed: true, tip: "LinkedIn profile is linked." });
  } else {
    failed.push({ name: "LinkedIn URL", passed: false, tip: "Add your LinkedIn profile URL" });
  }

  let totalText = data.summary + " " + data.skills.join(" ") + " ";
  data.experience.forEach(e => totalText += e.description + " ");
  data.projects.forEach(p => totalText += p.description + " ");

  const wordCount = totalText.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount >= 300 && wordCount <= 700) {
    score += 15;
    passed.push({ name: "Word Count", passed: true, tip: "Resume length is optimal." });
  } else {
    failed.push({ name: "Word Count", passed: false, tip: "Resume is too short/long — aim for 300–700 words" });
  }

  return {
    score,
    passed,
    failed,
    warnings: []
  };
}

document.addEventListener('DOMContentLoaded', () => {

  const updateMiniUi = (result: ATSResult) => {
    const panel = document.getElementById('mini-ats-panel');
    const circle = document.getElementById('live-score-circle');
    const msg = document.getElementById('live-score-msg');
    
    if (!panel || !circle || !msg) return;
    panel.style.display = 'block';

    let colorCls = 'score-red';
    if (result.score >= 80) colorCls = 'score-green';
    else if (result.score >= 50) colorCls = 'score-yellow';

    circle.className = `ats-score-circle ${colorCls} shadow-sm`;
    circle.innerHTML = result.score.toString();
    
    if (result.score >= 80) msg.innerText = "Looking good!";
    else if (result.score >= 50) msg.innerText = "Needs improvement";
    else msg.innerText = "Major issues found";
  };

  document.addEventListener('formUpdated', (e: any) => {
    const res = scoreResume(e.detail);
    updateMiniUi(res);
  });

  const checkAtsBtn = document.getElementById('check-ats-btn');
  checkAtsBtn?.addEventListener('click', async () => {
    const data = getFormData();
    
    try {
      const { buildXML } = await import('./preview.js');
      const xmlStr = buildXML(data);

      const saveResp = await fetch('../../server/php/generate-xml.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xml: xmlStr })
      });
      const saveRes = await saveResp.json();
      if (!saveRes.success) {
        throw new Error("Could not save XML for ATS check");
      }

      const atsResp = await fetch(`../../server/php/ats-checker.php?t=${Date.now()}`, {
        cache: 'no-store'
      });
      const atsData = await atsResp.json();

      let finalScore = atsData.score;
      let finalRules = atsData.rules as Rule[];

      const modalCircle = document.getElementById('modal-score-circle');
      const modalValue = document.getElementById('modal-score-value');
      const modalTitle = document.getElementById('modal-score-title');
      const rulesList = document.getElementById('ats-rules-list');

      if (modalCircle && modalValue && modalTitle && rulesList) {
        let colorCls = 'score-red';
        if (finalScore >= 80) { colorCls = 'score-green'; modalTitle.innerText = "Excellent ATS Compatibility"; }
        else if (finalScore >= 50) { colorCls = 'score-yellow'; modalTitle.innerText = "Average ATS Compatibility"; }
        else { modalTitle.innerText = "Low ATS Compatibility"; }

        modalCircle.className = `ats-score-circle mx-auto mb-3 shadow d-flex flex-column justify-content-center align-items-center ${colorCls}`;
        // animate score
        modalValue.innerText = '0';
        let currentScore = 0;
        const duration = 1000;
        const interval = 20;
        if (finalScore > 0) {
          const step = (finalScore / (duration / interval));
          const timer = setInterval(() => {
            currentScore += step;
            if (currentScore >= finalScore) {
              currentScore = finalScore;
              clearInterval(timer);
            }
            modalValue.innerText = Math.round(currentScore).toString();
          }, interval);
        } else {
          modalValue.innerText = '0';
        }

        rulesList.innerHTML = '';
        finalRules.forEach((r, idx) => {
          const li = document.createElement('li');
          li.className = "list-group-item px-0 py-3 border-bottom rule-item-enter";
          li.style.animationDelay = `${(idx * 0.1) + 0.3}s`;
          const icon = r.passed 
            ? '<i class="bi bi-check-circle-fill text-success fs-5 me-2"></i>' 
            : '<i class="bi bi-x-circle-fill text-danger fs-5 me-2"></i>';
          li.innerHTML = `
            <div class="d-flex align-items-start">
              ${icon}
              <div>
                <strong class="d-block">${r.name}</strong>
                <span class="text-muted small">${r.tip}</span>
              </div>
            </div>
          `;
          rulesList.appendChild(li);
        });

        const modal = new bootstrap.Modal(document.getElementById('atsModal'));
        modal.show();
      }

    } catch (e: any) {
      console.log(e);
      const { showToast } = await import('./form.js');
      
      let errorMsg = e.message || 'Error running ATS Check on backend.';
      if (e instanceof SyntaxError) {
        errorMsg = 'Backend Error: PHP is not executing. Please ensure you are running this via a PHP server (like XAMPP or "php -S"), not Live Server.';
      }

      showToast(errorMsg, 'danger');
    }
  });
});
