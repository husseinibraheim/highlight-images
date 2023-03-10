import { useState, useEffect } from "react";

const EditImage = () => {
    const [images, setImages] = useState([])
    const [imageURL, setImageURL] = useState([])
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [startDragX, setStartDragX] = useState(0);
    const [startDragY, setStartDragY] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        if (images.length < 1) return
        const newImageURLS = []
        images.forEach(image => newImageURLS.push(URL.createObjectURL(image)))
        setImageURL(newImageURLS)

    }, [images]);

    function onImageChange(e) {
        setImages([...e.target.files])
    }
    function handleMouseDown(event) {
        event.preventDefault();
        setIsDragging(true);
        setStartX(event.clientX);
        setStartY(event.clientY);
        setStartDragX(event.clientX);
        setStartDragY(event.clientY);
        setWidth(0);
        setHeight(0);
    }
    function handleMouseMove(event) {
        event.preventDefault();
        if (isDragging) {
            const newWidth = event.clientX - startDragX;
            const newHeight = event.clientY - startDragY;

            const newX = newWidth < 0 ? startDragX + newWidth : startDragX;
            const newY = newHeight < 0 ? startDragY + newHeight : startDragY;

            const absWidth = Math.abs(newWidth);
            const absHeight = Math.abs(newHeight);

            setStartX(newX);
            setStartY(newY);
            setWidth(absWidth);
            setHeight(absHeight);
        }
    }

    function handleMouseUp(event) {
        event.preventDefault();
        const newArea = {
            x: startX,
            y: startY,
            width: width,
            height: height
        };
        setAreas([...areas, newArea]);
        setIsDragging(false);

    }

    return (<>
        <div style={{ position: "relative" }}>
            <img src={imageURL} alt="Image" />
            {isDragging && (
                <div
                    style={{
                        position: "absolute",
                        left: startX,
                        top: startY,
                        width: width,
                        height: height,
                        backgroundColor: "rgba(0, 0, 255, 0.3)",
                        border: "1px solid blue"
                    }}
                />
            )}
            {areas.map((area, index) => (
                <div
                    key={index}
                    className="selectable-area"
                    style={{
                        position: "absolute",
                        left: `${area.x}px`,
                        top: `${area.y}px`,
                        width: `${area.width}px`,
                        height: `${area.height}px`,
                        border: "2px solid red",
                        backgroundColor: "transparent",
                        pointerEvents: "none",
                        color: "red"
                    }}
                >area : {index + 1}</div>
            ))}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%"
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            />
        </div>
        <input type="file" accept="image/*" multiple onChange={onImageChange} />

        {areas.map((area, index) => (
            <>
                <p>area number : {index + 1}</p>
                <ul>
                    <li>x : {area.x}</li>
                    <li>y : {area.y}</li>
                    <li>width : {area.width}</li>
                    <li>height : {area.height}</li>

                </ul>
            </>
        ))}
    </>);
}

export default EditImage 