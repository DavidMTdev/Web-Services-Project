import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// material-ui
import { ButtonBase } from '@mui/material'
import SvgIcon from '@mui/material/SvgIcon'

// project import
import { ReactComponent as Logo } from '../assets/react.svg'

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ sx, to }) => (
    <ButtonBase disableRipple component={Link} to={!to ? '/' : to} sx={sx}>
        <Logo />
    </ButtonBase>
)

LogoSection.propTypes = {
    sx: PropTypes.object,
    to: PropTypes.string
}

export default LogoSection