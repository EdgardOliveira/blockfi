import { Box, Link, Typography } from '@material-ui/core';

export default function CopyrightComponent() {
  return (
    <Box mt={5}>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://blockfi.vercel.app/" target="_blank">
          BlockFi
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Box>
  );
}
