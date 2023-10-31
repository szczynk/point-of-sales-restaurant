import { func, number, oneOfType, string } from "prop-types";
import { useEffect, useState } from "react";

function DebouncedInput(props) {
  const { value: initialValue, onChange, debounce = 500, ...rest } = props;

  const [value, setValue] = useState(initialValue);

  const handleOnChange = (event) => setValue(event.target.value);

  // klo prop initialValue berubah, maka update initialValue ybaru
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // jika kita ketik / ubah di input [dengan onChange={handleOnChange}].
  // maka akan mentrigger useEffect ini, menunggu sekitar 500ms (waktu`debounce`)
  // sebelum menjalankan fungsi `onChange`
  //
  // jika kita ketik / ubah di input lagi,maka fungsi `onChange` akan dibatalkan [dengan clearTimeout()]
  // dan kembali menunggu
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return <input {...rest} value={value} onChange={handleOnChange} />;
}

DebouncedInput.propTypes = {
  value: oneOfType([string, number]),
  onChange: func,
  debounce: number,
};

export default DebouncedInput;
