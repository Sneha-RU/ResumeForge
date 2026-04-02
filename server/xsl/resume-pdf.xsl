<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>


<xsl:template match="/resume">
  <html>
  <head>
    <style>
      body {
        font-family: 'Helvetica', 'Arial', sans-serif;
        color: #333333;
        font-size: 11px;
        line-height: 1.5;
      }
      h1 { font-size: 28px; margin: 0; font-weight: bold; color: #111111; letter-spacing: -0.5px; }
      h2 { font-size: 14px; margin: 5px 0 15px 0; color: #0d6efd; font-weight: normal;  }
      
      .header-info { text-align: center; border-bottom: 2px solid #0d6efd; padding-bottom: 20px; margin-bottom: 20px; }
      .contact-row { font-size: 10px; color: #555555; }
      
      h3.section-title {
        color: #0d6efd;
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 5px;
        margin-bottom: 15px;
        font-size: 13px;
        text-transform: uppercase;
        font-weight: bold;
        letter-spacing: 1px;
      }

      .job-entry { margin-bottom: 15px; page-break-inside: avoid; }
      .job-title { font-weight: bold; font-size: 13px; color:#222222; }
      .job-meta { font-size: 11px; color: #555555; text-align: right; }
      .job-desc { margin-top: 5px; padding-left: 15px; font-size: 11px; color: #444444; }

      .edu-entry { margin-bottom: 10px; page-break-inside: avoid;}
      .edu-title { font-weight: bold; font-size: 13px; color:#222222;}
      .edu-meta { text-align: right; font-size: 11px; color: #555555; }

      .proj-entry { margin-bottom: 15px; page-break-inside: avoid; }
      .proj-title { font-weight: bold; font-size: 13px; color:#222222;}
      .proj-tech { font-size: 10px; color: #555555; font-family: monospace; margin-bottom: 5px;}
      .proj-desc { font-size: 11px; color: #444444; margin: 0; }
      
      p.summary { font-size: 11px; text-align: justify; margin: 0; }
    </style>
  </head>
  <body>
    
    <!-- header -->
    <div class="header-info">
      <h1><xsl:value-of select="personal/name"/></h1>
      <h2><xsl:value-of select="personal/jobtitle"/></h2>
      
      <div class="contact-row">
        <xsl:if test="personal/email != ''">
           &#9993; <xsl:value-of select="personal/email"/>
        </xsl:if>
        <xsl:if test="personal/phone != ''">
           &#160;|&#160;&#9990; <xsl:value-of select="personal/phone"/>
        </xsl:if>
        <xsl:if test="personal/location != ''">
           &#160;|&#160;<xsl:value-of select="personal/location"/>
        </xsl:if>
        <xsl:if test="personal/linkedin != ''">
           &#160;|&#160;in: <xsl:value-of select="personal/linkedin"/>
        </xsl:if>
        <xsl:if test="personal/github != ''">
           &#160;|&#160;gh: <xsl:value-of select="personal/github"/>
        </xsl:if>
      </div>
    </div>

    <!-- summary -->
    <xsl:if test="summary != '' and summary != ' '">
      <div style="margin-bottom: 20px;">
        <h3 class="section-title">Summary</h3>
        <p class="summary"><xsl:value-of select="summary"/></p>
      </div>
    </xsl:if>

    <!-- exp -->
    <xsl:if test="count(experience/job) &gt; 0">
      <div style="margin-bottom: 20px;">
        <h3 class="section-title">Experience</h3>
        
        <xsl:for-each select="experience/job">
          <xsl:if test="jobtitle != ''">
            <div class="job-entry">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 5px;">
                <tr>
                  <td class="job-title" align="left" style="vertical-align: bottom;"><xsl:value-of select="jobtitle"/></td>
                  <td class="job-meta" align="right" style="vertical-align: bottom;">
                    <xsl:value-of select="company"/>
                    <span style="color: #888888;"> | </span>
                    <xsl:value-of select="startdate"/>
                    <xsl:text> - </xsl:text>
                    <xsl:choose>
                      <xsl:when test="current = 'true'">Present</xsl:when>
                      <xsl:otherwise><xsl:value-of select="enddate"/></xsl:otherwise>
                    </xsl:choose>
                  </td>
                </tr>
              </table>
              <div class="job-desc" style="white-space: pre-wrap;"><xsl:value-of select="description"/></div>
            </div>
          </xsl:if>
        </xsl:for-each>
      </div>
    </xsl:if>

    <!-- edu -->
    <xsl:if test="count(education/degree) &gt; 0">
      <div style="margin-bottom: 20px;">
        <h3 class="section-title">Education</h3>
        
        <xsl:for-each select="education/degree">
          <xsl:if test="title != ''">
            <div class="edu-entry">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="vertical-align: top; width: 65%;">
                    <div class="edu-title"><xsl:value-of select="title"/></div>
                    <div style="font-weight:normal; font-size:11px; color:#555555;"><xsl:value-of select="institution"/></div>
                  </td>
                  <td class="edu-meta" align="right" style="vertical-align: top; width: 35%;">
                    <xsl:value-of select="year"/>
                    <xsl:if test="grade != ''">
                      <br/><span style="color: #0d6efd; font-weight:bold;">Grade: <xsl:value-of select="grade"/></span>
                    </xsl:if>
                  </td>
                </tr>
              </table>
            </div>
          </xsl:if>
        </xsl:for-each>
      </div>
    </xsl:if>

    <!-- skills -->
    <xsl:if test="count(skills/skill) &gt; 0">
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <h3 class="section-title">Skills</h3>
        <div style="line-height:2;">
          <xsl:for-each select="skills/skill">
             <xsl:if test=". != 'Add a skill'">
               <span style="background-color: #e9ecef; color: #333333; padding: 4px 8px; font-size: 11px; font-weight: bold; border: 1px solid #dddddd; border-radius: 4px;">
                 <xsl:value-of select="."/>
               </span>
               <xsl:text> </xsl:text>
             </xsl:if>
          </xsl:for-each>
        </div>
      </div>
    </xsl:if>

    <!-- projects -->
    <xsl:if test="count(projects/project) &gt; 0">
      <div style="margin-bottom: 20px;">
        <h3 class="section-title">Projects</h3>
        
        <xsl:for-each select="projects/project">
          <xsl:if test="name != ''">
            <div class="proj-entry">
              <div class="proj-title">
                <xsl:value-of select="name"/>
                <xsl:if test="url != ''">
                  &#160;<a href="{url}" style="font-style:normal; font-weight:normal; font-size:10px; color:#0d6efd; text-decoration:none;">[Link &#8599;]</a>
                </xsl:if>
              </div>
              <div class="proj-tech"><xsl:value-of select="techstack"/></div>
              <p class="proj-desc" style="white-space: pre-wrap;"><xsl:value-of select="description"/></p>
            </div>
          </xsl:if>
        </xsl:for-each>
      </div>
    </xsl:if>

    <!-- certs -->
    <xsl:if test="count(certifications/cert) &gt; 0">
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <h3 class="section-title">Certifications</h3>
        
        <xsl:for-each select="certifications/cert">
          <xsl:if test="name != ''">
            <div style="margin-bottom: 8px; font-size: 12px;">
              <span style="font-weight: bold; color: #222222;"><xsl:value-of select="name"/></span>
              <span style="color: #666666;"> - <xsl:value-of select="issuer"/>, <xsl:value-of select="year"/></span>
            </div>
          </xsl:if>
        </xsl:for-each>
      </div>
    </xsl:if>

  </body>
  </html>
</xsl:template>

</xsl:stylesheet>
