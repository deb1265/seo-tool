// src/config/promptPresets.js

export const CONTENT_EXAMPLES = {
  blog: {
    format: `
Example formatting guidelines:
- Paragraphs should be 2-3 sentences max
- Use bullet points for lists
- Include whitespace between sections
- Use descriptive H2 and H3 headings
- Include relevant images or infographics where applicable
- Break up text with quotes or callouts
- Use bold for emphasis on key points`,
    
    writingStyle: {
      professional: `
Writing style examples:
- "According to industry research..."
- "Recent data indicates..."
- "Industry experts suggest..."
- "Best practices recommend..."
- "Research demonstrates..."
- "Evidence supports..."`,
      
      technical: `
Writing style examples:
- "Technical specifications indicate..."
- "The implementation process involves..."
- "System architecture requires..."
- "Protocol documentation states..."
- "Performance metrics show..."`,
      
      casual: `
Writing style examples:
- "You might be wondering..."
- "Let's explore..."
- "Picture this scenario..."
- "Here's the thing..."
- "Think about it this way..."`,
    }
  }
};

export const SEO_BEST_PRACTICES = `
SEO optimization guidelines:
1. Title tag best practices:
   - Include primary keyword near the beginning
   - Keep length between 50-60 characters
   - Make it compelling and clickable

2. Meta description:
   - Include primary and secondary keywords naturally
   - Keep length between 150-160 characters
   - Include a clear call to action

3. Content structure:
   - Use one H1 tag for the main title
   - Organize content with H2 and H3 subheadings
   - Include keywords in headings naturally
   - Maintain keyword density between 1-2%

4. Internal linking:
   - Link to relevant internal pages
   - Use descriptive anchor text
   - Avoid generic "click here" links

5. Content optimization:
   - Include LSI keywords and related terms
   - Optimize images with alt text
   - Use schema markup when applicable
   - Ensure mobile-friendly formatting`;

export const FORMATTING_GUIDELINES = `
Content formatting guidelines:
1. Headings structure:
   H1: Main title
   H2: Major sections
   H3: Subsections
   H4: Minor points

2. Paragraph formatting:
   - Keep paragraphs 2-3 sentences
   - Use transition words between paragraphs
   - Include one main idea per paragraph

3. Visual elements:
   - Use bullet points for lists
   - Include numbered steps for processes
   - Add blockquotes for important quotes
   - Use tables for comparing data

4. Text emphasis:
   - Bold for key points
   - Italics for definitions
   - Use callout boxes for important notes

5. Spacing:
   - Add white space between sections
   - Use short lines for readability
   - Include clear section breaks`;

export const STATISTICS_EXAMPLES = `
Guidelines for incorporating statistics:
1. Presentation formats:
   - "X% of businesses report..."
   - "According to [Source], the industry has seen a X% increase..."
   - "Research from [Year] shows..."
   - "A recent study by [Authority] found..."

2. Data visualization suggestions:
   - Use percentages for comparisons
   - Include year-over-year changes
   - Reference industry benchmarks
   - Compare before/after metrics

3. Credible sources:
   - Government reports
   - Industry studies
   - Academic research
   - Market analysis reports

4. Context guidelines:
   - Explain what the numbers mean
   - Provide relevant comparisons
   - Include time periods
   - Note data sources`;

export const INDUSTRY_SPECIFIC_TEMPLATES = {
  energy_efficiency: {
    introduction: `
Begin with key statistics about energy consumption and costs in [State/Region].
Highlight the growing importance of energy efficiency in today's context.
Mention specific challenges faced by [target audience].`,
    
    mainPoints: `
1. Program Overview:
   - Eligibility criteria
   - Available incentives
   - Application process
   - Timeline expectations

2. Benefits Analysis:
   - Energy savings potential
   - Cost reduction estimates
   - Environmental impact
   - Long-term ROI

3. Implementation Process:
   - Initial assessment
   - Recommended measures
   - Installation process
   - Post-installation verification`,
    
    caseSample: `
Case Study Structure:
1. Background
   - Building/facility type
   - Initial energy usage
   - Key challenges

2. Implementation
   - Measures installed
   - Timeline
   - Challenges overcome

3. Results
   - Energy savings achieved
   - Cost reductions
   - Additional benefits
   - Participant testimonial`
  }
};