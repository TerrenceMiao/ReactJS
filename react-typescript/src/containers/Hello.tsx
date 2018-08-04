import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as actions from '../actions/';
import Hello, { IProps } from '../components/Hello';
import { IStoreState } from '../types/index';

export function mapStateToProps({ enthusiasmLevel, languageName }: IStoreState) {
    return {
        enthusiasmLevel,
        name: languageName,
    }
}
  
export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
    return {
        onDecrement: () => dispatch(actions.decrementEnthusiasm()),
        onIncrement: () => dispatch(actions.incrementEnthusiasm()),
    }
}

// when component "Hello" written in function
// export default connect(mapStateToProps, mapDispatchToProps)(Hello);

// when component "Hello" written in class
export default connect<IProps>(mapStateToProps, mapDispatchToProps)(Hello);