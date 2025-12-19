import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

// Simplified color palette
const colors = {
  cream: '#FAF8F5',
  warmWhite: '#F5F2ED',
  sand: '#E8E4DD',
  warmGray: '#9A938A',
  stone: '#6B655D',
  charcoal: '#3D3A36',
  ink: '#2A2825',
  accent: '#B8977A',
  accentSoft: '#C9B39C',
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.cream,
    padding: 40,
    fontFamily: 'Helvetica',
  },
  coverPage: {
    backgroundColor: colors.ink,
    padding: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  coverTitle: {
    fontSize: 36,
    color: colors.cream,
    marginBottom: 8,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 12,
    color: colors.warmGray,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 40,
  },
  coverDirection: {
    fontSize: 24,
    color: colors.accent,
    marginBottom: 8,
    textAlign: 'center',
  },
  coverDate: {
    fontSize: 10,
    color: colors.stone,
    marginTop: 60,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.sand,
  },
  logo: {
    fontSize: 12,
    color: colors.ink,
  },
  pageNumber: {
    fontSize: 9,
    color: colors.warmGray,
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.ink,
    marginBottom: 15,
  },
  sectionNumber: {
    fontSize: 11,
    color: colors.accent,
    marginBottom: 4,
  },
  card: {
    backgroundColor: colors.warmWhite,
    borderRadius: 6,
    padding: 15,
    marginBottom: 12,
  },
  cardAccent: {
    backgroundColor: colors.warmWhite,
    borderRadius: 6,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.ink,
    marginBottom: 6,
  },
  body: {
    fontSize: 10,
    color: colors.stone,
    lineHeight: 1.5,
  },
  bodySmall: {
    fontSize: 9,
    color: colors.warmGray,
    lineHeight: 1.4,
  },
  label: {
    fontSize: 8,
    color: colors.warmGray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    width: 12,
    fontSize: 9,
    color: colors.accent,
  },
  listContent: {
    flex: 1,
  },
  tag: {
    backgroundColor: colors.sand,
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 8,
    color: colors.stone,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  phaseCard: {
    backgroundColor: colors.warmWhite,
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  phaseHeader: {
    backgroundColor: 'rgba(184, 151, 122, 0.1)',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.sand,
  },
  phaseLabel: {
    fontSize: 8,
    color: colors.warmGray,
    textTransform: 'uppercase',
  },
  phaseTitle: {
    fontSize: 11,
    color: colors.ink,
  },
  phaseContent: {
    padding: 12,
  },
  closingBox: {
    backgroundColor: 'rgba(232, 228, 221, 0.5)',
    borderRadius: 8,
    padding: 20,
    marginTop: 15,
  },
  closingText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: colors.stone,
    textAlign: 'center',
  },
})

// PDF Document Component
function JourneyDocument({ userData, assessment, mentor, plan }) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverSubtitle}>Cago</Text>
        <Text style={styles.coverTitle}>Your Clarity Journey</Text>
        <View style={{ marginTop: 30 }}>
          <Text style={styles.label}>Direction</Text>
          <Text style={styles.coverDirection}>{userData.directionLabel || userData.direction}</Text>
        </View>
        <Text style={styles.coverDate}>Generated {currentDate}</Text>
      </Page>

      {/* You Are Here Page */}
      {assessment && (
        <Page size="A4" style={styles.page}>
          <View style={styles.pageHeader}>
            <Text style={styles.logo}>Cago</Text>
            <Text style={styles.pageNumber}>You Are Here</Text>
          </View>
          
          <Text style={styles.sectionNumber}>01</Text>
          <Text style={styles.sectionTitle}>Where You Stand</Text>
          
          {assessment.stage && (
            <View style={styles.cardAccent}>
              <Text style={styles.label}>Current Stage</Text>
              <Text style={styles.heading}>{assessment.stage.label}</Text>
              <Text style={styles.body}>{assessment.stage.description}</Text>
            </View>
          )}

          {assessment.assets && assessment.assets.length > 0 && (
            <>
              <Text style={styles.label}>What You Already Have</Text>
              {assessment.assets.map((asset, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bullet}>○</Text>
                  <View style={styles.listContent}>
                    <Text style={[styles.body, { fontWeight: 'bold' }]}>{asset.text}</Text>
                    {asset.signal && <Text style={styles.bodySmall}>{asset.signal}</Text>}
                  </View>
                </View>
              ))}
            </>
          )}

          {assessment.gaps && assessment.gaps.length > 0 && (
            <>
              <Text style={[styles.label, { marginTop: 15 }]}>What Is Not Yet In Place</Text>
              {assessment.gaps.map((gap, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bullet}>◦</Text>
                  <View style={styles.listContent}>
                    <Text style={[styles.body, { fontWeight: 'bold' }]}>{gap.text}</Text>
                    {gap.note && <Text style={styles.bodySmall}>{gap.note}</Text>}
                  </View>
                </View>
              ))}
            </>
          )}
        </Page>
      )}

      {/* Mentor Page */}
      {mentor && mentor.mentor && (
        <Page size="A4" style={styles.page}>
          <View style={styles.pageHeader}>
            <Text style={styles.logo}>Cago</Text>
            <Text style={styles.pageNumber}>Mentor Match</Text>
          </View>

          <Text style={styles.sectionNumber}>02</Text>
          <Text style={styles.sectionTitle}>Your Recommended Mentor</Text>

          <View style={styles.card}>
            <Text style={styles.heading}>{mentor.mentor.name}</Text>
            <Text style={styles.body}>{mentor.mentor.title}</Text>
            <Text style={styles.bodySmall}>{mentor.mentor.experience}</Text>
            
            {mentor.mentor.specialties && mentor.mentor.specialties.length > 0 && (
              <>
                <Text style={[styles.label, { marginTop: 10 }]}>Areas of Focus</Text>
                <View style={styles.tagRow}>
                  {mentor.mentor.specialties.map((s, i) => (
                    <View key={i} style={styles.tag}>
                      <Text style={styles.tagText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
            
            {mentor.mentor.approach && (
              <>
                <Text style={[styles.label, { marginTop: 10 }]}>Approach</Text>
                <Text style={styles.body}>{mentor.mentor.approach}</Text>
              </>
            )}
          </View>

          {mentor.matchReasons && mentor.matchReasons.length > 0 && (
            <>
              <Text style={styles.label}>Why This Match</Text>
              {mentor.matchReasons.map((reason, i) => (
                <View key={i} style={styles.card}>
                  <Text style={[styles.body, { fontWeight: 'bold', marginBottom: 4 }]}>{reason.title}</Text>
                  <Text style={styles.body}>{reason.text}</Text>
                </View>
              ))}
            </>
          )}
        </Page>
      )}

      {/* Execution Plan Pages */}
      {plan && (
        <>
          <Page size="A4" style={styles.page}>
            <View style={styles.pageHeader}>
              <Text style={styles.logo}>Cago</Text>
              <Text style={styles.pageNumber}>Execution Plan</Text>
            </View>

            <Text style={styles.sectionNumber}>03</Text>
            <Text style={styles.sectionTitle}>Your Roadmap</Text>

            {plan.directionConfirmation && (
              <View style={styles.cardAccent}>
                <Text style={styles.label}>Direction Confirmed</Text>
                <Text style={styles.heading}>{plan.directionLabel || userData.directionLabel}</Text>
                <Text style={styles.body}>{plan.directionConfirmation}</Text>
              </View>
            )}

            {plan.hardSkills && plan.hardSkills.length > 0 && (
              <>
                <Text style={[styles.label, { marginTop: 15 }]}>Hard Skills to Focus On</Text>
                {plan.hardSkills.slice(0, 3).map((skill, i) => {
                  const skillObj = typeof skill === 'string' ? { skill } : skill
                  return (
                    <View key={i} style={styles.card}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={[styles.body, { fontWeight: 'bold' }]}>{skillObj.skill}</Text>
                        {skillObj.priority && (
                          <Text style={styles.bodySmall}>({skillObj.priority})</Text>
                        )}
                      </View>
                      {skillObj.why && <Text style={styles.bodySmall}>{skillObj.why}</Text>}
                    </View>
                  )
                })}
              </>
            )}

            {plan.tools && plan.tools.length > 0 && (
              <>
                <Text style={[styles.label, { marginTop: 15 }]}>Tools & Technologies</Text>
                <View style={styles.tagRow}>
                  {plan.tools.slice(0, 5).map((tool, i) => {
                    const toolName = typeof tool === 'string' ? tool : tool.name
                    return (
                      <View key={i} style={styles.tag}>
                        <Text style={styles.tagText}>{toolName}</Text>
                      </View>
                    )
                  })}
                </View>
              </>
            )}
          </Page>

          {/* Phased Path Page */}
          {plan.phasedPath && (
            <Page size="A4" style={styles.page}>
              <View style={styles.pageHeader}>
                <Text style={styles.logo}>Cago</Text>
                <Text style={styles.pageNumber}>90-Day Path</Text>
              </View>

              <Text style={styles.sectionNumber}>04</Text>
              <Text style={styles.sectionTitle}>Phased Learning Path</Text>

              {['day30', 'day60', 'day90'].map((phaseKey) => {
                const phase = plan.phasedPath[phaseKey]
                if (!phase) return null
                
                const phaseLabel = phaseKey === 'day30' ? 'Days 1-30' : phaseKey === 'day60' ? 'Days 31-60' : 'Days 61-90'
                const phaseTasks = phase.tasks || (Array.isArray(phase) ? phase.map(t => ({ task: t })) : [])
                
                return (
                  <View key={phaseKey} style={styles.phaseCard}>
                    <View style={styles.phaseHeader}>
                      <View>
                        <Text style={styles.phaseLabel}>{phaseLabel}</Text>
                        <Text style={styles.phaseTitle}>{phase.theme || (phaseKey === 'day30' ? 'Foundation' : phaseKey === 'day60' ? 'Building' : 'Momentum')}</Text>
                      </View>
                    </View>
                    <View style={styles.phaseContent}>
                      {phaseTasks.slice(0, 3).map((taskObj, i) => {
                        const task = typeof taskObj === 'string' ? { task: taskObj } : taskObj
                        return (
                          <View key={i} style={styles.listItem}>
                            <Text style={styles.bullet}>○</Text>
                            <Text style={[styles.body, { flex: 1 }]}>{task.task}</Text>
                          </View>
                        )
                      })}
                    </View>
                  </View>
                )
              })}

              {plan.closingReassurance && (
                <View style={styles.closingBox}>
                  <Text style={styles.closingText}>{plan.closingReassurance}</Text>
                </View>
              )}
            </Page>
          )}
        </>
      )}
    </Document>
  )
}

// Function to generate and download PDF
export async function downloadJourneyPDF(userData, assessment, mentor, plan) {
  try {
    console.log('Generating PDF with:', { userData, assessment, mentor, plan })
    
    const blob = await pdf(
      <JourneyDocument 
        userData={userData} 
        assessment={assessment} 
        mentor={mentor} 
        plan={plan} 
      />
    ).toBlob()
    
    console.log('PDF blob created, size:', blob.size)
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cago-${(userData.directionLabel || userData.direction || 'journey').toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('PDF download triggered')
  } catch (error) {
    console.error('PDF generation error:', error)
    throw error
  }
}

export default JourneyDocument
