import { useField, FieldHookConfig } from "formik";
import React from "react";
import clsxm from "../../lib/clsxm";
import TextField from "@mui/material/TextField";

export default function TextInput({ label, ...props }) {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);

  return (
    <>
      {/* 
      <FormTooltip className="w-full" message={meta.error} show={Boolean(meta.touched && meta.error)}
      **/}
      <TextField
        className={clsxm("input input-bordered rounded-md w-full", {
          "input-error": meta.touched && meta.error,
        })}
        {...field}
        {...props}
        label={label}
        error={Boolean(meta.error && meta.touched)}
        helperText={meta.touched ? meta.error : ""}
        InputLabelProps={{ shrink: true, style: { fontSize: 13 } }}
        InputProps={{ style: { fontSize: 12 } }}
      />

      {/*</FormTooltip>*/}
    </>
  );
}
