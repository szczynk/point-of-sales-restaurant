import { useEffect, useState } from "react";

function DebouncedInput(props) {
  const { value: initialValue, onChange, debounce = 500, ...rest } = props;

  const [value, setValue] = useState(initialValue);

  const handleOnChange = (event) => setValue(event.target.value);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return <input {...rest} value={value} onChange={handleOnChange} />;
}

export default DebouncedInput;
