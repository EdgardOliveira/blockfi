import {
  Button,
  Container,
  createStyles,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
  Theme,
  Typography,
  FormControl,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useFormik } from 'formik';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import LayoutWithMenu from '../../layout/LayoutWithMenu/LayoutWithMenu';
import FormLoadingComponent from '../../screen/FormLoading/FormLoading';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import { atualizarDados, obterDadosId, postarDados } from '../../../lib/RESTClient';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      display: 'flex',
      alignItems: 'center',
    },
    form: {
      marginTop: theme.spacing(3),
      padding: theme.spacing(3),
    },
    submit: {
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(0),
      marginTop: theme.spacing(2),
      minWidth: 100,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

interface IFormData {
  id?: number
  nome?: string
  ssid?: string
  status?: string
}

export default function Redes() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Rede />
    </SnackbarProvider>
  );
}

export function Rede() {
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState('Cadastrar');

  const initialValues: IFormData = {
    id: -1,
    nome: '',
    ssid: '',
    status: '',
  };

  async function handleResponse(variant: VariantType, mensagem: String) {
    enqueueSnackbar(mensagem, { variant });
  }

  const formSchema = Yup.object().shape({
    nome: Yup.string()
      .required('Campo obrigatório')
      .min(5, 'O nome deve ter pelo menos 5 caracteres'),
    ssid: Yup.string()
      .required('Campo obrigatório')
      .min(5, 'O SSID deve ter pelo menos 5 caracteres'),
    status: Yup.string()
      .required('Campo obrigatório'),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema,
    onSubmit: (values) => {
      setTimeout(() => {
        if(id){
          atualizar(values)
        }else{
          postar(values);
        }
      }, 3000);
    },
  });

  async function atualizar(values){
    try {
      const resposta = await atualizarDados('/api/redes', values);
      console.log('Resposta...\n' + await JSON.stringify(resposta));

      formik.setSubmitting(false);

      if (resposta.sucesso === true) {
        handleResponse('success', `Rede: ${resposta.rede[0].nome} cadastrado(a) com sucesso!`);
        console.log('sucesso!');
        Router.push('/redes');
      } else {
        handleResponse('error', 'Mensagem: ' + resposta.mensagem + '\nErro: ' + resposta.erro);
        console.log('erro!');
      }
    } catch (e) {
      throw Error(e.message)
    }
  }

  async function postar(values) {
    const resposta = await postarDados('/api/redes', values)
    console.log('Resposta...\n' + await JSON.stringify(resposta));

    formik.setSubmitting(false);

    if (resposta.sucesso === true) {
      handleResponse('success', `Rede: ${resposta.rede[0].nome} cadastrado(a) com sucesso!`);
      console.log('sucesso!');
      Router.push('/redes');
    } else {
      handleResponse('error', 'Mensagem: ' + resposta.mensagem + '\nErro: ' + resposta.erro);
      console.log('erro!');
    }
  }

  async function obter(id: string | string[]) {
    const resposta = await obterDadosId(`/api/redes/${id}`);
    const rede = resposta.rede[0];
    formik.setSubmitting(false);

    if (resposta.sucesso === true) {
      handleResponse('success', `Registro recuperado com sucesso!`);
      formik.setValues({
        id: rede.id,
        ssid: rede.ssid,
        nome: rede.nome,
        status: rede.status,
      });
      console.log('sucesso!');
    } else {
      handleResponse('error', 'Erro: ' + resposta.mensagem);
      console.log('erro!');
    }
  }

  useEffect(() => {
    if (id) {
      setTitle(`Editar`);
      obter(id);
    }
  }, [id]);

  return (
    <LayoutWithMenu>
      <Container>
        <div className={classes.toolbar}>
          <Link href='/redes' passHref>
            <IconButton aria-label='Voltar'>
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Typography component='h1' variant='h4'>
            {title}
          </Typography>
        </div>

        <Paper className={classes.form} elevation={3}>
          <form noValidate onSubmit={formik.handleSubmit}>
            <TextField
              variant='outlined'
              margin='normal'
              fullWidth
              id='ssid'
              label='SSID'
              placeholder='Insira o SSID da rede aqui'
              name='ssid'
              required
              autoComplete='ssid'
              autoFocus
              onChange={formik.handleChange}
              value={formik.values.ssid}
              error={formik.touched.ssid && Boolean(formik.errors.ssid)}
              helperText={formik.touched.ssid && formik.errors.ssid}
            />
            <TextField
              variant='outlined'
              margin='normal'
              fullWidth
              id='nome'
              label='Nome'
              required
              placeholder='Insira o nome da rede aqui'
              name='nome'
              autoComplete='nome'
              onChange={formik.handleChange}
              value={formik.values.nome}
              error={formik.touched.nome && Boolean(formik.errors.nome)}
              helperText={formik.touched.nome && formik.errors.nome}
            />
            {/*<FormControl variant='outlined' className={classes.formControl}>*/}
            <InputLabel htmlFor='outlined-age-native-simple'>Status</InputLabel>
            <Select
              native
              variant='outlined'
              fullWidth
              value={formik.values.status}
              onChange={formik.handleChange}
              error={formik.touched.status && Boolean(formik.errors.status)}
              label='Status'
              inputProps={{
                name: 'status',
                id: 'outlined-age-native-simple',
              }}
            >
              <option aria-label='None' value='' />
              <option value={'Permitido'}>Permitido</option>
              <option value={'Bloqueado'}>Bloqueado</option>
            </Select>
            {/*</FormControl>*/}

            <Button
              className={classes.submit}
              type='submit'
              size='large'
              variant='contained'
              color='primary'
              disabled={formik.isSubmitting}
            >
              Salvar
            </Button>
            {formik.isSubmitting && <FormLoadingComponent />}
          </form>
        </Paper>
      </Container>
    </LayoutWithMenu>
  );
}

