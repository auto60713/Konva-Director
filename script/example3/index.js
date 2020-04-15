
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
        .at({ time: "00:1.6", add: "Rect", inLayer: 1 }, {
            x: vw,
            y: vh / 2 - 45 - 10,
            width: 0,
            height: 90,
            fill: '#FCF9AA',
        })
        .andTween({ after: "00:00" }, {
            duration: 0.6,
            width: vw,
            x: 0
        })

    ThisStage
        .at({ time: "00:2", add: "Ring", inLayer: 0 }, {
            x: vw / 2,
            y: vh / 2,
            innerRadius: 0,
            outerRadius: 0,
            fill: '#8BCD96',
        })
        .andTween({ after: "00:00" }, {
            duration: 0.2,
            outerRadius: 180,
        })
        .andTween({ after: "00:0.2" }, {
            duration: 0.2,
            innerRadius: 180,
        })
        .andTween({ after: "00:0.4" }, {
            fill: '#AEFFBC',
            duration: 5.6,
            easing: Konva.Easings['Linear'],
            innerRadius: 219,
            outerRadius: 220,
        })



})
