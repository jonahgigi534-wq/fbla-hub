import React, { useState } from 'react';
import { EVENT_BANK } from '../eventsData';
import { ArrowLeft, ArrowRight, RotateCcw, ExternalLink } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'q1',
    title: "Choose what you're interested in",
    multi: true,
    options: [
      { text: "Money, investing, and how businesses make decisions", value: "money" },
      { text: "Coding, apps, or anything tech", value: "tech" },
      { text: "Design — graphics, video, animation", value: "design" },
      { text: "Running things — managing people, planning, organizing", value: "managing" },
      { text: "Selling, marketing, or convincing people", value: "selling" },
      { text: "Writing, journalism, or media", value: "writing" },
      { text: "Law, government, or ethics", value: "law" },
      { text: "Healthcare or the business side of hospitals/clinics", value: "healthcare" },
      { text: "Agriculture or farming business", value: "agriculture" },
      { text: "I don't really know yet", value: "any" }
    ]
  },
  {
    id: 'q2',
    title: "How are you with math and numbers?",
    multi: false,
    options: [
      { text: "I genuinely like it", value: "likes math" },
      { text: "I'm fine with it", value: "fine" },
      { text: "I avoid it when I can", value: "none" }
    ]
  },
  {
    id: 'q3',
    title: "How do you want to compete?",
    multi: false,
    options: [
      { text: "Take a test and be done", value: "test" },
      { text: "Present something to judges", value: "present" },
      { text: "Role play a scenario on the spot", value: "role play" },
      { text: "Submit a project before the conference", value: "project" },
      { text: "Combination — test + presentation or test + role play", value: "combo" }
    ]
  },
  {
    id: 'q4',
    title: "Solo or with people?",
    multi: false,
    options: [
      { text: "Solo", value: "solo" },
      { text: "Me and one partner", value: "team-1-3" },
      { text: "Team of 3", value: "team-1-3" },
      { text: "Full chapter team (4–5 people)", value: "full chapter team" }
    ]
  },
  {
    id: 'q5',
    title: "How much time are you putting into prep?",
    multi: false,
    options: [
      { text: "Minimal — study a topic and show up", value: "minimal" },
      { text: "A few weeks — enough to build something solid", value: "weeks" },
      { text: "Months — I'm going all in", value: "months" }
    ]
  },
  {
    id: 'q6',
    title: "What interests you the MOST?",
    multi: false,
    options: [
      { text: "Business, finance, or econ", value: "business" },
      { text: "Computer science or IT", value: "cs" },
      { text: "Marketing or advertising", value: "marketing" },
      { text: "English or communications", value: "english" },
      { text: "Government, law, or social studies", value: "law" },
      { text: "Art, media, or design", value: "art" },
      { text: "Health sciences", value: "health sciences" },
      { text: "Ag or environmental science", value: "ag" },
      { text: "None of them honestly", value: "any" }
    ]
  },
  {
    id: 'q7',
    title: "What grade are you in?",
    multi: false,
    options: [
      { text: "9th or 10th", value: "9th-10th" },
      { text: "11th or 12th", value: "11th-12th" }
    ]
  },
  {
    id: 'q8',
    title: "Which fits you the most?",
    multi: false,
    options: [
      { text: "I'm the one who already knows the answer before the test starts", value: "test" },
      { text: "I can build something from scratch and make it work", value: "built something" },
      { text: "I perform better under pressure than when I'm over-prepared", value: "under pressure" },
      { text: "I'm the most polished person in the room when I present", value: "most polished" },
      { text: "I'm the one who keeps the group on track", value: "team executed perfectly" }
    ]
  },
  {
    id: 'q9',
    title: "What's your experience with FBLA competitions?",
    multi: false,
    options: [
      { text: "First time competing", value: "first time" },
      { text: "Competed before, looking for something new", value: "experienced" },
      { text: "I know what I'm doing, just want confirmation", value: "experienced" }
    ]
  },
  {
    id: 'q10',
    title: "What would feel like a real win to you?",
    multi: false,
    options: [
      { text: "I out-studied everyone on a hard topic", value: "test" },
      { text: "My presentation was the most polished", value: "most polished" },
      { text: "I built something and it actually worked", value: "built something" },
      { text: "I improvised better than anyone", value: "under pressure" },
      { text: "My team executed perfectly together", value: "team executed perfectly" }
    ]
  }
];

export default function EventRecommender() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>(Array(10).fill(null));
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  
  const handleNext = () => {
    if (step < QUESTIONS.length) {
      setDirection('left');
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection('right');
      setStep(s => s - 1);
    }
  };

  const resetQuiz = () => {
    setAnswers(Array(10).fill(null));
    setDirection('right');
    setStep(0);
  };

  const handleSelect = (val: string) => {
    const q = QUESTIONS[step];
    if (q.multi) {
      const current = Array.isArray(answers[step]) ? answers[step] : [];
      if (current.includes(val)) {
        const next = current.filter((v: string) => v !== val);
        setAnswers(prev => { const n = [...prev]; n[step] = next; return n; });
      } else {
        const next = [...current, val];
        setAnswers(prev => { const n = [...prev]; n[step] = next; return n; });
      }
    } else {
      setAnswers(prev => { const n = [...prev]; n[step] = val; return n; });
      // auto-advance for single select
      setTimeout(() => handleNext(), 300);
    }
  };

  const calculateResults = () => {
    let scoredEvents = EVENT_BANK.map((event: any) => {
      let score = 0;
      const reasons: string[] = [];

      // Q1: multi-select (weight 3)
      const q1Ans = answers[0] || [];
      const eventQ1Tags = event.tags.filter((t: string) => t.startsWith('q1:')).flatMap((t: string) => t.replace('q1:', '').split('/').flatMap(s => s.split(' or ')).map(s => s.trim()));
      
      let q1Matched = false;
      for (const ans of q1Ans) {
        if (eventQ1Tags.includes(ans) || eventQ1Tags.includes('any')) { score += 3; q1Matched = true; }
        if (ans === 'managing' && eventQ1Tags.includes('starting things')) { score += 3; q1Matched = true; }
        if (ans === 'money' && eventQ1Tags.includes('starting things')) { score += 3; q1Matched = true; }
      }
      if (q1Matched) reasons.push("You said you're interested in this exact field — this event is perfectly aligned with your core interests.");

      // Q2: math (weight 1)
      const eventQ2Tags = event.tags.filter((t: string) => t.startsWith('q2:')).map((t: string) => t.replace('q2:', '').trim());
      if (eventQ2Tags.some((t: string) => t.includes(answers[1]))) {
        score += 1;
        if (answers[1] === 'likes math') reasons.push("Utilizes your strong math and numbers skills.");
      }

      // Q3: competition format (weight 2)
      let q3Matched = false;
      const q3Ans = answers[2];
      const eventQ3Tags = event.tags.filter((t: string) => t.startsWith('q3:')).map((t: string) => t.replace('q3:', '').trim());
      
      if (q3Ans === 'test' && (event.format.includes('test') || eventQ3Tags.includes('test'))) q3Matched = true;
      if (q3Ans === 'present' && (event.format.includes('presentation') || eventQ3Tags.includes('present'))) q3Matched = true;
      if (q3Ans === 'role play' && (event.format.includes('role play') || eventQ3Tags.includes('role play'))) q3Matched = true;
      if (q3Ans === 'project' && (event.format.includes('project') || eventQ3Tags.includes('project'))) q3Matched = true;
      if (q3Ans === 'combo' && (event.format.includes('combo') || event.format.includes('+') || eventQ3Tags.includes('combo'))) q3Matched = true;

      if (q3Matched) {
        score += 2;
        reasons.push(`Allows you to compete exactly how you prefer (${QUESTIONS[2].options.find(o => o.value === q3Ans)?.text.toLowerCase()}).`);
      }

      // Q4: solo/team (weight 1)
      const q4Ans = answers[3];
      if (
        (q4Ans === 'solo' && event.team.includes('solo')) ||
        (q4Ans === 'team-1-3' && event.team.includes('team-')) ||
        (q4Ans === 'full chapter team' && event.team.includes('chapter'))
      ) {
        score += 1;
      }

      // Q5: prep time (weight 1)
      const q5Ans = answers[4];
      const eventQ5Tags = event.tags.filter((t: string) => t.startsWith('q5:')).map((t: string) => t.replace('q5:', '').trim());
      if (eventQ5Tags.includes(q5Ans)) score += 1;

      // Q6: MOST interest (weight 3)
      const q6Ans = answers[5];
      const eventQ6Tags = event.tags.filter((t: string) => t.startsWith('q6:')).flatMap((t: string) => t.replace('q6:', '').split(' or ').map(s => s.trim()));
      if (eventQ6Tags.includes(q6Ans) || eventQ6Tags.includes('any')) {
        score += 3;
        const interestText = QUESTIONS[5].options.find(o => o.value === q6Ans)?.text.split(',')[0].toLowerCase() || "this subject";
        reasons.push(`Directly applies to your number one interest in ${interestText}.`);
      }

      // Q7: Grade level filter
      const q7Ans = answers[6];
      const eventQ7Tags = event.tags.filter((t: string) => t.startsWith('q7:')).map((t: string) => t.replace('q7:', '').trim());
      let isDisqualified = false;
      let isIntro = event.name.includes('(9th-10th only)');
      
      if (q7Ans === '11th-12th' && isIntro) isDisqualified = true;
      if (q7Ans === '9th-10th' && eventQ7Tags.includes('11th-12th')) isDisqualified = true;

      // Q8: fits most (weight 2)
      const q8Ans = answers[7];
      const eventQ8Tags = event.tags.filter((t: string) => t.startsWith('q8:')).map((t: string) => t.replace('q8:', '').trim());
      let q8Matched = false;
      if (eventQ8Tags.includes(q8Ans)) q8Matched = true;
      if (q8Ans === 'test' && event.format.includes('test')) q8Matched = true;
      if (q8Ans === 'built something' && (event.format.includes('project') || event.tags.some((t: string) => t.includes('q10: built something')))) q8Matched = true;

      if (q8Matched) {
        score += 2;
        reasons.push("Perfectly matches your natural strengths and work style.");
      }

      // Q9: experience (weight 1)
      const q9Ans = answers[8];
      const eventQ9Tags = event.tags.filter((t: string) => t.startsWith('q9:')).map((t: string) => t.replace('q9:', '').trim());
      if (eventQ9Tags.includes(q9Ans)) score += 1;

      // Q10: real win (weight 1)
      const q10Ans = answers[9];
      const eventQ10Tags = event.tags.filter((t: string) => t.startsWith('q10:')).map((t: string) => t.replace('q10:', '').trim());
      let q10Matched = false;
      if (eventQ10Tags.includes(q10Ans)) q10Matched = true;
      if (q10Ans === 'test' && event.format.includes('test')) q10Matched = true;
      if (q10Ans === 'built something' && event.format.includes('project')) q10Matched = true;
      if (q10Ans === 'most polished' && event.format.includes('presentation')) q10Matched = true;
      if (q10Ans === 'under pressure' && event.format.includes('role play')) q10Matched = true;
      if (q10Ans === 'team executed perfectly' && event.team.includes('team')) q10Matched = true;

      if (q10Matched) {
        score += 1;
        reasons.push("Gives you the exact type of 'win' you are looking for.");
      }

      return { ...event, score, reasons, isDisqualified, isIntro };
    });

    scoredEvents = scoredEvents.filter((e: any) => !e.isDisqualified);
    scoredEvents.sort((a: any, b: any) => b.score - a.score);

    const is9th10th = answers[6] === '9th-10th';
    if (is9th10th) {
      const introEvents = scoredEvents.filter((e: any) => e.isIntro);
      if (introEvents.length > 0 && introEvents[0].score > 0) {
        const topIntro = introEvents[0];
        scoredEvents = [topIntro, ...scoredEvents.filter((e: any) => e !== topIntro)];
      }
    }

    scoredEvents.forEach((e: any) => {
      let fallbackReasons = [
        "The competition format aligns with your preferences.",
        "Touches on the exact subjects you indicated interest in.",
        "A highly recommended event for your grade and experience level."
      ];
      e.reasons = Array.from(new Set(e.reasons));
      let idx = 0;
      while (e.reasons.length < 3 && idx < fallbackReasons.length) {
        if (!e.reasons.includes(fallbackReasons[idx])) {
          e.reasons.push(fallbackReasons[idx]);
        }
        idx++;
      }
      e.reasons = e.reasons.slice(0, 3);
    });

    return scoredEvents;
  };

  const isQuizComplete = step === QUESTIONS.length;
  const results = isQuizComplete ? calculateResults() : [];
  const topResult = results[0];
  const runnerUp = results[1];

  const canProceed = () => {
    if (QUESTIONS[step].multi) {
      return Array.isArray(answers[step]) && answers[step].length > 0;
    }
    return answers[step] !== null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-4xl text-navy">What FBLA Event Should I Do?</h1>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {/* Progress Bar */}
        {!isQuizComplete && (
          <div className="bg-[#f8f9fc] h-3 w-full">
            <div 
              className="bg-gold h-full transition-all duration-500 ease-out"
              style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
            ></div>
          </div>
        )}

        <div className="p-8 md:p-12 min-h-[500px] flex flex-col relative overflow-hidden">
          {isQuizComplete ? (
            <div className="animate-fade-up max-w-3xl mx-auto w-full text-center">
              <div className="mb-2 uppercase tracking-wider text-sm font-bold text-black/40">Your Top Match</div>
              <h2 className="font-serif text-5xl md:text-6xl text-gold mb-6">{topResult?.name}</h2>
              <p className="text-xl text-black/70 mb-10 leading-relaxed max-w-2xl mx-auto">
                {topResult?.description}
              </p>

              <div className="bg-[#f8f9fc] border border-[rgba(10,46,127,0.1)] rounded-xl p-8 mb-10 text-left">
                <h3 className="font-medium text-navy text-lg mb-4">Why this fits you:</h3>
                <ul className="space-y-3">
                  {topResult?.reasons.map((r: string, i: number) => (
                    <li key={i} className="flex gap-3 text-black/70 items-start">
                      <span className="text-gold mt-1">✦</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a 
                href="https://www.fbla.org/high-school/competitive-events/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-navy text-white px-8 py-4 rounded-lg font-medium hover:bg-blue transition-colors text-lg mb-8 shadow-md"
              >
                Learn More on FBLA.org <ExternalLink size={20} />
              </a>

              {runnerUp && (
                <div className="mb-12 border-t border-[rgba(10,46,127,0.1)] pt-8">
                  <div className="text-sm font-bold text-black/40 uppercase tracking-wider mb-2">Runner Up</div>
                  <div className="font-serif text-2xl text-navy mb-1">{runnerUp.name}</div>
                  <div className="text-black/60 text-sm max-w-lg mx-auto">{runnerUp.description}</div>
                </div>
              )}

              <button 
                onClick={resetQuiz}
                className="text-black/50 hover:text-navy flex items-center justify-center gap-2 mx-auto font-medium transition-colors"
              >
                <RotateCcw size={18} /> Retake the quiz
              </button>
            </div>
          ) : (
            <div key={step} className={`flex-1 flex flex-col ${direction === 'left' ? 'animate-slide-left' : 'animate-slide-right'}`}>
              <div className="flex items-center gap-4 mb-8">
                {step > 0 && (
                  <button onClick={handleBack} className="text-black/40 hover:text-navy p-2 -ml-2 rounded-lg transition-colors">
                    <ArrowLeft size={24} />
                  </button>
                )}
                <div className="text-black/40 font-medium tracking-wide text-sm">
                  QUESTION {step + 1} OF 10
                </div>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl text-navy mb-8 leading-tight">
                {QUESTIONS[step].title}
              </h2>

              <div className="flex flex-col gap-3 max-w-2xl">
                {QUESTIONS[step].options.map((opt, i) => {
                  const isSelected = QUESTIONS[step].multi 
                    ? (answers[step] || []).includes(opt.value)
                    : answers[step] === opt.value;

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(opt.value)}
                      className={`text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                        isSelected 
                          ? 'border-blue bg-[#f8f9fc] text-navy shadow-sm' 
                          : 'border-[rgba(10,46,127,0.05)] text-black/70 hover:border-blue/30 hover:bg-[#f8f9fc]'
                      }`}
                    >
                      <span className="font-medium text-lg">{opt.text}</span>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-blue shrink-0"></div>}
                    </button>
                  );
                })}
              </div>

              {QUESTIONS[step].multi && (
                <div className="mt-auto pt-8">
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 bg-navy text-white px-8 py-3.5 rounded-lg font-medium hover:bg-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
