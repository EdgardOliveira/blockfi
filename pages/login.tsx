import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import LockIcon from '@material-ui/icons/Lock';
import MailIcon from '@material-ui/icons/Mail';
import { useFormik } from 'formik';
import Link from 'next/link';
import * as Yup from 'yup';
import CopyrightComponent from '../components/screen/Copyright/Copyright';
import FormLoadingComponent from '../components/screen/FormLoading/FormLoading';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import Router, { useRouter } from 'next/router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      minHeight: '100vh',
      gap: theme.spacing(5),
      padding: theme.spacing(2),
    },
    sloganTitle: {
      marginBottom: theme.spacing(2),
    },
    form: {
      padding: theme.spacing(4),
      maxWidth: '500px',
    },
    submit: {
      marginTop: theme.spacing(2),
    },
    divider: {
      margin: theme.spacing(4, 0),
    },
  }),
);

interface IFormData {
  email?: string;
  senha?: string;
}

export default function Login() {
  return (
    <SnackbarProvider maxSnack={3}>
      <LoginPage />
    </SnackbarProvider>
  );
}

export function LoginPage() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const classes = useStyles();

  const initialValues: IFormData = {
    email: '',
    senha: '',
  };

  const formSchema = Yup.object().shape({
    email: Yup.string().email('E-mail inválido').required('Este campo é obrigatório'),
    senha: Yup.string().required('Este campo é obrigatório'),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema,
    onSubmit: (values) => {
      setTimeout(() => {
        enviarDados(values);
      }, 3000);
    },
  });

  async function handleResponse(variant: VariantType, mensagem: String) {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(mensagem, { variant });
  }

  async function enviarDados(values) {

    const resp = await fetch('https://blockfi.vercel.app/api/autenticacao/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        senha: values.senha,
      }),
    });

    const resposta = await resp.json();
    console.log('Resposta...\n' + JSON.stringify(resposta));

    formik.setSubmitting(false);

    if (resposta.sucesso === true) {
      handleResponse('success', `Usuário autenticado(a) com sucesso!`);
      console.log('sucesso!');
      await Router.push('/redes');
    } else {
      handleResponse('error', 'Erro: ' + resposta.mensagem);
      console.log('erro!');
    }
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.form} elevation={3}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <TextField
            variant='outlined'
            margin='normal'
            fullWidth
            id='email'
            label='E-mail'
            placeholder='Insira seu e-mail'
            name='email'
            autoComplete='email'
            autoFocus
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <MailIcon />
                </InputAdornment>
              ),
            }}
            onChange={formik.handleChange}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            variant='outlined'
            margin='normal'
            fullWidth
            name='senha'
            label='Senha'
            placeholder='Insira a sua senha'
            type='password'
            id='senha'
            required
            autoComplete='senha'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            onChange={formik.handleChange}
            value={formik.values.senha}
            error={formik.touched.senha && Boolean(formik.errors.senha)}
            helperText={formik.touched.senha && formik.errors.senha}
          />
          <Button
            className={classes.submit}
            type='submit'
            size='large'
            fullWidth
            variant='contained'
            color='primary'
            disabled={formik.isSubmitting}
          >
            Entrar
          </Button>
          {formik.isSubmitting && <FormLoadingComponent />}
        </form>

        <Divider className={classes.divider} variant='fullWidth' />

        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Link href='/recuperar' passHref>
              <Button variant='text' fullWidth={true}>
                Esqueceu a senha?
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Link href='/registro' passHref>
              <Button variant='text' fullWidth={true}>
                Criar uma conta
              </Button>
            </Link>
          </Grid>
        </Grid>
        <CopyrightComponent />
      </Paper>
    </div>
  );
}
