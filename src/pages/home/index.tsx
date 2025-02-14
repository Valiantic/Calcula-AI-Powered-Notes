import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { SWATCHES } from "../../pages/home/constants";
import { ColorSwatch, Group } from "@mantine/core";
import { Button } from "../../components/ui/button";
import axios from 'axios';

interface Response {
    expr: string;
    result: number;
    assign: boolean;
}

interface GenerateResult {
    expression: string;
    answer: string;
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setisDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255, 255, 255)');
    const [reset, setReset] = useState(false);
    const [result, setResult] = useState<GenerateResult>();
    const [dictOfVars, setDictOfVars] = useState({});

    useEffect(() => {
        if(reset) {
            resetCanvas();
            setReset(false);
        }
    }, [reset]);
    

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


    const sendData = async () => {
        const canvas = canvasRef.current;

        if(canvas){
            const response = await axios({

                method: 'post',
                url: `${import.meta.env.VITE_API_URL}/api/calculate`,
                data: {
                    image: canvas.toDataURL('image/png'),
                    dict_vars: dictOfVars,
                }

                });
                const resp = await response.data;
                console.log('Response: ', resp);
                // 17:52
        }
    };

    const resetCanvas = () => {

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

    }


    // initialize drawing of the user 
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.background = 'black';
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.strokeStyle = color; // Set the selected color
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
                ctx.strokeStyle = color; // Use the selected color
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    };


    return (
        <>
        <div className="grid grid-cols-3 gap-2">
            <Button 
            onClick={() => setReset(true)}
            className='z-20 bg-black text-white'
            variant='default'
            color='black'
            >
                Reset
            </Button>
            <Group className="z-20">
                {SWATCHES.map((swatchColor: string) => (
                    <ColorSwatch
                    key={swatchColor}
                    color={swatchColor}
                    onClick={() => setColor(swatchColor)}
                    style={{ cursor: 'pointer' }}
                    />
                ))}
            </Group>
            <Button 
            onClick={sendData}
            className='z-20 bg-black text-white'
            variant='default'
            color='black'
            >
                Calculate
            </Button>
        </div>
        <canvas 
        ref={canvasRef}
        id='canvas'
        className='absolute top-0 left-0 w-full h-full'
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        
        />
        </>
    );
}