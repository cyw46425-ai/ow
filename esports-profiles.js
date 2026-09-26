// OWCS / OWL esports profiles. Reviewed 2026-09-26.
// Roster entries are dated snapshots, not permanent claims. Community nicknames are marked as unofficial.
(function () {
  const verifiedAt = "2026-09-26";
  const officialSchedule = "https://esports.overwatch.com/en-us/schedule";
  const teamPortal = "https://liquipedia.net/overwatch/Portal:Teams";

  const teams = [
    {id:"wbg",name:"Weibo Gaming",aliases:["WBG","微博战队"],region:"中国",status:"现役合作俱乐部",roster:["Leave","Shy","Guxue","Sunzo","LeeSooMin","MAKA"],style:"以中国核心选手的机动重装、灵活输出和中远程枪线见长。",honors:["2025 OWCS 中国赛区多阶段冠军","2026 OWCS 中国 Stage 1、Stage 2 冠军","2026 季中冠军赛第四名"],url:"https://liquipedia.net/overwatch/Weibo_Gaming"},
    {id:"jdg",name:"JD Gaming",aliases:["JDG","京东"],region:"中国",status:"现役合作俱乐部；赛季中有转会",roster:["Pineapple","Kaneki","Roxy","Mew"],style:"输出位覆盖枪位与弹道，2026 年成为挑战 WBG 的中国强队。",honors:["2026 OWCS 中国 Stage 2 亚军","2026 季中冠军赛参赛队"],url:"https://liquipedia.net/overwatch/JD_Gaming"},
    {id:"ag",name:"All Gamers",aliases:["AG","AG.AL"],region:"中国",status:"现役合作俱乐部",roster:["Ezhan","Insane","Alphari","LiGe","Mag","Lengsa","Recall"],style:"中韩混合阵容，擅长以重装英雄池和多形态输出适配版本。",honors:["2026 Champions Clash 中国二号代表","2026 季中冠军赛参赛队"],url:"https://liquipedia.net/overwatch/All_Gamers"},
    {id:"cr",name:"Crazy Raccoon",aliases:["CR","疯狂浣熊","浣熊"],region:"韩国/亚洲",status:"现役合作俱乐部",roster:["LIP","HeeSang","Stalk3r","Junbin","MAX","CH0R0NG","vigilante"],style:"高强度机动体系与精密集火，阵容拥有多位国际冠军选手。",honors:["2024 OWCS Major 冠军","2024 电竞世界杯冠军","2025 Champions Clash 冠军","2026 Champions Clash 冠军"],url:"https://liquipedia.net/overwatch/Crazy_Raccoon"},
    {id:"zeta",name:"ZETA DIVISION",aliases:["ZETA","泽塔"],region:"韩国赛区/日本俱乐部",status:"现役合作俱乐部",roster:["Proper","KNIFE","Mealgaru","BERNAR","Shu","Viol2t"],style:"明星阵容，输出上限高，支援线经验丰富。",honors:["2026 韩国 Stage 1、Stage 2 冠军","2026 Midseason Championship 冠军"],url:"https://liquipedia.net/overwatch/ZETA_DIVISION"},
    {id:"t1",name:"T1",aliases:["T1"],region:"韩国/亚洲",status:"现役合作俱乐部",roster:["Proud","ZEST","DONGHAK","Jasm1ne","skewed","Bliss"],style:"强调快速节奏、输出爆发与重装英雄切换。",honors:["2025 韩国 Stage 1、Stage 2 亚军","2026 Midseason Championship 第三名"],url:"https://liquipedia.net/overwatch/T1"},
    {id:"falcons",name:"Team Falcons",aliases:["Falcons","FLC","猎鹰"],region:"韩国赛区/沙特俱乐部",status:"2026 上半年阵容快照；赛季后段发生组织变动",roster:["MER1T","Checkmate","HanBin","SOMEONE","Fielder","ChiYo"],style:"冠军经验密集，重装和支援资源循环扎实。",honors:["2024 OWCS World Finals 冠军","2025 OWCS World Finals 亚军"],url:"https://liquipedia.net/overwatch/Team_Falcons"},
    {id:"varrel",name:"VARREL",aliases:["VL","瓦雷尔"],region:"日本",status:"现役",roster:["Nico","Qki","TOPDRAGON","KSG","Qloud","Sley"],style:"长期磨合的日本核心阵容，强调纪律性和团队执行。",honors:["2026 日本 Stage 2 冠军","2026 Midseason Championship 参赛队"],url:"https://liquipedia.net/overwatch/VARREL"},
    {id:"murash",name:"MURASH GAMING",aliases:["MURASH","村上"],region:"日本",status:"现役",roster:["ky0n","Viper","PEPPI","epic","orca"],style:"2026 年组建的新阵容，吸收日韩选手。",honors:["2026 日本 Stage 2 亚军"],url:"https://liquipedia.net/overwatch/MURASH_GAMING"},
    {id:"secret",name:"Team Secret",aliases:["Secret","TS","秘密"],region:"太平洋",status:"2026 季中赛阵容快照；赛季后有人员变动",roster:["hyvisi0n","Yoshinori2k","sgy","cuFFa","PaLee","wntr"],style:"泰国、新加坡与澳洲选手组成的太平洋代表队。",honors:["2026 太平洋 Stage 2 冠军","2026 Midseason Championship 参赛队"],url:"https://liquipedia.net/overwatch/Team_Secret"},
    {id:"shengshi",name:"SHENGSHI Esports",aliases:["SHENGSHI","盛世"],region:"太平洋",status:"2026 Stage 2 阵容快照",roster:["ColourHex","HOYA","Punk","Renaco","lumi","MCD","Ackyyy"],style:"跨澳洲、新西兰、韩国与新加坡的多国阵容。",honors:["2026 太平洋 Stage 1 冠军","2026 太平洋 Stage 2 亚军"],url:"https://liquipedia.net/overwatch/SHENGSHI_Esports"},
    {id:"dallas",name:"Dallas Fuel",aliases:["DAL","达拉斯燃料","燃料"],region:"北美",status:"现役合作俱乐部",roster:["Kronik","SeonJun","Kellan","Cjay","Lukemino"],style:"重返 2026 赛场后，以非常规阵容和纪律性运营见长。",honors:["2022 守望先锋联赛总冠军","2026 NA Stage 1 冠军","2026 NA Stage 2 冠军"],url:"https://liquipedia.net/overwatch/Dallas_Fuel"},
    {id:"ssg",name:"Spacestation Gaming",aliases:["SSG","太空站"],region:"北美",status:"现役合作俱乐部",roster:["Sugarfree","Lethal","scissors","Hawk","RhynO","UltraViolet","Admiral"],style:"输出火力强，阵容兼具北美与欧洲职业经验。",honors:["2024 EMEA Stage 2、Stage 4 冠军","2024 OWCS Major 第三名","2026 Midseason Championship 八强"],url:"https://liquipedia.net/overwatch/Spacestation_Gaming"},
    {id:"liquid",name:"Team Liquid",aliases:["TL","液体"],region:"北美",status:"现役合作俱乐部；2026 年 8—9 月有转会",roster:["TR33","zeruhh","Attack","Vega","KIVIS","UltraViolet"],style:"年轻北美核心，强调灵活输出与快速协同。",honors:["2025 NA Stage 3 冠军","2025 World Finals 参赛队","2026 Midseason Championship 参赛队"],url:"https://liquipedia.net/overwatch/Team_Liquid"},
    {id:"dsg",name:"Disguised",aliases:["DSG","伪装者"],region:"北美",status:"现役合作俱乐部",roster:["PGE","Tred","Scyle","KiWii"],style:"内容创作者俱乐部背景，阵容以新秀和社区知名选手为主。",honors:["2026 OWCS NA 合作俱乐部"],url:"https://liquipedia.net/overwatch/Disguised"},
    {id:"tm",name:"Twisted Minds",aliases:["TM","扭曲心智"],region:"欧中非",status:"现役合作俱乐部；2026 年有阵容变动",roster:["Quartz","Youbi","JaeWoo","TVNT","KSAA","Simple","FunnyAstro"],style:"沙特核心与欧洲/韩国选手结合，擅长围绕明星输出组织阵容。",honors:["2025 OWCS World Finals 冠军","2026 EMEA Stage 1 冠军","2026 Champions Clash 亚军","2026 Midseason Championship 亚军"],url:"https://liquipedia.net/overwatch/Twisted_Minds"},
    {id:"vp",name:"Virtus.pro",aliases:["VP","Virtus Pro"],region:"欧中非",status:"现役合作俱乐部",roster:["kevster","Seicoe","eisgnom","FiXa","Landon"],style:"欧洲明星输出搭配稳健后排，2026 Stage 2 状态突出。",honors:["2025 EMEA Stage 1 冠军","2026 EMEA Stage 2 冠军","2026 Champions Clash 第四名"],url:"https://liquipedia.net/overwatch/Virtus.pro"},
    {id:"geekay",name:"Geekay Esports",aliases:["GK","Geekay"],region:"欧中非",status:"现役",roster:["AlphaYi","LBBD7","ZIYAD","FiNN","Kellex","Haku"],style:"沙特与韩国选手组成的混合阵容，爆发力强。",honors:["2026 EMEA Stage 2 亚军","2026 Midseason Championship 参赛队"],url:"https://liquipedia.net/overwatch/Geekay_Esports"},
    {id:"peps",name:"Team Peps",aliases:["PEPS","法国队"],region:"欧中非",status:"合作俱乐部/法国项目",roster:["阵容随阶段调整"],style:"法国社区与人才培养色彩鲜明。",honors:["2026 OWCS EMEA 合作俱乐部"],url:"https://liquipedia.net/overwatch/Team_Peps"},
    {id:"9z",name:"9z Globant",aliases:["9z","9z Globant"],region:"拉丁美洲",status:"2026 国际赛代表",roster:["赛前需核验当阶段报名名单"],style:"拉美跨国阵容，2026 年通过 FACEIT League 晋级国际赛。",honors:["2026 Midseason Championship 拉美代表"],url:"https://liquipedia.net/overwatch/9z_Globant"},
    {id:"shock",name:"San Francisco Shock",aliases:["SFS","旧金山震动","震动队"],region:"历史/北美",status:"OWL 历史档案",roster:["2019—2020 冠军时期：Super、ChoiHyoBin、Striker、Viol2t 等"],style:"以体系深度、阵容轮换和版本适应能力著称。",honors:["2019 OWL 总冠军","2020 OWL 总冠军","2022 OWL 亚军"],url:"https://liquipedia.net/overwatch/San_Francisco_Shock"},
    {id:"dragons",name:"Shanghai Dragons",aliases:["SHD","上海龙","龙队"],region:"历史/中国俱乐部",status:"OWL 历史档案",roster:["2021 冠军时期：Fleta、LIP、Fate、Void、LeeJaeGon、IZaYaKI"],style:"从早期连败到登顶的代表性逆袭队伍，2021 年阵容控制力极强。",honors:["2021 OWL 总冠军","2020 OWL 常规赛亚洲第一"],url:"https://liquipedia.net/overwatch/Shanghai_Dragons"},
    {id:"spitfire",name:"London Spitfire",aliases:["LDN","伦敦喷火战斗机","伦敦喷火"],region:"历史/欧洲俱乐部",status:"OWL 历史档案",roster:["2018 冠军时期：Profit、birdring、Gesture、Fury、Bdosin、NUS"],style:"首届 OWL 冠军；后期欧洲阵容以莱因哈特地推闻名。",honors:["2018 OWL 总冠军","2022 OWL 季后赛第五至六名"],url:"https://liquipedia.net/overwatch/London_Spitfire"},
    {id:"chengdu",name:"Chengdu Hunters",aliases:["CDH","成都猎人","熊猫队"],region:"历史/中国",status:"OWL 历史档案",roster:["代表选手：Leave、JinMu、Ameng、Yveltal、Mmonk、LateYoung"],style:"以破坏球、法老之鹰等非传统阵容形成鲜明的“成都体系”。",honors:["2021 OWL 常规赛东部强队","Leave 获 2021 OWL MVP"],url:"https://liquipedia.net/overwatch/Chengdu_Hunters"}
  ];

  const players = [
    {id:"guxue",name:"Guxue",real:"徐秋林",region:"中国",role:"重装",aliases:["古雪","猴王（社区称呼）"],heroes:["温斯顿","末日铁拳","莱因哈特"],honors:["2018、2019、2023 世界杯亚军","2023 OWL 季军","多次 OWCS 中国赛区冠军"],teams:["杭州闪电","Once Again","Weibo Gaming"],url:"https://liquipedia.net/overwatch/Xu_Qiulin"},
    {id:"leave",name:"Leave",real:"黄馨",region:"中国",role:"输出",aliases:["离开哥（社区称呼）"],heroes:["猎空","回声","源氏","艾什"],honors:["2021 OWL 常规赛 MVP","2021、2023 输出位 Role Star","2023 世界杯亚军"],teams:["成都猎人","杭州闪电","Weibo Gaming"],url:"https://liquipedia.net/overwatch/Huang_Xin"},
    {id:"shy",name:"Shy",real:"郑扬杰",region:"中国",role:"输出",aliases:["小郑（社区称呼）"],heroes:["索杰恩","艾什","卡西迪","黑百合"],honors:["2018、2023 世界杯亚军","2023 OWL 季军","多次 OWCS 中国赛区冠军"],teams:["LGD Gaming","杭州闪电","Weibo Gaming"],url:"https://liquipedia.net/overwatch/Zheng_Yangjie"},
    {id:"sunzo",name:"Sunzo",real:"",region:"中国",role:"重装",aliases:["BILIDENG（曾用ID）"],heroes:["D.Va","查莉娅","西格玛"],honors:["2026 世界杯中国队成员","2026 OWCS 国际赛参赛经历"],teams:["Weibo Gaming"],url:"https://liquipedia.net/overwatch/Sunzo"},
    {id:"pineapple",name:"Pineapple",real:"李卓",region:"中国",role:"输出",aliases:["菠萝"],heroes:["猎空","索杰恩","艾什"],honors:["杭州闪电时期国际赛经历","2026 世界杯中国队成员"],teams:["杭州闪电","Team CC","JD Gaming"],url:"https://liquipedia.net/overwatch/Pineapple"},
    {id:"kaneki",name:"Kaneki",real:"刘念",region:"中国",role:"输出",aliases:["金木"],heroes:["法老之鹰","回声","源氏"],honors:["多次中国区国际赛代表","2026 世界杯中国队成员"],teams:["Team CC","JD Gaming"],url:"https://liquipedia.net/overwatch/Kaneki"},
    {id:"lige",name:"LiGe",real:"贾成杰",region:"中国",role:"重装",aliases:["离歌"],heroes:["D.Va","西格玛","查莉娅"],honors:["OWL 与 OWCS 中国赛区经历","2026 Champions Clash 参赛"],teams:["成都猎人","杭州闪电","All Gamers"],url:"https://liquipedia.net/overwatch/LiGe"},
    {id:"lengsa",name:"Lengsa",real:"陈靖逸",region:"中国",role:"支援",aliases:["冷飒"],heroes:["卢西奥","布丽吉塔","飞天猫"],honors:["2023 世界杯亚军","2023 OWL 季军"],teams:["杭州闪电","All Gamers"],url:"https://liquipedia.net/overwatch/Lengsa"},
    {id:"mmonk",name:"Mmonk",real:"周翔",region:"中国",role:"支援",aliases:["蒙克"],heroes:["安娜","禅雅塔","巴蒂斯特"],honors:["2023 世界杯亚军","2023 OWL 季军"],teams:["成都猎人","杭州闪电","JD Gaming"],url:"https://liquipedia.net/overwatch/Mmonk"},
    {id:"farway",name:"Farway1987",real:"曹家乐",region:"中国",role:"支援/管理",aliases:["远方","1987","Farway2025"],heroes:["安娜","禅雅塔","巴蒂斯特"],honors:["中国职业赛场长期经历","2026 JD Gaming 总经理"],teams:["广州冲锋","Team CC","JD Gaming"],url:"https://liquipedia.net/overwatch/Farway2025"},
    {id:"proper",name:"Proper",real:"金东贤",region:"韩国",role:"输出",aliases:["P皇（中文社区称呼）"],heroes:["猎空","源氏","索杰恩"],honors:["2022 OWL 常规赛 MVP 与最佳新秀","2024 OWCS World Finals 输出 MVP","2026 Midseason 冠军"],teams:["旧金山震动","Team Falcons","ZETA DIVISION"],url:"https://liquipedia.net/overwatch/Proper"},
    {id:"lip",name:"LIP",real:"李宰元",region:"韩国",role:"输出",aliases:["八尺九电竞战神（社区梗）"],heroes:["黑影","索杰恩","卡西迪"],honors:["2021 OWL 总冠军","2023 输出位 Role Star","2024 电竞世界杯冠军"],teams:["上海龙","亚特兰大君临","Crazy Raccoon"],url:"https://liquipedia.net/overwatch/LIP"},
    {id:"heesang",name:"HeeSang",real:"蔡熙相",region:"韩国",role:"输出",aliases:[],heroes:["回声","猎空","源氏"],honors:["2024 电竞世界杯冠军","2025、2026 Champions Clash 冠军","2026 世界杯冠军"],teams:["旧金山震动","Crazy Raccoon"],url:"https://liquipedia.net/overwatch/HeeSang"},
    {id:"stalk3r",name:"Stalk3r",real:"郑学勇",region:"韩国",role:"输出",aliases:[],heroes:["猎空","源氏","美"],honors:["2024 OWCS World Finals 冠军","2026 世界杯冠军"],teams:["首尔王朝","Team Falcons","Crazy Raccoon"],url:"https://liquipedia.net/overwatch/Stalk3r"},
    {id:"junbin",name:"Junbin",real:"朴俊彬",region:"韩国",role:"重装",aliases:[],heroes:["温斯顿","破坏球","末日铁拳"],honors:["2024 电竞世界杯冠军","2025、2026 Champions Clash 冠军","2026 世界杯冠军"],teams:["旧金山震动","Crazy Raccoon"],url:"https://liquipedia.net/overwatch/Junbin"},
    {id:"max",name:"MAX",real:"崔秀珉",region:"韩国",role:"重装",aliases:[],heroes:["D.Va","西格玛","查莉娅"],honors:["2024 电竞世界杯冠军","2025、2026 Champions Clash 冠军","2026 世界杯冠军"],teams:["旧金山震动","Crazy Raccoon"],url:"https://liquipedia.net/overwatch/MAX"},
    {id:"chorong",name:"CH0R0NG",real:"成有珉",region:"韩国",role:"支援",aliases:["Chorong"],heroes:["卢西奥","布丽吉塔","飞天猫"],honors:["2024 电竞世界杯冠军","2025、2026 Champions Clash 冠军","2026 世界杯冠军"],teams:["多伦多捍卫者","Crazy Raccoon"],url:"https://liquipedia.net/overwatch/CH0R0NG"},
    {id:"shu",name:"Shu",real:"金镇书",region:"韩国",role:"支援",aliases:[],heroes:["安娜","巴蒂斯特","雾子"],honors:["多次 OWL Role Star","2026 Midseason 冠军与赛事 MVP"],teams:["广州冲锋","洛杉矶角斗士","Crazy Raccoon","ZETA DIVISION"],url:"https://liquipedia.net/overwatch/Shu"},
    {id:"viol2t",name:"Viol2t",real:"朴民基",region:"韩国",role:"支援",aliases:["Violet（常见写法）"],heroes:["禅雅塔","巴蒂斯特","卢西奥","飞天猫"],honors:["2019、2020 OWL 总冠军","2026 Midseason 冠军"],teams:["旧金山震动","休斯顿神枪手","ZETA DIVISION"],url:"https://liquipedia.net/overwatch/Viol2t"},
    {id:"hanbin",name:"HanBin",real:"崔韩彬",region:"韩国",role:"重装",aliases:[],heroes:["D.Va","查莉娅","西格玛"],honors:["2022 OWL 总冠军","2024 OWCS World Finals 冠军"],teams:["达拉斯燃料","Team Falcons"],url:"https://liquipedia.net/overwatch/Hanbin"},
    {id:"someone",name:"SOMEONE",real:"咸正完",region:"韩国",role:"重装",aliases:[],heroes:["温斯顿","莱因哈特","拉玛刹","D.Va"],honors:["2023 OWL 总冠军与常规赛 MVP"],teams:["佛罗里达狂欢","Team Falcons"],url:"https://liquipedia.net/overwatch/Someone"},
    {id:"fielder",name:"Fielder",real:"权准",region:"韩国",role:"支援",aliases:[],heroes:["安娜","雾子","莫伊拉"],honors:["2022 OWL 总冠军","2024 OWCS World Finals 冠军"],teams:["巴黎永生","达拉斯燃料","Team Falcons"],url:"https://liquipedia.net/overwatch/Fielder"},
    {id:"chiyo",name:"ChiYo",real:"韩贤硕",region:"韩国",role:"支援",aliases:[],heroes:["卢西奥","布丽吉塔","飞天猫"],honors:["2022 OWL 总冠军","2024 OWCS World Finals 冠军"],teams:["达拉斯燃料","亚特兰大君临","Team Falcons"],url:"https://liquipedia.net/overwatch/ChiYo"},
    {id:"fearless",name:"Fearless",real:"李义石",region:"韩国",role:"重装",aliases:["无畏"],heroes:["温斯顿","莱因哈特","路霸"],honors:["2022 OWL 总冠军与总决赛 MVP","从上海龙早期低谷完成职业逆袭"],teams:["上海龙","达拉斯燃料","休斯顿神枪手","ZETA DIVISION"],url:"https://liquipedia.net/overwatch/Fearless"},
    {id:"profit",name:"Profit",real:"朴俊英",region:"韩国",role:"输出",aliases:["P皇（中文社区称呼）"],heroes:["猎空","源氏","布丽吉塔"],honors:["2018 OWL 总冠军与总决赛 MVP"],teams:["伦敦喷火","首尔王朝"],url:"https://liquipedia.net/overwatch/Profit"},
    {id:"fleta",name:"Fleta",real:"金炳善",region:"韩国",role:"输出/教练",aliases:["Fleta is the meta（经典标语）"],heroes:["回声","法老之鹰","猎空"],honors:["2020 OWL 常规赛 MVP","2021 OWL 总冠军"],teams:["首尔王朝","上海龙","T1 教练组"],url:"https://liquipedia.net/overwatch/Fleta"},
    {id:"jjonak",name:"JJoNak",real:"方成炫",region:"韩国",role:"支援",aliases:[],heroes:["禅雅塔","安娜"],honors:["2018 OWL 首届常规赛 MVP","2018 世界杯冠军"],teams:["纽约九霄天擎","首尔王朝"],url:"https://liquipedia.net/overwatch/JJoNak"},
    {id:"ryujehong",name:"Ryujehong",real:"柳济洪",region:"韩国",role:"支援",aliases:["柳帝（中文社区称呼）"],heroes:["安娜","禅雅塔"],honors:["2016、2017 世界杯冠军","早期职业安娜代表选手"],teams:["Lunatic-Hai","首尔王朝","温哥华泰坦"],url:"https://liquipedia.net/overwatch/Ryujehong"},
    {id:"sugarfree",name:"Sugarfree",real:"Kamden Hijada",region:"北美",role:"输出",aliases:["Lenny"],heroes:["猎空","源氏","回声"],honors:["2024 OWCS 北美 MVP","多次 OWCS 国际赛参赛"],teams:["温哥华泰坦","Spacestation Gaming"],url:"https://liquipedia.net/overwatch/Sugarfree"},
    {id:"hawk",name:"Hawk",real:"Xander Domecq",region:"北美",role:"重装",aliases:[],heroes:["D.Va","西格玛","末日铁拳"],honors:["2021 OWL 亚军","多次 OWCS 国际赛参赛"],teams:["亚特兰大君临","Spacestation Gaming"],url:"https://liquipedia.net/overwatch/Hawk"},
    {id:"ultraviolet",name:"UltraViolet",real:"Benjamin David",region:"北美",role:"支援",aliases:["UV"],heroes:["安娜","巴蒂斯特","禅雅塔"],honors:["北美 OWCS 多次国际赛参赛"],teams:["亚特兰大君临","Spacestation Gaming","Team Liquid"],url:"https://liquipedia.net/overwatch/UltraViolet"},
    {id:"tr33",name:"TR33",real:"",region:"北美",role:"输出",aliases:["Tree"],heroes:["索杰恩","猎空","美"],honors:["2025 NA Stage 3 冠军","2025、2026 国际赛参赛"],teams:["Team Liquid"],url:"https://liquipedia.net/overwatch/TR33"},
    {id:"kevster",name:"kevster",real:"Kevin Persson",region:"欧洲",role:"输出",aliases:[],heroes:["猎空","源氏","回声"],honors:["多次 OWL 输出 Role Star","2026 EMEA Stage 2 冠军"],teams:["洛杉矶角斗士","Virtus.pro"],url:"https://liquipedia.net/overwatch/Kevster"},
    {id:"funnyastro",name:"FunnyAstro",real:"Daniel Hathaway",region:"欧洲",role:"支援",aliases:["Astro"],heroes:["卢西奥","布丽吉塔"],honors:["2024 EMEA 多项冠军","2025 OWCS World Finals 冠军"],teams:["费城融合","伦敦喷火","Spacestation Gaming","Twisted Minds"],url:"https://liquipedia.net/overwatch/FunnyAstro"},
    {id:"quartz",name:"Quartz",real:"",region:"沙特阿拉伯",role:"输出",aliases:[],heroes:["索杰恩","艾什","黑百合"],honors:["2023 世界杯冠军","2025 OWCS World Finals 冠军"],teams:["Twisted Minds"],url:"https://liquipedia.net/overwatch/Quartz"},
    {id:"ksaa",name:"KSAA",real:"",region:"沙特阿拉伯",role:"重装",aliases:[],heroes:["西格玛","D.Va","查莉娅"],honors:["2023 世界杯冠军","2025 OWCS World Finals 冠军"],teams:["Twisted Minds","Spacestation Gaming"],url:"https://liquipedia.net/overwatch/KSAA"},
    {id:"alphayi",name:"AlphaYi",real:"金俊",region:"韩国",role:"输出",aliases:[],heroes:["源氏","猎空","回声"],honors:["OWL 与 OWCS 多赛区经历","2026 EMEA Stage 2 亚军"],teams:["杭州闪电","华盛顿正义","Geekay Esports"],url:"https://liquipedia.net/overwatch/AlphaYi"},
    {id:"cuffa",name:"cuFFa",real:"Riley Brown",region:"澳大利亚",role:"重装",aliases:[],heroes:["温斯顿","D.Va","破坏球"],honors:["2023、2026 世界杯参赛","2025 北美大学联赛年度选手","2026 太平洋 Stage 2 冠军"],teams:["Geekay Esports","Team Secret"],url:"https://liquipedia.net/overwatch/CuFFa"},
    {id:"topdragon",name:"TOPDRAGON",real:"郑承勇",region:"韩国/日本赛区",role:"输出",aliases:[],heroes:["猎空","源氏","回声"],honors:["VARREL 国际赛代表","2026 日本 Stage 2 冠军"],teams:["VARREL"],url:"https://liquipedia.net/overwatch/TOPDRAGON"},
    {id:"colourhex",name:"ColourHex",real:"Kelsey Birse",region:"新西兰",role:"输出",aliases:["Colourhex"],heroes:["艾什","黑百合","回声"],honors:["多届世界杯参赛","2026 太平洋 Stage 1 冠军"],teams:["波士顿崛起","SHENGSHI Esports"],url:"https://liquipedia.net/overwatch/ColourHex"},
    {id:"punk",name:"Punk",real:"Leyton Gilchrist",region:"澳大利亚",role:"重装",aliases:[],heroes:["D.Va","西格玛","查莉娅"],honors:["OWL 与多届世界杯经历","2026 太平洋 Stage 1 冠军"],teams:["波士顿崛起","SHENGSHI Esports"],url:"https://liquipedia.net/overwatch/Punk"}
  ];

  window.OW_ESPORTS_DB = {verifiedAt, teams, players};

  teams.forEach((team) => window.OW_KB.push({
    id:`esports-team-${team.id}`,cat:"esports",title:`职业战队档案：${team.name}`,
    summary:`${team.region}代表战队；含阵容快照、风格和主要荣誉。`,
    keywords:[team.name,...team.aliases,...team.roster,"职业战队","战队阵容","战队荣誉",team.region],dynamic:true,
    answer:{
      conclusion:`${team.name}（${team.aliases.join(" / ") || team.name}）是${team.region}的${team.status}。${team.style}`,
      why:`截至 ${verifiedAt} 的资料快照，名单包括：${team.roster.join("、")}。主要荣誉：${team.honors.join("；")}。`,
      steps:["观看比赛前先确认赛事阶段和当场报名名单。","用阵容风格理解常见战术，不把一次选角当作永久英雄池。","询问某位队员时可继续查看独立选手档案。"],
      pitfall:`职业阵容变化快；这里是截至 ${verifiedAt} 的快照，涉及“现在/下一场”时必须重新核验。`,
      links:[{label:`${team.name} 赛事档案`,url:team.url},{label:"官方 OWCS 赛程",url:officialSchedule}]
    }
  }));

  players.forEach((player) => window.OW_KB.push({
    id:`esports-player-${player.id}`,cat:"esports",title:`职业选手档案：${player.name}${player.real?`（${player.real}）`:""}`,
    summary:`${player.region}${player.role}选手；含常用英雄、社区称呼、队史与荣誉。`,
    keywords:[player.name,player.real,...player.aliases,...player.heroes,...player.teams,"职业选手","绰号","招牌英雄","荣誉",player.region,player.role].filter(Boolean),dynamic:true,
    answer:{
      conclusion:`${player.name}${player.real?`（${player.real}）`:""}是${player.region}${player.role}选手，代表英雄包括${player.heroes.join("、")}。${player.aliases.length?`常见称呼：${player.aliases.join("、")}。`:""}`,
      why:`代表经历：${player.teams.join(" → ")}。主要荣誉：${player.honors.join("；")}。`,
      steps:["看完整比赛或第一视角，重点观察站位、资源和撤退路线。","招牌英雄是历史表现总结，不代表当前版本只会这些英雄。","查询现役战队、下一场比赛或直播间时再次核对日期。"],
      pitfall:`英雄池、效力队伍和现役状态会变化；社区绰号不是官方称谓。本档案核验于 ${verifiedAt}。`,
      links:[{label:`${player.name} 赛事档案`,url:player.url},{label:"职业战队索引",url:teamPortal},{label:"官方 OWCS 赛程",url:officialSchedule}]
    }
  }));
})();
