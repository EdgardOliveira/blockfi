import {
  Button,
  createStyles,
  IconButton,
  makeStyles,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import { Add, AddCircle, AddCircleOutline, Delete, DeleteForever, Edit, Wifi, WifiOff } from '@material-ui/icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LayoutWithMenu from '../../components/layout/LayoutWithMenu/LayoutWithMenu';
import ConfirmationDialog from '../../components/screen/ConfirmationDialog/ConfirmationDialog';
import { NextPageContext } from 'next';
import { excluirDados, getCookies } from '../../lib/RESTClient';
import { Usuario } from '../../lib/Usuario';
import fetch from 'isomorphic-unfetch';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    table: {
      marginTop: theme.spacing(3),
    },
  }),
);

export default function ListaUsuario({usuarios} : any) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);

  const [deleteOptions, setDeleteOptions] = useState<{
    show: boolean;
    itemId?: number;
    itemDescription?: string;
  }>({ show: false });

  const [messageInfo, setMessageInfo] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: '' });

  async function excluir(id:number){
    try {
      const resposta = await excluirDados('/api/usuarios', id)

      if (resposta.sucesso === true) {
        // handleResponse('success', `Usuario: ${resposta.usuario[0].nome} cadastrado(a) com sucesso!`);
        // await Router.push('/usuarios');
      } else {
        // handleResponse('error', 'Mensagem: ' + resposta.mensagem + '\nErro: ' + resposta.erro);
      }
    } catch (e) {
      throw Error(e.message)
    }
  }

  const handleDelete = (item: any) => {
    setDeleteOptions({
      show: true,
      itemId: item.id,
      itemDescription: item.name,
    });
  };

  const handleDeleteCallBack = (value: string) => {
    const { itemId } = deleteOptions;
    setDeleteOptions({ show: false, itemId: null, itemDescription: null });

    if (value === 'ok') {
      excluir(itemId);
      setMessageInfo({ show: true, message: 'Registro excluído com sucesso' });
    }
  };

  const handleCloseMessage = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setMessageInfo({ show: false, message: '' });
  };

  useEffect(() => {
    if (usuarios) {
      setRows(usuarios);
    } else {
      [];
    }
  }, []);

  return (
    <LayoutWithMenu>
      <div className={classes.toolbar}>
        <div>
          <Typography component='h1' variant='h4'>
            Lista de usuários
          </Typography>
        </div>
        <div>
          <Link href='/usuarios/cadastrar' passHref>
            <Button variant='contained' color='primary'>
              <IconButton aria-label='allowed'><AddCircleOutline /></IconButton>
              Cadastrar
            </Button>
          </Link>
        </div>
      </div>

      <TableContainer component={Paper} className={classes.table}>
        <Table aria-label='Testes'>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Sobrenome</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Grupo</TableCell>
              <TableCell width='150' align='center'>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell component='th' scope='row'>
                  {row.id}
                </TableCell>
                <TableCell>{row.nome}</TableCell>
                <TableCell>{row.sobrenome}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.grupo_id}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label='excluir'
                    onClick={() => handleDelete(row)}
                  >
                    <DeleteForever />
                  </IconButton>
                  <Link href={`/usuarios/editar/${row.id}`} passHref>
                    <IconButton aria-label='edit'>
                      <Edit />
                    </IconButton>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmationDialog
        id={`delete-${deleteOptions.itemId}`}
        title='Excluir'
        confirmButtonText='Excluir'
        keepMounted
        open={deleteOptions.show}
        onClose={handleDeleteCallBack}
      >
        Confirma a exclusão do item{' '}
        <strong>{deleteOptions.itemDescription}</strong>
      </ConfirmationDialog>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        open={messageInfo.show}
        message={messageInfo.message}
        key={messageInfo.message}
        onClose={handleCloseMessage}
      />
    </LayoutWithMenu>
  );
}

ListaUsuario.getInitialProps = async (ctx: NextPageContext) => {

  let url;
  if(!process.env.BASE_URL)
    url = '/api/usuarios';
  else
    url = `${process.env.BASE_URL}/api/usuarios`;

  const res = await getCookies(url, ctx);
  const json:Usuario[] = res.usuarios;

  return {
    usuarios: json
  };
}