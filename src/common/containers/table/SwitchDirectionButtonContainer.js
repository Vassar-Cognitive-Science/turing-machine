import { connect } from 'react-redux'
import SwitchDirectionButton from '../../components/table/SwitchDirectionButton'
import { switchRowDirectionAction } from '../../actions/tableActions'

const switchDirection = (dispatch, ownProps, value) => {
  dispatch(switchRowDirectionAction(ownProps.parent, value))
}

const mapStateToProps = (state, ownProps) => {
  return {
    value: state[ownProps.parent].isLeft
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  switchDirection: (value) => { switchDirection(dispatch, ownProps, value) }
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchDirectionButton)
