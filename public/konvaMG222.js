/*============================================
        全域變數 (跨API或是timeline會用)
==============================================*/

let Stage;
const Layers = [];
let audio = null;

let preview;
let freeMode = false;
let deductiveName, deductiveTime, deductiveColor, deductiveTimeMax = 0, lastDeductiveTime;
let attrs;

//把事件都灌到集合裡
let eventsss = [];
let eventsssLength = 0;

//動畫暫停計畫
let tweens = [];
let tweens_idx = 0;
let tweensFreeze = false;

/*============================================
        API
==============================================*/

//創建Konva.Stage 並設定容器的CSS
function stage(d) {

    Stage = new Konva.Stage({
        container: d.container,
        width: d.width,
        height: d.height
    });

    const container = document.getElementById(d.container);

    if(typeof d.backgroundColor !== 'undefined') container.style.backgroundColor = d.backgroundColor;
    if(typeof d.borderWidth !== 'undefined')     container.style.borderWidth = d.borderWidth+"px";
    if(typeof d.borderStyle !== 'undefined')     container.style.borderStyle = d.borderStyle;
    if(typeof d.borderColor !== 'undefined')     container.style.borderColor = d.borderColor;
    if(typeof d.margin !== 'undefined')          container.style.margin = d.margin;
    if(typeof d.marginTop !== 'undefined')       container.style.marginTop = d.marginTop;
    if(typeof d.marginLeft !== 'undefined')      container.style.marginLeft = d.marginLeft;

    return Stage;
}

//依照數量創建Konva.Layer
//日後可直接呼叫Layers[i]來選擇層
function layers(d) {

    for (let i = 0; i < d.amount; i++) {

        Layers[i] = new Konva.Layer();
        Stage.add(Layers[i]);
    }
}

//創建HTML Audio
function music(d) {

    audio = new Audio(d.src);
    if(typeof d.volume !== 'undefined')      audio.volume = d.volume;
    if(typeof d.currentTime !== 'undefined') audio.currentTime = d.currentTime;
    audio.play();
}

//演繹
function key(t, d, deductive) {

    let unit;

    if (d.class == 'Free') freeMode = true;
    else                   freeMode = false;

    //每一個演繹初始化顏色與時間
    deductiveName = "(none)"
    deductiveColor = "#5B5B5B";
    deductiveTime = 0.1;

    //為了建立timeLine 所有演繹必須"預演" 告知key演繹內容
    preview = true;
    deductive(unit);

    //根據class 建立相對應的Konva物件
         if (d.class == 'Rect')           unit = new Konva.Rect(attrs);
    else if (d.class == 'Wedge')          unit = new Konva.Wedge(attrs)
    else if (d.class == 'Ring')           unit = new Konva.Ring(attrs);
    else if (d.class == 'RegularPolygon') unit = new Konva.RegularPolygon(attrs);
    else if (d.class == 'Text')           unit = new Konva.Text(attrs);

    //開始時間
    let startTime = t.split(":");
    let startSec = parseInt(startTime[0]*60)+parseFloat(startTime[1]);

    //得知演繹內容後 依照內容 設定標籤樣式
    let eventSpan = document.createElement('span');
        eventSpan.textContent = attrs.layer+":"+deductiveName;
    let event = document.createElement('div');
        event.appendChild(eventSpan);
        event.classList.add("deductive");
        if(deductiveTime<0.58)deductiveTime =0.58;
        event.style.width = (deductiveTime*100)+'px';
        event.style.left = (parseFloat(startTime[1])*100)+'px';
        event.style.backgroundColor = deductiveColor;

    //找出演到最後的演繹
    lastDeductiveTime = parseFloat(startTime[1])+deductiveTime;
    if(lastDeductiveTime > deductiveTimeMax) deductiveTimeMax = lastDeductiveTime;

    //將標籤餵到object中 DOM準備好後在加到時間軸中
    eventsss[eventsssLength] = event;
    eventsssLength++;

    //等時間開始真正演繹
    preview = false;
    freeMode = false;
    setTimeout(()=>{deductive(unit)}, startSec*1000); 
};

//物件初始值
//FreeMode沒有init
function init(d) {

    //一開始先告知key演出訊息
    if(preview){

        if(typeof d.deductiveName !== 'undefined') deductiveName  = d.deductiveName;
        if(typeof d.fill !== 'undefined')          deductiveColor = d.fill;

        //把attrs變成全域 讓key宣告Konva類別
        attrs = d;
    }
    else if(!tweensFreeze){

        //freeMode是手動加入Layers, 宣告模式則是演繹時會自動加入
        if(!freeMode) Layers[d.layer].add(d.node);

        //如果該物件沒有tween 需要draw來呈現
        Layers[d.layer].draw();

    }
}

//創建Konva.Tween並設定setTimeout
function tween(d) {

    //告知key演出時間
    if(preview){

        if(d.duration!= null) deductiveTime = d.duration+d.start;
    }
    else{
        setTimeout(function() {

        //easing語法糖 並將預設設定為EaseOut
        if(typeof d.easing == 'undefined')      d['easing'] = Konva.Easings['EaseOut'];
        else                                    d['easing'] = Konva.Easings[d.easing];
                                                d['node']   = d.node;

        //暫停計畫
        if(!tweensFreeze){
            tweens[tweens_idx] = new Konva.Tween(d);
            tweens[tweens_idx].play();
        }
            tweens_idx++;
        
        }, d.start*1000);

    }
    
}

/*============================================
        DOM 容器準備
==============================================*/

//在DOM準備好的時候才能操作
document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
          
        const body = document.body;
    
        //加入時間表
        const timeLine = document.createElement('div');
              timeLine.setAttribute('id', 'timeLine');
        
              body.appendChild(timeLine);
        
        //加入碼表
        const stopwatch = document.createElement('div');
              stopwatch.setAttribute('id', 'stopwatch');
        
        const secondsspan = document.createElement('span');
              secondsspan.setAttribute('id', 'seconds');
              secondsspan.textContent = "00";
        
        const tensspan = document.createElement('span');
              tensspan.setAttribute('id', 'tens');
              tensspan.textContent = "00";
        
              stopwatch.appendChild(secondsspan);
              stopwatch.insertAdjacentHTML('beforeend', ':');
              stopwatch.appendChild(tensspan);
        
              body.appendChild(stopwatch);
        
        //加入控制鍵
        const ctrlButton = document.createElement('div');
              ctrlButton.style.cssText = "margin-left: 8px"; 
        
        let   input = document.createElement('input');
              input.setAttribute('type', 'button');
              input.setAttribute('id', 'play');
              input.setAttribute('value', 'Play');
              ctrlButton.appendChild(input);
        
              input = document.createElement('input');
              input.setAttribute('type', 'button');
              input.setAttribute('id', 'pause');
              input.setAttribute('value', 'Pause');
              ctrlButton.appendChild(input);
        
              body.appendChild(ctrlButton);
        

/*============================================
        時間表 (timeLine)
==============================================*/
    
        //把演繹倒入timeLine
        for (let i = 0; i < eventsssLength; i++) 
            timeLine.appendChild(eventsss[i]);
            
        
        //所有演繹
        const elesDeductive = document.getElementsByClassName("deductive");
        const lastDedu = elesDeductive[elesDeductive.length-1];
        let   allDeduH = 10, LDCW = 0, LDOL = 0;
    
        if(elesDeductive.length != 0){
            allDeduH = elesDeductive.length*17;
            LDCW = lastDedu.clientWidth;
            LDOL = lastDedu.offsetLeft;
        }
    
        //根據最後演繹的時間設定timeLine長度
        for (let i = 0; i < Math.ceil(deductiveTimeMax); i++) {
    
            //秒(span)
            const secSpan = document.createElement('span');
                  secSpan.textContent = i;
                  secSpan.style.marginTop = allDeduH+"px";
                
            //刻度(div)
            const secBox = document.createElement('div');
                  secBox.classList.add("sec-box");
                  secBox.classList.add("s"+i);
                  secBox.style.top = -allDeduH+"px";
                  secBox.style.height = allDeduH+"px";
                
                  secBox.appendChild(secSpan);
                  timeLine.appendChild(secBox);
        }
     
        //timeLine跑者
        const runner = document.createElement('div');
              runner.classList.add("timeRunner");
              runner.style.top = allDeduH+13+"px";
    
              timeLine.appendChild(runner);
    
        let   distance = 0;
    
        function runnerGO() {
        if(!tweensFreeze){
    
            distance += 1;
            runner.style.left = distance+"px";
    
            if(distance >= (document.getElementsByClassName("sec-box").length*100)) {
          
                clearInterval(startTimerInterval);
                clearInterval(runnerGOInterval);
                if(audio!= null)audio.pause();
            }
        }
        }
      
        //碼表
        const appendTens = document.getElementById("tens")
        const appendSeconds = document.getElementById("seconds")
        let seconds = 0; 
        let tens = 0; 
     
        function startTimer () {
        if(!tweensFreeze){
            tens++; 
                 
            if(tens > 99) {
    
                tens = 0;
                seconds++;
                if(seconds <= 9) 
                seconds = "0" +seconds;
                appendSeconds.innerHTML = seconds;
            }
            if(tens <= 9)
                tens = "0" + tens;
                    
            appendTens.innerHTML = tens;
        }
        }
    
        const runnerGOInterval = setInterval(runnerGO, 10);
        const startTimerInterval = setInterval(startTimer, 10);


/*============================================
        onclick監聽
==============================================*/
            
    
        //播放控制
        document.getElementById('play').addEventListener('click', function() {
          
            for (let i = 0; i < tweens.length; i++) 
            tweens[i].play();
            tweensFreeze = false;
            if(audio!= null) audio.play();
          
        }, false);
          
        document.getElementById('pause').addEventListener('click', function() {
          
            for (let i = 0; i < tweens.length; i++) 
            tweens[i].pause();
            tweensFreeze = true;
            if(audio!= null) audio.pause();
          
        }, false);
    
        //點擊畫布 顯示時間與滑鼠位置
        document.getElementById('container').addEventListener('click', function(event) {
          
            const coords = "CurX: " + event.clientX + ", CurY: " + event.clientY;
            const cueMessage = document.createElement('div');
                  cueMessage.textContent = seconds+"."+tens+"s, "+coords;
                  document.body.appendChild(cueMessage);
        
        }, false);
    
    
}}; //End of document.readyState
    
    