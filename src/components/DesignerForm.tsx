import React from "react";
import { Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "../app/store";

const schema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 chars").max(80),
  workingHours: z.coerce.number().min(1, "Min 1").max(24, "Max 24"),
});

type FormValues = z.infer<typeof schema>;

export default function DesignerForm({ onDone }: { onDone: () => void }) {
  const addDesigner = useAppStore((s) => s.addDesigner);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", workingHours: 8 },
  });

  const onSubmit = async (values: FormValues) => {
    await addDesigner(values);
    onDone();
  };

  return (
    <Stack
      spacing={2}
      component="form"
      role="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        label="Full name"
        {...register("fullName")}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
        fullWidth
      />
      <TextField
        label="Working hours"
        type="number"
        {...register("workingHours")}
        error={!!errors.workingHours}
        helperText={errors.workingHours?.message}
        fullWidth
        inputProps={{ min: 1, max: 24 }}
      />

      <Stack direction="row" justifyContent="flex-end" gap={1}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          aria-label="Save designer"
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
}
