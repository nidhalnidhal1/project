/* eslint-disable react/prop-types */
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography
        variant="h1"
        fontWeight="bold"
        color={colors.gray[100]}
        mb="5px"
      >
        {title}
      </Typography>
      <Typography variant="h4" color="#3c55e2"> {/* Corrected color syntax */}
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;