// src/services/promptGenerator.js

const TONE_DESCRIPTORS = {
  professional: {
    style: 'authoritative and business-oriented',
    words: ['furthermore', 'moreover', 'consequently', 'therefore', 'significantly', 'notably'],
    avoid: ['slang', 'casual expressions', 'colloquialisms', 'informal language'],
    examples: [
      'Research indicates that...',
      'Analysis demonstrates...',
      'Industry experts suggest...',
      'Evidence supports...',
      'Studies have shown...'
    ]
  },
  casual: {
    style: 'conversational and approachable', 
    words: ['actually', 'basically', 'essentially', 'simply put', 'in other words'],
    avoid: ['complex jargon', 'overly formal language', 'academic terminology'],
    examples: [
      "Let's explore...",
      "You might be wondering...",
      "Here's the thing...",
      "Think about it this way...",
      "Imagine if..."
    ]
  },
  technical: {
    style: 'precise and detailed',
    words: ['specifically', 'technically', 'fundamentally', 'systematically', 'effectively'],
    avoid: ['vague descriptions', 'oversimplification', 'casual analogies'],
    examples: [
      'The system architecture...',
      'Technical specifications indicate...',
      'The implementation process...',
      'According to the documentation...',
      'The data suggests...'
    ]
  },
  academic: {
    style: 'scholarly and research-oriented',
    words: ['subsequently', 'thus', 'accordingly', 'wherein', 'hereby', 'thereby'],
    avoid: ['oversimplification', 'casual tone', 'colloquialisms'],
    examples: [
      'The research methodology...',
      'The findings suggest...',
      'Prior studies indicate...',
      'The data demonstrates...',
      'Analysis reveals...'
    ]
  },
  default: {
    style: 'clear and informative',
    words: ['particularly', 'specifically', 'notably', 'importantly'],
    avoid: ['unclear language', 'excessive jargon', 'ambiguity'],
    examples: [
      "It is important to note...",
      "Consider the following...",
      "This demonstrates...",
      "For example...",
      "To illustrate..."
    ]
  }
};

const CONTENT_TYPE_TEMPLATES = {
  blog: {
    structure: [
      'Engaging introduction with a hook',
      '2-3 main sections with subheadings',
      'Practical examples or case studies',
      'Conclusion with key takeaways',
      'Call to action'
    ],
    format: [
      'Use short, digestible paragraphs (2-3 sentences)',
      'Include bullet points for easy scanning',
      'Add relevant subheadings every 2-3 paragraphs',
      'Use images or diagrams where appropriate',
      'Include expert quotes or statistics'
    ],
    style: 'engaging and informative',
    wordCount: '1000-1500 words'
  },
  article: {
    structure: [
      'Executive summary',
      'Detailed introduction',
      '3-4 comprehensive sections',
      'Expert insights or quotes',
      'Conclusion with industry implications'
    ],
    format: [
      'Professional tone throughout',
      'Include data and research citations',
      'Use industry-specific terminology',
      'Incorporate relevant case studies',
      'Add visual elements for complex concepts'
    ],
    style: 'analytical and thorough',
    wordCount: '1500-2000 words'
  },
  whitepaper: {
    structure: [
      'Executive summary',
      'Problem statement',
      'Methodology',
      'Findings and analysis',
      'Recommendations',
      'Technical specifications'
    ],
    format: [
      'Formal academic style',
      'Comprehensive citations',
      'Technical diagrams and charts',
      'Detailed methodology section',
      'Professional formatting'
    ],
    style: 'technical and detailed',
    wordCount: '2500-3500 words'
  },
  default: {
    structure: [
      'Introduction',
      'Main content sections',
      'Supporting evidence',
      'Conclusion',
      'Next steps'
    ],
    format: [
      'Clear and organized layout',
      'Logical flow between sections',
      'Supporting evidence where needed',
      'Professional presentation'
    ],
    style: 'clear and informative',
    wordCount: '1000-1500 words'
  }
};

const AUDIENCE_GUIDELINES = {
  general: {
    comprehension: 'accessible to a broad audience',
    terminology: 'avoid technical jargon, explain complex terms',
    examples: 'use everyday scenarios and familiar concepts',
    contentAdjustments: [
      'Use simple, clear language',
      'Provide basic background information',
      'Include relatable examples',
      'Define technical terms',
      'Focus on practical applications'
    ]
  },
  technical: {
    comprehension: 'assumes technical background and expertise',
    terminology: 'use industry-standard technical terms and concepts',
    examples: 'provide technical specifications and implementation details',
    contentAdjustments: [
      'Include detailed technical specifications',
      'Reference industry standards',
      'Provide implementation guidance',
      'Include code or technical diagrams',
      'Focus on technical accuracy'
    ]
  },
  business: {
    comprehension: 'focus on business impact and ROI',
    terminology: 'use business and industry terms',
    examples: 'include business cases and market analysis',
    contentAdjustments: [
      'Emphasize business value',
      'Include ROI calculations',
      'Provide market context',
      'Reference industry trends',
      'Focus on strategic implications'
    ]
  },
  professional: {
    comprehension: 'assumes professional knowledge of the field',
    terminology: 'use industry-specific terms and concepts',
    examples: 'include professional scenarios and best practices',
    contentAdjustments: [
      'Focus on industry best practices',
      'Include professional guidelines',
      'Reference industry standards',
      'Provide practical implementation steps',
      'Include professional resources'
    ]
  },
  default: {
    comprehension: 'balanced for general professional audience',
    terminology: 'mix of general and specialized terms',
    examples: 'combination of basic and advanced concepts',
    contentAdjustments: [
      'Balance technical and general content',
      'Explain complex concepts clearly',
      'Include varied examples',
      'Provide additional resources',
      'Consider multiple expertise levels'
    ]
  }
};

const INDUSTRY_TEMPLATES = {
  energy_efficiency: {
    introduction: `
Program Overview:
- Current energy consumption patterns
- Cost implications for businesses/homeowners
- Environmental impact considerations
- Available incentives and programs
- Qualification criteria`,
    
    mainPoints: `
Key Components:
1. Program Benefits
   - Energy saving potential
   - Cost reduction estimates
   - Environmental impact
   - Available incentives
   - ROI analysis

2. Implementation Process
   - Initial assessment
   - Energy audit procedure
   - Recommended improvements
   - Installation timeline
   - Verification process

3. Compliance and Requirements
   - Eligibility criteria
   - Documentation needed
   - Technical specifications
   - Quality assurance measures
   - Ongoing maintenance`,
    
    caseStudy: `
Case Study Framework:
1. Situation Analysis
   - Building/facility type
   - Initial energy usage
   - Primary challenges
   - Goals and objectives

2. Implementation Details
   - Energy efficiency measures
   - Installation process
   - Timeline and milestones
   - Challenges and solutions

3. Results and Benefits
   - Energy savings achieved
   - Cost reductions realized
   - Environmental impact
   - Additional benefits
   - Client testimonial`,
    
    statistics: `
Key Metrics to Include:
- Average energy savings percentage
- Typical ROI timeframe
- Cost reduction examples
- Environmental impact data
- Program success rates
- Participant satisfaction rates`,
    
    callToAction: `
Next Steps:
1. Schedule an energy assessment
2. Review available incentives
3. Develop implementation plan
4. Begin application process
5. Contact program administrators`
  }
};

class PromptGenerator {
  constructor() {
    this.defaultParams = {
      contentType: 'article',
      audience: 'general',
      tone: 'professional',
      style: 'informative'
    };
  }

  normalizeParameter(param, defaultValue = '') {
    return (param || defaultValue).toLowerCase().trim();
  }

  detectIndustry(topic = '') {
    const topicLower = topic.toLowerCase();
    
    // Energy efficiency industry detection
    if (topicLower.includes('nyserda') || 
        topicLower.includes('energy') || 
        topicLower.includes('empower') ||
        topicLower.includes('utility') ||
        topicLower.includes('power')) {
      return 'energy_efficiency';
    }
    
    return null;
  }

  getContentTemplate(contentType) {
    const normalizedType = this.normalizeParameter(contentType, 'default');
    return CONTENT_TYPE_TEMPLATES[normalizedType] || CONTENT_TYPE_TEMPLATES.default;
  }

  getAudienceGuidelines(audience) {
    const normalizedAudience = this.normalizeParameter(audience, 'default');
    return AUDIENCE_GUIDELINES[normalizedAudience] || AUDIENCE_GUIDELINES.default;
  }

  getToneDescriptor(tone) {
    const normalizedTone = this.normalizeParameter(tone, 'default');
    return TONE_DESCRIPTORS[normalizedTone] || TONE_DESCRIPTORS.default;
  }

  generatePrompt(params = {}) {
    // Merge with default parameters
    const safeParams = { ...this.defaultParams, ...params };
    
    // Get templates and guidelines
    const contentTemplate = this.getContentTemplate(safeParams.contentType);
    const audienceGuide = this.getAudienceGuidelines(safeParams.audience);
    const toneGuide = this.getToneDescriptor(safeParams.tone);
    const industry = this.detectIndustry(safeParams.topic);
    const industryTemplate = industry ? INDUSTRY_TEMPLATES[industry] : null;
    
    // Ensure safe access to arrays
    const keywords = Array.isArray(safeParams.keywords) ? safeParams.keywords : [];

    // Build the prompt
    let prompt = `Create a ${safeParams.contentType || 'content piece'} about "${safeParams.topic || 'the specified topic'}"

Content Specifications:
- Type: ${safeParams.contentType || 'General Content'}
- Target Length: ${contentTemplate.wordCount}
- Format: web-optimized with short paragraphs
${contentTemplate.format.map(item => `  • ${item}`).join('\n')}

Audience Considerations:
- Target Audience: ${safeParams.audience || 'General'}
- Comprehension Level: ${audienceGuide.comprehension}
- Terminology: ${audienceGuide.terminology}
- Examples Should: ${audienceGuide.examples}
${audienceGuide.contentAdjustments.map(item => `  • ${item}`).join('\n')}

Tone and Style:
- Tone: ${safeParams.tone || 'Professional'}
- Writing Style: ${toneGuide.style}
- Preferred Language: Use words like: ${toneGuide.words.join(', ')}
- Avoid: ${toneGuide.avoid.join(', ')}
Example phrases:
${toneGuide.examples.map(example => `  • ${example}`).join('\n')}

Required Structure:
${industryTemplate ? industryTemplate.mainPoints : contentTemplate.structure.map(section => `- ${section}`).join('\n')}

Content Requirements:
- Primary Topic: ${safeParams.topic || 'Specified Topic'}
${keywords.length > 0 ? `- Essential Keywords: ${keywords.join(', ')}` : ''}
${safeParams.includeReferences ? '- Include credible sources and citations throughout the content' : ''}
${safeParams.competitorAnalysis ? '- Analyze and reference industry leaders and competitors in this space' : ''}

${industryTemplate ? `
Industry-Specific Guidelines:
${industryTemplate.statistics}

Case Study Framework:
${industryTemplate.caseStudy}

Recommended Call to Action:
${industryTemplate.callToAction}
` : ''}

Additional Guidelines:
1. Ensure content is original and engaging
2. Incorporate relevant statistics and data points
3. Follow SEO best practices
4. Use appropriate subheadings and formatting
5. Include actionable insights or takeaways
${safeParams.includeReferences ? '6. Properly cite all references using consistent formatting' : ''}
${safeParams.competitorAnalysis ? '7. Provide competitive analysis with specific examples' : ''}

Please create comprehensive content that follows these specifications while maintaining a natural, engaging flow.`;

    return prompt.trim();
  }

  generateEditPrompt(existingContent, params = {}) {
    const basePrompt = this.generatePrompt(params);
    
    return `Review and improve the following content according to these guidelines:

${basePrompt}

Original Content to Edit:
${existingContent || ''}

Please provide an improved version that:
1. Maintains the core message and key points
2. Enhances the style and tone to match requirements
3. Incorporates any missing required elements
4. Improves overall clarity and engagement
5. Ensures all specifications are met`;
  }
}

export default new PromptGenerator();