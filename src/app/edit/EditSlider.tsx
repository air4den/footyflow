import { Slider } from "radix-ui";

interface EditSliderProps {
	value: number;
	setValue: (value: number) => void;
	max: number;
	min: number;
	step: number;
	defaultValue: number;
}

const EditSlider = ({ value, setValue, max, min, step, defaultValue }: EditSliderProps) => {

	return (
		<Slider.Root
			className="relative flex h-5 w-[200px] touch-none select-none items-center"
			defaultValue={[defaultValue]}
			value={[value]}
          	onValueChange={(value) => setValue(value[0])}
			max={max}
			min={min}
			step={step}
		>
			<Slider.Track className="relative h-[3px] grow rounded-full bg-black shadow-md">
				<Slider.Range className="absolute h-full rounded-full bg-strorange" />
			</Slider.Track>
			<Slider.Thumb
				className="block w-5 h-5 rounded-full bg-strorange shadow-lg hover:bg-orange-700 focus:outline-none"
				aria-label="Rotation"
			/>
		</Slider.Root>
	
	)
};

export default EditSlider;