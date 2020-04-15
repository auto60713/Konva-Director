var KonvaMG = {

    Stage: class {

        constructor(attrs, callback) {

            // 基本參數
            this.tweens = [];
            this.tweens_idx = 0;
            this.tweensFreeze = false;

            this.Layers = [];
            this.audio = null;

            // 最後演藝完成時間
            this.lastDeductiveTime = 0;

            this.UI = true;
            this.UIfinish = false;

            // 特殊參數
            this.script = callback;
            this.Stage = new Konva.Stage(attrs);


            this.buildUI();
            this.script(this);
            this.runTimeLine();
        }

        // 建立介面
        buildUI() {

            if (this.UIfinish) return;

            if (this.UI) {

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

                // 點擊事件
                this.clickEvent();
            }

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

        // 加入物件
        at(data, attrs) {

            //開始時間
            let startTime = data.time.split(":");
            let startSec = parseInt(startTime[0] * 60) + parseFloat(startTime[1]);

            if (this.UI) {
                // 演藝開始時間
                this.deductiveStart = startSec;
                // 演藝名稱
                this.deductiveName = data.label || "--";
                console.log(data);
                // 演藝標籤顏色
                this.deductiveColor = attrs.fill || "#5B5B5B";
            }

            this.node = new Konva[data.add](attrs);
            this.layer = data.inLayer;

            setTimeout(() => {

                // 如果沒有第i圖層
                const id = "layer" + this.layer;

                if (!document.querySelector("#" + id)) {

                    this.Layers[this.layer] = new Konva.Layer();

                    this.Stage.add(this.Layers[this.layer]);

                    const canvas = document.querySelectorAll("canvas");
                    canvas[canvas.length - 1].id = id;
                    canvas[canvas.length - 1].style.zIndex = this.layer;
                }

                this.Layers[this.layer].add(this.node);
                this.Layers[this.layer].draw();

            }, startSec * 1000);


            return this;
        }

        // 物件動畫
        andTween(data, attrs) {

            //開始時間
            let startTime = data.after.split(":");
            let startSec = parseInt(startTime[0] * 60) + parseFloat(startTime[1]);

            if (this.UI) {
                // 演藝時間
                this.deductiveTime = startSec + attrs.duration;

                // 建立演繹標籤
                this.deductiveTag();

                const lastTime = this.deductiveStart + this.deductiveTime;
                // 更新最後演藝時間
                if (lastTime > this.lastDeductiveTime) this.lastDeductiveTime = lastTime;
            }

            setTimeout(() => {

                attrs.node = this.node;

                //暫停計畫
                if (!this.tweensFreeze) {
                    this.tweens[this.tweens_idx] = new Konva.Tween(attrs);
                    this.tweens[this.tweens_idx].play();
                }
                this.tweens_idx++;

            }, startSec * 1000);

            return this;
        }

        // 時間軸驅動
        runTimeLine() {

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

        // 產生演繹標籤
        deductiveTag() {
            let tag = document.createElement('div');

            tag.textContent = `${this.layer}:${this.deductiveName}`;
            tag.style.left = (parseFloat(this.deductiveStart) * 100) + 'px';
            tag.style.width = (this.deductiveTime * 100) + 'px';
            tag.style.backgroundColor = this.deductiveColor;
            tag.classList.add("deductive");

            document.getElementById("deductiveBox").appendChild(tag);
        }

        // 畫尺規
        rulerUI(elesDeductive) {

            const allDeduH = elesDeductive.length * 17;

            //根據最後演繹的時間設定timeLine長度
            for (let i = 0; i < Math.ceil(this.lastDeductiveTime); i++) {

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

}


    // (function () {

    //     //創建HTML Audio
    //     function music(d) {

    //         audio = new Audio(d.src);
    //         if (typeof d.volume !== 'undefined') audio.volume = d.volume;
    //         if (typeof d.currentTime !== 'undefined') audio.currentTime = d.currentTime;
    //         audio.onloadeddata = function () {
    //             audio.play();
    //         };
    //     }

    //     //dat.GUI
    //     function gui(c) {
    //         if (!preview) {

    //             function Pos() { };
    //             const pos = new Pos();
    //             const GUI = new dat.GUI();

    //             //x, y要特地用class裝起來 不然not work
    //             if (typeof c.attrs.x !== 'undefined') {
    //                 pos.x = c.attrs.x;
    //                 GUI.add(pos, 'x').onChange(() => {
    //                     doo(c.x(pos.x));
    //                 });
    //             }
    //             if (typeof c.attrs.y !== 'undefined') {
    //                 pos.y = c.attrs.y;
    //                 GUI.add(pos, 'y').onChange(() => {
    //                     doo(c.y(pos.y));
    //                 });
    //             }

    //             //雜魚屬性
    //             if (typeof c.attrs.width !== 'undefined')
    //                 GUI.add(c.attrs, 'width').onChange(() => { doo(c.width(c.attrs.width)) });
    //             if (typeof c.attrs.height !== 'undefined')
    //                 GUI.add(c.attrs, 'height').onChange(() => { doo(c.height(c.attrs.height)) });
    //             if (typeof c.attrs.fill !== 'undefined')
    //                 GUI.addColor(c.attrs, 'fill').onChange(() => { doo(c.fill(c.attrs.fill)) });

    //             function doo(callback) {
    //                 callback;
    //                 Layers[c.attrs.layer].draw();
    //             }

    //         }
    //     }

    // })();

