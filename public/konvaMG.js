
var Timer = function (callback, delay) {
    var timerId, start, remaining = delay;

    this.pause = function () {
        window.clearTimeout(timerId);
        remaining -= Date.now() - start;
    };

    this.resume = function () {
        start = Date.now();
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
};



var KonvaMG = {

    Build: class {

        constructor({ Setting: { speed, UI, startTime }, Music, Stage, Script }) {

            // 設定參數
            this.speed = speed || 1;

            let startTime2 = typeof startTime !== 'undefined' ? startTime.split(":") : ["0", "0"];
            let startSec = parseInt(startTime2[0] * 60) + parseFloat(startTime2[1]);

            this.startTime = startSec || 0;
            this.UI = typeof UI !== 'undefined' ? UI : true;

            // 內用變數
            this.tweens = [];
            this.pause = false;
            this.Layers = [];
            this.timeoutList = [];
            this.audio = null;
            this.plated = false;
            this.pause = false;

            // 最後演藝完成時間
            this.lastDeductiveTime = 0;

            // 特殊參數
            this.script = Script;
            this.Stage = new Konva.Stage(Stage);

            // 流程
            this.buildUI();
            this.clickEvent(Music);

        }

        gui(node, label) {
            const self = this;
            if (this.GUI) this.GUI.destroy();

            // setTimeout(() => {
            self.GUI = new dat.GUI();
            const aaaa = Object.assign({ label }, node.attrs);

            // aaaa.label = label;

            Object.keys(aaaa).forEach(key => {
                let mode = "add";

                if (["fill", "shadowColor"].includes(key)) {
                    mode = "addColor";
                }

                self.GUI[mode](aaaa, key).onChange(() => {
                    node[key](aaaa[key]);
                    node.parent.draw();
                });

            });
            // }, 10);




        }

        //創建HTML Audio
        music(d) {

            const audio = new Audio(d.src)

            this.audio = audio;
            if (typeof d.volume !== 'undefined') audio.volume = d.volume;
            if (typeof d.currentTime !== 'undefined') audio.currentTime = d.currentTime + this.startTime;
            // audio.onloadeddata = function () {
            audio.play();
            // };
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

            ruler.appendChild(stopwatch);

            // 加入控制鍵
            const ctrlButton = document.createElement('div');
            ctrlButton.style.cssText = "margin-left: 10px";

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

        }

        // 點擊事件
        clickEvent(Music) {
            const self = this;

            //播放控制
            document.getElementById('play').addEventListener('click', function () {

                self.pause = false;

                for (let i = 0; i < self.timeoutList.length; i++)
                    self.timeoutList[i].resume();

                for (let i = 0; i < self.tweens.length; i++)
                    self.tweens[i].play();

                if (typeof self.audio !== 'undefined' && self.audio !== null) self.audio.paky();

            }, false);

            document.getElementById('pause').addEventListener('click', function () {

                self.pause = true;

                for (let i = 0; i < self.timeoutList.length; i++)
                    self.timeoutList[i].pause();

                for (let i = 0; i < self.tweens.length; i++)
                    self.tweens[i].pause();

                if (typeof self.audio !== 'undefined' && self.audio !== null) self.audio.pause();

            }, false);

            if (Music) {
                //點擊畫布 顯示時間與滑鼠位置
                document.getElementById('container').addEventListener('click', function (event) {

                    if (!self.plated) {
                        self.music(Music);
                        self.script(self);
                        self.runTimeLine();

                        self.plated = true;
                    }

                    // const coords = "CurX: " + event.clientX + ", CurY: " + event.clientY;
                    // const cueMessage = document.createElement('div');
                    // cueMessage.textContent = seconds + "." + tens + "s, " + coords;
                    // document.body.appendChild(cueMessage);

                }, false);
            }
            else {
                self.script(self);
                self.runTimeLine();
            }


        }

        // 加入物件
        At({ time, shapes, layer, label }, attrs) {
            const self = this;
            // 物件加入時間
            let startTime = time.split(":");
            let startSec = parseInt(startTime[0] * 60) + parseFloat(startTime[1]);

            const bbb = (startSec - this.startTime) / this.speed;

            this.deductiveStart = startSec;

            const node = new Konva[shapes](attrs);

            node.on('click', function () {
                self.gui(node, label);
            });


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


            this.timeoutList.push(
                new Timer(() => {

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

                }, bbb * 1000)
            );


            return this;
        }

        // 物件動畫
        Tween(time, attrs) {

            const self = this;
            let aaa = "";

            // 動畫在物件加入之後的等待時間
            let startTime = time.split(":");
            let startSec = parseInt(startTime[0] * 60) + parseFloat(startTime[1]);

            // 動畫開始時間
            const tweenStartTime = this.deductiveStart + startSec;

            const bb = (tweenStartTime - this.startTime) / this.speed;

            // 物件存在時間
            const deductiveTime = startSec + attrs.duration;

            // 更新最後演藝時間
            const lastTime = this.deductiveStart + deductiveTime;
            if (lastTime > this.lastDeductiveTime) this.lastDeductiveTime = lastTime;

            // 如果開始時間已經超越演完時間
            if (this.startTime >= tweenStartTime + attrs.duration) {
                aaa = ["finish", 0];
            }
            // 如果開始時間介於開演與演完之間
            else if (this.startTime >= tweenStartTime && attrs.duration > this.startTime - tweenStartTime) {
                aaa = ["seek", this.startTime - tweenStartTime];
            }
            attrs.duration = attrs.duration / this.speed;

            const node = this.node;

            if (this.UI) {
                // 建立演繹標籤
                this.deductiveTag({ id: node._id, time: deductiveTime });
            }

            this.timeoutList.push(
                new Timer(() => {

                    attrs.node = node;

                    const tween = new Konva.Tween(attrs);
                    self.tweens.push(tween);

                    if (aaa !== "") {
                        tween[aaa[0]](aaa[1])
                    }
                    tween.play();


                }, bb * 1000)
            )


            return this;
        }

        // 產生演繹標籤
        deductiveTag({ id, layer, label, color, start, time }) {
            const tagId = `d-${id}`;

            // 由Tween更新長度
            if (document.getElementsByClassName(tagId)[0]) {

                document.getElementsByClassName(tagId)[0].style.width = (time * 100) - 1 + 'px';
            }
            // 由At創立
            else {
                let tag = document.createElement('div');

                tag.textContent = `${layer}:${label}`;
                tag.style.left = (parseFloat(start) * 100) + 'px';
                tag.style.width = (time * 100) - 1 + 'px';
                tag.style.backgroundColor = color;
                // tag.style.backgroundColor = "#7acfff";
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
                // secBox.style.height = allDeduH - 2 + "px";

                secBox.appendChild(secSpan);
                document.getElementById("ruler").style.height = allDeduH - 2 + "px";
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
            let distance = this.startTime * 100;

            function runnerGO() {
                if (self.pause) return;

                distance += self.speed;
                document.getElementById("timeRunner").style.left = distance + "px";

                if (
                    distance > (document.getElementsByClassName("sec-box").length * 100) ||
                    distance > self.lastDeductiveTime * 100
                ) {

                    clearInterval(startTimerInterval);
                    clearInterval(runnerGOInterval);
                    if (typeof self.audio !== 'undefined' && self.audio !== null) self.audio.pause();
                }
            }

            //碼表

            let seconds = this.startTime <= 9 ? "0" + this.startTime : this.startTime;
            let tens = 0;

            function startTimer() {
                if (self.pause) return;

                tens = Math.floor(tens) + self.speed;

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
