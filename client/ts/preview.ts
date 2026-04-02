import { ResumeData, getFormData, showToast } from './form.js';

export function buildXML(data: ResumeData): string {
  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  let xml = `<?xml version="1.0"?>\n`;
  xml += `<!DOCTYPE resume SYSTEM "../xml/resume.dtd">\n`;
  xml += `<resume>\n`;

  xml += `  <personal>\n`;
  xml += `    <name>${escapeXml(data.personal.name || '')}</name>\n`;
  xml += `    <jobtitle>${escapeXml(data.personal.jobtitle || '')}</jobtitle>\n`;
  xml += `    <email>${escapeXml(data.personal.email || '')}</email>\n`;
  xml += `    <phone>${escapeXml(data.personal.phone || '')}</phone>\n`;
  if (data.personal.linkedin) xml += `    <linkedin>${escapeXml(data.personal.linkedin)}</linkedin>\n`;
  if (data.personal.github) xml += `    <github>${escapeXml(data.personal.github)}</github>\n`;
  if (data.personal.location) xml += `    <location>${escapeXml(data.personal.location)}</location>\n`;
  xml += `  </personal>\n`;

  if (data.summary) {
    xml += `  <summary>${escapeXml(data.summary)}</summary>\n`;
  } else {
    xml += `  <summary> </summary>\n`;
  }

  // exp
  xml += `  <experience>\n`;
  if (data.experience.length > 0) {
    data.experience.forEach(job => {
      xml += `    <job>\n`;
      xml += `      <jobtitle>${escapeXml(job.jobtitle)}</jobtitle>\n`;
      xml += `      <company>${escapeXml(job.company)}</company>\n`;
      xml += `      <startdate>${escapeXml(job.startdate)}</startdate>\n`;
      xml += `      <enddate>${escapeXml(job.enddate)}</enddate>\n`;
      if (job.current === 'true') xml += `      <current>true</current>\n`;
      xml += `      <description>${escapeXml(job.description)}</description>\n`;
      xml += `    </job>\n`;
    });
  } else {
    xml += `    <job><jobtitle></jobtitle><company></company><startdate></startdate><enddate></enddate><description></description></job>\n`;
  }
  xml += `  </experience>\n`;

  // edu
  xml += `  <education>\n`;
  if (data.education.length > 0) {
    data.education.forEach(edu => {
      xml += `    <degree>\n`;
      xml += `      <title>${escapeXml(edu.title)}</title>\n`;
      xml += `      <institution>${escapeXml(edu.institution)}</institution>\n`;
      xml += `      <year>${escapeXml(edu.year)}</year>\n`;
      if (edu.grade) xml += `      <grade>${escapeXml(edu.grade)}</grade>\n`;
      xml += `    </degree>\n`;
    });
  } else {
    xml += `    <degree><title></title><institution></institution><year></year></degree>\n`;
  }
  xml += `  </education>\n`;

  xml += `  <skills>\n`;
  if (data.skills.length > 0) {
    data.skills.forEach(sk => {
      xml += `    <skill>${escapeXml(sk)}</skill>\n`;
    });
  } else {
    xml += `    <skill>Add a skill</skill>\n`;
  }
  xml += `  </skills>\n`;

  xml += `  <projects>\n`;
  if (data.projects.length > 0) {
    data.projects.forEach(proj => {
      xml += `    <project>\n`;
      xml += `      <name>${escapeXml(proj.name)}</name>\n`;
      xml += `      <techstack>${escapeXml(proj.techstack)}</techstack>\n`;
      xml += `      <description>${escapeXml(proj.description)}</description>\n`;
      if (proj.url) xml += `      <url>${escapeXml(proj.url)}</url>\n`;
      xml += `    </project>\n`;
    });
  } else {
    xml += `    <project><name></name><techstack></techstack><description></description></project>\n`;
  }
  xml += `  </projects>\n`;

  if (data.certifications.length > 0) {
    xml += `  <certifications>\n`;
    data.certifications.forEach(cert => {
      xml += `    <cert>\n`;
      xml += `      <name>${escapeXml(cert.name)}</name>\n`;
      xml += `      <issuer>${escapeXml(cert.issuer)}</issuer>\n`;
      xml += `      <year>${escapeXml(cert.year)}</year>\n`;
      xml += `    </cert>\n`;
    });
    xml += `  </certifications>\n`;
  }

  xml += `</resume>\n`;
  return xml;
}

let xsltString: string | null = null;

async function loadXSLT() {
  if (xsltString) return xsltString;
  try {
    const response = await fetch('../xsl/resume-preview.xsl');
    if (response.ok) {
      xsltString = await response.text();
      return xsltString;
    }
  } catch (e) {
    console.error('Failed to load XSLT', e);
  }
  return null;
}

export async function updatePreview(data: ResumeData) {
  const xmlStr = buildXML(data);
  const xslStr = await loadXSLT();

  let previewEl = document.getElementById('preview-panel');
  if (!previewEl) return;
  
  if (!xslStr) {
    previewEl.innerHTML = '<div class="alert alert-danger">Failed to load XSLT.</div>';
    return;
  }

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlStr, "application/xml");
    const xslDoc = parser.parseFromString(xslStr, "application/xml");

    const processor = new XSLTProcessor();
    processor.importStylesheet(xslDoc);

    const resultFragment = processor.transformToFragment(xmlDoc, document);

    previewEl.classList.remove('skeleton');
    previewEl.innerHTML = '';
    
    if (resultFragment) {
       previewEl.appendChild(resultFragment);
    }

    const mobPanel = document.getElementById('mobile-preview-panel');
    if (mobPanel) {
      mobPanel.innerHTML = previewEl.innerHTML;
    }

  } catch (e) {
    console.error("XSLT Transformation Error", e);
  }
}

let previewTimeout: number | undefined;

document.addEventListener('DOMContentLoaded', () => {
  
  const saveBtn = document.getElementById('save-preview-btn');
  saveBtn?.addEventListener('click', async () => {
    const data = getFormData();
    const xmlStr = buildXML(data);
    
    try {
      const resp = await fetch('../../server/php/generate-xml.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xml: xmlStr })
      });
      const res = await resp.json();
      if (res.success) {
        showToast('Saved XML and synchronized successfully!', 'success');
        updatePreview(data);
      } else {
        showToast('Error saving XML: ' + res.error, 'danger');
      }
    } catch (e: any) {
      if (e instanceof SyntaxError) {
        showToast('Backend Error: PHP is not executing. Please run via a PHP server.', 'danger');
      } else {
        showToast('Error connecting to backend: ' + e.message, 'danger');
      }
    }
  });

  document.addEventListener('formUpdated', (e: any) => {
    if (previewTimeout) clearTimeout(previewTimeout);
    previewTimeout = window.setTimeout(() => {
       updatePreview(e.detail as ResumeData);
    }, 300);
  });

  const downloadBtn = document.getElementById('download-pdf-btn');
  downloadBtn?.addEventListener('click', async () => {
    const data = getFormData();
    const xmlStr = buildXML(data);
    
    try {
      showToast('Generating PDF...', 'success');
      await fetch('../../server/php/generate-xml.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xml: xmlStr })
      });
      window.location.href = '../../server/php/generate-pdf.php';
    } catch (e) {
      showToast('Error generating PDF.', 'danger');
    }
  });
});
