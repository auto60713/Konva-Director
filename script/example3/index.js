new KonvaMG.Stage({ container: 'container', width: 800, height: 600 }, ThisStage => {

    const vw = ThisStage.Stage.getWidth();
    const vh = ThisStage.Stage.getHeight();

    ThisStage
        .at({ time: "00:00", add: "RegularPolygon", inLayer: 2 }, {
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
        .andTween({ after: "00:00" }, {
            duration: 4.5,
            easing: Konva.Easings.StrongEaseOut,
            radius: 140,
            rotation: 720
        })

    ThisStage
        .at({ time: "00:01.6", add: "Rect", inLayer: 1 }, {
            x: vw,
            y: vh / 2 - 45 - 10,
            width: 0,
            height: 90,
            fill: '#FCF9AA'
        })
        .andTween({ after: "00:00" }, {
            duration: 0.6,
            width: vw,
            x: 0
        })

    ThisStage
        .at({ time: "00:02", add: "Ring", inLayer: 0 }, {
            x: vw / 2,
            y: vh / 2,
            innerRadius: 0,
            outerRadius: 0,
            fill: '#8BCD96'
        })
        .andTween({ after: "00:00" }, {
            duration: 0.2,
            outerRadius: 180
        })
        .andTween({ after: "00:00.2" }, {
            duration: 0.2,
            innerRadius: 180
        })
        .andTween({ after: "00:00.4" }, {
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
        .at({ time: "00:03.6", add: "Rect", inLayer: 3 }, {
            fill: '#fff',
            x: -pos,
            y: pos,
            width: 0,
            height: size,
            rotation: -45
        })
        .andTween({ after: "00:00" }, {
            duration: 0.1,
            width: size
        })
        .andTween({ after: "00:00.13" }, {
            duration: 0.1,
            width: 0,
            x: -pos2,
            y: pos2
        })

    ThisStage
        .at({ time: "00:03.7", add: "Text", inLayer: 2 }, {
            X: vw / 2 - 128,
            y: vh / 2 - 92,
            text: 'OZEN',
            fontSize: 160,
            fontStyle: 'bold',
            fontFamily: 'Martin Amitrano',
            fill: '#414141'
        })

    ThisStage
        .at({ time: "00:04.5", add: "Wedge", inLayer: 0 }, {
            x: vw / 2,
            y: vh / 2,
            radius: 200,
            angle: 0,
            fill: '#AEFFBC',
            rotation: -45
        })
        .andTween({ after: "00:00" }, {
            duration: 0.2,
            angle: 360
        })
        .andTween({ after: "00:00.3" }, {
            duration: 0.5,
            angle: 0,
            rotation: -45 + 360
        })

})
