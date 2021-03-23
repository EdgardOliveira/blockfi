import Typography from '@material-ui/core/Typography';
import LayoutWithMenu from '../components/layout/LayoutWithMenu/LayoutWithMenu';

export default function Home() {
  return (
    <LayoutWithMenu>
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
      <Typography paragraph>
        Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
        ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar elementum
        integer enim neque volutpat ac tincidunt. Ornare suspendisse sed nisi
        lacus sed viverra tellus. Purus sit amet volutpat consequat mauris.
        Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
        vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra
        accumsan in. In hendrerit gravida rutrum quisque non tellus orci ac.
        Pellentesque nec nam aliquam sem et tortor. Habitant morbi tristique
        senectus et. Adipiscing elit duis tristique sollicitudin nibh sit.
        Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra
        maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin
        aliquam ultrices sagittis orci a.
      </Typography>
    </LayoutWithMenu>
  );
}
