<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>


<xsl:template match="/resume">
  <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; max-width: 800px; margin: 0 auto; background: white;">
    
    <!-- header -->
    <div style="text-align: center; border-bottom: 2px solid #0d6efd; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin: 0; font-size: 2.5rem; color: #111; font-weight: 700; letter-spacing: -0.5px;"><xsl:value-of select="personal/name"/></h1>
      <h2 style="margin: 5px 0 15px 0; font-size: 1.2rem; color: #0d6efd; font-weight: 500;"><xsl:value-of select="personal/jobtitle"/></h2>
      
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; font-size: 0.9rem; color: #555;">
        <xsl:if test="personal/email != ''">
           <span>✉ <xsl:value-of select="personal/email"/></span>
        </xsl:if>
        <xsl:if test="personal/phone != ''">
           <span>| ✆ <xsl:value-of select="personal/phone"/></span>
        </xsl:if>
        <xsl:if test="personal/location != ''">
           <span>| 📍 <xsl:value-of select="personal/location"/></span>
        </xsl:if>
        <xsl:if test="personal/linkedin != ''">
           <span>| in: <xsl:value-of select="personal/linkedin"/></span>
        </xsl:if>
        <xsl:if test="personal/github != ''">
           <span>| gh: <xsl:value-of select="personal/github"/></span>
        </xsl:if>
      </div>
    </div>

    <!-- summary -->
    <xsl:if test="summary != '' and summary != ' '">
      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: #0d6efd; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px;">Summary</h3>
        <p style="margin: 0; text-align: justify; font-size: 0.95rem;"><xsl:value-of select="summary"/></p>
      </div>
    </xsl:if>

    <!-- exp -->
    <xsl:if test="count(experience/job) &gt; 0">
      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: #0d6efd; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px;">Experience</h3>
        
        <xsl:for-each select="experience/job">
          <xsl:if test="jobtitle != ''">
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
                <h4 style="margin: 0; font-size: 1.05rem; font-weight: 600; color: #222;"><xsl:value-of select="jobtitle"/></h4>
                <div style="font-size: 0.9rem; font-weight: 500; color: #555; text-align: right;">
                  <xsl:value-of select="company"/>
                  <span style="color: #888;"> | </span>
                  <xsl:value-of select="startdate"/>
                  <xsl:text> - </xsl:text>
                  <xsl:choose>
                    <xsl:when test="current = 'true'">Present</xsl:when>
                    <xsl:otherwise><xsl:value-of select="enddate"/></xsl:otherwise>
                  </xsl:choose>
                </div>
              </div>
              
              <!-- description bullet lists -->
              <div style="font-size: 0.9rem; color: #444; margin: 0; white-space: pre-wrap; padding-left: 15px;"><xsl:value-of select="description"/></div>
            </div>
          </xsl:if>
        </xsl:for-each>
      </div>
    </xsl:if>

    <!-- edu -->
    <xsl:if test="count(education/degree) &gt; 0">
      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: #0d6efd; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px;">Education</h3>
        
        <xsl:for-each select="education/degree">
          <xsl:if test="title != ''">
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: baseline;">
              <div>
                <h4 style="margin: 0; font-size: 1.05rem; font-weight: 600; color: #222;"><xsl:value-of select="title"/></h4>
                <div style="font-size: 0.9rem; color: #555;"><xsl:value-of select="institution"/></div>
              </div>
              <div style="text-align: right; font-size: 0.9rem; color: #555;">
                <xsl:value-of select="year"/>
                <xsl:if test="grade != ''">
                  <div style="color: #0d6efd; font-weight: 500;">Grade: <xsl:value-of select="grade"/></div>
                </xsl:if>
              </div>
            </div>
          </xsl:if>
        </xsl:for-each>
      </div>
    </xsl:if>

    <!-- skills -->
    <xsl:if test="count(skills/skill) &gt; 0">
      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: #0d6efd; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px;">Skills</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          <xsl:for-each select="skills/skill">
             <xsl:if test=". != 'Add a skill'">
               <span style="background: #e9ecef; color: #333; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem; font-weight: 500;">
                 <xsl:value-of select="."/>
               </span>
             </xsl:if>
          </xsl:for-each>
        </div>
      </div>
    </xsl:if>

    <!-- projects -->
    <xsl:if test="count(projects/project) &gt; 0">
      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: #0d6efd; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px;">Projects</h3>
        
        <xsl:for-each select="projects/project">
          <xsl:if test="name != ''">
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
                <h4 style="margin: 0; font-size: 1.05rem; font-weight: 600; color: #222;">
                  <xsl:value-of select="name"/>
                  <xsl:if test="url != ''">
                    <a href="{url}" target="_blank" style="font-size: 0.8rem; margin-left:10px; color:#0d6efd; text-decoration: none; font-weight:normal;">[Link ↗]</a>
                  </xsl:if>
                </h4>
              </div>
              <div style="font-size: 0.85rem; font-weight: 500; color: #6c757d; margin-bottom: 5px; font-family: monospace;"><xsl:value-of select="techstack"/></div>
              <p style="font-size: 0.9rem; color: #444; margin: 0; white-space: pre-wrap;"><xsl:value-of select="description"/></p>
            </div>
          </xsl:if>
        </xsl:for-each>
      </div>
    </xsl:if>

    <!-- certs -->
    <xsl:if test="count(certifications/cert) &gt; 0">
      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: #0d6efd; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px;">Certifications</h3>
        
        <xsl:for-each select="certifications/cert">
          <xsl:if test="name != ''">
            <div style="margin-bottom: 8px; font-size: 0.95rem;">
              <span style="font-weight: 600; color: #222;"><xsl:value-of select="name"/></span>
              <span style="color: #666;"> - <xsl:value-of select="issuer"/>, <xsl:value-of select="year"/></span>
            </div>
          </xsl:if>
        </xsl:for-each>
      </div>
    </xsl:if>

  </div>
</xsl:template>

</xsl:stylesheet>
