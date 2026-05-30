const QUIZ_TITLE = "다윗 성경 퀴즈 대회";

const QUESTIONS = [
  {
    q: "하나님은 사무엘 선지자에게 뿔에 기름을 채워 어느 동네로 가라고 하셨나요? God told the prophet Samuel to fill his horn with oil and go to which town?",
    options: ["예루살렘 (Jerusalem)", "나사렛 (Nazareth)", "베들레헴 (Bethlehem)", "여리고 (Jericho)"],
    answer: 2,
    points: 100,
    time: 30,
    verseRef: "사무엘상 16:1",
    verseText: "여호와께서 사무엘에게 이르시되 내가 이미 사울을 버려 이스라엘 왕이 되지 못하게 하였거늘 네가 그를 위하여 언제까지 슬퍼하겠느냐 너는 뿔에 기름을 채워 가지고 가라 내가 너를 베들레헴 사람 이새에게로 보내리니 이는 내가 그의 아들 중에서 한 왕을 보았느니라 하시는지라\n\nhe LORD said to Samuel, \"How long will you mourn for Saul, since I have rejected him as king over Israel? Fill your horn with oil and be on your way; I am sending you to Jesse of Bethlehem. I have chosen one of his sons to be king.\""
  },

  {
    q: "사울 왕의 마음이 악령으로 괴로울 때, 다윗이 왕궁에 들어가 연주한 악기는? When King Saul was tormented by an evil spirit, what instrument did David play in the palace?",
    options: ["나팔 (Trumpet)", "수금 (Lyre)", "피리 (Flute)", "드럼 (Drum)"],
    answer: 1,
    points: 50,
    time: 30,
    verseRef: "사무엘상 16:23",
    verseText: "하나님께서 부리시는 악령이 사울에게 이를 때에 다윗이 수금을 들고 와서 손으로 탄즉 사울이 상쾌하여 낫고 악령이 그에게서 떠나더라\n\nWhenever the spirit from God came on Saul, David would take up his lyre and play. Then relief would come to Saul; he would feel better, and the evil spirit would leave him."
  },

  {
    q: "블레셋의 거인 골리앗이 이스라엘 군대를 모욕할 때, 그의 키는 약 얼마였나요? When the Philistine giant Goliath mocked the Israelite army, how tall was he?",
    options: ["네 규빗 한 뼘 (Four cubits and a span)", "여섯 규빗 한 뼘 (Six cubits and a span)", "일곱 규빗 (Seven cubits)", "여덟 규빗 두 뼘 (Eight cubits and two spans)"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘상 17:4",
    verseText: "블레셋 사람들의 진영에서 싸움을 돋우는 자가 왔는데 그의 이름은 골리앗이요 가드 사람이라 그의 키는 여섯 규빗 한 뼘이요\n\nA champion named Goliath, who was from Gath, came out of the Philistine camp. His height was six cubits and a span."
  },

  {
    q: "다윗이 골리앗과 싸우기 전, 시냇가에서 고른 매끄러운 돌은 총 몇 개인가요? How many smooth stones did David pick from the stream before fighting Goliath?",
    options: ["3개 (3)", "4개 (4)", "5개 (5)", "6개 (6)"],
    answer: 2,
    points: 100,
    time: 30,
    verseRef: "사무엘상 17:40",
    verseText: "손에 막대기를 가지고 시내에서 매끄러운 돌 다섯을 골라서 자기 목자의 제구 곧 주머니에 넣고 손에 물매를 가지고 블레셋 사람에게로 나아가니라\n\nThen he took his staff in his hand, chose five smooth stones from the stream, put them in the pouch of his shepherd's bag and, with his sling in his hand, approached the Philistine."
  },

  {
    q: "골리앗을 쓰러뜨린 후 다윗이 사용한 골리앗의 무기는 무엇인가요? After defeating Goliath, which of Goliath's weapons did David use?",
    options: ["창 (Spear)", "활 (Bow)", "칼 (Sword)", "방패 (Shield)"],
    answer: 2,
    points: 100,
    time: 30,
    verseRef: "사무엘상 17:51",
    verseText: "다윗이 달려가서 블레셋 사람을 밟고 그의 칼을 그 칼 집에서 빼내어 그 칼로 그를 죽이고 그의 머리를 베니 블레셋 사람들이 자기 용사의 죽음을 보고 도망하는지라\n\nDavid ran and stood over him. He took hold of the Philistine's sword and drew it from the sheath. After he killed him, he cut off his head with the sword.\nWhen the Philistines saw that their hero was dead, they turned and ran."
  },

  {
    q: "사울 왕이 다윗을 질투하여 죽이려 창을 던졌을 때, 다윗을 창 밖으로 달아나게 도와준 아내는? When King Saul jealously tried to spear David, which wife helped him escape through a window?",
    options: ["미갈 (Michal)", "아비가일 (Abigail)", "밧세바 (Bathsheba)", "하깃 (Haggith)"],
    answer: 0,
    points: 100,
    time: 30,
    verseRef: "사무엘상 19:12",
    verseText: "미갈이 다윗을 창에서 달아 내리매 그가 피하여 도망하니라\n\nSo Michal let David down through a window, and he fled and escaped."
  },

  {
    q: "다윗이 도망가던 중 제사장 아히멜렉에게 얻어먹은 거룩한 떡의 이름은? What was the name of the holy bread David received from the priest Ahimelech while escaping?",
    options: ["무교병 (Unleavened bread)", "진설병 (The bread of the Presence)", "보리떡 (Barley bread)", "만나 (Manna)"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘상 21:6",
    verseText: "제사장이 그 거룩한 떡을 주었으니 거기는 진설병 곧 여호와 앞에서 물려 낸 떡밖에 없었음이라 이 떡은 더운 떡을 드리는 날에 물려 낸 것이더라\n\nSo the priest gave him the consecrated bread, since there was no bread there except the bread of the Presence that had been removed from before the LORD and replaced by hot bread on the day it was taken away."
  },

  {
    q: "다윗이 블레셋의 가드 왕 아기스 앞에서 살아남기 위해 미친 척하며 침을 흘린 곳은? Where did David pretend to be insane, letting saliva run down, to survive before King Achish of Gath?",
    options: ["대문짝 (The gates of the city)", "성벽 (The city walls)", "성막 문 (The door of the tabernacle)", "제단의 뿔 (The horns of the altar)"],
    answer: 0,
    points: 100,
    time: 30,
    verseRef: "사무엘상 21:13",
    verseText: "그들 앞에서 그의 행동을 변하여 미친 체하고 대문짝에 그적거리며 침을 수염에 흘리매\n\nSo he pretended to be insane in their presence; and while he was in their hands he acted like a madman, making marks on the doors of the gate and letting saliva run down his beard."
  },

  {
    q: "다윗과 그를 따르는 환난 당하고 빚진 자들이 모여 지내던 굴의 이름은? What was the name of the cave where David and his followers, who were distressed and in debt, gathered to live?",
    options: ["에덴 굴 (Eden Cave)", "아둘람 굴 (Adullam Cave)", "소돔 굴 (Sodom Cave)", "마므레 굴 (Mamre Cave)"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘상 22:1",
    verseText: "그러므로 다윗이 그 곳을 떠나 아둘람 굴로 도망하매 그의 형제와 아버지의 온 집이 듣고 그리로 내려가서 그에게 이르렀고\n\nDavid left Gath and escaped to the cave of Adullam. When his brothers and his father's household heard about it, they went down to him there."
  },

  {
    q: "사울 왕이 전사한 산의 이름은? What was the name of the mountain where King Saul died in battle?",
    options: ["시내 산 (Mount Sinai)", "갈멜 산 (Mount Carmel)", "길보아 산 (Mount Gilboa)", "감람 산 (Mount of Olives)"],
    answer: 2,
    points: 100,
    time: 30,
    verseRef: "사무엘상 31:8",
    verseText: "그 이튿날 블레셋 사람들이 죽은 자를 벗기러 왔다가 사울과 그의 세 아들이 길보아 산에서 죽은 것을 보고\n\nThe next day, when the Philistines came to strip the dead, they found Saul and his three sons fallen on Mount Gilboa."
  },

  {
    q: "다윗이 처음 유다의 왕이 되었을 때, 사울의 군대 장관 아브넬이 사울의 아들 이스보셋을 세워 왕으로 삼은 성읍은 어디인가요? When David first became king of Judah, where was the city where Abner, Saul's commander, set up Saul's son Ish-bosheth as king?",
    options: ["헤브론 (Hebron)", "베들레헴 (Bethlehem)", "마하나임 (Mahanaim)", "예루살렘 (Jerusalem)"],
    answer: 2,
    points: 150,
    time: 30,
    verseRef: "사무엘하 2:8-9",
    verseText: "사울의 군사령관 넬의 아들 아브넬이 이미 사울의 아들 이스보셋을 데리고 마하나임으로 건너가 길르앗과 아술과 이스르엘과 에브라임과 베냐민과 온 이스라엘의 왕으로 삼았더라\n\nMeanwhile, Abner son of Ner, the commander of Saul's army, had taken Ish-Bosheth son of Saul and brought him over to Mahanaim. He made him king over Gilead, Ashuri and Jezreel, and also over Ephraim, Benjamin and all Israel.\nMeanwhile, Abner son of Ner, the commander of Saul's army, had taken Ish-Bosheth son of Saul and brought him over to Mahanaim."
  },

  {
    q: "다윗이 온 이스라엘의 왕이 되기 전, 헤브론에서 유다 지파를 다스린 기간은? How long did David reign over the tribe of Judah in Hebron before becoming king of all Israel?",
    options: ["5년 7개월 (5 years 7 months)", "6년 7개월 (6 years 7 months)", "7년 6개월 (7 years 6 months)", "8년 6개월 (8 years 6 months)"],
    answer: 2,
    points: 100,
    time: 30,
    verseRef: "사무엘하 2:11",
    verseText: "다윗이 헤브론에서 유다 족속의 왕이 된 날 수는 칠 년 육 개월이더라\n\nThe length of time David was king in Hebron over Judah was seven years and six months."
  },

  {
    q: "다윗이 유다 왕이 된 후 사울의 집과의 전쟁이 오래될수록, 다윗의 집은 어떻게 되었나요? After David became king of Judah, as the war with the house of Saul continued for a long time, what happened to David's house?",
    options: ["점점 약해졌다 (Weaker and weaker)", "점점 강하여갔다 (Stronger and stronger)", "수적으로 감소했다 (Decreased in number)", "일시적으로 위축됐다 (Temporarily diminished)"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘하 3:1",
    verseText: "사울의 집과 다윗의 집 사이에 전쟁이 오래매 다윗은 점점 강하여 가고 사울의 집은 점점 약하여 가니라\n\nThe war between the house of Saul and the house of David lasted a long time. David grew stronger and stronger, while the house of Saul grew weaker and weaker."
  },

  {
    q: "다윗이 온 이스라엘의 왕이 되었을 때의 나이는? How old was David when he became king of all Israel?",
    options: ["20세 (20)", "30세 (30)", "40세 (40)", "50세 (50)"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘하 5:4",
    verseText: "다윗이 나이가 삼십 세에 왕위에 올라 사십 년 동안 다스렸으되\n\nDavid was thirty years old when he became king, and he reigned forty years."
  },

  {
    q: "다윗이 예루살렘을 점령한 후, 두로 왕 히람이 보내준 재료와 기술자로 왕궁을 지었습니다. 그때 주 재료가 된 나무는 무엇인가요? After David captured Jerusalem, he built a palace with materials and craftsmen sent by King Hiram of Tyre. What was the main type of wood used?",
    options: ["조각목 (Acacia wood)", "백향목 (Cedar)", "잔나무 (Cypress)", "감람나무 (Olive wood)"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘하 5:11",
    verseText: "두로 왕 히람이 다윗에게 사절들과 백향목과 목수와 석수를 보내매 그들이 다윗을 위하여 집을 지으니\n\nNow Hiram king of Tyre sent envoys to David, along with cedar logs and carpenters and stonemasons, and they built a palace for David."
  },

  {
    q: "선지자 나단이 다윗의 죄를 책망하기 위해 사용한 비유는 무엇입니까?",
    options: ["잃어버린 양", "가난한 자의 어린 양", "포도원 농부", "씨 뿌리는 자"],
    answer: 1,
    points: 150,
    time: 30,
    verseRef: "사무엘하 12:3",
    verseText: "가난한 사람은 아무것도 없고 다만 자기가 사서 기르는 작은 암양 새끼 한 마리뿐이라 그 암양이 그와 그의 자녀와 함께 자라며 그가 먹는 것을 먹으며 그의 잔으로 마시며 그의 품에 누우니 그에게는 딸처럼 되었더라"
  },

  {
    q: "다윗이 나단의 책망을 들은 후 한 말은 무엇입니까?",
    options: ["나는 왕이다", "내가 여호와께 죄를 지었노라", "당신이 틀렸다", "나는 모른다"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘하 12:13",
    verseText: "다윗이 나단에게 이르되 내가 여호와께 죄를 지었노라 하매 나단이 다윗에게 말하되 여호와께서도 당신의 죄를 사하셨나니 당신이 죽지 아니하려니와"
  },

  {
    q: "다윗의 아들 압살롬이 반란을 일으킨 후 다윗은 예루살렘을 어떻게 하였습니까?",
    options: ["끝까지 싸웠다", "도망쳐 나갔다", "항복하였다", "숨었다"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘하 15:14",
    verseText: "다윗이 예루살렘에 있는 자기 신하들에게 이르되 일어나 도망하자 그렇지 아니하면 우리가 압살롬에게서 피하지 못하리라"
  },

  {
    q: "압살롬이 전투 중 어떻게 죽었습니까?",
    options: ["칼에 찔려", "나무에 머리카락이 걸려", "강에 빠져", "화살에 맞아"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘하 18:9",
    verseText: "압살롬이 다윗의 부하들 앞에서 노새를 탔는데 노새가 큰 상수리나무 아래로 지나갈 때에 압살롬의 머리가 그 상수리나무에 걸리매 그는 하늘과 땅 사이에 매달리고 그가 탔던 노새는 그 아래로 빠져나가니라"
  },

  {
    q: "다윗이 압살롬의 죽음 소식을 들었을 때 어떻게 반응했습니까?",
    options: ["기뻐했다", "슬피 울었다", "침묵했다", "하나님께 감사했다"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘하 18:33",
    verseText: "왕의 마음이 심히 괴로워 문 위 방에 올라가서 우니라 그가 올라갈 때에 말하기를 내 아들 압살롬아 내 아들 내 아들 압살롬아 차라리 내가 너를 대신하여 죽었더면 압살롬 내 아들아 내 아들아 하였더라"
  },

  {
    q: "다윗이 므비보셋에게 은혜를 베푼 이유는 무엇입니까?",
    options: ["부자였기 때문에", "요나단의 아들이었기 때문에", "용사였기 때문에", "선지자였기 때문에"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘하 9:1",
    verseText: "다윗이 이르되 사울의 집에 아직도 남은 사람이 있느냐 내가 요나단으로 말미암아 그 사람에게 은총을 베풀리라 하니라"
  },

  {
    q: "다윗이 인구 조사를 행한 후 하나님의 벌로 선택한 것은 무엇이었습니까?",
    options: ["7년 기근", "3달 전쟁 패배", "3일 전염병", "원수에게 쫓김"],
    answer: 2,
    points: 150,
    time: 30,
    verseRef: "사무엘하 24:13-14",
    verseText: "다윗이 갓에게 이르되 내가 매우 난처하도다 청하건대 여호와의 손에 빠지게 하소서 그의 자비가 크시오니 내가 사람의 손에는 빠지지 아니하겠나이다 하는지라"
  },

  {
    q: "다윗이 여부스 족속에게서 빼앗아 자기 이름을 붙인 성은?",
    options: ["다윗성", "시온성", "예루살렘성", "하나님의 성"],
    answer: 0,
    points: 100,
    time: 30,
    verseRef: "사무엘하 5:7",
    verseText: "다윗이 시온 산성을 빼앗았으니 이것이 다윗 성이더라"
  },

  {
    q: "하나님께서 다윗에게 주신 영원한 언약의 핵심 내용은 무엇입니까?",
    options: ["모든 원수를 물리친다", "다윗의 왕위를 영원히 견고히 한다", "아브라함 언약을 이룬다", "노아 언약을 기억한다"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘하 7:16",
    verseText: "네 집과 네 나라가 내 앞에서 영원히 보전되고 네 왕위가 영원히 견고하리라 하셨다 하라"
  },

  {
    q: "다윗이 골리앗과 싸우러 나갈 때 사울이 다윗에게 입혀준 것은?",
    options: ["갑옷과 투구", "흰 옷", "왕관", "아무것도 안 입혀줌"],
    answer: 0,
    points: 100,
    time: 30,
    verseRef: "사무엘상 17:38",
    verseText: "사울이 자기 군복을 다윗에게 입히고 놋 투구를 그 머리에 씌우고 또 그에게 갑옷을 입히매"
  },

  {
    q: "다윗이 왕이 되기 전 양을 치며 살았던 곳의 아버지 이름은?",
    options: ["사무엘", "이새", "아비나답", "요나단"],
    answer: 1,
    points: 50,
    time: 30,
    verseRef: "사무엘상 16:11",
    verseText: "사무엘이 이새에게 이르되 네 아들들이 다 여기 있느냐 이새가 이르되 아직 막내가 남았는데 그는 양을 지키나이다"
  },

  {
    q: "다윗 왕이 언약궤를 예루살렘으로 가져올 때 기뻐하여 한 행동은?",
    options: ["노래를 불렀다", "여호와 앞에서 춤을 추었다", "제물을 드렸다", "기도하였다"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘하 6:14",
    verseText: "다윗이 여호와 앞에서 힘을 다하여 춤을 추는데 그 때에 다윗이 베 에봇을 입었더라"
  },

  {
    q: "다윗의 아들 중 왕이 되려고 반역을 꾀한 자는 누구였습니까?",
    options: ["솔로몬", "압살롬", "아도니야", "암논"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘하 15:10",
    verseText: "압살롬이 이스라엘 모든 지파에 정탐꾼을 보내 이르되 나팔 소리를 들으면 압살롬이 헤브론에서 왕이 되었다 하라 하니라"
  },

  {
    q: "다윗이 골리앗을 향해 나갈 때 한 말 중 올바른 것은?",
    options: ["나의 힘으로 이기겠다", "만군의 여호와의 이름으로 나아간다", "왕의 칼로 이기겠다", "이스라엘의 지혜로 이기겠다"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘상 17:45",
    verseText: "다윗이 블레셋 사람에게 이르되 너는 칼과 창과 단창으로 내게 나아 오거니와 나는 만군의 여호와의 이름 곧 네가 모욕하는 이스라엘 군대의 하나님의 이름으로 네게 나아가노라"
  },

  {
    q: "다윗이 동굴에서 사울을 살려줄 때 사울을 죽이지 않은 이유는?",
    options: ["두려워서", "여호와의 기름 부음 받은 자임으로", "도망칠 힘이 없어서", "신하들이 말려서"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘상 24:6",
    verseText: "그가 자기 사람들에게 이르되 내가 손을 들어 여호와의 기름 부음을 받은 내 주를 치는 것은 여호와께서 금하시는 것이니 그는 여호와의 기름 부음을 받은 자가 됨이니라 하고"
  },

  {
    q: "다윗이 기름 부음을 받은 직후 어떤 일이 일어났습니까?",
    options: ["왕이 되었다", "여호와의 영이 다윗에게 임했다", "큰 용사가 되었다", "사울을 이겼다"],
    answer: 1,
    points: 100,
    time: 30,
    verseRef: "사무엘상 16:13",
    verseText: "사무엘이 기름 뿔을 가져다가 그의 형제 중에서 그에게 부었더니 이 날 이후로 다윗이 여호와의 영에게 크게 감동되니라 사무엘이 떠나서 라마로 가니라"
  }
];
