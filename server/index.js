import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

// Helper to extract JSON from Claude's response (handles markdown code blocks)
function extractJSON(text) {
  // Remove markdown code blocks if present
  let cleaned = text.trim()
  
  // Handle ```json ... ``` or ``` ... ```
  if (cleaned.startsWith('```')) {
    // Find the end of the first line (after ```json or ```)
    const firstNewline = cleaned.indexOf('\n')
    if (firstNewline !== -1) {
      cleaned = cleaned.slice(firstNewline + 1)
    }
    // Remove trailing ```
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3)
    }
  }
  
  return JSON.parse(cleaned.trim())
}

// System prompt that defines the product philosophy
const SYSTEM_PROMPT = `You are an AI assistant for Cago, a career clarity product.

YOUR CORE PURPOSE:
Help people who have already chosen a direction but feel uncertain. Your job is to provide CLARITY — the kind of clarity that comes from feeling truly understood and seeing your situation mapped out clearly.

PRODUCT PHILOSOPHY:
- This is NOT a generic career test or motivational tool
- Users have already picked a direction (Data Analyst, PM, Designer, etc.) but feel unsure or underprepared
- Clarity comes before recommendation
- Reflection comes before action
- Progress should feel calm, not overwhelming

PERSONALIZATION IS EVERYTHING:
- Read their background CAREFULLY — extract specific details
- Reference their actual experience, not generic statements
- If they mentioned "3 years in marketing", use that. If they mentioned "self-taught Python", acknowledge it.
- The more specific you are to THEIR situation, the more clarity they get
- Generic advice = no clarity. Personalized insight = clarity.

TONE & LANGUAGE RULES:
- Calm, intelligent, reassuring, structured, human
- Use soft, grounded language
- Prefer "may", "tends to", "often" over definitive statements
- Write like a thoughtful mentor who has read their story carefully
- NEVER use: exclamation marks, hype words, "best", "perfect", "you should", "amazing", "incredible"
- NEVER say: "lack", "behind", "weak", or imply failure
- NEVER sound salesy, motivational, or like a bootcamp landing page
- Avoid buzzwords and corporate speak

THE THREE FEELINGS TO CREATE:
1. "I feel seen" — they should think "this understands MY specific situation"
2. "I understand where I am" — clear, honest picture of their current position
3. "I know what to do next" — concrete, prioritized, not overwhelming

SUCCESS = "I'm less confused than before"

Remember: You are a quiet, thoughtful mentor — not a career coach who talks in platitudes.`

// Generate "You Are Here" assessment
app.post('/api/assessment', async (req, res) => {
  try {
    const { direction, directionLabel, background, confidence } = req.body

    const prompt = `Generate a deeply personalized "You Are Here" career assessment.

USER'S EXACT INPUT:
- Chosen direction: ${directionLabel}
- Their background (READ CAREFULLY): ${background}
- Confidence level: ${confidence}

YOUR TASK:
Create an assessment that makes them think "wow, this actually understands MY situation."

CRITICAL — PERSONALIZATION RULES:
1. Extract SPECIFIC details from their background (years of experience, tools mentioned, industries, education, projects)
2. Reference these specifics in your assessment — don't be generic
3. If they said "I worked in sales for 5 years" → acknowledge the sales background and how it transfers
4. If they mentioned specific tools or skills → include them in assets
5. The more you reference THEIR actual words and experience, the more clarity they feel

OUTPUT (JSON only):
{
  "stage": {
    "label": "One of: 'Early Exploration', 'Building Foundation', 'Active Development', 'Transition Ready', or create a fitting one",
    "description": "One sentence about where THEY specifically are. Reference their background."
  },
  "assets": [
    {
      "text": "Something specific they already have based on what they wrote",
      "signal": "Why this particular thing matters for their direction"
    }
  ],
  "gaps": [
    {
      "text": "What's not yet in place (NEVER say lack/missing/behind)",
      "note": "Normalize this — explain it's common or develops with time"
    }
  ],
  "readiness": [
    {
      "name": "Clarity of direction",
      "level": "developing/moderate/high",
      "note": "Based on their confidence level and what they shared"
    },
    {
      "name": "Foundational knowledge", 
      "level": "developing/moderate/high",
      "note": "Based on education/learning they mentioned"
    },
    {
      "name": "Practical experience",
      "level": "developing/moderate/high", 
      "note": "Based on projects/work they mentioned"
    }
  ],
  "transition": "Gentle transition that acknowledges their specific situation. No advice."
}

RULES:
- 2-4 assets, each referencing something SPECIFIC from their background
- 2-3 gaps maximum
- NO generic statements like "you have transferable skills" — be SPECIFIC about which skills
- This is observation, not advice
- Tone: like a thoughtful friend who really listened

Return ONLY valid JSON.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    })

    const content = message.content[0].text
    const assessment = extractJSON(content)
    assessment.directionLabel = directionLabel
    
    res.json(assessment)
  } catch (error) {
    console.error('Assessment error:', error)
    res.status(500).json({ error: 'Failed to generate assessment' })
  }
})

// Generate mentor recommendation
app.post('/api/mentor', async (req, res) => {
  try {
    const { direction, directionLabel, background, confidence, adjustments } = req.body

    const prompt = `Create a personalized mentor recommendation with specific session prep.

USER'S SPECIFIC SITUATION:
- Direction: ${directionLabel}
- Their background: ${background}
- Confidence: ${confidence}
${adjustments ? `- They added: ${adjustments}` : ''}

YOUR TASK:
1. Recommend a mentor whose experience addresses THIS user's gaps
2. Create PERSONALIZED session expectations based on their specific situation
3. Suggest SPECIFIC questions they should ask based on their background
4. Tell them EXACTLY what to prepare to maximize the session

OUTPUT (JSON only):
{
  "mentor": {
    "name": "Realistic full name",
    "title": "Role at Company",
    "experience": "X years in [relevant field]",
    "initials": "XX",
    "specialties": ["3 areas relevant to user's gaps"],
    "approach": "One sentence about mentoring style"
  },
  "matchReasons": [
    {
      "title": "Specific reason",
      "text": "2-3 sentences referencing THEIR background"
    }
  ],
  "sessionExpectations": [
    {
      "topic": "Specific topic based on their gaps",
      "outcome": "What they'll understand after",
      "why": "Why this matters for THEM"
    }
  ],
  "questionsToAsk": [
    {
      "question": "Specific question based on their situation",
      "context": "Why this question matters for them"
    }
  ],
  "whatToPrepare": [
    {
      "item": "Specific thing to prepare",
      "why": "How this helps the session",
      "howTo": "Brief instruction"
    }
  ]
}

PERSONALIZATION RULES - BE SPECIFIC:

BAD (generic):
- "Learn about the industry" ❌
- "Prepare questions" ❌
- "Understand career paths" ❌

GOOD (specific to user):
- "Discuss how your marketing background translates to PM" ✓
- "Get feedback on your SQL portfolio project" ✓
- "Ask about transitioning from [their field] at your experience level" ✓

- 2-3 match reasons referencing their background
- 3 session expectations specific to their gaps
- 3-4 questions they should ask based on their situation
- 2-3 preparation items specific to what they have/need

Return ONLY valid JSON.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    })

    const content = message.content[0].text
    const recommendation = extractJSON(content)
    
    res.json(recommendation)
  } catch (error) {
    console.error('Mentor error:', error)
    res.status(500).json({ error: 'Failed to generate mentor recommendation' })
  }
})

// Generate execution plan
app.post('/api/plan', async (req, res) => {
  try {
    const { direction, directionLabel, background, confidence, adjustments } = req.body

    const prompt = `Create a personalized, actionable 90-day execution plan.

USER'S SITUATION:
- Direction: ${directionLabel}
- Background: ${background}
- Confidence: ${confidence}
${adjustments ? `- Additional: ${adjustments}` : ''}

TASK: Create a specific, actionable plan for THIS person. Reference their background.

OUTPUT (JSON only):
{
  "directionConfirmation": "2-3 sentences connecting their background to this direction.",
  
  "hardSkills": [
    {
      "skill": "Skill name",
      "why": "Why this matters for them",
      "priority": "essential/important/foundational/have",
      "currentLevel": "Where they are",
      "targetLevel": "Where to be",
      "resource": "One specific resource (course/book name)",
      "practiceProject": "One project idea"
    }
  ],
  
  "softSkills": [
    {
      "skill": "Name",
      "why": "Why it matters",
      "dailyPractice": "Daily habit"
    }
  ],
  
  "tools": [
    {
      "name": "Tool",
      "why": "Why needed",
      "getStarted": "First step"
    }
  ],
  
  "phasedPath": {
    "day30": {
      "theme": "Foundation",
      "goals": ["Goal 1", "Goal 2"],
      "tasks": [
        {"task": "Task", "deliverable": "Output", "estimatedHours": "X hours"}
      ],
      "milestone": "Success marker"
    },
    "day60": {
      "theme": "Building",
      "goals": ["Goal 1", "Goal 2"],
      "tasks": [
        {"task": "Task", "deliverable": "Output", "estimatedHours": "X hours"}
      ],
      "milestone": "Success marker"
    },
    "day90": {
      "theme": "Momentum",
      "goals": ["Goal 1", "Goal 2"],
      "tasks": [
        {"task": "Task", "deliverable": "Output", "estimatedHours": "X hours"}
      ],
      "milestone": "Success marker"
    }
  },
  
  "weeklyActions": [
    {"action": "Habit", "frequency": "How often", "why": "Why"}
  ],
  
  "quickWins": [
    {"action": "Do today", "impact": "Why", "steps": ["Step 1", "Step 2"]}
  ],
  
  "potentialBlockers": [
    {"blocker": "Challenge", "solution": "How to overcome"}
  ],
  
  "successMetrics": [
    {"metric": "Measure", "target30": "30-day", "target60": "60-day", "target90": "90-day"}
  ],
  
  "closingReassurance": "2-3 encouraging sentences referencing their background."
}

RULES:
- 4 hard skills with resources and projects
- 3 soft skills with daily practices
- 4 tools
- 3 tasks per phase
- 2 quick wins, 2 blockers, 2 metrics
- 2 weekly actions
- Be specific to THEIR background
- Keep responses concise but actionable

Return ONLY valid JSON, no markdown.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    })

    const content = message.content[0].text
    console.log('Plan response length:', content.length)
    
    let plan
    try {
      plan = extractJSON(content)
    } catch (parseError) {
      console.error('JSON parse error, attempting repair...')
      // Try to repair truncated JSON
      let repaired = content.trim()
      if (repaired.startsWith('```')) {
        const firstNewline = repaired.indexOf('\n')
        if (firstNewline !== -1) repaired = repaired.slice(firstNewline + 1)
        if (repaired.endsWith('```')) repaired = repaired.slice(0, -3)
      }
      // Count braces and brackets to close them
      const openBraces = (repaired.match(/{/g) || []).length
      const closeBraces = (repaired.match(/}/g) || []).length
      const openBrackets = (repaired.match(/\[/g) || []).length
      const closeBrackets = (repaired.match(/]/g) || []).length
      
      // Try to close any unterminated strings and structures
      if (openBraces > closeBraces || openBrackets > closeBrackets) {
        // Find last complete property
        const lastCompleteComma = repaired.lastIndexOf('",')
        if (lastCompleteComma > repaired.length * 0.8) {
          repaired = repaired.slice(0, lastCompleteComma + 1)
        }
        // Close structures
        for (let i = 0; i < openBrackets - closeBrackets; i++) repaired += ']'
        for (let i = 0; i < openBraces - closeBraces; i++) repaired += '}'
      }
      
      plan = JSON.parse(repaired.trim())
    }
    plan.directionLabel = directionLabel
    
    res.json(plan)
  } catch (error) {
    console.error('Plan error:', error)
    res.status(500).json({ error: 'Failed to generate execution plan' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Cago API running on http://localhost:${PORT}`)
})

