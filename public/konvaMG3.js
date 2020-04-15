class KonvaMG {

    constructor(d) {

        this.UIfinish = false;
        this.deductiveTimeMax = 0;
        this.tweens = [];
        this.tweens_idx = 0;
        this.tweensFreeze = false;
        this.deductiveName;
        this.deductiveTime;
        this.deductiveColor;
        this.lastDeductiveTime;
        this.Layers = [];
        this.audio = null;
        this.preview;
        this.freeMode = false;
        this.attrs;


        // 建立介面
        this.buildUI();
        // 點擊事件
        this.clickEvent();

        this.Stage = new Konva.Stage(d);
    }


    // 建立介面
    buildUI() {

        if (this.UIfinish) return;

        const body = document.getElementsByTagName("body")[0];

        // 加入時間軸
        const timeLine = document.createElement('div');
        timeLine.setAttribute('id', 'timeLine');

        body.appendChild(timeLine);

        const deductiveBox = document.createElement('div');
        deductiveBox.setAttribute('id', 'deductiveBox');

        const ruler = document.createElement('div');
        ruler.setAttribute('id', 'ruler');

        const timeRunner = document.createElement('div');
        timeRunner.setAttribute('id', 'timeRunner');

        timeLine.appendChild(deductiveBox);
        timeLine.appendChild(ruler);
        timeLine.appendChild(timeRunner);

        // 加入碼表
        const stopwatch = document.createElement('div');
        stopwatch.setAttribute('id', 'stopwatch');
        stopwatch.textContent = `00:00`;

        body.appendChild(stopwatch);

        // 加入控制鍵
        const ctrlButton = document.createElement('div');
        ctrlButton.style.cssText = "margin-left: 8px";

        let input = document.createElement('input');
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

        this.UIfinish = true;
    }

    // 點擊事件
    clickEvent() {
        //播放控制
        document.getElementById('play').addEventListener('click', function () {

            for (let i = 0; i < tweens.length; i++)
                tweens[i].play();
            tweensFreeze = false;
            if (audio != null) audio.play();

        }, false);

        document.getElementById('pause').addEventListener('click', function () {

            for (let i = 0; i < tweens.length; i++)
                tweens[i].pause();
            tweensFreeze = true;
            if (audio != null) audio.pause();

        }, false);

        //點擊畫布 顯示時間與滑鼠位置
        document.getElementById('container').addEventListener('click', function (event) {

            const coords = "CurX: " + event.clientX + ", CurY: " + event.clientY;
            const cueMessage = document.createElement('div');
            cueMessage.textContent = seconds + "." + tens + "s, " + coords;
            document.body.appendChild(cueMessage);

        }, false);

    }

    //演繹
    At(d, deductive) {

        if (d.class == 'Free') this.freeMode = true;
        else this.freeMode = false;

        //每一個演繹初始化顏色與時間
        // deductiveName = "(none)"
        // deductiveColor = "#5B5B5B";
        // deductiveTime = 0.1;

        //開始時間
        let startTime = d.time.split(":");
        let startSec = parseInt(startTime[0] * 60) + parseFloat(startTime[1]);

        this.deductiveName = (d.label || "--");

        //為了建立timeLine 所有演繹必須"預演" 告知key演繹內容
        this.preview = true;
        deductive();

        // 建立演繹標籤
        this.deductiveTag(startTime, d.layer);

        //找出演到最後的演繹
        this.lastDeductiveTime = parseFloat(startTime[1]) + this.deductiveTime;
        if (this.lastDeductiveTime > this.deductiveTimeMax) this.deductiveTimeMax = this.lastDeductiveTime;

        //等時間開始真正演繹
        this.preview = false;
        this.freeMode = false;
        this.node = new Konva[d.class](this.attrs);
        const self = this;
        setTimeout(() => { deductive(self) }, startSec * 1000);
    };

    //物件初始值
    //FreeMode沒有init
    Add(d) {
        const self = this;

        //一開始先告知key演出訊息
        if (this.preview) {
            this.deductiveColor = (d.fill || "#5B5B5B");

            //把attrs變成全域 讓key宣告Konva類別
            this.attrs = d;
        }
        else if (!this.tweensFreeze) {

            // 如果沒有第i圖層
            const id = "layer" + d.layer;

            if (!document.querySelector("#" + id)) {
                console.log(self.Layers);
                this.Layers[d.layer] = new Konva.Layer();

                this.Stage.add(this.Layers[d.layer]);

                const rrr = document.querySelectorAll("canvas");
                rrr[rrr.length - 1].id = id;
                rrr[rrr.length - 1].style.zIndex = d.layer;
            }

            //freeMode是手動加入Layers, 宣告模式則是演繹時會自動加入
            if (!this.freeMode) this.Layers[d.layer].add(this.node);

            //如果該物件沒有tween 需要draw來呈現
            this.Layers[d.layer].draw();
        }

    }

    //創建Konva.Tween並設定setTimeout
    Tween(start, d) {
        //告知key演出時間
        if (this.preview) {
            this.deductiveTime = start + (d.duration || 1);
            if (this.deductiveTime < 0.58) this.deductiveTime = 0.58;
        }
        else {
            setTimeout(() => {

                d.node = this.node;

                //暫停計畫
                if (!this.tweensFreeze) {
                    this.tweens[this.tweens_idx] = new Konva.Tween(d);
                    this.tweens[this.tweens_idx].play();
                }
                this.tweens_idx++;

            }, start * 1000);
        }

    }



    // 動畫開始
    start() {

        // 所有演繹
        const elesDeductive = document.getElementsByClassName("deductive");

        // 建立時間軸
        this.rulerUI(elesDeductive);

        let runnerGOInterval, startTimerInterval;

        if (elesDeductive.length != 0) {

            // 啟動時間
            runnerGOInterval = setInterval(runnerGO, 10);
            startTimerInterval = setInterval(startTimer, 10);
        }

        // 跑者
        let distance = 0;

        function runnerGO() {
            if (!this.tweensFreeze) {

                distance += 1;
                document.getElementById("timeRunner").style.left = distance + "px";

                if (distance > (document.getElementsByClassName("sec-box").length * 100)) {

                    clearInterval(startTimerInterval);
                    clearInterval(runnerGOInterval);
                    if (typeof audio !== 'undefined') audio.pause();
                }
            }
        }

        //碼表
        let seconds = 0;
        let tens = 0;

        function startTimer() {
            if (!this.tweensFreeze) {
                tens++;

                if (tens > 99) {
                    tens = 0;
                    seconds++;
                    if (seconds <= 9) seconds = "0" + seconds;
                }
                
                if (tens <= 9) tens = "0" + tens;

                document.getElementById("stopwatch").textContent = `${seconds}:${tens}`;
            }
        }



    }





    // ============================================
    //         自家用
    // ============================================

    // 產生演繹標籤
    deductiveTag(startTime, layer) {
        //得知演繹內容後 依照內容 設定標籤樣式
        let event = document.createElement('div');
        event.textContent = layer + ":" + this.deductiveName;
        event.classList.add("deductive");
        event.style.width = (this.deductiveTime * 100) + 'px';
        event.style.left = (parseFloat(startTime[1]) * 100) + 'px';
        event.style.backgroundColor = this.deductiveColor;

        //將標籤餵到object中 DOM準備好後在加到時間軸中
        document.getElementById("deductiveBox").appendChild(event);
    }


    rulerUI(elesDeductive) {
        const allDeduH = elesDeductive.length * 17;
        //根據最後演繹的時間設定timeLine長度
        for (let i = 0; i < Math.ceil(this.deductiveTimeMax); i++) {

            //秒(span)
            const secSpan = document.createElement('span');
            secSpan.textContent = i;
            secSpan.style.marginTop = allDeduH + "px";

            //刻度(div)
            const secBox = document.createElement('div');
            secBox.classList.add("sec-box");
            secBox.classList.add("s" + i);
            // secBox.style.top = -allDeduH + "px";
            secBox.style.height = allDeduH + "px";

            secBox.appendChild(secSpan);
            document.getElementById("ruler").appendChild(secBox);
        }
    }





}



(function () {

    //創建HTML Audio
    function music(d) {

        audio = new Audio(d.src);
        if (typeof d.volume !== 'undefined') audio.volume = d.volume;
        if (typeof d.currentTime !== 'undefined') audio.currentTime = d.currentTime;
        audio.onloadeddata = function () {
            audio.play();
        };
    }

    //dat.GUI
    function gui(c) {
        if (!preview) {

            function Pos() { };
            const pos = new Pos();
            const GUI = new dat.GUI();

            //x, y要特地用class裝起來 不然not work
            if (typeof c.attrs.x !== 'undefined') {
                pos.x = c.attrs.x;
                GUI.add(pos, 'x').onChange(() => {
                    doo(c.x(pos.x));
                });
            }
            if (typeof c.attrs.y !== 'undefined') {
                pos.y = c.attrs.y;
                GUI.add(pos, 'y').onChange(() => {
                    doo(c.y(pos.y));
                });
            }

            //雜魚屬性
            if (typeof c.attrs.width !== 'undefined')
                GUI.add(c.attrs, 'width').onChange(() => { doo(c.width(c.attrs.width)) });
            if (typeof c.attrs.height !== 'undefined')
                GUI.add(c.attrs, 'height').onChange(() => { doo(c.height(c.attrs.height)) });
            if (typeof c.attrs.fill !== 'undefined')
                GUI.addColor(c.attrs, 'fill').onChange(() => { doo(c.fill(c.attrs.fill)) });

            function doo(callback) {
                callback;
                Layers[c.attrs.layer].draw();
            }

        }
    }

})();

