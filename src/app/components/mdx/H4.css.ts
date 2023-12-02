import { style } from '@vanilla-extract/css'
import { fontSizeVars, spaceVars } from '../../styles/vars.css.js'
import { root as H3 } from './H3.css.js'

export const root = style({
  fontSize: fontSizeVars.h4,
  selectors: {
    '&:not(:first-child)': {
      marginTop: spaceVars['18'],
    },
    '&&:not(:last-child)': {
      marginBottom: spaceVars['16'],
    },
    [`${H3}+&`]: {
      paddingTop: spaceVars['0'],
    },
  },
})
