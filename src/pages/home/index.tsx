import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setisDrawing] = useState(false);

    // useeffect to initialize the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
           const ctx = canvas.getContext('2d');
           if (ctx) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - canvas.offsetTop;
            ctx.lineCap = 'round';
            ctx.lineWidth = 3;
           }
        }
    }, []);


    // initialize drawing of the user 
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        // initialize the canvas
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.background = 'black';
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                setisDrawing(true);
            }
    }
}
    // initialize the drawing of the user
    const stopDrawing = () => {
        setisDrawing(false);
    }

    // drawing method 
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if(!isDrawing){
            return;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = 'white';
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    };


    return (
        <canvas 
         ref={canvasRef}
         id='canvas'
         className='absolute top-0 left-0 w-full h-full'
         onMouseDown={startDrawing}
         onMouseOut={stopDrawing}
         onMouseUp={stopDrawing}
        
        />
    );
}