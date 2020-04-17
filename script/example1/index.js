new KonvaMG.Build({
    Setting: {
        // UI: false,
        speed: 2,
        // startTime: "00:03"
    },
    // Music: {
    //     src: 'script/example1/かめりあ - Singularity.mp3',
    //     volume: 0.1,
    //     currentTime: 27.7
    // },
    Stage: {
        container: 'container',
        width: 800,
        height: 600
    },
    Script: ThisStage => {

        const vw = ThisStage.Stage.getWidth();
        const vh = ThisStage.Stage.getHeight();

        ThisStage
            .At({ time: "00:00", shapes: "RegularPolygon", layer: 2, label: "三角形" }, {
                x: vw / 2,
                y: vh / 2,
                sides: 3,
                radius: 0,
                fill: '#7AB383',
                rotation: -180,
                shadowColor: 'black',
                shadowOffset: {
                    x: 0,
                    y: 0
                }
            })
            .Tween("00:00", {
                duration: 4.5,
                easing: Konva.Easings.StrongEaseOut,
                radius: 140,
                rotation: 720
            })

        ThisStage
            .At({ time: "00:01.6", shapes: "Rect", layer: 1, label: "布條" }, {
                x: vw,
                y: vh / 2 - 45 - 10,
                width: 0,
                height: 90,
                fill: '#FCF9AA'
            })
            .Tween("00:00", {
                duration: 0.6,
                easing: Konva.Easings.StrongEaseOut,
                width: vw,
                x: 0
            })

        ThisStage
            .At({ time: "00:02", shapes: "Ring", layer: 0, label: "光環" }, {
                x: vw / 2,
                y: vh / 2,
                innerRadius: 0,
                outerRadius: 0,
                fill: '#8BCD96'
            })
            .Tween("00:00", {
                duration: 0.2,
                outerRadius: 180
            })
            .Tween("00:00.2", {
                duration: 0.2,
                innerRadius: 180
            })
            .Tween("00:00.4", {
                duration: 5.6,
                fill: '#AEFFBC',
                easing: Konva.Easings.Linear,
                innerRadius: 219,
                outerRadius: 220
            })

        const pos = 300;
        const pos2 = -400;
        const size = 1000;

        ThisStage
            .At({ time: "00:03.6", shapes: "Rect", layer: 3, label: "閃光" }, {
                fill: '#fff',
                x: -pos,
                y: pos,
                width: 0,
                height: size,
                rotation: -45
            })
            .Tween("00:00", {
                duration: 0.1,
                width: size
            })
            .Tween("00:00.13", {
                duration: 0.1,
                width: 0,
                x: -pos2,
                y: pos2
            })

        ThisStage
            .At({ time: "00:03.7", shapes: "Text", layer: 2, label: "文字" }, {
                X: vw / 2 - 128,
                y: vh / 2 - 98,
                text: 'OZEN',
                fontSize: 160,
                fontStyle: 'bold',
                fontFamily: 'Martin Amitrano',
                fill: '#414141'
            })

        ThisStage
            .At({ time: "00:04.5", shapes: "Wedge", layer: 0, label: "圓餅圖" }, {
                x: vw / 2,
                y: vh / 2,
                radius: 198,
                angle: 0,
                fill: '#AEFFBC',
                rotation: -45
            })
            .Tween("00:00", {
                duration: 0.2,
                angle: 360
            })
            .Tween("00:00.3", {
                duration: 0.5,
                angle: 0,
                rotation: -45 + 360
            })

    }
})
