const fs = require('fs');

const text = `AGRICULTURE
Agribusiness | test | solo | Q1: agriculture | Q6: ag
You take an objective test on agricultural economics, farm management, agribusiness marketing, and supply chain — the business side of farming.

ARTS, ENTERTAINMENT & DESIGN
Broadcast Journalism | presentation | solo/team-3 | Q1: design/writing | Q6: art or journalism
You script, film, and edit a news broadcast, then show it to judges and walk them through your production process.
Digital Animation | project submission | team-1-3 | Q1: design | Q6: art | Q5: months | Q10: built something
You create an animated video on a given topic and submit it before the conference — judged on creativity, storytelling, and technical execution.
Digital Video Production | project submission | team-1-3 | Q1: design/writing | Q6: art or journalism | Q5: months | Q10: built something
You produce a short video on a given topic — all the scripting, filming, and editing — and submit it to be judged.
Graphic Design | project submission | solo/team-1-3 | Q1: design | Q6: art | Q5: weeks | Q10: built something
You create original design pieces — logos, layouts, visual branding — based on a prompt and submit them to be scored on creativity and execution.
Journalism | test | solo | Q1: writing | Q6: journalism
Objective test covering news writing, reporting, media ethics, and how journalism works as a business.
Public Service Announcement | project submission | team-1-3 | Q1: design/writing | Q6: art or journalism | Q5: weeks | Q10: built something
You produce a short PSA video on a given social topic and submit it before the conference.
Visual Design | project submission | team-1-3 | Q1: design | Q6: art | Q5: weeks | Q10: built something
You create original visual pieces — infographics, branded materials, digital layouts — judged on design quality and execution.
Website Design | project submission | team-1-3 | Q1: design/tech | Q6: art or CS | Q5: months | Q10: built something
You design and build a polished website on a given topic — judged on visual design, usability, and content.

CAREER READY PRACTICE
Career Portfolio | presentation | solo | Q1: any | Q5: weeks | Q3: present | Q8: most polished | Q7: 11th-12th
You build a professional portfolio — resume, references, work samples — and present it live to a panel of judges.
Job Interview | presentation | solo | Q1: any | Q5: weeks | Q3: present | Q8: most polished
You submit a resume and cover letter, then go through a real mock job interview with judges scoring you on professionalism and content.

DIGITAL TECHNOLOGY
Coding & Programming | presentation | team-1-3 | Q1: tech | Q6: CS | Q5: months | Q10: built something
You write a program based on a given topic and present it — judged on how well it works and how clearly you explain what you built.
Computer Game & Simulation Programming | presentation | team-1-3 | Q1: tech | Q6: CS | Q5: months | Q10: built something
You design and build a playable game or simulation on a given topic and present it to judges.
Computer Problem Solving | test | solo | Q1: tech | Q6: CS | Q2: fine or likes math | Q3: test
Objective test using spreadsheets, databases, and logic-based problem solving — less coding, more applied tech.
Cybersecurity | test | solo | Q1: tech | Q6: CS | Q3: test
Objective test on network security, cryptography, ethical hacking, and risk management.
Data Analysis | presentation | team-1-3 | Q1: tech or money | Q6: CS or business | Q5: weeks | Q3: present
You analyze a real dataset and present your findings and recommendations to judges.
Data Science & AI | test | solo | Q1: tech | Q6: CS | Q3: test
Objective test on artificial intelligence, machine learning, data modeling, and how AI applies to business.
Introduction to Information Technology (9th-10th only) | test | solo | Q1: tech | Q7: 9th-10th | Q6: CS
Intro-level objective test on computer hardware, software, networks, and digital literacy basics.
Introduction to Programming (9th-10th only) | presentation | team-1-3 | Q1: tech | Q7: 9th-10th | Q6: CS | Q10: built something
You write a program on a given topic and present it — the entry-level version of Coding & Programming.
Management Information Systems | role play | team-1-3 | Q1: tech or managing | Q6: CS or business | Q3: role play | Q5: minimal
A role play where you're handed a real tech management problem — systems, data, infrastructure decisions — and solve it on the spot.
Mobile Application Development | presentation | team-1-3 | Q1: tech | Q6: CS | Q5: months | Q10: built something
You design and build a functional mobile app on a given topic and present it to judges.
Network Design | role play + test | team-1-3 | Q1: tech | Q6: CS | Q3: combo | Q5: weeks
You take an objective test on networking, then do a role play where you design and troubleshoot a network solution for a business.
Networking Infrastructures | test | solo | Q1: tech | Q6: CS | Q3: test
Objective test on network protocols, hardware, administration, and security.
Technology Support & Services | role play + test | solo | Q1: tech | Q6: CS | Q3: combo | Q5: weeks
You take a test on IT support concepts, then do a live role play troubleshooting a tech problem for a client.
Website Coding & Development | project submission | team-1-3 | Q1: tech or design | Q6: CS | Q5: months | Q10: built something
You build a fully functional website from scratch — judged on code quality, design, and how well it meets the prompt.

EDUCATION
Future Business Educator | presentation + pre-judged | solo | Q1: managing/writing | Q6: any | Q5: weeks | Q8: most polished
You write a lesson plan and then teach it live to judges — for people interested in business education as a career.

FINANCIAL SERVICES
Accounting | test | solo | Q1: money | Q6: business | Q2: likes math | Q3: test
Objective test on financial statements, journal entries, and the accounting cycle.
Advanced Accounting | test | solo | Q1: money | Q6: business | Q2: likes math | Q3: test | Q7: 11th-12th
Same format as Accounting but covers corporate accounting, managerial accounting, and financial analysis at a higher level.
Banking & Financial Systems | role play + test | team-1-3 | Q1: money | Q6: business | Q3: combo | Q2: likes or fine
You take a test on how banks and financial institutions work, then do a role play scenario involving a real banking or finance situation.
Financial Planning | presentation | team-1-3 | Q1: money | Q6: business | Q3: present | Q5: weeks
You analyze a family's financial situation and present a full plan covering budgeting, debt, investing, and retirement.
Financial Statement Analysis | presentation | team-1-3 | Q1: money | Q6: business | Q2: likes math | Q3: present | Q5: weeks
You dig into real financial statements and present your analysis and recommendations to judges.
Insurance & Risk Management | test | solo | Q1: money | Q6: business | Q3: test | Q2: fine
Objective test on insurance principles, risk management strategies, and how the insurance industry works.
Personal Finance | test | solo | Q1: money | Q6: business | Q3: test | Q2: fine | Q7: 9th-10th pref
Objective test on budgeting, taxes, credit, investing, and real-life money management.
Real Estate | test | solo | Q1: money | Q6: business or law | Q3: test
Objective test on real estate principles, property law, financing, and how real estate transactions work.
Securities & Investments | test | solo | Q1: money | Q6: business | Q3: test | Q2: likes math
Objective test on stocks, bonds, mutual funds, portfolio management, and financial regulations.

HEALTHCARE & HUMAN SERVICES
Community Service Project | chapter event | full chapter team | Q4: chapter team | Q1: managing | Q5: months
Your whole chapter runs a real community service initiative — judged on planning, impact, and presentation of what you did.
Healthcare Administration | test | solo | Q1: healthcare | Q6: health sciences | Q3: test
Objective test on healthcare management, medical terminology, health insurance, and running the business side of a healthcare organization.

HOSPITALITY, EVENTS & TOURISM
Hospitality & Event Management | role play | team-1-3 | Q1: managing/selling | Q6: business or marketing | Q3: role play | Q5: minimal
A role play where you handle a real hospitality or event scenario — venue issues, guest problems, logistics — on the spot.
Sports & Entertainment Management | role play | team-1-3 | Q1: managing/selling | Q6: marketing | Q3: role play | Q5: minimal
A role play where you tackle a real sports or entertainment industry scenario — sponsorships, promotions, crises — live.

MANAGEMENT & ENTREPRENEURSHIP
Business Ethics | presentation + report | team-1-3 | Q1: law/ethics or managing | Q6: law or business | Q3: present | Q5: weeks
You write a report analyzing a real business ethics dilemma, then present your findings and recommendations to judges.
Business Management | role play | team-1-3 | Q1: managing | Q6: business | Q3: role play | Q5: minimal | Q8: under pressure
A role play where you're handed a management problem — HR, operations, leadership — and have to solve it live.
Business Plan | presentation + report | team-1-3 | Q1: money or starting things | Q6: business | Q3: present | Q5: months | Q10: built something
You build a full business from scratch — market research, financials, strategy — and present the whole thing.
Computer Applications | production test | solo | Q1: tech or managing | Q6: CS or business | Q3: test | Q2: fine
A timed production test where you complete real tasks in Microsoft Office — Word, Excel, PowerPoint, Access.
Entrepreneurship | role play | team-1-3 | Q1: money or starting things | Q6: business | Q3: role play | Q8: under pressure | Q5: minimal
You're handed a business scenario cold and have to pitch a solution to judges on the spot.
Future Business Leader | presentation + test + pre-judged | solo | Q1: any | Q7: 11th-12th | Q8: most polished | Q9: experienced | Q5: months
FBLA's flagship individual event — objective test, pre-judged materials, and a live interview covering leadership and business knowledge.
Human Resource Management | test | solo | Q1: managing | Q6: business | Q3: test
Objective test on HR functions — recruiting, training, compensation, benefits, and employment law.
International Business | role play | team-1-3 | Q1: managing/selling | Q6: business | Q3: role play | Q8: under pressure
A role play where you navigate a real international business scenario — cultural competence, global strategy, problem-solving.
Introduction to Business Concepts (9th-10th only) | test | solo | Q1: money or managing | Q7: 9th-10th | Q3: test
Intro-level test on economics, marketing, management, and foundational business concepts.
Introduction to Business Procedures (9th-10th only) | test | solo | Q1: managing | Q7: 9th-10th | Q3: test
Intro-level test on office procedures, business technology, records management, and administrative functions.
Introduction to FBLA (9th-10th only) | test | solo | Q7: 9th-10th | Q9: first time | Q3: test
Intro-level test on FBLA's history, structure, programs, and mission — perfect for first-year members.
Local Chapter Annual Business Report | chapter event | full chapter team | Q4: chapter team | Q1: managing | Q5: months
Your chapter writes and presents a full annual report documenting the year's activities, goals, and accomplishments.
Organizational Leadership | test | solo | Q1: managing | Q6: business | Q3: test
Objective test on leadership theories, organizational behavior, management principles, and team dynamics.
Project Management | test | solo | Q1: managing | Q6: business | Q3: test
Objective test on project management methodologies, tools, timelines, and best practices including Agile.

MARKETING & SALES
Advertising | test | solo | Q1: selling | Q6: marketing | Q3: test
Objective test on advertising principles, media planning, consumer behavior, and the creative side of marketing.
Business Communication | test | solo | Q1: writing/selling | Q6: English or marketing | Q3: test
Objective test on written and verbal communication, professional correspondence, and workplace communication practices.
Customer Service | role play | solo | Q1: selling or managing | Q6: marketing or business | Q3: role play | Q8: under pressure
A solo role play where you handle a real customer service scenario on the spot — complaints, difficult situations, solutions.
Impromptu Speaking | presentation | solo | Q1: writing/selling | Q6: English | Q3: present | Q8: under pressure | Q5: minimal
You're handed a topic with no prep time and have to deliver a speech on the spot. Pure quick thinking.
Introduction to Business Communication (9th-10th only) | test | solo | Q1: writing | Q7: 9th-10th | Q3: test
Intro-level test on business writing, professional communication, and workplace correspondence basics.
Introduction to Business Presentation (9th-10th only) | presentation | team-1-3 | Q1: selling/writing | Q7: 9th-10th | Q3: present
You prepare and deliver a short business presentation on a given topic — the intro-level version of public speaking events.
Introduction to Marketing Concepts (9th-10th only) | test | solo | Q1: selling | Q7: 9th-10th | Q6: marketing | Q3: test
Intro-level test on the basics of marketing — the 4 Ps, consumer behavior, market research.
Introduction to Public Speaking (9th-10th only) | presentation | solo | Q1: selling/writing | Q7: 9th-10th | Q3: present | Q8: most polished
You deliver a prepared speech on a given topic — the intro-level public speaking event.
Introduction to Retail & Merchandising (9th-10th only) | test | solo | Q1: selling | Q7: 9th-10th | Q6: marketing | Q3: test
Intro-level test on retail operations, merchandising, customer service, and inventory management.
Introduction to Social Media Strategy (9th-10th only) | presentation | team-1-3 | Q1: selling or design | Q7: 9th-10th | Q6: marketing or art | Q3: present
You develop and present a social media strategy for a real business scenario.
Introduction to Supply Chain Management (9th-10th only) | test | solo | Q1: managing | Q7: 9th-10th | Q3: test
Intro-level test on supply chain fundamentals — logistics, procurement, and how goods move from production to consumer.
Marketing | role play | team-1-3 | Q1: selling | Q6: marketing | Q3: role play | Q8: under pressure
A role play where you're handed a marketing scenario and have to develop and pitch a strategy on the spot.
Public Speaking | presentation | solo | Q1: selling/writing | Q6: English | Q3: present | Q8: most polished | Q5: weeks
You deliver a prepared speech on a given topic to a panel of judges — scored on content, delivery, and persuasiveness.
Sales Presentation | presentation | team-1-3 | Q1: selling | Q6: marketing | Q3: present | Q8: most polished | Q5: weeks
You develop and deliver a full sales pitch for a given product or service — judged on persuasion, professionalism, and technique.
Social Media Strategies | presentation | team-1-3 | Q1: selling or design | Q6: marketing or art | Q3: present | Q5: weeks
You develop and present a comprehensive social media strategy for a real business scenario.

SUPPLY CHAIN, LAW & OTHER
Business Law | test | solo | Q1: law | Q6: law | Q3: test
Objective test covering contract law, employment law, torts, and the legal environment of business.
Economics | test | solo | Q1: money | Q6: business or law | Q3: test | Q2: fine or likes math
Objective test on supply and demand, market structures, fiscal policy, and macro/microeconomics.
Event Planning | presentation | team-1-3 | Q1: managing | Q6: business or marketing | Q3: present | Q5: weeks
You build and present a full plan for a real event — budgeting, promotion, logistics, and execution strategy.
Parliamentary Procedure | role play | full chapter team | Q4: chapter team | Q1: managing | Q8: team executed perfectly
A 4–5 person team runs a formal business meeting using Robert's Rules of Order — judged on accuracy, flow, and teamwork.
Public Administration & Management | test | solo | Q1: law or managing | Q6: law or business | Q3: test
Objective test on government operations, public policy, administrative law, and how public sector organizations work.
Supply Chain Management | presentation | team-1-3 | Q1: managing | Q6: business | Q3: present | Q5: months | Q10: built something
Your team builds and presents a full strategy for a real supply chain challenge — sourcing, logistics, and cost management.`;

const lines = text.split('\n');
const events = [];
let currentCategory = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  if (!line.includes('|')) {
    currentCategory = line;
  } else {
    const parts = line.split('|').map(s => s.trim());
    const name = parts[0];
    const format = parts[1];
    const team = parts[2];
    const tags = parts.slice(3).map(t => t.toLowerCase());
    
    const desc = lines[++i].trim();
    events.push({
      category: currentCategory,
      name,
      format,
      team,
      tags,
      description: desc
    });
  }
}

fs.writeFileSync('C:/Users/jonah/.gemini/antigravity/scratch/fbla-hub/frontend/src/eventsData.ts', 'export const EVENT_BANK = ' + JSON.stringify(events, null, 2) + ';');
console.log('Done!');
