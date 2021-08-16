import { extendTheme, ThemeOverride } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const baseBreakpoints = {
    xs: '350px',
    sm: '450px',
    md: '580px',
    lg: '650px',
    xl: '960px',
    '2xl': '1200px'
};

const breakpoints = createBreakpoints(baseBreakpoints);

const overrides: ThemeOverride = {
    breakpoints
};

export default extendTheme(overrides);
