import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import { useAuth } from 'src/app/auth/AuthRouteProvider';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter a email address'),
});
const defaultValues = {
	email: '',
	remember: true
};

function jwtSignInTab() {
	const { axiosService } = useAuth();
	const { control, formState, handleSubmit, setValue, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	useEffect(() => {
		setValue('email', '', { shouldDirty: true, shouldValidate: false });
	}, [setValue]);

	function onSubmit(formData) {
		const { email } = formData;
		axiosService
			.signIn({
				email
			})
			.catch((error) => {
				const errorData = error.response.data;
				errorData.forEach((err) => {
					setError(err.type, {
						type: 'manual',
						message: err.message
					});
				});
			});
	}

	return (
		<div className="w-full">
			<form
				name="loginForm"
				noValidate
				className="mt-32 flex w-full flex-col justify-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="Email address"
							autoFocus
							type="text"
							error={!!errors.email}
							helperText={errors?.email?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Button
					variant="contained"
					color="secondary"
					className=" mt-16 w-full"
					aria-label="Sign in"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					type="submit"
					size="large"
				>
					Sign in
				</Button>
			</form>
		</div>
	);
}

export default jwtSignInTab;
