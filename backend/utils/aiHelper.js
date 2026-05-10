const Groq = require('groq-sdk')

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

// Feature 1 — Auto categorize item
const categorizeItem = async (title, description) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are a donation categorization assistant for GiveLoop, an Indian donation platform.
        Analyze the item and return ONLY a JSON object with no extra text.
        Categories available: clothes, books, food, electronics, furniture, other`
      },
      {
        role: 'user',
        content: `Item title: ${title}
        Description: ${description}
        
        Return this exact JSON format:
        {
          "category": "one of the available categories",
          "confidence": "high/medium/low",
          "reason": "one line explanation"
        }`
      }
    ],
    temperature: 0.3
  })

  const raw = response.choices[0].message.content
  return JSON.parse(raw)
}

// Feature 2 — Match donation to best NGO
const matchNGO = async (item, ngos) => {
  const ngoList = ngos.map(n => ({
    id: n.id,
    name: n.orgName,
    location: n.location,
    accepts: n.acceptedCategories
  }))

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an NGO matching assistant for GiveLoop, an Indian donation platform.
        Match donated items to the most suitable NGO.
        Return ONLY a JSON object with no extra text.`
      },
      {
        role: 'user',
        content: `Donated item:
        Title: ${item.title}
        Category: ${item.category}
        Description: ${item.description}
        Donor city: ${item.donor?.city || 'unknown'}

        Available NGOs:
        ${JSON.stringify(ngoList, null, 2)}

        Return this exact JSON format:
        {
          "bestMatchId": "ngo id here",
          "bestMatchName": "ngo name here",
          "reason": "one line explanation of why this NGO is best match",
          "alternativeIds": ["other ngo ids if available"]
        }`
      }
    ],
    temperature: 0.3
  })

  const raw = response.choices[0].message.content
  return JSON.parse(raw)
}

// Feature 3 — Generate impact report
const generateImpactReport = async (item, ngo, volunteer) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are a heartwarming impact report writer for GiveLoop, an Indian donation platform.
        Write a short, warm, personal message to the donor about their donation's impact.
        Keep it under 100 words. Be genuine and specific. No generic phrases.`
      },
      {
        role: 'user',
        content: `Donation details:
        Item: ${item.title}
        Description: ${item.description}
        Category: ${item.category}
        NGO that received it: ${ngo.orgName}
        NGO location: ${ngo.location}
        NGO description: ${ngo.description}
        
        Write the impact message for the donor.`
      }
    ],
    temperature: 0.7
  })

  return response.choices[0].message.content
}

module.exports = { categorizeItem, matchNGO, generateImpactReport }