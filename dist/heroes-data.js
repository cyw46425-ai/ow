window.OW_HERO_STATS = [
  ["dmon","D.Mon","D.Mon","Tank",55.2,"S"],["dva","D.Va","D.Va", "Tank",45.6,"F"],["domina","多米娜","Domina","Tank",50.9,"B"],["doomfist","末日铁拳","Doomfist","Tank",50.9,"B"],["hazard","骇灾","Hazard","Tank",50.8,"B"],["junkerqueen","渣客女王","Junker Queen","Tank",53.3,"S"],["mauga","毛加","Mauga","Tank",49.0,"C"],["orisa","奥丽莎","Orisa","Tank",45.8,"F"],["ramattra","拉玛刹","Ramattra","Tank",48.8,"C"],["reinhardt","莱因哈特","Reinhardt","Tank",53.0,"A"],["roadhog","路霸","Roadhog","Tank",46.0,"F"],["sigma","西格玛","Sigma","Tank",50.5,"B"],["winston","温斯顿","Winston","Tank",50.2,"B"],["wreckingball","破坏球","Wrecking Ball","Tank",51.0,"B"],["zarya","查莉娅","Zarya","Tank",49.0,"C"],
  ["anran","安燃","Anran","Damage",51.8,"A"],["ashe","艾什","Ashe","Damage",51.6,"A"],["bastion","堡垒","Bastion","Damage",48.4,"D"],["cassidy","卡西迪","Cassidy","Damage",47.7,"D"],["echo","回声","Echo","Damage",48.9,"C"],["emre","埃姆雷","Emre","Damage",48.1,"D"],["freja","弗蕾娅","Freja","Damage",48.9,"C"],["genji","源氏","Genji","Damage",51.8,"A"],["hanzo","半藏","Hanzo","Damage",50.1,"B"],["junkrat","狂鼠","Junkrat","Damage",51.7,"A"],["mei","美","Mei","Damage",52.7,"A"],["pharah","法老之鹰","Pharah","Damage",51.8,"A"],["reaper","死神","Reaper","Damage",51.1,"B"],["shion","死怨","Shion","Damage",49.5,"C"],["sierra","席艾拉","Sierra","Damage",49.4,"C"],["sojourn","索杰恩","Sojourn","Damage",45.5,"F"],["soldier76","士兵：76","Soldier: 76","Damage",49.6,"C"],["sombra","黑影","Sombra","Damage",48.7,"C"],["symmetra","秩序之光","Symmetra","Damage",54.0,"S"],["torbjorn","托比昂","Torbjörn","Damage",55.6,"S"],["tracer","猎空","Tracer","Damage",50.6,"B"],["vendetta","Vendetta","Vendetta","Damage",52.6,"A"],["venture","探奇","Venture","Damage",52.5,"A"],["widowmaker","黑百合","Widowmaker","Damage",47.8,"D"],
  ["ana","安娜","Ana","Support",48.9,"C"],["baptiste","巴蒂斯特","Baptiste","Support",47.5,"D"],["brigitte","布丽吉塔","Brigitte","Support",51.8,"A"],["illari","伊拉锐","Illari","Support",50.1,"B"],["jetpackcat","喷气背包猫","Jetpack Cat","Support",51.7,"A"],["juno","朱诺","Juno","Support",51.0,"B"],["kiriko","雾子","Kiriko","Support",47.3,"D"],["lifeweaver","生命之梭","Lifeweaver","Support",48.7,"C"],["lucio","卢西奥","Lúcio","Support",51.3,"B"],["mercy","天使","Mercy","Support",49.2,"C"],["mizuki","瑞希","Mizuki","Support",51.4,"B"],["moira","莫伊拉","Moira","Support",49.9,"C"],["wuyang","无漾","Wuyang","Support",51.6,"A"],["zenyatta","禅雅塔","Zenyatta","Support",53.7,"S"]
].map(([id,name,en,role,win,tier])=>({id,name:({jetpackcat:"飞天猫",vendetta:"斩仇",sierra:"西拉",domina:"金驭"}[id]||name),en,role,win,tier}));

// Blizzard official hero-stat snapshot: PC / Quick Play role queue / Americas / all ranks / all maps, 2026-09-20.
// Values are [win rate, pick rate, ban rate]. Keeping the snapshot local makes the data source and date auditable.
{
  const officialSnapshot={ana:[47.7,22.4,0],anran:[53.2,12.8,0],ashe:[50.3,11.6,0],baptiste:[47.8,4.5,0],bastion:[48.5,11.2,0],brigitte:[53.5,5,0],cassidy:[46.6,13.1,0],dmon:[57.6,13.6,0],dva:[45.3,7.3,0],domina:[50,5.4,0],doomfist:[50.2,7.6,0],echo:[48.2,4.2,0],emre:[47.1,6.1,0],freja:[45.6,6.5,0],genji:[50.9,10.4,0],hanzo:[49.1,8.9,0],hazard:[48.9,2.6,0],illari:[49.7,4.3,0],jetpackcat:[49.3,10.6,0],junkerqueen:[53,5,0],junkrat:[52.5,11,0],juno:[51.3,21,0],kiriko:[44.4,17.1,0],lifeweaver:[48.4,12,0],lucio:[52.2,6,0],mauga:[45.3,4.6,0],mei:[53.6,7.6,0],mercy:[47.7,19.3,0],mizuki:[52,12,0],moira:[51.4,22.2,0],orisa:[46,9.4,0],pharah:[51.7,3.8,0],ramattra:[48.8,7.8,0],reaper:[52.7,9.5,0],reinhardt:[53.6,12.4,0],roadhog:[45.3,7.2,0],shion:[48.5,10.7,0],sierra:[50.6,15.4,0],sigma:[48.7,7.5,0],sojourn:[44.7,6.6,0],soldier76:[48.8,10.8,0],sombra:[49.2,6.1,0],symmetra:[54,2.7,0],torbjorn:[56.1,4.4,0],tracer:[50.3,6.7,0],vendetta:[55.3,6.6,0],venture:[52.7,2.7,0],widowmaker:[45.6,10.8,0],winston:[52.6,3.7,0],wreckingball:[48.9,2.8,0],wuyang:[50.3,5.8,0],zarya:[46.1,3.1,0],zenyatta:[53.6,9.6,0]};
  window.OW_HERO_STATS.forEach(hero=>{
    const values=officialSnapshot[hero.id];
    if(!values)return;
    [hero.win,hero.pick,hero.ban]=values;
    hero.tier=hero.win>=53.5?"S":hero.win>=51.5?"A":hero.win>=49.5?"B":hero.win>=47.5?"C":"D";
  });
}

window.OW_HERO_ALIASES = {
  zarya:["查莉娅","查莉亚","毛妹","毛子","zarya"],dva:["dva","d.va","迪瓦","宋哈娜"],doomfist:["末日铁拳","铁拳","doom"],winston:["温斯顿","猩猩","猴子"],wreckingball:["破坏球","仓鼠","球"],reinhardt:["莱因哈特","大锤","莱茵哈特"],roadhog:["路霸","猪"],junkerqueen:["渣客女王","女王"],sigma:["西格玛","sigma"],orisa:["奥丽莎","奥利莎"],ramattra:["拉玛刹","拉马刹"],mauga:["毛加","mauga"],hazard:["骇灾","hazard"],
  genji:["源氏","源","genji"],tracer:["猎空","闪光","tracer"],widowmaker:["黑百合","寡妇","widow"],pharah:["法老之鹰","法鸡","pharah"],soldier76:["士兵76","76","老兵"],cassidy:["卡西迪","麦克雷","牛仔"],bastion:["堡垒","bastion"],symmetra:["秩序之光","阿三","sym"],mei:["美","小美","mei"],reaper:["死神","reaper"],sombra:["黑影","黑客","sombra"],junkrat:["狂鼠","老鼠"],hanzo:["半藏","hanzo"],echo:["回声","echo"],ashe:["艾什","ashe"],sojourn:["索杰恩","sojourn"],torbjorn:["托比昂","炮台"],
  ana:["安娜","ana"],brigitte:["布丽吉塔","锤妹","brig"],lifeweaver:["生命之梭","花男","lifeweaver"],baptiste:["巴蒂斯特","巴蒂","bap"],kiriko:["雾子","kiriko"],mercy:["天使","mercy"],moira:["莫伊拉","莫姨"],lucio:["卢西奥","dj","lucio"],zenyatta:["禅雅塔","和尚","zen"],juno:["朱诺","juno"],illari:["伊拉锐","illari"]
};

window.OW_COUNTER_GUIDES = {
  zarya:{name:"查莉娅（毛妹）",verified:"CounterWatch 社区对位数据 · 2026-09-19",sample:"查莉娅总体胜率 48.9%，51,154 场；具体对位至少 50 名贡献者才展示",core:"先停火骗掉屏障，再集中爆发。她高能时不要在近距离拖长战斗，也不要让队友各自打一个屏障。",roles:{Tank:["莱因哈特","金驭","D.Mon"],Damage:["秩序之光","小美","堡垒"],Support:["布丽吉塔","生命之梭","巴蒂斯特"]},avoid:["温斯顿","末日铁拳","西格玛","D.Va"],tips:["看到紫色屏障时先停火，除非全队能立刻打穿并击杀。","数清两次屏障；第二次结束后的窗口最适合集火。","用高台、远距离和换角度迫使她难以维持能量与贴脸距离。","不要让重力喷涌一次抓到多人，团战前保持适当间距。"],source:"https://www.counterwatch.gg/stats/overwatch/counters/zarya"},
  genji:{name:"源氏",core:"用不依赖可反弹弹道的持续伤害、控制和贴身保护限制他；等他交出突进后再集火。",roles:{Tank:["温斯顿","查莉娅"],Damage:["小美","秩序之光"],Support:["莫伊拉","布丽吉塔"]},avoid:[],tips:["不要把可反弹的高伤害技能正面打进闪。","残血时靠近队友，不要给他刷新突进的连续击杀。","听到龙刃先拉开并交防御资源。"]},
  pharah:{name:"法老之鹰",core:"用稳定中远程火力持续压迫，并利用顶棚和高墙减少她的安全射角。",roles:{Tank:["D.Va","西格玛"],Damage:["艾什","士兵：76","黑百合"],Support:["巴蒂斯特","安娜","伊拉锐"]},avoid:[],tips:["标记空中目标，让两名队友共同关注。","优先压迫她的支援链，而不是一个人长时间追枪。","避免在无遮挡的大空地停留。"]},
  widowmaker:{name:"黑百合",core:"切断长视线并同步压迫她所在高台；让她移动就已经削弱了她。",roles:{Tank:["温斯顿","破坏球","末日铁拳"],Damage:["黑影","源氏","猎空"],Support:["雾子","卢西奥"]},avoid:[],tips:["先标记位置，再从掩体移动。","不要在同一角度连续探头。","机动英雄进场前确认队友能跟进。"]},
  tracer:{name:"猎空",core:"缩短队伍保护距离，保留短冷却控制或稳定伤害；逼出闪回即可，不必深追。",roles:{Tank:["D.Va","温斯顿"],Damage:["托比昂","卡西迪"],Support:["布丽吉塔","莫伊拉"]},avoid:[],tips:["靠近第二名队友站位。","记住她使用闪回后的危险窗口。","炮台和持续范围压力能压缩她的路线。"]},
  doomfist:{name:"末日铁拳",core:"用控制打断进场与撤退，并在他格挡时停止无意义充能。",roles:{Tank:["奥丽莎","路霸"],Damage:["卡西迪","黑影"],Support:["安娜","布丽吉塔"]},avoid:[],tips:["不要全部站成一条线。","等他交位移后再交控制。","保护被他切入的队友，不要各自追击。"]},
  dva:{name:"D.Va",core:"使用光束类伤害绕过防御矩阵，并在她机动技能用完后集中攻击。",roles:{Tank:["查莉娅"],Damage:["秩序之光","小美"],Support:["布丽吉塔","莫伊拉"]},avoid:[],tips:["不要把关键弹道技能送进防御矩阵。","她飞离支援视线后是主要集火窗口。","注意自毁时用硬掩体而非只靠屏障。"]}
};

window.OW_COUNTER_ARCHETYPES = {
  dive:{core:"用控制、近身保护和集中火力惩罚他的切入；先保住被攻击的队友，再追求击杀。",roles:{Tank:["D.Va","奥丽莎","路霸"],Damage:["小美","卡西迪","托比昂"],Support:["布丽吉塔","莫伊拉","卢西奥"]},tips:["缩短队友之间的保护距离。","等对方交位移后再使用控制。","逼退即可，不要全队追进敌后。"]},
  flyer:{core:"用稳定中远程火力和有顶棚的站位压缩空中英雄的安全角度。",roles:{Tank:["D.Va","西格玛","毛加"],Damage:["艾什","士兵：76","黑百合"],Support:["巴蒂斯特","安娜","伊拉锐"]},tips:["标记空中目标，让两人共同关注。","压迫为其提供治疗的支援。","避免长时间站在无遮挡空地。"]},
  sniper:{core:"切断长视线并同步压迫高台，让远程英雄被迫移动。",roles:{Tank:["温斯顿","破坏球","末日铁拳"],Damage:["黑影","猎空","源氏"],Support:["雾子","卢西奥","天使"]},tips:["确认位置后再选绕行路线。","不要从同一角度连续探头。","机动英雄进场前确认队友能接应。"]},
  flanker:{core:"抱团但不要重叠站位，保留短冷却控制与稳定伤害处理侧翼。",roles:{Tank:["D.Va","温斯顿","奥丽莎"],Damage:["托比昂","卡西迪","小美"],Support:["布丽吉塔","莫伊拉","雾子"]},tips:["听脚步并标记侧路。","优先保护被切的队友。","对方交撤退技能后才考虑追击。"]},
  shield:{core:"用持续破盾、绕角度或无视屏障的工具迫使其防线失效。",roles:{Tank:["拉玛刹","毛加","莱因哈特"],Damage:["堡垒","狂鼠","秩序之光"],Support:["禅雅塔","巴蒂斯特","安娜"]},tips:["全队攻击同一个屏障，不要分散。","屏障破裂前准备好推进技能。","从侧角让屏障无法同时覆盖所有方向。"]},
  sustain:{core:"用爆发、禁疗或集中火力压过持续恢复，不要平均攻击所有目标。",roles:{Tank:["渣客女王","路霸","西格玛"],Damage:["堡垒","死神","艾什"],Support:["安娜","禅雅塔","伊拉锐"]},tips:["确认同一个集火目标。","等关键治疗技能结束再投入终极技能。","优先逼退或分隔支援。"]},
  armor:{core:"保持距离、交替消耗防御资源，再在其关键减伤结束后爆发。",roles:{Tank:["西格玛","查莉娅","奥丽莎"],Damage:["堡垒","死神","小美"],Support:["安娜","禅雅塔","生命之梭"]},tips:["不要在减伤技能期间投入全部爆发。","控制其接近路线。","拉长战斗距离并占据高台。"]},
  beam:{core:"减少贴脸时间并统一处理防御资源；用屏障、距离和爆发窗口作战。",roles:{Tank:["莱因哈特","拉玛刹","路霸"],Damage:["秩序之光","小美","堡垒"],Support:["布丽吉塔","生命之梭","巴蒂斯特"]},tips:["不要零散提供充能或资源。","关键防御结束后再集火。","用高台和不同角度延长其接近时间。"]},
  turret:{core:"先确认并拆除召唤物或固定火力点，再从多角度推进。",roles:{Tank:["温斯顿","D.Va","西格玛"],Damage:["法老之鹰","艾什","回声"],Support:["巴蒂斯特","安娜","伊拉锐"]},tips:["不要带着残血继续穿过炮台视线。","远距离先处理固定目标。","换路线迫使对方重新部署。"]},
  support:{core:"用同步切入、视线阻断或爆发迫使支援先自保，减少其帮助队友的时间。",roles:{Tank:["温斯顿","D.Va","破坏球"],Damage:["猎空","黑影","探奇"],Support:["安娜","禅雅塔","伊拉锐"]},tips:["不要一个人深追支援。","先逼出保命技能，再决定是否继续。","通过墙角和屏障切断治疗视线。"]},
  projectile:{core:"用机动、吸收弹道和不规则走位降低其命中率，再快速接近或换角度。",roles:{Tank:["D.Va","西格玛","破坏球"],Damage:["猎空","源氏","黑影"],Support:["卢西奥","雾子","巴蒂斯特"]},tips:["不要在狭窄入口停留。","保持不规则移动。","等关键弹道技能落空后推进。"]},
  brawl:{core:"拒绝在对方最舒服的近距离正面硬拼，用高台、侧角与消耗拆掉其资源。",roles:{Tank:["西格玛","拉玛刹","奥丽莎"],Damage:["艾什","法老之鹰","堡垒"],Support:["安娜","禅雅塔","生命之梭"]},tips:["先占高台和长视线。","保持一个可撤退的转角。","对方加速冲锋时使用减速、位移或防御技能。"]}
};

window.OW_HERO_PROFILES = {
  dmon:"armor",dva:"beam",domina:"shield",doomfist:"dive",hazard:"dive",junkerqueen:"sustain",mauga:"sustain",orisa:"armor",ramattra:"brawl",reinhardt:"shield",roadhog:"sustain",sigma:"brawl",winston:"dive",wreckingball:"dive",zarya:"beam",
  anran:"flanker",ashe:"sniper",bastion:"armor",cassidy:"flanker",echo:"flyer",emre:"projectile",freja:"flyer",genji:"flanker",hanzo:"sniper",junkrat:"projectile",mei:"brawl",pharah:"flyer",reaper:"brawl",shion:"flanker",sierra:"sniper",sojourn:"sniper",soldier76:"sniper",sombra:"flanker",symmetra:"turret",torbjorn:"turret",tracer:"flanker",vendetta:"flanker",venture:"dive",widowmaker:"sniper",
  ana:"support",baptiste:"support",brigitte:"brawl",illari:"turret",jetpackcat:"flyer",juno:"support",kiriko:"support",lifeweaver:"support",lucio:"support",mercy:"support",mizuki:"support",moira:"support",wuyang:"support",zenyatta:"support"
};

window.OW_MAP_GUIDES = [
  {id:"eichenwalde",name:"艾兴瓦尔德",aliases:["艾兴瓦尔德","eichenwalde"],mode:"混合",tanks:["莱因哈特","拉玛刹","温斯顿","D.Va"],primary:"莱因哈特 / 拉玛刹",alternate:"温斯顿 / D.Va",why:"第一阶段入口和城堡内部适合能稳定推进转角的重装；屋顶与城墙高台需要机动重装主动争夺。",phases:["进攻 A 点：别一直挤正门，可让温斯顿或 D.Va 从侧面压高台；正面推进阵容可选莱因哈特或拉玛刹。","护送城外：先控制桥头与城墙上方，别只贴车。","城堡内部：路线狭窄，莱因哈特、拉玛刹的正面推进更容易执行。"],avoid:"如果队友是远程消耗阵容，不要独自选近战重装冲过多个转角。"},
  {id:"kingsrow",name:"国王大道",aliases:["国王大道","king's row","kings row"],mode:"混合",tanks:["莱因哈特","拉玛刹","西格玛","渣客女王"],primary:"莱因哈特 / 拉玛刹",alternate:"西格玛 / 渣客女王",why:"大量窄口和连续转角适合近身推进，也能让西格玛利用中距离消耗。",phases:["A 点先处理酒店与雕像两侧角度。","街道阶段利用每个转角恢复资源。","终点前不要在长通道无掩体推进。"],avoid:"赢团后追击过深，容易把推车和下一处转角都丢掉。"},
  {id:"gibraltar",name:"直布罗陀",aliases:["直布罗陀","gibraltar"],mode:"护送",tanks:["温斯顿","D.Va","破坏球","西格玛"],primary:"温斯顿 / D.Va",alternate:"破坏球 / 西格玛",why:"地图价值集中在多层高台，能快速上下高台的重装更容易为队伍创造空间。",phases:["机库外先抢二楼，不要全队贴车走低地。","机库内利用飞船与平台分割敌方视线。","终点前根据队友射程决定继续机动切入还是换西格玛稳步推进。"],avoid:"莱因哈特并非不能用，但若无法接近高台敌人，会长期被不同角度消耗。"},
  {id:"circuit",name:"皇家赛道",aliases:["皇家赛道","circuit royal"],mode:"护送",tanks:["西格玛","D.Va","温斯顿","拉玛刹"],primary:"西格玛",alternate:"D.Va / 温斯顿",why:"长视线和高台很多，西格玛便于远程控角；机动重装可在己方输出准备好时压高台。",phases:["第一段先清理弯道与高台火力。","室内转角增多后，拉玛刹的价值会上升。","进场要和远程队友同步，否则高台压迫无法转化。"],avoid:"不要在长视线里无掩体消耗全部防御资源。"},
  {id:"dorado",name:"多拉多",aliases:["多拉多","dorado"],mode:"护送",tanks:["温斯顿","D.Va","破坏球","西格玛"],primary:"温斯顿 / D.Va",alternate:"西格玛",why:"屋顶和桥上高台贯穿地图，机动重装能主动清理远程火力。",phases:["第一段先压桥与屋顶。","第二段利用建筑内部绕行，不要只走车旁。","最后一段空间变窄，可按阵容改用更稳定的正面重装。"],avoid:"机动重装跳入前要确认队友能看到目标。"},
  {id:"lijiang",name:"漓江塔",aliases:["漓江塔","lijiang"],mode:"控制",tanks:["莱因哈特","拉玛刹","温斯顿","D.Va"],primary:"按分图选择",alternate:"控制中心偏近战；庭院与夜市更重视机动",why:"三张分图结构差别很大，不应把一个固定答案套完整局。",phases:["控制中心：莱因哈特、拉玛刹适合狭窄入口。","庭院：温斯顿、D.Va更容易处理高台与外侧路线。","夜市：根据队伍选择近身推进或机动压侧面。"],avoid:"上一小局有效的重装，下一张分图不一定仍然合适。"},
  {id:"numbani",name:"努巴尼",aliases:["努巴尼","numbani"],mode:"混合",tanks:["温斯顿","D.Va","破坏球","西格玛"],primary:"温斯顿 / D.Va",alternate:"西格玛",why:"A 点防守高台强势，机动重装能主动争夺；后续街道也有连续垂直空间。",phases:["A 点不要只走低地主路。","先让队伍获得高台落脚点再深入。","街道转角阶段按队伍射程切换推进节奏。"],avoid:"孤身跳后排但没有输出跟进，只会把队伍正面暴露出来。"},
  {id:"rialto",name:"里阿尔托",aliases:["里阿尔托","rialto"],mode:"护送",tanks:["西格玛","D.Va","拉玛刹","温斯顿"],primary:"西格玛",alternate:"D.Va / 拉玛刹",why:"桥梁长视线、转角和高台交替出现，需要根据阶段切换远程控角与近身推进。",phases:["第一段利用转角消耗，不要在桥中央停留。","第二段主动处理楼上窗口。","终点前路线收窄，可用拉玛刹加强正面推进。"],avoid:"阵容射程不足时，别和远程阵容长时间隔河对耗。"}
];
