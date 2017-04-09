import Layout from '../../component/menu/Layout';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps)(withRouter(Layout));
