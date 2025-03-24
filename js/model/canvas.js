define([], function () {

    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight - 70;
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const Canvas = {
        // functions
        canvas,
        context,
        contextCanvasWidth: context.canvas.width,
        contextCanvasHeight: context.canvas.height,
        canvasWidth,
        canvasHeight
    };

    return Canvas;
});