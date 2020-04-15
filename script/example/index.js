
// 動畫基本資訊


// const anime = new KonvaMG({


// });


    // const view = stage({
    //     container: 'container',
    //     width: 800,
    //     height: 600,
    //     borderColor: '#E8E8E8',
    //     borderStyle: "solid",
    //     borderWidth: 1,

    //     backgroundColor: '#414141'
    // });

    var view = new Konva.Stage({
        container: 'container',
        width: 800,
        height: 600
    });


    const vw = view.getWidth();
    const vh = view.getHeight();

    music({
        src: 'script/example/かめりあ - Singularity.mp3',
        volume: 0.1,
        currentTime: 31.4 -3.7
    });

    // layers({
    //     amount: 6
    // })

    // 開始時間, 形狀
    key('0:0', {class: 'RegularPolygon'}, function(c){

        init({
            node: c,
            // 標籤
            deductiveName: '三角形',
            // 圖層
            layer: 2,

            x: vw / 2,
            y: vh / 2,
            sides: 3,
            radius: 0,
            fill: '#7AB383',
            rotation: -180,
            shadowColor : 'black',
            shadowOffset : {
                x : 0,
                y : 0
            }
        },view);
        tween({
            node: c,
            start: 0,
            duration: 4.5,
            easing: 'StrongEaseOut',

            radius: 140,
            rotation: 720
        });
    });
    


    key('0:1.6', {class: 'Rect'}, function(c){

        init({
            node: c,
            deductiveName: '布條',
            layer: 1,

            x: vw,
            y: vh / 2 - 45 -10,
            width: 0,
            height: 90,
            fill: '#FCF9AA',
        },view);
        tween({
            node: c,
            start: 0,
            duration: 0.6,

            width: vw,
            x: 0
        });
    });

    key('0:2', {class: 'Ring'}, function(c){

        init({
            node: c,
            deductiveName: '環',
            layer: 0,

            x: vw / 2,
            y: vh / 2,
            innerRadius: 0,
            outerRadius: 0,
            fill: '#8BCD96',
        },view);
        tween({
            node: c,
            start: 0,
            duration: 0.2,
        
            outerRadius: 180,
        });
        tween({
            node: c,
            start: 0.2,
            duration: 0.2,

            innerRadius: 180,
        });
        tween({
            node: c,
            start: 0.4,
            fill: '#AEFFBC',
        
            duration: 5.6,
            easing: Konva.Easings['Linear'],
            innerRadius: 219,
            outerRadius: 220,
        });
    });

    key('0:3.6', {class: 'Rect'}, function(c){

        const pos = 300;
        const pos2 = -400;
        const size = 1000;
        init({
            node: c,
            deductiveName: '閃光',
            layer: 3,

            fill: '#fff',
            x: -pos,
            y: pos,
            width: 0,
            height: size,
            rotation: -45,
        },view);
        tween({
            node: c,
            start: 0,
            duration: 0.1,

            width: size,
        });
        tween({
            node: c,
            start: 0.13,
            duration: 0.1,

            width: 0,
            x: -pos2,
            y: pos2,
        });
    });

    key('0:3.7', {class: 'Text'}, function(c){

        init({
            node: c,
            deductiveName: '字',
            layer: 2,

            X: vw / 2 -128,
            y: vh / 2 -92,
            text: 'OZEN',
            fontSize: 160,
            fontStyle: 'bold',
            fontFamily: 'Martin Amitrano',
            fill: '#414141',
        },view);
    });

    key('0:4.5', {class: 'Wedge'}, function(c){

        init({
            node: c,
            deductiveName: '圓餅圖',
            layer: 0,

            x: vw / 2,
            y: vh / 2,
            radius: 200,
            angle: 0,
            fill: '#AEFFBC',
            rotation: -45
        },view);
        tween({
            node: c,
            start: 0,
            duration: 0.2,

            angle: 360,
        });
        tween({
            node: c,
            start: 0.3,
            duration: 0.5,

            angle: 0,
            rotation: -45 + 360
        });
    });
