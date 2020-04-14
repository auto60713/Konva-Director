const view = stage({
    container: 'container',
    width: 800,
    height: 600,
    borderColor: '#E8E8E8',
    borderStyle: "solid",
    borderWidth: 1,
    margin: '10px',
    backgroundColor: '#414141'
});

const vw = view.getWidth();
const vh = view.getHeight();

layers({
    amount: 2
})








key('0:0', {class: 'Rect'}, function(c){

    gui(c);
    init({
        node: c,
        deductiveName: '布條',
        layer: 1,

        x: vw/2,
        y: vh/2,
        width: 50,
        height: 50,
        fill: '#FFF022',
    });




});