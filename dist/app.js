(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const categories=window.OW_CATEGORIES, kb=window.OW_KB;
  let activeFilter="all";
  let activeRole="all";
  const sessionState={lastCounterTarget:null};
  const conversation=[];
  let requestSerial=0;
  let pendingAnswer=false;

  function setEntry(open){
    const gate=$("#entry-gate");
    document.documentElement.classList.toggle("entry-pending",open);
    gate.classList.toggle("is-leaving",!open);
    gate.setAttribute("aria-hidden",open?"false":"true");
    if(open)setTimeout(()=>$("#guest-enter")?.focus(),80);
  }
  function enterAsGuest(){
    try{localStorage.setItem("ow_guest_mode","1");}catch(_e){}
    setEntry(false);
  }
  function initEntry(){
    let known=false;
    try{known=localStorage.getItem("ow_guest_mode")==="1";}catch(_e){}
    const force=new URLSearchParams(location.search).get("welcome")==="1";
    setEntry(!known||force);
  }
  function initMotion(){
    const revealTargets=$$(".view>*,.hero-stat,.kb-card,.news-card,.event-card,.media-card,.live-card");
    revealTargets.forEach((el,i)=>{el.classList.add("motion-reveal");el.style.setProperty("--reveal-delay",`${Math.min(i%8,5)*45}ms`);});
    if("IntersectionObserver" in window){
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("in-view");observer.unobserve(entry.target);}}),{threshold:.07,rootMargin:"0px 0px -4%"});
      revealTargets.forEach(el=>observer.observe(el));
    }else revealTargets.forEach(el=>el.classList.add("in-view"));
    if(matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)").matches){
      document.addEventListener("pointermove",e=>{
        const card=e.target.closest(".hero-stat,.kb-card,.news-card,.event-card,.media-card,.live-card,.command-hero");
        if(!card)return;const r=card.getBoundingClientRect();card.style.setProperty("--mx",`${e.clientX-r.left}px`);card.style.setProperty("--my",`${e.clientY-r.top}px`);card.classList.add("cursor-lit");
      });
      document.addEventListener("pointerout",e=>{const card=e.target.closest?.(".cursor-lit");if(card&&!card.contains(e.relatedTarget))card.classList.remove("cursor-lit");});
    }
  }

  function normalize(s){return String(s||"").toLowerCase().replace(/[，。！？、,.!?\s:：]/g,"");}
  function classify(question){
    const q=normalize(question); let best={id:"fallback",score:0};
    categories.filter(c=>c.id!=="fallback").forEach(c=>{
      let score=0; c.keywords.forEach(k=>{if(q.includes(normalize(k))) score+=normalize(k).length>2?3:2;});
      if(score>best.score) best={id:c.id,score};
    });
    if(best.score===0){
      if(/[谁哪怎么为何为什么]/.test(q)) best={id:"basics",score:1};
    }
    return best;
  }
  function retrieve(question,cat){
    const q=normalize(question), chars=[...new Set(q.split(""))];
    return kb.map(item=>{
      let score=item.cat===cat?4:item.cat==="fallback"?0:-2;
      const hay=normalize(item.title+item.summary+item.keywords.join(""));
      item.keywords.forEach(k=>{if(q.includes(normalize(k))) score+=normalize(k).length+4;});
      chars.forEach(ch=>{if(ch.length&&hay.includes(ch))score+=.08});
      return {item,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3);
  }
  function escapeHtml(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
  function relatedFor(cat){
    const sets={basics:["我应该先练哪两个英雄？","还有哪些常用玩家黑话？","怎样减少无意义阵亡？"],heroes:["这个英雄适合哪些地图？","这个英雄能和谁形成技能联动？","被针对时应该怎么换人？"],strategy:["这套打法在哪些地图更好用？","对方能用什么技能反制？","队友不配合时我能先做什么？"],lore:["这个角色和谁关系最密切？","这段剧情处于什么时间线？","有哪些官方短片可以看？"],news:["这个活动什么时候结束？","奖励怎么获得？","还有哪些历史联动？"],patch:["这次改动影响哪些对位？","哪些旧攻略已经过期？","哪里看完整官方补丁？"],esports:["这名选手擅长哪些英雄？","下一场比赛在哪里看？","新手观赛应该看什么？"]};
    return sets[cat]||["我还可以补充什么信息？","还有哪些相关知识？"];
  }
  function relatedHtml(questions){return `<div class="related-questions"><h3>联想出来的其他问题</h3>${(questions||[]).slice(0,3).map(q=>`<button type="button" data-question="${escapeHtml(q)}">${escapeHtml(q)} <span>→</span></button>`).join("")}</div>`;}
  function detectRole(q){
    if(/坦克|重装|t位|tank/i.test(q))return "Tank";
    if(/输出|伤害|dps|c位/i.test(q))return "Damage";
    if(/辅助|支援|奶位|support/i.test(q))return "Support";
    return null;
  }
  function detectHero(q){
    const text=normalize(q), found=[];
    const aliasTable={...(window.OW_HERO_ALIASES||{})};
    (window.OW_HERO_STATS||[]).forEach(h=>{aliasTable[h.id]=[...(aliasTable[h.id]||[]),h.name,h.en];});
    Object.entries(aliasTable).forEach(([id,aliases])=>aliases.forEach(alias=>{const at=text.indexOf(normalize(alias));if(at>=0)found.push({id,at,len:normalize(alias).length});}));
    return found.sort((a,b)=>a.at-b.at||b.len-a.len).filter((x,i,a)=>!a.slice(0,i).some(y=>y.id===x.id));
  }
  function detectMap(q){
    const text=normalize(q); return (window.OW_MAP_GUIDES||[]).find(m=>m.aliases.some(a=>text.includes(normalize(a))))||null;
  }
  function mapResponse(question){
    const map=detectMap(question); if(!map)return null;
    sessionState.lastCounterTarget=null;
    const tankIntent=detectRole(question)==="Tank"||/t位|坦克|重装|tank/i.test(question);
    const side=/进攻|攻击方/.test(question)?"进攻":/防守|防守方/.test(question)?"防守":"未说明攻防";
    const picks=tankIntent?`<li><b>优先选择：</b>${map.primary}</li><li><b>备选思路：</b>${map.alternate}</li>`:"";
    return {cat:categories.find(c=>c.id==="strategy"),confidence:88,hits:[{item:{title:`${map.name}地图结构`}},{item:{title:`${map.mode}模式阶段`}},{item:{title:"重装英雄地形适配"}}],html:`<h3>结论</h3><p>主人，你问的是 <b>${map.name}</b>（${map.mode}），这是一个新话题。${map.why} (｡•̀ᴗ-)✧</p><h3>引用的知识</h3><ol><li>${map.why}</li>${picks}${map.phases.map(x=>`<li>${x}</li>`).join("")}<li><b>注意：</b>${map.avoid}</li></ol><p class="version-warning"><b>当前条件：</b>${side}。补充攻防方、队友阵容和熟练英雄后，可以继续缩小答案。</p>${relatedHtml([`${map.name}进攻方有哪些常用路线？`,`${map.name}哪些输出适合占高台？`,`对面换阵容后我什么时候该换重装？`])}<div class="answer-meta"><span>新话题：地图选择</span><span>${map.name}</span><span>${map.mode}</span></div>`};
  }
  function counterResponse(question){
    let role=detectRole(question); const heroes=detectHero(question);
    const newTopic=/地图|模式|活动|版本|故事|比赛|赛事|赛程|胜率|数据|设置|准星|灵敏度/i.test(question)||!!detectMap(question);
    const referential=/^(那|那么|如果|要是|换成|继续)|刚才|上一个|上面|这个英雄|对面那个|他呢|她呢|它呢|玩.+呢[？?]?$/i.test(question.trim());
    if(newTopic)sessionState.lastCounterTarget=null;
    const contextualFollowup=!!(role&&sessionState.lastCounterTarget&&heroes.length===0&&referential&&!newTopic);
    const counterIntent=/克制|反制|怎么打|打不过|选什么克制|换什么打|针对|counter/i.test(question)||contextualFollowup;
    let target=null;
    const enemyPart=question.split(/对面|敌方|对手/).slice(1).join("");
    if(enemyPart){const enemyHeroes=detectHero(enemyPart);target=enemyHeroes[0]?.id||null;}
    const ownPart=question.split(/对面|敌方|对手/)[0];
    const ownHero=/我玩|我用|我选|我拿/.test(ownPart)?detectHero(ownPart)[0]:null;
    if(!role&&ownHero){role=window.OW_HERO_STATS.find(h=>h.id===ownHero.id)?.role||null;}
    if(!target&&heroes.length===1)target=heroes[0].id;
    if(!target&&counterIntent&&sessionState.lastCounterTarget&&role)target=sessionState.lastCounterTarget;
    if(!counterIntent||!target)return null;
    let guide=window.OW_COUNTER_GUIDES?.[target];
    let confidence=94;
    if(!guide){
      const hero=window.OW_HERO_STATS.find(h=>h.id===target); const profileId=window.OW_HERO_PROFILES?.[target]; const profile=window.OW_COUNTER_ARCHETYPES?.[profileId];
      if(!hero||!profile)return null;
      guide={...profile,name:`${hero.name}（${hero.en}）`,avoid:[],sample:"当前未内置该英雄的独立对位统计；以下答案来自英雄机制标签与职责交互规则",verified:"机制型推理 · 中等置信度"};
      confidence=78;
    }
    sessionState.lastCounterTarget=target;
    const roleNames={Tank:"重装",Damage:"输出",Support:"支援"};
    const ownStats=ownHero?window.OW_HERO_STATS.find(h=>h.id===ownHero.id):null;
    const ownListed=ownStats&&guide.roles[ownStats.role]?.includes(ownStats.name);
    const ownAvoid=ownStats&&guide.avoid?.includes(ownStats.name);
    const ownAdvice=ownStats?`<p class="matchup-callout"><b>你当前使用 ${ownStats.name}：</b>${ownAvoid?"这组对位当前偏吃亏，先按下方打法调整；连续两波仍无作用时再换。":ownListed?"这是可行的应对选择，重点仍是正确使用机制，而不是只靠选人。":"属于可打但不是优先反制；先调整距离、技能时机和集火，再决定是否换人。"}</p>`:"";
    const roleBlocks=(role?[role]:["Tank","Damage","Support"]).map(r=>`<li><b>${roleNames[r]}推荐：</b>${guide.roles[r].join("、")}</li>`).join("");
    const avoid=guide.avoid?.length?`<li><b>当前不优先：</b>${guide.avoid.join("、")}。这不是绝对不能玩，而是当前对位数据或机制上更容易被 ${guide.name} 利用。</li>`:"";
    const source=guide.source?`<p><a href="${guide.source}" target="_blank" rel="noreferrer">查看完整对位数据与方法说明 ↗</a></p>`:"";
    return {cat:categories.find(c=>c.id==="strategy"),confidence,hits:[{item:{title:`${guide.name}结构化对位表`}},{item:{title:"英雄别名与职责识别"}},{item:{title:"机制标签与当前版本统计"}}],html:`<h3>结论</h3><p>主人，对面是 <b>${guide.name}</b>。${role?`你玩${roleNames[role]}的话，`:"按位置分别推荐如下。"}${guide.core} 啾咪～</p>${ownAdvice}<h3>引用的知识</h3><ol>${roleBlocks}${avoid}${guide.tips.map(x=>`<li>${x}</li>`).join("")}</ol>${guide.sample?`<p class="version-warning"><b>依据：</b>${guide.sample}。${guide.verified}</p>`:`<p class="version-warning">这是机制型对位建议；英雄平衡变化后应结合最新补丁复核。</p>`}${source}${relatedHtml([`如果我坚持用当前英雄，怎么调整站位？`,`哪些地图最适合针对${guide.name}？`,`${guide.name}的大招该怎么躲？`])}<div class="answer-meta"><span>已识别：${guide.name}</span><span>意图：英雄克制</span><span>${role?`职责：${roleNames[role]}`:"覆盖三个职责"}</span></div>`};
  }
  function answerHtml(item){
    const a=item.answer;
    const links=(a.links||[]).map(l=>`<a href="${l.url}" target="_blank" rel="noreferrer">${l.label} ↗</a>`).join(" · ");
    return `<h3>结论</h3><p>主人，${a.conclusion} (｡•̀ᴗ-)✧</p><h3>引用的知识</h3><ol><li>${a.why}</li>${a.steps.map(x=>`<li>${x}</li>`).join("")}<li><b>注意：</b>${a.pitfall}</li></ol>${item.dynamic?`<p class="version-warning">版本提醒：这类信息变化较快，请用下方官方入口核对当前日期与游戏内规则。</p>`:""}${links?`<p>${links}</p>`:""}${relatedHtml(relatedFor(item.cat))}`;
  }
  function ragAnswerHtml(answer,context,mode,usage){
    if(!answer)return `<h3>暂时无法确认</h3><p>当前知识库没有足够证据。请补充英雄、职责、地图或版本，我不会在证据不足时猜测。</p>`;
    const used=new Set(answer.used_sources||[]);
    const sources=(context||[]).filter(source=>!used.size||used.has(source.source_id));
    const sourceHtml=sources.length?`<div class="rag-citations"><h3>引用依据</h3>${sources.map(source=>{
      const link=source.links?.[0];
      const title=escapeHtml(source.title);
      const meta=`${escapeHtml(source.source_id)} · ${escapeHtml(source.source_type||"curated")} · ${escapeHtml(source.as_of||"")}`;
      return `<article><span>${meta}</span><b>${link?`<a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${title} ↗</a>`:title}</b></article>`;
    }).join("")}</div>`:"";
    const modeName=mode==="deepseek_rag"?"DeepSeek · 证据增强生成":"本地混合检索 · 降级回答";
    const usageText=usage?.total_tokens?` · ${usage.total_tokens} tokens`:"";
    const knowledge=answer.cited_knowledge?.length?answer.cited_knowledge:[answer.why,...(answer.steps||[])].filter(Boolean);
    const questions=answer.related_questions?.length?answer.related_questions:relatedFor(context?.[0]?.category);
    return `<h3>结论</h3><p>${escapeHtml(answer.conclusion)}</p><h3>引用的知识</h3>${knowledge.length?`<ol>${knowledge.map(item=>`<li>${escapeHtml(item)}</li>`).join("")}</ol>`:"<p>当前只命中结论，建议补充问题条件以获得更完整依据。</p>"}${answer.caveat?`<p class="version-warning"><b>限制与条件：</b>${escapeHtml(answer.caveat)}</p>`:""}${sourceHtml}${relatedHtml(questions)}<div class="answer-meta"><span>${modeName}</span><span>Top ${(context||[]).length} 检索${usageText}</span></div>`;
  }
  function feedbackHtml(answerId){
    return `<div class="answer-feedback" data-answer-id="${answerId}"><span>这个回答有帮助吗？</span><button type="button" data-feedback="helpful">有帮助</button><button type="button" data-feedback="wrong">事实有误</button><button type="button" data-feedback="stale">信息过期</button><button type="button" data-feedback="miss">没回答问题</button></div>`;
  }
  function saveFeedback(answerId,value){
    let records=[];
    try{records=JSON.parse(localStorage.getItem("ow_answer_feedback")||"[]");}catch(_e){}
    records.push({answerId,value,at:new Date().toISOString()});
    try{localStorage.setItem("ow_answer_feedback",JSON.stringify(records.slice(-100)));}catch(_e){}
  }
  async function ask(question){
    const text=question.trim(); if(!text)return;
    if(pendingAnswer)return;
    const answerId=`a${Date.now()}-${++requestSerial}`;
    $(".chat-panel").classList.add("conversation-active");
    const messages=$("#messages");
    messages.insertAdjacentHTML("beforeend",`<article class="message user"><div class="avatar">你</div><div class="bubble"><p>${escapeHtml(text)}</p></div></article>`);
    const special=mapResponse(text)||counterResponse(text);
    if(special){
      setTimeout(()=>{
        messages.insertAdjacentHTML("beforeend",`<article class="message bot"><div class="avatar">安</div><div class="bubble"><p class="bubble-kicker">安娜 · 女仆战术官</p>${special.html}${feedbackHtml(answerId)}</div></article>`);
        conversation.push({role:"user",content:text},{role:"assistant",content:"已返回结构化英雄或地图建议"});
        requestAnimationFrame(()=>messages.scrollTo({top:messages.scrollHeight,behavior:"smooth"})); updateTrace(special.cat,special.hits,special.confidence,"结构化规则 · 可解释");
      },260);
      $("#question").value="";resizeTextarea();return;
    }
    const classified=window.OW_RAG?.classify(text,categories)||classify(text);
    pendingAnswer=true;
    const loadingId=`loading-${answerId}`;
    messages.insertAdjacentHTML("beforeend",`<article id="${loadingId}" class="message bot is-loading"><div class="avatar">安</div><div class="bubble"><p class="bubble-kicker">安娜正在检索</p><p>主人请稍等，正在匹配版本、知识片段与引用来源…</p></div></article>`);
    const submit=$("#ask-form button[type=submit]"); submit.disabled=true;
    try{
      const result=await window.OW_RAG.ask(text,{category:classified.id,history:conversation,topK:5});
      const top=result.context?.[0];
      const cat=categories.find(c=>c.id===(top?.category||classified.id))||categories.find(c=>c.id==="fallback");
      const confidence=result.diagnostics?.retrieval?.[0]?.match||52;
      const html=ragAnswerHtml(result.answer,result.context,result.mode,result.usage);
      document.getElementById(loadingId)?.remove();
      messages.insertAdjacentHTML("beforeend",`<article class="message bot"><div class="avatar">安</div><div class="bubble"><p class="bubble-kicker">安娜 · ${escapeHtml(cat.name)} · RAG V2</p>${html}${feedbackHtml(answerId)}</div></article>`);
      conversation.push({role:"user",content:text},{role:"assistant",content:result.answer?.conclusion||"证据不足"});
      if(conversation.length>8)conversation.splice(0,conversation.length-8);
      updateTrace(cat,result.diagnostics?.retrieval||[],confidence,result.mode==="deepseek_rag"?`DeepSeek · ${escapeHtml(result.model||"chat")}`:"本地降级回答");
      $("#ai-status-title").textContent=result.mode==="deepseek_rag"?"DeepSeek RAG 已连接":"混合检索已就绪";
      $("#ai-status-copy").textContent=result.mode==="deepseek_rag"?"回答受检索证据与版本约束":"模型不可用时自动返回本地答案";
    }catch(error){
      document.getElementById(loadingId)?.remove();
      let hits=retrieve(text,classified.id);
      if(!hits.length)hits=[{item:kb.find(x=>x.id==="fallback-help"),score:1}];
      const primary=hits[0].item,cat=categories.find(c=>c.id===primary.cat);
      messages.insertAdjacentHTML("beforeend",`<article class="message bot"><div class="avatar">安</div><div class="bubble"><p class="bubble-kicker">安娜 · ${cat.name} · 安全降级</p>${answerHtml(primary)}${feedbackHtml(answerId)}</div></article>`);
      updateTrace(cat,hits,52,"本地安全降级");
    }finally{pendingAnswer=false;submit.disabled=false;}
    requestAnimationFrame(()=>messages.scrollTo({top:messages.scrollHeight,behavior:"smooth"}));
    $("#question").value=""; resizeTextarea();
  }
  function updateTrace(cat,hits,confidence,mode="新手友好格式"){
    $("#trace-empty").classList.add("hidden"); $("#trace").classList.remove("hidden");
    $("#trace-category").textContent=cat.name; $("#trace-hits").textContent=`命中 ${hits.length} 个片段`;
    $("#trace-confidence").textContent=confidence+"%"; $("#confidence-bar").style.width=confidence+"%";
    $("#trace-mode").textContent=mode;
    $("#trace-sources").innerHTML=hits.map((h,i)=>`<div class="source-chip">${i+1}. ${escapeHtml(h.title||h.item?.title||"知识片段")}${Number.isFinite(h.score)?`<small>${h.score.toFixed(2)}</small>`:""}</div>`).join("");
  }
  function resizeTextarea(){const el=$("#question");el.style.height="auto";el.style.height=Math.min(el.scrollHeight,120)+"px";}
  function switchView(id){
    $$(".view").forEach(v=>v.classList.toggle("active",v.id===id+"-view"));
    $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===id));
    $("#view-title").textContent={assistant:"今天想了解什么？",heroes:"英雄数据",library:"知识百科",news:"活动资讯",patch:"版本改动",esports:"赛事中心",media:"视频与直播"}[id];
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function renderFilters(){
    $("#category-filters").innerHTML=`<button class="filter active" data-filter="all">全部</button>`+categories.filter(c=>c.id!=="fallback").map(c=>`<button class="filter" data-filter="${c.id}">${c.name}</button>`).join("");
  }
  function renderLibrary(){
    const query=normalize($("#library-search").value); const items=kb.filter(item=>item.cat!=="fallback"&&(activeFilter==="all"||item.cat===activeFilter)&&(!query||normalize(item.title+item.summary+item.keywords.join("")).includes(query)));
    $("#library-count").textContent=`找到 ${items.length} 个知识条目`;
    $("#library-grid").innerHTML=items.length?items.map(item=>{const c=categories.find(x=>x.id===item.cat);return `<button class="kb-card" data-id="${item.id}"><span class="tag">${c.name}${item.dynamic?" · 动态核验":""}</span><h3>${item.title}</h3><p>${item.summary}</p><small>查看完整答案 →</small></button>`}).join(""):`<div class="empty-results">没有找到相关内容，换个关键词试试。</div>`;
  }
  function renderHeroes(){
    const q=normalize($("#hero-search")?.value||"");
    const aliases=window.OW_HERO_ALIASES||{};
    const items=(window.OW_HERO_STATS||[]).filter(h=>(activeRole==="all"||h.role===activeRole)&&(!q||normalize(`${h.name}${h.en}${(aliases[h.id]||[]).join("")}`).includes(q)));
    $("#hero-grid").innerHTML=items.map((h,i)=>{const delta=h.win-50;const bar=Math.max(5,Math.min(95,(h.win-43)*6.5));return `<button class="hero-stat tier-card-${h.tier.toLowerCase()}" data-hero="${h.id}"><div class="card-scan"></div><div class="hero-card-top"><span class="hero-index">${String(i+1).padStart(2,"0")}</span><span class="role-mark ${h.role.toLowerCase()}">${{Tank:"TANK",Damage:"DAMAGE",Support:"SUPPORT"}[h.role]}</span><b class="tier tier-${h.tier.toLowerCase()}">TIER ${h.tier}</b></div><div class="hero-ident"><span class="hero-glyph"><img src="assets/heroes/${h.id}.png" alt="${h.name}头像" loading="lazy"></span><div><h3>${h.name}</h3><small>${h.en}</small></div></div><div class="win-readout"><span>WIN RATE</span><strong>${h.win.toFixed(1)}<em>%</em></strong><i class="delta ${delta>=0?"up":"down"}">${delta>=0?"+":""}${delta.toFixed(1)} vs 50</i></div><div class="win-track"><i style="width:${bar}%"></i><b></b></div><footer><span>PICK ${h.pick.toFixed(1)}% · BAN ${h.ban.toFixed(1)}%</span><span>OPEN DATA →</span></footer></button>`}).join("");
  }
  function openHero(id){
    const h=window.OW_HERO_STATS.find(x=>x.id===id); const guide=window.OW_COUNTER_GUIDES?.[id];
    const role={Tank:"重装",Damage:"输出",Support:"支援"}[h.role];
    $("#dialog-content").innerHTML=`<div class="dialog-hero-head"><img src="assets/heroes/${h.id}.png" alt="${h.name}头像"><div><span class="dialog-tag">${role} · 官方数据快照</span><h2>${h.name} <small>${h.en}</small></h2></div></div><div class="hero-detail-metrics"><div><span>胜率</span><strong>${h.win.toFixed(1)}%</strong></div><div><span>选取率</span><strong>${h.pick.toFixed(1)}%</strong></div><div><span>禁用率</span><strong>${h.ban.toFixed(1)}%</strong></div><div><span>环境评级</span><strong>${h.tier}</strong></div></div>${guide?`<div class="dialog-body"><h3>对位核心</h3><p>${guide.core}</p><h3>常见应对选择</h3><p>${Object.values(guide.roles).flat().slice(0,6).join("、")}</p></div>`:""}<p class="version-warning">口径：PC、快速比赛职责队列、美洲、全段位、全部地图；快照日期 2026-09-20。胜率不是英雄强度或克制关系的唯一结论。</p><div class="dialog-links"><a href="https://overwatch.blizzard.com/en-us/rates/?input=PC&map=all-maps&region=Americas&role=All&rq=0&tier=All" target="_blank" rel="noreferrer">核对官方英雄统计 ↗</a><a href="https://www.counterwatch.gg/stats/overwatch/heroes/${h.id}" target="_blank" rel="noreferrer">社区对位样本 ↗</a></div>`;
    $("#detail-dialog").showModal();
  }
  function openDetail(id){const item=kb.find(x=>x.id===id),c=categories.find(x=>x.id===item.cat);$("#dialog-content").innerHTML=`<span class="dialog-tag">${c.name}</span><h2>${item.title}</h2><p>${item.summary}</p><div class="dialog-body">${answerHtml(item)}</div>`;$("#detail-dialog").showModal();}
  function renderLogic(){
    $("#logic-categories").innerHTML=categories.map(c=>`<div class="logic-category" style="border-color:${c.color}"><b>${c.name}</b><small>${c.hint}</small></div>`).join("");
  }
  document.addEventListener("click",e=>{
    if(e.target.closest("#guest-enter"))enterAsGuest();
    if(e.target.closest("#guest-status"))setEntry(true);
    const nav=e.target.closest(".nav-item"); if(nav)switchView(nav.dataset.view);
    const starter=e.target.closest("[data-question]"); if(starter)ask(starter.dataset.question);
    const filter=e.target.closest(".filter"); if(filter){activeFilter=filter.dataset.filter;$$(".filter").forEach(f=>f.classList.toggle("active",f===filter));renderLibrary();}
    const card=e.target.closest(".kb-card"); if(card)openDetail(card.dataset.id);
    const role=e.target.closest("[data-role]"); if(role){activeRole=role.dataset.role;$$("[data-role]").forEach(f=>f.classList.toggle("active",f===role));renderHeroes();}
    const hero=e.target.closest(".hero-stat"); if(hero)openHero(hero.dataset.hero);
    const feedback=e.target.closest("[data-feedback]"); if(feedback){const box=feedback.closest(".answer-feedback");saveFeedback(box.dataset.answerId,feedback.dataset.feedback);box.innerHTML="<span>已记录，感谢反馈。</span>";}
    if(e.target.closest("#show-flow"))switchView("heroes");
    if(e.target.closest(".dialog-close"))$("#detail-dialog").close();
  });
  $("#ask-form").addEventListener("submit",e=>{e.preventDefault();ask($("#question").value);});
  $("#question").addEventListener("input",resizeTextarea);
  $("#question").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();ask(e.target.value);}});
  $("#library-search").addEventListener("input",renderLibrary);
  $("#hero-search").addEventListener("input",renderHeroes);
  $("#detail-dialog").addEventListener("click",e=>{if(e.target===$("#detail-dialog"))$("#detail-dialog").close();});
  renderFilters();renderLibrary();renderHeroes();initEntry();initMotion();
  const requestedView=new URLSearchParams(location.search).get("view");
  if(requestedView&&$("#"+requestedView+"-view"))switchView(requestedView);
})();
