// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import { CircularProgress } from '@mui/material'

const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
                 <Box display="flex" justifyContent="center" alignItems="center" height="100px">
            <CircularProgress />
          </Box>
    </Box>
  )
}

export default FallbackSpinner
