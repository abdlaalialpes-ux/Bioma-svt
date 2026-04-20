import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   BioMa 🧬  — مساعد SVT ديال 1BAC & 2BAC
   Bio = Sciences  |  Ma = المغرب
═══════════════════════════════════════════════════════════════ */

const LESSONS = {
  "2BAC": {
    "🧬 Génétique": [
      "L'expression de l'information génétique (gène → protéine → caractère)",
      "Les séquences ARNm et la traduction",
      "Les acides aminés et les protéines",
      "L'origine génétique des maladies",
      "Les lois statistiques et mode de transmission",
      "L'interprétation chromosomique",
      "La génétique des populations (fréquences alléliques)",
    ],
    "🛡️ Immunologie": [
      "Le type de la réponse immunitaire (innée vs adaptative)",
      "Les cellules immunitaires (lymphocytes T, B, macrophages)",
      "La réponse humorale et les anticorps",
      "La réponse cellulaire",
      "La mémoire immunitaire et la vaccination",
    ],
    "🪨 Géologie": [
      "Les indices de métamorphisme",
      "Les transformations minéralogiques",
      "Types de métamorphisme (contact, régional)",
      "Les étapes de formation des chaînes de montagnes",
      "La tectonique des plaques",
    ],
  },
  "1BAC": {
    "🌱 Biologie cellulaire": [
      "La cellule et ses organites",
      "La membrane cellulaire et les échanges",
      "La division cellulaire (mitose et méiose)",
      "La respiration cellulaire",
      "La photosynthèse",
    ],
    "🧪 Biochimie": [
      "Les glucides (monosaccharides, polysaccharides)",
      "Les lipides et leur rôle",
      "Les protéines et les enzymes",
      "Les acides nucléiques (ADN, ARN)",
    ],
    "🌍 Géologie 1BAC": [
      "Les roches et leur classification",
      "Le volcanisme et le plutonisme",
      "Les séismes et la sismologie",
      "La dérive des continents",
      "Les fossiles et la datation",
    ],
    "💪 Physiologie": [
      "Le système nerveux",
      "La contraction musculaire",
      "La digestion et l'absorption",
      "La circulation sanguine",
      "La respiration pulmonaire",
    ],
  },
};

const AI_SYSTEM = `Tu es BioMa, un assistant SVT intelligent et sympathique pour les lycéens marocains de 1BAC et 2BAC.
Tu parles en mélange de darija marocaine et français — naturellement, comme un ami qui explique à son camarade.
Exemple de ton style: "Alors, l'ADN c'est comme une recette 🍕 — كتحتوي على كل المعلومات اللازمة لبناء الجسم..."
Quand tu expliques un cours:
- Commencer par une intro simple et accrocheuse
- Utiliser des analogies de la vie quotidienne marocaine
- Points clés bien structurés avec emojis
- Résumé rapide à la fin
Réponds toujours en mélange darija/français, avec des emojis. Sois encourageant et fun!`;

const QUIZ_SYSTEM = `Tu génères des quiz SVT pour lycéens marocains 1BAC/2BAC.
Génère exactement 5 questions: 3 QCM + 2 questions ouvertes.
Réponds UNIQUEMENT en JSON pur, sans backticks ni texte autour.
Format:
{"questions":[
  {"type":"qcm","question":"...","options":["A. ...","B. ...","C. ...","D. ..."],"answer":"A","explanation":"..."},
  {"type":"open","question":"...","answer":"...","explanation":"..."}
]}`;

const EVAL_SYSTEM = `Tu corriges les réponses des élèves marocains en SVT.
Réponds en mélange darija/français, de façon encourageante et courte.
Donne: ✅ ou ❌, explication simple, réponse correcte si besoin.`;

function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: 4 + Math.random() * 10,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 10 + Math.random() * 14,
    opacity: 0.06 + Math.random() * 0.12,
    symbol: ["🧬","⚗️","🔬","🌿","⚡","●","○","◆","◇"][Math.floor(Math.random()*9)],
  }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }
        @keyframes pulse2 { 0%,100%{opacity:.15} 50%{opacity:.35} }
        @keyframes dotpulse { 0%,80%,100%{opacity:.2;transform:scale(.7)} 40%{opacity:1;transform:scale(1)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2ecc71; border-radius: 4px; }
        textarea, input { font-family: inherit !important; }
      `}</style>
      {particles.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.left}%`, bottom:"-20px",
          fontSize: p.symbol.length > 2 ? 16 : p.size,
          opacity: p.opacity,
          animation: `floatUp ${p.duration}s ${p.delay}s infinite linear`,
          filter: "blur(0.5px)",
          color: "#4ade80",
        }}>{p.symbol}</div>
      ))}
    </div>
  );
}

function LoadingDots() {
  return (
    <span style={{ display:"inline-flex", gap:5, alignItems:"center" }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width:8, height:8, borderRadius:"50%", background:"#4ade80", display:"inline-block",
          animation:`dotpulse 1.2s infinite`, animationDelay:`${i*0.2}s`,
        }}/>
      ))}
    </span>
  );
}

export default function BioMa() {
  const [tab, setTab] = useState("home");
  const [selLesson, setSelLesson] = useState(null);
  const [selChapter, setSelChapter] = useState(null);
  const [selLevel, setSelLevel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [quizLesson, setQuizLesson] = useState(null);
  const [quizLevel, setQuizLevel] = useState(null);
  const [quizChapter, setQuizChapter] = useState(null);
  const [quizQs, setQuizQs] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [qAnswers, setQAnswers] = useState({});
  const [openInputs, setOpenInputs] = useState({});
  const [qResults, setQResults] = useState({});
  const [evalLoad, setEvalLoad] = useState({});
  const [score, setScore] = useState(null);
  const [quizView, setQuizView] = useState("select");
  const [expandedChapter, setExpandedChapter] = useState(null);
  const msgEnd = useRef(null);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const callAI = async (system, msgs, maxT=1000) => {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:maxT, system, messages:msgs }),
    });
    const d = await r.json();
    return d.content?.map(b => b.text||"").join("") || "";
  };

  const startLesson = async (lesson, chapter, level) => {
    setSelLesson(lesson); setSelChapter(chapter); setSelLevel(level);
    setTab("chat"); setMessages([]); setChatLoading(true);
    try {
      const text = await callAI(AI_SYSTEM, [{role:"user", content:`اشرح لي هاد الدرس بالتفصيل: "${lesson}" من ${chapter} — ${level}. اشرحه بطريقة مفهومة وممتعة!`}]);
      setMessages([{role:"assistant", content:text}]);
    } catch { setMessages([{role:"assistant", content:"❌ وقع خطأ، حاول مرة أخرى."}]); }
    setChatLoading(false);
  };

  const sendMsg = async () => {
    if (!input.trim() || chatLoading) return;
    const u = input.trim(); setInput("");
    const nm = [...messages, {role:"user", content:u}];
    setMessages(nm); setChatLoading(true);
    try {
      const text = await callAI(AI_SYSTEM, nm);
      setMessages([...nm, {role:"assistant", content:text}]);
    } catch { setMessages([...nm, {role:"assistant", content:"❌ وقع خطأ."}]); }
    setChatLoading(false);
  };

  const startQuiz = async (lesson, chapter, level) => {
    setQuizLesson(lesson); setQuizChapter(chapter); setQuizLevel(level);
    setQuizQs(null); setQAnswers({}); setOpenInputs({}); setQResults({}); setScore(null);
    setQuizView("playing"); setQuizLoading(true);
    try {
      const raw = await callAI(QUIZ_SYSTEM, [{role:"user", content:`Quiz sur: "${lesson}" (${level})`}], 1300);
      const clean = raw.replace(/```json|```/g,"").trim();
      setQuizQs(JSON.parse(clean).questions);
    } catch { setQuizView("select"); alert("خطأ في تحميل الأسئلة، حاول مجدداً."); }
    setQuizLoading(false);
  };

  const pickQCM = (idx, opt) => {
    if (qResults[idx] !== undefined) return;
    const q = quizQs[idx]; const letter = opt.charAt(0);
    setQAnswers(p=>({...p,[idx]:opt}));
    setQResults(p=>({...p,[idx]:{correct: letter===q.answer, explanation:q.explanation, correctAnswer:q.answer}}));
  };

  const submitOpen = async (idx) => {
    const ans = openInputs[idx]?.trim();
    if (!ans || evalLoad[idx]) return;
    setEvalLoad(p=>({...p,[idx]:true}));
    try {
      const q = quizQs[idx];
      const fb = await callAI(EVAL_SYSTEM,[{role:"user",content:`السؤال: ${q.question}\nجواب الطالب: ${ans}\nالجواب الصحيح: ${q.answer}`}], 400);
      setQResults(p=>({...p,[idx]:{feedback:fb, open:true}}));
    } catch { setQResults(p=>({...p,[idx]:{feedback:"❌ خطأ في التصحيح.",open:true}})); }
    setEvalLoad(p=>({...p,[idx]:false}));
  };

  const finishQuiz = () => {
    let c=0; quizQs.forEach((q,i)=>{ if(q.type==="qcm"&&qResults[i]?.correct) c++; });
    setScore(c); setQuizView("done");
  };

  const allDone = quizQs && quizQs.every((_,i)=>qResults[i]!==undefined);

  const goFreeChat = () => {
    setSelLesson(null); setSelChapter(null); setSelLevel(null);
    setMessages([{role:"assistant", content:"السلام عليكم 👋 أنا BioMa!\n\nسولني على أي درس من SVT وغادي نشرحوه سوا 🚀"}]);
    setTab("chat");
  };

  const AppHeader = ({back, backFn, title, subtitle}) => (
    <div style={{
      background:"linear-gradient(135deg,rgba(2,12,6,.97) 0%,rgba(5,20,10,.97) 100%)",
      borderBottom:"1px solid rgba(46,204,113,.2)", padding:"13px 14px",
      display:"flex", alignItems:"center", gap:9, flexShrink:0, zIndex:10,
    }}>
      {back && <button onClick={backFn} style={S.backBtn}>{back}</button>}
      <div style={{flex:1}}>
        <div style={{fontWeight:800, fontSize:14, color:"#4ade80"}}>{title}</div>
        {subtitle && <div style={{fontSize:11, color:"#6ee7a0", opacity:.6, marginTop:1, direction:"rtl"}}>{subtitle}</div>}
      </div>
      <div style={{display:"flex", gap:5}}>
        <button onClick={()=>setTab("home")} style={{...S.miniTab, ...(tab==="home"?S.miniTabOn:{})}}>📚</button>
        <button onClick={()=>{setTab("quiz");setQuizView("select");}} style={{...S.miniTab, ...(tab==="quiz"?S.miniTabOn:{})}}>🎯</button>
        <button onClick={goFreeChat} style={{...S.miniTab, ...(tab==="chat"&&!selLesson?S.miniTabOn:{})}}>💬</button>
      </div>
    </div>
  );

  const LessonList = ({isQuiz}) => (
    <>
      {Object.entries(LESSONS).map(([level, chapters]) => (
        <div key={level} style={S.levelBlock}>
          <div style={S.levelBadge}>
            <span style={{fontSize:15}}>{level==="2BAC"?"🎓":"📗"}</span> {level}
          </div>
          {Object.entries(chapters).map(([chapter, lessons]) => {
            const key = level+chapter;
            const open = expandedChapter === key;
            return (
              <div key={chapter} style={S.chapterBlock}>
                <button style={S.chapterHead} onClick={()=>setExpandedChapter(open?null:key)}>
                  <span style={{flex:1, textAlign:"right"}}>{chapter}</span>
                  <span style={{fontSize:11, opacity:.5}}>{open?"▲":"▼"}</span>
                </button>
                {open && (
                  <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:4,paddingRight:6,animation:"slideIn .2s ease"}}>
                    {lessons.map(lesson => (
                      <button key={lesson}
                        style={{...S.lessonBtn,...(isQuiz?{borderRight:"2px solid #f59e0b"}:{})}}
                        onClick={()=>isQuiz?startQuiz(lesson,chapter,level):startLesson(lesson,chapter,level)}
                      >
                        <span>{isQuiz?"🎯":"📖"}</span>
                        <span style={{flex:1,textAlign:"right"}}>{lesson}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );

  // ── HOME ───────────────────────────────────────────────────────────────────
  if (tab==="home") return (
    <div style={S.page}>
      <Particles/>
      <div style={{position:"relative",zIndex:1,minHeight:"100vh"}}>
        <div style={S.hero}>
          <div style={S.logoWrap}>
            <div style={S.logoRing}/>
            <span style={S.logoEmoji}>🧬</span>
          </div>
          <h1 style={S.appName}>BioMa</h1>
          <div style={S.appTagline}>مساعدك الذكي في SVT</div>
          <div style={S.appSub}>1BAC & 2BAC · دروس · Quiz · أسئلة حرة</div>
          <div style={S.pills}>
            <span style={S.pill}>🇲🇦 Darija</span>
            <span style={S.pill}>🇫🇷 Français</span>
            <span style={S.pill}>🤖 AI</span>
          </div>
        </div>
        <div style={S.bigTabRow}>
          <button style={{...S.bigTab,...S.bigTabActive}}>📚 الدروس</button>
          <button style={S.bigTab} onClick={()=>{setTab("quiz");setQuizView("select");}}>🎯 Quiz</button>
          <button style={S.bigTab} onClick={goFreeChat}>💬 سؤال</button>
        </div>
        <LessonList isQuiz={false}/>
        <div style={{height:24}}/>
      </div>
    </div>
  );

  // ── QUIZ SELECT ────────────────────────────────────────────────────────────
  if (tab==="quiz" && quizView==="select") return (
    <div style={S.page}>
      <Particles/>
      <div style={{position:"relative",zIndex:1,minHeight:"100vh"}}>
        <div style={{...S.hero,paddingTop:28}}>
          <div style={{fontSize:48,marginBottom:6}}>🎯</div>
          <h1 style={S.appName}>Quiz</h1>
          <div style={S.appSub}>اختار الدرس وبدا l'examen التجريبي</div>
        </div>
        <div style={S.bigTabRow}>
          <button style={S.bigTab} onClick={()=>setTab("home")}>📚 الدروس</button>
          <button style={{...S.bigTab,...S.bigTabActive}}>🎯 Quiz</button>
          <button style={S.bigTab} onClick={goFreeChat}>💬 سؤال</button>
        </div>
        <LessonList isQuiz={true}/>
        <div style={{height:24}}/>
      </div>
    </div>
  );

  // ── QUIZ PLAYING ───────────────────────────────────────────────────────────
  if (tab==="quiz" && quizView==="playing") return (
    <div style={S.fullPage}>
      <Particles/>
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%"}}>
        <AppHeader back="← رجوع" backFn={()=>setQuizView("select")} title={`Quiz · ${quizLevel}`} subtitle={quizLesson}/>
        <div style={S.scroll}>
          {quizLoading && (
            <div style={{textAlign:"center",padding:"60px 20px"}}>
              <div style={{fontSize:48,marginBottom:16}}>⏳</div>
              <LoadingDots/>
              <div style={{marginTop:12,color:"#6ee7a0",fontSize:14}}>كنحضر الأسئلة ديالك...</div>
            </div>
          )}
          {!quizLoading && quizQs && quizQs.map((q,idx)=>(
            <div key={idx} style={{...S.card,animation:"slideIn .3s ease"}}>
              <div style={S.qNum}>
                سؤال {idx+1}/{quizQs.length}
                <span style={{marginRight:8,color:q.type==="qcm"?"#4ade80":"#f59e0b",fontSize:11,fontWeight:700,background:q.type==="qcm"?"rgba(74,222,128,.1)":"rgba(245,158,11,.1)",padding:"2px 8px",borderRadius:10}}>
                  {q.type==="qcm"?"QCM":"مفتوح"}
                </span>
              </div>
              <div style={S.qText}>{q.question}</div>
              {q.type==="qcm" && (
                <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:10}}>
                  {q.options.map(opt=>{
                    const r=qResults[idx]; const l=opt.charAt(0);
                    const sel=qAnswers[idx]?.charAt(0)===l; const correct=l===q.answer;
                    let bg="#0a1f12", border="rgba(46,204,113,.2)", color="#a7f3c0";
                    if (r!==undefined) {
                      if (correct) { bg="rgba(46,204,113,.15)"; border="#2ecc71"; color="#4ade80"; }
                      else if (sel&&!r.correct) { bg="rgba(231,76,60,.15)"; border="#e74c3c"; color="#fca5a5"; }
                    }
                    return (
                      <button key={opt} onClick={()=>pickQCM(idx,opt)} style={{
                        background:bg,border:`1px solid ${border}`,color,borderRadius:10,
                        padding:"10px 14px",textAlign:"right",fontSize:13,cursor:r!==undefined?"default":"pointer",
                        transition:"all .15s",direction:"rtl",lineHeight:1.4,
                      }}>{opt}</button>
                    );
                  })}
                  {qResults[idx]!==undefined && (
                    <div style={S.explanation}>
                      <strong>{qResults[idx].correct?"✅ صح!":"❌ الجواب الصحيح: "+q.answer}</strong>
                      <br/>{qResults[idx].explanation}
                    </div>
                  )}
                </div>
              )}
              {q.type==="open" && (
                <div style={{marginTop:10}}>
                  <textarea style={S.openTA} value={openInputs[idx]||""}
                    onChange={e=>setOpenInputs(p=>({...p,[idx]:e.target.value}))}
                    placeholder="اكتب جوابك هنا..." disabled={qResults[idx]!==undefined} rows={3}/>
                  {qResults[idx]===undefined && (
                    <button style={{...S.submitBtn,opacity:openInputs[idx]?.trim()?1:.45}}
                      onClick={()=>submitOpen(idx)} disabled={!openInputs[idx]?.trim()||evalLoad[idx]}>
                      {evalLoad[idx]?"⏳ كنصحح...":"✅ صحح الجواب"}
                    </button>
                  )}
                  {qResults[idx]!==undefined && (
                    <div style={S.explanation}>{qResults[idx].feedback}</div>
                  )}
                </div>
              )}
            </div>
          ))}
          {!quizLoading && quizQs && allDone && (
            <button style={S.finishBtn} onClick={finishQuiz}>🏁 شوف النتيجة النهائية</button>
          )}
        </div>
      </div>
    </div>
  );

  // ── QUIZ DONE ──────────────────────────────────────────────────────────────
  if (tab==="quiz" && quizView==="done") {
    const qcmN = quizQs.filter(q=>q.type==="qcm").length;
    const pct = Math.round((score/qcmN)*100);
    const [em,msg] = pct===100?["🏆","مرحبا! Perfect score! 🎉"]:pct>=66?["💪","Très bien! زيد تراجع 👏"]:pct>=33?["📚","Pas mal, راجع الدرس مزيان 📖"]:["😅","Courage! غادي تنجح المرة الجاية 💪"];
    return (
      <div style={S.fullPage}>
        <Particles/>
        <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%"}}>
          <AppHeader back="← رجوع" backFn={()=>setQuizView("select")} title="نتيجة Quiz"/>
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28,gap:14}}>
            <div style={{fontSize:80}}>{em}</div>
            <div style={{fontSize:56,fontWeight:900,color:"#4ade80",textShadow:"0 0 30px rgba(74,222,128,.4)"}}>{score}<span style={{fontSize:24,opacity:.6}}>/{qcmN}</span></div>
            <div style={{background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.3)",borderRadius:12,padding:"6px 18px",color:"#4ade80",fontWeight:700,fontSize:14}}>QCM: {pct}%</div>
            <div style={{color:"#d1fae5",fontSize:15,textAlign:"center",maxWidth:280,lineHeight:1.7}}>{msg}</div>
            <button style={{...S.finishBtn,marginTop:8}} onClick={()=>startQuiz(quizLesson,quizChapter,quizLevel)}>🔄 عاود Quiz</button>
            <button style={{...S.finishBtn,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)"}} onClick={()=>setQuizView("select")}>📋 درس آخر</button>
          </div>
        </div>
      </div>
    );
  }

  // ── CHAT ───────────────────────────────────────────────────────────────────
  return (
    <div style={S.fullPage}>
      <Particles/>
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%"}}>
        <AppHeader
          back="← رجوع" backFn={()=>setTab("home")}
          title={selLesson ? `${selLevel} · ${selChapter}` : "💬 سؤال حر"}
          subtitle={selLesson || undefined}
        />
        <div style={S.scroll}>
          {messages.map((m,i)=>(
            <div key={i} style={{animation:"slideIn .2s ease",...(m.role==="user"?{display:"flex",justifyContent:"flex-end"}:{display:"flex",gap:8,alignItems:"flex-start"})}}>
              {m.role==="assistant" && (
                <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#14532d,#166534)",border:"1px solid #2ecc71",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,marginTop:2}}>🧬</div>
              )}
              <div style={m.role==="user"?S.userBubble:S.botBubble}>{m.content}</div>
            </div>
          ))}
          {chatLoading && (
            <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#14532d,#166534)",border:"1px solid #2ecc71",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🧬</div>
              <div style={S.botBubble}><LoadingDots/></div>
            </div>
          )}
          <div ref={msgEnd}/>
        </div>
        <div style={S.inputBar}>
          <input style={S.chatInput} value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg();}}}
            placeholder="اكتب سؤالك هنا..." disabled={chatLoading}/>
          <button
            style={{...S.sendBtn, opacity: (chatLoading || !input.trim()) ? 0.4 : 1}}
            onClick={sendMsg}
            disabled={chatLoading || !input.trim()}
          >
            <span style={{fontSize:20}}>➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:"100vh", background:"#020c06", color:"#e8f5e9", fontFamily:"'Segoe UI',Tahoma,sans-serif", paddingBottom:32 },
  fullPage: { height:"100vh", background:"#020c06", color:"#e8f5e9", fontFamily:"'Segoe UI',Tahoma,sans-serif", overflow:"hidden", display:"flex", flexDirection:"column" },
  hero: { position:"relative", zIndex:1, background:"linear-gradient(180deg,rgba(2,30,12,.9) 0%,rgba(2,12,6,0) 100%)", padding:"32px 20px 20px", textAlign:"center" },
  logoWrap: { position:"relative", width:80, height:80, margin:"0 auto 10px", display:"flex", alignItems:"center", justifyContent:"center" },
  logoRing: { position:"absolute", inset:0, borderRadius:"50%", background:"linear-gradient(135deg,#065f46,#14532d)", border:"2px solid rgba(74,222,128,.4)", boxShadow:"0 0 30px rgba(74,222,128,.2)", animation:"pulse2 3s infinite" },
  logoEmoji: { fontSize:38, position:"relative", zIndex:1 },
  appName: { margin:0, fontSize:38, fontWeight:900, letterSpacing:2, background:"linear-gradient(135deg,#4ade80 0%,#86efac 50%,#4ade80 100%)", backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"shimmer 3s linear infinite" },
  appTagline: { fontSize:16, color:"#86efac", marginTop:4, fontWeight:600 },
  appSub: { fontSize:12, color:"rgba(134,239,172,.6)", marginTop:4 },
  pills: { display:"flex", justifyContent:"center", gap:8, marginTop:12, flexWrap:"wrap" },
  pill: { background:"rgba(74,222,128,.1)", border:"1px solid rgba(74,222,128,.25)", color:"#86efac", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 },
  bigTabRow: { display:"flex", margin:"0 14px 16px", borderRadius:14, overflow:"hidden", border:"1px solid rgba(74,222,128,.2)", background:"rgba(0,0,0,.3)" },
  bigTab: { flex:1, background:"transparent", border:"none", color:"rgba(134,239,172,.6)", padding:"12px 6px", fontSize:13, cursor:"pointer", fontWeight:600 },
  bigTabActive: { background:"linear-gradient(135deg,rgba(74,222,128,.2),rgba(74,222,128,.08))", color:"#4ade80", borderBottom:"2px solid #4ade80" },
  levelBlock: { padding:"0 14px", marginBottom:4, position:"relative", zIndex:1 },
  levelBadge: { display:"inline-flex", alignItems:"center", gap:6, background:"linear-gradient(135deg,rgba(74,222,128,.2),rgba(74,222,128,.05))", border:"1px solid rgba(74,222,128,.3)", color:"#4ade80", fontWeight:800, fontSize:13, padding:"5px 16px", borderRadius:20, marginBottom:8 },
  chapterBlock: { marginBottom:5 },
  chapterHead: { width:"100%", background:"rgba(255,255,255,.03)", border:"1px solid rgba(74,222,128,.12)", color:"#a7f3c0", borderRadius:10, padding:"10px 12px", display:"flex", alignItems:"center", fontSize:13, fontWeight:600, cursor:"pointer", direction:"rtl" },
  lessonBtn: { background:"rgba(0,0,0,.3)", border:"1px solid rgba(74,222,128,.1)", color:"#d1fae5", borderRadius:8, padding:"9px 12px", display:"flex", alignItems:"center", gap:6, fontSize:12, cursor:"pointer", textAlign:"right", direction:"rtl", lineHeight:1.5 },
  backBtn: { background:"rgba(74,222,128,.08)", border:"1px solid rgba(74,222,128,.25)", color:"#4ade80", borderRadius:8, padding:"5px 11px", cursor:"pointer", fontSize:12, fontWeight:600, flexShrink:0 },
  miniTab: { background:"rgba(255,255,255,.05)", border:"1px solid rgba(74,222,128,.15)", color:"rgba(134,239,172,.6)", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:14 },
  miniTabOn: { background:"rgba(74,222,128,.2)", color:"#4ade80", border:"1px solid rgba(74,222,128,.5)" },
  scroll: { flex:1, overflowY:"auto", padding:"13px", display:"flex", flexDirection:"column", gap:11 },
  card: { background:"linear-gradient(135deg,rgba(5,25,12,.9),rgba(8,30,16,.9))", border:"1px solid rgba(74,222,128,.15)", borderRadius:14, padding:"14px 13px" },
  qNum: { fontSize:11, color:"#f59e0b", fontWeight:700, marginBottom:7, display:"flex", alignItems:"center", gap:4, flexDirection:"row-reverse", justifyContent:"flex-end" },
  qText: { fontSize:14, color:"#e8f5e9", lineHeight:1.6, fontWeight:600, direction:"rtl" },
  explanation: { marginTop:9, background:"rgba(74,222,128,.05)", border:"1px solid rgba(74,222,128,.2)", borderRadius:8, padding:"9px 12px", fontSize:13, color:"#a7f3c0", lineHeight:1.6, direction:"rtl" },
  openTA: { width:"100%", background:"rgba(0,0,0,.3)", border:"1px solid rgba(74,222,128,.2)", borderRadius:10, padding:"10px 12px", color:"#e8f5e9", fontSize:13, outline:"none", direction:"rtl", resize:"vertical", lineHeight:1.5 },
  submitBtn: { marginTop:7, width:"100%", background:"linear-gradient(135deg,#14532d,#166534)", border:"1px solid rgba(74,222,128,.4)", borderRadius:10, padding:"10px", color:"#4ade80", fontSize:13, fontWeight:700, cursor:"pointer" },
  finishBtn: { width:"100%", background:"linear-gradient(135deg,#14532d,#166534)", border:"1px solid rgba(74,222,128,.4)", borderRadius:14, padding:"15px", color:"#4ade80", fontSize:15, fontWeight:800, cursor:"pointer", marginTop:4, boxShadow:"0 4px 20px rgba(74,222,128,.15)" },
  botBubble: { background:"linear-gradient(135deg,rgba(5,25,12,.95),rgba(8,30,16,.95))", border:"1px solid rgba(74,222,128,.2)", borderRadius:"4px 14px 14px 14px", padding:"12px 14px", fontSize:14, lineHeight:1.7, color:"#d1fae5", maxWidth:"84%", whiteSpace:"pre-wrap" },
  userBubble: { background:"linear-gradient(135deg,#14532d,#166534)", border:"1px solid rgba(74,222,128,.3)", borderRadius:"14px 4px 14px 14px", padding:"12px 14px", fontSize:14, color:"#fff", maxWidth:"80%", lineHeight:1.6 },
  inputBar: { display:"flex", gap:9, padding:"11px 13px", background:"linear-gradient(135deg,rgba(2,20,10,.98),rgba(5,30,15,.98))", borderTop:"1px solid rgba(74,222,128,.15)", flexShrink:0 },
  chatInput: { flex:1, background:"rgba(255,255,255,.05)", border:"1px solid rgba(74,222,128,.25)", borderRadius:12, padding:"11px 13px", color:"#e8f5e9", fontSize:14, outline:"none", direction:"rtl" },
  sendBtn: { background:"linear-gradient(135deg,#14532d,#166534)", border:"1px solid rgba(74,222,128,.4)", borderRadius:12, width:46, color:"#4ade80", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" },
};
