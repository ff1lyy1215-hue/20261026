// ==============================
// p5.js 五題選擇題測驗系統
// ==============================

// 宣告所有測驗題目資料
const questions = [
  {
    // 設定第一題題目
    question: "在 p5.js 中，哪一個函式會在程式開始時執行一次？",

    // 設定第一題的四個選項
    options: ["draw()", "setup()", "start()", "begin()"],

    // 設定正確答案的索引值，索引值 1 代表第二個選項
    answer: 1
  },

  {
    // 設定第二題題目
    question: "在 p5.js 中，哪一個函式會持續重複執行？",

    // 設定第二題的四個選項
    options: ["loop()", "repeat()", "draw()", "run()"],

    // 設定正確答案的索引值，索引值 2 代表第三個選項
    answer: 2
  },

  {
    // 設定第三題題目
    question: "下列哪一個指令可以建立畫布？",

    // 設定第三題的四個選項
    options: [
      "createCanvas()",
      "makeCanvas()",
      "newCanvas()",
      "canvasCreate()"
    ],

    // 設定正確答案的索引值，索引值 0 代表第一個選項
    answer: 0
  },

  {
    // 設定第四題題目
    question: "在 p5.js 中，哪一個指令可以設定背景顏色？",

    // 設定第四題的四個選項
    options: ["color()", "background()", "fillColor()", "backColor()"],

    // 設定正確答案的索引值，索引值 1 代表第二個選項
    answer: 1
  },

  {
    // 設定第五題題目
    question: "下列哪一個指令可以畫出圓形？",

    // 設定第五題的四個選項
    options: ["circle()", "ellipse()", "round()", "arcCircle()"],

    // 設定正確答案的索引值，索引值 1 代表第二個選項
    answer: 1
  }
];

// 設定目前正在作答的題目編號
let currentQuestion = 0;

// 設定使用者目前的答對題數
let score = 0;

// 設定使用者是否已經回答目前題目
let hasAnswered = false;

// 設定使用者選取的選項編號
let selectedOption = -1;

// 設定是否顯示正確答案提示
let showCorrectAnswer = false;

// 設定目前選擇是否答對
let currentAnswerIsCorrect = false;

// 設定畫面目前是否顯示測驗結果
let showResult = false;

// 設定按鈕的位置與尺寸
let nextButton = {
  x: 0,
  y: 0,
  width: 200,
  height: 56
};

// 設定重新開始按鈕的位置與尺寸
let restartButton = {
  x: 0,
  y: 0,
  width: 220,
  height: 56
};

// 設定選項的位置與尺寸
let optionBoxes = [];

// 設定觸控後短時間內忽略滑鼠事件
let ignoreMouseUntil = 0;

// 設定答錯後正確選項的上下跳動幅度
const jumpHeight = 8;

// 設定答錯時正確選項的背景顏色
const correctColor = "#99d98c";

// 設定一般選項的背景顏色
const normalOptionColor = "#ffffff";

// 設定使用者選取錯誤選項的背景顏色
const wrongColor = "#ffb3b3";

// 設定主要文字顏色
const textColor = "#1f2937";

// 設定畫面背景顏色
const pageBackgroundColor = "#eaf4f4";

// p5.js 啟動時執行一次
function setup() {
  // 建立與瀏覽器視窗相同大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 設定文字使用置中對齊
  textAlign(CENTER, CENTER);

  // 設定文字使用圓角風格
  textFont("Arial");

  // 計算畫面上的各個元件位置
  calculateLayout();
}

// p5.js 每一幀重複執行
function draw() {
  // 填滿整個畫面的背景顏色
  background(pageBackgroundColor);

  // 如果測驗已完成，就顯示結果畫面
  if (showResult) {
    drawResultScreen();

    // 如果測驗尚未完成，就顯示答題畫面
  } else {
    drawQuizScreen();
  }
}

// 計算所有畫面元件的響應式位置
function calculateLayout() {
  // 計算畫布中央的 X 座標
  const centerX = width / 2;

  // 設定選項區域的最大寬度
  const optionWidth = min(width * 0.86, 720);

  // 設定選項的高度
  const optionHeight = 58;

  // 設定選項之間的垂直間距
  const optionGap = 16;

  // 設定選項區域的起始 Y 座標
  const optionStartY = min(height * 0.42, 360);

  // 清空舊的選項位置資料
  optionBoxes = [];

  // 逐一建立四個選項的位置
  for (let i = 0; i < 4; i++) {
    // 計算目前選項的 Y 座標
    const optionY = optionStartY + i * (optionHeight + optionGap);

    // 儲存目前選項的位置與尺寸
    optionBoxes.push({
      x: centerX - optionWidth / 2,
      y: optionY,
      width: optionWidth,
      height: optionHeight
    });
  }

  // 設定下一題按鈕的寬度
  nextButton.width = min(width * 0.55, 240);

  // 設定下一題按鈕的高度
  nextButton.height = 56;

  // 設定下一題按鈕的 X 座標
  nextButton.x = centerX - nextButton.width / 2;

  // 設定下一題按鈕的 Y 座標
  nextButton.y = min(height - 95, optionStartY + 4 * (optionHeight + optionGap) + 18);

  // 設定重新開始按鈕的 X 座標
  restartButton.x = centerX - restartButton.width / 2;

  // 設定重新開始按鈕的 Y 座標
  restartButton.y = height * 0.62;
}

// 繪製答題畫面
function drawQuizScreen() {
  // 取得目前題目的資料
  const quiz = questions[currentQuestion];

  // 設定標題文字顏色
  fill(textColor);

  // 關閉文字外框
  noStroke();

  // 設定題數文字大小
  textSize(20);

  // 顯示目前題數
  text(
    "第 " + (currentQuestion + 1) + " 題／共 " + questions.length + " 題",
    width / 2,
    42
  );

  // 設定題目文字大小
  textSize(min(width * 0.052, 30));

  // 設定題目文字粗細
  textStyle(BOLD);

  // 顯示題目文字
  drawWrappedText(quiz.question, width / 2, 112, min(width * 0.86, 720), 38);

  // 恢復一般文字粗細
  textStyle(NORMAL);

  // 逐一繪製四個選項
  for (let i = 0; i < quiz.options.length; i++) {
    // 取得目前選項的位置資料
    const box = optionBoxes[i];

    // 設定選項目前的 Y 座標
    let displayY = box.y;

    // 判斷是否需要讓正確答案上下跳動
    if (
      hasAnswered &&
      !currentAnswerIsCorrect &&
      showCorrectAnswer &&
      i === quiz.answer
    ) {
      // 使用 sin 函式讓選項產生上下跳動效果
      displayY += sin(frameCount * 0.16) * jumpHeight;
    }

    // 設定選項預設背景顏色
    let optionColor = normalOptionColor;

    // 如果已作答且目前選項是正確答案，就使用綠色背景
    if (hasAnswered && showCorrectAnswer && i === quiz.answer) {
      optionColor = correctColor;
    }

    // 如果使用者答錯目前選項，就使用淡紅色背景
    if (
      hasAnswered &&
      !currentAnswerIsCorrect &&
      i === selectedOption &&
      i !== quiz.answer
    ) {
      optionColor = wrongColor;
    }

    // 繪製選項背景
    fill(optionColor);

    // 設定選項外框顏色
    stroke("#94a3b8");

    // 設定選項外框粗細
    strokeWeight(2);

    // 繪製圓角選項方框
    rect(box.x, displayY, box.width, box.height, 12);

    // 關閉外框
    noStroke();

    // 設定選項文字顏色
    fill(textColor);

    // 設定選項文字大小
    textSize(min(width * 0.043, 22));

    // 顯示選項文字
    text(quiz.options[i], width / 2, displayY + box.height / 2);
  }

  // 只有作答後才顯示答題結果提示
  if (hasAnswered) {
    // 設定提示文字大小
    textSize(min(width * 0.045, 24));

    // 設定答對時的提示文字顏色
    if (currentAnswerIsCorrect) {
      fill("#168aad");

      // 顯示答對提示
      text("答對了！", width / 2, height - 140);

      // 設定答錯時的提示文字顏色
    } else {
      fill("#b42318");

      // 顯示答錯提示
      text("答錯了！綠色跳動選項是正確答案。", width / 2, height - 140);
    }

    // 設定下一題按鈕背景顏色
    fill("#457b9d");

    // 設定下一題按鈕文字顏色
    stroke("#315872");

    // 設定按鈕外框粗細
    strokeWeight(2);

    // 繪製下一題按鈕
    rect(
      nextButton.x,
      nextButton.y,
      nextButton.width,
      nextButton.height,
      12
    );

    // 關閉按鈕外框
    noStroke();

    // 設定按鈕文字顏色
    fill("#ffffff");

    // 設定按鈕文字大小
    textSize(20);

    // 判斷目前是否為最後一題
    if (currentQuestion === questions.length - 1) {
      // 顯示查看結果文字
      text(
        "查看測驗結果",
        nextButton.x + nextButton.width / 2,
        nextButton.y + nextButton.height / 2
      );
    } else {
      // 顯示下一題文字
      text(
        "下一題",
        nextButton.x + nextButton.width / 2,
        nextButton.y + nextButton.height / 2
      );
    }
  }
}

// 繪製測驗結果畫面
function drawResultScreen() {
  // 設定結果標題文字顏色
  fill(textColor);

  // 關閉圖形外框
  noStroke();

  // 設定結果標題文字大小
  textSize(min(width * 0.075, 44));

  // 設定結果標題粗細
  textStyle(BOLD);

  // 顯示測驗完成標題
  text("測驗完成！", width / 2, height * 0.27);

  // 恢復一般文字粗細
  textStyle(NORMAL);

  // 設定分數文字大小
  textSize(min(width * 0.06, 34));

  // 顯示答對題數
  text(
    "你答對了 " + score + "／" + questions.length + " 題",
    width / 2,
    height * 0.41
  );

  // 設定鼓勵文字大小
  textSize(min(width * 0.045, 24));

  // 判斷分數是否達到全部答對
  if (score === questions.length) {
    // 顯示全部答對訊息
    text("太棒了！全部答對！", width / 2, height * 0.5);
  } else if (score >= 3) {
    // 顯示表現良好訊息
    text("表現很好，繼續加油！", width / 2, height * 0.5);
  } else {
    // 顯示鼓勵複習訊息
    text("再複習一下 p5.js 指令就會更進步！", width / 2, height * 0.5);
  }

  // 設定重新開始按鈕背景顏色
  fill("#457b9d");

  // 設定重新開始按鈕外框顏色
  stroke("#315872");

  // 設定按鈕外框粗細
  strokeWeight(2);

  // 繪製重新開始按鈕
  rect(
    restartButton.x,
    restartButton.y,
    restartButton.width,
    restartButton.height,
    12
  );

  // 關閉按鈕外框
  noStroke();

  // 設定按鈕文字顏色
  fill("#ffffff");

  // 設定按鈕文字大小
  textSize(20);

  // 顯示重新開始文字
  text(
    "重新開始",
    restartButton.x + restartButton.width / 2,
    restartButton.y + restartButton.height / 2
  );
}

// 處理滑鼠點擊事件
function mousePressed() {
  // 如果目前仍在忽略滑鼠事件的時間內，就不處理此次點擊
  if (millis() < ignoreMouseUntil) {
    return false;
  }

  // 處理目前的滑鼠點擊位置
  handlePointer(mouseX, mouseY);

  // 回傳 false 避免瀏覽器執行預設行為
  return false;
}

// 處理觸控事件
function touchStarted() {
  // 設定短暫忽略滑鼠事件，避免觸控造成重複觸發
  ignoreMouseUntil = millis() + 350;

  // 確認目前有觸控位置資料
  if (touches.length > 0) {
    // 取得第一個觸控點的位置
    handlePointer(touches[0].x, touches[0].y);
  }

  // 回傳 false 避免瀏覽器執行預設行為
  return false;
}

// 統一處理滑鼠與觸控點擊
function handlePointer(pointerX, pointerY) {
  // 如果目前顯示測驗結果，就處理重新開始按鈕
  if (showResult) {
    // 判斷是否點擊重新開始按鈕
    if (
      pointerX >= restartButton.x &&
      pointerX <= restartButton.x + restartButton.width &&
      pointerY >= restartButton.y &&
      pointerY <= restartButton.y + restartButton.height
    ) {
      // 重新開始測驗
      restartQuiz();
    }

    // 結束此次點擊處理
    return;
  }

  // 如果尚未作答，就檢查是否點擊選項
  if (!hasAnswered) {
    // 逐一檢查四個選項
    for (let i = 0; i < optionBoxes.length; i++) {
      // 取得目前選項的位置資料
      const box = optionBoxes[i];

      // 判斷點擊位置
