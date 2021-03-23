import Typography from '@material-ui/core/Typography';
import LayoutWithMenu from '../components/layout/LayoutWithMenu/LayoutWithMenu';
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 400,
    },
    media: {
      height: 0,
      paddingTop: '100%',//'56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: '#7bed8d',
    },
  }),
);

export default function Home() {

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <LayoutWithMenu>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="projeto" className={classes.avatar}>
              B
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="Descrição do projeto"
          subheader="27 de Março de 2021"
        />
        <CardMedia
          className={classes.media}
          image="/logotipo.svg"
          title="Logotipo"
        />

        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            Podemos te ajudar a gerenciar as redes wifi que os dispositivos corporativos devem ter acesso.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>
              BlockFi é um aplicativo que controla as redes de wi-fi detectadas, sendo capaz de bloquear ou permitir o acesso as memas.
              Seu foco é atender a área corpotativa com o intuito é mitigar os riscos os quais uma empresa está submetida ao empregar
              uma rede wi-fi de maneira displicente.
              Com o aplicativo o proprietário poderá fazer o controle do uso das redes wi-fi detectadas, permitindo o acesso de
              determinadas redes wi-fi para cada setor ou funcionário como também podendo bloqueá-las para a sua segurança.
              Garantimos a confiabilidade e segunça desse projeto a medida que o mesmo parte de uma customização no AOSP.
              Onde a classe WifiManager foi modificada e o método gatScanResults foi alterado e utilizamos a API SystemProperties para
              persistir os dados relacionados as redes que serão permitidas ao usuário.
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </LayoutWithMenu>
  );
}
