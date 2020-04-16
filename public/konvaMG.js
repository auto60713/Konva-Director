var KonvaMG = {

    Stage: class {

        constructor(attrs, callback) {

            // 基本參數
            this.tweens = [];
            this.pause = false;
            this.Layers = [];
            this.audio = null;

            // 最後演藝完成時間
            this.lastDeductiveTime = 0;

            this.UI = true;

            // 特殊參數
            this.script = callback;
            this.Stage = new Konva.Stage(attrs);

            this.buildUI();
            this.script(this);
            this.runTimeLine();
        }

        // 建立介面
        buildUI() {

            if (!this.UI) return;

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

        // 點擊事件
        clickEvent() {
            //播放控制
            document.getElementById('play').addEventListener('click', function () {

                for (let i = 0; i < tweens.length; i++)
                    tweens[i].play();
                this.pause = false;
                if (audio != null) audio.play();

            }, false);

            document.getElementById('pause').addEventListener('click', function () {

                for (let i = 0; i < tweens.length; i++)
                    tweens[i].pause();
                this.pause = true;
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
        At({ time, shapes, layer, label }, attrs) {

            // 物件加入時間
            let startTime = time.split(":");
            let startSec = parseInt(startTime[0] * 60) + parseFloat(startTime[1]);

            this.deductiveStart = startSec;

            const node = new Konva[shapes](attrs);
            this.node = node;

            if (this.UI) {
                // 建立演繹標籤
                this.deductiveTag({
                    id: node._id,
                    layer: layer || 1,
                    label: label || "--",
                    color: attrs.fill || "#5B5B5B",
                    start: startSec,
                    time: 0.1
                });
            }

            setTimeout(() => {

                // 如果沒有第i圖層
                const id = "layer" + layer;

                if (!document.querySelector("#" + id)) {

                    this.Layers[layer] = new Konva.Layer();

                    this.Stage.add(this.Layers[layer]);

                    const canvas = document.querySelectorAll("canvas");
                    canvas[canvas.length - 1].id = id;
                    canvas[canvas.length - 1].style.zIndex = layer;
                }

                this.Layers[layer].add(node);
                this.Layers[layer].draw();

            }, startSec * 1000);

            return this;
        }

        // 物件動畫
        Tween(time, attrs) {

            // 動畫在物件加入之後的等待時間
            let startTime = time.split(":");
            let startSec = parseInt(startTime[0] * 60) + parseFloat(startTime[1]);

            // 動畫開始時間
            const tweenTime = this.deductiveStart + startSec;

            // 動畫演藝時間
            const deductiveTime = startSec + attrs.duration;

            // 更新最後演藝時間
            const lastTime = this.deductiveStart + deductiveTime;
            if (lastTime > this.lastDeductiveTime) this.lastDeductiveTime = lastTime;

            const node = this.node;

            if (this.UI) {
                // 建立演繹標籤
                this.deductiveTag({ id: node._id, time: deductiveTime });
            }

            setTimeout(() => {

                attrs.node = node;

                const tween = new Konva.Tween(attrs);
                tween.play();

            }, tweenTime * 1000);

            return this;
        }

        // 產生演繹標籤
        deductiveTag({ id, layer, label, color, start, time }) {
            const tagId = `d-${id}`;

            // 由Tween更新長度
            if (document.getElementsByClassName(tagId)[0]) {

                document.getElementsByClassName(tagId)[0].style.width = (time * 100) + 'px';
            }
            // 由At創立
            else {
                let tag = document.createElement('div');

                tag.textContent = `${layer}:${label}`;
                tag.style.left = (parseFloat(start) * 100) + 'px';
                tag.style.width = (time * 100) + 'px';
                tag.style.backgroundColor = color;
                tag.classList.add("deductive");
                tag.classList.add(tagId);

                document.getElementById("deductiveBox").appendChild(tag);
            }
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

        // 時間軸驅動
        runTimeLine() {
            const self = this;

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
                if (self.pause) return;

                distance += 1;
                document.getElementById("timeRunner").style.left = distance + "px";

                if (distance > (document.getElementsByClassName("sec-box").length * 100)) {

                    clearInterval(startTimerInterval);
                    clearInterval(runnerGOInterval);
                    if (typeof audio !== 'undefined') audio.pause();
                }
            }

            //碼表
            let seconds = 0;
            let tens = 0;

            function startTimer() {
                if (self.pause) return;

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

