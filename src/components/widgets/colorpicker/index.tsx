import { debounce } from "lodash";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import styled from "styled-components";
import useDropdown from "../../../hooks/useDropdown";

const ColorPickerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: white;
    z-index: 2;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
`;

const HexPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 5px;
`;

const InputLabel = styled.span`
  font-size: 14px;
`;

const RgbValuesContainer = styled.div`
  width: 200px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 5px;
`;

const HexInput = styled(HexColorInput)`
    font-size: 12px;
    padding: 2px;
    width: 100%;
    display: block;   
    
    background-color: transparent;
    color: #414042;
    border: 1px #f4f4f4 solid;
    font-family: "Montserrat",sans-serif;
    outline:none;
    resize: none;

    &:hover{
        border: 1px black solid;
    }

    &:focus{
        border: 1px black solid;
        outline:none;
    }
`;

const RgbInput = styled.input`
    font-size: 12px;
    padding: 2px;
    width: 100%;
    display: block;
    text-align: center;
    
    background-color: transparent;
    color: #414042;
    border: 1px #f4f4f4 solid;
    font-family: "Montserrat",sans-serif;
    outline:none;
    resize: none;

    &:hover{
        border: 1px black solid;
    }

    &:focus{
        border: 1px black solid;
        outline:none;
    }
`;

const hexToRgb = (hex: string) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

const componentToHex = (c: number) => {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

const rgbToHex = (rgbColor: { r: number, g: number, b: number }) => {
    return "#" + componentToHex(rgbColor.r) + componentToHex(rgbColor.g) + componentToHex(rgbColor.b);
}

const valueToColor = (value: string) => {
    let color = parseInt(value, 10);

    if (isNaN(color))
        color = 0;

    if (color < 0)
        color = 0;

    if (color > 255)
        color = 255;

    return color;
}

const clampValue = (value: string) => {
    let color = parseInt(value, 10);

    if (!isNaN(color) && color < 0)
        return '0';

    if (!isNaN(color) && color > 255)
        return '255';

    return value;
}

const ColorPickerDropdown: FC<{ color: string, onChange: (color: string) => void }> = ({ color, onChange }) => {

    const [preventChange, setPreventChange] = useState(true); // Default true to avoid triggering onChange on mount

    const [r, setR] = useState(hexToRgb(color ?? "#000000").r.toString());
    const [g, setG] = useState(hexToRgb(color ?? "#000000").g.toString());
    const [b, setB] = useState(hexToRgb(color ?? "#000000").b.toString());


    useEffect(() => {
        setPreventChange(false);
    }, []);

    useEffect(() => {
        if (!preventChange) {
            console.log('rgb changed');

            const rbgNewColor = {
                r: valueToColor(r),
                g: valueToColor(g),
                b: valueToColor(b),
            };

            triggerColorChange(rbgNewColor);
        }

        // If the color changed 'color' change, reset the prevent change
        setPreventChange(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [r, g, b]);

    useEffect(() => {
        if (preventChange)
            return;

        // When the color change, update the rgb values but don't trigger again the change to avoid loop
        if (color && color.length === 7) {
            setPreventChange(true);
            setR(hexToRgb(color).r.toString());
            setG(hexToRgb(color).g.toString());
            setB(hexToRgb(color).b.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleColorChange = useCallback(
        debounce((color: string) => {
            triggerColorChange(color);
        }, 100),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const triggerColorChange = (color: string | { r: number; g: number; b: number }) => {
        if (typeof color === "object") {
            onChange(rgbToHex(color));
        } else {
            onChange(color);
        }
    };

    return <ColorPickerContainer>
        <HexPickerContainer>
            <HexColorPicker color={color ?? "#000000"} onChange={handleColorChange} />

            <InputContainer>
                <InputLabel>HEX</InputLabel>
                <HexInput color={color ?? "#000000"} prefixed onChange={handleColorChange} />
            </InputContainer>

            <RgbValuesContainer>
                <InputContainer>
                    <InputLabel>R</InputLabel>
                    <RgbInput
                        type={"number"}
                        value={r}
                        min={0}
                        max={255}
                        onChange={(e) => {
                            setR(clampValue(e.currentTarget.value));
                        }}
                    />
                </InputContainer>
                <InputContainer>
                    <InputLabel>G</InputLabel>
                    <RgbInput
                        type={"number"}
                        value={g}
                        maxLength={3}
                        onChange={(e) => {
                            setG(clampValue(e.currentTarget.value));
                        }}
                    />
                </InputContainer>
                <InputContainer>
                    <InputLabel>B</InputLabel>
                    <RgbInput
                        type={"number"}
                        value={b}
                        maxLength={3}
                        onChange={(e) => {
                            setB(clampValue(e.currentTarget.value));
                        }}
                    />
                </InputContainer>
            </RgbValuesContainer>
        </HexPickerContainer >
    </ColorPickerContainer>
}

interface ColorPickerProps {
    color: string,
    onChange: (color: string) => void
}

const ColorContainer = styled.div<{ color: string }>`
    width: 100%;
    height: 40px;
    border: 1px solid #DDD;
    background-color: ${props => props.color};
    cursor: pointer;

    @media(hover) {
        &:hover {
            opacity: 0.7;
        }
    }
`;

const ColorPicker: FC<ColorPickerProps> = ({ color, onChange }) => {
    const [open, , isOpened, Dropdown] = useDropdown();
    const ref = useRef<HTMLDivElement>(null);

    return <>
        <ColorContainer
            ref={ref}
            color={color}
            onClick={() => open(ref.current!, 'bottom', 'right')}
        />

        {isOpened && <Dropdown>
            <ColorPickerDropdown color={color} onChange={onChange} />
        </Dropdown>}
    </>;
}

export default ColorPicker;